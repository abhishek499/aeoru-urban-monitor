import React from 'react';
import { cn } from '@/lib/utils';

interface StatusBadgeProps {
  status: 'online' | 'offline' | 'warning' | 'error';
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const statusStyles = {
    online: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    offline: 'bg-zinc-100 text-zinc-800 dark:bg-zinc-900/30 dark:text-zinc-400',
    warning: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
    error: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
  };

  const dotColors = {
    online: 'bg-green-500',
    offline: 'bg-zinc-500',
    warning: 'bg-yellow-500',
    error: 'bg-red-500',
  };

  return (
    <div
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
        statusStyles[status],
        className
      )}
    >
      <span className={cn('mr-1 h-1.5 w-1.5 rounded-full', dotColors[status])} />
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </div>
  );
}
