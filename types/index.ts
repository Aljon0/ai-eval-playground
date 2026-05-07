  // types/index.ts
  // Shared TypeScript interfaces and types used across the entire application

  // ─── Models ────────────────────────────────────────────────────────────────

  export type ModelId = "mistral" | "groq-llama3" | "groq-mixtral" | "gemma2";

  export interface Model {
    id: ModelId;
    name: string;
    provider: string;
    description: string;
    color: string; // accent color for UI differentiation
  }

  // ─── Evaluation ────────────────────────────────────────────────────────────

  export type EvalStatus = "idle" | "loading" | "success" | "error";

  export interface ModelResult {
    modelId: ModelId;
    modelName: string;
    response: string;
    latencyMs: number;
    tokenUsage: {
      prompt: number;
      completion: number;
      total: number;
    };
    status: EvalStatus;
    error?: string;
    rating?: number; // 1–5 star rating assigned by user
  }

  export interface EvaluationRun {
    id: string;
    prompt: string;
    selectedModels: ModelId[];
    results: ModelResult[];
    createdAt: string;
  }

  // ─── Experiments ───────────────────────────────────────────────────────────

  export interface Experiment {
    id: string;
    name: string;
    prompt: string;
    selectedModels: ModelId[];
    results: ModelResult[];
    createdAt: string;
    tags?: string[];
  }

  // ─── Playground State ──────────────────────────────────────────────────────

  export interface PlaygroundState {
    prompt: string;
    selectedModels: ModelId[];
    results: ModelResult[];
    isRunning: boolean;
    hasRun: boolean;
    viewMode: "cards" | "comparison";
  }

  // ─── Dashboard Stats ───────────────────────────────────────────────────────

  export interface DashboardStats {
    totalRuns: number;
    totalExperiments: number;
    modelsUsed: number;
    avgLatencyMs: number;
  }

  // ─── API ───────────────────────────────────────────────────────────────────

  export interface RunEvaluationPayload {
    prompt: string;
    models: ModelId[];
  }

  export interface SaveExperimentPayload {
    name: string;
    prompt: string;
    selectedModels: ModelId[];
    results: ModelResult[];
    tags?: string[];
  }

  export interface ApiResponse<T> {
    data?: T;
    error?: string;
    success: boolean;
  }