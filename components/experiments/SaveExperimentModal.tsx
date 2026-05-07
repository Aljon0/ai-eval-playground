// components/experiments/SaveExperimentModal.tsx
// Modal dialog for naming and saving a completed experiment

"use client";

import { useState } from "react";
import { BookMarked, Tag, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Modal } from "@/components/ui/Modal";
import { Spinner } from "@/components/ui/Loader";
import type { ModelResult, ModelId } from "@/types";

// ─── Props ─────────────────────────────────────────────────────────────────

interface SaveExperimentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (name: string, tags: string[]) => Promise<void>;
  isSaving: boolean;
  prompt: string;
  selectedModels: ModelId[];
  results: ModelResult[];
}

// ─── Component ─────────────────────────────────────────────────────────────

export function SaveExperimentModal({
  isOpen,
  onClose,
  onSave,
  isSaving,
  prompt,
  selectedModels,
  results,
}: SaveExperimentModalProps) {
  const [name, setName] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [nameError, setNameError] = useState("");

  // ── Tag management ──────────────────────────────────────────────────────

  const addTag = () => {
    const trimmed = tagInput.trim().toLowerCase();
    if (!trimmed || tags.includes(trimmed) || tags.length >= 5) return;
    setTags((prev) => [...prev, trimmed]);
    setTagInput("");
  };

  const removeTag = (tag: string) => {
    setTags((prev) => prev.filter((t) => t !== tag));
  };

  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag();
    }
    if (e.key === "Backspace" && !tagInput && tags.length > 0) {
      setTags((prev) => prev.slice(0, -1));
    }
  };

  // ── Submit ──────────────────────────────────────────────────────────────

  const handleSubmit = async () => {
    const trimmedName = name.trim();
    if (!trimmedName) {
      setNameError("Experiment name is required.");
      return;
    }
    if (trimmedName.length < 3) {
      setNameError("Name must be at least 3 characters.");
      return;
    }
    setNameError("");
    await onSave(trimmedName, tags);
    // Reset form on success
    setName("");
    setTags([]);
    setTagInput("");
  };

  const handleClose = () => {
    if (isSaving) return;
    setName("");
    setTags([]);
    setTagInput("");
    setNameError("");
    onClose();
  };

  const successCount = results.filter((r) => r.status === "success").length;

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Save Experiment"
      description="Give this run a name so you can find it later."
      size="md"
    >
      <div className="space-y-5">

        {/* ── Run summary ── */}
        <div className="rounded-xl bg-gray-50 border border-gray-100 p-4 space-y-2">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-gray-400">
            Run Summary
          </p>

          {/* Prompt preview */}
          <div>
            <p className="text-[11px] text-gray-400 mb-0.5">Prompt</p>
            <p className="text-sm text-gray-700 line-clamp-2 leading-snug">
              {prompt || "—"}
            </p>
          </div>

          {/* Stats row */}
          <div className="flex items-center gap-4 pt-1">
            <div>
              <p className="text-[11px] text-gray-400">Models</p>
              <p className="text-sm font-medium text-gray-900">
                {selectedModels.length}
              </p>
            </div>
            <div>
              <p className="text-[11px] text-gray-400">Successful</p>
              <p className="text-sm font-medium text-emerald-700">
                {successCount}
              </p>
            </div>
            <div>
              <p className="text-[11px] text-gray-400">Failed</p>
              <p className="text-sm font-medium text-red-500">
                {results.length - successCount}
              </p>
            </div>
          </div>
        </div>

        {/* ── Experiment name ── */}
        <div className="space-y-1.5">
          <label
            htmlFor="experiment-name"
            className="text-sm font-medium text-gray-900"
          >
            Experiment Name
            <span className="text-red-400 ml-0.5">*</span>
          </label>
          <input
            id="experiment-name"
            type="text"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (nameError) setNameError("");
            }}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            placeholder="e.g. Code Generation Benchmark v2"
            maxLength={80}
            disabled={isSaving}
            className={cn(
              "w-full px-3.5 py-2.5 rounded-xl border text-sm",
              "text-gray-900 placeholder:text-gray-400",
              "focus:outline-none focus:ring-1 transition-all",
              nameError
                ? "border-red-300 focus:border-red-400 focus:ring-red-100"
                : "border-gray-200 focus:border-gray-400 focus:ring-gray-100",
              isSaving && "opacity-60 cursor-not-allowed"
            )}
            autoFocus
          />
          {nameError && (
            <p className="text-xs text-red-500">{nameError}</p>
          )}
          <p className="text-[11px] text-gray-400">
            {name.length} / 80 characters
          </p>
        </div>

        {/* ── Tags ── */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-gray-900 flex items-center gap-1.5">
            <Tag size={13} className="text-gray-400" />
            Tags
            <span className="text-gray-400 font-normal text-xs">
              (optional, max 5)
            </span>
          </label>

          {/* Tag chips + input */}
          <div
            className={cn(
              "flex flex-wrap items-center gap-1.5 px-3 py-2.5",
              "rounded-xl border border-gray-200 bg-white",
              "focus-within:border-gray-400 focus-within:ring-1",
              "focus-within:ring-gray-100 transition-all min-h-11"
            )}
          >
            {tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 px-2.5 py-1
                           rounded-full bg-gray-100 text-xs text-gray-700"
              >
                {tag}
                <button
                  onClick={() => removeTag(tag)}
                  className="text-gray-400 hover:text-gray-700 transition-colors"
                  aria-label={`Remove tag ${tag}`}
                  disabled={isSaving}
                >
                  <X size={10} />
                </button>
              </span>
            ))}

            {tags.length < 5 && (
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleTagKeyDown}
                onBlur={addTag}
                placeholder={tags.length === 0 ? "Add tags…" : ""}
                disabled={isSaving}
                className="flex-1 min-w-20 text-sm text-gray-900
                           placeholder:text-gray-400 focus:outline-none
                           bg-transparent"
              />
            )}
          </div>
          <p className="text-[11px] text-gray-400">
            Press Enter or comma to add a tag
          </p>
        </div>

        {/* ── Actions ── */}
        <div className="flex items-center gap-2.5 pt-1">
          <button
            onClick={handleClose}
            disabled={isSaving}
            className={cn(
              "flex-1 px-4 py-2.5 rounded-xl border border-gray-200",
              "text-sm font-medium text-gray-600 bg-white",
              "hover:bg-gray-50 hover:border-gray-300 transition-all",
              isSaving && "opacity-50 cursor-not-allowed"
            )}
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            disabled={isSaving || !name.trim()}
            className={cn(
              "flex-1 flex items-center justify-center gap-2",
              "px-4 py-2.5 rounded-xl text-sm font-semibold",
              "bg-gray-900 text-white shadow-sm",
              "hover:bg-gray-700 transition-all",
              (isSaving || !name.trim()) &&
                "opacity-60 cursor-not-allowed"
            )}
          >
            {isSaving ? (
              <>
                <Spinner size="sm" className="border-gray-600 border-t-white" />
                Saving…
              </>
            ) : (
              <>
                <BookMarked size={14} />
                Save Experiment
              </>
            )}
          </button>
        </div>
      </div>
    </Modal>
  );
}