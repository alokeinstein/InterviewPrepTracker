'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { ProgressBar } from '@/components/ui/ProgressBar';
import {
  BookOpen,
  CheckCircle2,
  Circle,
  Lightbulb,
  AlertTriangle,
  HelpCircle,
  Layers,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  FileText,
  Compass,
} from 'lucide-react';

interface SectionData {
  id: string;
  sectionNumber: string;
  title: string;
  pageStart: number | null;
  pageEnd: number | null;
  content: string | null;
  simpleExplanation: string | null;
  analogy: string | null;
  keyQuestions: any;
  concepts: {
    id: string;
    name: string;
    slug: string;
    summary: string;
    whyItMatters: string;
    coreMechanics: string;
    tradeoffs: string[];
    technologies: string[];
  }[];
  progress: {
    isCompleted: boolean;
  }[];
}

interface ChapterCheatSheetData {
  chapterTitle?: string;
  coreDecisions: { decision: string; recommendation: string; tradeOff: string }[];
  interviewPhrasing: { dontSay: string; sayThis: string; why: string }[];
  tradeOffMatrix: { feature: string; optionA: string; optionB: string; verdict: string }[];
  topInterviewQuestions: { question: string; idealAnswerOutline: string[] }[];
}

interface ChapterReaderProps {
  chapter: {
    id: string;
    chapterNumber: number;
    title: string;
    sourcePages: string;
    summary: string;
    learningObjectives: string[];
    cheatSheet: any;
    part: {
      partNumber: number;
      title: string;
    };
    sections: SectionData[];
  };
  totalChapters: number;
}

