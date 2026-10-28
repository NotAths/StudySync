import React from "react";
import Link from "next/link";
import { Plus, Sparkles, UploadCloud, BookOpen, BrainCircuit } from "lucide-react";

export function CreateKitCard() {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-[var(--color-primary)]/30 bg-gradient-to-br from-[var(--color-surface)] via-[var(--color-surface)] to-[var(--color-surface-secondary)] p-6 sm:p-8 shadow-xl shadow-black/40">
      {/* Subtle background glow */}
      <div
        className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[var(--color-primary)]/10 blur-3xl"
        aria-hidden="true"
      />

      <div className="relative flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-center">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-[var(--color-primary)]/40 bg-[var(--color-primary)]/15 px-3 py-1 text-xs font-semibold text-indigo-300">
            <Sparkles className="h-3.5 w-3.5 text-[var(--color-primary)]" />
            <span>AI generation coming soon</span>
          </div>

          <h3 className="mt-3 text-xl font-bold tracking-tight text-white sm:text-2xl">
            Create a Study Kit
          </h3>

          <p className="mt-2 text-sm leading-relaxed text-zinc-300 sm:text-base">
            Add your notes or a PDF to prepare study material. AI-generated flashcards, summaries, and quizzes will be available in a later step.
          </p>

          <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-zinc-400">
            <span className="flex items-center gap-1.5">
              <UploadCloud className="h-4 w-4 text-[var(--color-primary)]" />
              PDF input
            </span>
            <span className="flex items-center gap-1.5">
              <BookOpen className="h-4 w-4 text-[var(--color-primary)]" />
              Notes workspace
            </span>
            <span className="flex items-center gap-1.5">
              <BrainCircuit className="h-4 w-4 text-[var(--color-primary)]" />
              AI tools coming soon
            </span>
          </div>
        </div>

        <div className="w-full shrink-0 lg:w-auto">
          <Link
            href="/notes"
            className="group inline-flex w-full sm:w-auto items-center justify-center gap-2.5 rounded-xl bg-[var(--color-primary)] px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-[var(--color-primary)]/30 transition-all duration-200 hover:bg-[var(--color-primary)]/90 hover:shadow-[var(--color-primary)]/40 active:scale-[0.98] cursor-pointer"
          >
            <Plus className="h-4 w-4 transition-transform group-hover:rotate-90 duration-200" />
            <span>Add Study Notes</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
