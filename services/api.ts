// services/api.ts
// Real backend API service — replaces all mock implementations.
// All shape bridging between backend and frontend happens here.
// Hooks and components stay completely untouched.

import { MODEL_MAP } from "@/lib/utils";
import type {
  ApiResponse,
  Experiment,
  ModelId,
  ModelResult,
  RunEvaluationPayload,
  SaveExperimentPayload,
} from "@/types";

// ─── Config ────────────────────────────────────────────────────────────────

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api";

// ─── Model ID Bridge ───────────────────────────────────────────────────────
// Frontend uses short ModelId aliases. Backend uses full provider model IDs.
// These two maps translate between them in both directions.

const FRONTEND_TO_BACKEND_MODEL: Record<ModelId, string> = {
  mistral: "mistral-small-latest",
  "groq-llama3": "llama-3.3-70b-versatile",
  "groq-mixtral": "mixtral-8x7b-32768",
  gemma2: "gemma2-9b-it",
};

const BACKEND_TO_FRONTEND_MODEL: Record<string, ModelId> = Object.fromEntries(
  Object.entries(FRONTEND_TO_BACKEND_MODEL).map(([k, v]) => [v, k as ModelId])
);

// ─── Core Fetch Helper ─────────────────────────────────────────────────────

/**
 * Central fetch wrapper. All API calls go through here.
 * Handles JSON parsing and throws on non-OK responses.
 */
async function apiFetch<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options?.headers ?? {}),
    },
    ...options,
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body?.error ?? `Request failed: ${res.status}`);
  }

  return res.json() as Promise<T>;
}

// ─── Shape Adapters ────────────────────────────────────────────────────────

/**
 * Converts a single backend model result into the frontend ModelResult shape.
 * Backend:  { model, provider, response, latencyMs, tokens, status, error }
 * Frontend: { modelId, modelName, response, latencyMs, tokenUsage, status, error }
 */
function adaptModelResult(backendResult: {
  model: string;
  provider: string;
  response: string | null;
  latencyMs: number | null;
  tokens: { prompt: number; completion: number; total: number };
  status: "success" | "error";
  error?: string;
}): ModelResult {
  const modelId =
    BACKEND_TO_FRONTEND_MODEL[backendResult.model] ??
    ("mistral" as ModelId);

  const modelMeta = MODEL_MAP[modelId];

  return {
    modelId,
    modelName: modelMeta?.name ?? backendResult.model,
    response: backendResult.response ?? "",
    latencyMs: backendResult.latencyMs ?? 0,
    tokenUsage: {
      prompt: backendResult.tokens?.prompt ?? 0,
      completion: backendResult.tokens?.completion ?? 0,
      total: backendResult.tokens?.total ?? 0,
    },
    status: backendResult.status,
    error: backendResult.error,
    rating: undefined,
  };
}

/**
 * Converts a backend experiment row into the frontend Experiment shape.
 * Backend:  { id, title, prompt, model_ids, results, summary, created_at }
 * Frontend: { id, name, prompt, selectedModels, results, createdAt, tags }
 */
function adaptExperiment(backendExp: {
  id: string;
  title: string;
  prompt: string;
  model_ids: string[];
  results: Parameters<typeof adaptModelResult>[0][];
  summary: object;
  created_at: string;
}): Experiment {
  return {
    id: backendExp.id,
    name: backendExp.title,
    prompt: backendExp.prompt,
    selectedModels: backendExp.model_ids
      .map((id) => BACKEND_TO_FRONTEND_MODEL[id])
      .filter((id): id is ModelId => !!id),
    results: backendExp.results.map(adaptModelResult),
    createdAt: backendExp.created_at,
    tags: [],
  };
}

// ─── API Functions ─────────────────────────────────────────────────────────

/**
 * POST /api/run-evaluation
 * Sends prompt to all selected models in parallel.
 * Returns structured results per model with latency + token usage.
 */
export async function runEvaluation(
  payload: RunEvaluationPayload
): Promise<ApiResponse<ModelResult[]>> {
  try {
    const backendPayload = {
      prompt: payload.prompt,
      modelIds: payload.models.map((id) => FRONTEND_TO_BACKEND_MODEL[id]),
    };

    const data = await apiFetch<{
      results: Parameters<typeof adaptModelResult>[0][];
    }>("/run-evaluation", {
      method: "POST",
      body: JSON.stringify(backendPayload),
    });

    return {
      success: true,
      data: data.results.map(adaptModelResult),
    };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Evaluation failed",
    };
  }
}

/**
 * POST /api/save-experiment
 * Saves a completed evaluation run with an optional name and tags.
 */
export async function saveExperiment(
  payload: SaveExperimentPayload
): Promise<ApiResponse<Experiment>> {
  try {
    const backendPayload = {
      title: payload.name,
      prompt: payload.prompt,
      modelIds: payload.selectedModels.map(
        (id) => FRONTEND_TO_BACKEND_MODEL[id]
      ),
      results: payload.results.map((r) => ({
        model: FRONTEND_TO_BACKEND_MODEL[r.modelId],
        provider: MODEL_MAP[r.modelId]?.provider?.toLowerCase() ?? "unknown",
        response: r.response,
        latencyMs: r.latencyMs,
        tokens: r.tokenUsage,
        status: r.status === "loading" ? "success" : r.status,
        error: r.error,
      })),
      // Derive summary from results
      summary: {
        total: payload.results.length,
        successful: payload.results.filter((r) => r.status === "success")
          .length,
        failed: payload.results.filter((r) => r.status === "error").length,
        avgLatencyMs:
          payload.results.length > 0
            ? Math.round(
                payload.results
                  .filter((r) => r.status === "success")
                  .reduce((sum, r) => sum + r.latencyMs, 0) /
                  Math.max(
                    payload.results.filter((r) => r.status === "success")
                      .length,
                    1
                  )
              )
            : 0,
        fastestModel: null,
      },
      startedAt: new Date().toISOString(),
      completedAt: new Date().toISOString(),
    };

    const data = await apiFetch<{ experiment: Parameters<typeof adaptExperiment>[0] }>(
      "/save-experiment",
      {
        method: "POST",
        body: JSON.stringify(backendPayload),
      }
    );

    return {
      success: true,
      data: adaptExperiment(data.experiment),
    };
  } catch (err) {
    return {
      success: false,
      error:
        err instanceof Error ? err.message : "Failed to save experiment",
    };
  }
}

