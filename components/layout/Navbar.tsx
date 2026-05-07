// components/layout/Navbar.tsx
// Top navigation bar with mobile hamburger toggle

"use client";

import { usePathname } from "next/navigation";
import { Menu, Bell, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Page title map ────────────────────────────────────────────────────────

const PAGE_TITLES: Record<string, { title: string; description: string }> = {
  "/": {
    title: "Dashboard",
    description: "Overview of your evaluation activity",
  },
  "/playground": {
    title: "Playground",
    description: "Test and compare AI models in real time",
  },
  "/experiments": {
    title: "Experiments",
    description: "Browse and manage your saved runs",
  },
};

// ─── Props ─────────────────────────────────────────────────────────────────

interface NavbarProps {
  onMenuClick: () => void;
}

// ─── Component ─────────────────────────────────────────────────────────────

export function Navbar({ onMenuClick }: NavbarProps) {
  const pathname = usePathname();
  const page = PAGE_TITLES[pathname] ?? {
    title: "EvalPlayground",
    description: "",
  };

  return (
    <header
      className={cn(
        "sticky top-0 z-20 w-full bg-white/90 backdrop-blur-md",
        "border-b border-gray-100 shadow-sm"
      )}
    >
      <div className="flex items-center justify-between px-4 md:px-6 h-14">

        {/* ── Left: Hamburger + Page Title ── */}
        <div className="flex items-center gap-3 min-w-0">
          {/* Hamburger — mobile only */}
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 -ml-1 rounded-lg text-gray-500
                       hover:bg-gray-100 hover:text-gray-900 transition-colors
                       shrink-0"
            aria-label="Open navigation menu"
          >
            <Menu size={18} />
          </button>

          {/* Page title */}
          <div className="min-w-0">
            <h1 className="text-sm font-semibold text-gray-900 truncate">
              {page.title}
            </h1>
            {page.description && (
              <p className="text-[11px] text-gray-400 truncate hidden sm:block">
                {page.description}
              </p>
            )}
          </div>
        </div>

        {/* ── Right: Actions ── */}
        <div className="flex items-center gap-1.5 shrink-0">
          {/* GitHub link */}
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-lg text-gray-400 hover:text-gray-700
                       hover:bg-gray-100 transition-colors"
            aria-label="View on GitHub"
          >
            <ExternalLink size={17} />
          </a>

          {/* Notifications (UI only) */}
          <button
            className="relative p-2 rounded-lg text-gray-400
                       hover:text-gray-700 hover:bg-gray-100 transition-colors"
            aria-label="Notifications"
          >
            <Bell size={17} />
            {/* Unread dot */}
            <span
              className="absolute top-1.5 right-1.5 w-1.5 h-1.5
                            rounded-full bg-gray-900"
            />
          </button>

          {/* Avatar */}
          <button
            className="ml-1 w-8 h-8 rounded-full bg-gray-900 flex items-center
                       justify-center text-white text-xs font-semibold
                       hover:bg-gray-700 transition-colors shrink-0"
            aria-label="User profile"
          >
            EP
          </button>
        </div>
      </div>
    </header>
  );
}