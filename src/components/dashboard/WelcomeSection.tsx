import React from "react";
import { Sparkles, Calendar } from "lucide-react";
import { APP_CONFIG } from "@/lib/constants";

export function WelcomeSection() {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <div className="inline-flex items-center gap-2 rounded-full border border-[var(--color-primary)]/30 bg-[var(--color-primary)]/10 px-3 py-1 text-xs font-medium text-indigo-300 mb-2">
          <Sparkles className="h-3.5 w-3.5 text-[var(--color-primary)]" />
          <span>Study Workspace</span>
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
          Welcome to {APP_CONFIG.name}
        </h2>
        <p className="mt-1 text-sm text-zinc-400">
          {APP_CONFIG.tagline} Organise your knowledge and master your subjects.
        </p>
      </div>

      <div className="flex items-center gap-2 self-start sm:self-auto rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-xs text-zinc-400">
        <Calendar className="h-3.5 w-3.5 text-zinc-400" />
        <span>Ready to study</span>
      </div>
    </div>
  );
}
