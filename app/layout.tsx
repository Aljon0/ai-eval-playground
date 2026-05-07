// app/layout.tsx
// Root layout — wraps all pages with AppShell (Sidebar + Navbar)

import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { AppShell } from "@/components/layout/AppShell";
import "./globals.css";

// ─── Fonts ─────────────────────────────────────────────────────────────────

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

// ─── Metadata ──────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  title: {
    default: "EvalPlayground — AI Systems Evaluation",
    template: "%s | EvalPlayground",
  },
  description:
    "Test, compare, and benchmark AI models side by side. Evaluate prompts across multiple LLMs with latency tracking and response rating.",
  keywords: [
    "AI evaluation",
    "LLM benchmark",
    "model comparison",
    "prompt testing",
    "Mistral",
    "Groq",
    "LLaMA",
  ],
  authors: [{ name: "EvalPlayground" }],
  robots: "noindex, nofollow", // private tool
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#ffffff",
};

// ─── Layout ────────────────────────────────────────────────────────────────

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable}`}
      suppressHydrationWarning
    >
      <body>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}