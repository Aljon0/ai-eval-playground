// next.config.ts
// Next.js configuration

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // ── React strict mode for catching side-effect bugs ────────────────────
  reactStrictMode: true,

  // ── Image optimization ─────────────────────────────────────────────────
  images: {
    remotePatterns: [
      // Allow external avatar/image URLs if needed later
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
      },
    ],
    formats: ["image/avif", "image/webp"],
  },

  // ── Compiler options ───────────────────────────────────────────────────
  compiler: {
    // Remove console.log in production builds
    removeConsole:
      process.env.NODE_ENV === "production"
        ? { exclude: ["error", "warn"] }
        : false,
  },

  // ── Headers for security ───────────────────────────────────────────────
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options",        value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy",        value: "strict-origin-when-cross-origin" },
        ],
      },
    ];
  },

  // ── Environment variable exposure ──────────────────────────────────────
  env: {
    NEXT_PUBLIC_APP_VERSION: "1.0.0",
  },
};

export default nextConfig;