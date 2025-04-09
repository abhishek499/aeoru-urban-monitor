"use client";

import type React from 'react';
import { DashboardProvider } from '@/context/dashboard-context';

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardProvider>
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
        <header className="sticky top-0 z-10 w-full border-b border-zinc-200 bg-white/75 backdrop-blur-sm dark:border-zinc-800 dark:bg-zinc-900/75">
          <div className="container flex h-16 items-center justify-between px-4 md:px-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-blue-600 flex items-center justify-center text-white font-bold text-sm">SD</div>
              <h1 className="font-semibold text-lg">Sensor Dashboard</h1>
            </div>
            <nav className="flex items-center gap-4 text-sm">
              <span className="text-zinc-500 dark:text-zinc-400"></span>
              <div className="h-4 w-4 rounded-full " title="System Operational"></div>
            </nav>
          </div>
        </header>
        <main className="container mx-auto p-4 md:p-6">
          {children}
        </main>
      </div>
    </DashboardProvider>
  );
}
