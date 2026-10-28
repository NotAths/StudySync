"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  BrainCircuit,
  Layers,
  BookmarkCheck,
  BarChart3,
  CalendarClock,
  Settings,
  Sparkles,
  X,
} from "lucide-react";
import { APP_CONFIG } from "@/lib/constants";
import type { NavItem } from "@/types";

const NAV_ITEMS: NavItem[] = [
  {
    label: "Dashboard",
    href: "/",
    icon: LayoutDashboard,
  },
  {
    label: "My Notes",
    href: "/notes",
    icon: FileText,
  },
  {
    label: "AI Quiz",
    href: "/quiz",
    icon: BrainCircuit,
  },
  {
    label: "Flashcards",
    href: "/flashcards",
    icon: Layers,
  },
  {
    label: "Saved Study Kits",
    href: "/study-kits",
    icon: BookmarkCheck,
  },
  {
    label: "Analytics",
    href: "/analytics",
    icon: BarChart3,
  },
  {
    label: "Revision Plan",
    href: "/revision",
    icon: CalendarClock,
  },
  {
    label: "Settings",
    href: "/settings",
    icon: Settings,
  },
];

interface SidebarProps {
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}

export function Sidebar({ mobileOpen = false, onMobileClose }: SidebarProps) {
  const pathname = usePathname();
  const drawerRef = useRef<HTMLElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!mobileOpen || !onMobileClose) return;

    closeButtonRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onMobileClose();
        return;
      }

      if (event.key !== "Tab") return;

      const focusableElements = drawerRef.current?.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );
      if (!focusableElements?.length) return;

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];
      const focusIsOutsideDrawer = !drawerRef.current?.contains(
        document.activeElement,
      );

      if (focusIsOutsideDrawer) {
        event.preventDefault();
        (event.shiftKey ? lastElement : firstElement).focus();
      } else if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [mobileOpen, onMobileClose]);

  const content = (
    <div className="flex h-full flex-col justify-between bg-[var(--color-surface-secondary)] border-r border-[var(--color-border)] text-slate-300">
      {/* Brand Header */}
      <div>
        <div className="flex h-16 items-center justify-between px-6 border-b border-[var(--color-border)]/80">
          <Link
            href="/"
            onClick={onMobileClose}
            className="flex items-center gap-2.5 group"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--color-primary)]/15 border border-[var(--color-primary)]/30 text-[var(--color-primary)] shadow-sm shadow-[var(--color-primary)]/10 transition-colors group-hover:bg-[var(--color-primary)]/25">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <span className="text-base font-bold tracking-tight text-white block leading-none">
                {APP_CONFIG.name}
              </span>
              <span className="text-[10px] text-zinc-400 font-medium tracking-wider uppercase block mt-1">
                AI Study Assistant
              </span>
            </div>
          </Link>

          {/* Close button for mobile drawer */}
          {onMobileClose && (
            <button
              type="button"
              ref={closeButtonRef}
              onClick={onMobileClose}
              className="md:hidden rounded-lg p-1.5 text-zinc-400 hover:bg-[var(--color-surface)] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-surface-secondary)]"
              aria-label="Close sidebar"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>

        {/* Navigation Section */}
        <div className="px-3 py-4">
          <div className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
            Navigation
          </div>
          <nav aria-label="Main navigation" className="space-y-1">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => {
                    if (onMobileClose) onMobileClose();
                  }}
                  aria-current={isActive ? "page" : undefined}
                  className={`group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-surface-secondary)] ${
                    isActive
                      ? "bg-[var(--color-accent-light)] text-[var(--color-primary-hover)] shadow-none font-semibold"
                      : "text-zinc-400 hover:bg-[var(--color-surface)] hover:text-slate-100"
                  }`}
                >
                  <Icon
                    className={`h-4.5 w-4.5 shrink-0 transition-colors ${
                      isActive
                        ? "text-[var(--color-primary)]"
                        : "text-zinc-400 group-hover:text-slate-200"
                    }`}
                  />
                  <span className="truncate">{item.label}</span>
                  {isActive && (
                    <span className="ml-auto h-1.5 w-1.5 rounded-full bg-[var(--color-primary)]" />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Sidebar Footer / Study Mode Indicator */}
      <div className="p-4 border-t border-[var(--color-border)]/80">
        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-3.5">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-semibold text-slate-200">Study Workspace</span>
          </div>
          <p className="mt-1 text-[11px] text-zinc-400 leading-relaxed">
            Your study tools in one place.
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop fixed/sticky sidebar */}
      <aside className="hidden md:flex md:w-64 md:shrink-0 md:flex-col md:fixed md:inset-y-0 z-30">
        {content}
      </aside>

      {/* Mobile drawer with backdrop */}
      <div
        className={`fixed inset-0 z-50 md:hidden ${
          mobileOpen ? "pointer-events-auto" : "pointer-events-none"
        }`}
        aria-hidden={!mobileOpen}
      >
        <button
          type="button"
          className={`fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity duration-300 ${
            mobileOpen ? "opacity-100" : "opacity-0"
          }`}
          onClick={onMobileClose}
          aria-label="Close navigation menu"
          tabIndex={mobileOpen ? 0 : -1}
        />
        <aside
          ref={drawerRef}
          id="mobile-navigation"
          role="dialog"
          aria-label="Navigation menu"
          aria-modal={mobileOpen}
          inert={!mobileOpen}
          className={`fixed inset-y-0 left-0 w-72 max-w-[85vw] shadow-2xl transition-transform duration-300 ${
            mobileOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          {content}
        </aside>
      </div>
    </>
  );
}
