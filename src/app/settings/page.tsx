"use client";

import { useState, useSyncExternalStore } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  ArrowDownToLine,
  BookOpen,
  Check,
  ChevronRight,
  Database,
  Download,
  Goal,
  Settings2,
  Trash2,
} from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import {
  clearLocalStudyData,
  exportLocalStudyData,
} from "@/lib/study-data-management";
import {
  getServerStudySettingsSnapshot,
  getStudySettingsSnapshot,
  setWeeklyStudyGoal,
  subscribeToStudySettings,
} from "@/lib/study-settings";
import {
  getServerStudyActivitySnapshot,
  getStudyActivitySnapshot,
  subscribeToStudyActivity,
} from "@/lib/study-activity";
import {
  getServerStudyKitsSnapshot,
  getStudyKitsSnapshot,
  subscribeToStudyKits,
} from "@/lib/study-kits";
import {
  getServerRevisionPlanSnapshot,
  getRevisionPlanSnapshot,
  subscribeToRevisionPlan,
} from "@/lib/revision-plan";

const goalOptions = [3, 5, 7, 10];

export default function SettingsPage() {
  const settings = useSyncExternalStore(
    subscribeToStudySettings,
    getStudySettingsSnapshot,
    getServerStudySettingsSnapshot,
  );
  const kits = useSyncExternalStore(
    subscribeToStudyKits,
    getStudyKitsSnapshot,
    getServerStudyKitsSnapshot,
  );
  const activity = useSyncExternalStore(
    subscribeToStudyActivity,
    getStudyActivitySnapshot,
    getServerStudyActivitySnapshot,
  );
  const revision = useSyncExternalStore(
    subscribeToRevisionPlan,
    getRevisionPlanSnapshot,
    getServerRevisionPlanSnapshot,
  );
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const storageError =
    settings.error || kits.error || activity.error || revision.error;
  const studyDataCount =
    kits.kits.length +
    activity.quizAttempts.length +
    activity.flashcardReviews.length +
    revision.tasks.length;

  function saveGoal(value: string) {
    try {
      setWeeklyStudyGoal(Number(value));
      setMessage("Weekly goal saved.");
      setError("");
    } catch (saveError) {
      setError(
        saveError instanceof Error
          ? saveError.message
          : "Weekly goal could not be saved.",
      );
      setMessage("");
    }
  }

  function downloadBackup() {
    try {
      const backup = exportLocalStudyData();
      const blob = new Blob([JSON.stringify(backup, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `studysync-backup-${new Date().toISOString().slice(0, 10)}.json`;
      link.click();
      window.setTimeout(() => URL.revokeObjectURL(url), 0);
      setMessage("Your StudySync backup has been downloaded.");
      setError("");
    } catch (downloadError) {
      setError(
        downloadError instanceof Error
          ? downloadError.message
          : "Study data could not be exported.",
      );
      setMessage("");
    }
  }

  function clearData() {
    if (
      !window.confirm(
        "Delete all saved study kits, quiz and flashcard activity, and revision tasks from this browser? This cannot be undone. Download a backup first if you want to keep a copy.",
      )
    ) {
      return;
    }

    try {
      clearLocalStudyData();
      setMessage("Your saved study data has been cleared from this browser.");
      setError("");
    } catch (clearError) {
      setError(
        clearError instanceof Error
          ? clearError.message
          : "Study data could not be cleared.",
      );
      setMessage("");
    }
  }

  return (
    <AppLayout title="Settings">
      <div className="app-page space-y-8 pb-12">
        <section className="relative overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 sm:p-8">
          <div className="pointer-events-none absolute -right-12 -top-20 h-56 w-56 rounded-full bg-[var(--color-accent-light)]/70 blur-3xl" />
          <div className="relative max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-[var(--color-primary)]/20 bg-[var(--color-accent-light)] px-3 py-1 text-xs font-semibold text-[var(--color-primary)]">
              <Settings2 className="h-3.5 w-3.5" />
              Personalize your workspace
            </div>
            <h2 className="mt-4 text-3xl font-bold tracking-tight text-[var(--color-text)]">
              Settings
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-[var(--color-text-secondary)] sm:text-base">
              Set a realistic study goal and manage the learning data saved in
              this browser.
            </p>
          </div>
        </section>

        {(storageError || error || message) && (
          <div
            role={storageError || error ? "alert" : "status"}
            className={`flex items-start gap-3 rounded-xl border px-4 py-3.5 text-sm ${
              storageError || error
                ? "border-[var(--color-error)]/30 bg-[var(--color-error)]/5 text-[var(--color-error)]"
                : "border-[var(--color-success)]/25 bg-[var(--color-success)]/5 text-[var(--color-primary)]"
            }`}
          >
            {storageError || error ? (
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
            ) : (
              <Check className="mt-0.5 h-4 w-4 shrink-0" />
            )}
            <span>{storageError || error || message}</span>
          </div>
        )}

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.15fr)_minmax(320px,0.85fr)]">
          <section className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 sm:p-7">
            <div className="flex items-start gap-4 border-b border-[var(--color-border)] pb-5">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[var(--color-accent-light)] text-[var(--color-primary)]">
                <Goal className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-[var(--color-text)]">
                  Your weekly study goal
                </h3>
                <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
                  Choose how many learning activities you want to complete each
                  week. Your progress appears in Analytics.
                </p>
              </div>
            </div>
            <fieldset className="mt-5">
              <legend className="mb-3 text-sm font-medium text-[var(--color-text)]">
                Activities per week
              </legend>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {goalOptions.map((goal) => (
                  <button
                    key={goal}
                    type="button"
                    aria-pressed={settings.weeklyGoal === goal}
                    onClick={() => saveGoal(String(goal))}
                    className={`rounded-xl border px-3 py-4 text-center transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] ${
                      settings.weeklyGoal === goal
                        ? "border-[var(--color-primary)] bg-[var(--color-accent-light)] text-[var(--color-primary)]"
                        : "border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-secondary)] hover:border-[var(--color-primary)]/50"
                    }`}
                  >
                    <span className="block text-2xl font-bold">{goal}</span>
                    <span className="mt-1 block text-xs">per week</span>
                  </button>
                ))}
              </div>
            </fieldset>
            <div className="mt-5 flex items-center justify-between gap-4 rounded-xl bg-[var(--color-surface-secondary)] px-4 py-3">
              <p className="text-sm text-[var(--color-text-secondary)]">
                Counted in your goal
              </p>
              <p className="text-right text-xs font-medium text-[var(--color-text)]">
                Quiz completions, flashcard reviews, and kits created
              </p>
            </div>
          </section>

          <section className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 sm:p-7">
            <div className="flex items-start gap-4 border-b border-[var(--color-border)] pb-5">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[var(--color-accent-light)] text-[var(--color-primary)]">
                <Database className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-[var(--color-text)]">
                  Your study data
                </h3>
                <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
                  Your study library and progress are stored locally in this
                  browser.
                </p>
              </div>
            </div>
            <dl className="mt-5 grid grid-cols-2 gap-3">
              <div className="rounded-xl bg-[var(--color-surface-secondary)] p-4">
                <dt className="text-xs text-[var(--color-text-secondary)]">
                  Study kits
                </dt>
                <dd className="mt-1 text-xl font-semibold text-[var(--color-text)]">
                  {kits.kits.length}
                </dd>
              </div>
              <div className="rounded-xl bg-[var(--color-surface-secondary)] p-4">
                <dt className="text-xs text-[var(--color-text-secondary)]">
                  Tracked activities
                </dt>
                <dd className="mt-1 text-xl font-semibold text-[var(--color-text)]">
                  {activity.quizAttempts.length + activity.flashcardReviews.length}
                </dd>
              </div>
              <div className="rounded-xl bg-[var(--color-surface-secondary)] p-4">
                <dt className="text-xs text-[var(--color-text-secondary)]">
                  Revision sessions
                </dt>
                <dd className="mt-1 text-xl font-semibold text-[var(--color-text)]">
                  {revision.tasks.length}
                </dd>
              </div>
              <div className="rounded-xl bg-[var(--color-surface-secondary)] p-4">
                <dt className="text-xs text-[var(--color-text-secondary)]">
                  Total saved items
                </dt>
                <dd className="mt-1 text-xl font-semibold text-[var(--color-text)]">
                  {studyDataCount}
                </dd>
              </div>
            </dl>
            <button
              type="button"
              onClick={downloadBackup}
              disabled={Boolean(storageError)}
              className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--color-primary)] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[var(--color-primary-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Download className="h-4 w-4" />
              Download a backup
            </button>
            <p className="mt-2 text-center text-xs text-[var(--color-text-secondary)]">
              Exports your kits, activity, revision plan, and preferences as
              JSON.
            </p>
          </section>
        </div>

        <section className="rounded-2xl border border-[var(--color-error)]/25 bg-[var(--color-surface)] p-5 sm:p-7">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[var(--color-error)]/10 text-[var(--color-error)]">
                <Trash2 className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold text-[var(--color-text)]">
                  Clear local study data
                </h3>
                <p className="mt-1 max-w-2xl text-sm leading-relaxed text-[var(--color-text-secondary)]">
                  Permanently remove saved kits, quiz and flashcard activity,
                  and revision sessions from this browser. This does not affect
                  your Gemini API key or unrelated browser data.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={clearData}
              disabled={studyDataCount === 0 || Boolean(storageError)}
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-[var(--color-error)]/35 px-4 py-2.5 text-sm font-semibold text-[var(--color-error)] transition hover:bg-[var(--color-error)]/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-error)] disabled:cursor-not-allowed disabled:opacity-45"
            >
              <Trash2 className="h-4 w-4" />
              Clear study data
            </button>
          </div>
        </section>

        <Link
          href="/analytics"
          className="group flex items-center justify-between rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-5 py-4 transition hover:border-[var(--color-primary)]/40"
        >
          <span className="flex items-center gap-3">
            <BookOpen className="h-4 w-4 text-[var(--color-primary)]" />
            <span className="text-sm font-medium text-[var(--color-text)]">
              View your study progress in Analytics
            </span>
          </span>
          <ChevronRight className="h-4 w-4 text-[var(--color-text-secondary)] transition group-hover:translate-x-0.5" />
        </Link>
        <div className="flex items-center justify-center gap-2 text-xs text-[var(--color-text-secondary)]">
          <ArrowDownToLine className="h-3.5 w-3.5" />
          <span>
            StudySync keeps these preferences and study records on this device.
          </span>
        </div>
      </div>
    </AppLayout>
  );
}
