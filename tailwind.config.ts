// tailwind.config.ts
// Tailwind CSS configuration with custom tokens and responsive breakpoints

import type { Config } from "tailwindcss";

const config: Config = {
  // ── Purge paths ───────────────────────────────────────────────────────────
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./hooks/**/*.{js,ts,jsx,tsx}",
    "./lib/**/*.{js,ts,jsx,tsx}",
  ],

  theme: {
    extend: {
      // ── Font families ──────────────────────────────────────────────────────
      fontFamily: {
        sans: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "monospace"],
      },

      // ── Custom colors ──────────────────────────────────────────────────────
      colors: {
        // Neutral palette extensions
        gray: {
          25:  "#fcfcfd",
          50:  "#f9fafb",
          75:  "#f5f6f7",
          100: "#f2f4f7",
          150: "#eaecf0",
          200: "#d0d5dd",
          300: "#98a2b3",
          400: "#667085",
          500: "#475467",
          600: "#344054",
          700: "#1d2939",
          800: "#101828",
          900: "#0d1117",
          950: "#080d13",
        },

        // Semantic colors
        brand: {
          50:  "#f5f5ff",
          100: "#ebebff",
          500: "#6366f1",
          600: "#4f46e5",
          900: "#1e1b4b",
        },
      },

      // ── Spacing ────────────────────────────────────────────────────────────
      spacing: {
        "18": "4.5rem",
        "22": "5.5rem",
        "sidebar": "16rem",
      },

      // ── Border radius ──────────────────────────────────────────────────────
      borderRadius: {
        "xl":  "0.75rem",
        "2xl": "1rem",
        "3xl": "1.5rem",
      },

      // ── Box shadows ────────────────────────────────────────────────────────
      boxShadow: {
        "xs":   "0 1px 2px 0 rgba(16, 24, 40, 0.05)",
        "sm":   "0 1px 3px 0 rgba(16, 24, 40, 0.10), 0 1px 2px -1px rgba(16,24,40,0.10)",
        "md":   "0 4px 8px -2px rgba(16, 24, 40, 0.10), 0 2px 4px -2px rgba(16,24,40,0.06)",
        "lg":   "0 12px 16px -4px rgba(16, 24, 40, 0.08), 0 4px 6px -2px rgba(16,24,40,0.03)",
        "xl":   "0 20px 24px -4px rgba(16, 24, 40, 0.08), 0 8px 8px -4px rgba(16,24,40,0.03)",
        "card": "0 1px 4px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.04)",
      },

      // ── Typography ─────────────────────────────────────────────────────────
      fontSize: {
        "2xs": ["0.625rem", { lineHeight: "0.875rem" }],
        "xs":  ["0.75rem",  { lineHeight: "1.125rem" }],
        "sm":  ["0.875rem", { lineHeight: "1.375rem" }],
        "base":["1rem",     { lineHeight: "1.5rem"   }],
        "lg":  ["1.125rem", { lineHeight: "1.75rem"  }],
        "xl":  ["1.25rem",  { lineHeight: "1.875rem" }],
        "2xl": ["1.5rem",   { lineHeight: "2rem"     }],
        "3xl": ["1.875rem", { lineHeight: "2.375rem" }],
      },

      // ── Animation ──────────────────────────────────────────────────────────
      keyframes: {
        "fade-in": {
          "0%":   { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "fade-in-up": {
          "0%":   { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "zoom-in": {
          "0%":   { opacity: "0", transform: "scale(0.96)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        "slide-in-left": {
          "0%":   { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(0)" },
        },
        "shimmer": {
          "0%":   { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition:  "200% 0" },
        },
      },

      animation: {
        "fade-in":       "fade-in 0.2s ease-out both",
        "fade-in-up":    "fade-in-up 0.3s ease-out both",
        "zoom-in":       "zoom-in 0.2s ease-out both",
        "slide-in-left": "slide-in-left 0.3s ease-out both",
        "shimmer":       "shimmer 1.6s linear infinite",
      },

      // ── Transitions ────────────────────────────────────────────────────────
      transitionTimingFunction: {
        "spring": "cubic-bezier(0.34, 1.56, 0.64, 1)",
      },

      // ── Screen breakpoints (mobile-first) ──────────────────────────────────
      screens: {
        "xs":  "375px",
        "sm":  "640px",
        "md":  "768px",
        "lg":  "1024px",
        "xl":  "1280px",
        "2xl": "1536px",
      },
    },
  },

  plugins: [],
};

export default config;