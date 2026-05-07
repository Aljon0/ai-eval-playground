// components/layout/AppShell.tsx
// Root layout shell — composes Sidebar + Navbar + main content area

"use client";

import { Sidebar } from "./Sidebar";
import { Navbar } from "./Navbar";
import { useSidebar } from "@/hooks/useSidebar";
import { cn } from "@/lib/utils";

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const { isOpen, toggle, close } = useSidebar();

  return (
    <div className="flex h-screen w-full overflow-hidden bg-gray-50">

      {/* ── Sidebar ── */}
      <Sidebar isOpen={isOpen} onClose={close} />

      {/* ── Main area (Navbar + Page content) ── */}
      <div
        className={cn(
          "flex flex-col flex-1 min-w-0 overflow-hidden",
          // On desktop, push content right when sidebar is present
          "lg:ml-0"
        )}
      >
        {/* Top navbar */}
        <Navbar onMenuClick={toggle} />

        {/* Scrollable page content */}
        <main
          className="flex-1 overflow-y-auto"
          id="main-content"
        >
          <div className="px-4 py-6 md:px-6 md:py-8 max-w-screen-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}