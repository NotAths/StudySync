"use client";

import { useState, type FormEvent, type ChangeEvent } from "react";
import {
  AlertCircle,
  BookOpenText,
  CheckCircle2,
  FileText,
  FileUp,
  Sparkles,
} from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";

const MAX_PDF_SIZE = 10 * 1024 * 1024;

export default function NotesPage() {
  const [subject, setSubject] = useState("");
  const [notes, setNotes] = useState("");
  const [pdf, setPdf] = useState<File | null>(null);
  const [fileError, setFileError] = useState("");
  const [generationMessage, setGenerationMessage] = useState("");

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const selectedFile = event.currentTarget.files?.[0];
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

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setGenerationMessage(
      "AI generation will be connected in a later step. Your notes and PDF have not been uploaded or saved.",
    );
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
                  Your content stays in this browser; nothing is uploaded.
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
                  className="inline-flex w-full items-center justify-center gap-2.5 rounded-xl bg-[var(--color-primary)] px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-[var(--color-primary)]/20 transition hover:bg-[var(--color-primary)]/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-surface)] active:scale-[0.99] sm:w-auto"
                >
                  <Sparkles className="h-4 w-4" />
                  Generate Study Kit
                </button>
                {generationMessage && (
                  <p
                    role="status"
                    className="mt-3 rounded-lg border border-amber-400/20 bg-amber-400/5 px-3.5 py-3 text-sm leading-relaxed text-amber-200"
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
                  Saved Notes
                </h3>
                <p className="text-xs text-zinc-400">
                  Your note collection
                </p>
              </div>
            </div>

            <div className="flex min-h-64 flex-col items-center justify-center px-3 py-10 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-secondary)] text-[var(--color-primary)]">
                <FileText className="h-7 w-7" />
              </div>
              <h4 className="mt-4 text-sm font-semibold text-white">
                No saved notes yet
              </h4>
              <p className="mt-1.5 max-w-xs text-xs leading-relaxed text-zinc-400">
                Notes you save will appear here. For now, you can draft notes or
                select a PDF above; they won&apos;t be stored after you leave
                this page.
              </p>
            </div>
          </section>
        </div>
      </div>
    </AppLayout>
  );
}
