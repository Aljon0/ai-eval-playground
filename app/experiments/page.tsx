// app/experiments/page.tsx
// Experiments — browse, search, and manage all saved evaluation runs

"use client";

import { useState, useMemo } from "react";
import { Search, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import { useExperiments } from "@/hooks/useExperiments";
import { ExperimentList } from "@/components/experiments/ExperimentList";

// ─── Component ─────────────────────────────────────────────────────────────

export default function ExperimentsPage() {
  const { experiments, isLoading, handleDelete, fetchExperiments } =
    useExperiments();

  const [search, setSearch] = useState("");
  const [activeTag, setActiveTag] = useState<string | null>(null);

  // ── Derived: all unique tags ─────────────────────────────────────────────
  const allTags = useMemo(() => {
    const tags = new Set(experiments.flatMap((e) => e.tags ?? []));
    return Array.from(tags).sort();
  }, [experiments]);

  // ── Filtered experiments ─────────────────────────────────────────────────
  const filtered = useMemo(() => {
    return experiments.filter((exp) => {
      const matchesSearch =
        !search ||
        exp.name.toLowerCase().includes(search.toLowerCase()) ||
        exp.prompt.toLowerCase().includes(search.toLowerCase());

      const matchesTag =
        !activeTag || (exp.tags ?? []).includes(activeTag);

      return matchesSearch && matchesTag;
    });
  }, [experiments, search, activeTag]);

  return (
    <div className="space-y-6">

      {/* ── Page header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center
                      sm:justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-gray-900">
            Experiments
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {isLoading
              ? "Loading…"
              : `${experiments.length} saved experiment${
                  experiments.length !== 1 ? "s" : ""
                }`}
          </p>
        </div>

        {/* Refresh */}
        <button
          onClick={fetchExperiments}
          disabled={isLoading}
          className={cn(
            "inline-flex items-center gap-2 px-4 py-2.5 rounded-xl",
            "border border-gray-200 bg-white text-sm font-medium text-gray-600",
            "hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm",
            "self-start sm:self-auto shrink-0",
            isLoading && "opacity-60 cursor-not-allowed"
          )}
          aria-label="Refresh experiments"
        >
          <RefreshCw
            size={14}
            className={isLoading ? "animate-spin" : ""}
          />
          Refresh
        </button>
      </div>

      {/* ── Search + filter bar ── */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search input */}
        <div className="relative flex-1">
          <Search
            size={14}
            className="absolute left-3.5 top-1/2 -translate-y-1/2
                       text-gray-400 pointer-events-none"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or prompt…"
            className={cn(
              "w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200",
              "text-sm text-gray-900 placeholder:text-gray-400 bg-white",
              "focus:outline-none focus:border-gray-400 focus:ring-1",
              "focus:ring-gray-100 transition-all shadow-sm"
            )}
          />
        </div>

        {/* Tag filters */}
        {allTags.length > 0 && (
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide pb-0.5">
            <button
              onClick={() => setActiveTag(null)}
              className={cn(
                "px-3 py-2 rounded-lg text-xs font-medium shrink-0",
                "transition-all duration-150 border",
                !activeTag
                  ? "bg-gray-900 text-white border-gray-900"
                  : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
              )}
            >
              All
            </button>
            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={() =>
                  setActiveTag(activeTag === tag ? null : tag)
                }
                className={cn(
                  "px-3 py-2 rounded-lg text-xs font-medium shrink-0",
                  "transition-all duration-150 border",
                  activeTag === tag
                    ? "bg-gray-900 text-white border-gray-900"
                    : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
                )}
              >
                {tag}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ── Results count ── */}
      {!isLoading && search && (
        <p className="text-xs text-gray-500">
          {filtered.length} result{filtered.length !== 1 ? "s" : ""} for{" "}
          <span className="font-medium text-gray-700">&quot;{search}&quot;</span>
        </p>
      )}

      {/* ── Experiment list ── */}
      <ExperimentList
        experiments={filtered}
        isLoading={isLoading}
        onDelete={handleDelete}
      />
    </div>
  );
}