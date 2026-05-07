// components/playground/ComparisonView.tsx
// Side-by-side comparison of model outputs with difference highlighting

"use client";

import { useState } from "react";
import { cn, formatLatency, MODEL_MAP, getFastestModel } from "@/lib/utils";
import { ModelDot, StatusBadge } from "@/components/ui/Badge";
import { RatingComponent } from "./RatingComponent";
import { Clock, Hash, ChevronLeft, ChevronRight } from "lucide-react";
import { EmptyState } from "@/components/ui/EmptyState";
import { Rows2 } from "lucide-react";
import type { ModelResult, ModelId } from "@/types";

// ─── Props ─────────────────────────────────────────────────────────────────

interface ComparisonViewProps {
  results: ModelResult[];
  onRate: (modelId: ModelId, rating: number) => void;
  className?: string;
}

// ─── Mobile carousel nav ───────────────────────────────────────────────────

interface CarouselNavProps {
  current: number;
  total: number;
  onPrev: () => void;
  onNext: () => void;
  modelName: string;
}

function CarouselNav({
  current,
  total,
  onPrev,
  onNext,
  modelName,
}: CarouselNavProps) {
  return (
    <div className="flex items-center justify-between mb-3 md:hidden">
      <button
        onClick={onPrev}
        disabled={current === 0}
        className="p-1.5 rounded-lg border border-gray-200 text-gray-500
                   disabled:opacity-30 hover:bg-gray-50 transition-colors"
        aria-label="Previous model"
      >
        <ChevronLeft size={14} />
      </button>

      <span className="text-xs text-gray-600 font-medium">
        {modelName} ({current + 1} / {total})
      </span>

      <button
        onClick={onNext}
        disabled={current === total - 1}
        className="p-1.5 rounded-lg border border-gray-200 text-gray-500
                   disabled:opacity-30 hover:bg-gray-50 transition-colors"
        aria-label="Next model"
      >
        <ChevronRight size={14} />
      </button>
    </div>
  );
}

// ─── Single comparison column ──────────────────────────────────────────────

interface ComparisonColumnProps {
  result: ModelResult;
  isFastest: boolean;
  onRate: (modelId: ModelId, rating: number) => void;
  rank: number;
}

function ComparisonColumn({
  result,
  isFastest,
  onRate,
  rank,
}: ComparisonColumnProps) {
  const model = MODEL_MAP[result.modelId];
  const isLoading = result.status === "loading";
  const isError = result.status === "error";

  return (
    <div
      className={cn(
        "flex flex-col rounded-xl border bg-white overflow-hidden",
        "min-w-0 flex-1",
        isError ? "border-red-100" : "border-gray-100"
      )}
    >
      {/* Column header */}
      <div
        className="px-4 py-3 border-b border-gray-100 bg-gray-50/60
                    flex items-center justify-between gap-2"
      >
        <div className="flex items-center gap-2 min-w-0">
          {/* Rank number */}
          <span
            className="w-5 h-5 rounded-full bg-gray-200 text-gray-600
                        text-[10px] font-bold flex items-center justify-center
                        shrink-0"
          >
            {rank}
          </span>
          <ModelDot color={model?.color ?? "#6b7280"} />
          <div className="min-w-0">
            <p className="text-xs font-semibold text-gray-900 truncate">
              {result.modelName}
            </p>
            <p className="text-[10px] text-gray-400">{model?.provider}</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          {isFastest && !isError && (
            <span
              className="hidden lg:inline-flex px-1.5 py-0.5 rounded-full
                         text-[9px] font-bold bg-emerald-50
                         text-emerald-700 border border-emerald-100"
            >
              ⚡
            </span>
          )}
          <StatusBadge status={result.status} />
        </div>
      </div>

      {/* Response body */}
      <div className="flex-1 px-4 py-4 min-h-40">
        {isLoading ? (
          <div className="space-y-2 animate-pulse">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="h-3 bg-gray-100 rounded"
                style={{ width: `${85 - i * 10}%` }}
              />
            ))}
          </div>
        ) : isError ? (
          <p className="text-sm text-red-400 italic">
            {result.error ?? "Error occurred"}
          </p>
        ) : (
          <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
            {result.response}
          </p>
        )}
      </div>

      {/* Footer: metrics + rating */}
      {!isLoading && !isError && (
        <div
          className="px-4 py-3 border-t border-gray-50 space-y-2.5
                      bg-gray-50/40"
        >
          {/* Metrics */}
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-1">
              <Clock size={11} className="text-gray-400" />
              <span className="text-[11px] text-gray-500">
                {formatLatency(result.latencyMs)}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <Hash size={11} className="text-gray-400" />
              <span className="text-[11px] text-gray-500">
                {result.tokenUsage.total} tokens
              </span>
            </div>
          </div>

          {/* Rating */}
          <RatingComponent
            modelId={result.modelId}
            currentRating={result.rating}
            onRate={(rating) => onRate(result.modelId, rating)}
          />
        </div>
      )}
    </div>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────

export function ComparisonView({
  results,
  onRate,
  className,
}: ComparisonViewProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  const successResults = results.filter(
    (r) => r.status === "success" || r.status === "loading"
  );
  const fastestId = getFastestModel(results);

  if (!results.length) {
    return (
      <EmptyState
        icon={Rows2}
        title="No results to compare"
        description="Run an evaluation with two or more models to see a side-by-side comparison."
        size="md"
        className={className}
      />
    );
  }

  const mobileResult = results[activeIndex];

  return (
    <div className={cn("space-y-4", className)}>

      {/* ── Mobile carousel navigation ── */}
      {results.length > 1 && (
        <CarouselNav
          current={activeIndex}
          total={results.length}
          onPrev={() => setActiveIndex((i) => Math.max(0, i - 1))}
          onNext={() =>
            setActiveIndex((i) => Math.min(results.length - 1, i + 1))
          }
          modelName={mobileResult?.modelName ?? ""}
        />
      )}

      {/* ── Mobile: show one column at a time ── */}
      <div className="md:hidden">
        {mobileResult && (
          <ComparisonColumn
            result={mobileResult}
            isFastest={mobileResult.modelId === fastestId}
            onRate={onRate}
            rank={activeIndex + 1}
          />
        )}
      </div>

      {/* ── Desktop: side-by-side columns ── */}
      <div
        className={cn(
          "hidden md:flex gap-4 overflow-x-auto pb-1",
          // Ensure minimum column width for readability
          "items-stretch"
        )}
      >
        {results.map((result, index) => (
          <div
            key={result.modelId}
            className={cn(
              "flex-1 min-w-60",
              // Cap at 2 columns for readability, scroll for more
              results.length > 3 && "min-w-70 max-w-85"
            )}
          >
            <ComparisonColumn
              result={result}
              isFastest={result.modelId === fastestId}
              onRate={onRate}
              rank={index + 1}
            />
          </div>
        ))}
      </div>

      {/* ── Mobile dot indicators ── */}
      {results.length > 1 && (
        <div className="flex justify-center gap-1.5 md:hidden">
          {results.map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveIndex(i)}
              className={cn(
                "w-1.5 h-1.5 rounded-full transition-all duration-150",
                i === activeIndex ? "bg-gray-900 w-3" : "bg-gray-300"
              )}
              aria-label={`Go to model ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}