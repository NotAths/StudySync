"use client";

import { useState, useSyncExternalStore, type FormEvent } from "react";
import Link from "next/link";
import {
  AlertCircle,
  BrainCircuit,
  CheckCircle2,
  CircleHelp,
  FileQuestion,
  LoaderCircle,
  RotateCcw,
  Sparkles,
} from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import {
  getServerStudyKitsSnapshot,
  getStudyKitsSnapshot,
  QuizQuestionsSchema,
  subscribeToStudyKits,
  type QuizQuestion,
} from "@/lib/study-kits";
import { recordQuizAttempt } from "@/lib/study-activity";

interface ActiveQuiz {
  title: string;
  kitId: string | null;
  topic: string;
  questions: QuizQuestion[];
  startedAt: number;
}

export default function QuizPage() {
  const { kits, error: storageError } = useSyncExternalStore(
    subscribeToStudyKits,
    getStudyKitsSnapshot,
    getServerStudyKitsSnapshot,
  );
  const [selectedKitId, setSelectedKitId] = useState("");
  const [topic, setTopic] = useState("");
  const [questionCount, setQuestionCount] = useState("10");
  const [difficulty, setDifficulty] = useState("mixed");
  const [error, setError] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeQuiz, setActiveQuiz] = useState<ActiveQuiz | null>(null);
  const [selectedAnswers, setSelectedAnswers] = useState<
    Record<number, number>
  >({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const selectedKit = kits.find((kit) => kit.id === selectedKitId);

  function resetQuiz() {
    setActiveQuiz(null);
    setSelectedAnswers({});
    setIsSubmitted(false);
    setError("");
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (!selectedKit && !topic.trim()) {
      setError("Choose a saved study kit or enter a topic to generate a quiz.");
      return;
    }

    setIsGenerating(true);
    resetQuiz();

    try {
      const material = selectedKit
        ? [
            `Title: ${selectedKit.title}`,
            `Subject: ${selectedKit.subject}`,
            `Summary: ${selectedKit.summary}`,
            `Key points:\n${selectedKit.keyPoints.map((point) => `- ${point}`).join("\n")}`,
            `Flashcards:\n${selectedKit.flashcards
              .map((card) => `Q: ${card.question}\nA: ${card.answer}`)
              .join("\n\n")}`,
            `Existing quiz concepts:\n${selectedKit.quizQuestions
              .map(
                (question) =>
                  `Q: ${question.question}\nCorrect answer: ${question.options[question.correctAnswer]}\nExplanation: ${question.explanation}`,
              )
              .join("\n\n")}`,
          ].join("\n\n")
        : undefined;

      const response = await fetch("/api/quizzes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic: selectedKit?.subject ?? topic.trim(),
          material,
          count: Number(questionCount),
          difficulty,
        }),
      });
      const responseBody = (await response.json()) as {
        error?: string;
        quizQuestions?: unknown;
      };

      if (!response.ok) {
        throw new Error(responseBody.error ?? "Quiz generation failed.");
      }

      const parsedQuestions = QuizQuestionsSchema.safeParse(
        responseBody.quizQuestions,
      );
      if (
        !parsedQuestions.success ||
        parsedQuestions.data.length !== Number(questionCount)
      ) {
        throw new Error("The generated quiz had an unexpected format.");
      }

      setActiveQuiz({
        title: selectedKit
          ? `${selectedKit.title} quiz`
          : `${topic.trim()} quiz`,
        kitId: selectedKit?.id ?? null,
        topic: selectedKit?.subject ?? topic.trim(),
        questions: parsedQuestions.data,
        startedAt: Date.now(),
      });
    } catch (generationError) {
      setError(
        generationError instanceof Error
          ? generationError.message
          : "Quiz generation failed. Please try again.",
      );
    } finally {
      setIsGenerating(false);
    }
  }

  function handleCheckAnswers(completedAt: number) {
    if (!activeQuiz || isSubmitted) return;
    if (Object.keys(selectedAnswers).length !== activeQuiz.questions.length) {
      setError("Answer every question before checking your results.");
      return;
    }

    setError("");
    try {
      recordQuizAttempt({
        kitId: activeQuiz.kitId,
        topic: activeQuiz.topic,
        score,
        total: activeQuiz.questions.length,
        durationSeconds: Math.floor(
          (completedAt - activeQuiz.startedAt) / 1000,
        ),
        incorrectQuestions: activeQuiz.questions
          .filter(
            (question, index) =>
              selectedAnswers[index] !== question.correctAnswer,
          )
          .map((question) => question.question),
      });
    } catch (activityError) {
      setError(
        activityError instanceof Error
          ? `Quiz completed, but analytics could not be saved: ${activityError.message}`
          : "Quiz completed, but analytics could not be saved.",
      );
    }
    setIsSubmitted(true);
  }

  const score =
    activeQuiz?.questions.reduce(
      (total, question, index) =>
        total + (selectedAnswers[index] === question.correctAnswer ? 1 : 0),
      0,
    ) ?? 0;

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
            Generate a fresh practice quiz from one of your saved study kits or
            choose a topic. Gemini will create the questions using your saved
            study material.
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
                  Pick a saved kit or enter a topic, then choose your quiz
                  settings.
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label
                  htmlFor="quiz-kit"
                  className="mb-2 block text-sm font-medium text-slate-200"
                >
                  Saved study kit
                </label>
                <select
                  id="quiz-kit"
                  value={selectedKitId}
                  disabled={kits.length === 0}
                  onChange={(event) => {
                    setSelectedKitId(event.currentTarget.value);
                    setTopic("");
                    resetQuiz();
                  }}
                  className="h-11 w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-secondary)] px-3.5 text-sm text-slate-100 outline-none transition focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/30 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  <option value="">
                    {kits.length > 0
                      ? "Choose a saved study kit"
                      : "No saved study kits available"}
                  </option>
                  {kits.map((kit) => (
                    <option key={kit.id} value={kit.id}>
                      {kit.title} — {kit.subject}
                    </option>
                  ))}
                </select>
                <p className="mt-1.5 text-xs text-zinc-500">
                  {kits.length > 0
                    ? `${kits.length} saved ${kits.length === 1 ? "kit" : "kits"} available in this browser.`
                    : "Create a kit from your notes first, or enter a topic below."}
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
                  disabled={Boolean(selectedKitId)}
                  onChange={(event) => {
                    setTopic(event.currentTarget.value);
                    resetQuiz();
                  }}
                  placeholder="e.g. Cell biology, Linear equations..."
                  className="h-11 w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-secondary)] px-3.5 text-sm text-slate-100 placeholder-zinc-500 outline-none transition focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/30 disabled:cursor-not-allowed disabled:opacity-60"
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
                      resetQuiz();
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
                      resetQuiz();
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
                  disabled={isGenerating}
                  className="inline-flex w-full items-center justify-center gap-2.5 rounded-xl bg-[var(--color-primary)] px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-[var(--color-primary)]/20 transition hover:bg-[var(--color-primary)]/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-surface)] active:scale-[0.99] disabled:cursor-wait disabled:opacity-70 sm:w-auto"
                >
                  {isGenerating ? (
                    <LoaderCircle className="h-4 w-4 animate-spin" />
                  ) : (
                    <BrainCircuit className="h-4 w-4" />
                  )}
                  {isGenerating ? "Generating..." : "Generate quiz"}
                </button>
                <p className="mt-2 text-xs leading-relaxed text-zinc-500">
                  Your selected saved-kit material is sent to Google Gemini.
                  The API key stays on the server.
                </p>
                {error && (
                  <p
                    role="alert"
                    className="mt-3 rounded-lg border border-rose-400/20 bg-rose-400/5 px-3.5 py-3 text-sm leading-relaxed text-rose-200"
                  >
                    {error}
                  </p>
                )}
              </div>
            </form>
          </section>

          <section
            aria-labelledby="quiz-ready-title"
            className="flex flex-col rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 sm:p-6"
          >
            <div className="flex items-center gap-2.5 border-b border-[var(--color-border)] pb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-secondary)] text-[var(--color-primary)]">
                <FileQuestion className="h-4 w-4" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-white">
                  Ready to practice
                </h3>
                <p className="text-xs text-zinc-400">Quiz settings</p>
              </div>
            </div>

            {storageError ? (
              <div className="flex flex-1 flex-col items-center justify-center px-3 py-10 text-center">
                <AlertCircle className="h-7 w-7 text-rose-300" />
                <p role="alert" className="mt-3 text-sm text-rose-200">
                  {storageError}
                </p>
              </div>
            ) : (
              <div className="flex flex-1 flex-col items-center justify-center px-3 py-10 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-secondary)] text-[var(--color-primary)]">
                  {selectedKit ? (
                    <CheckCircle2 className="h-7 w-7" />
                  ) : (
                    <CircleHelp className="h-7 w-7" />
                  )}
                </div>
                <h4
                  id="quiz-ready-title"
                  className="mt-4 text-sm font-semibold text-white"
                >
                  {selectedKit
                    ? selectedKit.title
                    : kits.length > 0
                      ? "Choose a study kit or topic"
                      : "No saved study kits yet"}
                </h4>
                <p className="mt-1.5 max-w-xs text-xs leading-relaxed text-zinc-400">
                  {selectedKit
                    ? `${selectedKit.quizQuestions.length} existing questions and ${selectedKit.flashcards.length} flashcards available as source material. Gemini will create a fresh quiz.`
                    : kits.length > 0
                      ? "Your saved kits are available in the selector. You can also generate a quiz from any topic."
                      : "Save a study kit from your notes, or enter a topic to create a quiz with Gemini."}
                </p>
                {!selectedKit && kits.length === 0 && (
                  <Link
                    href="/notes"
                    className="mt-5 inline-flex items-center gap-2 rounded-lg border border-[var(--color-primary)]/30 bg-[var(--color-primary)]/10 px-4 py-2.5 text-sm font-medium text-indigo-200 transition hover:bg-[var(--color-primary)]/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]"
                  >
                    <Sparkles className="h-4 w-4" />
                    Create a study kit
                  </Link>
                )}
              </div>
            )}
          </section>
        </div>

        {activeQuiz && (
          <section
            aria-labelledby="generated-quiz-title"
            className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 sm:p-7"
          >
            <div className="flex flex-col gap-4 border-b border-[var(--color-border)] pb-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-indigo-300">
                  {activeQuiz.questions.length} questions
                </p>
                <h3
                  id="generated-quiz-title"
                  className="mt-1 text-xl font-semibold text-white"
                >
                  {activeQuiz.title}
                </h3>
              </div>
              {isSubmitted && (
                <div
                  role="status"
                  className="inline-flex items-center gap-2 rounded-lg border border-emerald-400/20 bg-emerald-400/5 px-4 py-2.5 text-sm font-medium text-emerald-200"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  Score: {score} / {activeQuiz.questions.length}
                </div>
              )}
            </div>

            <div className="mt-6 space-y-6">
              {activeQuiz.questions.map((question, questionIndex) => (
                <fieldset
                  key={`${questionIndex}-${question.question}`}
                  className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-secondary)] p-4 sm:p-5"
                >
                  <legend className="max-w-full px-1 text-sm font-medium leading-relaxed text-white sm:text-base">
                    <span className="mr-2 text-[var(--color-primary)]">
                      {questionIndex + 1}.
                    </span>
                    {question.question}
                  </legend>
                  <div className="mt-3 grid gap-2">
                    {question.options.map((option, optionIndex) => {
                      const isCorrect = optionIndex === question.correctAnswer;
                      const isSelected =
                        selectedAnswers[questionIndex] === optionIndex;
                      const answerStyle = isSubmitted
                        ? isCorrect
                          ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-100"
                          : isSelected
                            ? "border-rose-400/30 bg-rose-400/10 text-rose-100"
                            : "border-[var(--color-border)] text-zinc-300"
                        : isSelected
                          ? "border-[var(--color-primary)]/50 bg-[var(--color-primary)]/10 text-white"
                          : "border-[var(--color-border)] text-zinc-300 hover:border-[var(--color-primary)]/40";

                      return (
                        <label
                          key={optionIndex}
                          className={`flex cursor-pointer items-start gap-3 rounded-lg border px-3.5 py-3 text-sm transition ${answerStyle} ${isSubmitted ? "cursor-default" : ""}`}
                        >
                          <input
                            type="radio"
                            name={`quiz-question-${questionIndex}`}
                            value={optionIndex}
                            checked={isSelected}
                            disabled={isSubmitted}
                            onChange={() => {
                              setSelectedAnswers((answers) => ({
                                ...answers,
                                [questionIndex]: optionIndex,
                              }));
                              setError("");
                            }}
                            className="mt-0.5 accent-[var(--color-primary)]"
                          />
                          <span>{option}</span>
                        </label>
                      );
                    })}
                  </div>
                  {isSubmitted && (
                    <p className="mt-3 text-sm leading-relaxed text-zinc-300">
                      <span className="font-medium text-white">
                        Explanation:
                      </span>{" "}
                      {question.explanation}
                    </p>
                  )}
                </fieldset>
              ))}
            </div>

            <div className="mt-6 flex flex-col gap-3 border-t border-[var(--color-border)] pt-5 sm:flex-row sm:items-center">
              {!isSubmitted ? (
                <button
                  type="button"
                  onClick={() => handleCheckAnswers(Date.now())}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--color-primary)] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[var(--color-primary)]/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  Check answers
                </button>
              ) : (
                <button
                  type="button"
                  onClick={resetQuiz}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-secondary)] px-5 py-3 text-sm font-medium text-slate-200 transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]"
                >
                  <RotateCcw className="h-4 w-4" />
                  Close quiz
                </button>
              )}
            </div>
          </section>
        )}
      </div>
    </AppLayout>
  );
}
