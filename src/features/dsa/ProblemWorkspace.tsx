'use client';

import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Modal } from '@/components/ui/Modal';
import {
  Play,
  Send,
  HelpCircle,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  CheckSquare,
  Clock,
  Sparkles,
  BookOpen,
  Lock,
  Unlock,
  Eye,
  Gauge,
  Zap,
  ChevronDown,
  ChevronRight,
  Code2,
  PenTool,
  Brain,
  RotateCcw,
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
}

const THINKING_STEPS = [
  '1. Restate problem & clarify constraints',
  '2. Handcraft 2 tiny varied examples',
  '3. Identify what state is changing',
  '4. Formulate brute force approach',
  '5. Calculate brute force complexity',
  '6. Identify computational bottleneck',
  '7. Match optimal pattern',
  '8. Select supporting data structure',
  '9. Formulate optimal algorithm',
  '10. Dry run edge cases (empty/duplicates)',
  '11. Explicitly state loop invariant',
  '12. Write clean, modular code',
  '13. Run tests & verify outputs',
  '14. Explain approach in under 60s',
  '15. Reflect & log mistake if failed',
];

export function ProblemWorkspace({ problem }: ProblemWorkspaceProps) {
  const [language, setLanguage] = useState<'javascript' | 'typescript' | 'python'>('javascript');

  const getStarterCode = (lang: string) => {
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
  };

  const [code, setCode] = useState(getStarterCode('javascript'));
  const [selectedTestCaseIndex, setSelectedTestCaseIndex] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [executionResult, setExecutionResult] = useState<any>(null);
  
  // 5-Stage Progressive Hint Engine States
  const [unlockedStages, setUnlockedStages] = useState<number[]>([1]);
  const [expandedStages, setExpandedStages] = useState<number[]>([1]);
  const [showHint5Modal, setShowHint5Modal] = useState(false);
  const [solutionRefLang, setSolutionRefLang] = useState<'javascript' | 'python' | 'cpp'>('javascript');

  // Workflow & Mistake Modal
  const [showWorkflow, setShowWorkflow] = useState(false);
  const [completedWorkflowSteps, setCompletedWorkflowSteps] = useState<number[]>([]);
  const [showMistakeModal, setShowMistakeModal] = useState(false);
  const [confidenceBefore, setConfidenceBefore] = useState<number>(3);
  const [mistakeCategory, setMistakeCategory] = useState('Invariant Violation');
  const [violatedInvariant, setViolatedInvariant] = useState('');
  const [correctiveAction, setCorrectiveAction] = useState('');
  const [isSavingMistake, setIsSavingMistake] = useState(false);
  const [mistakeSaved, setMistakeSaved] = useState(false);

  // Multi-Modal Practice Tracking
  const [isLoggingPractice, setIsLoggingPractice] = useState(false);
  const [struggledPractice, setStruggledPractice] = useState(false);
  const [practiceSuccessMsg, setPracticeSuccessMsg] = useState<string | null>(null);
  const [solutionTab, setSolutionTab] = useState<'optimal' | 'suboptimal'>('optimal');

  const logPracticeMode = async (mode: 'CODE' | 'HAND' | 'MENTAL') => {
    setIsLoggingPractice(true);
    try {
      const res = await fetch('/api/revision/log-practice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          problemId: problem.id,
          mode,
          struggled: struggledPractice || unlockedStages.includes(5),
          durationSec: mode === 'CODE' ? 300 : mode === 'HAND' ? 180 : 60,
          qualityScore: (struggledPractice || unlockedStages.includes(5)) ? 2 : 4,
          optimalityScore: executionResult?.optimalityScore || 100,
        }),
      });
      const data = await res.json();
      if (data.success && data.result) {
        const cad = data.result.cadence;
        const modeNames = { CODE: 'IDE Code Solve', HAND: 'Dry-Run / Hand Solve', MENTAL: 'In-Mind Recall' };
        setPracticeSuccessMsg(`Recorded ${modeNames[mode]}! Next review: in ${cad.intervalDays}d (${cad.recommendedMode})`);
        setTimeout(() => setPracticeSuccessMsg(null), 5000);
      }
    } catch (err) {
      console.error('Failed to log practice:', err);
    } finally {
      setIsLoggingPractice(false);
    }
  };

  // Generate 5-stage progressive hints structure
  const progressiveHints = useMemo(() => {
    const rawHints = problem.hints || [];
    const fnName = problem.functionName || 'solve';
    const optTime = problem.optimalTimeComplexity || 'O(N)';
    const optSpace = problem.optimalSpaceComplexity || 'O(1)';

    return {
      stage1: rawHints[0] || `Observe the structural invariant for "${problem.title}": Focus on identifying the monotonic property, frequency signature, or state transition of the ${problem.topic} pattern without jumping straight into brute-force loops.`,
      stage2: rawHints[1] || `Data Structure & State: Consider whether a Hash Map, Monotonic Deque, Min-Heap, or auxiliary pointers will allow immediate O(1) state transitions rather than repeated full-array rescans.`,
      stage3: rawHints[2] || `Algorithmic Approach: Maintain the primary loop invariant. For example, if using Two Pointers or Sliding Window, define precisely when the left pointer contracts and when the right pointer expands.`,
      stage4: `Edge-Case Caveats: Test against empty collections, single-element arrays, all-duplicate inputs, and maximum integer boundary conditions. Ensure space remains bounded by ${optSpace}.`,
      stage5: {
        pseudocode: `// Algorithmic Pseudocode for ${problem.title}\nfunction ${fnName}(input_parameters):\n    if input is boundary/empty:\n        return default_edge_result\n    \n    initialize_optimal_state_tracker()\n    for element in input:\n        update_invariants_in_O(1)\n        if condition_satisfied:\n            capture_result_or_contract()\n            \n    return final_result // Target: ${optTime}`,
        walkthrough: `1. Clarify the boundary condition to avoid indexing exceptions.\n2. Leverage the ${problem.topic} invariant to prune redundant search spaces.\n3. Keep updates strictly within ${optTime} time and ${optSpace} auxiliary space for 100% optimality rating.`,
        implementations: {
          javascript: problem.optimalSolution || `function ${fnName}(...args) {\n  // Optimal ${optTime} Reference Implementation\n  return 0;\n}`,
          python: `class Solution:\n    def ${fnName}(self, *args):\n        # Optimal ${optTime} Reference Implementation\n        pass\n`,
          cpp: `// Optimal ${optTime} C++20 Implementation\nclass Solution {\npublic:\n    // Solution code\n};\n`,
        }
      }
    };
  }, [problem]);

  const toggleWorkflowStep = (idx: number) => {
    if (completedWorkflowSteps.includes(idx)) {
      setCompletedWorkflowSteps(completedWorkflowSteps.filter((i) => i !== idx));
    } else {
      setCompletedWorkflowSteps([...completedWorkflowSteps, idx]);
    }
  };

  const toggleExpandStage = (stage: number) => {
    if (!unlockedStages.includes(stage)) return;
    setExpandedStages(prev =>
      prev.includes(stage) ? prev.filter(s => s !== stage) : [...prev, stage]
    );
  };

  const requestUnlockStage = (stage: number) => {
    if (stage === 5) {
      setShowHint5Modal(true);
      return;
    }
    setUnlockedStages(prev => Array.from(new Set([...prev, stage])));
    setExpandedStages(prev => Array.from(new Set([...prev, stage])));
  };

  const confirmRevealSolution = () => {
    setUnlockedStages(prev => Array.from(new Set([...prev, 5])));
    setExpandedStages(prev => Array.from(new Set([...prev, 5])));
    setShowHint5Modal(false);
  };

  const handleRunCode = async (isSubmission: boolean = false) => {
    setIsRunning(true);
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
          userConfidenceBefore: confidenceBefore,
        }),
      });

      const data = await res.json();
      setExecutionResult(data);

      if (data.status === 'WRONG_ANSWER' || data.status === 'RUNTIME_ERROR') {
        setShowMistakeModal(true);
      }
    } catch (e: any) {
      setExecutionResult({
        status: 'RUNTIME_ERROR',
        runtimeMs: 0,
        memoryKb: 0,
        testCasesPassed: 0,
        totalTestCases: 1,
        logs: [e.message],
      });
    } finally {
      setIsRunning(false);
    }
  };

  const handleSaveMistake = async () => {
    if (!violatedInvariant.trim()) return;
    setIsSavingMistake(true);
    try {
      await fetch('/api/mistakes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          problemId: problem.id,
          category: mistakeCategory,
          violatedInvariant,
          correctiveAction,
        }),
      });
      setMistakeSaved(true);
      setTimeout(() => {
        setShowMistakeModal(false);
        setMistakeSaved(false);
      }, 1500);
    } catch (e) {
      console.error(e);
    } finally {
      setIsSavingMistake(false);
    }
  };

  const HINT_STAGES = [
    { stage: 1, title: 'Hint 1: Problem Invariants & Pattern Identification', content: progressiveHints.stage1 },
    { stage: 2, title: 'Hint 2: Data Structure Selection & State Definition', content: progressiveHints.stage2 },
    { stage: 3, title: 'Hint 3: Algorithmic Approach & Pointer / Recurrence Law', content: progressiveHints.stage3 },
    { stage: 4, title: 'Hint 4: Edge-Case Caveats & Complexity Constraints', content: progressiveHints.stage4 },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Problem Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-5 rounded-xl border border-border bg-card/60 backdrop-blur-md">
        <div>
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
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
              className="text-xs font-mono"
            >
              {problem.difficulty}
            </Badge>
            <Badge variant="secondary" className="text-xs">
              {problem.topic}
            </Badge>
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <Clock className="h-3 w-3" /> ~{problem.estimatedTimeMin} min
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            {problem.leetcodeId ? `${problem.leetcodeId}. ` : ''}
            {problem.title}
          </h1>
        </div>

        {/* Action Triggers */}
        <div className="flex items-center gap-2 flex-wrap">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowWorkflow(!showWorkflow)}
            className="text-xs h-8 gap-1.5"
          >
            <CheckSquare className="h-3.5 w-3.5" />
            <span>15-Step Workflow ({completedWorkflowSteps.length}/15)</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => requestUnlockStage(Math.min(unlockedStages.length + 1, 5))}
            disabled={unlockedStages.length >= 5}
            className="text-xs h-8 gap-1.5 text-amber-500 border-amber-500/30 hover:bg-amber-500/10"
          >
            <HelpCircle className="h-3.5 w-3.5" />
            <span>5-Stage Hints ({unlockedStages.length}/5)</span>
          </Button>
        </div>
      </div>

      {/* Multi-Modal Practice & Revision Bar */}
      <div className="p-3.5 rounded-xl border border-border bg-card/80 backdrop-blur flex flex-col md:flex-row md:items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-bold uppercase text-muted-foreground flex items-center gap-1.5">
            <RotateCcw className="w-3.5 h-3.5 text-primary" />
            <span>Multi-Modal Practice:</span>
          </span>
          {practiceSuccessMsg && (
            <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded flex items-center gap-1 animate-fadeIn">
              <Check className="w-3 h-3" />
              {practiceSuccessMsg}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <label className="flex items-center gap-1 text-xs text-muted-foreground cursor-pointer select-none px-2 py-1 rounded bg-muted/30 border border-border/60">
            <input
              type="checkbox"
              checked={struggledPractice}
              onChange={(e) => setStruggledPractice(e.target.checked)}
              className="w-3.5 h-3.5 rounded border-border text-primary cursor-pointer"
            />
            <span className={struggledPractice ? 'text-rose-400 font-semibold' : ''}>Struggled / Needed Hint</span>
          </label>

          <Button
            size="sm"
            variant="outline"
            disabled={isLoggingPractice}
            onClick={() => logPracticeMode('CODE')}
            className="text-xs h-8 gap-1.5 border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10"
            title="Log Mode 1: Solved in IDE"
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>Solved in IDE</span>
          </Button>

          <Button
            size="sm"
            variant="outline"
            disabled={isLoggingPractice}
            onClick={() => logPracticeMode('HAND')}
            className="text-xs h-8 gap-1.5 border-amber-500/30 text-amber-400 hover:bg-amber-500/10"
            title="Log Mode 2: Solved by Hand / Whiteboard Dry Run"
          >
            <PenTool className="w-3.5 h-3.5" />
            <span>Solved by Hand</span>
          </Button>

          <Button
            size="sm"
            variant="outline"
            disabled={isLoggingPractice}
            onClick={() => logPracticeMode('MENTAL')}
            className="text-xs h-8 gap-1.5 border-purple-500/30 text-purple-400 hover:bg-purple-500/10"
            title="Log Mode 3: Solved in Mind / Pattern Recognition"
          >
            <Brain className="w-3.5 h-3.5" />
            <span>Solved in Mind</span>
          </Button>
        </div>
      </div>

      {/* 15-Step Framework Drawer */}
      {showWorkflow && (
        <Card className="border-primary/20 bg-muted/20 animate-in fade-in">
          <CardHeader className="py-3 border-b border-border">
            <CardTitle className="text-sm font-semibold flex items-center justify-between">
              <span>The 15-Step Interview Problem-Solving Framework</span>
              <span className="text-xs font-mono text-muted-foreground">
                Check off steps as you mentally proceed
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
              {THINKING_STEPS.map((step, idx) => {
                const checked = completedWorkflowSteps.includes(idx);
                return (
                  <button
                    key={idx}
                    onClick={() => toggleWorkflowStep(idx)}
                    className={`flex items-center gap-2 p-2 rounded-lg text-left text-xs transition-colors border ${
                      checked
                        ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-400 font-medium'
                        : 'border-border bg-background/50 hover:bg-muted text-muted-foreground'
                    }`}
                  >
                    <div
                      className={`h-4 w-4 rounded border flex items-center justify-center shrink-0 ${
                        checked ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-border'
                      }`}
                    >
                      {checked && '✓'}
                    </div>
                    <span className="truncate">{step}</span>
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* 5-Stage Progressive Hint Engine Drawer */}
      <div className="bg-card/70 border border-border rounded-xl p-4 space-y-3">
        <div className="flex items-center justify-between border-b border-border pb-2.5">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span className="text-xs font-bold uppercase tracking-wider text-foreground">
              Progressive 5-Stage Hint Engine
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-muted text-muted-foreground">
              {unlockedStages.length}/5 Unlocked
            </span>
          </div>
          <span className="text-xs text-muted-foreground hidden sm:inline">
            Sequential guidance to preserve autonomous problem solving
          </span>
        </div>

        <div className="space-y-2">
          {HINT_STAGES.map(({ stage, title, content }) => {
            const isUnlocked = unlockedStages.includes(stage);
            const isExpanded = expandedStages.includes(stage);

            return (
              <div
                key={stage}
                className={`rounded-lg border text-xs transition-all ${
                  isUnlocked ? 'border-border bg-background/60' : 'border-border/40 bg-muted/10 opacity-75'
                }`}
              >
                <div
                  onClick={() => (isUnlocked ? toggleExpandStage(stage) : requestUnlockStage(stage))}
                  className="w-full px-3.5 py-2.5 flex items-center justify-between cursor-pointer select-none"
                >
                  <div className="flex items-center gap-2">
                    {isUnlocked ? (
                      <Unlock className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    ) : (
                      <Lock className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                    )}
                    <span className={`font-medium ${isUnlocked ? 'text-foreground' : 'text-muted-foreground'}`}>
                      {title}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {isUnlocked ? (
                      isExpanded ? <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" /> : <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />
                    ) : (
                      <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded border border-primary/20 hover:bg-primary/20 transition">
                        Unlock Stage {stage}
                      </span>
                    )}
                  </div>
                </div>

                {isUnlocked && isExpanded && (
                  <div className="px-3.5 pb-3 pt-1 text-muted-foreground leading-relaxed border-t border-border/40 font-mono text-[11px]">
                    {content}
                  </div>
                )}
              </div>
            );
          })}

          {/* Stage 5: Locked Reveal */}
          <div className={`rounded-lg border text-xs transition-all ${
            unlockedStages.includes(5) ? 'border-amber-500/40 bg-amber-500/5' : 'border-border/40 bg-muted/10'
          }`}>
            <div className="px-3.5 py-2.5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                {unlockedStages.includes(5) ? (
                  <Unlock className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                ) : (
                  <Lock className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                )}
                <span className="font-semibold text-amber-500">
                  Hint 5: Full Algorithmic Pseudocode & Optimal Reference Implementation
                </span>
              </div>

              {!unlockedStages.includes(5) && (
                <button
                  onClick={() => setShowHint5Modal(true)}
                  className="text-[11px] bg-amber-600 hover:bg-amber-500 text-white px-2.5 py-1 rounded font-semibold flex items-center gap-1.5 transition shadow"
                >
                  <Eye className="w-3 h-3" /> Reveal Solution
                </button>
              )}
            </div>

            {unlockedStages.includes(5) && (
              <div className="px-4 pb-4 pt-2 border-t border-amber-500/20 space-y-3 font-mono text-xs">
                <div>
                  <span className="text-[10px] uppercase font-bold text-amber-500 block mb-1">
                    Pseudocode
                  </span>
                  <pre className="p-3 bg-background rounded-lg border border-border text-emerald-400 overflow-x-auto text-[11px]">
                    {progressiveHints.stage5.pseudocode}
                  </pre>
                </div>

                <div>
                  <span className="text-[10px] uppercase font-bold text-amber-500 block mb-1">
                    Algorithm Walkthrough
                  </span>
                  <p className="text-muted-foreground text-[11px] leading-relaxed whitespace-pre-line font-sans">
                    {progressiveHints.stage5.walkthrough}
                  </p>
                </div>

                {/* Dual Reference Solutions & Optimality Benchmarking */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between border-b border-border pb-2 flex-wrap gap-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <button
                        type="button"
                        onClick={() => setSolutionTab('optimal')}
                        className={`text-xs px-2.5 py-1 rounded-lg font-bold flex items-center gap-1.5 transition ${
                          solutionTab === 'optimal'
                            ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                            : 'text-muted-foreground hover:text-foreground'
                        }`}
                      >
                        <Zap className="w-3.5 h-3.5" />
                        <span>Optimal Solution (100% Benchmark)</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setSolutionTab('suboptimal')}
                        className={`text-xs px-2.5 py-1 rounded-lg font-bold flex items-center gap-1.5 transition ${
                          solutionTab === 'suboptimal'
                            ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                            : 'text-muted-foreground hover:text-foreground'
                        }`}
                      >
                        <AlertTriangle className="w-3.5 h-3.5" />
                        <span>Sub-Optimal Brute Force (50% Benchmark)</span>
                      </button>
                    </div>

                    {solutionTab === 'optimal' && (
                      <div className="flex gap-1">
                        {(['javascript', 'python', 'cpp'] as const).map((lang) => (
                          <button
                            key={lang}
                            onClick={() => setSolutionRefLang(lang)}
                            className={`px-2 py-0.5 text-[10px] rounded uppercase font-mono ${
                              solutionRefLang === lang
                                ? 'bg-primary text-primary-foreground font-bold'
                                : 'bg-muted text-muted-foreground hover:text-foreground'
                            }`}
                          >
                            {lang}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {solutionTab === 'optimal' ? (
                    <div>
                      <div className="flex items-center justify-between text-[11px] text-muted-foreground mb-1">
                        <span>Target Asymptotic Bound: <strong className="text-emerald-400 font-mono">{problem.optimalTimeComplexity || 'O(N)'}</strong> Time, <strong className="text-emerald-400 font-mono">{problem.optimalSpaceComplexity || 'O(1)'}</strong> Space</span>
                        <span className="text-emerald-400 font-mono font-bold">100% Score</span>
                      </div>
                      <pre className="p-3 bg-background rounded-lg border border-border text-foreground overflow-x-auto text-[11px]">
                        {progressiveHints.stage5.implementations[solutionRefLang]}
                      </pre>
                    </div>
                  ) : (
                    <div>
                      <div className="flex items-center justify-between text-[11px] text-muted-foreground mb-1">
                        <span>Brute Force Complexity: <strong className="text-amber-400 font-mono">{problem.suboptimalTimeComplexity || 'O(N^2)'}</strong> Time, <strong className="text-amber-400 font-mono">{problem.suboptimalSpaceComplexity || 'O(1)'}</strong> Space</span>
                        <span className="text-amber-400 font-mono font-bold">50% Score (Hits TLE on Stress Tests)</span>
                      </div>
                      <pre className="p-3 bg-background rounded-lg border border-border text-amber-300/90 overflow-x-auto text-[11px]">
                        {problem.suboptimalSolution || `// Sub-optimal Brute Force for ${problem.title}\n// Quadratic or un-memoized approach resulting in ${problem.suboptimalTimeComplexity || 'O(N^2)'} runtime.\nfunction solveBruteForce(...args) {\n  // Brute force nested scans\n}`}
                      </pre>
                      <p className="text-[11px] text-muted-foreground font-sans mt-1">
                        Why this is sub-optimal: On input sizes N &ge; 10^4, quadratic iterations exceed 10^8 operations, causing Time Limit Exceeded (TLE) in automated grading engines.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Workspace Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Statement & Invariants (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <Card>
            <CardHeader className="pb-3 border-b border-border">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-primary" />
                <span>Problem Statement</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-4 text-sm leading-relaxed">
              <p className="text-foreground">{problem.statement}</p>

              {/* Examples */}
              <div>
                <h4 className="text-xs font-mono font-semibold uppercase text-muted-foreground mb-2">
                  Examples
                </h4>
                {Array.isArray(problem.examples) &&
                  problem.examples.map((ex: any, i: number) => (
                    <div key={i} className="p-3 rounded-lg bg-muted/40 border border-border text-xs font-mono mb-2">
                      <p className="text-muted-foreground">Input: <span className="text-foreground">{ex.input}</span></p>
                      <p className="text-muted-foreground">Output: <span className="text-primary font-semibold">{ex.output}</span></p>
                      {ex.explanation && <p className="text-muted-foreground/80 mt-1">Explanation: {ex.explanation}</p>}
                    </div>
                  ))}
              </div>

              {/* Constraints */}
              <div>
                <h4 className="text-xs font-mono font-semibold uppercase text-muted-foreground mb-1.5">
                  Constraints & Targets
                </h4>
                <ul className="list-disc list-inside space-y-1 text-xs text-muted-foreground font-mono">
                  {problem.constraints.map((c, i) => (
                    <li key={i}>{c}</li>
                  ))}
                </ul>
              </div>

              {/* Target Complexities */}
              <div className="p-3 rounded-lg bg-primary/5 border border-primary/20 text-xs font-mono flex items-center justify-between">
                <span>Target Time: <strong className="text-primary">{problem.optimalTimeComplexity || 'O(N)'}</strong></span>
                <span>Target Space: <strong className="text-primary">{problem.optimalSpaceComplexity || 'O(1)'}</strong></span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right: Code Editor & Execution Console (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <Card className="flex flex-col">
            {/* Editor Toolbar */}
            <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-muted/30">
              <div className="flex items-center gap-2">
                <select
                  value={language}
                  onChange={(e: any) => {
                    const l = e.target.value as 'javascript' | 'typescript' | 'python';
                    setLanguage(l);
                    setCode(getStarterCode(l));
                  }}
                  className="bg-background border border-border text-xs font-mono rounded px-2 py-1 text-foreground focus:outline-none"
                >
                  <option value="javascript">JavaScript (Node v24)</option>
                  <option value="typescript">TypeScript</option>
                  <option value="python">Python 3</option>
                </select>
                <span className="text-[11px] text-muted-foreground font-mono">Sandbox Protected</span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[11px] text-muted-foreground">Pre-Solve Confidence:</span>
                <select
                  value={confidenceBefore}
                  onChange={(e) => setConfidenceBefore(Number(e.target.value))}
                  className="bg-background border border-border text-xs rounded px-1.5 py-0.5 text-foreground"
                >
                  <option value={1}>1 - Low</option>
                  <option value={3}>3 - Med</option>
                  <option value={5}>5 - High</option>
                </select>
              </div>
            </div>

            {/* Code Textarea Area */}
            <div className="p-0 relative font-mono text-sm bg-background">
              <textarea
                rows={16}
                value={code}
                onChange={(e) => setCode(e.target.value)}
                spellCheck={false}
                className="w-full bg-background p-4 font-mono text-sm text-foreground resize-none focus:outline-none focus:ring-1 focus:ring-primary leading-relaxed"
              />
            </div>

            {/* Multi-Tier Test Cases Viewer */}
            {problem.testCases && problem.testCases.filter(tc => !tc.isHidden).length > 0 && (
              <div className="border-t border-border px-4 py-3 bg-muted/10">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[11px] font-mono font-semibold uppercase text-muted-foreground">Sample Test Cases:</span>
                  <div className="flex items-center gap-1.5">
                    {problem.testCases.filter(tc => !tc.isHidden).map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedTestCaseIndex(idx)}
                        className={`px-2 py-0.5 rounded text-xs font-mono transition-colors ${
                          selectedTestCaseIndex === idx
                            ? 'bg-primary text-primary-foreground font-semibold'
                            : 'bg-muted/50 hover:bg-muted text-muted-foreground'
                        }`}
                      >
                        Case {idx + 1}
                      </button>
                    ))}
                  </div>
                </div>
                {(() => {
                  const publicCases = problem.testCases.filter(tc => !tc.isHidden);
                  const activeTc = publicCases[selectedTestCaseIndex] || publicCases[0];
                  if (!activeTc) return null;
                  return (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono bg-background/60 p-2.5 rounded-lg border border-border">
                      <div>
                        <span className="text-muted-foreground text-[10px] block mb-0.5">Input Arguments:</span>
                        <code className="text-foreground break-all">{activeTc.input}</code>
                      </div>
                      <div>
                        <span className="text-muted-foreground text-[10px] block mb-0.5">Expected Return Value:</span>
                        <code className="text-emerald-500 font-semibold break-all">{activeTc.expectedOutput}</code>
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}

            {/* Editor Footer / Run Controls */}
            <div className="flex items-center justify-between p-4 border-t border-border bg-card">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleRunCode(false)}
                isLoading={isRunning}
                disabled={isRunning}
                className="gap-1.5 text-xs h-9"
              >
                <Play className="h-3.5 w-3.5 fill-current" />
                <span>Run Test Cases</span>
              </Button>

              <Button
                size="sm"
                onClick={() => handleRunCode(true)}
                isLoading={isRunning}
                disabled={isRunning}
                className="gap-1.5 text-xs h-9 bg-emerald-600 hover:bg-emerald-500 text-white"
              >
                <Send className="h-3.5 w-3.5" />
                <span>Submit Solution</span>
              </Button>
            </div>
          </Card>

          {/* Test Execution & LeetCode-Style Optimality Benchmark Console */}
          {executionResult && (
            <Card className="animate-in fade-in border-border overflow-hidden">
              <CardHeader className="py-3 px-4 border-b border-border bg-muted/20">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    {executionResult.status === 'ACCEPTED' ? (
                      <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                    ) : (
                      <XCircle className="h-5 w-5 text-destructive" />
                    )}
                    <span className="font-bold text-xs font-mono uppercase tracking-wide">
                      {executionResult.status.replace(/_/g, ' ')}
                    </span>
                    {executionResult.status === 'ACCEPTED' && (
                      <Badge
                        variant={executionResult.optimalityScore >= 80 ? 'success' : executionResult.optimalityScore >= 50 ? 'warning' : 'destructive'}
                        className="text-[11px] font-mono font-bold px-2 py-0.5"
                      >
                        {executionResult.optimalityScore}% Optimal
                      </Badge>
                    )}
                  </div>

                  <div className="flex items-center gap-3 text-xs font-mono text-muted-foreground">
                    <span>Passed: {executionResult.testCasesPassed}/{executionResult.totalTestCases}</span>
                    <span>Runtime: {executionResult.runtimeMs}ms</span>
                    <span>Memory: {executionResult.memoryKb}KB</span>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="p-4 space-y-3 font-mono text-xs">
                {/* Benchmark Gauge Comparison */}
                {executionResult.status === 'ACCEPTED' && (
                  <div className="p-3 rounded-lg bg-background border border-border space-y-2">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="flex items-center gap-1.5 font-semibold text-foreground">
                        <Gauge className="w-3.5 h-3.5 text-primary" />
                        <span>Runtime Percentile Benchmark:</span>
                      </span>
                      <span className="font-bold text-primary">
                        {executionResult.optimalityScore}% Score
                      </span>
                    </div>

                    {/* Progress Benchmark Bar */}
                    <div className="w-full bg-muted h-2 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-700 ${
                          executionResult.optimalityScore >= 80
                            ? 'bg-emerald-500'
                            : executionResult.optimalityScore >= 50
                            ? 'bg-amber-500'
                            : 'bg-rose-500'
                        }`}
                        style={{ width: `${Math.max(5, executionResult.optimalityScore)}%` }}
                      />
                    </div>

                    <div className="flex justify-between text-[10px] text-muted-foreground">
                      <span>Optimal Target: {executionResult.optimalRuntimeMs || 45}ms</span>
                      <span>Your Code: {executionResult.runtimeMs}ms</span>
                      <span>Max Allowed: {executionResult.maxAllowedRuntimeMs || 1000}ms</span>
                    </div>

                    {/* Dynamic User Feedback */}
                    {executionResult.efficiencyFeedback && (
                      <p className="text-[11px] font-sans text-foreground/90 pt-1 border-t border-border/60">
                        💡 <strong>Engine Feedback:</strong> {executionResult.efficiencyFeedback}
                      </p>
                    )}
                  </div>
                )}

                {/* Failing Test Case Details */}
                {executionResult.failedTestCase ? (
                  <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 space-y-1.5 text-foreground">
                    <p className="font-semibold text-destructive">Failed Test Case Details:</p>
                    <p>Input: {executionResult.failedTestCase.input}</p>
                    <p>Expected: {executionResult.failedTestCase.expected}</p>
                    <p>Actual: {executionResult.failedTestCase.actual}</p>
                  </div>
                ) : executionResult.status === 'ACCEPTED' ? (
                  <p className="text-emerald-500 font-semibold flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" /> All test cases passed within sandbox limits!
                  </p>
                ) : null}

                {/* Execution Logs */}
                {executionResult.logs && executionResult.logs.length > 0 && (
                  <div className="pt-2 border-t border-border">
                    <span className="text-[10px] uppercase font-bold text-muted-foreground block mb-1">Standard Output:</span>
                    <pre className="p-2 bg-background rounded border border-border text-[11px] text-muted-foreground overflow-x-auto">
                      {executionResult.logs.join('\n')}
                    </pre>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Confirmation Modal for Hint 5 */}
      <Modal
        isOpen={showHint5Modal}
        onClose={() => setShowHint5Modal(false)}
        title="Reveal Optimal Solution & Pseudocode"
        description="Explicit confirmation to prevent accidental spoiler."
      >
        <div className="space-y-4">
          <div className="flex items-start gap-3 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-500 text-xs">
            <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
            <p className="leading-relaxed font-sans text-foreground">
              Unlocking Hint 5 reveals the full algorithmic pseudocode, step-by-step invariant walkthrough, and optimal multi-language reference implementations for <strong>{problem.title}</strong>.
            </p>
          </div>
          <div className="flex justify-end gap-2 pt-2 border-t border-border">
            <Button variant="ghost" size="sm" onClick={() => setShowHint5Modal(false)}>
              Keep Working on It
            </Button>
            <Button
              size="sm"
              onClick={confirmRevealSolution}
              className="bg-amber-600 hover:bg-amber-500 text-white"
            >
              Reveal Hint 5
            </Button>
          </div>
        </div>
      </Modal>

      {/* Mistake Logging Modal */}
      <Modal
        isOpen={showMistakeModal}
        onClose={() => setShowMistakeModal(false)}
        title="Record Mistake Invariant Journal"
        description="Transform failed attempts into permanent spaced retrieval triggers."
      >
        <div className="space-y-4">
          <div>
            <label className="text-xs font-medium text-muted-foreground block mb-1">
              Mistake Classification Category
            </label>
            <select
              value={mistakeCategory}
              onChange={(e) => setMistakeCategory(e.target.value)}
              className="w-full rounded-lg border border-border bg-background p-2 text-xs text-foreground"
            >
              <option value="Invariant Violation">Loop / Window Invariant Violation</option>
              <option value="Off-by-One">Off-by-One Boundary Error</option>
              <option value="Missing Edge Case">Missing Edge Case (Null / Duplicate / Negative)</option>
              <option value="State Transition Error">Dynamic Programming State Transition Flaw</option>
              <option value="Time Complexity Bottleneck">Unnecessary Nested Loop / O(N^2) Bottleneck</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-medium text-muted-foreground block mb-1">
              What Invariant or Assumption Broke?
            </label>
            <textarea
              rows={2}
              value={violatedInvariant}
              onChange={(e) => setViolatedInvariant(e.target.value)}
              placeholder="e.g. Forgot that when left pointer advances, the frequency count must be decremented."
              className="w-full rounded-lg border border-border bg-background p-2 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-muted-foreground block mb-1">
              Corrective Invariant Principle
            </label>
            <input
              type="text"
              value={correctiveAction}
              onChange={(e) => setCorrectiveAction(e.target.value)}
              placeholder="e.g. Invariant: window [left, right] must contain at most k distinct characters."
              className="w-full rounded-lg border border-border bg-background p-2 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-border">
            <Button variant="ghost" size="sm" onClick={() => setShowMistakeModal(false)}>
              Skip
            </Button>
            <Button
              size="sm"
              onClick={handleSaveMistake}
              isLoading={isSavingMistake}
              disabled={!violatedInvariant.trim() || isSavingMistake}
            >
              {mistakeSaved ? 'Saved to Spaced Queue!' : 'Record in Mistake Journal'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
