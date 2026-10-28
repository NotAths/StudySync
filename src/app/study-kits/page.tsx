"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  BookOpen,
  FileText,
  Layers,
  Plus,
  Search,
  Sparkles,
} from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";

const CATEGORIES = ["All", "Notes", "Flashcards", "Quizzes"] as const;
type Category = (typeof CATEGORIES)[number];

export default function StudyKitsPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<Category>("All");

  const visibleKits = useMemo(
    () =>
      [] as { title: string; description: string; category: Category }[],
    [],
  ).filter((kit) => {
    const matchesSearch = `${kit.title} ${kit.description}`
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchesCategory = category === "All" || kit.category === category;
    return matchesSearch && matchesCategory;
  });

  return (
    <AppLayout title="Saved Study Kits">
      <div className="space-y-8 pb-12">
        <section className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-[var(--color-primary)]/30 bg-[var(--color-primary)]/10 px-3 py-1 text-xs font-medium text-indigo-300">
              <BookOpen className="h-3.5 w-3.5 text-[var(--color-primary)]" />
              <span>Your learning library</span>
            </div>
            <h2 className="mt-3 text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Saved Study Kits
            </h2>
            <p className="mt-1 max-w-2xl text-sm leading-relaxed text-zinc-400 sm:text-base">
              Keep your study materials and generated learning tools organised
              in one place.
            </p>
          </div>
          <Link
            href="/notes"
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--color-primary)] px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-[var(--color-primary)]/20 transition hover:bg-[var(--color-primary)]/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg)] sm:w-auto"
          >
            <Plus className="h-4 w-4" />
            Create study kit
          </Link>
        </section>

        <section
          aria-label="Search and filter study kits"
          className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4 sm:p-5"
        >
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="relative w-full lg:max-w-md">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
              <label htmlFor="kit-search" className="sr-only">
                Search study kits
              </label>
              <input
                id="kit-search"
                type="search"
                value={search}
                onChange={(event) => setSearch(event.currentTarget.value)}
                placeholder="Search your study kits..."
                className="h-11 w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-secondary)] pl-10 pr-3.5 text-sm text-slate-100 placeholder-zinc-500 outline-none transition focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/30"
              />
            </div>
            <div
              aria-label="Study kit categories"
              className="flex flex-wrap gap-2"
            >
              {CATEGORIES.map((item) => (
                <button
                  key={item}
                  type="button"
                  aria-pressed={category === item}
                  onClick={() => setCategory(item)}
                  className={`rounded-lg border px-3.5 py-2 text-xs font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] ${
                    category === item
                      ? "border-[var(--color-primary)]/50 bg-[var(--color-primary)]/15 text-indigo-200"
                      : "border-[var(--color-border)] bg-[var(--color-surface-secondary)] text-zinc-400 hover:border-[var(--color-border)] hover:text-slate-200"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        </section>

        {visibleKits.length > 0 ? (
          <section
            aria-label="Study kits"
            className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3"
          >
            {visibleKits.map((kit) => (
              <article
                key={kit.title}
                className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5"
              >
                <h3 className="font-semibold text-white">{kit.title}</h3>
                <p className="mt-2 text-sm text-zinc-400">{kit.description}</p>
              </article>
            ))}
          </section>
        ) : (
          <section
            aria-labelledby="study-kits-empty-title"
            className="flex min-h-[360px] flex-col items-center justify-center rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] px-5 py-12 text-center"
          >
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-secondary)] text-[var(--color-primary)]">
              {search ? (
                <Search className="h-7 w-7" />
              ) : (
                <Layers className="h-7 w-7" />
              )}
            </div>
            <h3
              id="study-kits-empty-title"
              className="mt-5 text-base font-semibold text-white"
            >
              {search ? "No matching study kits" : "No saved study kits yet"}
            </h3>
            <p className="mt-2 max-w-md text-sm leading-relaxed text-zinc-400">
              {search
                ? "Try another search or choose a different category. Your saved kits will show here when available."
                : "When you create and save study kits, they will appear here. You can start by adding notes or a PDF."}
            </p>
            {!search && (
              <Link
                href="/notes"
                className="mt-5 inline-flex items-center gap-2 rounded-lg border border-[var(--color-primary)]/30 bg-[var(--color-primary)]/10 px-4 py-2.5 text-sm font-medium text-indigo-200 transition hover:bg-[var(--color-primary)]/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]"
              >
                <FileText className="h-4 w-4" />
                Add study material
                <Sparkles className="h-3.5 w-3.5" />
              </Link>
            )}
          </section>
        )}
      </div>
    </AppLayout>
  );
}
