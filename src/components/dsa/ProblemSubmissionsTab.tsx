'use client';

import React, { useState, useEffect } from 'react';
import { AcceptedSnapshot, localStore } from '@/lib/storage/indexedDb';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import {
  CheckCircle2,
  Clock,
  Gauge,
  Code2,
  Calendar,
  Copy,
  Check,
  ArrowRight,
  Terminal,
  Lock,
} from 'lucide-react';

interface ProblemSubmissionsTabProps {
  problemId: string;
  onRestoreCode?: (code: string) => void;
  isGuest?: boolean;
  onPromptAuth?: () => void;
}

export function ProblemSubmissionsTab({
  problemId,
  onRestoreCode,
  isGuest = false,
  onPromptAuth,
}: ProblemSubmissionsTabProps) {
  const [snapshots, setSnapshots] = useState<AcceptedSnapshot[]>([]);
  const [selectedSnapshot, setSelectedSnapshot] = useState<AcceptedSnapshot | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isGuest) {
      setSnapshots([]);
      return;
    }
    localStore.listAcceptedSnapshots(problemId).then(setSnapshots);
  }, [problemId, isGuest]);

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatDuration = (sec?: number) => {
    if (!sec || sec <= 0) return '—';
    const mins = Math.floor(sec / 60);
    const secs = sec % 60;
    if (mins > 0) return `${mins}m ${secs}s`;
    return `${secs}s`;
  };

  return (
    <div className="h-full space-y-4">
      <div className="flex items-center justify-between pb-2 border-b border-border/60">
        <div>
          <h3 className="text-sm font-semibold text-foreground">Accepted Submissions</h3>
          <p className="text-xs text-muted-foreground">
            Immutable snapshots of previously accepted solutions with recorded solve duration.
          </p>
        </div>
        <Badge variant="outline" className="font-mono text-xs">
          {isGuest ? 'Guest Mode' : `${snapshots.length} Snapshot${snapshots.length === 1 ? '' : 's'}`}
        </Badge>
      </div>

      {isGuest ? (
        <div className="p-8 text-center border border-dashed border-border/70 rounded-lg bg-card/20 space-y-3">
          <div className="h-10 w-10 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto">
            <Lock className="h-5 w-5" />
          </div>
          <h4 className="text-sm font-semibold text-foreground">Sign in to view your submissions</h4>
          <p className="text-xs text-muted-foreground max-w-sm mx-auto leading-relaxed">
            Submission history, optimal solution archives, and execution logs are protected and linked to your authenticated account.
          </p>
          {onPromptAuth && (
            <Button size="sm" onClick={onPromptAuth} className="text-xs mt-2">
              Sign In with Gmail
            </Button>
          )}
        </div>
      ) : snapshots.length === 0 ? (
        <div className="p-8 text-center border border-dashed border-border/70 rounded-lg bg-card/20 space-y-2">
          <Terminal className="h-8 w-8 text-muted-foreground/60 mx-auto" />
          <p className="text-xs text-muted-foreground">
            No accepted submissions recorded yet for this problem.
          </p>
          <p className="text-[11px] text-muted-foreground/80">
            Submit an optimal or correct solution to automatically archive an accepted snapshot.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {snapshots.map((snap) => (
            <div
              key={snap.id}
              className="p-3.5 rounded-lg border border-border/80 bg-card/40 hover:bg-card/70 transition-colors space-y-2.5"
            >
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <Badge variant="success" className="text-xs gap-1 font-mono">
                    <CheckCircle2 className="h-3 w-3 text-emerald-400" />
                    Accepted
                  </Badge>
                  <span className="text-xs font-mono uppercase bg-muted/60 px-1.5 py-0.5 rounded border border-border/40 text-muted-foreground">
                    {snap.language}
                  </span>
                </div>

                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {new Date(snap.solvedAt).toLocaleDateString()}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3 text-amber-400" />
                    <strong className="text-foreground font-mono">
                      {formatDuration(snap.solveDurationSec)}
                    </strong>
                  </span>
                </div>
              </div>

              {/* Metrics */}
              <div className="grid grid-cols-3 gap-2 text-xs font-mono bg-background/50 p-2 rounded border border-border/40">
                <div>
                  <span className="text-[10px] text-muted-foreground block">Runtime</span>
                  <span className="font-semibold text-foreground">{snap.runtimeMs}ms</span>
                </div>
                <div>
                  <span className="text-[10px] text-muted-foreground block">Memory</span>
                  <span className="font-semibold text-foreground">{snap.memoryKb} KB</span>
                </div>
                <div>
                  <span className="text-[10px] text-muted-foreground block">Optimality</span>
                  <span className="font-semibold text-primary">{snap.optimalityScore}%</span>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-1">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 text-xs"
                  onClick={() => setSelectedSnapshot(snap)}
                >
                  <Code2 className="h-3.5 w-3.5 mr-1" />
                  View Code
                </Button>
                {onRestoreCode && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 text-xs text-primary hover:text-primary"
                    onClick={() => onRestoreCode(snap.code)}
                  >
                    Restore Draft
                    <ArrowRight className="h-3.5 w-3.5 ml-1" />
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Snapshot Code Modal */}
      {selectedSnapshot && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedSnapshot(null)}
          title={`Accepted Snapshot — ${selectedSnapshot.language.toUpperCase()}`}
          description={`Archived on ${new Date(selectedSnapshot.solvedAt).toLocaleString()} with solve time of ${formatDuration(selectedSnapshot.solveDurationSec)}.`}
        >
          <div className="space-y-4">
            <div className="flex justify-between items-center text-xs text-muted-foreground">
              <span>Optimality: {selectedSnapshot.optimalityScore}% | Runtime: {selectedSnapshot.runtimeMs}ms</span>
              <Button
                variant="outline"
                size="sm"
                className="h-7 text-xs"
                onClick={() => handleCopy(selectedSnapshot.code)}
              >
                {copied ? <Check className="h-3 w-3 text-emerald-400 mr-1" /> : <Copy className="h-3 w-3 mr-1" />}
                {copied ? 'Copied' : 'Copy'}
              </Button>
            </div>
            <pre className="p-4 rounded-lg bg-black/80 border border-border text-xs font-mono text-emerald-400/90 overflow-x-auto max-h-[400px]">
              <code>{selectedSnapshot.code}</code>
            </pre>
          </div>
        </Modal>
      )}
    </div>
  );
}
