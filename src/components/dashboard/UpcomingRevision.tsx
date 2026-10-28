import React from "react";
import { CalendarClock, Clock } from "lucide-react";

export function UpcomingRevision() {
  return (
    <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
      <div className="flex items-center justify-between pb-4 border-b border-[var(--color-border)]">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-secondary)] text-[var(--color-primary)]">
            <CalendarClock className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-white">Upcoming Revision</h3>
            <p className="text-xs text-zinc-400">Scheduled spaced repetition sessions</p>
          </div>
        </div>
      </div>

      {/* Attractive Empty State (No fabricated metrics) */}
      <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-secondary)] text-zinc-400 shadow-inner">
          <Clock className="h-7 w-7 text-[var(--color-primary)]/80" />
        </div>

        <h4 className="mt-4 text-sm font-semibold text-white">
          No Scheduled Revisions
        </h4>

        <p className="mt-1.5 max-w-sm text-xs text-zinc-400 leading-relaxed">
          No revision tasks are available yet. Scheduled sessions will appear here when revision planning is connected.
        </p>

        <div className="mt-5 flex items-center gap-2 rounded-full border border-[var(--color-border)] bg-[var(--color-surface-secondary)] px-3 py-1 text-xs text-zinc-400">
          <Clock className="h-3.5 w-3.5" />
          <span>No tasks scheduled</span>
        </div>
      </div>
    </div>
  );
}
