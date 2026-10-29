"use client";

import { useState, type FormEvent, type ChangeEvent } from "react";
import Link from "next/link";
import {
  AlertCircle,
  BookOpenText,
  CheckCircle2,
  FileText,
  FileUp,
  LoaderCircle,
  Sparkles,
} from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import {
  saveStudyKit,
  StudyKitContentSchema,
  type GeneratedStudyKit,
} from "@/lib/study-kits";

const MAX_PDF_SIZE = 10 * 1024 * 1024;

function createStudyKitId() {
  if (typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }

  return `kit-${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
}

export default function NotesPage() {
  const [subject, setSubject] = useState("");
  const [notes, setNotes] = useState("");
  const [pdf, setPdf] = useState<File | null>(null);
  const [fileError, setFileError] = useState("");
  const [generationError, setGenerationError] = useState("");
  const [generationMessage, setGenerationMessage] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedKit, setGeneratedKit] = useState<GeneratedStudyKit | null>(
    null,
  );

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const selectedFile = event.currentTarget.files?.[0];
    setGeneratedKit(null);
    setGenerationError("");
    setGenerationMessage("");
    setFileError("");

    if (!selectedFile) {
      setPdf(null);
      return;
    }

    const hasPdfExtension = selectedFile.name.toLowerCase().endsWith(".pdf");
    const hasPdfType =
      !selectedFile.type || selectedFile.type === "application/pdf";

    if (!hasPdfExtension || !hasPdfType) {
      setPdf(null);
      setFileError("Choose a PDF file to continue.");
      event.currentTarget.value = "";
      return;
    }

    if (selectedFile.size > MAX_PDF_SIZE) {
      setPdf(null);
      setFileError("This PDF is larger than 10 MB. Choose a smaller file.");
      event.currentTarget.value = "";
      return;
    }

    setPdf(selectedFile);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setGenerationError("");
    setGenerationMessage("");
    setGeneratedKit(null);

    if (!notes.trim() && !pdf) {
      setGenerationError("Add notes or choose a PDF before generating a study kit.");
      return;
    }

    setIsGenerating(true);
    try {
      const formData = new FormData();
      formData.set("subject", subject);
      formData.set("notes", notes);
      if (pdf) formData.set("pdf", pdf);

      const response = await fetch("/api/study-kits", {
        method: "POST",
        body: formData,
      });
      const responseBody = (await response.json()) as {
        error?: string;
        kit?: unknown;
      };

      if (!response.ok) {
        throw new Error(responseBody.error ?? "Study-kit generation failed.");
      }

      const content = StudyKitContentSchema.safeParse(responseBody.kit);
      if (!content.success) {
        throw new Error("The generated study kit had an unexpected format.");
      }

      const kit: GeneratedStudyKit = {
        ...content.data,
        id: createStudyKitId(),
        createdAt: new Date().toISOString(),
      };
      setGeneratedKit(kit);

      try {
        saveStudyKit(kit);
        setGenerationMessage("Study kit generated and saved in this browser.");
      } catch (error) {
        setGenerationError(
          error instanceof Error
            ? `The kit was generated but could not be saved: ${error.message}`
            : "The kit was generated but could not be saved in this browser.",
        );
      }
    } catch (error) {
      setGenerationError(
        error instanceof Error
          ? error.message
          : "Study-kit generation failed. Please try again.",
      );
    } finally {
      setIsGenerating(false);
    }
  }

  return (
    <AppLayout title="My Notes">
      <div className="app-page space-y-8 pb-12">
        <section>
          <div className="inline-flex items-center gap-2 rounded-full border border-[var(--color-primary)]/30 bg-[var(--color-primary)]/10 px-3 py-1 text-xs font-medium text-indigo-300">
            <BookOpenText className="h-3.5 w-3.5 text-[var(--color-primary)]" />
            <span>Your study workspace</span>
          </div>
          <h2 className="mt-3 text-2xl font-bold tracking-tight text-white sm:text-3xl">
            My Notes
          </h2>
          <p className="mt-1 max-w-2xl text-sm leading-relaxed text-zinc-400 sm:text-base">
            Bring your class notes together. Paste your study material or choose
            a PDF to prepare it for a study kit.
          </p>
        </section>

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.65fr)_minmax(280px,0.85fr)]">
          <section className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 sm:p-7">
            <div className="mb-6 flex items-start gap-3 border-b border-[var(--color-border)] pb-5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[var(--color-primary)]/30 bg-[var(--color-primary)]/10 text-[var(--color-primary)]">
                <FileText className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-white">
                  Add study material
                </h3>
                <p className="mt-1 text-xs leading-relaxed text-zinc-400">
                  Notes and PDFs are sent to Google Gemini for generation. Generated
                  kits are saved in this browser.
                </p>
              </div>
            </div>

            <form className="space-y-5" onSubmit={handleSubmit}>
              <div>
                <label
                  htmlFor="note-subject"
                  className="mb-2 block text-sm font-medium text-slate-200"
                >
                  Subject or topic
                  <span className="ml-1 text-zinc-500">(optional)</span>
                </label>
                <input
                  id="note-subject"
                  type="text"
                  value={subject}
                  onChange={(event) => {
                    setSubject(event.currentTarget.value);
                    setGeneratedKit(null);
                    setGenerationError("");
                    setGenerationMessage("");
                  }}
                  placeholder="e.g. Cell biology, World War II..."
                  className="h-11 w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-secondary)] px-3.5 text-sm text-slate-100 placeholder-zinc-500 outline-none transition focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/30"
                />
              </div>

              <div>
                <label
                  htmlFor="study-notes"
                  className="mb-2 block text-sm font-medium text-slate-200"
                >
                  Paste your notes
                  <span className="ml-1 text-zinc-500">(optional)</span>
                </label>
                <textarea
                  id="study-notes"
                  value={notes}
                  onChange={(event) => {
                    setNotes(event.currentTarget.value);
                    setGeneratedKit(null);
                    setGenerationError("");
                    setGenerationMessage("");
                  }}
                  rows={9}
                  placeholder="Paste lecture notes, key concepts, or anything you want to study..."
                  className="w-full resize-y rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-secondary)] px-3.5 py-3 text-sm leading-relaxed text-slate-100 placeholder-zinc-500 outline-none transition focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/30"
                />
                <p className="mt-1.5 text-right text-xs text-zinc-500">
                  {notes.length.toLocaleString()} characters
                </p>
              </div>

              <div>
                <label
                  htmlFor="note-pdf"
                  className="mb-2 block text-sm font-medium text-slate-200"
                >
                  Add a PDF
                  <span className="ml-1 text-zinc-500">(optional, up to 10 MB)</span>
                </label>
                <label
                  htmlFor="note-pdf"
                  className="group flex min-h-28 cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-[var(--color-border)] bg-[var(--color-surface-secondary)]/70 px-4 py-5 text-center transition hover:border-[var(--color-primary)]/70 hover:bg-[var(--color-primary)]/5 focus-within:outline-none focus-within:ring-2 focus-within:ring-[var(--color-primary)]"
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-primary)]">
                    <FileUp className="h-5 w-5" />
                  </span>
                  <span className="mt-2 text-sm font-medium text-slate-200">
                    {pdf ? pdf.name : "Choose a PDF from your device"}
                  </span>
                  <span className="mt-1 text-xs text-zinc-500">
                    PDF only · Maximum file size 10 MB
                  </span>
                  <input
                    id="note-pdf"
                    type="file"
                    accept=".pdf,application/pdf"
                    onChange={handleFileChange}
                    aria-describedby="pdf-feedback"
                    className="sr-only"
                  />
                </label>
                <div
                  id="pdf-feedback"
                  aria-live="polite"
                  className="mt-2 min-h-5 text-xs"
                >
                  {fileError ? (
                    <span className="inline-flex items-center gap-1.5 text-rose-300">
                      <AlertCircle className="h-3.5 w-3.5" />
                      {fileError}
                    </span>
                  ) : pdf ? (
                    <span className="inline-flex items-center gap-1.5 text-emerald-300">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      PDF selected · {(pdf.size / (1024 * 1024)).toFixed(2)} MB
                    </span>
                  ) : null}
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
                    <Sparkles className="h-4 w-4" />
                  )}
                  {isGenerating ? "Generating..." : "Generate Study Kit"}
                </button>
                <p className="mt-2 text-xs leading-relaxed text-zinc-500">
                  Your study material will be processed by Google Gemini. Only the
                  generated kit is saved in this browser.
                </p>
                {generationError && (
                  <p
                    role="alert"
                    className="mt-3 rounded-lg border border-rose-400/20 bg-rose-400/5 px-3.5 py-3 text-sm leading-relaxed text-rose-200"
                  >
                    {generationError}
                  </p>
                )}
                {generationMessage && (
                  <p
                    role="status"
                    className="mt-3 rounded-lg border border-emerald-400/20 bg-emerald-400/5 px-3.5 py-3 text-sm leading-relaxed text-emerald-200"
                  >
                    {generationMessage}
                  </p>
                )}
              </div>
            </form>
          </section>

          <section
            aria-labelledby="saved-notes-title"
            className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 sm:p-6"
          >
            <div className="flex items-center gap-2.5 border-b border-[var(--color-border)] pb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-secondary)] text-[var(--color-primary)]">
                <BookOpenText className="h-4 w-4" />
              </div>
              <div>
                <h3
                  id="saved-notes-title"
                  className="text-base font-semibold text-white"
                >
                  Saved Study Kits
                </h3>
                <p className="text-xs text-zinc-400">
                  Stored in this browser
                </p>
              </div>
            </div>

            <div className="flex min-h-64 flex-col items-center justify-center px-3 py-10 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-secondary)] text-[var(--color-primary)]">
                <FileText className="h-7 w-7" />
              </div>
              <h4 className="mt-4 text-sm font-semibold text-white">
                Your saved study kits
              </h4>
              <p className="mt-1.5 max-w-xs text-xs leading-relaxed text-zinc-400">
                Generated kits stay on this device and are available from
                your study-kit library.
              </p>
              <Link
                href="/study-kits"
                className="mt-4 text-xs font-medium text-indigo-300 underline decoration-indigo-300/40 underline-offset-4 hover:text-indigo-200"
              >
                View study-kit library
              </Link>
            </div>
          </section>
        </div>

        {generatedKit && (
          <section
            aria-labelledby="generated-kit-title"
            className="space-y-5 rounded-2xl border border-[var(--color-primary)]/30 bg-[var(--color-surface)] p-5 sm:p-7"
          >
            <div className="flex flex-col gap-3 border-b border-[var(--color-border)] pb-5 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-indigo-300">
                  Generated study kit · {generatedKit.subject}
                </p>
                <h3
                  id="generated-kit-title"
                  className="mt-1 text-xl font-bold text-white"
                >
                  {generatedKit.title}
                </h3>
                <p className="mt-2 max-w-3xl text-sm leading-relaxed text-zinc-300">
                  {generatedKit.summary}
                </p>
              </div>
              <Link
                href="/study-kits"
                className="shrink-0 text-sm font-medium text-indigo-300 hover:text-indigo-200"
              >
                View saved kits
              </Link>
            </div>

            <div className="grid gap-5 lg:grid-cols-3">
              <div>
                <h4 className="font-semibold text-white">Key points</h4>
                <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-zinc-300">
                  {generatedKit.keyPoints.map((point, index) => (
                    <li key={`${index}-${point}`}>{point}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-white">Flashcards</h4>
                <div className="mt-3 space-y-3">
                  {generatedKit.flashcards.map((card, index) => (
                    <article
                      key={`${index}-${card.question}`}
                      className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-secondary)] p-3"
                    >
                      <p className="text-sm font-medium text-slate-100">
                        {card.question}
                      </p>
                      <p className="mt-1.5 text-sm leading-relaxed text-zinc-400">
                        {card.answer}
                      </p>
                    </article>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="font-semibold text-white">Quiz questions</h4>
                <div className="mt-3 space-y-3">
                  {generatedKit.quizQuestions.map((question, index) => (
                    <article
                      key={`${index}-${question.question}`}
                      className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-secondary)] p-3"
                    >
                      <p className="text-sm font-medium text-slate-100">
                        {question.question}
                      </p>
                      <p className="mt-1.5 text-xs leading-relaxed text-zinc-400">
                        Answer: {question.options[question.correctAnswer]}
                        {" — "}
                        {question.explanation}
                      </p>
                    </article>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}
      </div>
    </AppLayout>
  );
}
