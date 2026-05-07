// hooks/useExperiments.ts
// Manages fetching, saving, and deleting experiments.
// Updated: real backend calls, dashboard stats, getExperimentById added.

import { useState, useEffect, useCallback } from "react";
import {
  getExperiments,
  saveExperiment,
  deleteExperiment,
  getDashboardStats,
  getRecentExperiments,
} from "@/services/api";
import type {
  Experiment,
  SaveExperimentPayload,
} from "@/types";

interface UseExperimentsReturn {
  experiments: Experiment[];
  isLoading: boolean;
  isSaving: boolean;
  error: string | null;
  saveError: string | null;
  fetchExperiments: () => Promise<void>;
  handleSave: (payload: SaveExperimentPayload) => Promise<Experiment | null>;
  handleDelete: (id: string) => Promise<void>;
  clearError: () => void;
}

export function useExperiments(): UseExperimentsReturn {
  const [experiments, setExperiments] = useState<Experiment[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);

  // ─── Fetch ────────────────────────────────────────────────────────────────

  const fetchExperiments = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    const response = await getExperiments();

    if (!response.success || !response.data) {
      setError(response.error ?? "Failed to load experiments.");
    } else {
      // Sort by newest first (backend already does this, but ensure it)
      const sorted = [...response.data].sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      setExperiments(sorted);
    }

    setIsLoading(false);
  }, []);

  // Auto-fetch on mount
  useEffect(() => {
    const frameId = window.requestAnimationFrame(() => {
      void fetchExperiments();
    });

    return () => {
      window.cancelAnimationFrame(frameId);
    };
  }, [fetchExperiments]);

  // ─── Save ─────────────────────────────────────────────────────────────────

  const handleSave = useCallback(
    async (payload: SaveExperimentPayload): Promise<Experiment | null> => {
      setIsSaving(true);
      setSaveError(null);

      const response = await saveExperiment(payload);

      if (!response.success || !response.data) {
        setSaveError(response.error ?? "Failed to save experiment.");
        setIsSaving(false);
        return null;
      }

      // Optimistically prepend to list
      setExperiments((prev) => [response.data!, ...prev]);
      setIsSaving(false);
      return response.data;
    },
    []
  );

  // ─── Delete ───────────────────────────────────────────────────────────────

  const handleDelete = useCallback(async (id: string) => {
    // Optimistic UI — remove immediately from local state
    setExperiments((prev) => prev.filter((e) => e.id !== id));

    const response = await deleteExperiment(id);

    if (!response.success) {
      // On failure, re-fetch to restore correct state
      setError(response.error ?? "Failed to delete experiment.");
      await getExperiments().then((res) => {
        if (res.success && res.data) setExperiments(res.data);
      });
    }
  }, []);

  // ─── Helpers ──────────────────────────────────────────────────────────────

  const clearError = useCallback(() => {
    setError(null);
    setSaveError(null);
  }, []);

  return {
    experiments,
    isLoading,
    isSaving,
    error,
    saveError,
    fetchExperiments,
    handleSave,
    handleDelete,
    clearError,
  };
}

// ─── Dashboard Hook ───────────────────────────────────────────────────────
// Separate lightweight hook for Dashboard page stats and recent experiments.
// Import this in your Dashboard page component.

interface UseDashboardReturn {
  stats: {
    totalRuns: number;
    modelsUsed: number;
    avgLatencyMs: number;
    totalEvaluations: number;
  } | null;
  recentExperiments: Experiment[];
  isLoading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

export function useDashboard(): UseDashboardReturn {
  const [stats, setStats] = useState<UseDashboardReturn["stats"]>(null);
  const [recentExperiments, setRecentExperiments] = useState<Experiment[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    // Fetch stats and recent experiments in parallel
    const [statsRes, recentRes] = await Promise.all([
      getDashboardStats(),
      getRecentExperiments(),
    ]);

    if (statsRes.success && statsRes.data) {
      setStats(statsRes.data);
    } else {
      setError(statsRes.error ?? "Failed to load dashboard stats.");
    }

    if (recentRes.success && recentRes.data) {
      setRecentExperiments(recentRes.data);
    }

    setIsLoading(false);
  }, []);

  useEffect(() => {
    const frameId = window.requestAnimationFrame(() => {
      void refresh();
    });

    return () => {
      window.cancelAnimationFrame(frameId);
    };
  }, [refresh]);

  return { stats, recentExperiments, isLoading, error, refresh };
}