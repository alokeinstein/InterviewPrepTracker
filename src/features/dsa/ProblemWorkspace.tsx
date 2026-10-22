'use client';

import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { FormattedProblemStatement } from '@/components/dsa/FormattedProblemStatement';
import { CodeEditorPanel } from '@/components/dsa/CodeEditorPanel';
import { ProblemTimer } from '@/components/dsa/ProblemTimer';
import { ProblemSolvedBadge } from '@/components/dsa/ProblemSolvedBadge';
import { ProblemNotesTab } from '@/components/dsa/ProblemNotesTab';
import { ProblemSubmissionsTab } from '@/components/dsa/ProblemSubmissionsTab';
import { ProblemCheckpointsModal } from '@/components/dsa/ProblemCheckpointsModal';
import { ExecutionConsole } from '@/components/dsa/ExecutionConsole';
import { localStore, ProblemSolveStatus } from '@/lib/storage/indexedDb';
import {
  Play,
  Send,
  HelpCircle,
  AlertTriangle,
  CheckCircle2,
  Bookmark,
  Sparkles,
  BookOpen,
  Lock,
  Unlock,
  Eye,
  RotateCcw,
  Code2,
  PenTool,
  Brain,
  FileText,
  ListOrdered,
  Maximize2,
  Minimize2,
  GripVertical,
  Check,
} from 'lucide-react';

interface TestCaseItem {
  input: string;
  expectedOutput: string;
  isHidden: boolean;
  explanation?: string;
  tier?: string;
  scaleN?: number;
}

interface ProblemWorkspaceProps {
  problem: {
    id: string;
    leetcodeId: number | null;
    title: string;
    slug: string;
    level: number;
    difficulty: string;
    topic: string;
    subtopic: string | null;
    estimatedTimeMin: number;
    statement: string;
    executionModel?: string;
    functionName?: string;
    parameterDefinitions?: any;
    returnType?: string;
    constraints: string[];
    examples: any;
    starterTemplates: any;
    optimalSolution: string | null;
    optimalTimeComplexity: string | null;
    optimalSpaceComplexity: string | null;
    suboptimalSolution?: string | null;
    suboptimalTimeComplexity?: string | null;
    suboptimalSpaceComplexity?: string | null;
    optimalRuntimeMs?: number;
    maxAllowedRuntimeMs?: number;
    hints: string[];
    detailedHints?: any;
    testCases: TestCaseItem[];
  };
  serverSolveInfo?: {
    isSolved: boolean;
    lastSolvedAt: string | null;
    durationSec: number | null;
  };
}

