import { z } from "zod";

const RevisionTaskSchema = z.object({
  id: z.string().min(1),
  title: z.string().trim().min(1).max(120),
  kitId: z.string().nullable(),
  dueDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  completed: z.boolean(),
  source: z.enum(["manual", "generated"]).default("manual"),
  sessionType: z.enum(["review", "flashcards", "quiz", "custom"]).default("custom"),
  createdAt: z.string().datetime(),
});

const RevisionPlanSchema = z.object({
  examDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).or(z.literal("")),
  tasks: z.array(RevisionTaskSchema).max(500),
});

export type RevisionTask = z.infer<typeof RevisionTaskSchema>;

export interface RevisionPlanSnapshot {
  examDate: string;
  tasks: RevisionTask[];
  error: string;
}

const STORAGE_KEY = "studysync-revision-plan";
const CHANGE_EVENT = "studysync-revision-plan-change";
const EMPTY_SNAPSHOT: RevisionPlanSnapshot = {
  examDate: "",
  tasks: [],
  error: "",
};
let lastStorageValue: string | null | undefined;
let lastSnapshot = EMPTY_SNAPSHOT;

function createId() {
  if (typeof crypto.randomUUID === "function") return crypto.randomUUID();
  return `revision-${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
}

function parsePlan(storedPlan: string | null): RevisionPlanSnapshot {
  if (!storedPlan) return EMPTY_SNAPSHOT;

  let parsedPlan: unknown;
  try {
    parsedPlan = JSON.parse(storedPlan);
  } catch {
    return {
      ...EMPTY_SNAPSHOT,
      error: "Saved revision plan could not be read from browser storage.",
    };
  }

  const result = RevisionPlanSchema.safeParse(parsedPlan);
  return result.success
    ? { ...result.data, error: "" }
    : {
        ...EMPTY_SNAPSHOT,
        error: "Saved revision plan has invalid data in browser storage.",
      };
}

function readPlanForUpdate() {
  const plan = parsePlan(window.localStorage.getItem(STORAGE_KEY));
  if (plan.error) throw new Error(plan.error);
  return plan;
}

function savePlan(plan: Pick<RevisionPlanSnapshot, "examDate" | "tasks">) {
  const validPlan = RevisionPlanSchema.parse(plan);
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(validPlan));
  lastStorageValue = undefined;
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

export function subscribeToRevisionPlan(listener: () => void) {
  if (typeof window === "undefined") return () => {};

  window.addEventListener("storage", listener);
  window.addEventListener(CHANGE_EVENT, listener);

  return () => {
    window.removeEventListener("storage", listener);
    window.removeEventListener(CHANGE_EVENT, listener);
  };
}

export function getRevisionPlanSnapshot(): RevisionPlanSnapshot {
  try {
    const storedPlan = window.localStorage.getItem(STORAGE_KEY);
    if (storedPlan === lastStorageValue) return lastSnapshot;
    lastStorageValue = storedPlan;
    lastSnapshot = parsePlan(storedPlan);
    return lastSnapshot;
  } catch {
    lastStorageValue = undefined;
    lastSnapshot = {
      ...EMPTY_SNAPSHOT,
      error: "Browser storage is unavailable. Revision plan cannot be loaded.",
    };
    return lastSnapshot;
  }
}

export function getServerRevisionPlanSnapshot() {
  return EMPTY_SNAPSHOT;
}

export function setRevisionExamDate(examDate: string) {
  const plan = readPlanForUpdate();
  savePlan({ ...plan, examDate });
}

export function addRevisionTask(task: {
  title: string;
  kitId: string | null;
  dueDate: string;
}) {
  const plan = readPlanForUpdate();
  const newTask = RevisionTaskSchema.parse({
    ...task,
    id: createId(),
    completed: false,
    createdAt: new Date().toISOString(),
  });
  savePlan({ ...plan, tasks: [...plan.tasks, newTask] });
}

export function generateRevisionSchedule(
  examDate: string,
  sessions: Array<{
    title: string;
    kitId: string;
    dueDate: string;
    sessionType: "review" | "flashcards" | "quiz";
  }>,
) {
  const plan = readPlanForUpdate();
  const generatedTasks = sessions.map((session) =>
    RevisionTaskSchema.parse({
      ...session,
      id: createId(),
      completed: false,
      source: "generated",
      createdAt: new Date().toISOString(),
    }),
  );
  const preservedTasks = plan.tasks.filter((task) => task.source !== "generated");
  const tasks = [...preservedTasks, ...generatedTasks];

  if (tasks.length > 500) {
    throw new Error("The generated schedule is too large to save.");
  }

  savePlan({ examDate, tasks });
}

export function setRevisionTaskCompleted(id: string, completed: boolean) {
  const plan = readPlanForUpdate();
  const taskExists = plan.tasks.some((task) => task.id === id);
  if (!taskExists) throw new Error("The revision task could not be found.");

  savePlan({
    ...plan,
    tasks: plan.tasks.map((task) =>
      task.id === id ? { ...task, completed } : task,
    ),
  });
}

export function deleteRevisionTask(id: string) {
  const plan = readPlanForUpdate();
  const tasks = plan.tasks.filter((task) => task.id !== id);
  if (tasks.length === plan.tasks.length) {
    throw new Error("The revision task could not be found.");
  }
  savePlan({ ...plan, tasks });
}
