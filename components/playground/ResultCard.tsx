// components/playground/ResultCard.tsx
// Displays a single model's evaluation result with metrics and rating

"use client";

import { useState } from "react";
import { Clock, Hash, Copy, Check, ChevronDown, ChevronUp } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { cn, formatLatency, MODEL_MAP } from "@/lib/utils";
import { StatusBadge, ModelDot } from "@/components/ui/Badge";
import { ResultCardSkeleton } from "@/components/ui/Loader";
import { RatingComponent, ScoreBadge } from "./RatingComponent";
import type { ModelResult, ModelId } from "@/types";

// ─── Props ─────────────────────────────────────────────────────────────────

interface ResultCardProps {
  result: ModelResult;
  isFastest?: boolean;
  onRate: (modelId: ModelId, rating: number, experimentId?: string) => void;
  className?: string;
}

// ─── Markdown prose styles ──────────────────────────────────────────────────
// Applied via className on the ReactMarkdown wrapper div

const proseClass = cn(
  "text-sm text-gray-700 leading-relaxed space-y-3",
  // Headings
  "[&_h1]:text-base [&_h1]:font-bold [&_h1]:text-gray-900 [&_h1]:mt-4 [&_h1]:mb-1",
  "[&_h2]:text-sm  [&_h2]:font-bold [&_h2]:text-gray-900 [&_h2]:mt-4 [&_h2]:mb-1",
  "[&_h3]:text-sm  [&_h3]:font-semibold [&_h3]:text-gray-800 [&_h3]:mt-3 [&_h3]:mb-1",
  // Paragraphs
  "[&_p]:leading-relaxed [&_p]:text-gray-700",
  // Bold / italic
  "[&_strong]:font-semibold [&_strong]:text-gray-900",
  "[&_em]:italic [&_em]:text-gray-600",
  // Unordered lists
  "[&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1",
  "[&_ul_li]:text-gray-700 [&_ul_li]:leading-snug",
  // Ordered lists
  "[&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:space-y-1",
  "[&_ol_li]:text-gray-700 [&_ol_li]:leading-snug",
  // Inline code
  "[&_code]:bg-gray-100 [&_code]:text-gray-800 [&_code]:rounded",
  "[&_code]:px-1.5 [&_code]:py-0.5 [&_code]:text-[12px] [&_code]:font-mono",
  // Code blocks
  "[&_pre]:bg-gray-950 [&_pre]:text-gray-100 [&_pre]:rounded-xl",
  "[&_pre]:px-4 [&_pre]:py-3.5 [&_pre]:overflow-x-auto [&_pre]:text-[12px]",
  "[&_pre]:leading-relaxed [&_pre_code]:bg-transparent [&_pre_code]:p-0",
  "[&_pre_code]:text-gray-100 [&_pre_code]:font-mono",
  // Blockquotes
  "[&_blockquote]:border-l-2 [&_blockquote]:border-gray-200",
  "[&_blockquote]:pl-4 [&_blockquote]:text-gray-500 [&_blockquote]:italic",
  // Horizontal rule
  "[&_hr]:border-gray-100 [&_hr]:my-3",
  // Tables (from remark-gfm)
  "[&_table]:w-full [&_table]:text-xs [&_table]:border-collapse",
  "[&_th]:text-left [&_th]:font-semibold [&_th]:text-gray-700",
  "[&_th]:border [&_th]:border-gray-200 [&_th]:px-3 [&_th]:py-2 [&_th]:bg-gray-50",
  "[&_td]:border [&_td]:border-gray-200 [&_td]:px-3 [&_td]:py-2 [&_td]:text-gray-600",
  // Links
  "[&_a]:text-blue-600 [&_a]:underline [&_a]:underline-offset-2",
  "[&_a:hover]:text-blue-800"
);

// ─── Component ─────────────────────────────────────────────────────────────

