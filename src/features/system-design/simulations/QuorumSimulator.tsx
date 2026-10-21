'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ShieldCheck, AlertCircle, RefreshCw } from 'lucide-react';

export function QuorumSimulator() {
  const [n, setN] = useState(5);
  const [w, setW] = useState(3);
  const [r, setR] = useState(3);
  const [deadNodes, setDeadNodes] = useState<number[]>([]);
  const [lastAction, setLastAction] = useState<string>('Select nodes to simulate failures or adjust quorum parameters.');

  const toggleNodeFail = (nodeIdx: number) => {
    if (deadNodes.includes(nodeIdx)) {
      setDeadNodes(deadNodes.filter((id) => id !== nodeIdx));
    } else {
      setDeadNodes([...deadNodes, nodeIdx]);
    }
  };

  const isQuorumSafe = w + r > n;
  const aliveNodes = n - deadNodes.length;
  const canWrite = aliveNodes >= w;
  const canRead = aliveNodes >= r;

  return (
    <div className="rounded-xl border border-border bg-card/60 p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-4">
        <div>
          <h3 className="font-semibold text-foreground flex items-center gap-2">
            <span>Dynamo Quorum Simulator (w + r &gt; n)</span>
            <Badge variant="outline" className="text-[10px] font-mono">DDIA Chapter 5</Badge>
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Test how read/write quorums guarantee recency overlap in leaderless architectures.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant={isQuorumSafe ? 'success' : 'destructive'} className="text-xs font-mono">
            {isQuorumSafe ? `Strict Quorum: w + r (${w + r}) > n (${n})` : `Sloppy Quorum: w + r (${w + r}) <= n (${n})`}
          </Badge>
        </div>
      </div>

      {/* Quorum Sliders */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-muted/30 p-4 rounded-xl border border-border">
        <div>
          <div className="flex justify-between text-xs font-medium mb-1">
            <span>Replicas (n)</span>
            <span className="font-mono">{n}</span>
          </div>
          <input
            type="range"
            min={3}
            max={7}
            step={2}
            value={n}
            onChange={(e) => {
              const val = Number(e.target.value);
              setN(val);
              setW(Math.floor(val / 2) + 1);
              setR(Math.floor(val / 2) + 1);
            }}
            className="w-full accent-primary"
          />
        </div>

        <div>
          <div className="flex justify-between text-xs font-medium mb-1">
            <span>Write Quorum (w)</span>
            <span className="font-mono">{w}</span>
          </div>
          <input
            type="range"
            min={1}
            max={n}
            value={w}
            onChange={(e) => setW(Number(e.target.value))}
            className="w-full accent-primary"
          />
        </div>

        <div>
          <div className="flex justify-between text-xs font-medium mb-1">
            <span>Read Quorum (r)</span>
            <span className="font-mono">{r}</span>
          </div>
          <input
            type="range"
            min={1}
            max={n}
            value={r}
            onChange={(e) => setR(Number(e.target.value))}
            className="w-full accent-primary"
          />
        </div>
      </div>

      {/* Interactive Node Cluster */}
      <div>
        <p className="text-xs font-medium text-muted-foreground mb-3">
          Click any replica node to toggle simulated crash/partition:
        </p>
        <div className="flex flex-wrap gap-3 justify-center">
          {Array.from({ length: n }).map((_, idx) => {
            const isDead = deadNodes.includes(idx);
            return (
              <button
                key={idx}
                onClick={() => toggleNodeFail(idx)}
                className={`flex-1 min-w-[100px] max-w-[130px] p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-1.5 ${
                  isDead
                    ? 'border-destructive/60 bg-destructive/10 opacity-70'
                    : 'border-primary/50 bg-card hover:border-primary'
                }`}
              >
                <div
                  className={`h-10 w-10 rounded-full flex items-center justify-center font-bold text-xs ${
                    isDead ? 'bg-destructive text-destructive-foreground' : 'bg-primary/20 text-primary'
                  }`}
                >
                  N{idx + 1}
                </div>
                <span className="text-[11px] font-semibold">{isDead ? 'OFFLINE' : 'ONLINE'}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Health Assessment */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-3 rounded-lg border border-border bg-background/50 flex items-center justify-between">
          <span className="text-xs font-medium">Write Availability ({w} needed):</span>
          <Badge variant={canWrite ? 'success' : 'destructive'} className="text-xs font-mono">
            {canWrite ? `Active (${aliveNodes}/${w})` : `Failed (${aliveNodes}/${w})`}
          </Badge>
        </div>
        <div className="p-3 rounded-lg border border-border bg-background/50 flex items-center justify-between">
          <span className="text-xs font-medium">Read Availability ({r} needed):</span>
          <Badge variant={canRead ? 'success' : 'destructive'} className="text-xs font-mono">
            {canRead ? `Active (${aliveNodes}/${r})` : `Failed (${aliveNodes}/${r})`}
          </Badge>
        </div>
      </div>
    </div>
  );
}
