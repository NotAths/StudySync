import { z } from "zod";

const QuizAttemptSchema = z.object({
  id: z.string().min(1),
  kitId: z.string().nullable(),
  topic: z.string().min(1),
  score: z.number().int().min(0),
  total: z.number().int().min(1),
  durationSeconds: z.number().int().min(0),
  incorrectQuestions: z.array(z.string()),
  completedAt: z.string().datetime(),
});

const FlashcardReviewSchema = z.object({
  id: z.string().min(1),
  kitId: z.string().min(1),
  cardIndex: z.number().int().min(0),
  known: z.boolean(),
  durationSeconds: z.number().int().min(0),
  reviewedAt: z.string().datetime(),
});

const StudyActivitySchema = z.object({
  quizAttempts: z.array(QuizAttemptSchema),
  flashcardReviews: z.array(FlashcardReviewSchema),
});

export type QuizAttempt = z.infer<typeof QuizAttemptSchema>;
export type FlashcardReview = z.infer<typeof FlashcardReviewSchema>;

export interface StudyActivitySnapshot {
  quizAttempts: QuizAttempt[];
  flashcardReviews: FlashcardReview[];
  error: string;
}

const STORAGE_KEY = "studysync-study-activity";
const CHANGE_EVENT = "studysync-study-activity-change";
const EMPTY_SNAPSHOT: StudyActivitySnapshot = {
  quizAttempts: [],
  flashcardReviews: [],
  error: "",
};
let lastStorageValue: string | null | undefined;
let lastSnapshot = EMPTY_SNAPSHOT;

function createId() {
  if (typeof crypto.randomUUID === "function") return crypto.randomUUID();
  return `activity-${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
}

function parseActivity(storedActivity: string | null): StudyActivitySnapshot {
  if (!storedActivity) return EMPTY_SNAPSHOT;

  let parsedActivity: unknown;
  try {
    parsedActivity = JSON.parse(storedActivity);
  } catch {
    return {
      ...EMPTY_SNAPSHOT,
      error: "Saved study activity could not be read from browser storage.",
    };
  }

  const result = StudyActivitySchema.safeParse(parsedActivity);
  return result.success
    ? { ...result.data, error: "" }
    : {
        ...EMPTY_SNAPSHOT,
        error: "Saved study activity has invalid data in browser storage.",
      };
}

function readActivityForUpdate(): StudyActivitySnapshot {
  const snapshot = parseActivity(window.localStorage.getItem(STORAGE_KEY));
  if (snapshot.error) throw new Error(snapshot.error);
  return snapshot;
}

function saveActivity(activity: StudyActivitySnapshot) {
  const storedActivity = {
    quizAttempts: activity.quizAttempts.slice(-200),
    flashcardReviews: activity.flashcardReviews.slice(-1000),
  };
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(storedActivity));
  lastStorageValue = undefined;
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

export function subscribeToStudyActivity(listener: () => void) {
  if (typeof window === "undefined") return () => {};

  window.addEventListener("storage", listener);
  window.addEventListener(CHANGE_EVENT, listener);

  return () => {
    window.removeEventListener("storage", listener);
    window.removeEventListener(CHANGE_EVENT, listener);
  };
}

export function getStudyActivitySnapshot(): StudyActivitySnapshot {
  try {
    const storedActivity = window.localStorage.getItem(STORAGE_KEY);
    if (storedActivity === lastStorageValue) return lastSnapshot;
    lastStorageValue = storedActivity;
    lastSnapshot = parseActivity(storedActivity);
    return lastSnapshot;
  } catch {
    lastStorageValue = undefined;
    lastSnapshot = {
      ...EMPTY_SNAPSHOT,
      error: "Browser storage is unavailable. Study activity cannot be loaded.",
    };
    return lastSnapshot;
  }
}

export function getServerStudyActivitySnapshot() {
  return EMPTY_SNAPSHOT;
}

export function recordQuizAttempt(
  attempt: Omit<QuizAttempt, "id" | "completedAt">,
) {
  const activity = readActivityForUpdate();
  const quizAttempt = QuizAttemptSchema.parse({
    ...attempt,
    id: createId(),
    completedAt: new Date().toISOString(),
  });
  saveActivity({
    ...activity,
    quizAttempts: [...activity.quizAttempts, quizAttempt],
  });
}

export function recordFlashcardReview(
  review: Omit<FlashcardReview, "id" | "reviewedAt">,
) {
  const activity = readActivityForUpdate();
  const flashcardReview = FlashcardReviewSchema.parse({
    ...review,
    id: createId(),
    reviewedAt: new Date().toISOString(),
  });
  saveActivity({
    ...activity,
    flashcardReviews: [...activity.flashcardReviews, flashcardReview],
  });
}
