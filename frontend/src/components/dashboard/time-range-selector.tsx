"use client";

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useDashboard } from '@/context/dashboard-context';
import { cn } from '@/lib/utils';
import type { TimeRange } from '@/lib/types';

interface TimeRangeSelectorProps {
  className?: string;
}

export function TimeRangeSelector({ className }: TimeRangeSelectorProps) {
  const { selectedTimeRange, selectTimeRange } = useDashboard();

  const timeRanges: { value: TimeRange; label: string }[] = [
    { value: '1h', label: '1 Hour' },
    { value: '24h', label: '24 Hours' },
    { value: '7d', label: '7 Days' },
    { value: '30d', label: '30 Days' },
    { value: 'all', label: 'All' },
  ];

  return (
    <Card className={className}>
      <CardContent className="p-3">
        <div className="flex gap-2 overflow-x-auto">
          {timeRanges.map(range => (
            <button
              key={range.value}
              onClick={() => selectTimeRange(range.value)}
              className={cn(
                "px-3 py-1.5 text-sm rounded-md transition-colors whitespace-nowrap",
                selectedTimeRange === range.value
                  ? "bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-400"
                  : "text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
              )}
            >
              {range.label}
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
