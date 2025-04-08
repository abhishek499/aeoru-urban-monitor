import React from 'react';
import { cn } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';

interface ReliabilityScoreProps {
  score: number;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function ReliabilityScore({
  score,
  showLabel = true,
  size = 'md',
  className
}: ReliabilityScoreProps) {
  // Determine color based on score
  const getColor = () => {
    if (score >= 90) return 'bg-green-500';
    if (score >= 70) return 'bg-emerald-500';
    if (score >= 50) return 'bg-yellow-500';
    if (score >= 30) return 'bg-orange-500';
    return 'bg-red-500';
  };

  // Determine size classes
  const getSizeClasses = () => {
    switch (size) {
      case 'sm': return 'text-xs';
      case 'lg': return 'text-base';
      default: return 'text-sm';
    }
  };

  return (
    <div className={cn('flex flex-col gap-1', className)}>
      {showLabel && (
        <div className="flex justify-between items-center">
          <span className={cn('text-zinc-500 dark:text-zinc-400', getSizeClasses())}>
            Reliability Score
          </span>
          <span className={cn('font-medium', getSizeClasses())}>
            {score.toFixed(1)}%
          </span>
        </div>
      )}
      <Progress
        value={score}
        className={cn('h-2 w-full', size === 'sm' ? 'h-1' : size === 'lg' ? 'h-3' : 'h-2')}
        indicatorClassName={getColor()}
      />
    </div>
  );
}
