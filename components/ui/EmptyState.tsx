// components/ui/EmptyState.tsx
// Reusable empty state placeholder with icon, title, description, and CTA

import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
  size?: "sm" | "md" | "lg";
}

const sizeConfig = {
  sm: {
    wrapper: "py-8",
    icon: "w-8 h-8",
    iconWrapper: "w-14 h-14",
    title: "text-sm font-medium",
    description: "text-xs",
    button: "text-xs px-3 py-1.5",
  },
  md: {
    wrapper: "py-14",
    icon: "w-10 h-10",
    iconWrapper: "w-18 h-18",
    title: "text-base font-semibold",
    description: "text-sm",
    button: "text-sm px-4 py-2",
  },
  lg: {
    wrapper: "py-20",
    icon: "w-12 h-12",
    iconWrapper: "w-22 h-22",
    title: "text-lg font-semibold",
    description: "text-sm",
    button: "text-sm px-5 py-2.5",
  },
};

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
  size = "md",
}: EmptyStateProps) {
  const s = sizeConfig[size];

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center",
        s.wrapper,
        className
      )}
    >
      {/* Icon container */}
      <div
        className={cn(
          "flex items-center justify-center rounded-2xl bg-gray-50 mb-4",
          "w-16 h-16"
        )}
      >
        <Icon className={cn("text-gray-400", s.icon)} strokeWidth={1.5} />
      </div>

      {/* Text */}
      <h3 className={cn("text-gray-900", s.title)}>{title}</h3>

      {description && (
        <p className={cn("mt-1.5 text-gray-500 max-w-xs", s.description)}>
          {description}
        </p>
      )}

      {/* CTA button */}
      {action && (
        <button
          onClick={action.onClick}
          className={cn(
            "mt-5 font-medium rounded-lg bg-gray-900 text-white",
            "hover:bg-gray-700 transition-colors",
            s.button
          )}
        >
          {action.label}
        </button>
      )}
    </div>
  );
}