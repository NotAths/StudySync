"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";
import {
  ArrowRight,
  BarChart3,
  BookOpen,
  BrainCircuit,
  CalendarClock,
  Check,
  Clock3,
  Flame,
  Layers,
  ListChecks,
  Plus,
  Sparkles,
  Target,
  TriangleAlert,
} from "lucide-react";
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
  getServerRevisionPlanSnapshot,
  getRevisionPlanSnapshot,
  setRevisionTaskCompleted,
  subscribeToRevisionPlan,
  type RevisionTask,
} from "@/lib/revision-plan";
import {
  getServerStudySettingsSnapshot,
  getStudySettingsSnapshot,
  subscribeToStudySettings,
} from "@/lib/study-settings";

function dayKey(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

let currentDayKey = "";

function getCurrentDaySnapshot() {
  return currentDayKey;
}

function subscribeToCurrentDay(listener: () => void) {
  if (typeof window === "undefined") return () => {};

  const refresh = () => {
    const nextDayKey = dayKey(new Date());
    if (nextDayKey !== currentDayKey) {
      currentDayKey = nextDayKey;
      listener();
    }
  };
  const initialRefresh = window.setTimeout(refresh, 0);
  const dailyRefresh = window.setInterval(refresh, 60_000);

  return () => {
    window.clearTimeout(initialRefresh);
    window.clearInterval(dailyRefresh);
  };
}

function getServerCurrentDaySnapshot() {
  return "";
}

function formatDuration(seconds: number) {
  if (seconds < 60) return `${seconds}s`;
  const minutes = Math.round(seconds / 60);
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return remainingMinutes ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
}

function formatDate(value: string) {
  return new Date(`${value}T00:00:00`).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
}

function getTaskKind(task: RevisionTask) {
  switch (task.sessionType) {
    case "review":
      return "Key ideas";
    case "flashcards":
      return "Flashcards";
    case "quiz":
      return "Quiz practice";
    default:
      return "Study session";
  }
}

export function DashboardView() {
  const todayKey = useSyncExternalStore(
    subscribeToCurrentDay,
    getCurrentDaySnapshot,
    getServerCurrentDaySnapshot,
  );
  const kitsSnapshot = useSyncExternalStore(
    subscribeToStudyKits,
    getStudyKitsSnapshot,
    getServerStudyKitsSnapshot,
  );
  const activitySnapshot = useSyncExternalStore(
    subscribeToStudyActivity,
    getStudyActivitySnapshot,
    getServerStudyActivitySnapshot,
  );
  const revisionSnapshot = useSyncExternalStore(
    subscribeToRevisionPlan,
    getRevisionPlanSnapshot,
    getServerRevisionPlanSnapshot,
  );
  const settingsSnapshot = useSyncExternalStore(
    subscribeToStudySettings,
    getStudySettingsSnapshot,
    getServerStudySettingsSnapshot,
  );

  const { kits } = kitsSnapshot;
  const { quizAttempts, flashcardReviews } = activitySnapshot;
  const { tasks, examDate } = revisionSnapshot;
  const { weeklyGoal } = settingsSnapshot;
  const errors = [
    kitsSnapshot.error,
    activitySnapshot.error,
    revisionSnapshot.error,
    settingsSnapshot.error,
  ].filter(Boolean);

  const questionCount = quizAttempts.reduce(
    (total, attempt) => total + attempt.total,
    0,
  );
  const correctCount = quizAttempts.reduce(
    (total, attempt) => total + attempt.score,
    0,
  );
  const accuracy = questionCount
    ? Math.round((correctCount / questionCount) * 100)
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

  const latestReviews = new Map<string, (typeof flashcardReviews)[number]>();
  for (const review of flashcardReviews) {
    const key = `${review.kitId}:${review.cardIndex}`;
    const existing = latestReviews.get(key);
    if (
      !existing ||
      new Date(review.reviewedAt).getTime() >
        new Date(existing.reviewedAt).getTime()
    ) {
      latestReviews.set(key, review);
    }
  }
  const masteredCards = Array.from(latestReviews.values()).filter(
    (review) => review.known,
  ).length;

  const today = todayKey ? new Date(`${todayKey}T00:00:00`) : null;
  const activityDates = new Set<string>();
  for (const kit of kits) activityDates.add(dayKey(new Date(kit.createdAt)));
  for (const attempt of quizAttempts) {
    activityDates.add(dayKey(new Date(attempt.completedAt)));
  }
  for (const review of flashcardReviews) {
    activityDates.add(dayKey(new Date(review.reviewedAt)));
  }

  let streak = 0;
  if (today) {
    const streakDay = new Date(today);
    if (!activityDates.has(dayKey(streakDay))) {
      streakDay.setDate(streakDay.getDate() - 1);
    }
    while (activityDates.has(dayKey(streakDay))) {
      streak += 1;
      streakDay.setDate(streakDay.getDate() - 1);
    }
  }

  const weeklyDays = today
    ? Array.from({ length: 7 }, (_, index) => {
        const date = new Date(today);
        date.setDate(today.getDate() - (6 - index));
        const key = dayKey(date);
        const kitCount = kits.filter(
          (kit) => dayKey(new Date(kit.createdAt)) === key,
        ).length;
        const quizCount = quizAttempts.filter(
          (attempt) => dayKey(new Date(attempt.completedAt)) === key,
        ).length;
        const reviewCount = flashcardReviews.filter(
          (review) => dayKey(new Date(review.reviewedAt)) === key,
        ).length;
        return {
          key,
          label: date.toLocaleDateString(undefined, { weekday: "short" }),
          count: kitCount + quizCount + reviewCount,
        };
      })
    : [];
  const weeklyActivity = weeklyDays.reduce((total, date) => total + date.count, 0);
  const goalProgress = Math.min(
    100,
    Math.round((weeklyActivity / weeklyGoal) * 100),
  );
  const maximumDayActivity = Math.max(1, ...weeklyDays.map((day) => day.count));
  const incompleteTasks = tasks
    .filter((task) => !task.completed)
    .sort((first, second) => first.dueDate.localeCompare(second.dueDate));
  const upcomingTasks = incompleteTasks.slice(0, 4);
  const completedTasks = tasks.filter((task) => task.completed).length;
  const daysUntilExam = examDate && today
    ? Math.ceil(
        (new Date(`${examDate}T00:00:00`).getTime() - today.getTime()) /
          86_400_000,
      )
    : null;
  const recentKits = [...kits]
    .sort(
      (first, second) =>
        new Date(second.createdAt).getTime() -
        new Date(first.createdAt).getTime(),
    )
    .slice(0, 3);
  const recentEvents = [
    ...kits.map((kit) => ({
      id: `kit-${kit.id}`,
      label: "Study kit created",
      detail: kit.title,
      date: kit.createdAt,
      icon: BookOpen,
    })),
    ...quizAttempts.map((attempt) => ({
      id: `quiz-${attempt.id}`,
      label: "Quiz completed",
      detail: `${attempt.topic} · ${attempt.score}/${attempt.total} correct`,
      date: attempt.completedAt,
      icon: BrainCircuit,
    })),
    ...flashcardReviews.map((review) => {
      const kit = kits.find((item) => item.id === review.kitId);
      return {
        id: `review-${review.id}`,
        label: "Flashcard reviewed",
        detail: `${kit?.title ?? "Study kit"} · Card ${review.cardIndex + 1} ${review.known ? "marked known" : "to review"}`,
        date: review.reviewedAt,
        icon: Layers,
      };
    }),
  ]
    .sort(
      (first, second) =>
        new Date(second.date).getTime() - new Date(first.date).getTime(),
    )
    .slice(0, 4);

  const stats = [
    {
      label: "Study kits",
      value: String(kits.length),
      detail: `${kits.reduce((count, kit) => count + kit.flashcards.length, 0)} flashcards ready`,
      icon: BookOpen,
      href: "/study-kits",
      tone: "text-[var(--color-primary)] bg-[var(--color-accent-light)]",
    },
    {
      label: "Quiz accuracy",
      value: accuracy === null ? "—" : `${accuracy}%`,
      detail: `${quizAttempts.length} ${quizAttempts.length === 1 ? "quiz completed" : "quizzes completed"}`,
      icon: Target,
      href: "/quiz",
      tone: "text-[var(--color-accent-coral)] bg-orange-50",
    },
    {
      label: "Cards mastered",
      value: String(masteredCards),
      detail: `${latestReviews.size} cards reviewed`,
      icon: Layers,
      href: "/flashcards",
      tone: "text-sky-700 bg-sky-50",
    },
    {
      label: "Study streak",
      value: `${streak} ${streak === 1 ? "day" : "days"}`,
      detail: formatDuration(studySeconds),
      icon: Flame,
      href: "/analytics",
      tone: "text-[var(--color-accent-gold)] bg-amber-50",
    },
  ];

  function completeTask(task: RevisionTask) {
    try {
      setRevisionTaskCompleted(task.id, true);
    } catch (error) {
      window.alert(
        error instanceof Error
          ? error.message
          : "The revision session could not be updated.",
      );
    }
  }

  return (
    <div className="dashboard-view space-y-7 pb-12">
      <section className="dashboard-welcome flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-[var(--color-primary)]/20 bg-[var(--color-accent-light)] px-3 py-1 text-xs font-semibold text-[var(--color-primary)]">
            <Sparkles className="h-3.5 w-3.5" />
            Your study workspace
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-[var(--color-text)]">
            Welcome back
          </h2>
          <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
            Pick up where you left off and keep your learning moving.
          </p>
        </div>
        <Link
          href="/notes"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--color-primary)] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[var(--color-primary-hover)]"
        >
          <Plus className="h-4 w-4" />
          Create a study kit
        </Link>
      </section>

      {errors.length > 0 && (
        <div
          role="alert"
          className="flex items-start gap-2 rounded-xl border border-[var(--color-error)]/30 bg-[var(--color-error)]/5 p-4 text-sm text-[var(--color-error)]"
        >
          <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{errors.join(" ")}</span>
        </div>
      )}

      <section aria-label="Study overview" className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link
              key={stat.label}
              href={stat.href}
              className="dashboard-stat-card border border-[var(--color-border)] bg-[var(--color-surface)] p-4 transition hover:border-[var(--color-primary)]/40 sm:p-5"
            >
              <div className="flex items-start justify-between gap-2">
                <span className="text-xs font-medium text-[var(--color-text-secondary)] sm:text-sm">
                  {stat.label}
                </span>
                <span className={`flex h-9 w-9 items-center justify-center rounded-xl ${stat.tone}`}>
                  <Icon className="h-4.5 w-4.5" />
                </span>
              </div>
              <p className="mt-3 text-2xl font-bold tracking-tight text-[var(--color-text)]">
                {stat.value}
              </p>
              <p className="mt-1 truncate text-xs text-[var(--color-text-secondary)]">
                {stat.detail}
              </p>
            </Link>
          );
        })}
      </section>

      <section aria-label="Study tools">
        <div className="mb-3 flex items-end justify-between gap-3">
          <div>
            <h3 className="font-semibold text-[var(--color-text)]">Study tools</h3>
            <p className="mt-0.5 text-xs text-[var(--color-text-secondary)]">
              Jump straight into a workspace
            </p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-5">
          {[
            { label: "My notes", detail: "Create a kit", href: "/notes", icon: Plus },
            { label: "AI Quiz", detail: "Practice a topic", href: "/quiz", icon: BrainCircuit },
            { label: "Flashcards", detail: "Review your cards", href: "/flashcards", icon: Layers },
            { label: "Study library", detail: "Browse saved kits", href: "/study-kits", icon: BookOpen },
            { label: "Settings", detail: "Set your study goal", href: "/settings", icon: Target },
          ].map((tool) => {
            const Icon = tool.icon;
            return (
              <Link
                key={tool.label}
                href={tool.href}
                className="group flex items-center gap-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4 transition hover:border-[var(--color-primary)]/40 hover:bg-[var(--color-accent-light)]/40"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--color-accent-light)] text-[var(--color-primary)]">
                  <Icon className="h-4.5 w-4.5" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-semibold text-[var(--color-text)]">
                    {tool.label}
                  </span>
                  <span className="mt-0.5 block truncate text-xs text-[var(--color-text-secondary)]">
                    {tool.detail}
                  </span>
                </span>
                <ArrowRight className="h-4 w-4 shrink-0 text-[var(--color-text-secondary)] transition group-hover:translate-x-0.5" />
              </Link>
            );
          })}
        </div>
      </section>

      <section className="grid gap-5 xl:grid-cols-[minmax(0,1.1fr)_minmax(320px,0.9fr)]">
        <article className="dashboard-panel border border-[var(--color-border)] p-5 sm:p-6">
          <div className="flex items-start justify-between gap-3 border-b border-[var(--color-border)] pb-4">
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--color-accent-light)] text-[var(--color-primary)]">
                <ListChecks className="h-4.5 w-4.5" />
              </span>
              <div>
                <h3 className="font-semibold text-[var(--color-text)]">Revision plan</h3>
                <p className="mt-0.5 text-xs text-[var(--color-text-secondary)]">
                  {examDate
                    ? daysUntilExam === 0
                      ? "Exam day is today"
                      : daysUntilExam !== null && daysUntilExam > 0
                        ? `${daysUntilExam} days until your exam`
                        : `Exam date · ${formatDate(examDate)}`
                    : "Build a plan around your next exam"}
                </p>
              </div>
            </div>
            <Link
              href="/revision"
              className="shrink-0 text-xs font-semibold text-[var(--color-primary)] hover:underline"
            >
              Open plan
            </Link>
          </div>
          {tasks.length > 0 && (
            <p className="mt-3 text-xs text-[var(--color-text-secondary)]">
              {completedTasks} of {tasks.length} sessions complete
            </p>
          )}
          {upcomingTasks.length ? (
            <ul className="mt-3 divide-y divide-[var(--color-border)]">
              {upcomingTasks.map((task) => {
                const isOverdue = todayKey !== "" && task.dueDate < todayKey;
                return (
                  <li
                    key={task.id}
                    className="flex items-center gap-3 py-3 first:pt-1"
                  >
                    <button
                      type="button"
                      aria-label={`Mark ${task.title} complete`}
                      onClick={() => completeTask(task)}
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-[var(--color-border)] text-[var(--color-primary)] transition hover:border-[var(--color-primary)] hover:bg-[var(--color-accent-light)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]"
                    >
                      <Check className="h-4 w-4" />
                    </button>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-[var(--color-text)]">
                        {task.title}
                      </p>
                      <p className="mt-0.5 text-xs text-[var(--color-text-secondary)]">
                        {getTaskKind(task)}
                      </p>
                    </div>
                    <span
                      className={`shrink-0 text-xs ${isOverdue ? "font-semibold text-[var(--color-error)]" : "text-[var(--color-text-secondary)]"}`}
                    >
                      {isOverdue ? "Overdue · " : ""}
                      {formatDate(task.dueDate)}
                    </span>
                  </li>
                );
              })}
            </ul>
          ) : (
            <div className="py-7 text-center">
              <CalendarClock className="mx-auto h-7 w-7 text-[var(--color-primary)]" />
              <p className="mt-2 text-sm font-medium text-[var(--color-text)]">
                {tasks.length ? "All sessions complete" : "No sessions scheduled yet"}
              </p>
              <p className="mt-1 text-xs text-[var(--color-text-secondary)]">
                {tasks.length
                  ? "Nice work. Your revision plan is up to date."
                  : "Set an exam date and select study kits to build your schedule."}
              </p>
              <Link
                href="/revision"
                className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-[var(--color-primary)] hover:underline"
              >
                {tasks.length ? "Review plan" : "Build a revision plan"}
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          )}
        </article>

        <article className="dashboard-panel border border-[var(--color-border)] p-5 sm:p-6">
          <div className="flex items-center justify-between gap-3 border-b border-[var(--color-border)] pb-4">
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-sky-50 text-sky-700">
                <BarChart3 className="h-4.5 w-4.5" />
              </span>
              <div>
                <h3 className="font-semibold text-[var(--color-text)]">This week</h3>
                <p className="mt-0.5 text-xs text-[var(--color-text-secondary)]">
                  {weeklyActivity} of {weeklyGoal} activities toward your goal
                </p>
              </div>
            </div>
            <Link
              href="/analytics"
              aria-label="Open Analytics"
              className="rounded-lg p-2 text-[var(--color-primary)] hover:bg-[var(--color-accent-light)]"
            >
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="mt-4">
            <div
              className="h-2 overflow-hidden rounded-full bg-[var(--color-surface-secondary)]"
              role="progressbar"
              aria-label="Weekly study goal progress"
              aria-valuenow={weeklyActivity}
              aria-valuemin={0}
              aria-valuemax={weeklyGoal}
            >
              <div
                className="h-full rounded-full bg-[var(--color-primary)] transition-all"
                style={{ width: `${goalProgress}%` }}
              />
            </div>
            <div className="mt-4 flex h-28 items-end justify-between gap-2">
              {weeklyDays.map((day) => (
                <div
                  key={day.key}
                  className="flex h-full flex-1 flex-col items-center justify-end gap-2"
                  title={`${day.count} activities`}
                >
                  <div className="flex h-20 w-full items-end rounded-t bg-[var(--color-surface-secondary)]">
                    <div
                      className="w-full rounded-t bg-[var(--color-primary)]"
                      style={{
                        height: day.count
                          ? `${Math.max(8, (day.count / maximumDayActivity) * 100)}%`
                          : "0%",
                      }}
                    />
                  </div>
                  <span className="text-[10px] text-[var(--color-text-secondary)]">
                    {day.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </article>
      </section>

      <section className="grid gap-5 xl:grid-cols-[minmax(0,1.1fr)_minmax(320px,0.9fr)]">
        <article className="dashboard-panel border border-[var(--color-border)] p-5 sm:p-6">
          <div className="flex items-center justify-between gap-3 border-b border-[var(--color-border)] pb-4">
            <div>
              <h3 className="font-semibold text-[var(--color-text)]">Recently added kits</h3>
              <p className="mt-0.5 text-xs text-[var(--color-text-secondary)]">
                Your latest saved learning materials
              </p>
            </div>
            <Link
              href="/study-kits"
              className="shrink-0 text-xs font-semibold text-[var(--color-primary)] hover:underline"
            >
              View library
            </Link>
          </div>
          {recentKits.length ? (
            <ul className="mt-2 divide-y divide-[var(--color-border)]">
              {recentKits.map((kit) => (
                <li
                  key={kit.id}
                  className="flex items-center gap-3 py-3"
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[var(--color-accent-light)] text-[var(--color-primary)]">
                    <BookOpen className="h-4 w-4" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-[var(--color-text)]">
                      {kit.title}
                    </p>
                    <p className="mt-0.5 truncate text-xs text-[var(--color-text-secondary)]">
                      {kit.subject} · {kit.flashcards.length} cards ·{" "}
                      {kit.quizQuestions.length} questions
                    </p>
                  </div>
                  <span className="shrink-0 text-xs text-[var(--color-text-secondary)]">
                    {new Date(kit.createdAt).toLocaleDateString(undefined, {
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <div className="py-7 text-center">
              <BookOpen className="mx-auto h-7 w-7 text-[var(--color-primary)]" />
              <p className="mt-2 text-sm font-medium text-[var(--color-text)]">
                Your library is ready for its first kit
              </p>
              <Link
                href="/notes"
                className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-[var(--color-primary)] hover:underline"
              >
                Create a kit from notes
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          )}
        </article>

        <article className="dashboard-panel border border-[var(--color-border)] p-5 sm:p-6">
          <div className="flex items-center justify-between gap-3 border-b border-[var(--color-border)] pb-4">
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-50 text-[var(--color-accent-gold)]">
                <Clock3 className="h-4.5 w-4.5" />
              </span>
              <div>
                <h3 className="font-semibold text-[var(--color-text)]">Recent activity</h3>
                <p className="mt-0.5 text-xs text-[var(--color-text-secondary)]">
                  Your latest kits, quizzes, and card reviews
                </p>
              </div>
            </div>
            <Link
              href="/analytics"
              className="shrink-0 text-xs font-semibold text-[var(--color-primary)] hover:underline"
            >
              Analytics
            </Link>
          </div>
          {recentEvents.length ? (
            <ul className="mt-2 divide-y divide-[var(--color-border)]">
              {recentEvents.map((event) => {
                const Icon = event.icon;
                return (
                  <li key={event.id} className="flex items-center gap-3 py-3">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[var(--color-surface-secondary)] text-[var(--color-primary)]">
                      <Icon className="h-4 w-4" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-medium text-[var(--color-text)]">
                        {event.label}
                      </p>
                      <p className="mt-0.5 truncate text-xs text-[var(--color-text-secondary)]">
                        {event.detail}
                      </p>
                    </div>
                    <time
                      className="shrink-0 text-[10px] text-[var(--color-text-secondary)]"
                      dateTime={event.date}
                    >
                      {new Date(event.date).toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                      })}
                    </time>
                  </li>
                );
              })}
            </ul>
          ) : (
            <div className="py-7 text-center">
              <Clock3 className="mx-auto h-7 w-7 text-[var(--color-primary)]" />
              <p className="mt-2 text-sm font-medium text-[var(--color-text)]">
                Your learning activity will appear here
              </p>
              <p className="mt-1 text-xs text-[var(--color-text-secondary)]">
                Create a kit, take a quiz, or review flashcards to get started.
              </p>
            </div>
          )}
        </article>
      </section>
    </div>
  );
}
