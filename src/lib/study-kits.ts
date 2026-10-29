import { z } from "zod";

export const QuizQuestionSchema = z.object({
  question: z.string().min(1),
  options: z.array(z.string().min(1)).length(4),
  correctAnswer: z.number().int().min(0).max(3),
  explanation: z.string().min(1),
});

export const QuizQuestionsSchema = z.array(QuizQuestionSchema).min(1);

const FlashcardSchema = z.object({
  question: z.string().min(1),
  answer: z.string().min(1),
});

export const StudyKitContentSchema = z.object({
  title: z.string().min(1),
  subject: z.string().min(1),
  summary: z.string().min(1),
  keyPoints: z.array(z.string().min(1)).min(3),
  flashcards: z.array(FlashcardSchema).min(8).max(12),
  quizQuestions: z.array(QuizQuestionSchema).min(3),
});

export const GeneratedStudyKitSchema = StudyKitContentSchema.extend({
  flashcards: z.array(FlashcardSchema).min(3).max(12),
  id: z.string().min(1),
  createdAt: z.string().datetime(),
});

export type StudyKitContent = z.infer<typeof StudyKitContentSchema>;
export type GeneratedStudyKit = z.infer<typeof GeneratedStudyKitSchema>;
export type QuizQuestion = z.infer<typeof QuizQuestionSchema>;

const STORAGE_KEY = "studysync-study-kits";

export interface StudyKitStoreSnapshot {
  kits: GeneratedStudyKit[];
  error: string;
}

const EMPTY_SNAPSHOT: StudyKitStoreSnapshot = { kits: [], error: "" };
let lastStorageValue: string | null | undefined;
let lastSnapshot = EMPTY_SNAPSHOT;

export function subscribeToStudyKits(listener: () => void) {
  if (typeof window === "undefined") return () => {};

  window.addEventListener("storage", listener);
  window.addEventListener("studysync-study-kits-change", listener);

  return () => {
    window.removeEventListener("storage", listener);
    window.removeEventListener("studysync-study-kits-change", listener);
  };
}

export function getStudyKitsSnapshot(): StudyKitStoreSnapshot {
  try {
    const storedKits = window.localStorage.getItem(STORAGE_KEY);
    if (storedKits === lastStorageValue) return lastSnapshot;
    lastStorageValue = storedKits;

    if (!storedKits) {
      lastSnapshot = EMPTY_SNAPSHOT;
      return lastSnapshot;
    }

    let parsedKits: unknown;
    try {
      parsedKits = JSON.parse(storedKits);
    } catch {
      lastSnapshot = {
        kits: [],
        error: "Saved study kits could not be read from browser storage.",
      };
      return lastSnapshot;
    }

    const result = z.array(GeneratedStudyKitSchema).safeParse(parsedKits);
    lastSnapshot = result.success
      ? { kits: result.data, error: "" }
      : {
          kits: [],
          error: "Saved study kits have invalid data in browser storage.",
        };
    return lastSnapshot;
  } catch {
    lastStorageValue = undefined;
    lastSnapshot = {
      kits: [],
      error: "Browser storage is unavailable. Saved study kits cannot be loaded.",
    };
    return lastSnapshot;
  }
}

export function getServerStudyKitsSnapshot() {
  return EMPTY_SNAPSHOT;
}

export function readSavedStudyKits(): GeneratedStudyKit[] {
  const storedKits = window.localStorage.getItem(STORAGE_KEY);
  if (!storedKits) return [];

  let parsedKits: unknown;
  try {
    parsedKits = JSON.parse(storedKits);
  } catch {
    throw new Error("Saved study kits could not be read from browser storage.");
  }

  const result = z.array(GeneratedStudyKitSchema).safeParse(parsedKits);
  if (!result.success) {
    throw new Error("Saved study kits have invalid data in browser storage.");
  }

  return result.data;
}

export function saveStudyKit(kit: GeneratedStudyKit): GeneratedStudyKit[] {
  const existingKits = readSavedStudyKits();
  const updatedKits = [
    kit,
    ...existingKits.filter((existingKit) => existingKit.id !== kit.id),
  ];

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedKits));
  window.dispatchEvent(new Event("studysync-study-kits-change"));
  return updatedKits;
}
