// components/playground/PromptInput.tsx
// Textarea for entering evaluation prompts with character count and clear button

"use client";

import { useRef, useEffect } from "react";
import { X, Lightbulb } from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Example prompts for quick-start ──────────────────────────────────────

const EXAMPLE_PROMPTS = [
  "Explain the difference between TCP and UDP in simple terms.",
  "Write a Python function to find all prime numbers up to N using the Sieve of Eratosthenes.",
  "Summarize the key principles of clean code architecture.",
  "What are the trade-offs between SQL and NoSQL databases?",
];

// ─── Props ─────────────────────────────────────────────────────────────────

interface PromptInputProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  className?: string;
}

const MAX_CHARS = 2000;

// ─── Component ─────────────────────────────────────────────────────────────

export function PromptInput({
  value,
  onChange,
  disabled = false,
  className,
}: PromptInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea height based on content
  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    textarea.style.height = "auto";
    textarea.style.height = `${Math.min(textarea.scrollHeight, 320)}px`;
  }, [value]);

  const charCount = value.length;
  const isNearLimit = charCount > MAX_CHARS * 0.85;
  const isAtLimit = charCount >= MAX_CHARS;

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (e.target.value.length <= MAX_CHARS) {
      onChange(e.target.value);
    }
  };

  const handleClear = () => {
    onChange("");
    textareaRef.current?.focus();
  };

  const handleExampleClick = (prompt: string) => {
    onChange(prompt);
    textareaRef.current?.focus();
  };

  return (
    <div className={cn("space-y-3", className)}>

      {/* ── Label ── */}
      <div className="flex items-center justify-between">
        <label
          htmlFor="prompt-input"
          className="text-sm font-medium text-gray-900"
        >
          Prompt
        </label>
        <span
          className={cn(
            "text-xs tabular-nums transition-colors",
            isAtLimit
              ? "text-red-500 font-medium"
              : isNearLimit
              ? "text-amber-500"
              : "text-gray-400"
          )}
        >
          {charCount} / {MAX_CHARS}
        </span>
      </div>

      {/* ── Textarea wrapper ── */}
      <div
        className={cn(
          "relative rounded-xl border bg-white transition-all duration-150",
          "shadow-sm",
          disabled
            ? "border-gray-100 bg-gray-50 cursor-not-allowed"
            : isAtLimit
            ? "border-red-300 ring-1 ring-red-200"
            : "border-gray-200 focus-within:border-gray-400 focus-within:ring-1 focus-within:ring-gray-200"
        )}
      >
        <textarea
          ref={textareaRef}
          id="prompt-input"
          value={value}
          onChange={handleChange}
          disabled={disabled}
          placeholder="Enter your prompt here… e.g. 'Explain transformer attention mechanisms'"
          rows={4}
          className={cn(
            "w-full resize-none rounded-xl bg-transparent px-4 pt-4 pb-10",
            "text-sm text-gray-900 placeholder:text-gray-400",
            "focus:outline-none leading-relaxed",
            "min-h-30",
            disabled && "cursor-not-allowed text-gray-400"
          )}
          aria-label="Prompt input"
          aria-describedby="prompt-char-count"
        />

        {/* Clear button — shown when text exists */}
        {value && !disabled && (
          <button
            onClick={handleClear}
            className="absolute top-3 right-3 p-1 rounded-md text-gray-300
                       hover:text-gray-600 hover:bg-gray-100 transition-colors"
            aria-label="Clear prompt"
            type="button"
          >
            <X size={14} />
          </button>
        )}

        {/* Bottom bar with hint */}
        <div
          className="absolute bottom-0 left-0 right-0 px-4 py-2
                      flex items-center justify-between
                      border-t border-gray-100 rounded-b-xl"
        >
          <span className="text-[11px] text-gray-400">
            {disabled ? "Running evaluation…" : "Shift + Enter for new line"}
          </span>
        </div>
      </div>

      {/* ── Example prompts ── */}
      {!value && !disabled && (
        <div className="space-y-2">
          <div className="flex items-center gap-1.5">
            <Lightbulb size={12} className="text-gray-400" />
            <span className="text-[11px] text-gray-400 font-medium uppercase tracking-wide">
              Try an example
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {EXAMPLE_PROMPTS.map((prompt, i) => (
              <button
                key={i}
                onClick={() => handleExampleClick(prompt)}
                className={cn(
                  "text-[11px] px-3 py-1.5 rounded-lg border border-gray-200",
                  "text-gray-600 bg-white hover:bg-gray-50 hover:border-gray-300",
                  "transition-all duration-150 text-left leading-snug",
                  "max-w-50 truncate"
                )}
                title={prompt}
                type="button"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}