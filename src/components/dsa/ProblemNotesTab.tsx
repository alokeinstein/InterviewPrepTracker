'use client';

import React, { useState, useEffect, useRef } from 'react';
import { localStore } from '@/lib/storage/indexedDb';
import { Button } from '@/components/ui/Button';
import { Check, Clock, Sparkles, FileText } from 'lucide-react';

interface ProblemNotesTabProps {
  problemId: string;
  problemTitle: string;
}

const TEMPLATES = [
  {
    label: '+ Invariant / Pattern',
    snippet: '\n### Core Invariant & Pattern\n- Pattern: \n- State Transition: \n- Why it works: \n',
  },
  {
    label: '+ Complexity',
    snippet: '\n### Complexity\n- Time Complexity: O()\n- Space Complexity: O()\n- Tradeoffs: \n',
  },
  {
    label: '+ Edge Cases',
    snippet: '\n### Edge Cases\n1. Empty collection / N=0\n2. Single element\n3. Duplicates / Monotonic values\n4. Integer boundaries / Negative numbers\n',
  },
  {
    label: '+ 60s Interview Pitch',
    snippet: '\n### 60-Second Explanation\n1. "To solve this efficiently, we leverage..."\n2. "We maintain the invariant that..."\n3. "This reduces time complexity from brute force to..."\n',
  },
];

export function ProblemNotesTab({ problemId, problemTitle }: ProblemNotesTabProps) {
  const [content, setContent] = useState('');
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'idle'>('idle');
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    let mounted = true;
    localStore.loadNote(problemId).then((saved) => {
      if (mounted && saved !== null) {
        setContent(saved);
        setSaveStatus('saved');
      }
    });
    return () => {
      mounted = false;
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    };
  }, [problemId]);

  const handleChange = (newVal: string) => {
    setContent(newVal);
    setSaveStatus('saving');

    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);

    debounceTimerRef.current = setTimeout(async () => {
      await localStore.saveNote(problemId, newVal);
      setSaveStatus('saved');
    }, 500);
  };

  const insertSnippet = (snippet: string) => {
    const updated = (content ? content + '\n' : '') + snippet;
    handleChange(updated);
  };

  return (
    <div className="h-full flex flex-col space-y-3">
      {/* Top Toolbar */}
      <div className="flex items-center justify-between flex-wrap gap-2 pb-2 border-b border-border/60">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-xs text-muted-foreground mr-1 font-medium flex items-center gap-1">
            <Sparkles className="h-3 w-3 text-primary" /> Prompts:
          </span>
          {TEMPLATES.map((tmpl, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => insertSnippet(tmpl.snippet)}
              className="text-[11px] px-2 py-0.5 rounded bg-muted/60 hover:bg-muted text-muted-foreground hover:text-foreground border border-border/40 transition-colors"
            >
              {tmpl.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1 text-[11px] font-mono text-muted-foreground">
          {saveStatus === 'saving' ? (
            <span className="text-amber-400 flex items-center gap-1">
              <Clock className="h-3 w-3 animate-spin" /> Saving...
            </span>
          ) : saveStatus === 'saved' ? (
            <span className="text-emerald-400 flex items-center gap-1">
              <Check className="h-3 w-3" /> Autosaved locally
            </span>
          ) : (
            <span>Ready</span>
          )}
        </div>
      </div>

      {/* Textarea */}
      <div className="flex-1 min-h-[300px]">
        <textarea
          value={content}
          onChange={(e) => handleChange(e.target.value)}
          placeholder={`Write personal notes, patterns, invariants, or interview reminders for ${problemTitle}... (Autosaves automatically)`}
          className="w-full h-full p-4 rounded-lg bg-card/40 border border-border/70 text-foreground placeholder:text-muted-foreground/60 text-sm leading-relaxed resize-none focus:outline-none focus:ring-1 focus:ring-primary font-sans"
        />
      </div>
    </div>
  );
}
