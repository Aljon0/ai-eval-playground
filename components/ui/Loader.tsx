// components/ui/Loader.tsx
// Reusable spinner and skeleton loader components

import { cn } from "@/lib/utils";

// ─── Spinner ───────────────────────────────────────────────────────────────

interface SpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

const spinnerSizes = {
  sm: "w-4 h-4 border-2",
  md: "w-6 h-6 border-2",
  lg: "w-10 h-10 border-[3px]",
};

export function Spinner({ size = "md", className }: SpinnerProps) {
  return (
    <div
      role="status"
      aria-label="Loading"
      className={cn(
        "rounded-full border-gray-200 border-t-gray-800 animate-spin",
        spinnerSizes[size],
        className
      )}
    />
  );
}

// ─── Full-page Loader ──────────────────────────────────────────────────────

export function PageLoader() {
  return (
    <div className="flex items-center justify-center w-full h-64">
      <div className="flex flex-col items-center gap-3">
        <Spinner size="lg" />
        <p className="text-sm text-gray-500 animate-pulse">Loading...</p>
      </div>
    </div>
  );
}

// ─── Skeleton Block ────────────────────────────────────────────────────────

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-md bg-gray-100",
        className
      )}
    />
  );
}

// ─── Result Card Skeleton ──────────────────────────────────────────────────

export function ResultCardSkeleton() {
  return (
    <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Skeleton className="w-2.5 h-2.5 rounded-full" />
          <Skeleton className="w-28 h-4" />
        </div>
        <Skeleton className="w-16 h-5 rounded-full" />
      </div>

      {/* Response body */}
      <div className="space-y-2">
        <Skeleton className="w-full h-3" />
        <Skeleton className="w-full h-3" />
        <Skeleton className="w-5/6 h-3" />
        <Skeleton className="w-4/6 h-3" />
      </div>

      {/* Footer metrics */}
      <div className="flex gap-4 pt-2 border-t border-gray-50">
        <Skeleton className="w-20 h-3" />
        <Skeleton className="w-24 h-3" />
        <Skeleton className="w-16 h-3" />
      </div>
    </div>
  );
}