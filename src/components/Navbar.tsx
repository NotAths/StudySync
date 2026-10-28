import React from "react";
import { Sparkles } from "lucide-react";
import { APP_CONFIG } from "@/lib/constants";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/[0.06] bg-[var(--color-surface)]/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600/15 border border-indigo-500/30 text-indigo-400 shadow-sm shadow-indigo-500/10">
            <Sparkles className="h-5 w-5" />
          </div>
          <span className="text-lg font-semibold tracking-tight text-white">
            {APP_CONFIG.name}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span className="inline-flex items-center rounded-full border border-indigo-500/20 bg-indigo-500/10 px-2.5 py-0.5 text-xs font-medium text-indigo-300">
            Foundation v0.1
          </span>
        </div>
      </div>
    </header>
  );
}

