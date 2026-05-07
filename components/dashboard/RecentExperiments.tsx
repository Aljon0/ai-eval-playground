// components/dashboard/RecentExperiments.tsx
// Dashboard widget: compact list of recent experiments

"use client";

import Link from "next/link";
import { ArrowRight, FlaskConical } from "lucide-react";
import { cn, formatDate, truncate, MODEL_MAP } from "@/lib/utils";
import { ModelDot } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import { Skeleton } from "@/components/ui/Loader";
import type { Experiment } from "@/types";

// ─── Props ─────────────────────────────────────────────────────────────────

interface RecentExperimentsProps {
  experiments: Experiment[];
  isLoading: boolean;
  className?: string;
}

// ─── Component ─────────────────────────────────────────────────────────────

export function RecentExperiments({
  experiments,
  isLoading,
  className,
}: RecentExperimentsProps) {
  const recent = experiments.slice(0, 5);

  return (
    <div
      className={cn(
        "rounded-xl border border-gray-100 bg-white shadow-sm overflow-hidden",
        className
      )}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-5 py-4
                    border-b border-gray-100"
      >
        <h2 className="text-sm font-semibold text-gray-900">
          Recent Experiments
        </h2>
        <Link
          href="/experiments"
          className="flex items-center gap-1 text-xs text-gray-400
                     hover:text-gray-700 transition-colors group"
        >
          View all
          <ArrowRight
            size={12}
            className="group-hover:translate-x-0.5 transition-transform"
          />
        </Link>
      </div>

      {/* Content */}
      <div className="divide-y divide-gray-50">
        {isLoading ? (
          // Skeleton rows
          [...Array(3)].map((_, i) => (
            <div key={i} className="px-5 py-4 flex items-center gap-3">
              <Skeleton className="w-8 h-8 rounded-lg shrink-0" />
              <div className="flex-1 space-y-1.5">
                <Skeleton className="h-3 w-2/3" />
                <Skeleton className="h-2.5 w-1/2" />
              </div>
              <Skeleton className="h-2.5 w-16 shrink-0" />
            </div>
          ))
        ) : recent.length === 0 ? (
          <EmptyState
            icon={FlaskConical}
            title="No experiments yet"
            description="Save a run from the Playground to see it here."
            size="sm"
          />
        ) : (
          recent.map((experiment) => (
            <div
              key={experiment.id}
              className="flex items-center gap-3 px-5 py-4
                         hover:bg-gray-50/60 transition-colors group"
            >
              {/* Icon */}
              <div
                className="w-8 h-8 rounded-lg bg-gray-100 flex items-center
                            justify-center shrink-0"
              >
                <FlaskConical size={14} className="text-gray-500" />
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {experiment.name}
                </p>
                <p className="text-[11px] text-gray-400 truncate mt-0.5">
                  {truncate(experiment.prompt, 55)}
                </p>

                {/* Model dots */}
                <div className="flex items-center gap-1 mt-1.5">
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
                </div>
              </div>

              {/* Date */}
              <p className="text-[11px] text-gray-400 shrink-0
                            hidden sm:block">
                {formatDate(experiment.createdAt)}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}