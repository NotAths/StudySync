import React from "react";
import { ArrowRight, BookOpen, Brain, Sparkles, Zap } from "lucide-react";
import { APP_CONFIG } from "@/lib/constants";

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-20 pb-24 md:pt-28 md:pb-32">
      {/* Background radial gradient glow for subtle indigo accents */}
      <div
        className="pointer-events-none absolute inset-x-0 -top-32 mx-auto h-[480px] w-full max-w-4xl rounded-full bg-gradient-to-b from-indigo-600/15 via-indigo-900/5 to-transparent blur-3xl"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center">
          {/* Eyebrow badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/25 bg-indigo-950/40 px-3.5 py-1 text-xs font-medium text-indigo-300 shadow-sm backdrop-blur-sm">
            <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
            <span>AI-Powered Study Assistant</span>
          </div>

          {/* Product Name */}
          <h1 className="mt-8 text-4xl font-extrabold tracking-tight text-white sm:text-6xl md:text-7xl">
            {APP_CONFIG.name}
          </h1>

          {/* Tagline */}
          <p className="mt-4 text-xl font-medium tracking-tight text-indigo-300 sm:text-2xl md:text-3xl">
            {APP_CONFIG.tagline}
          </p>

          {/* Short description */}
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-zinc-400 sm:text-lg">
            {APP_CONFIG.description}
          </p>

          {/* Prominent Get Started button (placeholder) */}
          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row">
            <button
              type="button"
              className="group relative inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-indigo-600/25 transition-all duration-200 hover:bg-indigo-500 hover:shadow-indigo-500/35 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 active:scale-[0.98] cursor-pointer"
              aria-label="Get Started with StudySync"
            >
              <span>Get Started</span>
              <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
            </button>
            <span className="text-xs text-zinc-500">
              Placeholder &bull; Ready for authentication
            </span>
          </div>

          {/* Foundation feature preview cards */}
          <div className="mt-20 grid w-full grid-cols-1 gap-5 text-left sm:grid-cols-3">
            <div className="group rounded-2xl border border-white/[0.07] bg-white/[0.02] p-6 backdrop-blur-sm transition-colors duration-200 hover:border-indigo-500/30 hover:bg-white/[0.04]">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-indigo-500/30 bg-indigo-500/10 text-indigo-400">
                <BookOpen className="h-5 w-5" />
              </div>
              <h2 className="mt-4 text-base font-semibold text-white">
                Intelligent Notes
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-zinc-400">
                Structure and organize your study notes effortlessly with automated synthesis.
              </p>
            </div>

            <div className="group rounded-2xl border border-white/[0.07] bg-white/[0.02] p-6 backdrop-blur-sm transition-colors duration-200 hover:border-indigo-500/30 hover:bg-white/[0.04]">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-indigo-500/30 bg-indigo-500/10 text-indigo-400">
                <Brain className="h-5 w-5" />
              </div>
              <h2 className="mt-4 text-base font-semibold text-white">
                Active Learning
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-zinc-400">
                Turn passive reading into high-retention active recall drills and tailored concepts.
              </p>
            </div>

            <div className="group rounded-2xl border border-white/[0.07] bg-white/[0.02] p-6 backdrop-blur-sm transition-colors duration-200 hover:border-indigo-500/30 hover:bg-white/[0.04]">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-indigo-500/30 bg-indigo-500/10 text-indigo-400">
                <Zap className="h-5 w-5" />
              </div>
              <h2 className="mt-4 text-base font-semibold text-white">
                Synchronized Flow
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-zinc-400">
                Keep your study routine, key concepts, and learning targets in continuous sync.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

