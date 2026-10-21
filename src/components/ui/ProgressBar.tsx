import React from 'react';
import { cn } from '@/lib/utils';

interface ProgressBarProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number;
  max?: number;
  color?: 'primary' | 'success' | 'warning' | 'destructive';
  showLabel?: boolean;
}

export function ProgressBar({
  value,
  max = 100,
  color = 'primary',
  showLabel = false,
  className,
  ...props
}: ProgressBarProps) {
  const percentage = Math.min(Math.max(Math.round((value / max) * 100), 0), 100);

  const colorStyles = {
    primary: 'bg-primary',
    success: 'bg-emerald-500',
    warning: 'bg-amber-500',
    destructive: 'bg-rose-500',
  };

  return (
    <div className={cn('w-full', className)} {...props}>
      {showLabel && (
        <div className="flex justify-between text-xs font-medium text-muted-foreground mb-1">
          <span>Progress</span>
          <span>{percentage}%</span>
        </div>
      )}
      <div className="w-full bg-secondary rounded-full h-2 overflow-hidden">
        <div
          className={cn('h-full transition-all duration-300 rounded-full', colorStyles[color])}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
