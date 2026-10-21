'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { CheckCircle2, RotateCcw, Eye, Sparkles, Brain, AlertOctagon } from 'lucide-react';

interface RevisionCardProps {
  item: {
    id: string;
    itemType: 'DSA_PROBLEM' | 'CONCEPT' | 'MISTAKE_INVARIANT';
    repetitionNumber: number;
    intervalDays: number;
    easeFactor: number;
    nextReviewDate: Date | string;
    dsaProblem?: {
      id: string;
      title: string;
      slug: string;
      difficulty: string;
      topic: string;
      optimalTimeComplexity: string | null;
    } | null;
    concept?: {
      id: string;
      name: string;
      slug: string;
      summary: string;
      whyItMatters: string;
      sourceRef: string;
    } | null;
    mistake?: {
      id: string;
      violatedInvariant: string;
      category: string;
      correctiveAction: string | null;
    } | null;
  };
  onComplete?: () => void;
}

export function RevisionCard({ item, onComplete }: RevisionCardProps) {
  const [isRevealed, setIsRevealed] = useState(false);
  const [userRecall, setUserRecall] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [completedRating, setCompletedRating] = useState<number | null>(null);

  const handleRate = async (qualityScore: number) => {
    setIsSubmitting(true);
    try {
      await fetch('/api/revision/attempt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          revisionItemId: item.id,
          qualityScore,
          durationSec: 45,
          recalledInvariants: qualityScore >= 3,
        }),
      });
      setCompletedRating(qualityScore);
      setTimeout(() => {
        onComplete?.();
      }, 1000);
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getTitle = () => {
    if (item.itemType === 'DSA_PROBLEM') return item.dsaProblem?.title || 'DSA Problem Recall';
    if (item.itemType === 'CONCEPT') return item.concept?.name || 'System Design Concept';
    return item.mistake?.category || 'Past Invariant Mistake';
  };

  const getPrompt = () => {
    if (item.itemType === 'DSA_PROBLEM') {
      return `Can you recall the optimal pattern, loop invariant, and time complexity for this problem without opening the editor?`;
    }
    if (item.itemType === 'CONCEPT') {
      return `Explain the core architectural trade-off and failure condition behind this concept.`;
    }
    return `What was the exact invariant condition that failed in your previous attempt? State the rule that prevents it.`;
  };

  return (
    <Card className="border-border hover:border-primary/40 transition-all bg-card/70">
      <CardHeader className="pb-3 border-b border-border">
        <div className="flex items-center justify-between">
          <Badge
            variant={
              item.itemType === 'DSA_PROBLEM'
                ? 'default'
                : item.itemType === 'CONCEPT'
                ? 'info'
                : 'destructive'
            }
            className="text-[10px] font-mono"
          >
            {item.itemType.replace(/_/g, ' ')}
          </Badge>
          <span className="text-xs font-mono text-muted-foreground">
            Interval: {item.intervalDays}d • Reps: {item.repetitionNumber}
          </span>
        </div>
        <CardTitle className="text-base font-bold text-foreground mt-1.5 flex items-center gap-2">
          {item.itemType === 'MISTAKE_INVARIANT' && <AlertOctagon className="h-4 w-4 text-rose-500" />}
          <span>{getTitle()}</span>
        </CardTitle>
      </CardHeader>

      <CardContent className="pt-4 space-y-4">
        {/* Active Retrieval Question */}
        <div className="p-3.5 rounded-lg bg-primary/5 border border-primary/20 text-xs text-foreground/90 space-y-1">
          <span className="font-semibold text-primary font-mono text-[11px] block">
            RETRIEVAL OBJECTIVE:
          </span>
          <p>{getPrompt()}</p>
        </div>

        {/* User Thought Input */}
        {!isRevealed && (
          <div className="space-y-2">
            <textarea
              rows={2}
              value={userRecall}
              onChange={(e) => setUserRecall(e.target.value)}
              placeholder="State your answer or invariant before revealing..."
              className="w-full rounded-lg border border-border bg-background p-2.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            />
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsRevealed(true)}
              className="w-full text-xs h-8 gap-1.5"
            >
              <Eye className="h-3.5 w-3.5" />
              <span>Reveal & Verify Answer</span>
            </Button>
          </div>
        )}

        {/* Revealed Reference Truth */}
        {isRevealed && (
          <div className="space-y-3 animate-in fade-in">
            <div className="p-3 rounded-lg bg-muted/40 border border-border text-xs space-y-1.5">
              <span className="font-semibold text-foreground text-[11px] uppercase font-mono block">
                Canonical Reference:
              </span>
              {item.itemType === 'DSA_PROBLEM' && (
                <div className="space-y-1">
                  <p className="text-muted-foreground">
                    Topic: <strong>{item.dsaProblem?.topic}</strong> | Difficulty: <strong>{item.dsaProblem?.difficulty}</strong>
                  </p>
                  <p className="text-muted-foreground font-mono">
                    Optimal Complexity: <strong className="text-primary">{item.dsaProblem?.optimalTimeComplexity || 'O(N)'}</strong>
                  </p>
                </div>
              )}
              {item.itemType === 'CONCEPT' && (
                <div className="space-y-1">
                  <p className="text-foreground/90 leading-relaxed">{item.concept?.summary}</p>
                  <p className="text-muted-foreground italic text-[11px]">{item.concept?.sourceRef}</p>
                </div>
              )}
              {item.itemType === 'MISTAKE_INVARIANT' && (
                <div className="space-y-1.5">
                  <p className="text-rose-400 font-medium">Violated Invariant: {item.mistake?.violatedInvariant}</p>
                  <p className="text-emerald-400 font-medium">Corrective Rule: {item.mistake?.correctiveAction}</p>
                </div>
              )}
            </div>

            {/* SM-2 Recall Quality Rating */}
            <div>
              <p className="text-[11px] text-center font-medium text-muted-foreground mb-2">
                Rate your recall quality (SM-2 Algorithm):
              </p>
              <div className="grid grid-cols-6 gap-1">
                {[
                  { q: 0, label: 'Blackout' },
                  { q: 1, label: 'Fail' },
                  { q: 2, label: 'Hard' },
                  { q: 3, label: 'Good' },
                  { q: 4, label: 'Easy' },
                  { q: 5, label: 'Perfect' },
                ].map(({ q, label }) => (
                  <button
                    key={q}
                    onClick={() => handleRate(q)}
                    disabled={isSubmitting}
                    className={`py-1.5 rounded-lg border text-xs font-mono transition-all flex flex-col items-center ${
                      completedRating === q
                        ? 'bg-primary text-primary-foreground border-primary font-bold'
                        : 'border-border bg-background hover:bg-muted text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <span>{q}</span>
                    <span className="text-[9px]">{label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
