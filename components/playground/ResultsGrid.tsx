// components/playground/ResultsGrid.tsx
// Responsive grid of ResultCards with summary header

"use client";

import { cn, getFastestModel, getAverageLatency } from "@/lib/utils";
import { formatLatency } from "@/lib/utils";
import { ResultCard } from "./ResultCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { FlaskConical } from "lucide-react";
import type { ModelResult, ModelId } from "@/types";

// ─── Props ─────────────────────────────────────────────────────────────────

interface ResultsGridProps {
  results: ModelResult[];
  onRate: (modelId: ModelId, rating: number) => void;
  className?: string;
}

// ─── Summary bar ───────────────────────────────────────────────────────────

interface SummaryBarProps {
  results: ModelResult[];
}

function SummaryBar({ results }: SummaryBarProps) {
  const successResults = results.filter((r) => r.status === "success");
  const fastestId = getFastestModel(results);
  const avgLatency = getAverageLatency(results);

  if (!successResults.length) return null;

  const fastestModel = successResults.find((r) => r.modelId === fastestId);
  const totalTokens = successResults.reduce(
    (sum, r) => sum + r.tokenUsage.total,
    0
  );

  return (
    <div
      className="flex flex-wrap items-center gap-x-6 gap-y-2
                  px-4 py-3 rounded-xl bg-gray-50 border border-gray-100
                  text-[12px] text-gray-500"
    >
      {/* Models evaluated */}
      <div className="flex items-center gap-1.5">
        <span className="font-medium text-gray-700">{successResults.length}</span>
        <span>models evaluated</span>
      </div>

      {/* Average latency */}
      {avgLatency > 0 && (
        <div className="flex items-center gap-1.5">
          <span>Avg latency:</span>
          <span className="font-medium text-gray-700">
            {formatLatency(avgLatency)}
          </span>
        </div>
      )}

      {/* Fastest model */}
      {fastestModel && (
        <div className="flex items-center gap-1.5">
          <span>⚡ Fastest:</span>
          <span className="font-medium text-gray-700">
            {fastestModel.modelName}
          </span>
          <span className="text-gray-400">
            ({formatLatency(fastestModel.latencyMs)})
          </span>
        </div>
      )}

      {/* Total tokens */}
      {totalTokens > 0 && (
        <div className="hidden items-center gap-1.5 sm:flex">
          <span>Total tokens:</span>
          <span className="font-medium text-gray-700">
            {totalTokens.toLocaleString()}
          </span>
        </div>
      )}
    </div>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────

export function ResultsGrid({
  results,
  onRate,
  className,
}: ResultsGridProps) {
  const fastestId = getFastestModel(results);

  if (!results.length) {
    return (
      <EmptyState
        icon={FlaskConical}
        title="No results yet"
        description="Configure your prompt and models above, then hit Run Evaluation to see results here."
        size="md"
        className={className}
      />
    );
  }

  return (
    <div className={cn("space-y-4", className)}>

      {/* ── Summary bar ── */}
      <SummaryBar results={results} />

      {/* ── Results grid ── */}
      <div
        className={cn(
          "grid gap-4",
          // Responsive columns based on result count
          results.length === 1
            ? "grid-cols-1"
            : results.length === 2
            ? "grid-cols-1 md:grid-cols-2"
            : results.length === 3
            ? "grid-cols-1 md:grid-cols-2 xl:grid-cols-3"
            : "grid-cols-1 md:grid-cols-2"
        )}
      >
        {results.map((result) => (
          <ResultCard
            key={result.modelId}
            result={result}
            isFastest={result.modelId === fastestId}
            onRate={onRate}
          />
        ))}
      </div>
    </div>
  );
}