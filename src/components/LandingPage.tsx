"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  BrainCircuit,
  CalendarDays,
  Check,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Layers,
  Menu,
  NotebookPen,
  Sparkles,
  X,
} from "lucide-react";
import { APP_CONFIG } from "@/lib/constants";

const NAV_LINKS = [
  { label: "Features", href: "#features" },
  { label: "How it works", href: "#workflow" },
  { label: "About", href: "#about" },
];

const FEATURES = [
  {
    eyebrow: "01 / Collect",
    title: "A home for everything you’re learning.",
    description:
      "Start with a subject, draft your notes, or choose a PDF. Keep the material you need for your next session close at hand.",
    label: "Notes, gathered in one place",
    action: "Bring in your notes",
    href: "/notes",
    icon: NotebookPen,
    style: "notes",
  },
  {
    eyebrow: "02 / Practice",
    title: "Turn a quick review into active recall.",
    description:
      "Flip through a focused flashcard preview and explore a study flow built around remembering, not just rereading.",
    label: "One idea at a time",
    action: "Explore flashcards",
    href: "/flashcards",
    icon: Layers,
    style: "cards",
  },
  {
    eyebrow: "03 / Plan",
    title: "Keep the next milestone in sight.",
    description:
      "Set an exam date and give your week a little shape. Your revision space keeps the plan clear and easy to revisit.",
    label: "Make a plan that feels doable",
    action: "Plan your revision",
    href: "/revision",
    icon: CalendarDays,
    style: "plan",
  },
];

const STEPS = [
  {
    number: "01",
    title: "Gather your material",
    description: "Bring notes and PDFs into a single study workspace.",
    icon: BookOpen,
  },
  {
    number: "02",
    title: "Choose your focus",
    description: "Move between notes, flashcards, quizzes, and revision.",
    icon: BrainCircuit,
  },
  {
    number: "03",
    title: "Build a steady rhythm",
    description: "Keep your next session and exam goals in view.",
    icon: CalendarDays,
  },
];

function LandingNavbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  function closeMenu() {
    setMenuOpen(false);
  }

  return (
    <header className="landing-nav">
      <Link aria-label={`${APP_CONFIG.name} home`} className="landing-brand" href="/" onClick={closeMenu}>
        <span className="landing-brand-mark"><Sparkles aria-hidden="true" /></span>
        <span>{APP_CONFIG.name}</span>
      </Link>

      <nav aria-label="Main navigation" className={`landing-nav-links${menuOpen ? " is-open" : ""}`}>
        {NAV_LINKS.map((item) => (
          <a href={item.href} key={item.label} onClick={closeMenu}>
            {item.label}
          </a>
        ))}
        <Link className="landing-nav-cta" href="/dashboard" onClick={closeMenu}>
          Enter workspace
          <ArrowUpRight aria-hidden="true" />
        </Link>
      </nav>

      <button
        aria-expanded={menuOpen}
        aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
        className="landing-menu-toggle"
        onClick={() => setMenuOpen((open) => !open)}
        type="button"
      >
        {menuOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
      </button>
    </header>
  );
}

