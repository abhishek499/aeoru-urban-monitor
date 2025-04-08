"use client";

import React from 'react';
import { useDashboard } from '@/context/dashboard-context';

export function DashboardFooter() {
  const { refreshData, loading } = useDashboard();

  return (
    <footer className="border-t border-zinc-200 dark:border-zinc-800 py-4 px-4 md:px-6">
      <div className="container mx-auto flex justify-between items-center text-sm">
        <div className="text-zinc-500 dark:text-zinc-400">
          © 2025 Sensor Dashboard
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={refreshData}
            disabled={loading}
            className="text-blue-500 hover:text-blue-600 dark:hover:text-blue-400 disabled:opacity-50"
          >
            {loading ? 'Refreshing...' : 'Refresh Data'}
          </button>
          <span className="text-zinc-500 dark:text-zinc-400">
            Data updates every 3s
          </span>
        </div>
      </div>
    </footer>
  );
}
