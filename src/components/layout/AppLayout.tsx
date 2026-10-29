"use client";

import React, { useEffect, useRef, useState } from "react";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";

interface AppLayoutProps {
  children: React.ReactNode;
  title?: string;
}

export function AppLayout({ children, title = "Dashboard" }: AppLayoutProps) {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const drawerWasOpen = useRef(false);

  useEffect(() => {
    if (mobileSidebarOpen) {
      drawerWasOpen.current = true;
    } else if (drawerWasOpen.current) {
      menuButtonRef.current?.focus();
      drawerWasOpen.current = false;
    }
  }, [mobileSidebarOpen]);

  return (
    <div className="app-shell min-h-screen overflow-x-clip bg-[var(--color-bg)] text-slate-100 flex flex-col md:flex-row">
      {/* Sidebar (fixed on desktop, slide-over drawer on mobile) */}
      <Sidebar
        mobileOpen={mobileSidebarOpen}
        onMobileClose={() => setMobileSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex min-w-0 flex-1 flex-col md:pl-64">
        <Header
          title={title}
          mobileMenuOpen={mobileSidebarOpen}
          mobileMenuButtonRef={menuButtonRef}
          onMobileMenuToggle={() => setMobileSidebarOpen((open) => !open)}
        />
        <main className="app-main flex-1 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
          <div className="app-content mx-auto w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
