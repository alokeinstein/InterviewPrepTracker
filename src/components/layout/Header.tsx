'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Flame,
  Clock,
  Sparkles,
  Command,
  Maximize2,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { KeyboardShortcutsModal } from './KeyboardShortcutsModal';

interface HeaderProps {
  onToggleFocus?: () => void;
}

export function Header({ onToggleFocus }: HeaderProps) {
  const [showShortcuts, setShowShortcuts] = useState(false);

  return (
    <>
      <header className="h-16 border-b border-border bg-card/40 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="font-mono text-[11px] gap-1 px-2">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            TARGET: GOOGLE / MSFT L5-L6
          </Badge>
          <span className="text-xs text-muted-foreground hidden sm:inline">
            Personal Engineering Training OS
          </span>
        </div>

        <div className="flex items-center gap-3">
          {/* 10 Minute Emergency Mode Button */}
          <Link href="/revision?mode=quick10">
            <Button variant="outline" size="sm" className="h-8 gap-1.5 text-xs border-amber-500/30 text-amber-600 dark:text-amber-400 hover:bg-amber-500/10">
              <Clock className="h-3.5 w-3.5" />
              <span>10-Min Emergency Drill</span>
            </Button>
          </Link>

          {/* Focus Mode Trigger */}
          {onToggleFocus && (
            <Button
              variant="outline"
              size="sm"
              onClick={onToggleFocus}
              className="h-8 gap-1.5 text-xs hidden md:flex"
            >
              <Maximize2 className="h-3.5 w-3.5" />
              <span>Focus Mode</span>
              <kbd className="text-[10px] font-mono bg-muted px-1 rounded">F</kbd>
            </Button>
          )}

          {/* Shortcuts Modal Trigger */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowShortcuts(true)}
            className="h-8 w-8 text-muted-foreground hover:text-foreground"
            title="Keyboard Shortcuts"
          >
            <Command className="h-4 w-4" />
          </Button>

          {/* User Profile Pill */}
          <div className="flex items-center gap-2 pl-2 border-l border-border">
            <div className="h-7 w-7 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-xs">
              A
            </div>
            <div className="hidden lg:block text-left">
              <p className="text-xs font-semibold leading-none">Alok</p>
              <p className="text-[10px] text-muted-foreground">Ready: 65.5%</p>
            </div>
          </div>
        </div>
      </header>

      <KeyboardShortcutsModal
        isOpen={showShortcuts}
        onClose={() => setShowShortcuts(false)}
      />
    </>
  );
}
