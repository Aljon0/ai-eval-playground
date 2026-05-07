// components/dashboard/StatsCard.tsx
// Summary metric card for the dashboard overview

import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

// ─── Props ─────────────────────────────────────────────────────────────────

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: {
    value: string;
    positive: boolean;
  };
  className?: string;
}

// ─── Component ─────────────────────────────────────────────────────────────

export function StatsCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  className,
}: StatsCardProps) {
  return (
    <div
      className={cn(
        "rounded-xl border border-gray-100 bg-white p-5 shadow-sm",
        "hover:shadow-md transition-shadow duration-200",
        className
      )}
    >
      {/* Header row */}
      <div className="flex items-start justify-between mb-4">
        <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">
          {title}
        </p>
        <div
          className="w-8 h-8 rounded-lg bg-gray-50 border border-gray-100
                      flex items-center justify-center shrink-0"
        >
          <Icon size={15} className="text-gray-500" />
        </div>
      </div>

      {/* Value */}
      <p className="text-3xl font-bold text-gray-900 tabular-nums leading-none">
        {value}
      </p>

      {/* Subtitle + trend */}
      <div className="mt-2 flex items-center gap-2 flex-wrap">
        {subtitle && (
          <p className="text-xs text-gray-500">{subtitle}</p>
        )}
        {trend && (
          <span
            className={cn(
              "inline-flex items-center text-[11px] font-medium px-1.5 py-0.5 rounded-full",
              trend.positive
                ? "bg-emerald-50 text-emerald-700"
                : "bg-red-50 text-red-600"
            )}
          >
            {trend.positive ? "↑" : "↓"} {trend.value}
          </span>
        )}
      </div>
    </div>
  );
}