// app/playground/page.tsx
// Playground — main evaluation feature page

"use client";

import { useState } from "react";
import { BookMarked, LayoutGrid, Columns2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { usePlayground } from "@/hooks/usePlayground";
import { useExperiments } from "@/hooks/useExperiments";
import { PromptInput } from "@/components/playground/PromptInput";
import { ModelSelector } from "@/components/playground/ModelSelector";
import { RunButton } from "@/components/playground/RunButton";
import { ResultsGrid } from "@/components/playground/ResultsGrid";
import { ComparisonView } from "@/components/playground/ComparisonView";
import { SaveExperimentModal } from "@/components/experiments/SaveExperimentModal";

// ─── Component ─────────────────────────────────────────────────────────────

export default function PlaygroundPage() {
  const playground = usePlayground();
  const { handleSave, isSaving } = useExperiments();
  const [saveModalOpen, setSaveModalOpen] = useState(false);

  // ── Save handler ────────────────────────────────────────────────────────
  const handleSaveExperiment = async (name: string, tags: string[]) => {
    await handleSave({
      name,
      prompt: playground.prompt,
      selectedModels: playground.selectedModels,
      results: playground.results,
      tags,
    });
    setSaveModalOpen(false);
  };

  const hasSuccessResults = playground.results.some(
    (r) => r.status === "success"
  );

  return (
    <div className="space-y-6">

      {/* ── Page header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center
                      sm:justify-between gap-3">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-gray-900">
            Playground
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Test your prompt across multiple AI models simultaneously.
          </p>
        </div>

        {/* Save experiment button */}
        {hasSuccessResults && (
          <button
            onClick={() => setSaveModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl
                       border border-gray-200 bg-white text-sm font-medium
                       text-gray-700 hover:bg-gray-50 hover:border-gray-300
                       transition-all shadow-sm self-start sm:self-auto
                       shrink-0"
          >
            <BookMarked size={14} />
            Save Experiment
          </button>
        )}
      </div>

      {/* ── Main layout: input panel + results ── */}
      <div className="grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-5
                      xl:grid-cols-[360px_1fr]">

        {/* ── Left panel: controls ── */}
        <div className="space-y-5">
          {/* Card wrapper */}
          <div
            className="rounded-xl border border-gray-100 bg-white
                        shadow-sm p-5 space-y-5"
          >
            {/* Prompt input */}
            <PromptInput
              value={playground.prompt}
              onChange={playground.setPrompt}
              disabled={playground.isRunning}
            />

            {/* Divider */}
            <div className="border-t border-gray-100" />

            {/* Model selector */}
            <ModelSelector
              selected={playground.selectedModels}
              onToggle={playground.toggleModel}
              disabled={playground.isRunning}
            />

            {/* Divider */}
            <div className="border-t border-gray-100" />

            {/* Run + Reset buttons */}
            <RunButton
              onClick={playground.handleRun}
              onReset={playground.reset}
              isRunning={playground.isRunning}
              hasRun={playground.hasRun}
              disabled={!playground.prompt.trim()}
            />

            {/* Error message */}
            {playground.error && (
              <div
                className="rounded-lg bg-red-50 border border-red-100
                            px-3.5 py-3"
              >
                <p className="text-xs text-red-600">{playground.error}</p>
              </div>
            )}
          </div>

          {/* ── Tips card ── */}
          <div
            className="rounded-xl border border-gray-100 bg-white
                        shadow-sm p-4 space-y-2 hidden lg:block"
          >
            <p
              className="text-[10px] font-semibold uppercase tracking-widest
                          text-gray-400"
            >
              Tips
            </p>
            {[
              "Select 2+ models to unlock Comparison View",
              "Rate responses to track model quality over time",
              "Save experiments to revisit and compare later",
            ].map((tip, i) => (
              <div key={i} className="flex items-start gap-2">
                <span className="text-gray-300 text-xs mt-px">→</span>
                <p className="text-xs text-gray-500 leading-snug">{tip}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── Right panel: results ── */}
        <div className="space-y-4 min-w-0">
          {/* View mode toggle — only shown after run */}
          {playground.hasRun && playground.selectedModels.length > 1 && (
            <div className="flex items-center gap-2">
              <p className="text-xs text-gray-500 mr-1">View:</p>
              <div
                className="flex items-center gap-1 p-1 rounded-lg
                            bg-gray-100 border border-gray-200"
              >
                {(
                  [
                    { mode: "cards", icon: LayoutGrid, label: "Cards" },
                    { mode: "comparison", icon: Columns2, label: "Compare" },
                  ] as const
                ).map(({ mode, icon: Icon, label }) => (
                  <button
                    key={mode}
                    onClick={() => playground.setViewMode(mode)}
                    className={cn(
                      "flex items-center gap-1.5 px-3 py-1.5 rounded-md",
                      "text-xs font-medium transition-all duration-150",
                      playground.viewMode === mode
                        ? "bg-white text-gray-900 shadow-sm border border-gray-200"
                        : "text-gray-500 hover:text-gray-700"
                    )}
                    aria-pressed={playground.viewMode === mode}
                  >
                    <Icon size={13} />
                    {label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Results display */}
          {playground.viewMode === "cards" || playground.selectedModels.length <= 1 ? (
            <ResultsGrid
              results={playground.results}
              onRate={playground.updateRating}
            />
          ) : (
            <ComparisonView
              results={playground.results}
              onRate={playground.updateRating}
            />
          )}
        </div>
      </div>

      {/* ── Save experiment modal ── */}
      <SaveExperimentModal
        isOpen={saveModalOpen}
        onClose={() => setSaveModalOpen(false)}
        onSave={handleSaveExperiment}
        isSaving={isSaving}
        prompt={playground.prompt}
        selectedModels={playground.selectedModels}
        results={playground.results}
      />
    </div>
  );
}