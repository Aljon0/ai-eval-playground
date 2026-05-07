// components/dashboard/ModelUsageChart.tsx
// Visual bar chart showing model usage distribution.
// Updated: now accepts leaderboard data from the backend for accurate
// all-time usage stats instead of computing from local experiments slice.

"use client";

import { useEffect, useState } from "react";
import { cn, AVAILABLE_MODELS } from "@/lib/utils";
import { getLeaderboard } from "@/services/api";
import type { Experiment, ModelId } from "@/types";

// ─── Props ─────────────────────────────────────────────────────────────────

interface ModelUsageChartProps {
  // Still accepted for fallback and footer count display
  experiments: Experiment[];
  className?: string;
}

// ─── Types ─────────────────────────────────────────────────────────────────

interface LeaderboardEntry {
  modelId: ModelId;
  usageCount: number;
  avgLatencyMs: number | null;
  avgScore: number | null;
  successRate: number;
}

// ─── Component ─────────────────────────────────────────────────────────────

export function ModelUsageChart({
  experiments,
  className,
}: ModelUsageChartProps) {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch all-time leaderboard from backend on mount
  useEffect(() => {
    getLeaderboard()
      .then((res) => {
        if (res.success && res.data) {
          setLeaderboard(res.data);
        }
      })
      .finally(() => setIsLoading(false));
  }, []);

  // ── Build display rows ──────────────────────────────────────────────────
  // Merge backend leaderboard counts with local AVAILABLE_MODELS metadata
  // so we always show all models (even unused ones at count 0)
  const usageCounts = AVAILABLE_MODELS.map((model) => {
    const entry = leaderboard.find((e) => e.modelId === model.id);
    return {
      model,
      count: entry?.usageCount ?? 0,
      avgLatencyMs: entry?.avgLatencyMs ?? null,
      avgScore: entry?.avgScore ?? null,
      successRate: entry?.successRate ?? 0,
    };
  });

  const maxCount = Math.max(...usageCounts.map((u) => u.count), 1);
  const totalUses = usageCounts.reduce((s, u) => s + u.count, 0);

  return (
    <div
      className={cn(
        "rounded-xl border border-gray-100 bg-white shadow-sm p-5",
        className
      )}
    >
      {/* Header */}
      <div className="mb-5">
        <h2 className="text-sm font-semibold text-gray-900">Model Usage</h2>
        <p className="text-[11px] text-gray-400 mt-0.5">
          Distribution across saved experiments
        </p>
      </div>

      {/* Loading state */}
      {isLoading ? (
        <div className="space-y-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="space-y-1.5 animate-pulse">
              <div className="flex justify-between">
                <div className="h-3 w-24 bg-gray-100 rounded" />
                <div className="h-3 w-8 bg-gray-100 rounded" />
              </div>
              <div className="h-2 w-full bg-gray-100 rounded-full" />
            </div>
          ))}
        </div>
      ) : totalUses === 0 ? (
        <div className="flex items-center justify-center py-10">
          <p className="text-sm text-gray-400">
            No data yet — run some experiments.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {usageCounts
            .sort((a, b) => b.count - a.count)
            .map(({ model, count, avgLatencyMs, avgScore }) => {
              const pct = maxCount > 0 ? (count / maxCount) * 100 : 0;
              const sharePct =
                totalUses > 0
                  ? Math.round((count / totalUses) * 100)
                  : 0;

              return (
                <div key={model.id}>
                  {/* Label row */}
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span
                        className="w-2 h-2 rounded-full shrink-0"
                        style={{ backgroundColor: model.color }}
                      />
                      <span className="text-xs font-medium text-gray-700">
                        {model.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      {/* Avg latency tooltip */}
                      {avgLatencyMs && (
                        <span
                          className="text-[10px] text-gray-400 hidden sm:inline"
                          title="Average latency"
                        >
                          {avgLatencyMs}ms
                        </span>
                      )}
                      {/* Avg score */}
                      {avgScore && (
                        <span
                          className="text-[10px] text-amber-500 hidden sm:inline"
                          title="Average score"
                        >
                          ★ {avgScore}
                        </span>
                      )}
                      <span className="text-[11px] text-gray-400">
                        {sharePct}%
                      </span>
                      <span className="text-xs font-semibold text-gray-700 tabular-nums w-4 text-right">
                        {count}
                      </span>
                    </div>
                  </div>

                  {/* Bar track */}
                  <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{
                        width: `${pct}%`,
                        backgroundColor: model.color,
                        opacity: count === 0 ? 0.3 : 1,
                      }}
                    />
                  </div>
                </div>
              );
            })}
        </div>
      )}

      {/* Footer */}
      {totalUses > 0 && (
        <p className="mt-5 text-[11px] text-gray-400 border-t border-gray-50 pt-4">
          {totalUses} total model uses across {experiments.length} experiment
          {experiments.length !== 1 ? "s" : ""}
        </p>
      )}
    </div>
  );
}