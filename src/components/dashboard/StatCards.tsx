import React from "react";
import { FileText, Sparkles, Layers, Flame } from "lucide-react";
import type { StatMetric } from "@/types";

const INITIAL_METRICS: StatMetric[] = [
  {
    id: "notes",
    title: "Total Notes",
    value: "—",
    changeLabel: "No study data connected",
    icon: FileText,
  },
  {
    id: "kits",
    title: "Study Kits",
    value: "—",
    changeLabel: "No study data connected",
    icon: Sparkles,
  },
  {
    id: "flashcards",
    title: "Flashcards Mastered",
    value: "—",
    changeLabel: "No study data connected",
    icon: Layers,
  },
  {
    id: "streak",
    title: "Study Streak",
    value: "—",
    changeLabel: "No activity recorded",
    icon: Flame,
  },
];

export function StatCards() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {INITIAL_METRICS.map((metric) => {
        const Icon = metric.icon;
        return (
          <div
            key={metric.id}
            className="group relative rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 transition-all duration-200 hover:border-[var(--color-primary)]/40 hover:shadow-lg hover:shadow-[var(--color-primary)]/5"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-zinc-400">
                {metric.title}
              </span>
              <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-secondary)] text-[var(--color-primary)] transition-colors group-hover:border-[var(--color-primary)]/30">
                <Icon className="h-4 w-4" />
              </div>
            </div>

            <div className="mt-3">
              <span className="text-2xl font-bold tracking-tight text-white">
                {metric.value}
              </span>
            </div>

            <div className="mt-2 flex items-center text-xs text-zinc-500">
              <span>{metric.changeLabel}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
