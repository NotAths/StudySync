import {
  Activity,
  BarChart3,
  BrainCircuit,
  Clock3,
  Target,
  TrendingUp,
} from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";

const METRICS = [
  {
    title: "Quiz attempts",
    value: "—",
    detail: "No quiz data yet",
    icon: BrainCircuit,
    tone: "text-[var(--color-primary)]",
    badge: "border-indigo-400/20 bg-indigo-400/5",
  },
  {
    title: "Accuracy",
    value: "—",
    detail: "No results to measure",
    icon: Target,
    tone: "text-emerald-300",
    badge: "border-emerald-400/20 bg-emerald-400/5",
  },
  {
    title: "Study time",
    value: "—",
    detail: "No activity recorded",
    icon: Clock3,
    tone: "text-sky-300",
    badge: "border-sky-400/20 bg-sky-400/5",
  },
];

function EmptyChart({
  icon: Icon,
  title,
  description,
}: {
  icon: typeof TrendingUp;
  title: string;
  description: string;
}) {
  return (
    <div className="flex min-h-56 flex-col items-center justify-center px-5 py-10 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-secondary)] text-[var(--color-primary)]">
        <Icon className="h-5 w-5" />
      </div>
      <h4 className="mt-4 text-sm font-semibold text-white">{title}</h4>
      <p className="mt-1.5 max-w-sm text-xs leading-relaxed text-zinc-400">
        {description}
      </p>
    </div>
  );
}

export default function AnalyticsPage() {
  return (
    <AppLayout title="Analytics">
      <div className="space-y-8 pb-12">
        <section>
          <div className="inline-flex items-center gap-2 rounded-full border border-[var(--color-primary)]/30 bg-[var(--color-primary)]/10 px-3 py-1 text-xs font-medium text-indigo-300">
            <BarChart3 className="h-3.5 w-3.5 text-[var(--color-primary)]" />
            <span>Your learning insights</span>
          </div>
          <h2 className="mt-3 text-2xl font-bold tracking-tight text-white sm:text-3xl">
            Analytics
          </h2>
          <p className="mt-1 max-w-2xl text-sm leading-relaxed text-zinc-400 sm:text-base">
            Track study habits and quiz performance as you learn. Your insights
            will appear here when real study activity is available.
          </p>
        </section>

        <section
          aria-label="Study summary"
          className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3"
        >
          {METRICS.map((metric) => {
            const Icon = metric.icon;
            return (
              <article
                key={metric.title}
                className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 sm:p-6"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium text-zinc-400">
                      {metric.title}
                    </p>
                    <p className="mt-3 text-3xl font-bold tracking-tight text-white">
                      {metric.value}
                    </p>
                  </div>
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-xl border ${metric.badge} ${metric.tone}`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                </div>
                <p className="mt-3 text-xs text-zinc-500">{metric.detail}</p>
              </article>
            );
          })}
        </section>

        <section className="grid gap-6 xl:grid-cols-2">
          <article className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 sm:p-6">
            <div className="flex items-center gap-2.5 border-b border-[var(--color-border)] pb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-secondary)] text-[var(--color-primary)]">
                <TrendingUp className="h-4 w-4" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-white">
                  Quiz performance
                </h3>
                <p className="text-xs text-zinc-400">
                  Accuracy across your quiz attempts
                </p>
              </div>
            </div>
            <EmptyChart
              icon={BarChart3}
              title="Performance data will appear here"
              description="Complete quizzes to see your real results over time. No sample scores are shown."
            />
          </article>

          <article className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 sm:p-6">
            <div className="flex items-center gap-2.5 border-b border-[var(--color-border)] pb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-secondary)] text-sky-300">
                <Activity className="h-4 w-4" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-white">
                  Study activity
                </h3>
                <p className="text-xs text-zinc-400">
                  Time spent studying over time
                </p>
              </div>
            </div>
            <EmptyChart
              icon={Clock3}
              title="Study activity will appear here"
              description="Your study sessions can be visualised once activity tracking is available."
            />
          </article>
        </section>

        <section className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 sm:p-6">
          <div className="flex items-center gap-2.5 border-b border-[var(--color-border)] pb-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-secondary)] text-amber-200">
              <Target className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-white">Weak topics</h3>
              <p className="text-xs text-zinc-400">
                Topics that may need extra review
              </p>
            </div>
          </div>
          <EmptyChart
            icon={BrainCircuit}
            title="Not enough data to identify topics"
            description="After you complete quizzes, topics that could use more practice will be listed here."
          />
        </section>
      </div>
    </AppLayout>
  );
}
