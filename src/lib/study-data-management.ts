const DATA_STORAGE_KEYS = {
  studyKits: "studysync-study-kits",
  studyActivity: "studysync-study-activity",
  revisionPlan: "studysync-revision-plan",
} as const;

const STORAGE_KEYS = {
  ...DATA_STORAGE_KEYS,
  studySettings: "studysync-study-settings",
} as const;

export interface StudyDataBackup {
  exportedAt: string;
  app: "StudySync";
  data: {
    studyKits: unknown;
    studyActivity: unknown;
    revisionPlan: unknown;
    studySettings: unknown;
  };
}

export function exportLocalStudyData(): StudyDataBackup {
  return {
    exportedAt: new Date().toISOString(),
    app: "StudySync",
    data: {
      studyKits: readStoredJson(STORAGE_KEYS.studyKits, "study kits"),
      studyActivity: readStoredJson(
        STORAGE_KEYS.studyActivity,
        "study activity",
      ),
      revisionPlan: readStoredJson(
        STORAGE_KEYS.revisionPlan,
        "revision plan",
      ),
      studySettings: readStoredJson(
        STORAGE_KEYS.studySettings,
        "study preferences",
      ),
    },
  };
}

export function clearLocalStudyData() {
  for (const key of Object.values(DATA_STORAGE_KEYS)) {
    window.localStorage.removeItem(key);
  }

  window.dispatchEvent(new Event("studysync-study-kits-change"));
  window.dispatchEvent(new Event("studysync-study-activity-change"));
  window.dispatchEvent(new Event("studysync-revision-plan-change"));
}

function readStoredJson(key: string, label: string): unknown {
  const value = window.localStorage.getItem(key);
  if (value === null) return null;

  try {
    return JSON.parse(value) as unknown;
  } catch {
    throw new Error(
      `Saved ${label} are not valid JSON, so the backup could not be created.`,
    );
  }
}
