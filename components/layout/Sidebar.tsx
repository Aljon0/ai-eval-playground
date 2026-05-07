// components/layout/Sidebar.tsx
// Collapsible sidebar with mobile overlay support

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FlaskConical,
  BookMarked,
  X,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Nav Items ─────────────────────────────────────────────────────────────

const NAV_ITEMS = [
  {
    label: "Dashboard",
    href: "/",
    icon: LayoutDashboard,
  },
  {
    label: "Playground",
    href: "/playground",
    icon: FlaskConical,
  },
  {
    label: "Experiments",
    href: "/experiments",
    icon: BookMarked,
  },
];

// ─── Props ─────────────────────────────────────────────────────────────────

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

// ─── Component ─────────────────────────────────────────────────────────────

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile backdrop overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/30 backdrop-blur-sm lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar panel */}
      <aside
        className={cn(
          // Base styles
          "fixed top-0 left-0 z-40 h-full w-64 bg-white border-r border-gray-100",
          "flex flex-col transition-transform duration-300 ease-in-out",
          // Mobile: slide in/out
          isOpen ? "translate-x-0" : "-translate-x-full",
          // Desktop: always visible, static
          "lg:static lg:translate-x-0 lg:z-auto"
        )}
        aria-label="Sidebar navigation"
      >
        {/* ── Logo / Brand ── */}
        <div className="flex items-center justify-between px-5 py-5 border-b border-gray-100">
          <Link
            href="/"
            className="flex items-center gap-2.5 group"
            onClick={onClose}
          >
            <div
              className="w-8 h-8 rounded-lg bg-gray-900 flex items-center
                            justify-center shrink-0 group-hover:bg-gray-700
                            transition-colors"
            >
              <Zap size={16} className="text-white" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900 leading-tight">
                EvalPlayground
              </p>
              <p className="text-[10px] text-gray-400 leading-tight">
                AI Systems Testing
              </p>
            </div>
          </Link>

          {/* Close button — mobile only */}
          <button
            onClick={onClose}
            className="lg:hidden p-1.5 rounded-lg text-gray-400 hover:text-gray-600
                       hover:bg-gray-100 transition-colors"
            aria-label="Close sidebar"
          >
            <X size={16} />
          </button>
        </div>

        {/* ── Navigation ── */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5">
          <p className="px-3 mb-2 text-[10px] font-semibold uppercase tracking-widest text-gray-400">
            Menu
          </p>

          {NAV_ITEMS.map(({ label, href, icon: Icon }) => {
            const isActive = pathname === href;

            return (
              <Link
                key={href}
                href={href}
                onClick={onClose}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm",
                  "transition-all duration-150 group",
                  isActive
                    ? "bg-gray-900 text-white font-medium shadow-sm"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                )}
                aria-current={isActive ? "page" : undefined}
              >
                <Icon
                  size={16}
                  className={cn(
                    "shrink-0 transition-colors",
                    isActive
                      ? "text-white"
                      : "text-gray-400 group-hover:text-gray-700"
                  )}
                />
                {label}
              </Link>
            );
          })}
        </nav>

        {/* ── Footer ── */}
        <div className="px-4 py-4 border-t border-gray-100">
          <div className="rounded-xl bg-gray-50 p-3.5">
            <p className="text-xs font-medium text-gray-700 mb-0.5">
              v1.0.0 — Beta
            </p>
            <p className="text-[11px] text-gray-400 leading-snug">
              Frontend only. Connect your backend to activate live model calls.
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}