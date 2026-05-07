// components/experiments/ExperimentList.tsx
// Displays saved experiments in a responsive list with actions

"use client";

import { useState } from "react";
import {
  Trash2,
  ChevronDown,
  ChevronUp,
  FlaskConical,
  Clock,
  Hash,
} from "lucide-react";
import { cn, formatDate, formatLatency, MODEL_MAP, truncate } from "@/lib/utils";
import { Badge, ModelDot } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import { PageLoader } from "@/components/ui/Loader";
import type { Experiment } from "@/types";

// ─── Props ─────────────────────────────────────────────────────────────────

interface ExperimentListProps {
  experiments: Experiment[];
  isLoading: boolean;
  onDelete: (id: string) => void;
  className?: string;
}

// ─── Experiment Row ────────────────────────────────────────────────────────

interface ExperimentRowProps {
  experiment: Experiment;
  onDelete: (id: string) => void;
}

function ExperimentRow({ experiment, onDelete }: ExperimentRowProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const successResults = experiment.results.filter(
    (r) => r.status === "success"
  );
  const avgLatency =
    successResults.length > 0
      ? Math.round(
          successResults.reduce((s, r) => s + r.latencyMs, 0) /
            successResults.length
        )
      : 0;

  const handleDelete = () => {
    if (!confirmDelete) {
      setConfirmDelete(true);
      setTimeout(() => setConfirmDelete(false), 3000);
      return;
    }
    onDelete(experiment.id);
  };

  return (
    <div
      className={cn(
        "rounded-xl border border-gray-100 bg-white overflow-hidden",
        "transition-all duration-200 shadow-sm hover:shadow-md"
      )}
    >
      {/* ── Row header ── */}
      <div className="px-4 py-4 flex items-start gap-3">

        {/* Expand toggle */}
        <button
          onClick={() => setIsExpanded((p) => !p)}
          className="mt-0.5 p-1 rounded-md text-gray-400 hover:text-gray-700
                     hover:bg-gray-100 transition-colors shrink-0"
          aria-label={isExpanded ? "Collapse" : "Expand"}
        >
          {isExpanded ? (
            <ChevronUp size={14} />
          ) : (
            <ChevronDown size={14} />
          )}
        </button>

        {/* Main content */}
        <div className="flex-1 min-w-0">
          {/* Name + date */}
          <div className="flex items-start justify-between gap-2 flex-wrap">
            <div className="min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate">
                {experiment.name}
              </p>
              <p className="text-[11px] text-gray-400 mt-0.5">
                {formatDate(experiment.createdAt)}
              </p>
            </div>

            {/* Delete button */}
            <button
              onClick={handleDelete}
              className={cn(
                "flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg",
                "text-xs font-medium transition-all duration-150 shrink-0",
                confirmDelete
                  ? "bg-red-50 text-red-600 border border-red-200"
                  : "text-gray-400 hover:text-red-500 hover:bg-red-50"
              )}
              aria-label="Delete experiment"
            >
              <Trash2 size={12} />
              {confirmDelete ? "Confirm?" : ""}
            </button>
          </div>

          {/* Prompt preview */}
          <p className="text-xs text-gray-500 mt-2 leading-relaxed">
            {truncate(experiment.prompt, 120)}
          </p>

          {/* Meta row */}
          <div className="flex flex-wrap items-center gap-3 mt-3">
            {/* Model dots */}
            <div className="flex items-center gap-1">
              {experiment.selectedModels.map((modelId) => {
                const model = MODEL_MAP[modelId];
                return (
                  <ModelDot
                    key={modelId}
                    color={model?.color ?? "#6b7280"}
                    className="w-2 h-2"
                  />
                );
              })}
              <span className="text-[11px] text-gray-500 ml-1">
                {experiment.selectedModels.length} model
                {experiment.selectedModels.length !== 1 ? "s" : ""}
              </span>
            </div>

            {/* Avg latency */}
            {avgLatency > 0 && (
              <div className="flex items-center gap-1">
                <Clock size={11} className="text-gray-400" />
                <span className="text-[11px] text-gray-500">
                  {formatLatency(avgLatency)} avg
                </span>
              </div>
            )}

            {/* Total tokens */}
            {successResults.length > 0 && (
              <div className="flex items-center gap-1">
                <Hash size={11} className="text-gray-400" />
                <span className="text-[11px] text-gray-500">
                  {successResults
                    .reduce((s, r) => s + r.tokenUsage.total, 0)
                    .toLocaleString()}{" "}
                  tokens
                </span>
              </div>
            )}

            {/* Tags */}
            {experiment.tags?.map((tag) => (
              <Badge key={tag} variant="muted">
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      {/* ── Expanded: result summaries ── */}
      {isExpanded && (
        <div className="border-t border-gray-50 px-4 py-4 bg-gray-50/40">
          <p className="text-[11px] font-semibold uppercase tracking-widest
                        text-gray-400 mb-3">
            Results
          </p>

          <div className="space-y-2">
            {experiment.results.map((result) => {
              const model = MODEL_MAP[result.modelId];
              return (
                <div
                  key={result.modelId}
                  className="flex items-start gap-3 p-3 rounded-lg
                             bg-white border border-gray-100"
                >
                  <ModelDot
                    color={model?.color ?? "#6b7280"}
                    className="mt-1 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-xs font-medium text-gray-900">
                        {result.modelName}
                      </p>
                      <div className="flex items-center gap-2 shrink-0">
                        {result.rating && (
                          <span className="text-[10px] text-amber-600 font-medium">
                            ★ {result.rating}.0
                          </span>
                        )}
                        <span className="text-[11px] text-gray-400">
                          {formatLatency(result.latencyMs)}
                        </span>
                      </div>
                    </div>
                    <p className="text-[11px] text-gray-500 mt-1 leading-snug">
                      {truncate(result.response, 100)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────

export function ExperimentList({
  experiments,
  isLoading,
  onDelete,
  className,
}: ExperimentListProps) {
  if (isLoading) return <PageLoader />;

  if (!experiments.length) {
    return (
      <EmptyState
        icon={FlaskConical}
        title="No experiments saved yet"
        description="Run an evaluation in the Playground and save it to see it listed here."
        size="md"
        className={className}
      />
    );
  }

  return (
    <div className={cn("space-y-3", className)}>
      {experiments.map((experiment) => (
        <ExperimentRow
          key={experiment.id}
          experiment={experiment}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}