function LandingHero() {
  return (
    <section aria-labelledby="landing-title" className="landing-hero">
      <div aria-hidden="true" className="landing-hero-orb landing-hero-orb-one" />
      <div aria-hidden="true" className="landing-hero-orb landing-hero-orb-two" />
      <div aria-hidden="true" className="landing-hero-grid" />
      <div className="landing-hero-content">
        <p className="landing-eyebrow">
          <Sparkles aria-hidden="true" />
          <span>Your all-in-one study workspace</span>
        </p>
        <h1 id="landing-title">Make study time<br /><em>count.</em></h1>
        <p className="landing-tagline">{APP_CONFIG.name}, in sync with you.</p>
        <p className="landing-intro">
          Turn your notes into study kits, practice with AI quizzes and
          flashcards, and keep your next exam plan in view.
        </p>
        <div className="landing-hero-actions">
          <Link className="landing-primary-link" href="/dashboard">
            Start studying
            <ArrowRight aria-hidden="true" />
          </Link>
          <a className="landing-secondary-link" href="#features">See what you can do</a>
        </div>
        <div className="landing-hero-proof" aria-label="StudySync features">
          <span><Check aria-hidden="true" />Study kits</span>
          <span><Check aria-hidden="true" />Active recall</span>
          <span><Check aria-hidden="true" />Exam planning</span>
        </div>
      </div>
      <div className="landing-hero-preview" aria-label="Preview of the StudySync workspace">
        <div className="landing-preview-window">
          <div className="landing-preview-bar">
            <span className="landing-preview-brand"><span><Sparkles aria-hidden="true" /></span>StudySync</span>
            <span className="landing-preview-avatar">S</span>
          </div>
          <div className="landing-preview-body">
            <p className="landing-preview-overline">YOUR STUDY SPACE</p>
            <h2>Ready for a focused session?</h2>
            <p className="landing-preview-subtitle">Everything you need, right where you left it.</p>
            <div className="landing-preview-stats">
              <div><span>Study kits</span><strong><BookOpen aria-hidden="true" />Notes & ideas</strong></div>
              <div><span>Practice</span><strong><BrainCircuit aria-hidden="true" />Quiz yourself</strong></div>
            </div>
            <div className="landing-preview-plan">
              <div className="landing-preview-plan-heading">
                <span><CalendarDays aria-hidden="true" />Next up</span>
                <span>YOUR PLAN</span>
              </div>
              <div className="landing-preview-task">
                <span className="landing-preview-task-icon"><Layers aria-hidden="true" /></span>
                <span><strong>Review your flashcards</strong><small><Clock3 aria-hidden="true" />A quick recall session</small></span>
                <ArrowUpRight aria-hidden="true" />
              </div>
              <div className="landing-preview-progress"><span /></div>
              <p className="landing-preview-progress-label">Small steps. Steady progress.</p>
            </div>
          </div>
        </div>
        <div className="landing-preview-float landing-preview-float-top"><span><Sparkles aria-hidden="true" /></span>Notes to study kit</div>
        <div className="landing-preview-float landing-preview-float-bottom"><span>✓</span>One focused session at a time</div>
      </div>
      <div className="landing-hero-caption">
        <span>Less setup. More learning.</span>
        <span aria-hidden="true" className="landing-caption-rule" />
        <a href="#features">Scroll to explore <ArrowDown aria-hidden="true" /></a>
      </div>
    </section>
  );
}

function FeatureArtwork({ style, label, icon: Icon }: {
  style: string;
  label: string;
  icon: typeof NotebookPen;
}) {
  return (
    <div aria-hidden="true" className="landing-feature-art">
      <div className="landing-feature-art-topline">
        <span><Icon /></span>
        <span>{label}</span>
        <span className="landing-art-menu">•••</span>
      </div>
      {style === "notes" && (
        <div className="landing-note-preview">
          <span className="landing-art-overline">BIOLOGY / WEEK 04</span>
          <strong>Cellular respiration</strong>
          <span className="landing-note-highlight">How cells turn glucose into usable energy</span>
          <i /><i /><i className="short" />
          <span className="landing-art-tag">Lecture notes · Draft</span>
        </div>
      )}
      {style === "cards" && (
        <div className="landing-cards-preview">
          <div className="landing-mini-card landing-mini-card-back"><span>RECALL</span></div>
          <div className="landing-mini-card landing-mini-card-front">
            <span>QUICK CHECK · 01</span>
            <strong>What helps a plant turn light into stored energy?</strong>
            <small>Think it through, then flip.</small>
          </div>
        </div>
      )}
      {style === "plan" && (
        <div className="landing-week-preview">
          <span className="landing-art-overline">YOUR WEEK AT A GLANCE</span>
          <strong>Small steps add up.</strong>
          <div className="landing-week-days">
            {["M", "T", "W", "T", "F", "S", "S"].map((day, index) => (
              <span className={index === 2 || index === 5 ? "is-marked" : ""} key={`${day}-${index}`}>
                <i>{day}</i><b>{index + 12}</b>
              </span>
            ))}
          </div>
          <span className="landing-exam-note"><Sparkles /> Next milestone, in view</span>
        </div>
      )}
    </div>
  );
}

function FeatureCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeFeature = FEATURES[activeIndex];
  const FeatureIcon = activeFeature.icon;

  function moveSlide(direction: number) {
    setActiveIndex((index) => (index + direction + FEATURES.length) % FEATURES.length);
  }

  return (
    <section aria-labelledby="features-title" className="landing-feature-section" id="features">
      <div className="landing-section-heading">
        <div>
          <p className="landing-section-kicker">A little more in sync</p>
          <h2 id="features-title">A study space that moves with you.</h2>
        </div>
        <div aria-label="Feature carousel controls" className="landing-carousel-controls">
          <button aria-label="Previous feature" onClick={() => moveSlide(-1)} type="button">
            <ChevronLeft aria-hidden="true" />
          </button>
          <span aria-live="polite">0{activeIndex + 1}<span> / 0{FEATURES.length}</span></span>
          <button aria-label="Next feature" onClick={() => moveSlide(1)} type="button">
            <ChevronRight aria-hidden="true" />
          </button>
        </div>
      </div>

      <article
        aria-label={`${activeFeature.eyebrow}: ${activeFeature.title}`}
        aria-roledescription="slide"
        className={`landing-feature-slide landing-feature-${activeFeature.style}`}
        key={activeFeature.style}
      >
        <div className="landing-feature-copy">
          <p className="landing-feature-eyebrow">{activeFeature.eyebrow}</p>
          <h3>{activeFeature.title}</h3>
          <p className="landing-feature-description">{activeFeature.description}</p>
          <Link className="landing-feature-link" href={activeFeature.href}>
            {activeFeature.action}<ArrowRight aria-hidden="true" />
          </Link>
        </div>
        <FeatureArtwork
          icon={FeatureIcon}
          label={activeFeature.label}
          style={activeFeature.style}
        />
      </article>

      <div aria-label="Choose a feature" className="landing-carousel-dots">
        {FEATURES.map((feature, index) => (
          <button
            aria-current={index === activeIndex ? "true" : undefined}
            aria-label={`Show feature ${index + 1}: ${feature.action}`}
            key={feature.style}
            onClick={() => setActiveIndex(index)}
            type="button"
          />
        ))}
      </div>
    </section>
  );
}

function Workflow() {
  return (
    <section aria-labelledby="workflow-title" className="landing-workflow" id="workflow">
      <div className="landing-workflow-intro" id="about">
        <p className="landing-section-kicker">Simple by design</p>
        <h2 id="workflow-title">Less juggling.<br /><em>More understanding.</em></h2>
        <p>
          StudySync brings your everyday study tools into one calm place, so you
          can spend less time getting set up and more time getting into it.
        </p>
        <Link className="landing-feature-link" href="/dashboard">
          Take a look around <ArrowRight aria-hidden="true" />
        </Link>
      </div>
      <div className="landing-steps">
        {STEPS.map((step) => {
          const Icon = step.icon;
          return (
            <article className="landing-step" key={step.number}>
              <div className="landing-step-topline"><span>{step.number}</span><Icon aria-hidden="true" /></div>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </article>
          );
        })}
      </div>
    </section>
  );
}

function LandingFooter() {
  return (
    <footer className="landing-footer">
      <div className="landing-footer-main">
        <div className="landing-footer-brand-block">
          <Link className="landing-brand landing-footer-brand" href="/">
            <span className="landing-brand-mark"><Sparkles aria-hidden="true" /></span>
            <span>{APP_CONFIG.name}</span>
          </Link>
          <p>{APP_CONFIG.tagline}</p>
        </div>
        <div className="landing-footer-links">
          <div>
            <p className="landing-footer-label">Explore</p>
            <a href="#features">Features</a>
            <a href="#workflow">How it works</a>
          </div>
          <div>
            <p className="landing-footer-label">Your workspace</p>
            <Link href="/dashboard">Dashboard <ArrowUpRight aria-hidden="true" /></Link>
            <Link href="/notes">My notes</Link>
          </div>
        </div>
      </div>
      <div className="landing-footer-bottom">
        <span>© {APP_CONFIG.name}</span>
        <span>Made for your next good study session.</span>
      </div>
    </footer>
  );
}

export function LandingPage() {
  return (
    <div className="landing-page">
      <LandingNavbar />
      <main>
        <LandingHero />
        <FeatureCarousel />
        <Workflow />
        <section aria-labelledby="landing-cta-title" className="landing-last-call">
          <div>
            <p className="landing-section-kicker">Your next session starts here</p>
            <h2 id="landing-cta-title">Make space to learn.</h2>
          </div>
          <Link className="landing-primary-link" href="/dashboard">
            Step into StudySync <ArrowRight aria-hidden="true" />
          </Link>
        </section>
      </main>
      <LandingFooter />
    </div>
  );
}