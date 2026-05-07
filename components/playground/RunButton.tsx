// components/playground/RunButton.tsx
// Primary CTA button to trigger evaluation run

"use client";

import { Play, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import { Spinner } from "@/components/ui/Loader";

// ─── Props ─────────────────────────────────────────────────────────────────

interface RunButtonProps {
  onClick: () => void;
  onReset?: () => void;
  isRunning: boolean;
  hasRun: boolean;
  disabled?: boolean;
  className?: string;
}

// ─── Component ─────────────────────────────────────────────────────────────

export function RunButton({
  onClick,
  onReset,
  isRunning,
  hasRun,
  disabled = false,
  className,
}: RunButtonProps) {
  const isDisabled = disabled || isRunning;

  return (
    <div className={cn("flex items-center gap-2", className)}>

      {/* ── Primary Run Button ── */}
      <button
        onClick={onClick}
        disabled={isDisabled}
        type="button"
        aria-label={isRunning ? "Running evaluation" : "Run evaluation"}
        className={cn(
          // Base
          "flex-1 flex items-center justify-center gap-2.5",
          "px-5 py-3 rounded-xl text-sm font-semibold",
          "transition-all duration-150 select-none",
          // Default state
          "bg-gray-900 text-white shadow-sm",
          // Hover
          !isDisabled && "hover:bg-gray-700 active:scale-[0.98]",
          // Disabled
          isDisabled && "opacity-60 cursor-not-allowed"
        )}
      >
        {isRunning ? (
          <>
            <Spinner size="sm" className="border-gray-600 border-t-white" />
            <span>Running…</span>
          </>
        ) : (
          <>
            <Play size={15} className="fill-white" />
            <span>{hasRun ? "Run Again" : "Run Evaluation"}</span>
          </>
        )}
      </button>

      {/* ── Reset Button — shown after a run ── */}
      {hasRun && !isRunning && onReset && (
        <button
          onClick={onReset}
          type="button"
          aria-label="Reset playground"
          className={cn(
            "flex items-center justify-center",
            "w-11 h-11 rounded-xl border border-gray-200",
            "text-gray-500 bg-white hover:bg-gray-50",
            "hover:text-gray-800 hover:border-gray-300",
            "transition-all duration-150 active:scale-95",
            "shadow-sm shrink-0"
          )}
          title="Reset playground"
        >
          <RotateCcw size={15} />
        </button>
      )}
    </div>
  );
}