"use client";

import React from 'react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { DashboardStats } from '@/components/dashboard/dashboard-stats';
import { SensorList } from '@/components/dashboard/sensor-list';
import { SensorChart } from '@/components/dashboard/sensor-chart';
import { TimeRangeSelector } from '@/components/dashboard/time-range-selector';
import { ReliabilityDashboard } from '@/components/dashboard/reliability-dashboard';
import { DashboardFooter } from '@/components/layout/dashboard-footer';

export function DashboardContent() {
  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="font-bold text-3xl mb-2">Sensor Dashboard</h1>
        <p className="text-zinc-500 dark:text-zinc-400">
          Monitor your sensors in real-time with detailed analytics
        </p>
      </div>

      <div className="mb-6">
        <DashboardStats />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="md:col-span-1">
          <SensorList className="h-full" />
        </div>
        <div className="md:col-span-2 space-y-6">
          <TimeRangeSelector />
          <SensorChart />
        </div>
      </div>

      <div className="mb-6">
        <ReliabilityDashboard />
      </div>

      <DashboardFooter />
    </DashboardLayout>
  );
}
