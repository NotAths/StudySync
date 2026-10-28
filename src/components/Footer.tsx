import React from "react";
import { APP_CONFIG } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-white/[0.06] bg-[var(--color-surface)]/60 py-8">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 text-center text-sm text-zinc-500 sm:flex-row sm:px-6 lg:px-8">
        <p>
          &copy; 2026 {APP_CONFIG.name}. {APP_CONFIG.tagline}
        </p>
        <p className="text-xs text-zinc-600">
          AI-Powered Study Assistant &bull; Foundation Setup
        </p>
      </div>
    </footer>
  );
}
