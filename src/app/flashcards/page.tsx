"use client";

import { useState } from "react";
import {
  BookOpen,
  Check,
  ChevronLeft,
  ChevronRight,
  Layers,
  RotateCcw,
  Sparkles,
} from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";

export default function FlashcardsPage() {
  const [topic, setTopic] = useState("");
  const [showAnswer, setShowAnswer] = useState(false);

  return (
    <AppLayout title="Flashcards">
      <div className="space-y-8 pb-12">
        <section>
          <div className="inline-flex items-center gap-2 rounded-full border border-[var(--color-primary)]/30 bg-[var(--color-primary)]/10 px-3 py-1 text-xs font-medium text-indigo-300">
            <Layers className="h-3.5 w-3.5 text-[var(--color-primary)]" />
            <span>Learn at your own pace</span>
          </div>
          <h2 className="mt-3 text-2xl font-bold tracking-tight text-white sm:text-3xl">
            Flashcards
          </h2>
          <p className="mt-1 max-w-2xl text-sm leading-relaxed text-zinc-400 sm:text-base">
            Review key ideas with focused flashcards. Your generated cards will
            be available here once study-kit generation is connected.
          </p>
        </section>

        <section className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 sm:p-7">
          <div className="grid gap-5 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] md:items-end">
            <div>
              <label
                htmlFor="flashcard-kit"
                className="mb-2 block text-sm font-medium text-slate-200"
              >
                Study kit
              </label>
              <select
                id="flashcard-kit"
                disabled
                defaultValue=""
                className="h-11 w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-secondary)] px-3.5 text-sm text-zinc-400 outline-none disabled:cursor-not-allowed disabled:opacity-80"
              >
                <option value="">No saved study kits available yet</option>
              </select>
              <p className="mt-1.5 text-xs text-zinc-500">
                Saved study kits will appear here when available.
              </p>
            </div>
            <div>
              <label
                htmlFor="flashcard-topic"
                className="mb-2 block text-sm font-medium text-slate-200"
              >
                Or explore a topic
              </label>
              <input
                id="flashcard-topic"
                type="text"
                value={topic}
                onChange={(event) => setTopic(event.currentTarget.value)}
                placeholder="e.g. Photosynthesis"
                className="h-11 w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-secondary)] px-3.5 text-sm text-slate-100 placeholder-zinc-500 outline-none transition focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/30"
              />
            </div>
          </div>
        </section>

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.25fr)_minmax(280px,0.75fr)]">
          <section className="overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)]">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--color-border)] px-5 py-4 sm:px-6">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-secondary)] text-[var(--color-primary)]">
                  <BookOpen className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white">
                    Flashcard preview
                  </h3>
                  <p className="text-xs text-zinc-400">Illustrative example</p>
                </div>
              </div>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-300/20 bg-amber-300/5 px-2.5 py-1 text-[11px] font-medium text-amber-200">
                <Sparkles className="h-3 w-3" />
                Design preview · not saved data
              </span>
            </div>

            <div className="p-5 sm:p-8">
              <button
                type="button"
                onClick={() => setShowAnswer((visible) => !visible)}
                aria-pressed={showAnswer}
                aria-label={showAnswer ? "Show sample question" : "Show sample answer"}
                className="group relative flex min-h-64 w-full flex-col items-center justify-center overflow-hidden rounded-2xl border border-[var(--color-primary)]/25 bg-gradient-to-br from-[var(--color-surface-secondary)] via-[var(--color-surface)] to-[var(--color-surface)] px-6 py-10 text-center transition hover:border-[var(--color-primary)]/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] sm:min-h-72 sm:px-10"
              >
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute -right-10 -top-14 h-44 w-44 rounded-full bg-[var(--color-primary)]/10 blur-3xl"
                />
                <span className="relative text-[11px] font-semibold uppercase tracking-[0.18em] text-indigo-300">
                  {showAnswer ? "Sample answer" : "Sample question"}
                </span>
                <span className="relative mt-5 max-w-xl text-xl font-semibold leading-relaxed text-white sm:text-2xl">
                  {showAnswer
                    ? "The process by which plants convert light energy into chemical energy."
                    : "What is photosynthesis?"}
                </span>
                <span className="relative mt-8 inline-flex items-center gap-2 rounded-full border border-[var(--color-border)] bg-[var(--color-surface-secondary)]/80 px-3 py-1.5 text-xs text-zinc-300 transition group-hover:border-[var(--color-primary)]/40">
                  <RotateCcw className="h-3.5 w-3.5 text-[var(--color-primary)]" />
                  Click to {showAnswer ? "see question" : "reveal answer"}
                </span>
              </button>

              <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
                <p className="text-xs text-zinc-500">
                  Preview only · this card is not part of a saved deck
                </p>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    disabled
                    aria-label="Previous flashcard (unavailable in preview)"
                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-secondary)] text-zinc-500 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <span className="px-1 text-xs tabular-nums text-zinc-400">
                    Preview
                  </span>
                  <button
                    type="button"
                    disabled
                    aria-label="Next flashcard (unavailable in preview)"
                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-secondary)] text-zinc-500 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </section>

          <section className="flex flex-col rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 sm:p-6">
            <div className="flex items-center gap-2.5 border-b border-[var(--color-border)] pb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-secondary)] text-[var(--color-primary)]">
                <Layers className="h-4 w-4" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-white">
                  Your flashcards
                </h3>
                <p className="text-xs text-zinc-400">Generated decks</p>
              </div>
            </div>

            <div className="flex flex-1 flex-col items-center justify-center px-3 py-10 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-secondary)] text-[var(--color-primary)]">
                <BookOpen className="h-7 w-7" />
              </div>
              <h4 className="mt-4 text-sm font-semibold text-white">
                No generated flashcards yet
              </h4>
              <p className="mt-1.5 max-w-xs text-xs leading-relaxed text-zinc-400">
                Flashcards will appear here after AI generation is connected.
                The preview card is illustrative only; no deck or progress is
                saved.
              </p>
              <div className="mt-5 flex items-center gap-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-secondary)] px-3 py-2 text-xs text-zinc-400">
                <Check className="h-3.5 w-3.5 text-zinc-500" />
                <span>Revision tracking is not available yet</span>
              </div>
            </div>
          </section>
        </div>
      </div>
    </AppLayout>
  );
}
