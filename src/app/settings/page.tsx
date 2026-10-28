"use client";

import { useState } from "react";
import {
  Bell,
  Check,
  CircleUserRound,
  List,
  Laptop,
  Rows3,
  Save,
  Settings2,
  SlidersHorizontal,
} from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";

export default function SettingsPage() {
  const [compact, setCompact] = useState(false);
  const [sessionLength, setSessionLength] = useState("25");
  const [weeklyGoal, setWeeklyGoal] = useState("5");
  const [emailReminders, setEmailReminders] = useState(false);
  const [studyReminders, setStudyReminders] = useState(true);

  return (
    <AppLayout title="Settings">
      <div className={`pb-12 ${compact ? "space-y-5" : "space-y-8"}`}>
        <section>
          <div className="inline-flex items-center gap-2 rounded-full border border-[var(--color-primary)]/30 bg-[var(--color-primary)]/10 px-3 py-1 text-xs font-medium text-indigo-300">
            <Settings2 className="h-3.5 w-3.5 text-[var(--color-primary)]" />
            <span>Make StudySync yours</span>
          </div>
          <h2 className="mt-3 text-2xl font-bold tracking-tight text-white sm:text-3xl">
            Settings
          </h2>
          <p className="mt-1 max-w-2xl text-sm leading-relaxed text-zinc-400 sm:text-base">
            Manage your profile and study preferences.
          </p>
        </section>

        <div
          role="status"
          className="flex items-start gap-3 rounded-xl border border-amber-300/20 bg-amber-300/5 px-4 py-3.5"
        >
          <Save className="mt-0.5 h-4 w-4 shrink-0 text-amber-200" />
          <p className="text-sm leading-relaxed text-amber-100/90">
            Settings are shown as local drafts and are not saved. Saving
            account preferences will be enabled when Supabase is connected.
          </p>
        </div>

        <div
          className={`grid xl:grid-cols-[minmax(0,1fr)_minmax(280px,0.65fr)] ${
            compact ? "gap-4" : "gap-6"
          }`}
        >
          <div className={compact ? "space-y-4" : "space-y-6"}>
            <section className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 sm:p-6">
              <div className="mb-5 flex items-center gap-3 border-b border-[var(--color-border)] pb-4">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-secondary)] text-[var(--color-primary)]">
                  <CircleUserRound className="h-4.5 w-4.5" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">Profile</h3>
                  <p className="text-xs text-zinc-400">
                    Your account details
                  </p>
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="profile-name"
                    className="mb-2 block text-sm font-medium text-slate-200"
                  >
                    Display name
                  </label>
                  <input
                    id="profile-name"
                    type="text"
                    disabled
                    placeholder="Available when your account is connected"
                    className="h-11 w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-secondary)] px-3.5 text-sm text-zinc-400 placeholder-zinc-600 outline-none disabled:cursor-not-allowed"
                  />
                </div>
                <div>
                  <label
                    htmlFor="profile-email"
                    className="mb-2 block text-sm font-medium text-slate-200"
                  >
                    Email address
                  </label>
                  <input
                    id="profile-email"
                    type="email"
                    disabled
                    placeholder="Available when your account is connected"
                    className="h-11 w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-secondary)] px-3.5 text-sm text-zinc-400 placeholder-zinc-600 outline-none disabled:cursor-not-allowed"
                  />
                </div>
              </div>
              <p className="mt-3 text-xs text-zinc-500">
                Profile details will be available when account connection is
                enabled.
              </p>
            </section>

            <section className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 sm:p-6">
              <div className="mb-5 flex items-center gap-3 border-b border-[var(--color-border)] pb-4">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-secondary)] text-[var(--color-primary)]">
                  <SlidersHorizontal className="h-4.5 w-4.5" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">Study preferences</h3>
                  <p className="text-xs text-zinc-400">
                    Adjust your focus routine
                  </p>
                </div>
              </div>
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="session-length"
                    className="mb-2 block text-sm font-medium text-slate-200"
                  >
                    Preferred focus session
                  </label>
                  <select
                    id="session-length"
                    value={sessionLength}
                    onChange={(event) =>
                      setSessionLength(event.currentTarget.value)
                    }
                    className="h-11 w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-secondary)] px-3.5 text-sm text-slate-100 outline-none transition focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/30"
                  >
                    <option value="15">15 minutes</option>
                    <option value="25">25 minutes</option>
                    <option value="45">45 minutes</option>
                    <option value="60">60 minutes</option>
                  </select>
                </div>
                <div>
                  <label
                    htmlFor="weekly-goal"
                    className="mb-2 block text-sm font-medium text-slate-200"
                  >
                    Weekly study goal
                  </label>
                  <select
                    id="weekly-goal"
                    value={weeklyGoal}
                    onChange={(event) =>
                      setWeeklyGoal(event.currentTarget.value)
                    }
                    className="h-11 w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-secondary)] px-3.5 text-sm text-slate-100 outline-none transition focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/30"
                  >
                    <option value="3">3 sessions</option>
                    <option value="5">5 sessions</option>
                    <option value="7">7 sessions</option>
                    <option value="10">10 sessions</option>
                  </select>
                </div>
              </div>
              <p className="mt-3 text-xs text-zinc-500">
                Local draft: {sessionLength}-minute sessions, {weeklyGoal} per
                week. These preferences are not saved or used to schedule
                sessions.
              </p>
            </section>

            <section className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 sm:p-6">
              <div className="mb-5 flex items-center gap-3 border-b border-[var(--color-border)] pb-4">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-secondary)] text-[var(--color-primary)]">
                  <Bell className="h-4.5 w-4.5" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">
                    Notification preferences
                  </h3>
                  <p className="text-xs text-zinc-400">
                    Choose reminder preferences
                  </p>
                </div>
              </div>
              <div className="space-y-4">
                <label className="flex cursor-pointer items-start justify-between gap-4">
                  <span>
                    <span className="block text-sm font-medium text-slate-200">
                      Study reminders
                    </span>
                    <span className="mt-1 block text-xs text-zinc-500">
                      Local preference only; no reminders are sent.
                    </span>
                  </span>
                  <input
                    type="checkbox"
                    checked={studyReminders}
                    onChange={(event) =>
                      setStudyReminders(event.currentTarget.checked)
                    }
                    aria-label="Enable study reminder preference (local draft)"
                    className="mt-1 h-4 w-4 accent-[var(--color-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-surface)]"
                  />
                </label>
                <label className="flex cursor-pointer items-start justify-between gap-4">
                  <span>
                    <span className="block text-sm font-medium text-slate-200">
                      Email updates
                    </span>
                    <span className="mt-1 block text-xs text-zinc-500">
                      Local preference only; no email is sent.
                    </span>
                  </span>
                  <input
                    type="checkbox"
                    checked={emailReminders}
                    onChange={(event) =>
                      setEmailReminders(event.currentTarget.checked)
                    }
                    aria-label="Enable email updates preference (local draft)"
                    className="mt-1 h-4 w-4 accent-[var(--color-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-surface)]"
                  />
                </label>
              </div>
              <p className="mt-4 border-t border-[var(--color-border)] pt-3 text-xs text-zinc-500">
                Notification choices are not saved. Notification delivery
                requires account preferences to be connected.
              </p>
            </section>
          </div>

          <div className={compact ? "space-y-4" : "space-y-6"}>
            <section className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 sm:p-6">
              <div className="mb-5 flex items-center gap-3 border-b border-[var(--color-border)] pb-4">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-secondary)] text-[var(--color-primary)]">
                  <Laptop className="h-4.5 w-4.5" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">Appearance</h3>
                  <p className="text-xs text-zinc-400">
                    Adjust this settings page preview
                  </p>
                </div>
              </div>
              <fieldset>
                <legend className="mb-3 text-sm font-medium text-slate-200">
                  Display density
                </legend>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    aria-pressed={!compact}
                    onClick={() => setCompact(false)}
                    className={`flex items-center justify-center gap-2 rounded-lg border px-3 py-2.5 text-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] ${
                      !compact
                        ? "border-[var(--color-primary)]/50 bg-[var(--color-primary)]/10 text-indigo-200"
                        : "border-[var(--color-border)] bg-[var(--color-surface-secondary)] text-zinc-400 hover:text-slate-200"
                    }`}
                  >
                    <Rows3 className="h-4 w-4" />
                    Comfortable
                  </button>
                  <button
                    type="button"
                    aria-pressed={compact}
                    onClick={() => setCompact(true)}
                    className={`flex items-center justify-center gap-2 rounded-lg border px-3 py-2.5 text-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] ${
                      compact
                        ? "border-[var(--color-primary)]/50 bg-[var(--color-primary)]/10 text-indigo-200"
                        : "border-[var(--color-border)] bg-[var(--color-surface-secondary)] text-zinc-400 hover:text-slate-200"
                    }`}
                  >
                    <List className="h-4 w-4" />
                    Compact
                  </button>
                </div>
              </fieldset>
              <p className="mt-3 text-xs text-zinc-500">
                Changes spacing on this page only and resets when you leave.
                App-wide themes are not available yet.
              </p>
            </section>

            <section className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 sm:p-6">
              <div className="mb-4 flex items-center gap-3 border-b border-[var(--color-border)] pb-4">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-secondary)] text-zinc-400">
                  <CircleUserRound className="h-4.5 w-4.5" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">Account</h3>
                  <p className="text-xs text-zinc-400">Account actions</p>
                </div>
              </div>
              <p className="text-sm leading-relaxed text-zinc-400">
                Account management is not connected yet. Profile updates and
                account actions will be available when Supabase is connected.
              </p>
              <button
                type="button"
                disabled
                className="mt-4 w-full cursor-not-allowed rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-secondary)] px-4 py-2.5 text-sm font-medium text-zinc-500"
              >
                Account actions unavailable
              </button>
            </section>

            <div
              role="status"
              className={`rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] ${
                compact ? "p-3" : "p-4"
              }`}
            >
              <div className="flex items-center gap-2 text-xs text-zinc-400">
                <Check className="h-3.5 w-3.5 text-[var(--color-primary)]" />
                <span>Changes are temporary previews, not saved settings.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
