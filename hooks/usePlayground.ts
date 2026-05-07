// hooks/usePlayground.ts
// Core state and logic for the Playground evaluation feature.
// Updated: rating now persists to backend when an experimentId is present.

import { useState, useCallback } from "react";
import { runEvaluation, rateResponse } from "@/services/api";
import { MODEL_MAP } from "@/lib/utils";
import type { ModelId, ModelResult, PlaygroundState } from "@/types";

interface UsePlaygroundReturn extends PlaygroundState {
  setPrompt: (prompt: string) => void;
  toggleModel: (modelId: ModelId) => void;
  setViewMode: (mode: "cards" | "comparison") => void;
  handleRun: () => Promise<void>;
  updateRating: (modelId: ModelId, rating: number, experimentId?: string) => void;
  reset: () => void;
  error: string | null;
}

const INITIAL_STATE: PlaygroundState = {
  prompt: "",
  selectedModels: ["mistral", "groq-llama3"], // default selection
  results: [],
  isRunning: false,
  hasRun: false,
  viewMode: "cards",
};

export function usePlayground(): UsePlaygroundReturn {
  const [state, setState] = useState<PlaygroundState>(INITIAL_STATE);
  const [error, setError] = useState<string | null>(null);

  // ─── Prompt ──────────────────────────────────────────────────────────────

  const setPrompt = useCallback((prompt: string) => {
    setState((prev) => ({ ...prev, prompt }));
  }, []);

  // ─── Model Selection ─────────────────────────────────────────────────────

  const toggleModel = useCallback((modelId: ModelId) => {
    setState((prev) => {
      const isSelected = prev.selectedModels.includes(modelId);

      // Prevent deselecting if only one model is selected
      if (isSelected && prev.selectedModels.length === 1) return prev;

      const selectedModels = isSelected
        ? prev.selectedModels.filter((id) => id !== modelId)
        : [...prev.selectedModels, modelId];

      return { ...prev, selectedModels };
    });
  }, []);

  // ─── View Mode ───────────────────────────────────────────────────────────

  const setViewMode = useCallback((viewMode: "cards" | "comparison") => {
    setState((prev) => ({ ...prev, viewMode }));
  }, []);

  // ─── Run Evaluation ──────────────────────────────────────────────────────

  const handleRun = useCallback(async () => {
    const { prompt, selectedModels } = state;

    // Guard: require prompt and at least one model
    if (!prompt.trim()) {
      setError("Please enter a prompt before running.");
      return;
    }
    if (selectedModels.length === 0) {
      setError("Please select at least one model.");
      return;
    }

    setError(null);

    // Set all selected models to loading state immediately
    const loadingResults: ModelResult[] = selectedModels.map((modelId) => ({
      modelId,
      modelName: MODEL_MAP[modelId].name,
      response: "",
      latencyMs: 0,
      tokenUsage: { prompt: 0, completion: 0, total: 0 },
      status: "loading",
    }));

    setState((prev) => ({
      ...prev,
      isRunning: true,
      hasRun: true,
      results: loadingResults,
    }));

    // Call the API service
    const response = await runEvaluation({ prompt, models: selectedModels });

    if (!response.success || !response.data) {
      // Mark all as error
      setState((prev) => ({
        ...prev,
        isRunning: false,
        results: prev.results.map((r) => ({
          ...r,
          status: "error",
          error: response.error ?? "Unknown error",
        })),
      }));
      setError(response.error ?? "Evaluation failed. Please try again.");
      return;
    }

    // Update with real results, preserving any existing ratings
    setState((prev) => ({
      ...prev,
      isRunning: false,
      results: response.data!.map((result) => ({
        ...result,
        rating: prev.results.find((r) => r.modelId === result.modelId)?.rating,
      })),
    }));
  }, [state]);

  // ─── Rating ──────────────────────────────────────────────────────────────
  // Updates rating locally always.
  // If an experimentId is provided, also persists to backend.

  const updateRating = useCallback(
    (modelId: ModelId, rating: number, experimentId?: string) => {
      // Update local state immediately (optimistic)
      setState((prev) => ({
        ...prev,
        results: prev.results.map((r) =>
          r.modelId === modelId ? { ...r, rating } : r
        ),
      }));

      // Persist to backend if we have an experiment context
      if (experimentId) {
        rateResponse({ experimentId, modelId, score: rating }).catch((err) => {
          console.error("[usePlayground] Failed to persist rating:", err);
        });
      }
    },
    []
  );

  // ─── Reset ───────────────────────────────────────────────────────────────

  const reset = useCallback(() => {
    setState(INITIAL_STATE);
    setError(null);
  }, []);

  return {
    ...state,
    setPrompt,
    toggleModel,
    setViewMode,
    handleRun,
    updateRating,
    reset,
    error,
  };
}