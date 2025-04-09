"use client";

import type React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useDashboard } from '@/context/dashboard-context';
import { cn } from '@/lib/utils';
import { useSensorDashboard } from '@/hooks/useDashboardSocket';
interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: {
    value: number;
    label: string;
  };
  className?: string;
}

function StatCard({ title, value, icon, trend, className }: StatCardProps) {
  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardContent className="p-6">
        <div className="flex justify-between">
          <div>
            <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">{title}</p>
            <h4 className="text-2xl font-bold mt-1">{value}</h4>
            {trend && (
              <p className={cn(
                "text-xs mt-1",
                trend.value > 0 ? "text-green-500" : "text-red-500"
              )}>
                {trend.value > 0 ? '↑' : '↓'} {Math.abs(trend.value)}% {trend.label}
              </p>
            )}
          </div>
          <div className="h-12 w-12 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-500">
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function DashboardStats() {
  // const { sensors, reliabilityScores } = useDashboard();


  
    const { dashboard, sensors } = useSensorDashboard();
  // Calculate statistics
  const totalSensors = sensors.length;
  const onlineSensors = sensors.filter(s => s.status === 'online').length;
  const offlineSensors = sensors.filter(s => s.status === 'offline').length;
  const warningSensors = sensors.filter(s => s.status === 'warning' || s.status === 'error').length;

  // Calculate average reliability score
  // const avgReliability = reliabilityScores.length > 0
  //   ? reliabilityScores.reduce((sum, item) => sum + item.score, 0) / reliabilityScores.length
  //   : 0;
  
    if (!dashboard) return <p>Loading dashboard data...</p>;


  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        title="Total Sensors"
        value={dashboard.total_sensors}
        icon={<span className="text-xl">📊</span>}
      />
      <StatCard
        title="Online Sensors"
        value={dashboard.online_sensors}
        icon={<span className="text-xl">✅</span>}
        trend={{
          value: totalSensors > 0 ? Math.round((onlineSensors / totalSensors) * 100) : 0,
          label: "of total"
        }}
      />
      <StatCard
        title="Warning/Error"
        value={dashboard.warning_sensors}
        icon={<span className="text-xl">⚠️</span>}
        trend={{
          value: totalSensors > 0 ? Math.round((dashboard.warning_sensors / dashboard.total_sensors) * 100) : 0,
          label: "of total"
        }}
      />
      <StatCard
        title="Avg. Reliability"
        value={`${dashboard.average_reliability.toFixed(1)}%`}
        icon={<span className="text-xl">⭐</span>}
      />
    </div>
  );
}
