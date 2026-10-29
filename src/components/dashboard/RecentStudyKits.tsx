import React from "react";
import Link from "next/link";
import { FolderPlus, BookOpen } from "lucide-react";

export function RecentStudyKits() {
  return (
    <div className="dashboard-panel border border-[var(--color-border)] p-5 sm:p-6">
      <div className="flex items-center justify-between pb-4 border-b border-[var(--color-border)]">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-secondary)] text-[var(--color-primary)]">
            <BookOpen className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-white">Recent Study Kits</h3>
            <p className="text-xs text-zinc-400">Saved study materials and learning tools</p>
          </div>
        </div>
      </div>

      {/* Attractive Empty State (No fabricated data) */}
      <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-secondary)] text-zinc-400 shadow-inner">
          <FolderPlus className="h-7 w-7 text-[var(--color-primary)]/80" />
        </div>

        <h4 className="mt-4 text-sm font-semibold text-white">
          No Study Kits Found
        </h4>

        <p className="mt-1.5 max-w-sm text-xs text-zinc-400 leading-relaxed">
          Saved kits will appear here when available. Add study material to get started; AI-generated content is not connected yet.
        </p>

        <Link
          href="/notes"
          className="mt-5 inline-flex items-center gap-2 rounded-lg border border-[var(--color-primary)]/30 bg-[var(--color-primary)]/10 px-4 py-2 text-xs font-medium text-indigo-300 transition-colors hover:bg-[var(--color-primary)]/20 hover:border-[var(--color-primary)]/50 cursor-pointer"
        >
          <FolderPlus className="h-3.5 w-3.5 text-[var(--color-primary)]" />
          <span>Add Study Material</span>
        </Link>
      </div>
    </div>
  );
}