export function ChapterReader({ chapter, totalChapters }: ChapterReaderProps) {
  const [activeTab, setActiveTab] = useState<'study' | 'cheatsheet' | 'concepts'>('study');
  const [activeSectionId, setActiveSectionId] = useState<string>(chapter.sections[0]?.id || '');
  const [completedSectionIds, setCompletedSectionIds] = useState<string[]>(
    chapter.sections.filter((s) => s.progress?.[0]?.isCompleted).map((s) => s.id)
  );
  const [revealedQuestions, setRevealedQuestions] = useState<Record<string, boolean>>({});
  const [isUpdatingProgress, setIsUpdatingProgress] = useState(false);

  const totalSections = chapter.sections.length;
  const completedCount = completedSectionIds.length;
  const progressPercent = totalSections > 0 ? Math.round((completedCount / totalSections) * 100) : 0;

  const toggleSectionComplete = async (sectionId: string) => {
    const isCurrentlyCompleted = completedSectionIds.includes(sectionId);
    const nextCompleted = !isCurrentlyCompleted;

    if (nextCompleted) {
      setCompletedSectionIds([...completedSectionIds, sectionId]);
    } else {
      setCompletedSectionIds(completedSectionIds.filter((id) => id !== sectionId));
    }

    try {
      setIsUpdatingProgress(true);
      await fetch('/api/system-design/section-progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sectionId,
          isCompleted: nextCompleted,
        }),
      });
    } catch (err) {
      console.error('Failed to sync section progress:', err);
    } finally {
      setIsUpdatingProgress(false);
    }
  };

  const toggleQuestionReveal = (qKey: string) => {
    setRevealedQuestions((prev) => ({ ...prev, [qKey]: !prev[qKey] }));
  };

  const cheatSheetData: ChapterCheatSheetData | null = chapter.cheatSheet;

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Top Breadcrumb & Chapter Title Header */}
      <div className="p-6 rounded-2xl border border-border bg-card/80 backdrop-blur-md space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <Link
                href="/system-design"
                className="text-xs font-mono text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors"
              >
                <ArrowLeft className="h-3 w-3" /> System Design Academy
              </Link>
              <span className="text-muted-foreground text-xs">•</span>
              <Badge variant="outline" className="font-mono text-xs">
                Part {chapter.part.partNumber}: {chapter.part.title}
              </Badge>
              <Badge variant="secondary" className="font-mono text-xs">
                DDIA {chapter.sourcePages}
              </Badge>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-foreground">
              Chapter {chapter.chapterNumber}: {chapter.title}
            </h1>
            <p className="text-xs md:text-sm text-muted-foreground mt-1 max-w-3xl leading-relaxed">
              {chapter.summary}
            </p>
          </div>

          {/* Reading Progress Card */}
          <div className="p-4 rounded-xl bg-muted/30 border border-border shrink-0 min-w-[220px] space-y-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-muted-foreground">Chapter Mastery</span>
              <span className="font-bold text-foreground">{progressPercent}%</span>
            </div>
            <ProgressBar value={progressPercent} className="h-2" />
            <p className="text-[11px] text-muted-foreground font-mono">
              {completedCount} of {totalSections} sections understood
            </p>
          </div>
        </div>

        {/* View Mode Switcher Tabs */}
        <div className="flex items-center gap-2 pt-2 border-t border-border flex-wrap">
          <Button
            variant={activeTab === 'study' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveTab('study')}
            className="text-xs h-8 gap-1.5"
          >
            <BookOpen className="h-3.5 w-3.5" />
            <span>Interactive Study Mode (Comprehensive Guide)</span>
          </Button>

          <Button
            variant={activeTab === 'cheatsheet' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveTab('cheatsheet')}
            className="text-xs h-8 gap-1.5"
          >
            <FileText className="h-3.5 w-3.5" />
            <span>Interview Revision Cheat Sheet</span>
          </Button>

          <Button
            variant={activeTab === 'concepts' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveTab('concepts')}
            className="text-xs h-8 gap-1.5"
          >
            <Compass className="h-3.5 w-3.5" />
            <span>Concept Deep Dives ({chapter.sections.reduce((acc, s) => acc + s.concepts.length, 0)})</span>
          </Button>
        </div>
      </div>

      {/* Main Content Layout */}
      {activeTab === 'study' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Table of Contents Sidebar (3 cols) */}
          <div className="lg:col-span-4 space-y-3">
            <Card className="sticky top-4">
              <CardHeader className="py-3 px-4 border-b border-border bg-muted/20">
                <CardTitle className="text-xs font-bold font-mono uppercase tracking-wider text-muted-foreground flex items-center justify-between">
                  <span>Table of Contents</span>
                  <span>{chapter.sections.length} Sections</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-2 space-y-1">
                {chapter.sections.map((sec) => {
                  const isCompleted = completedSectionIds.includes(sec.id);
                  const isCurrent = activeSectionId === sec.id;
                  return (
                    <button
                      key={sec.id}
                      onClick={() => setActiveSectionId(sec.id)}
                      className={`w-full flex items-center justify-between p-2.5 rounded-lg text-left text-xs transition-all border ${
                        isCurrent
                          ? 'bg-primary/10 border-primary/40 text-foreground font-semibold shadow-sm'
                          : 'border-transparent hover:bg-muted text-muted-foreground'
                      }`}
                    >
                      <div className="flex items-center gap-2 truncate pr-2">
                        <span className="font-mono text-[11px] text-primary/80 shrink-0">
                          {sec.sectionNumber}
                        </span>
                        <span className="truncate">{sec.title}</span>
                      </div>
                      <div className="shrink-0">
                        {isCompleted ? (
                          <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                        ) : (
                          <Circle className="h-4 w-4 text-muted-foreground/40" />
                        )}
                      </div>
                    </button>
                  );
                })}
              </CardContent>
            </Card>

            {/* Chapter Navigation Buttons */}
            <div className="flex items-center justify-between gap-2 pt-2">
              {chapter.chapterNumber > 1 ? (
                <Link
                  href={`/system-design/chapter/${chapter.chapterNumber - 1}`}
                  className="flex-1 text-center py-2 px-3 rounded-lg border border-border text-xs font-mono hover:bg-muted transition-colors flex items-center justify-center gap-1 text-muted-foreground"
                >
                  <ArrowLeft className="h-3 w-3" /> Ch {chapter.chapterNumber - 1}
                </Link>
              ) : <div className="flex-1" />}

              {chapter.chapterNumber < totalChapters ? (
                <Link
                  href={`/system-design/chapter/${chapter.chapterNumber + 1}`}
                  className="flex-1 text-center py-2 px-3 rounded-lg border border-border text-xs font-mono hover:bg-muted transition-colors flex items-center justify-center gap-1 text-foreground font-medium"
                >
                  Ch {chapter.chapterNumber + 1} <ArrowRight className="h-3 w-3" />
                </Link>
              ) : <div className="flex-1" />}
            </div>
          </div>

          {/* Right Section Content Area (8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            {(() => {
              const activeSec =
                chapter.sections.find((s) => s.id === activeSectionId) || chapter.sections[0];
              if (!activeSec) return null;
              const isCompleted = completedSectionIds.includes(activeSec.id);

              return (
                <div className="space-y-6 animate-in fade-in duration-200">
                  {/* Section Title & Status Banner */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl border border-border bg-card">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="outline" className="font-mono text-[11px]">
                          Section {activeSec.sectionNumber}
                        </Badge>
                        {activeSec.pageStart && (
                          <span className="text-[11px] text-muted-foreground font-mono">
                            pp. {activeSec.pageStart}–{activeSec.pageEnd}
                          </span>
                        )}
                      </div>
                      <h2 className="text-xl font-bold text-foreground tracking-tight">
                        {activeSec.title}
                      </h2>
                    </div>

                    <Button
                      variant={isCompleted ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => toggleSectionComplete(activeSec.id)}
                      className={`text-xs h-8 gap-1.5 shrink-0 ${
                        isCompleted
                          ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                          : 'hover:border-emerald-500/50 hover:text-emerald-500'
                      }`}
                    >
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      <span>{isCompleted ? 'Understood & Completed' : 'Mark as Read'}</span>
                    </Button>
                  </div>

                  {/* 1. Physics Wallah Style "Explain Simply" Box */}
                  <div className="p-5 rounded-xl border-2 border-primary/30 bg-primary/5 space-y-4">
                    <div className="flex items-center gap-2 text-primary font-bold text-sm tracking-wide uppercase font-mono">
                      <Sparkles className="h-4 w-4" />
                      <span>The Big Idea (Explain Simply)</span>
                    </div>

                    <div className="text-sm text-foreground/90 leading-relaxed whitespace-pre-line space-y-2">
                      {activeSec.simpleExplanation}
                    </div>

                    {activeSec.analogy && (
                      <div className="p-3.5 rounded-lg bg-background/80 border border-primary/20 flex items-start gap-3">
                        <Lightbulb className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                        <div>
                          <span className="text-xs font-semibold text-amber-500 font-mono uppercase block mb-0.5">
                            Real-World Analogy
                          </span>
                          <p className="text-xs text-foreground/90 leading-relaxed">
                            {activeSec.analogy}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* 2. Original Book Deep-Dive (Source Preservation) */}
                  <Card>
                    <CardHeader className="py-3 px-4 border-b border-border bg-muted/10">
                      <CardTitle className="text-xs font-semibold text-muted-foreground font-mono uppercase flex items-center gap-2">
                        <BookOpen className="h-3.5 w-3.5 text-primary" />
                        <span>DDIA Canonical Text Deep-Dive</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-5 space-y-3 text-sm leading-relaxed text-foreground/90 whitespace-pre-line">
                      {activeSec.content}
                    </CardContent>
                  </Card>

                  {/* 3. Core Architectural Concepts in this Section */}
                  {activeSec.concepts.length > 0 && (
                    <div className="space-y-3">
                      <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                        <Layers className="h-3.5 w-3.5 text-primary" />
                        <span>Core Architectural Concepts</span>
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {activeSec.concepts.map((cpt) => (
                          <Card key={cpt.id} className="border-border hover:border-primary/40 transition-colors">
                            <CardHeader className="p-4 pb-2">
                              <CardTitle className="text-sm font-bold text-foreground">
                                {cpt.name}
                              </CardTitle>
                            </CardHeader>
                            <CardContent className="p-4 pt-1 space-y-2 text-xs">
                              <p className="text-muted-foreground line-clamp-3">{cpt.summary}</p>
                              <div className="flex flex-wrap gap-1 pt-1">
                                {cpt.technologies.slice(0, 3).map((t, i) => (
                                  <Badge key={i} variant="outline" className="text-[10px] font-mono">
                                    {t}
                                  </Badge>
                                ))}
                              </div>
                              <Link
                                href={`/system-design/${cpt.slug}`}
                                className="inline-flex items-center gap-1 text-[11px] font-semibold text-primary hover:underline pt-1"
                              >
                                Interactive Concept Lesson <ArrowRight className="h-3 w-3" />
                              </Link>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 4. Active Recall Knowledge Check */}
                  {Array.isArray(activeSec.keyQuestions) && activeSec.keyQuestions.length > 0 && (
                    <div className="p-5 rounded-xl border border-amber-500/30 bg-amber-500/5 space-y-3">
                      <div className="flex items-center gap-2 text-amber-500 font-bold text-xs tracking-wide uppercase font-mono">
                        <HelpCircle className="h-4 w-4" />
                        <span>Active Recall & Interview Check</span>
                      </div>

                      {activeSec.keyQuestions.map((q: any, qIdx: number) => {
                        const qKey = `${activeSec.id}-q-${qIdx}`;
                        const isRevealed = revealedQuestions[qKey];

                        return (
                          <div key={qIdx} className="p-3.5 rounded-lg bg-background border border-border space-y-2">
                            <p className="text-xs font-semibold text-foreground">{q.question}</p>

                            {isRevealed ? (
                              <div className="pt-2 border-t border-border space-y-1.5 text-xs text-foreground/90 animate-in fade-in">
                                <p className="leading-relaxed">{q.answer}</p>
                                {q.tip && (
                                  <p className="text-[11px] font-mono text-primary flex items-center gap-1 mt-1">
                                    💡 <strong>Interview Tip:</strong> {q.tip}
                                  </p>
                                )}
                              </div>
                            ) : (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => toggleQuestionReveal(qKey)}
                                className="text-[11px] h-7 px-2 text-primary font-mono"
                              >
                                Reveal Model Answer & Interview Tip
                              </Button>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Bottom Navigation between sections */}
                  <div className="flex items-center justify-between pt-4 border-t border-border">
                    {(() => {
                      const curIdx = chapter.sections.findIndex((s) => s.id === activeSec.id);
                      const prevSec = chapter.sections[curIdx - 1];
                      const nextSec = chapter.sections[curIdx + 1];

                      return (
                        <>
                          {prevSec ? (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setActiveSectionId(prevSec.id)}
                              className="text-xs h-8 gap-1.5"
                            >
                              <ArrowLeft className="h-3 w-3" />
                              <span>{prevSec.sectionNumber} {prevSec.title}</span>
                            </Button>
                          ) : <div />}

                          {nextSec ? (
                            <Button
                              size="sm"
                              onClick={() => setActiveSectionId(nextSec.id)}
                              className="text-xs h-8 gap-1.5 bg-primary text-primary-foreground"
                            >
                              <span>{nextSec.sectionNumber} {nextSec.title}</span>
                              <ArrowRight className="h-3 w-3" />
                            </Button>
                          ) : (
                            <Button
                              size="sm"
                              onClick={() => setActiveTab('cheatsheet')}
                              className="text-xs h-8 gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white"
                            >
                              <span>Read Interview Cheat Sheet</span>
                              <CheckCircle2 className="h-3 w-3" />
                            </Button>
                          )}
                        </>
                      );
                    })()}
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      )}

      {/* Tab 2: Interview Revision Cheat Sheet */}
      {activeTab === 'cheatsheet' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {cheatSheetData ? (
            <>
              {/* 1. Core Architecture Decisions */}
              <Card>
                <CardHeader className="py-3 px-4 border-b border-border bg-muted/20">
                  <CardTitle className="text-sm font-bold flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-primary" />
                    <span>Core Architecture Decisions & Recommendations</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 divide-y divide-border">
                  {cheatSheetData.coreDecisions.map((dec, i) => (
                    <div key={i} className="py-3 first:pt-0 last:pb-0 space-y-1 text-xs">
                      <span className="font-bold text-foreground text-sm block">{dec.decision}</span>
                      <p className="text-primary font-medium">👉 Recommendation: {dec.recommendation}</p>
                      <p className="text-muted-foreground">⚖️ Trade-off: {dec.tradeOff}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* 2. Don't Say vs Say This */}
              <Card>
                <CardHeader className="py-3 px-4 border-b border-border bg-muted/20">
                  <CardTitle className="text-sm font-bold flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-amber-500" />
                    <span>Don't Say vs Say This (Interview Phrasing Guide)</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 space-y-3">
                  {cheatSheetData.interviewPhrasing.map((item, i) => (
                    <div key={i} className="p-3.5 rounded-xl border border-border bg-card space-y-2 text-xs">
                      <div className="flex items-start gap-2">
                        <span className="text-destructive font-bold shrink-0">❌ Don't Say:</span>
                        <span className="text-muted-foreground italic">"{item.dontSay}"</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-emerald-500 font-bold shrink-0">✅ Say This:</span>
                        <span className="text-foreground font-medium">"{item.sayThis}"</span>
                      </div>
                      <p className="text-[11px] text-primary/80 font-mono pt-1">
                        Why: {item.why}
                      </p>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* 3. Trade-off Comparison Matrix */}
              <Card>
                <CardHeader className="py-3 px-4 border-b border-border bg-muted/20">
                  <CardTitle className="text-sm font-bold flex items-center gap-2">
                    <Layers className="h-4 w-4 text-primary" />
                    <span>Trade-Off Decision Matrix</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs text-left">
                      <thead>
                        <tr className="border-b border-border text-muted-foreground font-mono">
                          <th className="pb-2 font-semibold">Architectural Dimension</th>
                          <th className="pb-2 font-semibold">Option A</th>
                          <th className="pb-2 font-semibold">Option B</th>
                          <th className="pb-2 font-semibold">Senior/Staff Verdict</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {cheatSheetData.tradeOffMatrix.map((m, i) => (
                          <tr key={i} className="hover:bg-muted/30">
                            <td className="py-2.5 font-bold text-foreground">{m.feature}</td>
                            <td className="py-2.5 text-muted-foreground">{m.optionA}</td>
                            <td className="py-2.5 text-muted-foreground">{m.optionB}</td>
                            <td className="py-2.5 text-primary font-medium">{m.verdict}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>

              {/* 4. Top Interview Questions */}
              <Card>
                <CardHeader className="py-3 px-4 border-b border-border bg-muted/20">
                  <CardTitle className="text-sm font-bold flex items-center gap-2">
                    <HelpCircle className="h-4 w-4 text-emerald-500" />
                    <span>Top Google / Microsoft Interview Questions from Chapter {chapter.chapterNumber}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 space-y-4">
                  {cheatSheetData.topInterviewQuestions.map((q, i) => (
                    <div key={i} className="p-4 rounded-xl border border-border bg-muted/20 space-y-2 text-xs">
                      <p className="font-bold text-foreground text-sm">{q.question}</p>
                      <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                        {q.idealAnswerOutline.map((point, pIdx) => (
                          <li key={pIdx}>{point}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </>
          ) : (
            <div className="p-8 text-center text-muted-foreground text-xs font-mono">
              Cheat sheet is being compiled for this chapter.
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Concept Deep Dives */}
      {activeTab === 'concepts' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {chapter.sections
              .flatMap((s) => s.concepts)
              .map((cpt) => (
                <Card key={cpt.id} className="border-border hover:border-primary/40 transition-colors flex flex-col justify-between">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base font-bold text-foreground">
                      {cpt.name}
                    </CardTitle>
                    <p className="text-xs text-muted-foreground mt-1">{cpt.summary}</p>
                  </CardHeader>
                  <CardContent className="pt-0 space-y-3 text-xs">
                    <div>
                      <span className="font-semibold text-primary block text-[11px] font-mono uppercase">
                        Why It Matters
                      </span>
                      <p className="text-muted-foreground">{cpt.whyItMatters}</p>
                    </div>

                    <div className="flex flex-wrap gap-1 pt-1 border-t border-border">
                      {cpt.technologies.map((t, i) => (
                        <Badge key={i} variant="secondary" className="text-[10px] font-mono">
                          {t}
                        </Badge>
                      ))}
                    </div>

                    <Link
                      href={`/system-design/${cpt.slug}`}
                      className="block text-center py-2 px-3 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary font-semibold text-xs transition-colors"
                    >
                      Open 9-Step Active Lesson & Simulation →
                    </Link>
                  </CardContent>
                </Card>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
