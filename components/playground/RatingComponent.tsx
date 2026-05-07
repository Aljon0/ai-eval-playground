// components/playground/RatingComponent.tsx
// Star rating UI for scoring individual model responses

"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Props ─────────────────────────────────────────────────────────────────

interface RatingComponentProps {
  modelId: string;
  currentRating?: number;
  onRate: (rating: number) => void;
  disabled?: boolean;
  className?: string;
}

const RATING_LABELS: Record<number, string> = {
  1: "Poor",
  2: "Fair",
  3: "Good",
  4: "Great",
  5: "Excellent",
};

// ─── Component ─────────────────────────────────────────────────────────────

export function RatingComponent({
  modelId,
  currentRating,
  onRate,
  disabled = false,
  className,
}: RatingComponentProps) {
  const [hovered, setHovered] = useState<number | null>(null);

  const displayRating = hovered ?? currentRating ?? 0;
  const label = displayRating > 0 ? RATING_LABELS[displayRating] : null;

  const handleClick = (rating: number) => {
    if (disabled) return;
    // Toggle off if clicking the same rating
    onRate(rating === currentRating ? 0 : rating);
  };

  return (
    <div className={cn("flex items-center gap-2", className)}>

      {/* ── Stars ── */}
      <div
        className="flex items-center gap-0.5"
        role="group"
        aria-label={`Rate ${modelId} response`}
      >
        {[1, 2, 3, 4, 5].map((star) => {
          const isFilled = star <= displayRating;

          return (
            <button
              key={star}
              type="button"
              disabled={disabled}
              onClick={() => handleClick(star)}
              onMouseEnter={() => !disabled && setHovered(star)}
              onMouseLeave={() => setHovered(null)}
              aria-label={`Rate ${star} out of 5 — ${RATING_LABELS[star]}`}
              className={cn(
                "p-0.5 rounded transition-all duration-100",
                disabled
                  ? "cursor-default"
                  : "cursor-pointer hover:scale-110 active:scale-95"
              )}
            >
              <Star
                size={14}
                className={cn(
                  "transition-colors duration-100",
                  isFilled
                    ? "fill-amber-400 text-amber-400"
                    : "fill-transparent text-gray-300",
                  !disabled &&
                    !isFilled &&
                    "hover:text-amber-300"
                )}
              />
            </button>
          );
        })}
      </div>

      {/* ── Label ── */}
      <span
        className={cn(
          "text-[11px] min-w-13 transition-opacity duration-100",
          label ? "opacity-100" : "opacity-0",
          currentRating
            ? "text-amber-600 font-medium"
            : "text-gray-400"
        )}
      >
        {label ?? "·"}
      </span>
    </div>
  );
}

// ─── Compact numeric score display ─────────────────────────────────────────

interface ScoreBadgeProps {
  rating: number;
  className?: string;
}

export function ScoreBadge({ rating, className }: ScoreBadgeProps) {
  if (!rating) return null;

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1 px-2 py-0.5 rounded-full",
        "bg-amber-50 border border-amber-100",
        className
      )}
    >
      <Star size={10} className="fill-amber-400 text-amber-400" />
      <span className="text-[11px] font-semibold text-amber-700 tabular-nums">
        {rating}.0
      </span>
    </div>
  );
}