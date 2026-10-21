'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Play, RotateCcw, AlertTriangle, CheckCircle2 } from 'lucide-react';

export function ReplicationSimulator() {
  const [dataPrimary, setDataPrimary] = useState<number | null>(null);
  const [dataFollower1, setDataFollower1] = useState<number | null>(null); // Sync
  const [dataFollower2, setDataFollower2] = useState<number | null>(null); // Async
  const [follower2Lagged, setFollower2Lagged] = useState(false);
  const [isWriting, setIsWriting] = useState(false);
  const [statusMessage, setStatusMessage] = useState('System ready. Write a new value to observe replication flow.');

  const handleWrite = () => {
    setIsWriting(true);
    const newVal = Math.floor(10 + Math.random() * 90);
    setStatusMessage(`1. Client sends write X = ${newVal} to Leader.`);

    setTimeout(() => {
      setDataPrimary(newVal);
      setStatusMessage(`2. Leader writes X = ${newVal} to local WAL and sends replication stream.`);

      // Sync follower acknowledges
      setTimeout(() => {
        setDataFollower1(newVal);
        setStatusMessage(`3. Synchronous Follower 1 acknowledges write! Leader confirms OK to Client.`);

        // Async follower may lag
        if (!follower2Lagged) {
          setTimeout(() => {
            setDataFollower2(newVal);
            setIsWriting(false);
            setStatusMessage(`4. Asynchronous Follower 2 catches up. All replicas convergent at X = ${newVal}.`);
          }, 1200);
        } else {
          setIsWriting(false);
          setStatusMessage(`⚠️ Follower 2 network delayed! Read from Follower 2 will return stale data (read skew)!`);
        }
      }, 700);
    }, 400);
  };

  const handleCatchUpFollower2 = () => {
    if (dataPrimary !== null) {
      setDataFollower2(dataPrimary);
      setStatusMessage(`Follower 2 caught up to Leader via replication log at offset LSN.`);
    }
  };

  const handleReset = () => {
    setDataPrimary(null);
    setDataFollower1(null);
    setDataFollower2(null);
    setIsWriting(false);
    setStatusMessage('System reset to initial clean state.');
  };

  return (
    <div className="rounded-xl border border-border bg-card/60 p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-4">
        <div>
          <h3 className="font-semibold text-foreground flex items-center gap-2">
            <span>Replication Lag & Semi-Sync Simulator</span>
            <Badge variant="outline" className="text-[10px] font-mono">DDIA Chapter 5</Badge>
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Test synchronous vs asynchronous replication lag and observer anomalies.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant={follower2Lagged ? 'destructive' : 'outline'}
            size="sm"
            onClick={() => setFollower2Lagged(!follower2Lagged)}
            className="text-xs h-8"
          >
            {follower2Lagged ? 'Delay Follower 2: ON' : 'Delay Follower 2: OFF'}
          </Button>
          <Button variant="outline" size="sm" onClick={handleReset} className="h-8">
            <RotateCcw className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      {/* Nodes Visualizer */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Leader Node */}
        <div className="rounded-lg border-2 border-primary/40 bg-background/50 p-4 flex flex-col items-center text-center space-y-2 relative overflow-hidden">
          <Badge variant="default" className="text-[10px]">Leader (Primary)</Badge>
          <div className="h-16 w-16 rounded-xl border border-border bg-card flex items-center justify-center font-mono text-xl font-bold text-primary shadow-inner">
            {dataPrimary !== null ? `X = ${dataPrimary}` : '—'}
          </div>
          <span className="text-[11px] font-mono text-muted-foreground">Accepts Writes & Reads</span>
          {isWriting && <span className="absolute top-2 right-2 flex h-2 w-2 rounded-full bg-primary animate-ping" />}
        </div>

        {/* Sync Follower 1 */}
        <div className="rounded-lg border border-emerald-500/30 bg-background/50 p-4 flex flex-col items-center text-center space-y-2">
          <div className="flex items-center gap-1.5">
            <Badge variant="success" className="text-[10px]">Follower 1 (Sync)</Badge>
          </div>
          <div className="h-16 w-16 rounded-xl border border-border bg-card flex items-center justify-center font-mono text-xl font-bold text-emerald-500 shadow-inner">
            {dataFollower1 !== null ? `X = ${dataFollower1}` : '—'}
          </div>
          <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400">Guaranteed Up-to-date</span>
        </div>

        {/* Async Follower 2 */}
        <div className="rounded-lg border border-border bg-background/50 p-4 flex flex-col items-center text-center space-y-2 relative">
          <div className="flex items-center gap-1.5">
            <Badge variant="secondary" className="text-[10px]">Follower 2 (Async)</Badge>
            {follower2Lagged && dataPrimary !== dataFollower2 && (
              <Badge variant="warning" className="text-[9px] px-1 py-0">LAGGING</Badge>
            )}
          </div>
          <div className="h-16 w-16 rounded-xl border border-border bg-card flex items-center justify-center font-mono text-xl font-bold text-muted-foreground shadow-inner">
            {dataFollower2 !== null ? `X = ${dataFollower2}` : '—'}
          </div>
          <span className="text-[11px] font-mono text-muted-foreground">Subject to Network Jitter</span>
          {follower2Lagged && dataPrimary !== dataFollower2 && (
            <button
              onClick={handleCatchUpFollower2}
              className="text-[11px] text-amber-500 underline hover:text-amber-400 mt-1"
            >
              Force Catch-up
            </button>
          )}
        </div>
      </div>

      {/* Action Controls & Feedbacks */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
        <Button onClick={handleWrite} disabled={isWriting} className="w-full sm:w-auto gap-2">
          <Play className="h-4 w-4 fill-current" />
          <span>Execute Client Write</span>
        </Button>

        <div className="flex-1 text-xs font-mono p-2.5 rounded-lg bg-muted/60 border border-border text-foreground flex items-center gap-2">
          {follower2Lagged && dataPrimary !== dataFollower2 ? (
            <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0" />
          ) : (
            <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
          )}
          <span>{statusMessage}</span>
        </div>
      </div>
    </div>
  );
}
