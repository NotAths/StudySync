"use client";

import { useSyncExternalStore } from "react";
import Link from "next/link";
import {
  Activity,
  BarChart3,
  BrainCircuit,
  Clock3,
  Layers,
  Target,
  TrendingUp,
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
  subscribeToStudyActivity,
} from "@/lib/study-activity";
import {
  getServerStudySettingsSnapshot,
  getStudySettingsSnapshot,
  subscribeToStudySettings,
} from "@/lib/study-settings";

function getLocalDayKey(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function formatDuration(seconds: number) {
  if (seconds < 60) return `${seconds}s`;
  const minutes = Math.round(seconds / 60);
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
}

function EmptyState({
  icon: Icon,
  title,
  description,
}: {
  icon: typeof TrendingUp;
  title: string;
  description: string;
}) {
  return (
    <div className="flex min-h-48 flex-col items-center justify-center px-5 py-10 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-secondary)] text-[var(--color-primary)]">
        <Icon className="h-5 w-5" />
      </div>
      <h4 className="mt-4 text-sm font-semibold text-white">{title}</h4>
      <p className="mt-1.5 max-w-sm text-xs leading-relaxed text-zinc-400">
        {description}
      </p>
    </div>
  );
}

export default function AnalyticsPage() {
  const { kits, error: kitError } = useSyncExternalStore(
    subscribeToStudyKits,
    getStudyKitsSnapshot,
    getServerStudyKitsSnapshot,
  );
  const {
    quizAttempts,
    flashcardReviews,
    error: activityError,
  } = useSyncExternalStore(
    subscribeToStudyActivity,
    getStudyActivitySnapshot,
    getServerStudyActivitySnapshot,
  );
  const { weeklyGoal } = useSyncExternalStore(
    subscribeToStudySettings,
    getStudySettingsSnapshot,
    getServerStudySettingsSnapshot,
  );

  const quizQuestionCount = quizAttempts.reduce(
    (total, attempt) => total + attempt.total,
    0,
  );
  const correctAnswerCount = quizAttempts.reduce(
    (total, attempt) => total + attempt.score,
    0,
  );
  const accuracy = quizQuestionCount
    ? Math.round((correctAnswerCount / quizQuestionCount) * 100)
    : null;
  const studySeconds =
    quizAttempts.reduce(
      (total, attempt) => total + attempt.durationSeconds,
      0,
    ) +
    flashcardReviews.reduce(
      (total, review) => total + review.durationSeconds,
      0,
    );

  const latestCardReviews = new Map<string, (typeof flashcardReviews)[number]>();
  for (const review of flashcardReviews) {
    const key = `${review.kitId}:${review.cardIndex}`;
    const existing = latestCardReviews.get(key);
    if (
      !existing ||
      new Date(review.reviewedAt).getTime() >
        new Date(existing.reviewedAt).getTime()
    ) {
      latestCardReviews.set(key, review);
    }
  }
  const masteredCards = Array.from(latestCardReviews.values()).filter(
    (review) => review.known,
  ).length;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const activityDays = Array.from({ length: 7 }, (_, index) => {
    const date = new Date(today);
    date.setDate(today.getDate() - (6 - index));
    const key = getLocalDayKey(date);
    const quizCount = quizAttempts.filter(
      (attempt) => getLocalDayKey(new Date(attempt.completedAt)) === key,
    ).length;
    const reviewCount = flashcardReviews.filter(
      (review) => getLocalDayKey(new Date(review.reviewedAt)) === key,
    ).length;
    const kitsCreated = kits.filter(
      (kit) => getLocalDayKey(new Date(kit.createdAt)) === key,
    ).length;
    return {
      key,
      day: date.toLocaleDateString(undefined, { weekday: "short" }),
      date: date.toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
      }),
      count: quizCount + reviewCount + kitsCreated,
      quizCount,
      reviewCount,
      kitsCreated,
    };
  });
  const maxActivity = Math.max(1, ...activityDays.map((day) => day.count));
  const weeklyActivityCount = activityDays.reduce(
    (total, day) => total + day.count,
    0,
  );
  const weeklyGoalProgress = Math.min(
    100,
    Math.round((weeklyActivityCount / weeklyGoal) * 100),
  );
  const recentAttempts = [...quizAttempts]
    .sort(
      (first, second) =>
        new Date(second.completedAt).getTime() -
        new Date(first.completedAt).getTime(),
    )
    .slice(0, 8)
    .reverse();

  const topicResults = new Map<
    string,
    { topic: string; correct: number; total: number; attempts: number }
  >();
  for (const attempt of quizAttempts) {
    const key = attempt.topic.trim().toLocaleLowerCase();
    const existing = topicResults.get(key);
    if (existing) {
      existing.correct += attempt.score;
      existing.total += attempt.total;
      existing.attempts += 1;
    } else {
      topicResults.set(key, {
        topic: attempt.topic,
        correct: attempt.score,
        total: attempt.total,
        attempts: 1,
      });
    }
  }
  const weakestTopics = Array.from(topicResults.values())
    .map((result) => ({
      ...result,
      accuracy: Math.round((result.correct / result.total) * 100),
    }))
    .sort((first, second) => first.accuracy - second.accuracy)
    .slice(0, 5);

  const metrics = [
    {
      title: "Quiz attempts",
      value: String(quizAttempts.length),
      detail:
        quizAttempts.length > 200
          ? "Most recent 200 attempts tracked"
          : "Completed quizzes",
      icon: BrainCircuit,
      tone: "text-[var(--color-primary)]",
      badge: "border-indigo-400/20 bg-indigo-400/5",
    },
    {
      title: "Quiz accuracy",
      value: accuracy === null ? "—" : `${accuracy}%`,
      detail: `${correctAnswerCount} correct of ${quizQuestionCount} answered`,
      icon: Target,
      tone: "text-emerald-300",
      badge: "border-emerald-400/20 bg-emerald-400/5",
    },
    {
      title: "Study time",
      value: formatDuration(studySeconds),
      detail: "Time in completed quizzes and reviewed cards",
      icon: Clock3,
      tone: "text-sky-300",
      badge: "border-sky-400/20 bg-sky-400/5",
    },
    {
      title: "Cards mastered",
      value: String(masteredCards),
      detail: `${flashcardReviews.length} flashcard review actions`,
      icon: Layers,
      tone: "text-amber-200",
      badge: "border-amber-300/20 bg-amber-300/5",
    },
  ];

  return (
    <AppLayout title="Analytics">
      <div className="app-page space-y-8 pb-12">
        <section>
          <div className="inline-flex items-center gap-2 rounded-full border border-[var(--color-primary)]/30 bg-[var(--color-primary)]/10 px-3 py-1 text-xs font-medium text-indigo-300">
            <BarChart3 className="h-3.5 w-3.5 text-[var(--color-primary)]" />
            <span>Your learning insights</span>
          </div>
          <h2 className="mt-3 text-2xl font-bold tracking-tight text-white sm:text-3xl">
            Analytics
          </h2>
          <p className="mt-1 max-w-2xl text-sm leading-relaxed text-zinc-400 sm:text-base">
            See your saved study kits, quiz results, study activity, and
            flashcard progress. Data is collected in this browser as you study.
          </p>
        </section>

        {(kitError || activityError) && (
          <section
            role="alert"
            className="rounded-xl border border-rose-400/20 bg-rose-400/5 p-4 text-sm text-rose-200"
          >
            {kitError || activityError}
          </section>
        )}

        <section
          aria-label="Study summary"
          className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
        >
          {metrics.map((metric) => {
            const Icon = metric.icon;
            return (
              <article
                key={metric.title}
                className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 sm:p-6"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium text-zinc-400">
                      {metric.title}
                    </p>
                    <p className="mt-3 text-3xl font-bold tracking-tight text-white">
                      {metric.value}
                    </p>
                  </div>
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-xl border ${metric.badge} ${metric.tone}`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                </div>
                <p className="mt-3 text-xs text-zinc-500">{metric.detail}</p>
              </article>
            );
          })}
        </section>

        <section
          aria-label="Saved study materials"
          className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 sm:p-6"
        >
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-base font-semibold text-white">
                Study library
              </h3>
              <p className="mt-1 text-xs text-zinc-400">
                Materials saved from your notes page
              </p>
            </div>
            <p className="text-sm text-zinc-300">
              <span className="font-semibold text-white">{kits.length}</span>{" "}
              {kits.length === 1 ? "kit" : "kits"} ·{" "}
              <span className="font-semibold text-white">
                {kits.reduce((total, kit) => total + kit.flashcards.length, 0)}
              </span>{" "}
              flashcards
            </p>
          </div>
          {kits.length > 0 ? (
            <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {kits.slice(0, 6).map((kit) => (
                <article
                  key={kit.id}
                  className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-secondary)] p-4"
                >
                  <p className="text-xs font-medium text-indigo-300">
                    {kit.subject}
                  </p>
                  <h4 className="mt-1 truncate text-sm font-medium text-white">
                    {kit.title}
                  </h4>
                  <p className="mt-2 text-xs text-zinc-400">
                    {kit.flashcards.length} cards · {kit.quizQuestions.length}{" "}
                    saved questions ·{" "}
                    {new Date(kit.createdAt).toLocaleDateString()}
                  </p>
                </article>
              ))}
            </div>
          ) : (
            <div className="mt-4">
              <EmptyState
                icon={Layers}
                title="Your study library is empty"
                description="Generate and save a study kit from your notes or a PDF to see it reflected here."
              />
              <div className="text-center">
                <Link
                  href="/notes"
                  className="inline-flex items-center rounded-lg border border-[var(--color-primary)]/30 bg-[var(--color-primary)]/10 px-4 py-2 text-sm font-medium text-indigo-200 hover:bg-[var(--color-primary)]/20"
                >
                  Create a study kit
                </Link>
              </div>
            </div>
          )}
        </section>

        <section className="grid gap-6 xl:grid-cols-2">
          <article className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 sm:p-6">
            <div className="flex items-center gap-2.5 border-b border-[var(--color-border)] pb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-secondary)] text-[var(--color-primary)]">
                <TrendingUp className="h-4 w-4" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-white">
                  Quiz performance
                </h3>
                <p className="text-xs text-zinc-400">
                  Score for your most recent quiz attempts
                </p>
              </div>
            </div>
            {recentAttempts.length > 0 ? (
              <div
                aria-label="Recent quiz scores"
                className="mt-5 flex min-h-48 items-end gap-2 sm:gap-3"
              >
                {recentAttempts.map((attempt) => {
                  const percentage = Math.round(
                    (attempt.score / attempt.total) * 100,
                  );
                  return (
                    <div
                      key={attempt.id}
                      className="flex h-48 min-w-0 flex-1 flex-col items-center justify-end gap-2"
                      title={`${attempt.topic}: ${attempt.score}/${attempt.total} (${percentage}%)`}
                    >
                      <span className="text-[10px] tabular-nums text-zinc-400">
                        {percentage}%
                      </span>
                      <div className="flex h-32 w-full items-end rounded-t-md bg-[var(--color-surface-secondary)]">
                        <div
                          className="w-full rounded-t-md bg-[var(--color-primary)] transition-all"
                          style={{ height: `${Math.max(4, percentage)}%` }}
                        />
                      </div>
                      <span className="max-w-full truncate text-[10px] text-zinc-500">
                        {new Date(attempt.completedAt).toLocaleDateString(
                          undefined,
                          { month: "numeric", day: "numeric" },
                        )}
                      </span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <EmptyState
                icon={BarChart3}
                title="No quiz results yet"
                description="Complete a quiz and check your answers to start tracking performance."
              />
            )}
          </article>

          <article className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 sm:p-6">
            <div className="flex items-center gap-2.5 border-b border-[var(--color-border)] pb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-secondary)] text-sky-300">
                <Activity className="h-4 w-4" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-white">
                  Last 7 days
                </h3>
                <p className="text-xs text-zinc-400">
                  Kits created, quizzes completed, and flashcard reviews
                </p>
              </div>
            </div>
            <div className="mt-5">
              <div className="flex items-center justify-between gap-3 text-xs">
                <span className="text-zinc-400">Weekly study goal</span>
                <span className="font-medium text-slate-200">
                  {weeklyActivityCount} / {weeklyGoal} activities
                </span>
              </div>
              <div
                className="mt-2 h-2 overflow-hidden rounded-full bg-[var(--color-surface-secondary)]"
                role="progressbar"
                aria-label="Weekly study goal progress"
                aria-valuenow={weeklyActivityCount}
                aria-valuemin={0}
                aria-valuemax={weeklyGoal}
              >
                <div
                  className="h-full rounded-full bg-[var(--color-primary)] transition-all"
                  style={{ width: `${weeklyGoalProgress}%` }}
                />
              </div>
            </div>
            <div
              aria-label="Daily study activity for the last seven days"
              className="mt-4 grid grid-cols-7 gap-2 sm:gap-3"
            >
              {activityDays.map((day) => (
                <div
                  key={day.key}
                  className="flex min-w-0 flex-col items-center gap-2"
                  title={`${day.date}: ${day.kitsCreated} kits, ${day.quizCount} quizzes, ${day.reviewCount} card reviews`}
                >
                  <span className="text-[10px] tabular-nums text-zinc-400">
                    {day.count || ""}
                  </span>
                  <div className="flex h-28 w-full items-end rounded-t-md bg-[var(--color-surface-secondary)]">
                    <div
                      className="w-full rounded-t-md bg-sky-400 transition-all"
                      style={{
                        height: day.count
                          ? `${Math.max(8, (day.count / maxActivity) * 100)}%`
                          : "0%",
                      }}
                    />
                  </div>
                  <span className="text-[10px] text-zinc-500">{day.day}</span>
                </div>
              ))}
            </div>
          </article>
        </section>

        <section className="grid gap-6 xl:grid-cols-2">
          <article className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 sm:p-6">
            <div className="flex items-center gap-2.5 border-b border-[var(--color-border)] pb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-secondary)] text-amber-200">
                <Target className="h-4 w-4" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-white">
                  Topics to review
                </h3>
                <p className="text-xs text-zinc-400">
                  Topics ranked by quiz accuracy
                </p>
              </div>
            </div>
            {weakestTopics.length > 0 ? (
              <ul className="mt-4 space-y-4">
                {weakestTopics.map((topic) => (
                  <li key={topic.topic}>
                    <div className="flex items-center justify-between gap-3 text-sm">
                      <span className="truncate font-medium text-white">
                        {topic.topic}
                      </span>
                      <span className="shrink-0 text-xs text-zinc-400">
                        {topic.accuracy}% · {topic.attempts}{" "}
                        {topic.attempts === 1 ? "quiz" : "quizzes"}
                      </span>
                    </div>
                    <div
                      className="mt-2 h-2 overflow-hidden rounded-full bg-[var(--color-surface-secondary)]"
                      role="progressbar"
                      aria-label={`${topic.topic} quiz accuracy`}
                      aria-valuenow={topic.accuracy}
                      aria-valuemin={0}
                      aria-valuemax={100}
                    >
                      <div
                        className="h-full rounded-full bg-amber-300"
                        style={{ width: `${topic.accuracy}%` }}
                      />
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <EmptyState
                icon={BrainCircuit}
                title="No topic results yet"
                description="Complete quizzes to see which subjects could use more practice."
              />
            )}
          </article>

          <article className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 sm:p-6">
            <div className="flex items-center gap-2.5 border-b border-[var(--color-border)] pb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-secondary)] text-emerald-300">
                <Layers className="h-4 w-4" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-white">
                  Flashcard progress
                </h3>
                <p className="text-xs text-zinc-400">
                  Cards you have reviewed and marked as known
                </p>
              </div>
            </div>
            {latestCardReviews.size > 0 ? (
              <div className="mt-5 space-y-4">
                <div className="flex items-end justify-between gap-3">
                  <div>
                    <p className="text-3xl font-bold text-white">
                      {masteredCards}
                    </p>
                    <p className="mt-1 text-xs text-zinc-400">
                      of {latestCardReviews.size} reviewed cards marked known
                    </p>
                  </div>
                  <p className="text-sm font-medium text-emerald-200">
                    {Math.round(
                      (masteredCards / latestCardReviews.size) * 100,
                    )}
                    %
                  </p>
                </div>
                <div
                  className="h-2 overflow-hidden rounded-full bg-[var(--color-surface-secondary)]"
                  role="progressbar"
                  aria-label="Reviewed flashcards marked known"
                  aria-valuenow={masteredCards}
                  aria-valuemin={0}
                  aria-valuemax={latestCardReviews.size}
                >
                  <div
                    className="h-full rounded-full bg-emerald-400"
                    style={{
                      width: `${(masteredCards / latestCardReviews.size) * 100}%`,
                    }}
                  />
                </div>
                <p className="text-xs text-zinc-500">
                  Review actions are saved when you reveal a card or mark its
                  mastery status.
                </p>
              </div>
            ) : (
              <EmptyState
                icon={Layers}
                title="No card reviews yet"
                description="Reveal a saved flashcard answer or mark a card as known to track your progress."
              />
            )}
          </article>
        </section>
      </div>
    </AppLayout>
  );
}
