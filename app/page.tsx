// app/page.tsx
// Dashboard — overview of activity, stats, and recent experiments
// Updated: now pulls real stats and recent experiments from backend
// via useDashboard() instead of computing locally from experiments array.

"use client";

import {
  FlaskConical,
  Zap,
  BarChart3,
  Clock,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { RecentExperiments } from "@/components/dashboard/RecentExperiments";
import { ModelUsageChart } from "@/components/dashboard/ModelUsageChart";
import { useDashboard } from "@/hooks/useExperiments";
import { AVAILABLE_MODELS, formatLatency } from "@/lib/utils";

// ─── Component ─────────────────────────────────────────────────────────────

export default function DashboardPage() {
  // useDashboard fetches /api/dashboard/stats and /api/dashboard/recent
  // in parallel on mount — no local computation needed.
  const { stats, recentExperiments, isLoading } = useDashboard();

  return (
    <div className="space-y-6 md:space-y-8">

      {/* ── Page header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center
                      sm:justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-gray-900">
            Welcome back 👋
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Here&apos;s an overview of your AI evaluation activity.
          </p>
        </div>

        {/* CTA */}
        <Link
          href="/playground"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl
                     bg-gray-900 text-white text-sm font-semibold
                     hover:bg-gray-700 transition-colors shadow-sm
                     self-start sm:self-auto shrink-0"
        >
          <Zap size={15} />
          New Evaluation
        </Link>
      </div>

      {/* ── Stats cards ── */}
      {/* Each card now reads from the backend stats object */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        <StatsCard
          title="Total Runs"
          value={isLoading ? "—" : stats?.totalRuns ?? 0}
          subtitle="Saved experiments"
          icon={FlaskConical}
          trend={
            stats?.totalRuns && stats.totalRuns > 0
              ? { value: "active", positive: true }
              : undefined
          }
        />
        <StatsCard
          title="Models Used"
          value={isLoading ? "—" : stats?.modelsUsed ?? 0}
          subtitle={`of ${AVAILABLE_MODELS.length} available`}
          icon={BarChart3}
        />
        <StatsCard
          title="Avg Latency"
          value={
            isLoading
              ? "—"
              : stats?.avgLatencyMs && stats.avgLatencyMs > 0
              ? formatLatency(stats.avgLatencyMs)
              : "N/A"
          }
          subtitle="Across all results"
          icon={Clock}
        />
        <StatsCard
          title="Evaluations"
          value={isLoading ? "—" : stats?.totalEvaluations ?? 0}
          subtitle="Total model responses"
          icon={Zap}
        />
      </div>

      {/* ── Quick start banner (shown when no experiments yet) ── */}
      {!isLoading && (!stats || stats.totalRuns === 0) && (
        <div
          className="rounded-xl border border-dashed border-gray-200
                      bg-white p-6 md:p-8 text-center"
        >
          <div
            className="w-12 h-12 rounded-2xl bg-gray-50 border border-gray-100
                        flex items-center justify-center mx-auto mb-4"
          >
            <Zap size={22} className="text-gray-400" strokeWidth={1.5} />
          </div>
          <h3 className="text-base font-semibold text-gray-900 mb-1">
            Run your first evaluation
          </h3>
          <p className="text-sm text-gray-500 max-w-sm mx-auto mb-5">
            Head to the Playground, enter a prompt, select models, and hit Run
            to start comparing AI responses side by side.
          </p>
          <Link
            href="/playground"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl
                       bg-gray-900 text-white text-sm font-semibold
                       hover:bg-gray-700 transition-colors"
          >
            Open Playground
            <ArrowRight size={14} />
          </Link>
        </div>
      )}

      {/* ── Main content grid ── */}
      {/* Uses recentExperiments from backend instead of full experiments list */}
      {(isLoading || recentExperiments.length > 0) && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
          {/* Recent experiments — takes 2/3 width on large screens */}
          <div className="lg:col-span-2">
            <RecentExperiments
              experiments={recentExperiments}
              isLoading={isLoading}
            />
          </div>

          {/* Model usage chart — takes 1/3 width */}
          <div className="lg:col-span-1">
            <ModelUsageChart experiments={recentExperiments} />
          </div>
        </div>
      )}
    </div>
  );
}