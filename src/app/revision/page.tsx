"use client";

import { useState, useSyncExternalStore } from "react";
import Link from "next/link";
import {
  BookOpenText,
  CalendarDays,
  Check,
  CheckCircle2,
  Circle,
  Clock3,
  GraduationCap,
  Layers,
  ListChecks,
  RotateCcw,
  Sparkles,
  Target,
  Trash2,
} from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import {
  getServerStudyKitsSnapshot,
  getStudyKitsSnapshot,
  subscribeToStudyKits,
} from "@/lib/study-kits";
import {
  deleteRevisionTask,
  generateRevisionSchedule,
  getRevisionPlanSnapshot,
  getServerRevisionPlanSnapshot,
  setRevisionExamDate,
  setRevisionTaskCompleted,
  subscribeToRevisionPlan,
  type RevisionTask,
} from "@/lib/revision-plan";

function getTodayDate() {
  const today = new Date();
  return [
    today.getFullYear(),
    String(today.getMonth() + 1).padStart(2, "0"),
    String(today.getDate()).padStart(2, "0"),
  ].join("-");
}

function subscribeToToday(onStoreChange: () => void) {
  if (typeof window === "undefined") return () => {};
  const timeoutId = window.setTimeout(onStoreChange, 0);
  return () => window.clearTimeout(timeoutId);
}

function getServerTodayDate() {
  return "";
}

function toUtcDay(date: string) {
  const [year, month, day] = date.split("-").map(Number);
  return Date.UTC(year, month - 1, day);
}

function addDays(date: string, days: number) {
  const result = new Date(toUtcDay(date) + days * 86_400_000);
  return [
    result.getUTCFullYear(),
    String(result.getUTCMonth() + 1).padStart(2, "0"),
    String(result.getUTCDate()).padStart(2, "0"),
  ].join("-");
}

