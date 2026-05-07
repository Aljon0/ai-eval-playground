// components/playground/ModelSelector.tsx
// Multi-select model picker with visual color indicators

"use client";

import { AVAILABLE_MODELS } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import type { ModelId } from "@/types";

// ─── Props ─────────────────────────────────────────────────────────────────

interface ModelSelectorProps {
  selected: ModelId[];
  onToggle: (modelId: ModelId) => void;
  disabled?: boolean;
  className?: string;
}

// ─── Component ─────────────────────────────────────────────────────────────

export function ModelSelector({
  selected,
  onToggle,
  disabled = false,
  className,
}: ModelSelectorProps) {
  return (
    <div className={cn("space-y-3", className)}>

      {/* ── Label ── */}
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-gray-900">
          Models
        </label>
        <span className="text-xs text-gray-400">
          {selected.length} selected
        </span>
      </div>

      {/* ── Model Cards Grid ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {AVAILABLE_MODELS.map((model) => {
          const isSelected = selected.includes(model.id);
          const isOnlySelected = isSelected && selected.length === 1;

          return (
            <button
              key={model.id}
              onClick={() => onToggle(model.id)}
              disabled={disabled || isOnlySelected}
              type="button"
              aria-pressed={isSelected}
              aria-label={`${isSelected ? "Deselect" : "Select"} ${model.name}`}
              title={
                isOnlySelected
                  ? "At least one model must be selected"
                  : undefined
              }
              className={cn(
                "relative flex items-start gap-3 p-3.5 rounded-xl border text-left",
                "transition-all duration-150 group",
                isSelected
                  ? "border-gray-900 bg-gray-900 shadow-sm"
                  : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm",
                (disabled || isOnlySelected) &&
                  "opacity-60 cursor-not-allowed"
              )}
            >
              {/* Color dot */}
              <span
                className="mt-0.5 w-2.5 h-2.5 rounded-full shrink-0"
                style={{ backgroundColor: model.color }}
              />

              {/* Model info */}
              <div className="flex-1 min-w-0">
                <p
                  className={cn(
                    "text-sm font-medium leading-tight truncate",
                    isSelected ? "text-white" : "text-gray-900"
                  )}
                >
                  {model.name}
                </p>
                <p
                  className={cn(
                    "text-[11px] mt-0.5 leading-snug",
                    isSelected ? "text-gray-400" : "text-gray-500"
                  )}
                >
                  {model.provider}
                </p>
                <p
                  className={cn(
                    "text-[11px] mt-1 leading-snug hidden sm:block",
                    isSelected ? "text-gray-500" : "text-gray-400"
                  )}
                >
                  {model.description}
                </p>
              </div>

              {/* Checkmark */}
              <div
                className={cn(
                  "shrink-0 w-5 h-5 rounded-md border flex items-center",
                  "justify-center transition-all duration-150",
                  isSelected
                    ? "bg-white border-white"
                    : "border-gray-200 bg-white group-hover:border-gray-400"
                )}
              >
                {isSelected && (
                  <Check size={12} className="text-gray-900" strokeWidth={2.5} />
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* ── Helper text ── */}
      <p className="text-[11px] text-gray-400">
        Select one or more models to compare their responses side by side.
      </p>
    </div>
  );
}