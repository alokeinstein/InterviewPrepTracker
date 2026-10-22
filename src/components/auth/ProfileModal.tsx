'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { localStore } from '@/lib/storage/indexedDb';
import {
  User,
  Globe,
  CheckCircle2,
  AlertCircle,
  X,
  RefreshCw,
  LogOut,
  Shield,
} from 'lucide-react';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser?: any;
  onProfileUpdated?: (updated: any) => void;
  onLogout?: () => void;
}

export function ProfileModal({
  isOpen,
  onClose,
  currentUser,
  onProfileUpdated,
  onLogout,
}: ProfileModalProps) {
  const [username, setUsername] = useState(currentUser?.username || '');
  const [displayName, setDisplayName] = useState(currentUser?.name || '');
  const [bio, setBio] = useState(currentUser?.profile?.bio || '');
  const [timezone, setTimezone] = useState(currentUser?.timezone || 'UTC');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Username validation state
  const [usernameChecking, setUsernameChecking] = useState(false);
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null);
  const [usernameError, setUsernameError] = useState<string | null>(null);

  useEffect(() => {
    if (currentUser) {
      setUsername(currentUser.username || '');
      setDisplayName(currentUser.name || '');
      setBio(currentUser.profile?.bio || '');
      setTimezone(currentUser.timezone || 'UTC');
    }
  }, [currentUser]);

  // Username live availability check
  useEffect(() => {
    if (!username.trim() || username.trim() === currentUser?.username) {
      setUsernameAvailable(true);
      setUsernameError(null);
      return;
    }

    if (!/^[a-zA-Z0-9_-]{3,30}$/.test(username)) {
      setUsernameAvailable(false);
      setUsernameError('3-30 letters, numbers, hyphens or underscores');
      return;
    }

    const timer = setTimeout(async () => {
      setUsernameChecking(true);
      try {
        const res = await fetch(`/api/auth/check-username?username=${encodeURIComponent(username.trim())}`);
        const data = await res.json();
        if (data.available) {
          setUsernameAvailable(true);
          setUsernameError(null);
        } else {
          setUsernameAvailable(false);
          setUsernameError(data.reason || 'Username is already taken');
        }
      } catch {
        setUsernameAvailable(null);
      } finally {
        setUsernameChecking(false);
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [username, currentUser?.username]);

  if (!isOpen) return null;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (usernameAvailable === false) {
      setError('Please choose an available username.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/auth/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: username.trim(),
          displayName: displayName.trim(),
          bio: bio.trim(),
          timezone: timezone.trim(),
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to update profile');
      }

      setSuccess(true);
      onProfileUpdated?.(data.user);
      setTimeout(() => {
        setSuccess(false);
        onClose();
        window.location.reload();
      }, 700);
    } catch (err: any) {
      setError(err.message || 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  const handleLogoutClick = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch {}
    try {
      await localStore.clearAuthenticatedData();
    } catch {}
    onLogout?.();
    onClose();
    window.location.reload();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md rounded-2xl border border-border/80 bg-card p-6 shadow-2xl space-y-5">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Modal Header */}
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-[10px] font-mono tracking-wider">
              USER PROFILE &amp; SETTINGS
            </Badge>
          </div>
          <h2 className="text-xl font-bold tracking-tight text-foreground">
            Account Preferences
          </h2>
          <p className="text-xs text-muted-foreground">
            {currentUser?.email ? `Signed in as ${currentUser.email}` : 'Manage your developer profile'}
          </p>
        </div>

        {error && (
          <div className="p-3 rounded-lg border border-destructive/40 bg-destructive/10 text-xs text-destructive flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="p-3 rounded-lg border border-emerald-500/40 bg-emerald-500/10 text-xs text-emerald-400 flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            <span>Profile saved successfully!</span>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
              <User className="h-3.5 w-3.5 text-muted-foreground" />
              <span>Username</span>
            </label>
            <div className="relative">
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-3.5 py-1.5 rounded-lg bg-muted/50 border border-border text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary pr-20"
              />
              <div className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] font-medium">
                {usernameChecking && <RefreshCw className="h-3 w-3 animate-spin text-muted-foreground" />}
                {!usernameChecking && usernameAvailable === true && username !== currentUser?.username && (
                  <span className="text-emerald-400 flex items-center gap-0.5">
                    <CheckCircle2 className="h-3 w-3" /> Available
                  </span>
                )}
                {!usernameChecking && usernameAvailable === false && (
                  <span className="text-rose-400 flex items-center gap-0.5">
                    <AlertCircle className="h-3 w-3" /> Taken
                  </span>
                )}
              </div>
            </div>
            {usernameError && <p className="text-[10px] text-destructive">{usernameError}</p>}
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-foreground">Display Name</label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="w-full px-3.5 py-1.5 rounded-lg bg-muted/50 border border-border text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
              <Globe className="h-3.5 w-3.5 text-muted-foreground" />
              <span>Configured Timezone</span>
            </label>
            <input
              type="text"
              value={timezone}
              onChange={(e) => setTimezone(e.target.value)}
              className="w-full px-3.5 py-1.5 rounded-lg bg-muted/50 border border-border text-xs text-foreground font-mono focus:outline-none"
            />
            <p className="text-[10px] text-muted-foreground">
              Controls calendar day boundaries for practice sessions, heatmaps, and streak tracking.
            </p>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-foreground">Bio / Target Role</label>
            <textarea
              rows={2}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="E.g. Target: Google L5 Software Engineer"
              className="w-full px-3.5 py-1.5 rounded-lg bg-muted/50 border border-border text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          <div className="pt-2 flex items-center justify-between border-t border-border/60">
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={handleLogoutClick}
              className="h-8 text-xs gap-1.5"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span>Sign Out</span>
            </Button>

            <Button type="submit" disabled={loading || usernameAvailable === false} size="sm" className="h-8 text-xs">
              {loading ? <RefreshCw className="h-3 w-3 animate-spin mr-1" /> : null}
              Save Profile
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