function formatDate(date: string) {
  return new Date(`${date}T00:00:00`).toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

const SESSION_LABELS: Record<RevisionTask["sessionType"], string> = {
  review: "Review key ideas",
  flashcards: "Study flashcards",
  quiz: "Practice quiz",
  custom: "Custom session",
};

const SESSION_STYLES: Record<RevisionTask["sessionType"], string> = {
  review: "border-sky-300/20 bg-sky-300/5 text-sky-200",
  flashcards: "border-violet-300/20 bg-violet-300/5 text-violet-200",
  quiz: "border-amber-300/20 bg-amber-300/5 text-amber-200",
  custom: "border-[var(--color-border)] bg-[var(--color-surface-secondary)] text-zinc-300",
};

export default function RevisionPage() {
  const { kits, error: kitError } = useSyncExternalStore(
    subscribeToStudyKits,
    getStudyKitsSnapshot,
    getServerStudyKitsSnapshot,
  );
  const {
    examDate,
    tasks,
    error: planError,
  } = useSyncExternalStore(
    subscribeToRevisionPlan,
    getRevisionPlanSnapshot,
    getServerRevisionPlanSnapshot,
  );
  const today = useSyncExternalStore(
    subscribeToToday,
    getTodayDate,
    getServerTodayDate,
  );
  const [selectedKitIds, setSelectedKitIds] = useState<string[]>([]);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const daysUntilExam =
    examDate && today
      ? Math.round((toUtcDay(examDate) - toUtcDay(today)) / 86_400_000)
      : null;
  const selectedKits = kits.filter((kit) => selectedKitIds.includes(kit.id));
  const sortedTasks = [...tasks].sort(
    (first, second) =>
      first.dueDate.localeCompare(second.dueDate) ||
      first.createdAt.localeCompare(second.createdAt),
  );
  const generatedTasks = sortedTasks.filter(
    (task) => task.source === "generated",
  );
  const completedTasks = generatedTasks.filter((task) => task.completed).length;
  const progress = generatedTasks.length
    ? Math.round((completedTasks / generatedTasks.length) * 100)
    : 0;
  const tasksByDate = new Map<string, RevisionTask[]>();
  for (const task of sortedTasks) {
    const tasksForDate = tasksByDate.get(task.dueDate) ?? [];
    tasksForDate.push(task);
    tasksByDate.set(task.dueDate, tasksForDate);
  }

  function toggleKit(kitId: string) {
    setSelectedKitIds((current) =>
      current.includes(kitId)
        ? current.filter((id) => id !== kitId)
        : [...current, kitId],
    );
    setError("");
    setMessage("");
  }

  function handleExamDateChange(date: string) {
    setError("");
    setMessage("");
    try {
      setRevisionExamDate(date);
    } catch (saveError) {
      setError(
        saveError instanceof Error
          ? saveError.message
          : "The exam date could not be saved.",
      );
    }
  }

  function handleGenerateSchedule() {
    setError("");
    setMessage("");

    if (!examDate) {
      setError("Choose your exam date before building a revision schedule.");
      return;
    }
    if (daysUntilExam === null || daysUntilExam < 0) {
      setError("Choose today or a future date for your exam.");
      return;
    }
    if (selectedKits.length === 0) {
      setError("Select at least one saved study kit for your revision plan.");
      return;
    }

    setIsGenerating(true);
    try {
      const sessionTemplates = selectedKits.flatMap((kit) => [
        {
          title: `${kit.subject}: Review key ideas`,
          kitId: kit.id,
          sessionType: "review" as const,
        },
        {
          title: `${kit.subject}: Study ${kit.flashcards.length} flashcards`,
          kitId: kit.id,
          sessionType: "flashcards" as const,
        },
        {
          title: `${kit.subject}: Practice quiz`,
          kitId: kit.id,
          sessionType: "quiz" as const,
        },
      ]);
      const sessions = sessionTemplates.map((session, index) => {
        const offset =
          sessionTemplates.length === 1
            ? 0
            : Math.round(
                (index * daysUntilExam) / (sessionTemplates.length - 1),
              );
        return {
          ...session,
          dueDate: addDays(today, offset),
        };
      });

      generateRevisionSchedule(examDate, sessions);
      setMessage(
        `Built ${sessions.length} revision sessions across ${selectedKits.length} ${selectedKits.length === 1 ? "study kit" : "study kits"}.`,
      );
    } catch (generationError) {
      setError(
        generationError instanceof Error
          ? generationError.message
          : "The revision schedule could not be saved.",
      );
    } finally {
      setIsGenerating(false);
    }
  }

  function handleTaskCompletion(task: RevisionTask, completed: boolean) {
    setError("");
    setMessage("");
    try {
      setRevisionTaskCompleted(task.id, completed);
      setMessage(
        completed
          ? "Revision session marked complete."
          : "Revision session reopened.",
      );
    } catch (updateError) {
      setError(
        updateError instanceof Error
          ? updateError.message
          : "The session status could not be saved.",
      );
    }
  }

  function handleDeleteTask(taskId: string) {
    setError("");
    setMessage("");
    try {
      deleteRevisionTask(taskId);
      setMessage("Revision session removed.");
    } catch (deleteError) {
      setError(
        deleteError instanceof Error
          ? deleteError.message
          : "The session could not be removed.",
      );
    }
  }

  return (
    <AppLayout title="Revision Plan">
      <div className="app-page space-y-8 pb-12">
        <section>
          <div className="inline-flex items-center gap-2 rounded-full border border-[var(--color-primary)]/30 bg-[var(--color-primary)]/10 px-3 py-1 text-xs font-medium text-indigo-300">
            <CalendarDays className="h-3.5 w-3.5 text-[var(--color-primary)]" />
            <span>Prepare with a clear plan</span>
          </div>
          <h2 className="mt-3 text-2xl font-bold tracking-tight text-white sm:text-3xl">
            Revision Plan
          </h2>
          <p className="mt-1 max-w-2xl text-sm leading-relaxed text-zinc-400 sm:text-base">
            Choose an exam date and your saved study kits. We’ll arrange key
            ideas, flashcard review, and quiz practice into a schedule.
          </p>
        </section>

        {(kitError || planError || error) && (
          <section
            role="alert"
            className="rounded-xl border border-rose-400/20 bg-rose-400/5 p-4 text-sm text-rose-200"
          >
            {kitError || planError || error}
          </section>
        )}
        {message && (
          <section
            role="status"
            className="rounded-xl border border-emerald-400/20 bg-emerald-400/5 p-4 text-sm text-emerald-200"
          >
            {message}
          </section>
        )}

        <section className="grid gap-6 xl:grid-cols-[minmax(0,1.15fr)_minmax(280px,0.85fr)]">
          <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 sm:p-7">
            <div className="flex items-start gap-3 border-b border-[var(--color-border)] pb-5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-amber-300/20 bg-amber-300/5 text-amber-200">
                <GraduationCap className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-white">
                  1. When is your exam?
                </h3>
                <p className="mt-1 text-xs leading-relaxed text-zinc-400">
                  Your exam date is saved in this browser and sets the end of
                  your plan.
                </p>
              </div>
            </div>
            <label
              htmlFor="exam-date"
              className="mb-2 mt-5 block text-sm font-medium text-slate-200"
            >
              Exam date
            </label>
            <input
              id="exam-date"
              type="date"
              min={today || undefined}
              value={examDate}
              onChange={(event) =>
                handleExamDateChange(event.currentTarget.value)
              }
              className="h-11 w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-secondary)] px-3.5 text-sm text-slate-100 outline-none transition focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/30 sm:max-w-xs"
            />
            {daysUntilExam !== null && (
              <p className="mt-3 text-sm text-indigo-200">
                {daysUntilExam === 0
                  ? "Your exam is today. All sessions will be scheduled today."
                  : daysUntilExam === 1
                    ? "1 day to prepare."
                    : `${daysUntilExam} days to prepare.`}
              </p>
            )}
          </div>

          <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 sm:p-7">
            <div className="flex items-start gap-3 border-b border-[var(--color-border)] pb-5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[var(--color-primary)]/30 bg-[var(--color-primary)]/10 text-[var(--color-primary)]">
                <BookOpenText className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-white">
                  2. Choose what to revise
                </h3>
                <p className="mt-1 text-xs leading-relaxed text-zinc-400">
                  Each kit gets a concept review, flashcard session, and quiz
                  practice.
                </p>
              </div>
            </div>

            {kits.length > 0 ? (
              <div className="mt-4 space-y-2">
                {kits.map((kit) => {
                  const isSelected = selectedKitIds.includes(kit.id);
                  return (
                    <label
                      key={kit.id}
                      className={`flex cursor-pointer items-start gap-3 rounded-xl border p-3.5 transition ${
                        isSelected
                          ? "border-[var(--color-primary)]/40 bg-[var(--color-primary)]/10"
                          : "border-[var(--color-border)] bg-[var(--color-surface-secondary)]/60 hover:border-[var(--color-primary)]/30"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleKit(kit.id)}
                        className="mt-1 h-4 w-4 shrink-0 accent-[var(--color-primary)]"
                      />
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-medium text-white">
                          {kit.title}
                        </span>
                        <span className="mt-1 block text-xs text-zinc-400">
                          {kit.subject} · {kit.flashcards.length} flashcards ·{" "}
                          {kit.quizQuestions.length} quiz questions
                        </span>
                      </span>
                      <span className="mt-0.5 text-xs text-zinc-500">
                        {isSelected ? "Selected" : ""}
                      </span>
                    </label>
                  );
                })}
              </div>
            ) : (
              <div className="mt-5 rounded-xl border border-dashed border-[var(--color-border)] px-4 py-6 text-center">
                <Layers className="mx-auto h-7 w-7 text-zinc-500" />
                <p className="mt-3 text-sm font-medium text-white">
                  No saved study kits yet
                </p>
                <p className="mt-1 text-xs text-zinc-400">
                  Create a kit from your notes to build an exam plan.
                </p>
                <Link
                  href="/notes"
                  className="mt-4 inline-flex items-center gap-2 rounded-lg border border-[var(--color-primary)]/30 bg-[var(--color-primary)]/10 px-3.5 py-2 text-sm font-medium text-indigo-200 hover:bg-[var(--color-primary)]/20"
                >
                  <Sparkles className="h-4 w-4" />
                  Create a study kit
                </Link>
              </div>
            )}
          </div>
        </section>

        <section className="flex flex-col gap-4 rounded-2xl border border-[var(--color-primary)]/20 bg-[var(--color-surface)] p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[var(--color-primary)]/30 bg-[var(--color-primary)]/10 text-[var(--color-primary)]">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-semibold text-white">
                3. Build your revision schedule
              </h3>
              <p className="mt-1 text-xs leading-relaxed text-zinc-400">
                {generatedTasks.length > 0
                  ? "Building again replaces the generated sessions. Any custom tasks are kept."
                  : "We’ll spread three focused sessions per selected kit between today and your exam."}
              </p>
            </div>
          </div>
          <button
            type="button"
            disabled={
              isGenerating ||
              !examDate ||
              !today ||
              selectedKitIds.length === 0 ||
              (daysUntilExam !== null && daysUntilExam < 0)
            }
            onClick={handleGenerateSchedule}
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-[var(--color-primary)] px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-[var(--color-primary)]/20 transition hover:bg-[var(--color-primary)]/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isGenerating ? (
              <RotateCcw className="h-4 w-4 animate-spin" />
            ) : (
              <ListChecks className="h-4 w-4" />
            )}
            {isGenerating
              ? "Building..."
              : generatedTasks.length > 0
                ? "Rebuild schedule"
                : "Build my schedule"}
          </button>
        </section>

        <section className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 sm:p-7">
          <div className="flex flex-col gap-5 border-b border-[var(--color-border)] pb-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-emerald-300/20 bg-emerald-300/5 text-emerald-200">
                <CalendarDays className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-white">
                  Your schedule
                </h3>
                <p className="mt-1 text-xs text-zinc-400">
                  {examDate
                    ? `Exam date · ${formatDate(examDate)}`
                    : "Choose an exam date and kits to build your schedule."}
                </p>
              </div>
            </div>
            {generatedTasks.length > 0 && (
              <div className="min-w-40">
                <div className="flex items-center justify-between gap-3 text-xs">
                  <span className="text-zinc-400">
                    {completedTasks} of {generatedTasks.length} sessions done
                  </span>
                  <span className="font-semibold text-emerald-200">
                    {progress}%
                  </span>
                </div>
                <div
                  className="mt-2 h-2 overflow-hidden rounded-full bg-[var(--color-surface-secondary)]"
                  role="progressbar"
                  aria-label="Revision schedule progress"
                  aria-valuenow={progress}
                  aria-valuemin={0}
                  aria-valuemax={100}
                >
                  <div
                    className="h-full rounded-full bg-emerald-400 transition-all"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {tasksByDate.size > 0 ? (
            <div className="mt-5 space-y-6">
              {Array.from(tasksByDate.entries()).map(([date, dateTasks]) => (
                <div key={date}>
                  <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-zinc-400">
                    <Clock3 className="h-3.5 w-3.5" />
                    {formatDate(date)}
                  </div>
                  <ul className="space-y-2">
                    {dateTasks.map((task) => {
                      const linkedKit = kits.find(
                        (kit) => kit.id === task.kitId,
                      );
                      return (
                        <li
                          key={task.id}
                          className={`flex items-center gap-3 rounded-xl border p-3.5 transition ${
                            task.completed
                              ? "border-[var(--color-border)] bg-[var(--color-surface-secondary)]/40 opacity-70"
                              : "border-[var(--color-border)] bg-[var(--color-surface-secondary)]/70"
                          }`}
                        >
                          <button
                            type="button"
                            onClick={() =>
                              handleTaskCompletion(task, !task.completed)
                            }
                            aria-label={
                              task.completed
                                ? `Reopen ${task.title}`
                                : `Complete ${task.title}`
                            }
                            className="shrink-0 rounded-full text-emerald-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]"
                          >
                            {task.completed ? (
                              <CheckCircle2 className="h-5 w-5" />
                            ) : (
                              <Circle className="h-5 w-5 text-zinc-500 hover:text-emerald-300" />
                            )}
                          </button>
                          <div className="min-w-0 flex-1">
                            <p
                              className={`text-sm font-medium ${
                                task.completed
                                  ? "text-zinc-400 line-through"
                                  : "text-white"
                              }`}
                            >
                              {task.title}
                            </p>
                            <div className="mt-1.5 flex flex-wrap items-center gap-2">
                              <span
                                className={`rounded-full border px-2 py-0.5 text-[10px] font-medium ${SESSION_STYLES[task.sessionType]}`}
                              >
                                {SESSION_LABELS[task.sessionType]}
                              </span>
                              {linkedKit && (
                                <span className="truncate text-[11px] text-zinc-500">
                                  {linkedKit.title}
                                </span>
                              )}
                            </div>
                          </div>
                          {task.source === "manual" && (
                            <span className="hidden text-[10px] text-zinc-500 sm:block">
                              Existing task
                            </span>
                          )}
                          <button
                            type="button"
                            onClick={() => handleDeleteTask(task.id)}
                            aria-label={`Remove ${task.title}`}
                            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-zinc-500 transition hover:bg-rose-400/10 hover:text-rose-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex min-h-56 flex-col items-center justify-center px-4 py-12 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-secondary)] text-[var(--color-primary)]">
                <Target className="h-7 w-7" />
              </div>
              <h4 className="mt-4 text-sm font-semibold text-white">
                Your revision sessions will appear here
              </h4>
              <p className="mt-1.5 max-w-sm text-xs leading-relaxed text-zinc-400">
                Set your exam date, select at least one saved kit, and build
                your schedule to get started.
              </p>
            </div>
          )}
        </section>

        <section
          aria-label="Revision schedule summary"
          className="grid gap-4 sm:grid-cols-3"
        >
          <article className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
            <div className="flex items-center gap-3">
              <ListChecks className="h-5 w-5 text-[var(--color-primary)]" />
              <p className="text-sm text-zinc-400">Sessions scheduled</p>
            </div>
            <p className="mt-3 text-2xl font-bold text-white">
              {generatedTasks.length}
            </p>
          </article>
          <article className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
            <div className="flex items-center gap-3">
              <Check className="h-5 w-5 text-emerald-300" />
              <p className="text-sm text-zinc-400">Sessions completed</p>
            </div>
            <p className="mt-3 text-2xl font-bold text-white">
              {completedTasks}
            </p>
          </article>
          <article className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
            <div className="flex items-center gap-3">
              <Layers className="h-5 w-5 text-sky-300" />
              <p className="text-sm text-zinc-400">Kits in this plan</p>
            </div>
            <p className="mt-3 text-2xl font-bold text-white">
              {new Set(
                generatedTasks.map((task) => task.kitId).filter(Boolean),
              ).size}
            </p>
          </article>
        </section>
      </div>
    </AppLayout>
  );
}
