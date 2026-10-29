import { z } from "zod";

const StudySettingsSchema = z.object({
  weeklyGoal: z.union([
    z.literal(3),
    z.literal(5),
    z.literal(7),
    z.literal(10),
  ]),
});

export type StudySettings = z.infer<typeof StudySettingsSchema>;

export interface StudySettingsSnapshot extends StudySettings {
  error: string;
}

const STORAGE_KEY = "studysync-study-settings";
const CHANGE_EVENT = "studysync-study-settings-change";
const DEFAULT_SETTINGS: StudySettings = { weeklyGoal: 5 };
const DEFAULT_SNAPSHOT: StudySettingsSnapshot = {
  ...DEFAULT_SETTINGS,
  error: "",
};
let lastStorageValue: string | null | undefined;
let lastSnapshot = DEFAULT_SNAPSHOT;

function parseSettings(value: string | null): StudySettingsSnapshot {
  if (!value) return DEFAULT_SNAPSHOT;

  let parsed: unknown;
  try {
    parsed = JSON.parse(value);
  } catch {
    return {
      ...DEFAULT_SETTINGS,
      error: "Saved study preferences could not be read from browser storage.",
    };
  }

  const result = StudySettingsSchema.safeParse(parsed);
  return result.success
    ? { ...result.data, error: "" }
    : {
        ...DEFAULT_SETTINGS,
        error: "Saved study preferences have invalid data in browser storage.",
      };
}

export function subscribeToStudySettings(listener: () => void) {
  if (typeof window === "undefined") return () => {};

  window.addEventListener("storage", listener);
  window.addEventListener(CHANGE_EVENT, listener);

  return () => {
    window.removeEventListener("storage", listener);
    window.removeEventListener(CHANGE_EVENT, listener);
  };
}

export function getStudySettingsSnapshot(): StudySettingsSnapshot {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === lastStorageValue) return lastSnapshot;
    lastStorageValue = stored;
    lastSnapshot = parseSettings(stored);
    return lastSnapshot;
  } catch {
    lastStorageValue = undefined;
    lastSnapshot = {
      ...DEFAULT_SETTINGS,
      error: "Browser storage is unavailable. Study preferences cannot be loaded.",
    };
    return lastSnapshot;
  }
}

export function getServerStudySettingsSnapshot() {
  return DEFAULT_SNAPSHOT;
}

export function setWeeklyStudyGoal(weeklyGoal: number) {
  const settings = StudySettingsSchema.parse({ weeklyGoal });
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  lastStorageValue = undefined;
  window.dispatchEvent(new Event(CHANGE_EVENT));
}