export function ProblemWorkspace({ problem, serverSolveInfo }: ProblemWorkspaceProps) {
  // Tabs for Left Panel: 'description' | 'notes' | 'submissions'
  const [leftTab, setLeftTab] = useState<'description' | 'notes' | 'submissions'>('description');

  // Split Panes Resizing State
  const [splitRatio, setSplitRatio] = useState<number>(45); // % of left panel
  const [consoleHeight, setConsoleHeight] = useState<number>(240); // px of bottom console
  const [isDraggingV, setIsDraggingV] = useState(false);
  const [isDraggingH, setIsDraggingH] = useState(false);
  const isDraggingVRef = useRef(false);
  const isDraggingHRef = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const rightPanelRef = useRef<HTMLDivElement>(null);

  // Solved Status & Timer
  const [solveStatus, setSolveStatus] = useState<ProblemSolveStatus | null>(null);
  const timerDurationRef = useRef<number>(0);
  const handleDurationChange = useCallback((sec: number) => {
    timerDurationRef.current = sec;
  }, []);

  // Language & Code
  const [language, setLanguage] = useState<'javascript' | 'typescript' | 'python'>('javascript');

  const getStarterCode = useCallback(
    (lang: string) => {
      if (problem.starterTemplates && (problem.starterTemplates as any)[lang]) {
        return (problem.starterTemplates as any)[lang];
      }
      const fn = problem.functionName || 'solve';
      if (lang === 'python') {
        return `class Solution:\n    def ${fn}(self, *args):\n        # Write optimal solution for ${problem.title}\n        pass\n`;
      }
      if (lang === 'typescript') {
        return `function ${fn}(...args: any[]): any {\n  // Write optimal solution for ${problem.title}\n  throw new Error("Not implemented");\n}\n`;
      }
      return `function ${fn}(...args) {\n  // Write optimal solution for ${problem.title}\n}\n`;
    },
    [problem]
  );

  const [code, setCode] = useState<string>(getStarterCode('javascript'));
  const [isDraftLoaded, setIsDraftLoaded] = useState(false);

  // Execution & Testing
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [executionResult, setExecutionResult] = useState<any>(null);
  const [selectedTestCaseIndex, setSelectedTestCaseIndex] = useState(0);
  const [isConsoleCollapsed, setIsConsoleCollapsed] = useState(false);

  // Checkpoints Modal
  const [showCheckpointsModal, setShowCheckpointsModal] = useState(false);

  // Progressive Hints
  const [unlockedStages, setUnlockedStages] = useState<number[]>([1]);
  const [expandedStages, setExpandedStages] = useState<number[]>([1]);
  const [showHintModal, setShowHintModal] = useState(false);
  const [showSolutionConfirmModal, setShowSolutionConfirmModal] = useState(false);

  // Multi-Modal Practice Tracking
  const [isLoggingPractice, setIsLoggingPractice] = useState(false);
  const [practiceSuccessMsg, setPracticeSuccessMsg] = useState<string | null>(null);

  // Load Saved Split Dimensions & Solved Status from IndexedDB on mount
  useEffect(() => {
    localStore.getPreference<number>('workspace_split_ratio', 45).then((ratio) => {
      if (ratio >= 20 && ratio <= 80) setSplitRatio(ratio);
    });

    localStore.getPreference<number>('workspace_console_height', 240).then((height) => {
      if (height >= 110 && height <= 800) setConsoleHeight(height);
    });

    localStore.getSolveStatus(problem.id).then((status) => {
      if (status) {
        setSolveStatus(status);
      }
    });
  }, [problem.id]);

  // Load Code Draft for current language
  useEffect(() => {
    let mounted = true;
    localStore.loadDraft(problem.id, language).then((saved) => {
      if (mounted) {
        if (saved !== null && saved.trim().length > 0) {
          setCode(saved);
        } else {
          setCode(getStarterCode(language));
        }
        setIsDraftLoaded(true);
      }
    });
    return () => {
      mounted = false;
    };
  }, [problem.id, language, getStarterCode]);

  // Autosave Draft with debounce
  const draftDebounceRef = useRef<NodeJS.Timeout | null>(null);
  const handleCodeChange = (newCode: string) => {
    setCode(newCode);
    if (!isDraftLoaded) return;

    if (draftDebounceRef.current) clearTimeout(draftDebounceRef.current);
    draftDebounceRef.current = setTimeout(() => {
      localStore.saveDraft(problem.id, language, newCode);
    }, 600);
  };

  // --- Vertical Splitter Dragging (Pointer Events + Pointer Capture) ---
  const handlePointerDownV = (e: React.PointerEvent<HTMLDivElement>) => {
    e.preventDefault();
    isDraggingVRef.current = true;
    setIsDraggingV(true);
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {}
    document.body.style.userSelect = 'none';
    document.body.style.cursor = 'col-resize';
  };

  const handlePointerMoveV = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingVRef.current || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const newRatio = (offsetX / rect.width) * 100;

    // Minimum 280px left and right bounds, 20% to 80% range
    const minPercent = Math.max(20, (280 / rect.width) * 100);
    const maxPercent = Math.min(80, ((rect.width - 280) / rect.width) * 100);

    if (newRatio >= minPercent && newRatio <= maxPercent) {
      setSplitRatio(newRatio);
    }
  };

  const handlePointerUpV = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isDraggingVRef.current) {
      isDraggingVRef.current = false;
      setIsDraggingV(false);
      try {
        e.currentTarget.releasePointerCapture(e.pointerId);
      } catch {}
      document.body.style.userSelect = '';
      document.body.style.cursor = '';
      localStore.setPreference('workspace_split_ratio', splitRatio);
    }
  };

  const handleDoubleClickV = () => {
    setSplitRatio(45);
    localStore.setPreference('workspace_split_ratio', 45);
  };

  const handleKeyDownV = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      setSplitRatio((prev) => {
        const next = Math.max(20, prev - 2);
        localStore.setPreference('workspace_split_ratio', next);
        return next;
      });
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      setSplitRatio((prev) => {
        const next = Math.min(80, prev + 2);
        localStore.setPreference('workspace_split_ratio', next);
        return next;
      });
    } else if (e.key === 'Home') {
      e.preventDefault();
      setSplitRatio(25);
      localStore.setPreference('workspace_split_ratio', 25);
    } else if (e.key === 'End') {
      e.preventDefault();
      setSplitRatio(75);
      localStore.setPreference('workspace_split_ratio', 75);
    }
  };

  // --- Horizontal Splitter Dragging (Monaco vs Execution Console) ---
  const handlePointerDownH = (e: React.PointerEvent<HTMLDivElement>) => {
    e.preventDefault();
    isDraggingHRef.current = true;
    setIsDraggingH(true);
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {}
    document.body.style.userSelect = 'none';
    document.body.style.cursor = 'row-resize';
  };

  const handlePointerMoveH = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingHRef.current || !rightPanelRef.current) return;
    const rect = rightPanelRef.current.getBoundingClientRect();
    const newHeight = rect.bottom - e.clientY;

    // Minimum console height 110px, minimum editor height 140px
    const minH = 110;
    const maxH = Math.max(minH, rect.height - 140);

    if (newHeight >= minH && newHeight <= maxH) {
      setConsoleHeight(newHeight);
    }
  };

  const handlePointerUpH = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isDraggingHRef.current) {
      isDraggingHRef.current = false;
      setIsDraggingH(false);
      try {
        e.currentTarget.releasePointerCapture(e.pointerId);
      } catch {}
      document.body.style.userSelect = '';
      document.body.style.cursor = '';
      localStore.setPreference('workspace_console_height', consoleHeight);
    }
  };

  const handleDoubleClickH = () => {
    setConsoleHeight(240);
    localStore.setPreference('workspace_console_height', 240);
  };

  const handleKeyDownH = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      setConsoleHeight((prev) => {
        const next = Math.min(600, prev + 20);
        localStore.setPreference('workspace_console_height', next);
        return next;
      });
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setConsoleHeight((prev) => {
        const next = Math.max(110, prev - 20);
        localStore.setPreference('workspace_console_height', next);
        return next;
      });
    }
  };

  // Execute Code (Run Tests vs Submit)
  const handleExecute = async (isSubmission: boolean = false) => {
    if (isSubmission) {
      setIsSubmitting(true);
    } else {
      setIsRunning(true);
    }
    setExecutionResult(null);

    try {
      const res = await fetch('/api/execute-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          problemId: problem.id,
          code,
          language,
          isSubmission,
          hintCountUsed: unlockedStages.length,
        }),
      });

      const data = await res.json();
      setExecutionResult(data);

      if (isSubmission && data.status === 'ACCEPTED') {
        // Record accepted snapshot with solve duration
        const solveDuration = timerDurationRef.current > 0 ? timerDurationRef.current : 180;
        await localStore.saveAcceptedSnapshot({
          problemId: problem.id,
          language,
          code,
          runtimeMs: data.runtimeMs || 0,
          memoryKb: data.memoryKb || 0,
          optimalityScore: data.optimalityScore || 100,
          solveDurationSec: solveDuration,
        });

        // Record problem solve status
        const updatedStatus = await localStore.recordSolve(problem.id, solveDuration, {
          problemTitle: problem.title,
          difficulty: problem.difficulty,
          level: problem.level,
          method: 'IDE',
        });
        setSolveStatus(updatedStatus);

        // Also log practice to server revision schedule
        await fetch('/api/revision/log-practice', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            problemId: problem.id,
            mode: 'CODE',
            struggled: unlockedStages.includes(5),
            durationSec: solveDuration,
            qualityScore: unlockedStages.includes(5) ? 3 : 5,
            optimalityScore: data.optimalityScore || 100,
          }),
        });

        setPracticeSuccessMsg('Accepted! Solve duration archived & revision cadence updated.');
        setTimeout(() => setPracticeSuccessMsg(null), 5000);
      }
    } catch (err: any) {
      setExecutionResult({
        status: 'RUNTIME_ERROR',
        runtimeMs: 0,
        memoryKb: 0,
        testCasesPassed: 0,
        totalTestCases: 1,
        logs: [err.message || 'Execution failed'],
      });
    } finally {
      setIsRunning(false);
      setIsSubmitting(false);
    }
  };

  // Multi-Modal Practice Logger (By Hand / In Mind)
  const handleLogManualPractice = async (mode: 'HAND' | 'MENTAL') => {
    setIsLoggingPractice(true);
    const durationSec = mode === 'HAND' ? 180 : 90;
    try {
      const res = await fetch('/api/revision/log-practice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          problemId: problem.id,
          mode,
          struggled: unlockedStages.includes(5),
          durationSec,
          qualityScore: unlockedStages.includes(5) ? 3 : 4,
          optimalityScore: 100,
        }),
      });

      const data = await res.json();
      if (data.success) {
        const updatedStatus = await localStore.recordSolve(problem.id, durationSec, {
          problemTitle: problem.title,
          difficulty: problem.difficulty,
          level: problem.level,
          method: mode,
        });
        setSolveStatus(updatedStatus);

        const modeNames = { HAND: 'By Hand / Pseudocode', MENTAL: 'In-Mind Recall' };
        setPracticeSuccessMsg(`Logged ${modeNames[mode]} practice! Next review in ${data.result.cadence.intervalDays}d.`);
        setTimeout(() => setPracticeSuccessMsg(null), 5000);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoggingPractice(false);
    }
  };

  // Progressive Hints Definition
  const progressiveHints = useMemo(() => {
    const rawHints = problem.hints || [];
    const fnName = problem.functionName || 'solve';
    const optTime = problem.optimalTimeComplexity || 'O(N)';
    const optSpace = problem.optimalSpaceComplexity || 'O(1)';

    return {
      stage1: rawHints[0] || `Focus on structural invariants for "${problem.title}". Identify whether the state transition is monotonic, frequency-based, or greedy.`,
      stage2: rawHints[1] || `Data Structure & State: Consider whether a Hash Map, Monotonic Queue, Min-Heap, or auxiliary pointers eliminate redundant rescans.`,
      stage3: rawHints[2] || `Algorithmic Invariant: Maintain a clean pointer loop condition or dynamic programming state transition.`,
      stage4: `Edge Cases: Verify empty inputs, single element, negative values, boundary constraints. Space target: ${optSpace}.`,
      stage5: {
        walkthrough: `Maintain optimal ${optTime} time complexity and ${optSpace} auxiliary space. Avoid duplicate iterations.`,
        referenceCode: problem.optimalSolution || `// Optimal ${optTime} Solution\nfunction ${fnName}(...args) {\n  // Implementation\n}`,
      },
    };
  }, [problem]);

  const unlockNextHint = (stage: number) => {
    if (stage === 5) {
      setShowSolutionConfirmModal(true);
      return;
    }
    setUnlockedStages((prev) => Array.from(new Set([...prev, stage])));
    setExpandedStages((prev) => Array.from(new Set([...prev, stage])));
  };

  const confirmRevealFullSolution = () => {
    setUnlockedStages((prev) => Array.from(new Set([...prev, 5])));
    setExpandedStages((prev) => Array.from(new Set([...prev, 5])));
    setShowSolutionConfirmModal(false);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-5rem)] min-h-[640px] space-y-3">
      {/* Top Problem Header & Navigation Bar */}
      <div className="flex items-center justify-between flex-wrap gap-3 px-4 py-2.5 rounded-xl border border-border/70 bg-card/60 backdrop-blur-md shadow-sm shrink-0">
        <div className="flex items-center gap-3 flex-wrap">
          <Badge variant="outline" className="font-mono text-xs">
            Level {problem.level}
          </Badge>
          <Badge
            variant={
              problem.difficulty === 'EASY'
                ? 'success'
                : problem.difficulty === 'MEDIUM'
                ? 'warning'
                : 'destructive'
            }
            className="text-xs font-semibold"
          >
            {problem.difficulty}
          </Badge>
          <h1 className="text-base font-bold text-foreground tracking-tight">
            {problem.leetcodeId ? `${problem.leetcodeId}. ` : ''}
            {problem.title}
          </h1>
          <Badge variant="secondary" className="text-[11px] font-normal text-muted-foreground hidden md:inline-flex">
            {problem.topic}
          </Badge>
        </div>

        {/* Right Header: Solved Status Badge & Active Stopwatch Timer */}
        <div className="flex items-center gap-3 flex-wrap">
          <ProblemSolvedBadge
            status={solveStatus}
            serverSolved={serverSolveInfo?.isSolved}
            serverLastSolvedAt={serverSolveInfo?.lastSolvedAt}
            serverSolveDurationSec={serverSolveInfo?.durationSec}
          />

          <ProblemTimer
            onDurationChange={handleDurationChange}
            autoStart={true}
          />

          {/* Hints Trigger Button */}
          <Button
            variant="outline"
            size="sm"
            className="h-8 gap-1.5 text-xs text-amber-500 border-amber-500/30 hover:bg-amber-500/10"
            onClick={() => setShowHintModal(true)}
          >
            <HelpCircle className="h-3.5 w-3.5" />
            <span>Hints ({unlockedStages.length}/5)</span>
          </Button>
        </div>
      </div>

      {/* Success Notification Banner */}
      {practiceSuccessMsg && (
        <div className="px-4 py-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center justify-between shrink-0">
          <span className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4" />
            {practiceSuccessMsg}
          </span>
          <button
            type="button"
            onClick={() => setPracticeSuccessMsg(null)}
            className="text-emerald-400 hover:text-emerald-300 font-bold"
          >
            ✕
          </button>
        </div>
      )}

      {/* Split-Pane Main Body */}
      <div
        ref={containerRef}
        className="flex-1 flex overflow-hidden rounded-xl border border-border/80 bg-background/50 shadow-sm relative"
      >
        {/* Left Panel: Description, Notes, Submissions */}
        <div
          style={{ width: `${splitRatio}%` }}
          className="flex flex-col h-full border-r border-border/60 bg-card/30 overflow-hidden shrink-0"
        >
          {/* Left Panel Tabs Header */}
          <div className="h-10 px-4 border-b border-border/60 flex items-center justify-between bg-muted/20 shrink-0">
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setLeftTab('description')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors flex items-center gap-1.5 ${
                  leftTab === 'description'
                    ? 'bg-background text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <BookOpen className="h-3.5 w-3.5" />
                <span>Description</span>
              </button>
              <button
                type="button"
                onClick={() => setLeftTab('notes')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors flex items-center gap-1.5 ${
                  leftTab === 'notes'
                    ? 'bg-background text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <FileText className="h-3.5 w-3.5" />
                <span>Notes</span>
              </button>
              <button
                type="button"
                onClick={() => setLeftTab('submissions')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors flex items-center gap-1.5 ${
                  leftTab === 'submissions'
                    ? 'bg-background text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <ListOrdered className="h-3.5 w-3.5" />
                <span>Submissions</span>
              </button>
            </div>

            {/* Reset Split button */}
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 text-muted-foreground hover:text-foreground"
              title="Reset 50/50 Split"
              onClick={() => {
                setSplitRatio(50);
                localStore.setPreference('workspace_split_ratio', 50);
              }}
            >
              <RotateCcw className="h-3 w-3" />
            </Button>
          </div>

          {/* Left Panel Content with Independent Scroll */}
          <div className="flex-1 p-5 overflow-y-auto">
            {leftTab === 'description' ? (
              <FormattedProblemStatement
                title={problem.title}
                leetcodeId={problem.leetcodeId}
                difficulty={problem.difficulty}
                statement={problem.statement}
                examples={problem.examples}
                constraints={problem.constraints}
                topic={problem.topic}
                hintsCount={unlockedStages.length}
                onOpenHints={() => setShowHintModal(true)}
              />
            ) : leftTab === 'notes' ? (
              <ProblemNotesTab
                problemId={problem.id}
                problemTitle={problem.title}
              />
            ) : (
              <ProblemSubmissionsTab
                problemId={problem.id}
                onRestoreCode={(restoredCode) => {
                  setCode(restoredCode);
                  localStore.saveDraft(problem.id, language, restoredCode);
                }}
              />
            )}
          </div>

          {/* Practice Modes Quick Action Footer */}
          <div className="p-3 border-t border-border/60 bg-muted/20 flex items-center justify-between text-xs shrink-0">
            <span className="text-muted-foreground font-medium flex items-center gap-1">
              <Brain className="h-3.5 w-3.5 text-primary" /> Alternate Modes:
            </span>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="h-7 text-xs"
                disabled={isLoggingPractice}
                onClick={() => handleLogManualPractice('HAND')}
              >
                <PenTool className="h-3 w-3 mr-1 text-emerald-400" />
                Solved By Hand
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="h-7 text-xs"
                disabled={isLoggingPractice}
                onClick={() => handleLogManualPractice('MENTAL')}
              >
                <Brain className="h-3 w-3 mr-1 text-amber-400" />
                Solved In Mind
              </Button>
            </div>
          </div>
        </div>

        {/* Vertical Draggable Split Divider */}
        <div
          role="separator"
          aria-orientation="vertical"
          aria-valuenow={Math.round(splitRatio)}
          tabIndex={0}
          onPointerDown={handlePointerDownV}
          onPointerMove={handlePointerMoveV}
          onPointerUp={handlePointerUpV}
          onDoubleClick={handleDoubleClickV}
          onKeyDown={handleKeyDownV}
          className={`w-1.5 relative cursor-col-resize transition-colors flex items-center justify-center shrink-0 group z-20 select-none ${
            isDraggingV ? 'bg-primary' : 'bg-border/60 hover:bg-primary/80'
          }`}
          title="Drag to resize problem and editor panes (Double-click to reset 45/55)"
        >
          {/* Extended Hit Area */}
          <div className="absolute -left-2 -right-2 inset-y-0" />
          <div className="w-0.5 h-10 rounded-full bg-muted-foreground/30 group-hover:bg-primary-foreground/70 transition-colors" />
        </div>

        {/* Right Panel: Code Editor, Action Buttons, Execution Console */}
        <div
          ref={rightPanelRef}
          style={{ width: `${100 - splitRatio}%` }}
          className="flex flex-col h-full bg-card/20 overflow-hidden relative"
        >
          {/* Editor Header Toolbar */}
          <div className="h-10 px-4 border-b border-border/60 flex items-center justify-between bg-muted/20 shrink-0">
            {/* Language Selector & Checkpoints */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-semibold">
                <Code2 className="h-3.5 w-3.5 text-emerald-400" />
                <span className="text-foreground">Code</span>
              </div>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as any)}
                className="px-2.5 py-1 rounded bg-background border border-border/80 text-xs font-mono text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="javascript">JavaScript (Node.js)</option>
                <option value="typescript">TypeScript</option>
                <option value="python">Python 3</option>
              </select>

              <Button
                variant="ghost"
                size="sm"
                className="h-7 text-xs text-muted-foreground hover:text-foreground"
                onClick={() => setShowCheckpointsModal(true)}
              >
                <Bookmark className="h-3 w-3 mr-1" />
                Checkpoints
              </Button>
            </div>

            {/* Run Tests & Submit Action Buttons */}
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="h-7 text-xs"
                disabled={isRunning || isSubmitting}
                onClick={() => handleExecute(false)}
                title="Run approximately 3-4 visible quick tests (Ctrl+Enter)"
              >
                <Play className="h-3 w-3 mr-1 fill-current" />
                {isRunning ? 'Running...' : 'Run Tests'}
              </Button>

              <Button
                variant="default"
                size="sm"
                className="h-7 text-xs bg-emerald-600 hover:bg-emerald-500 text-white font-semibold shadow-sm"
                disabled={isRunning || isSubmitting}
                onClick={() => handleExecute(true)}
                title="Run complete test suite including hidden tests (Ctrl+Shift+Enter)"
              >
                <Send className="h-3 w-3 mr-1" />
                {isSubmitting ? 'Submitting...' : 'Submit'}
              </Button>
            </div>
          </div>

          {/* Monaco Editor Container */}
          <div className="flex-1 overflow-hidden min-h-[140px]">
            <CodeEditorPanel
              code={code}
              onChange={handleCodeChange}
              language={language}
              onRun={() => handleExecute(false)}
              onSubmit={() => handleExecute(true)}
            />
          </div>

          {/* Horizontal Draggable Splitter Divider */}
          <div
            role="separator"
            aria-orientation="horizontal"
            aria-valuenow={consoleHeight}
            tabIndex={0}
            onPointerDown={handlePointerDownH}
            onPointerMove={handlePointerMoveH}
            onPointerUp={handlePointerUpH}
            onDoubleClick={handleDoubleClickH}
            onKeyDown={handleKeyDownH}
            className={`h-1.5 relative cursor-row-resize transition-colors flex items-center justify-center shrink-0 group z-10 select-none ${
              isDraggingH ? 'bg-primary' : 'bg-border/60 hover:bg-primary/80'
            }`}
            title="Drag to resize editor and console (Double-click to reset 240px)"
          >
            {/* Extended Hit Area */}
            <div className="absolute -top-2 -bottom-2 inset-x-0" />
            <div className="h-0.5 w-10 rounded-full bg-muted-foreground/30 group-hover:bg-primary-foreground/70 transition-colors" />
          </div>

          {/* Bottom Execution Console */}
          <div
            style={{ height: isConsoleCollapsed ? '40px' : `${consoleHeight}px` }}
            className="flex flex-col shrink-0 overflow-hidden border-t border-border/70 bg-card/40 backdrop-blur transition-[height] duration-75"
          >
            <ExecutionConsole
              testCases={problem.testCases || []}
              executionResult={executionResult}
              isRunning={isRunning || isSubmitting}
              selectedCaseIndex={selectedTestCaseIndex}
              onSelectCaseIndex={setSelectedTestCaseIndex}
              isCollapsed={isConsoleCollapsed}
              onToggleCollapse={() => setIsConsoleCollapsed(!isConsoleCollapsed)}
            />
          </div>
        </div>
      </div>

      {/* Checkpoints Modal */}
      <ProblemCheckpointsModal
        isOpen={showCheckpointsModal}
        onClose={() => setShowCheckpointsModal(false)}
        problemId={problem.id}
        language={language}
        currentCode={code}
        onRestoreCheckpoint={(restored) => {
          setCode(restored);
          localStore.saveDraft(problem.id, language, restored);
        }}
      />

      {/* 5-Stage Progressive Hints Modal */}
      <Modal
        isOpen={showHintModal}
        onClose={() => setShowHintModal(false)}
        title={`Progressive Hints — ${problem.title}`}
        description="Reveal hints one stage at a time to maintain independent recall integrity."
      >
        <div className="space-y-4">
          {/* Hint 1 */}
          <div className="p-3 rounded-lg border border-border/80 bg-card/60 space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-xs text-primary flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5" /> Stage 1: Invariants & Pattern
              </span>
              <Badge variant="outline" className="text-[10px]">Free</Badge>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {progressiveHints.stage1}
            </p>
          </div>

          {/* Hint 2 */}
          <div className="p-3 rounded-lg border border-border/80 bg-card/60 space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-xs text-foreground flex items-center gap-1.5">
                {unlockedStages.includes(2) ? <Unlock className="h-3.5 w-3.5 text-emerald-400" /> : <Lock className="h-3.5 w-3.5 text-muted-foreground" />}
                Stage 2: Data Structure & State
              </span>
              {!unlockedStages.includes(2) && (
                <Button size="sm" variant="ghost" className="h-6 text-xs" onClick={() => unlockNextHint(2)}>
                  Unlock Hint 2
                </Button>
              )}
            </div>
            {unlockedStages.includes(2) && (
              <p className="text-xs text-muted-foreground leading-relaxed pt-1">
                {progressiveHints.stage2}
              </p>
            )}
          </div>

          {/* Hint 3 */}
          <div className="p-3 rounded-lg border border-border/80 bg-card/60 space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-xs text-foreground flex items-center gap-1.5">
                {unlockedStages.includes(3) ? <Unlock className="h-3.5 w-3.5 text-emerald-400" /> : <Lock className="h-3.5 w-3.5 text-muted-foreground" />}
                Stage 3: Algorithmic Approach
              </span>
              {!unlockedStages.includes(3) && (
                <Button size="sm" variant="ghost" className="h-6 text-xs" onClick={() => unlockNextHint(3)}>
                  Unlock Hint 3
                </Button>
              )}
            </div>
            {unlockedStages.includes(3) && (
              <p className="text-xs text-muted-foreground leading-relaxed pt-1">
                {progressiveHints.stage3}
              </p>
            )}
          </div>

          {/* Hint 4 */}
          <div className="p-3 rounded-lg border border-border/80 bg-card/60 space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-xs text-foreground flex items-center gap-1.5">
                {unlockedStages.includes(4) ? <Unlock className="h-3.5 w-3.5 text-emerald-400" /> : <Lock className="h-3.5 w-3.5 text-muted-foreground" />}
                Stage 4: Edge Cases & Boundaries
              </span>
              {!unlockedStages.includes(4) && (
                <Button size="sm" variant="ghost" className="h-6 text-xs" onClick={() => unlockNextHint(4)}>
                  Unlock Hint 4
                </Button>
              )}
            </div>
            {unlockedStages.includes(4) && (
              <p className="text-xs text-muted-foreground leading-relaxed pt-1">
                {progressiveHints.stage4}
              </p>
            )}
          </div>

          {/* Hint 5: Full Solution */}
          <div className="p-3 rounded-lg border border-amber-500/30 bg-amber-500/5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-xs text-amber-400 flex items-center gap-1.5">
                {unlockedStages.includes(5) ? <Eye className="h-3.5 w-3.5 text-amber-400" /> : <Lock className="h-3.5 w-3.5 text-amber-500" />}
                Stage 5: Reference Solution
              </span>
              {!unlockedStages.includes(5) ? (
                <Button
                  size="sm"
                  variant="outline"
                  className="h-6 text-xs border-amber-500/40 text-amber-400 hover:bg-amber-500/10"
                  onClick={() => unlockNextHint(5)}
                >
                  Reveal Solution (Penalized)
                </Button>
              ) : (
                <Badge variant="warning" className="text-[10px]">Solution Exposed</Badge>
              )}
            </div>
            {unlockedStages.includes(5) && (
              <div className="space-y-2 pt-1">
                <p className="text-xs text-muted-foreground">
                  {progressiveHints.stage5.walkthrough}
                </p>
                <pre className="p-3 rounded bg-black/70 border border-border/60 text-xs font-mono text-emerald-400 overflow-x-auto max-h-[220px]">
                  <code>{progressiveHints.stage5.referenceCode}</code>
                </pre>
              </div>
            )}
          </div>
        </div>
      </Modal>

      {/* Solution Reveal Warning Modal */}
      <Modal
        isOpen={showSolutionConfirmModal}
        onClose={() => setShowSolutionConfirmModal(false)}
        title="Warning: Revealing Reference Solution"
        description="Viewing the reference implementation will mark this revision session as assisted and reset independent recall progress."
      >
        <div className="space-y-4">
          <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300 space-y-1">
            <p className="font-semibold">Adaptive Revision Impact:</p>
            <ul className="list-disc pl-4 space-y-0.5 text-amber-200/90">
              <li>This session will not qualify towards the 5-review Mastery requirement.</li>
              <li>Your next review will be scheduled sooner (1-2 days).</li>
              <li>Your previous successful reviews are safely preserved.</li>
            </ul>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="ghost" size="sm" onClick={() => setShowSolutionConfirmModal(false)}>
              Keep Trying Independently
            </Button>
            <Button
              variant="destructive"
              size="sm"
              className="bg-amber-600 hover:bg-amber-500 text-white"
              onClick={confirmRevealFullSolution}
            >
              Reveal Reference Solution
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
