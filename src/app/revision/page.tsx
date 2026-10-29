"use client";

import { useState, type ChangeEvent } from "react";
import {
  CalendarDays,
  CalendarPlus,
  CheckCircle2,
  Clock3,
  GraduationCap,
  ListTodo,
  Target,
} from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";

const WEEK_DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default function RevisionPage() {
  const [examDate, setExamDate] = useState("");

  function handleExamDateChange(event: ChangeEvent<HTMLInputElement>) {
    setExamDate(event.currentTarget.value);
  }

  const examDateDays = examDate
    ? Math.round(
        (new Date(`${examDate}T00:00:00`).getTime() -
          new Date(
            new Date().getFullYear(),
            new Date().getMonth(),
            new Date().getDate(),
          ).getTime()) /
          (1000 * 60 * 60 * 24),
      )
    : null;

  return (
    <AppLayout title="Revision Plan">
      <div className="app-page space-y-8 pb-12">
        <section>
          <div className="inline-flex items-center gap-2 rounded-full border border-[var(--color-primary)]/30 bg-[var(--color-primary)]/10 px-3 py-1 text-xs font-medium text-indigo-300">
            <CalendarDays className="h-3.5 w-3.5 text-[var(--color-primary)]" />
            <span>Plan your review</span>
          </div>
          <h2 className="mt-3 text-2xl font-bold tracking-tight text-white sm:text-3xl">
            Revision Plan
          </h2>
          <p className="mt-1 max-w-2xl text-sm leading-relaxed text-zinc-400 sm:text-base">
            Get a clear view of your week and keep upcoming exams in mind.
            Revision tasks will show here when they are available.
          </p>
        </section>

        <section className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 sm:p-6">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[var(--color-primary)]/30 bg-[var(--color-primary)]/10 text-[var(--color-primary)]">
                <CalendarDays className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold text-white">This week</h3>
                <p className="mt-1 text-xs text-zinc-400">
                  Weekly revision overview
                </p>
              </div>
            </div>
            <div className="grid grid-cols-7 gap-2 sm:gap-3">
              {WEEK_DAYS.map((day) => (
                <div
                  key={day}
                  className="flex min-w-0 flex-col items-center gap-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-secondary)]/60 px-2 py-3"
                >
                  <span className="text-[10px] font-medium text-zinc-400 sm:text-xs">
                    {day}
                  </span>
                  <span className="text-sm font-semibold text-zinc-300 sm:text-base">
                    —
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-amber-300/20 bg-amber-300/5 text-amber-200">
                <GraduationCap className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold text-white">Exam date</h3>
                <p className="mt-1 max-w-lg text-xs leading-relaxed text-zinc-400">
                  Set a date to see how much time you have to prepare. This
                  stays in this page only and is not saved.
                </p>
              </div>
            </div>
            <div className="w-full sm:max-w-xs">
              <label htmlFor="exam-date" className="sr-only">
                Choose exam date
              </label>
              <input
                id="exam-date"
                type="date"
                value={examDate}
                onChange={handleExamDateChange}
                className="h-11 w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-secondary)] px-3.5 text-sm text-slate-100 outline-none transition focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/30"
              />
            </div>
          </div>
          {examDateDays !== null && (
            <p role="status" className="mt-4 text-sm text-indigo-200">
              {examDateDays < 0
                ? "This exam date has passed."
                : examDateDays === 0
                ? "Your exam is today."
                : examDateDays === 1
                  ? "Your exam is in 1 day."
                  : `Your exam is in ${examDateDays} days.`}
            </p>
          )}
        </section>

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.3fr)_minmax(280px,0.7fr)]">
          <section className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 sm:p-6">
            <div className="flex items-center gap-2.5 border-b border-[var(--color-border)] pb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-secondary)] text-[var(--color-primary)]">
                <ListTodo className="h-4 w-4" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-white">
                  Upcoming tasks
                </h3>
                <p className="text-xs text-zinc-400">
                  Your next revision sessions
                </p>
              </div>
            </div>
            <div className="flex min-h-56 flex-col items-center justify-center px-4 py-10 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-secondary)] text-[var(--color-primary)]">
                <CalendarPlus className="h-7 w-7" />
              </div>
              <h4 className="mt-4 text-sm font-semibold text-white">
                No revision tasks yet
              </h4>
              <p className="mt-1.5 max-w-sm text-xs leading-relaxed text-zinc-400">
                There are no scheduled tasks to display. Revision planning
                will appear here when your study activity is connected.
              </p>
            </div>
          </section>

          <section className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 sm:p-6">
            <div className="flex items-center gap-2.5 border-b border-[var(--color-border)] pb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-secondary)] text-emerald-300">
                <Target className="h-4 w-4" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-white">
                  Progress overview
                </h3>
                <p className="text-xs text-zinc-400">Your revision progress</p>
              </div>
            </div>
            <div className="flex min-h-56 flex-col items-center justify-center px-3 py-10 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-secondary)] text-emerald-300">
                <CheckCircle2 className="h-5 w-5" />
              </div>
              <h4 className="mt-4 text-sm font-semibold text-white">
                Progress appears as you revise
              </h4>
              <p className="mt-1.5 max-w-xs text-xs leading-relaxed text-zinc-400">
                No tasks are available yet, so there is no progress to report.
              </p>
              <span className="mt-4 inline-flex items-center gap-1.5 text-xs text-zinc-500">
                <Clock3 className="h-3.5 w-3.5" />
                No activity recorded
              </span>
            </div>
          </section>
        </div>
      </div>
    </AppLayout>
  );
}
