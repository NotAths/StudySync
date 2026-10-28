"use client";

import React from "react";
import { Search, Bell, Menu, User, X } from "lucide-react";

interface HeaderProps {
  onMobileMenuToggle?: () => void;
  mobileMenuOpen?: boolean;
  mobileMenuButtonRef?: React.RefObject<HTMLButtonElement | null>;
  title?: string;
}

export function Header({
  onMobileMenuToggle,
  mobileMenuOpen = false,
  mobileMenuButtonRef,
  title = "Dashboard",
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-20 flex h-16 w-full items-center justify-between border-b border-[var(--color-border)] bg-[var(--color-bg)]/85 px-4 backdrop-blur-md sm:px-6 lg:px-8">
      {/* Left side: Mobile Toggle & Page Title */}
      <div className="flex items-center gap-3">
        <button
          ref={mobileMenuButtonRef}
          type="button"
          onClick={onMobileMenuToggle}
          className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-2 text-zinc-400 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg)] md:hidden"
          aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-controls="mobile-navigation"
          aria-expanded={mobileMenuOpen}
        >
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>

        <div>
          <h1 className="text-lg font-bold tracking-tight text-white sm:text-xl">
            {title}
          </h1>
        </div>
      </div>

      {/* Center / Right side: Search, Notifications, Avatar */}
      <div className="flex items-center gap-3 sm:gap-4">
        {/* Search input */}
        <div className="relative hidden sm:block w-64 md:w-72 lg:w-80">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            aria-label="Search (not available yet)"
            placeholder="Search will be available soon"
            title="Search will be available when study data is connected"
            disabled
            className="h-9 w-full cursor-not-allowed rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] pl-9 pr-3 text-xs text-slate-100 placeholder-zinc-500 disabled:opacity-70"
          />
        </div>

        {/* Search button on small mobile */}
        <button
          type="button"
          disabled
          title="Search will be available when study data is connected"
          className="flex h-9 w-9 cursor-not-allowed items-center justify-center rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] text-zinc-500 disabled:opacity-70 sm:hidden"
          aria-label="Search (not available yet)"
        >
          <Search className="h-4 w-4" />
        </button>

        {/* Notifications */}
        <button
          type="button"
          disabled
          title="Notifications are not available yet"
          className="relative flex h-9 w-9 cursor-not-allowed items-center justify-center rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] text-zinc-500 disabled:opacity-70"
          aria-label="Notifications (not available yet)"
        >
          <Bell className="h-4 w-4" />
        </button>

        {/* Profile Avatar */}
        <div className="flex items-center gap-2 pl-1 border-l border-[var(--color-border)]">
          <button
            type="button"
            disabled
            title="Profile settings are not available yet"
            className="flex h-9 w-9 cursor-not-allowed items-center justify-center rounded-full border border-[var(--color-primary)]/40 bg-[var(--color-surface)] text-indigo-300 font-semibold text-xs shadow-sm shadow-[var(--color-primary)]/20 disabled:opacity-70"
            aria-label="User profile (not available yet)"
          >
            <User className="h-4 w-4 text-[var(--color-primary)]" />
          </button>
        </div>
      </div>
    </header>
  );
}