export function ResultCard({
  result,
  isFastest = false,
  onRate,
  className,
}: ResultCardProps) {
  const [copied, setCopied] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);

  const model = MODEL_MAP[result.modelId];

  // ── Loading skeleton ──
  if (result.status === "loading") {
    return <ResultCardSkeleton />;
  }

  // ── Copy response to clipboard ──
  const handleCopy = async () => {
    if (!result.response) return;
    await navigator.clipboard.writeText(result.response);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isError = result.status === "error";

  return (
    <div
      className={cn(
        "rounded-xl border bg-white shadow-sm overflow-hidden",
        "transition-all duration-200",
        isError ? "border-red-100" : "border-gray-100",
        className
      )}
    >
      {/* ── Header ── */}
      <div
        className={cn(
          "flex items-center justify-between px-4 py-3.5",
          "border-b",
          isError
            ? "border-red-50 bg-red-50/40"
            : "border-gray-50 bg-gray-50/60"
        )}
      >
        {/* Model identity */}
        <div className="flex items-center gap-2 min-w-0">
          <ModelDot color={model?.color ?? "#6b7280"} />
          <div className="min-w-0">
            <p className="text-sm font-semibold text-gray-900 truncate">
              {result.modelName}
            </p>
            <p className="text-[11px] text-gray-400 truncate">
              {model?.provider}
            </p>
          </div>
        </div>

        {/* Right side: badges + actions */}
        <div className="flex items-center gap-2 shrink-0 ml-2">
          {/* Fastest badge */}
          {isFastest && !isError && (
            <span
              className="hidden sm:inline-flex items-center px-2 py-0.5
                         rounded-full text-[10px] font-semibold
                         bg-emerald-50 text-emerald-700 border border-emerald-100"
            >
              ⚡ Fastest
            </span>
          )}

          {/* Status */}
          <StatusBadge status={result.status} />

          {/* Expand/collapse toggle */}
          <button
            onClick={() => setIsExpanded((p) => !p)}
            className="p-1 rounded-md text-gray-400 hover:text-gray-600
                       hover:bg-gray-100 transition-colors"
            aria-label={isExpanded ? "Collapse response" : "Expand response"}
          >
            {isExpanded ? (
              <ChevronUp size={14} />
            ) : (
              <ChevronDown size={14} />
            )}
          </button>
        </div>
      </div>

      {/* ── Body (collapsible) ── */}
      {isExpanded && (
        <>
          {/* Response text */}
          <div className="px-4 py-4 relative group">
            {isError ? (
              <p className="text-sm text-red-500 italic">
                {result.error ?? "An error occurred during evaluation."}
              </p>
            ) : (
              <>
                {/* ✅ Markdown rendered response */}
                <div className={proseClass}>
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {result.response}
                  </ReactMarkdown>
                </div>

                {/* Copy button — appears on hover */}
                <button
                  onClick={handleCopy}
                  className={cn(
                    "absolute top-3 right-3 p-1.5 rounded-lg",
                    "text-gray-400 bg-white border border-gray-100",
                    "hover:text-gray-700 hover:border-gray-300",
                    "transition-all duration-150 shadow-sm",
                    "opacity-0 group-hover:opacity-100"
                  )}
                  aria-label="Copy response"
                >
                  {copied ? (
                    <Check size={13} className="text-emerald-500" />
                  ) : (
                    <Copy size={13} />
                  )}
                </button>
              </>
            )}
          </div>

          {/* ── Footer: Metrics + Rating ── */}
          {!isError && (
            <div
              className="px-4 py-3 border-t border-gray-50
                          flex flex-col sm:flex-row sm:items-center
                          justify-between gap-3"
            >
              {/* Metrics row */}
              <div className="flex items-center gap-4 flex-wrap">
                {/* Latency */}
                <div className="flex items-center gap-1.5">
                  <Clock size={12} className="text-gray-400 shrink-0" />
                  <span className="text-[12px] text-gray-500">
                    {formatLatency(result.latencyMs)}
                  </span>
                </div>

                {/* Token usage */}
                <div className="flex items-center gap-1.5">
                  <Hash size={12} className="text-gray-400 shrink-0" />
                  <span className="text-[12px] text-gray-500">
                    {result.tokenUsage.total.toLocaleString()} tokens
                  </span>
                </div>

                {/* Prompt / completion breakdown */}
                <span className="text-[11px] text-gray-400 hidden md:inline">
                  {result.tokenUsage.prompt}↑ · {result.tokenUsage.completion}↓
                </span>

                {/* Score badge if rated */}
                {result.rating ? (
                  <ScoreBadge rating={result.rating} />
                ) : null}
              </div>

              {/* Rating */}
              <RatingComponent
                modelId={result.modelId}
                currentRating={result.rating}
                onRate={(rating) => onRate(result.modelId, rating)}
                className="shrink-0"
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}