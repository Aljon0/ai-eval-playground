// lib/utils.ts
// Shared utility/helper functions

import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import type { Model, ModelId, ModelResult } from "@/types";

// ─── Tailwind Class Merging ─────────────────────────────────────────────────

/**
 * Merges Tailwind CSS classes safely, resolving conflicts.
 * Usage: cn("px-4 py-2", isActive && "bg-black")
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

// ─── Model Registry ────────────────────────────────────────────────────────

export const AVAILABLE_MODELS: Model[] = [
  {
    id: "mistral",
    name: "Mistral 7B",
    provider: "Mistral AI",
    description: "Efficient and capable open-weight model",
    color: "#6366f1", // indigo
  },
  {
    id: "groq-llama3",
    name: "LLaMA 3 70B",
    provider: "Groq",
    description: "Meta's flagship open-source LLM via Groq",
    color: "#f59e0b", // amber
  },
  {
    id: "groq-mixtral",
    name: "Mixtral 8x7B",
    provider: "Groq",
    description: "Mixture-of-experts model via Groq",
    color: "#10b981", // emerald
  },
  {
    id: "gemma2",
    name: "Gemma 2 9B",
    provider: "Google",
    description: "Google's lightweight open model",
    color: "#3b82f6", // blue
  },
];

export const MODEL_MAP: Record<ModelId, Model> = Object.fromEntries(
  AVAILABLE_MODELS.map((m) => [m.id, m])
) as Record<ModelId, Model>;

// ─── Formatting Helpers ────────────────────────────────────────────────────

/** Format milliseconds into a readable latency string */
export function formatLatency(ms: number): string {
  if (ms < 1000) return `${ms}ms`;
  return `${(ms / 1000).toFixed(2)}s`;
}

/** Format a UTC ISO string into a human-readable date */
export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/** Generate a short unique ID for experiments/runs */
export function generateId(): string {
  return Math.random().toString(36).slice(2, 10);
}

/** Truncate long text with ellipsis */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trimEnd() + "…";
}

// ─── Evaluation Helpers ────────────────────────────────────────────────────

/** Find the fastest result among all model results */
export function getFastestModel(results: ModelResult[]): ModelId | null {
  const successful = results.filter((r) => r.status === "success");
  if (!successful.length) return null;
  return successful.reduce((a, b) => (a.latencyMs < b.latencyMs ? a : b))
    .modelId;
}

/** Calculate the average latency across successful results */
export function getAverageLatency(results: ModelResult[]): number {
  const successful = results.filter((r) => r.status === "success");
  if (!successful.length) return 0;
  const total = successful.reduce((sum, r) => sum + r.latencyMs, 0);
  return Math.round(total / successful.length);
}

/** Get the highest-rated result */
export function getTopRatedModel(results: ModelResult[]): ModelId | null {
  const rated = results.filter((r) => r.rating !== undefined);
  if (!rated.length) return null;
  return rated.reduce((a, b) => ((a.rating ?? 0) > (b.rating ?? 0) ? a : b))
    .modelId;
}