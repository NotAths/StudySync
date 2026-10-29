"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import {
  AlertCircle,
  BookOpen,
  Check,
  ChevronLeft,
  ChevronRight,
  Layers,
  RotateCcw,
  Sparkles,
} from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import {
  getServerStudyKitsSnapshot,
  getStudyKitsSnapshot,
  subscribeToStudyKits,
} from "@/lib/study-kits";
import {
  getServerStudyActivitySnapshot,
  getStudyActivitySnapshot,
  recordFlashcardReview,
  subscribeToStudyActivity,
} from "@/lib/study-activity";

export default function FlashcardsPage() {
  const { kits, error: storageError } = useSyncExternalStore(
    subscribeToStudyKits,
    getStudyKitsSnapshot,
    getServerStudyKitsSnapshot,
  );
  const {
    flashcardReviews,
    error: activityError,
  } = useSyncExternalStore(
    subscribeToStudyActivity,
    getStudyActivitySnapshot,
    getServerStudyActivitySnapshot,
  );
  const [selectedKitId, setSelectedKitId] = useState("");
  const [cardIndex, setCardIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [reviewError, setReviewError] = useState("");
  const cardStartedAt = useRef<number | null>(null);

  const selectedKit =
    kits.find((kit) => kit.id === selectedKitId) ?? kits[0] ?? null;
  const selectedCard = selectedKit?.flashcards[cardIndex];
  const cardReviews = selectedKit
    ? flashcardReviews.filter(
        (review) =>
          review.kitId === selectedKit.id && review.cardIndex === cardIndex,
      )
    : [];
  const isKnown = cardReviews.at(-1)?.known ?? false;

  useEffect(() => {
    if (selectedKit && selectedCard) cardStartedAt.current = Date.now();
  }, [selectedKit, cardIndex, selectedCard]);

  function recordCurrentReview(known: boolean, now: number, force = false) {
    if (!selectedKit || (!showAnswer && !force)) return;

    try {
      recordFlashcardReview({
        kitId: selectedKit.id,
        cardIndex,
        known,
        durationSeconds: Math.min(
          3600,
          Math.floor((now - (cardStartedAt.current ?? now)) / 1000),
        ),
      });
      setReviewError("");
    } catch (error) {
      setReviewError(
        error instanceof Error
          ? `Flashcard reviewed, but analytics could not be saved: ${error.message}`
          : "Flashcard reviewed, but analytics could not be saved.",
      );
    }
    cardStartedAt.current = now;
  }

  function changeKit(kitId: string, now: number) {
    recordCurrentReview(isKnown, now);
    setSelectedKitId(kitId);
    setCardIndex(0);
    setShowAnswer(false);
  }

  function changeCard(index: number, now: number) {
    if (!selectedKit || index < 0 || index >= selectedKit.flashcards.length) {
      return;
    }

    recordCurrentReview(isKnown, now);
    setCardIndex(index);
    setShowAnswer(false);
  }

  function toggleKnown(now: number) {
    if (!selectedKit) return;
    const known = !isKnown;
    try {
      recordFlashcardReview({
        kitId: selectedKit.id,
        cardIndex,
        known,
        durationSeconds: Math.min(
          3600,
          Math.floor((now - (cardStartedAt.current ?? now)) / 1000),
        ),
      });
    } catch (error) {
      setReviewError(
        error instanceof Error
          ? `Mastery status could not be saved: ${error.message}`
          : "Mastery status could not be saved.",
      );
      return;
    }

    cardStartedAt.current = now;
    setReviewError("");
  }

  return (
    <AppLayout title="Flashcards">
      <div className="app-page space-y-8 pb-12">
        <section>
          <div className="inline-flex items-center gap-2 rounded-full border border-[var(--color-primary)]/30 bg-[var(--color-primary)]/10 px-3 py-1 text-xs font-medium text-indigo-300">
            <Layers className="h-3.5 w-3.5 text-[var(--color-primary)]" />
            <span>Learn at your own pace</span>
          </div>
          <h2 className="mt-3 text-2xl font-bold tracking-tight text-white sm:text-3xl">
            Flashcards
          </h2>
          <p className="mt-1 max-w-2xl text-sm leading-relaxed text-zinc-400 sm:text-base">
            Review and flip through the flashcards saved in your study kits.
          </p>
        </section>

        <section className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 sm:p-7">
          <label
            htmlFor="flashcard-kit"
            className="mb-2 block text-sm font-medium text-slate-200"
          >
            Saved study kit
          </label>
          <select
            id="flashcard-kit"
            value={selectedKit?.id ?? ""}
            disabled={kits.length === 0}
            onChange={(event) =>
              changeKit(event.currentTarget.value, Date.now())
            }
            className="h-11 w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-secondary)] px-3.5 text-sm text-slate-100 outline-none transition focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/30 disabled:cursor-not-allowed disabled:opacity-70 sm:max-w-2xl"
          >
            {kits.length === 0 ? (
              <option value="">No saved study kits available</option>
            ) : (
              kits.map((kit) => (
                <option key={kit.id} value={kit.id}>
                  {kit.title} — {kit.subject}
                </option>
              ))
            )}
          </select>
          <p className="mt-1.5 text-xs text-zinc-500">
            {kits.length > 0
              ? `${kits.length} saved ${kits.length === 1 ? "kit" : "kits"} available in this browser.`
              : "Create a kit from your notes to review its flashcards here."}
          </p>
        </section>

        {storageError || activityError ? (
          <section
            role="alert"
            className="rounded-xl border border-rose-400/20 bg-rose-400/5 p-4 text-sm text-rose-200"
          >
            {storageError || activityError}
          </section>
        ) : selectedKit && selectedCard ? (
          <div className="grid gap-6 xl:grid-cols-[minmax(0,1.25fr)_minmax(280px,0.75fr)]">
            <section className="overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)]">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--color-border)] px-5 py-4 sm:px-6">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-secondary)] text-[var(--color-primary)]">
                    <BookOpen className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-white">
                      {selectedKit.title}
                    </h3>
                    <p className="text-xs text-zinc-400">
                      {selectedKit.subject}
                    </p>
                  </div>
                </div>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-300/20 bg-emerald-300/5 px-2.5 py-1 text-[11px] font-medium text-emerald-200">
                  <Check className="h-3 w-3" />
                  Saved deck
                </span>
              </div>

              <div className="p-5 sm:p-8">
                <button
                  type="button"
                  onClick={() => {
                    const now = Date.now();
                    if (!showAnswer) recordCurrentReview(isKnown, now, true);
                    cardStartedAt.current = now;
                    setShowAnswer((visible) => !visible);
                  }}
                  aria-pressed={showAnswer}
                  aria-label={
                    showAnswer ? "Show flashcard question" : "Reveal answer"
                  }
                  className="group relative flex min-h-64 w-full flex-col items-center justify-center overflow-hidden rounded-2xl border border-[var(--color-primary)]/25 bg-gradient-to-br from-[var(--color-surface-secondary)] via-[var(--color-surface)] to-[var(--color-surface)] px-6 py-10 text-center transition hover:border-[var(--color-primary)]/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] sm:min-h-72 sm:px-10"
                >
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute -right-10 -top-14 h-44 w-44 rounded-full bg-[var(--color-primary)]/10 blur-3xl"
                  />
                  <span className="relative text-[11px] font-semibold uppercase tracking-[0.18em] text-indigo-300">
                    {showAnswer ? "Answer" : "Question"}
                  </span>
                  <span className="relative mt-5 max-w-xl text-xl font-semibold leading-relaxed text-white sm:text-2xl">
                    {showAnswer ? selectedCard.answer : selectedCard.question}
                  </span>
                  <span className="relative mt-8 inline-flex items-center gap-2 rounded-full border border-[var(--color-border)] bg-[var(--color-surface-secondary)]/80 px-3 py-1.5 text-xs text-zinc-300 transition group-hover:border-[var(--color-primary)]/40">
                    <RotateCcw className="h-3.5 w-3.5 text-[var(--color-primary)]" />
                    Click to {showAnswer ? "see question" : "reveal answer"}
                  </span>
                </button>

                <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
                  <p
                    className="text-xs tabular-nums text-zinc-400"
                    aria-live="polite"
                  >
                    Card {cardIndex + 1} of {selectedKit.flashcards.length}
                  </p>
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() => toggleKnown(Date.now())}
                      className={`inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-xs font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] ${
                        isKnown
                          ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-200"
                          : "border-[var(--color-border)] bg-[var(--color-surface-secondary)] text-zinc-300 hover:text-white"
                      }`}
                    >
                      <Check className="h-3.5 w-3.5" />
                      {isKnown ? "Known" : "Mark as known"}
                    </button>
                    <button
                      type="button"
                      onClick={() => changeCard(cardIndex - 1, Date.now())}
                      disabled={cardIndex === 0}
                      aria-label="Previous flashcard"
                      className="flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-secondary)] text-zinc-300 transition hover:border-[var(--color-primary)]/40 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => changeCard(cardIndex + 1, Date.now())}
                      disabled={cardIndex === selectedKit.flashcards.length - 1}
                      aria-label="Next flashcard"
                      className="flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-secondary)] text-zinc-300 transition hover:border-[var(--color-primary)]/40 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                {reviewError && (
                  <p role="alert" className="mt-3 text-xs text-rose-200">
                    {reviewError}
                  </p>
                )}
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
                  <p className="text-xs text-zinc-400">Saved in this browser</p>
                </div>
              </div>

              <div className="mt-4 space-y-2">
                {selectedKit.flashcards.map((card, index) => (
                  <button
                    key={`${selectedKit.id}-${index}`}
                    type="button"
                    onClick={() => changeCard(index, Date.now())}
                    aria-current={cardIndex === index ? "true" : undefined}
                    className={`w-full rounded-lg border px-3.5 py-3 text-left text-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] ${
                      cardIndex === index
                        ? "border-[var(--color-primary)]/40 bg-[var(--color-primary)]/10 text-white"
                        : "border-[var(--color-border)] bg-[var(--color-surface-secondary)] text-zinc-300 hover:border-[var(--color-primary)]/30"
                    }`}
                  >
                    <span className="mr-2 text-xs text-[var(--color-primary)]">
                      {index + 1}.
                    </span>
                    {card.question}
                  </button>
                ))}
              </div>
            </section>
          </div>
        ) : (
          <section className="flex min-h-72 flex-col items-center justify-center rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] px-5 py-12 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-secondary)] text-[var(--color-primary)]">
              {kits.length > 0 ? (
                <AlertCircle className="h-7 w-7" />
              ) : (
                <BookOpen className="h-7 w-7" />
              )}
            </div>
            <h3 className="mt-4 text-sm font-semibold text-white">
              {kits.length > 0
                ? "No flashcards in this study kit"
                : "No saved study kits yet"}
            </h3>
            <p className="mt-1.5 max-w-md text-xs leading-relaxed text-zinc-400">
              {kits.length > 0
                ? "Choose another kit to review its cards, or create a new kit from your notes."
                : "Create a study kit from your notes or a PDF, and its generated flashcards will be available here."}
            </p>
            <Link
              href="/notes"
              className="mt-5 inline-flex items-center gap-2 rounded-lg border border-[var(--color-primary)]/30 bg-[var(--color-primary)]/10 px-4 py-2.5 text-sm font-medium text-indigo-200 transition hover:bg-[var(--color-primary)]/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]"
            >
              <Sparkles className="h-4 w-4" />
              Create a study kit
            </Link>
          </section>
        )}
      </div>
    </AppLayout>
  );
}
