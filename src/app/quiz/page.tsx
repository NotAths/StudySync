"use client";

import { useState, type FormEvent } from "react";
import {
  AlertCircle,
  BrainCircuit,
  CircleHelp,
  FileQuestion,
  Sparkles,
} from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";

export default function QuizPage() {
  const [topic, setTopic] = useState("");
  const [questionCount, setQuestionCount] = useState("10");
  const [difficulty, setDifficulty] = useState("mixed");
  const [message, setMessage] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(
      "AI quiz generation will be connected in a later step. No quiz has been generated.",
    );
  }

  return (
    <AppLayout title="AI Quiz">
      <div className="app-page space-y-8 pb-12">
        <section>
          <div className="inline-flex items-center gap-2 rounded-full border border-[var(--color-primary)]/30 bg-[var(--color-primary)]/10 px-3 py-1 text-xs font-medium text-indigo-300">
            <BrainCircuit className="h-3.5 w-3.5 text-[var(--color-primary)]" />
            <span>Practice and review</span>
          </div>
          <h2 className="mt-3 text-2xl font-bold tracking-tight text-white sm:text-3xl">
            AI Quiz
          </h2>
          <p className="mt-1 max-w-2xl text-sm leading-relaxed text-zinc-400 sm:text-base">
            Set up a practice quiz for a topic you&apos;re studying. Quiz
            generation will be available when the AI connection is ready.
          </p>
        </section>

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.15fr)_minmax(300px,0.85fr)]">
          <section className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 sm:p-7">
            <div className="mb-6 flex items-start gap-3 border-b border-[var(--color-border)] pb-5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[var(--color-primary)]/30 bg-[var(--color-primary)]/10 text-[var(--color-primary)]">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-white">
                  Set up your quiz
                </h3>
                <p className="mt-1 text-xs leading-relaxed text-zinc-400">
                  Choose a saved kit or enter a topic to practice.
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label
                  htmlFor="quiz-kit"
                  className="mb-2 block text-sm font-medium text-slate-200"
                >
                  Study kit
                </label>
                <select
                  id="quiz-kit"
                  disabled
                  defaultValue=""
                  className="h-11 w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-secondary)] px-3.5 text-sm text-zinc-400 outline-none disabled:cursor-not-allowed disabled:opacity-80"
                >
                  <option value="">No saved study kits available yet</option>
                </select>
                <p className="mt-1.5 text-xs text-zinc-500">
                  Saved kits will be selectable when they are available.
                </p>
              </div>

              <div>
                <label
                  htmlFor="quiz-topic"
                  className="mb-2 block text-sm font-medium text-slate-200"
                >
                  Or enter a topic
                  <span className="ml-1 text-zinc-500">(optional)</span>
                </label>
                <input
                  id="quiz-topic"
                  type="text"
                  value={topic}
                  onChange={(event) => {
                    setTopic(event.currentTarget.value);
                    setMessage("");
                  }}
                  placeholder="e.g. Cell biology, Linear equations..."
                  className="h-11 w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-secondary)] px-3.5 text-sm text-slate-100 placeholder-zinc-500 outline-none transition focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/30"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="quiz-count"
                    className="mb-2 block text-sm font-medium text-slate-200"
                  >
                    Number of questions
                  </label>
                  <select
                    id="quiz-count"
                    value={questionCount}
                    onChange={(event) => {
                      setQuestionCount(event.currentTarget.value);
                      setMessage("");
                    }}
                    className="h-11 w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-secondary)] px-3.5 text-sm text-slate-100 outline-none transition focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/30"
                  >
                    <option value="5">5 questions</option>
                    <option value="10">10 questions</option>
                    <option value="15">15 questions</option>
                    <option value="20">20 questions</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="quiz-difficulty"
                    className="mb-2 block text-sm font-medium text-slate-200"
                  >
                    Difficulty
                  </label>
                  <select
                    id="quiz-difficulty"
                    value={difficulty}
                    onChange={(event) => {
                      setDifficulty(event.currentTarget.value);
                      setMessage("");
                    }}
                    className="h-11 w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-secondary)] px-3.5 text-sm text-slate-100 outline-none transition focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/30"
                  >
                    <option value="mixed">Mixed</option>
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>
                </div>
              </div>

              <div className="border-t border-[var(--color-border)] pt-5">
                <button
                  type="submit"
                  className="inline-flex w-full items-center justify-center gap-2.5 rounded-xl bg-[var(--color-primary)] px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-[var(--color-primary)]/20 transition hover:bg-[var(--color-primary)]/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-surface)] active:scale-[0.99] sm:w-auto"
                >
                  <BrainCircuit className="h-4 w-4" />
                  Start quiz
                </button>
                {message && (
                  <p
                    role="status"
                    className="mt-3 rounded-lg border border-amber-400/20 bg-amber-400/5 px-3.5 py-3 text-sm leading-relaxed text-amber-200"
                  >
                    {message}
                  </p>
                )}
              </div>
            </form>
          </section>

          <section
            aria-labelledby="quiz-empty-title"
            className="flex flex-col rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 sm:p-6"
          >
            <div className="flex items-center gap-2.5 border-b border-[var(--color-border)] pb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-secondary)] text-[var(--color-primary)]">
                <FileQuestion className="h-4 w-4" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-white">
                  Your quizzes
                </h3>
                <p className="text-xs text-zinc-400">Practice history</p>
              </div>
            </div>

            <div className="flex flex-1 flex-col items-center justify-center px-3 py-12 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-secondary)] text-[var(--color-primary)]">
                <CircleHelp className="h-7 w-7" />
              </div>
              <h4 id="quiz-empty-title" className="mt-4 text-sm font-semibold text-white">
                No quizzes yet
              </h4>
              <p className="mt-1.5 max-w-xs text-xs leading-relaxed text-zinc-400">
                Quizzes will appear here after AI generation is connected. No
                practice questions or results have been created.
              </p>
              <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-[var(--color-primary)]/20 bg-[var(--color-primary)]/5 px-3 py-1.5 text-xs text-indigo-200">
                <AlertCircle className="h-3.5 w-3.5" />
                <span>Generation is not connected</span>
              </div>
            </div>
          </section>
        </div>
      </div>
    </AppLayout>
  );
}
