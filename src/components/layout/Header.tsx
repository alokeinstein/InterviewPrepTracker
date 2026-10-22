'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Flame,
  Clock,
  Sparkles,
  Command,
  Maximize2,
  LogIn,
  User as UserIcon,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { KeyboardShortcutsModal } from './KeyboardShortcutsModal';
import { AuthModal } from '@/components/auth/AuthModal';
import { ProfileModal } from '@/components/auth/ProfileModal';

interface HeaderProps {
  onToggleFocus?: () => void;
}

export function Header({ onToggleFocus }: HeaderProps) {
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchCurrentUser = async () => {
    try {
      const res = await fetch('/api/auth/me');
      const data = await res.json();
      if (data.authenticated && data.user) {
        setCurrentUser(data.user);
      } else {
        setCurrentUser(null);
      }
    } catch {
      setCurrentUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  const displayName = currentUser?.profile?.displayName || currentUser?.name || currentUser?.username || 'Alok';
  const displayUsername = currentUser?.username ? `@${currentUser.username}` : (currentUser?.email ? currentUser.email.split('@')[0] : 'Guest');
  const avatarLetter = (displayName[0] || 'U').toUpperCase();

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
          {/* Streak indicator if user has active streak */}
          {currentUser?.streak > 0 && (
            <div className="hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-md bg-amber-500/10 border border-amber-500/20 text-amber-500 text-xs font-mono font-bold">
              <Flame className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
              <span>{currentUser.streak}d streak</span>
            </div>
          )}

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

          {/* User Profile / Auth Trigger Pill */}
          {currentUser ? (
            <button
              onClick={() => setShowProfileModal(true)}
              className="flex items-center gap-2 pl-2 border-l border-border hover:opacity-80 transition-opacity text-left"
              title="Click to view profile & settings"
            >
              <div className="h-7 w-7 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-xs ring-1 ring-primary/40">
                {avatarLetter}
              </div>
              <div className="hidden lg:block text-left">
                <p className="text-xs font-semibold leading-none">{displayName}</p>
                <p className="text-[10px] text-muted-foreground">{displayUsername}</p>
              </div>
            </button>
          ) : (
            <Button
              variant="default"
              size="sm"
              onClick={() => setShowAuthModal(true)}
              className="h-8 gap-1.5 text-xs font-medium"
            >
              <LogIn className="h-3.5 w-3.5" />
              <span>Sign In</span>
            </Button>
          )}
        </div>
      </header>

      <KeyboardShortcutsModal
        isOpen={showShortcuts}
        onClose={() => setShowShortcuts(false)}
      />

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onAuthSuccess={(user) => {
          setCurrentUser(user);
          setShowAuthModal(false);
        }}
      />

      {currentUser && (
        <ProfileModal
          isOpen={showProfileModal}
          onClose={() => setShowProfileModal(false)}
          currentUser={currentUser}
          onProfileUpdated={(updated) => setCurrentUser(updated)}
          onLogout={() => setCurrentUser(null)}
        />
      )}
    </>
  );
}