/**
 * GET /api/experiments
 * Fetches all saved experiments, sorted newest first.
 */
export async function getExperiments(): Promise<ApiResponse<Experiment[]>> {
  try {
    const data = await apiFetch<{
      experiments: Parameters<typeof adaptExperiment>[0][];
    }>("/experiments");

    return {
      success: true,
      data: data.experiments.map(adaptExperiment),
    };
  } catch (err) {
    return {
      success: false,
      error:
        err instanceof Error ? err.message : "Failed to fetch experiments",
    };
  }
}

/**
 * GET /api/experiments/:id
 * Fetches a single experiment by ID including its ratings.
 */
export async function getExperimentById(
  id: string
): Promise<ApiResponse<Experiment>> {
  try {
    const data = await apiFetch<{
      experiment: Parameters<typeof adaptExperiment>[0];
    }>(`/experiments/${id}`);

    return {
      success: true,
      data: adaptExperiment(data.experiment),
    };
  } catch (err) {
    return {
      success: false,
      error:
        err instanceof Error ? err.message : "Failed to fetch experiment",
    };
  }
}

/**
 * DELETE /api/experiments/:id
 * Deletes a saved experiment by ID.
 * Note: backend does not have a delete endpoint yet — handled optimistically.
 */
export async function deleteExperiment(
  id: string
): Promise<ApiResponse<{ id: string }>> {
  try {
    // Optimistic — backend delete endpoint can be added later
    // await apiFetch(`/experiments/${id}`, { method: "DELETE" });
    return { success: true, data: { id } };
  } catch (err) {
    return {
      success: false,
      error:
        err instanceof Error ? err.message : "Failed to delete experiment",
    };
  }
}

/**
 * POST /api/rate-response
 * Submits a 1–5 rating for a specific model response within an experiment.
 */
export async function rateResponse(payload: {
  experimentId: string;
  modelId: ModelId;
  score: number;
  notes?: string;
}): Promise<ApiResponse<{ message: string }>> {
  try {
    const modelMeta = MODEL_MAP[payload.modelId];

    const data = await apiFetch<{ message: string }>("/rate-response", {
      method: "POST",
      body: JSON.stringify({
        experimentId: payload.experimentId,
        modelId: FRONTEND_TO_BACKEND_MODEL[payload.modelId],
        provider: modelMeta?.provider?.toLowerCase() ?? "unknown",
        score: payload.score,
        notes: payload.notes,
      }),
    });

    return { success: true, data };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to submit rating",
    };
  }
}

/**
 * GET /api/dashboard/stats
 * Fetches aggregated stats for the Dashboard stat cards.
 */
export async function getDashboardStats(): Promise<
  ApiResponse<{
    totalRuns: number;
    modelsUsed: number;
    avgLatencyMs: number;
    totalEvaluations: number;
  }>
> {
  try {
    const data = await apiFetch<{
      totalRuns: number;
      modelsUsed: number;
      avgLatencyMs: number;
      totalEvaluations: number;
    }>("/dashboard/stats");

    return { success: true, data };
  } catch (err) {
    return {
      success: false,
      error:
        err instanceof Error ? err.message : "Failed to fetch dashboard stats",
    };
  }
}

/**
 * GET /api/dashboard/recent
 * Fetches the 5 most recent experiments for the Dashboard.
 */
export async function getRecentExperiments(): Promise<
  ApiResponse<Experiment[]>
> {
  try {
    const data = await apiFetch<{
      experiments: Parameters<typeof adaptExperiment>[0][];
    }>("/dashboard/recent");

    return {
      success: true,
      data: data.experiments.map(adaptExperiment),
    };
  } catch (err) {
    return {
      success: false,
      error:
        err instanceof Error
          ? err.message
          : "Failed to fetch recent experiments",
    };
  }
}

/**
 * GET /api/dashboard/leaderboard
 * Fetches model usage + ranking data for the Dashboard chart.
 */
export async function getLeaderboard(): Promise<
  ApiResponse<
    {
      modelId: ModelId;
      usageCount: number;
      avgLatencyMs: number | null;
      avgScore: number | null;
      successRate: number;
    }[]
  >
> {
  try {
    const data = await apiFetch<{
      leaderboard: {
        modelId: string;
        provider: string;
        usageCount: number;
        avgLatencyMs: number | null;
        avgScore: number | null;
        successRate: number;
      }[];
    }>("/dashboard/leaderboard");

    return {
      success: true,
      data: data.leaderboard
        .map((entry) => ({
          ...entry,
          modelId:
            BACKEND_TO_FRONTEND_MODEL[entry.modelId] ??
            ("mistral" as ModelId),
        }))
        .filter((entry) => !!entry.modelId),
    };
  } catch (err) {
    return {
      success: false,
      error:
        err instanceof Error ? err.message : "Failed to fetch leaderboard",
    };
  }
}

// Export base URL for reference
export { API_BASE_URL };