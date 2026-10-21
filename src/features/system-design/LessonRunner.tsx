'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { ReplicationSimulator } from './simulations/ReplicationSimulator';
import { QuorumSimulator } from './simulations/QuorumSimulator';
import {
  ChevronRight,
  ChevronLeft,
  CheckCircle,
  HelpCircle,
  Lightbulb,
  Sparkles,
  Award,
  BookOpen,
  MessageSquare,
} from 'lucide-react';

interface ConceptData {
  id: string;
  name: string;
  slug: string;
  summary: string;
  whyItMatters: string;
  coreMechanics: string;
  visualType: string | null;
  scenarioProblem: string | null;
  interviewPrompt: string | null;
  tradeoffs: string[];
  technologies: string[];
  sourceRef: string;
  masteries?: {
    overallScore: number;
    understandingScore: number;
    recallScore: number;
  }[];
}

interface LessonRunnerProps {
  concept: ConceptData;
}

export function LessonRunner({ concept }: LessonRunnerProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [userPrediction, setUserPrediction] = useState('');
  const [interviewPitch, setInterviewPitch] = useState('');
  const [aiFeedback, setAiFeedback] = useState<any>(null);
  const [pitchFeedback, setPitchFeedback] = useState<any>(null);
  const [isLoadingFeedback, setIsLoadingFeedback] = useState(false);
  const [isLoadingPitch, setIsLoadingPitch] = useState(false);
  const [masteryScore, setMasteryScore] = useState(
    concept.masteries?.[0]?.overallScore || 62.5
  );

  const totalSteps = 9;
  const progressPercent = Math.round((currentStep / totalSteps) * 100);

  const handlePredictSubmit = async () => {
    if (!userPrediction.trim()) return;
    setIsLoadingFeedback(true);
    try {
      const res = await fetch('/api/ai/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conceptId: concept.id,
          userAnswer: userPrediction,
          expectedConcepts: concept.tradeoffs.concat(concept.technologies),
          stepIndex: 4,
        }),
      });
      const data = await res.json();
      setAiFeedback(data);
      if (data.score) {
        setMasteryScore((prev) => Math.min(Math.round(prev + 5), 100));
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoadingFeedback(false);
    }
  };

  const handlePitchSubmit = async () => {
    if (!interviewPitch.trim()) return;
    setIsLoadingPitch(true);
    try {
      const res = await fetch('/api/ai/interview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'evaluate',
          prompt: concept.interviewPrompt || concept.name,
          userResponse: interviewPitch,
        }),
      });
      const data = await res.json();
      setPitchFeedback(data);
      if (data.overallScore) {
        setMasteryScore((prev) => Math.min(Math.round(prev + 8), 100));
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoadingPitch(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Top Header Card */}
      <Card className="border-primary/20 bg-card/80 backdrop-blur-sm">
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Badge variant="outline" className="font-mono text-[10px]">
                  Step {currentStep} of {totalSteps}
                </Badge>
                <Badge variant="secondary" className="font-mono text-[10px]">
                  {concept.sourceRef}
                </Badge>
              </div>
              <CardTitle className="text-xl sm:text-2xl font-bold">{concept.name}</CardTitle>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-[11px] text-muted-foreground uppercase font-mono">Concept Mastery</p>
                <p className="text-lg font-bold font-mono text-primary">{masteryScore}%</p>
              </div>
            </div>
          </div>
          <ProgressBar value={progressPercent} className="mt-2" />
        </CardHeader>
      </Card>

      {/* Step Content Card */}
      <Card className="min-h-[420px] flex flex-col justify-between">
        <CardContent className="pt-6">
          {/* STEP 1: Rigorous Engineering Explanation */}
          {currentStep === 1 && (
            <div className="space-y-4 animate-in fade-in">
              <div className="flex items-center gap-2 text-primary font-semibold text-sm">
                <BookOpen className="h-4 w-4" />
                <span>STEP 1: RIGOROUS ARCHITECTURAL DEFINITION</span>
              </div>
              <p className="text-foreground leading-relaxed text-base">{concept.summary}</p>
              <div className="p-4 rounded-xl bg-muted/40 border border-border space-y-2">
                <h4 className="text-xs font-mono font-semibold uppercase text-muted-foreground">
                  Core Technical Mechanics
                </h4>
                <p className="text-sm text-foreground/90 leading-relaxed">{concept.coreMechanics}</p>
              </div>
              <div className="flex flex-wrap gap-2 pt-2">
                <span className="text-xs text-muted-foreground self-center mr-1">Associated Tech:</span>
                {concept.technologies.map((t) => (
                  <Badge key={t} variant="outline" className="font-mono text-[11px]">
                    {t}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* STEP 2: The "Why?" */}
          {currentStep === 2 && (
            <div className="space-y-4 animate-in fade-in">
              <div className="flex items-center gap-2 text-amber-500 font-semibold text-sm">
                <Lightbulb className="h-4 w-4" />
                <span>STEP 2: WHY DOES THIS EXIST? (ENGINEERING FIRST PRINCIPLES)</span>
              </div>
              <div className="p-5 rounded-xl border border-amber-500/20 bg-amber-500/5 space-y-3">
                <h4 className="font-semibold text-base text-foreground">The Underlying Problem</h4>
                <p className="text-sm text-foreground/90 leading-relaxed">{concept.whyItMatters}</p>
              </div>
              <div className="p-4 rounded-xl bg-muted/40 border border-border">
                <h4 className="text-xs font-mono font-semibold uppercase text-muted-foreground mb-2">
                  Fundamental Trade-Offs
                </h4>
                <ul className="list-disc list-inside space-y-1.5 text-sm text-muted-foreground">
                  {concept.tradeoffs.map((to, i) => (
                    <li key={i} className="text-foreground/90">
                      {to}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* STEP 3: Interactive Simulation */}
          {currentStep === 3 && (
            <div className="space-y-4 animate-in fade-in">
              <div className="flex items-center gap-2 text-emerald-500 font-semibold text-sm">
                <Sparkles className="h-4 w-4" />
                <span>STEP 3: INTERACTIVE CONCEPT SIMULATOR</span>
              </div>
              {concept.slug.includes('quorum') || concept.slug.includes('dynamo') ? (
                <QuorumSimulator />
              ) : (
                <ReplicationSimulator />
              )}
            </div>
          )}

          {/* STEP 4: Predictive Check Question */}
          {currentStep === 4 && (
            <div className="space-y-4 animate-in fade-in">
              <div className="flex items-center gap-2 text-primary font-semibold text-sm">
                <HelpCircle className="h-4 w-4" />
                <span>STEP 4: STOP & THINK — PREDICT THE OUTCOME</span>
              </div>
              <div className="p-4 rounded-xl bg-primary/5 border border-primary/20 space-y-2">
                <p className="text-sm font-semibold text-foreground">
                  Based on the architectural mechanics, what anomaly or failure occurs in the following scenario?
                </p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {concept.scenarioProblem ||
                    'A client writes X = 10 to the primary node. 20ms later, the client requests X from an asynchronous read replica with 500ms replication lag. What does the client observe, and what consistency model does this violate?'}
                </p>
              </div>

              <div className="space-y-2">
                <textarea
                  rows={4}
                  value={userPrediction}
                  onChange={(e) => setUserPrediction(e.target.value)}
                  placeholder="Explain your reasoning like you are in an interview..."
                  className="w-full rounded-xl border border-border bg-background p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <Button
                  onClick={handlePredictSubmit}
                  isLoading={isLoadingFeedback}
                  disabled={!userPrediction.trim() || isLoadingFeedback}
                  className="w-full sm:w-auto"
                >
                  Submit for Socratic AI Evaluation
                </Button>
              </div>

              {aiFeedback && (
                <div
                  className={`p-4 rounded-xl border mt-4 space-y-2 ${
                    aiFeedback.isCorrect
                      ? 'border-emerald-500/30 bg-emerald-500/10'
                      : 'border-amber-500/30 bg-amber-500/10'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-xs uppercase tracking-wide">
                      {aiFeedback.isCorrect ? 'Accurate Reasoning' : 'Cognitive Misconception Detected'}
                    </span>
                    <Badge variant={aiFeedback.isCorrect ? 'success' : 'warning'}>
                      Score: {aiFeedback.score}/100
                    </Badge>
                  </div>
                  <p className="text-sm text-foreground/90">{aiFeedback.feedback}</p>
                  {aiFeedback.nextQuestion && (
                    <p className="text-xs font-mono text-primary pt-2 border-t border-border/50">
                      Follow-up Drill: {aiFeedback.nextQuestion}
                    </p>
                  )}
                </div>
              )}
            </div>
          )}

          {/* STEP 5: Socratic Feedback & Discussion */}
          {currentStep === 5 && (
            <div className="space-y-4 animate-in fade-in">
              <div className="flex items-center gap-2 text-primary font-semibold text-sm">
                <MessageSquare className="h-4 w-4" />
                <span>STEP 5: SOCRATIC ARCHITECTURAL DEBRIEF</span>
              </div>
              <div className="p-5 rounded-xl border border-border bg-muted/30 space-y-3">
                <h4 className="font-semibold text-foreground text-sm">What Top-Tier Interviewers Look For</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Interviewers at Google and Microsoft evaluate whether you differentiate between
                  <strong> symptom</strong> (the user sees disappearing updates) and <strong>root cause</strong> (unbounded
                  asynchronous replication lag without read-after-write session pinning).
                </p>
                <div className="p-3 rounded-lg bg-background border border-border text-xs font-mono text-foreground/90">
                  Key Invariant: Never assume zero network latency. In an asynchronous system, replication
                  delay is unbounded. Enforce read-your-writes by routing user profile reads to the primary.
                </div>
              </div>
            </div>
          )}

          {/* STEP 6: Deepen & Contrast */}
          {currentStep === 6 && (
            <div className="space-y-4 animate-in fade-in">
              <div className="flex items-center gap-2 text-primary font-semibold text-sm">
                <Award className="h-4 w-4" />
                <span>STEP 6: DEEPEN & CONTRAST (ALTERNATIVE PATTERNS)</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl border border-border bg-card space-y-2">
                  <h4 className="font-semibold text-sm text-foreground">Standard Approach</h4>
                  <p className="text-xs text-muted-foreground">
                    Synchronous replication guarantees freshness on all nodes, but a single node outage
                    halts all database write availability.
                  </p>
                </div>
                <div className="p-4 rounded-xl border border-primary/30 bg-primary/5 space-y-2">
                  <h4 className="font-semibold text-sm text-primary">Modern Production Pattern</h4>
                  <p className="text-xs text-muted-foreground">
                    Semi-synchronous replication: Leader requires exactly one synchronous follower
                    acknowledgment, maintaining high availability with zero durability loss.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* STEP 7: Realistic Production Scenario */}
          {currentStep === 7 && (
            <div className="space-y-4 animate-in fade-in">
              <div className="flex items-center gap-2 text-primary font-semibold text-sm">
                <CheckCircle className="h-4 w-4" />
                <span>STEP 7: PRODUCTION SCALE SCENARIO</span>
              </div>
              <div className="p-5 rounded-xl border border-border bg-card space-y-3">
                <h4 className="font-semibold text-foreground text-sm">Scenario Challenge</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {concept.scenarioProblem}
                </p>
                <div className="p-4 rounded-lg bg-muted/40 border border-border text-xs space-y-2">
                  <span className="font-semibold text-foreground">Recommended Architecture Strategy:</span>
                  <p className="text-muted-foreground">
                    Split traffic by user role and access pattern. Apply cache invalidation events via
                    Change Data Capture (CDC) from the database replication log to ensure decoupled
                    eventual consistency.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* STEP 8: 60-Second Interview Pitch */}
          {currentStep === 8 && (
            <div className="space-y-4 animate-in fade-in">
              <div className="flex items-center gap-2 text-primary font-semibold text-sm">
                <MessageSquare className="h-4 w-4" />
                <span>STEP 8: 60-SECOND INTERVIEW EXPLANATION CHALLENGE</span>
              </div>
              <div className="p-4 rounded-xl bg-primary/5 border border-primary/20">
                <p className="text-sm font-semibold text-foreground">Interview Prompt:</p>
                <p className="text-sm text-primary italic mt-1">"{concept.interviewPrompt}"</p>
              </div>

              <textarea
                rows={4}
                value={interviewPitch}
                onChange={(e) => setInterviewPitch(e.target.value)}
                placeholder="Give your concise, high-level pitch (under 2 minutes / ~100 words)..."
                className="w-full rounded-xl border border-border bg-background p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <Button
                onClick={handlePitchSubmit}
                isLoading={isLoadingPitch}
                disabled={!interviewPitch.trim() || isLoadingPitch}
              >
                Grade Interview Explanation
              </Button>

              {pitchFeedback && (
                <div className="p-4 rounded-xl border border-primary/30 bg-card space-y-3 mt-4">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-sm">Interview Score Breakdown</span>
                    <Badge variant="success" className="font-mono text-xs">
                      {pitchFeedback.overallScore} / 10
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
                    <div className="p-2 rounded bg-muted/40 border border-border">
                      <p className="text-[10px] text-muted-foreground">Problem Solving</p>
                      <p className="font-bold text-sm">{pitchFeedback.problemSolvingScore}/10</p>
                    </div>
                    <div className="p-2 rounded bg-muted/40 border border-border">
                      <p className="text-[10px] text-muted-foreground">Communication</p>
                      <p className="font-bold text-sm">{pitchFeedback.communicationScore}/10</p>
                    </div>
                    <div className="p-2 rounded bg-muted/40 border border-border">
                      <p className="text-[10px] text-muted-foreground">Complexity</p>
                      <p className="font-bold text-sm">{pitchFeedback.complexityScore}/10</p>
                    </div>
                    <div className="p-2 rounded bg-muted/40 border border-border">
                      <p className="text-[10px] text-muted-foreground">Edge Cases</p>
                      <p className="font-bold text-sm">{pitchFeedback.edgeCaseScore}/10</p>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">{pitchFeedback.critique}</p>
                </div>
              )}
            </div>
          )}

          {/* STEP 9: Mastery & Spaced Retrieval */}
          {currentStep === 9 && (
            <div className="space-y-4 animate-in fade-in text-center py-6">
              <div className="h-16 w-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 flex items-center justify-center mx-auto">
                <CheckCircle className="h-8 w-8" />
              </div>
              <h3 className="text-2xl font-bold text-foreground">Concept Lesson Completed!</h3>
              <p className="text-sm text-muted-foreground max-w-md mx-auto">
                You have actively learned, predicted, and articulated <strong>{concept.name}</strong>.
                This concept has been automatically scheduled in your Spaced Repetition queue for Day 1 retrieval.
              </p>
              <div className="inline-flex items-center gap-2 p-3 rounded-xl border border-border bg-card font-mono text-sm">
                <span>Updated Overall Mastery:</span>
                <span className="font-bold text-primary">{masteryScore}%</span>
              </div>
            </div>
          )}
        </CardContent>

        {/* Step Navigation Footer */}
        <CardFooter className="flex items-center justify-between border-t border-border pt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentStep((s) => Math.max(s - 1, 1))}
            disabled={currentStep === 1}
            className="gap-1.5"
          >
            <ChevronLeft className="h-4 w-4" />
            <span>Previous</span>
          </Button>

          <span className="text-xs font-mono text-muted-foreground">
            Step {currentStep} of {totalSteps}
          </span>

          <Button
            size="sm"
            onClick={() => setCurrentStep((s) => Math.min(s + 1, totalSteps))}
            disabled={currentStep === totalSteps}
            className="gap-1.5"
          >
            <span>Next</span>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
