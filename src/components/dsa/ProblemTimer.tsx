'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Clock } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface ProblemTimerProps {
  onDurationChange?: (seconds: number) => void;
  initialSeconds?: number;
  autoStart?: boolean;
}

export function ProblemTimer({
  onDurationChange,
  initialSeconds = 0,
  autoStart = false,
}: ProblemTimerProps) {
  const [seconds, setSeconds] = useState(initialSeconds);
  const [isRunning, setIsRunning] = useState(autoStart);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const onDurationChangeRef = useRef(onDurationChange);

  useEffect(() => {
    onDurationChangeRef.current = onDurationChange;
  }, [onDurationChange]);

  // Clean timer interval: pure state update only
  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning]);

  // Safely notify parent outside of reducer phase
  useEffect(() => {
    onDurationChangeRef.current?.(seconds);
  }, [seconds]);

  const toggleTimer = () => {
    setIsRunning((prev) => !prev);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setSeconds(0);
  };

  const formatTime = (totalSec: number) => {
    const hrs = Math.floor(totalSec / 3600);
    const mins = Math.floor((totalSec % 3600) / 60);
    const secs = totalSec % 60;

    const pad = (n: number) => n.toString().padStart(2, '0');

    if (hrs > 0) {
      return `${pad(hrs)}:${pad(mins)}:${pad(secs)}`;
    }
    return `${pad(mins)}:${pad(secs)}`;
  };

  return (
    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-border/80 bg-background/80 backdrop-blur font-mono text-xs shadow-sm">
      <Clock className={`h-3.5 w-3.5 ${isRunning ? 'text-primary animate-pulse' : 'text-muted-foreground'}`} />
      <span className="font-semibold text-foreground tracking-wider min-w-[42px] text-center">
        {formatTime(seconds)}
      </span>
      <div className="flex items-center gap-0.5 ml-1 border-l border-border/60 pl-1.5">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-5 w-5 text-muted-foreground hover:text-foreground"
          onClick={toggleTimer}
          title={isRunning ? 'Pause Timer' : 'Start Timer'}
        >
          {isRunning ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3 fill-current" />}
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-5 w-5 text-muted-foreground hover:text-foreground"
          onClick={resetTimer}
          title="Reset Timer"
        >
          <RotateCcw className="h-3 w-3" />
        </Button>
      </div>
    </div>
  );
}
