'use client';

import React, { useState, useEffect } from 'react';
import { Minimize2, Play, Pause, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface FocusModeShellProps {
  objective: string;
  targetMinutes?: number;
  onExit: () => void;
  children: React.ReactNode;
}

export function FocusModeShell({
  objective,
  targetMinutes = 25,
  onExit,
  children,
}: FocusModeShellProps) {
  const [secondsRemaining, setSecondsRemaining] = useState(targetMinutes * 60);
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isActive && secondsRemaining > 0) {
      interval = setInterval(() => {
        setSecondsRemaining((sec) => sec - 1);
      }, 1000);
    } else if (secondsRemaining === 0) {
      setIsActive(false);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, secondsRemaining]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onExit();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onExit]);

  const mins = Math.floor(secondsRemaining / 60);
  const secs = secondsRemaining % 60;
  const timeDisplay = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  const progressPercent = Math.round(((targetMinutes * 60 - secondsRemaining) / (targetMinutes * 60)) * 100);

  return (
    <div className="fixed inset-0 z-50 bg-background flex flex-col overflow-hidden">
      {/* Minimal Top Bar */}
      <div className="h-14 border-b border-border/80 px-6 flex items-center justify-between bg-card/40">
        <div className="flex items-center gap-3">
          <span className="h-2 w-2 rounded-full bg-rose-500 animate-pulse" />
          <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground">Focus Session</span>
          <span className="text-muted-foreground/40">|</span>
          <span className="text-xs font-medium text-foreground truncate max-w-md">{objective}</span>
        </div>

        {/* Timer Controls */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-muted/60 px-3 py-1 rounded-lg border border-border">
            <span className="font-mono text-sm font-semibold tracking-wider text-foreground">{timeDisplay}</span>
            <button
              onClick={() => setIsActive(!isActive)}
              className="text-muted-foreground hover:text-foreground transition-colors"
              title={isActive ? 'Pause' : 'Resume'}
            >
              {isActive ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
            </button>
            <button
              onClick={() => {
                setIsActive(false);
                setSecondsRemaining(targetMinutes * 60);
              }}
              className="text-muted-foreground hover:text-foreground transition-colors"
              title="Reset Timer"
            >
              <RotateCcw className="h-3 w-3" />
            </button>
          </div>

          <Button variant="ghost" size="sm" onClick={onExit} className="h-8 gap-1 text-xs">
            <Minimize2 className="h-3.5 w-3.5" />
            <span>Exit Focus</span>
            <kbd className="text-[10px] font-mono bg-muted px-1 rounded ml-1">Esc</kbd>
          </Button>
        </div>
      </div>

      {/* Thin Progress Line */}
      <div className="h-0.5 w-full bg-secondary">
        <div
          className="h-full bg-primary transition-all duration-300"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Main Focus Canvas */}
      <div className="flex-1 overflow-y-auto p-6 flex flex-col items-center">
        <div className="w-full max-w-4xl flex-1 flex flex-col">{children}</div>
      </div>
    </div>
  );
}
