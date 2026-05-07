// hooks/useSidebar.ts
// Manages sidebar open/close state with mobile awareness

import { useState, useEffect, useCallback } from "react";

interface UseSidebarReturn {
  isOpen: boolean;
  toggle: () => void;
  close: () => void;
  open: () => void;
}

export function useSidebar(): UseSidebarReturn {
  // Default open on desktop, closed on mobile
  const [isOpen, setIsOpen] = useState<boolean>(false);

  // On mount, open sidebar if screen is large enough
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsOpen(true);
      } else {
        setIsOpen(false);
      }
    };

    // Set initial state
    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Close sidebar when pressing Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const toggle = useCallback(() => setIsOpen((prev) => !prev), []);
  const close = useCallback(() => setIsOpen(false), []);
  const open = useCallback(() => setIsOpen(true), []);

  return { isOpen, toggle, close, open };
}