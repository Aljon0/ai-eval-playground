// components/ui/Badge.tsx
// Status and label badges used throughout the UI

import { cn } from "@/lib/utils";
import type { EvalStatus } from "@/types";
import { Spinner } from "./Loader";

// ─── Status Badge ──────────────────────────────────────────────────────────

interface StatusBadgeProps {
  status: EvalStatus;
  className?: string;
}

const statusConfig: Record <
  EvalStatus,
  { label: string; classes: string; dot?: string }
> = {
  idle: {
    label: "Idle",
    classes: "bg-gray-100 text-gray-500",
    dot: "bg-gray-400",
  },
  loading: {
    label: "Running",
    classes: "bg-amber-50 text-amber-700",
  },
  success: {
    label: "Success",
    classes: "bg-emerald-50 text-emerald-700",
    dot: "bg-emerald-500",
  },
  error: {
    label: "Error",
    classes: "bg-red-50 text-red-600",
    dot: "bg-red-500",
  },
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium",
        config.classes,
        className
      )}
    >
      {status === "loading" ? (
        <Spinner size="sm" />
      ) : (
        config.dot && (
          <span className={cn("w-1.5 h-1.5 rounded-full", config.dot)} />
        )
      )}
      {config.label}
    </span>
  );
}

// ─── Generic Label Badge ───────────────────────────────────────────────────

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "outline" | "muted";
  className?: string;
}

const badgeVariants = {
  default: "bg-gray-900 text-white",
  outline: "border border-gray-200 text-gray-600 bg-white",
  muted: "bg-gray-100 text-gray-600",
};

export function Badge({
  children,
  variant = "muted",
  className,
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
        badgeVariants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}

// ─── Model Color Dot ───────────────────────────────────────────────────────

interface ModelDotProps {
  color: string;
  className?: string;
}

export function ModelDot({ color, className }: ModelDotProps) {
  return (
    <span
      className={cn("inline-block w-2.5 h-2.5 rounded-full shrink-0", className)}
      style={{ backgroundColor: color }}
    />
  );
}