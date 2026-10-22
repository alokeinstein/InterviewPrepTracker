'use client';

import React, { useState } from 'react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import {
  CheckCircle2,
  XCircle,
  Clock,
  Gauge,
  ChevronDown,
  ChevronUp,
  Terminal,
  Zap,
  CheckSquare,
} from 'lucide-react';

interface TestCase {
  input: string;
  expectedOutput: string;
  isHidden?: boolean;
}

interface ExecutionConsoleProps {
  testCases: TestCase[];
  executionResult: any;
  isRunning: boolean;
  selectedCaseIndex: number;
  onSelectCaseIndex: (index: number) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export function ExecutionConsole({
  testCases,
  executionResult,
  isRunning,
  selectedCaseIndex,
  onSelectCaseIndex,
  isCollapsed,
  onToggleCollapse,
}: ExecutionConsoleProps) {
  const [activeTab, setActiveTab] = useState<'testcase' | 'result'>('testcase');

  // Filter visible/quick cases (first 3-4)
  const visibleCases = testCases.filter((tc) => !tc.isHidden).slice(0, 4);
  const currentCase = visibleCases[selectedCaseIndex] || visibleCases[0];

  // Auto switch to result tab when execution finishes
  React.useEffect(() => {
    if (executionResult) {
      setActiveTab('result');
    }
  }, [executionResult]);

  return (
    <div className="w-full h-full flex flex-col overflow-hidden bg-card/30">
      {/* Header Tabs */}
      <div className="h-10 px-4 border-b border-border/70 flex items-center justify-between bg-muted/20 shrink-0 select-none">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('testcase')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors flex items-center gap-1.5 ${
              activeTab === 'testcase'
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <CheckSquare className="h-3.5 w-3.5 text-emerald-400" />
            <span>Testcase ({visibleCases.length})</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('result')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors flex items-center gap-1.5 ${
              activeTab === 'result'
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Terminal className="h-3.5 w-3.5 text-primary" />
            <span>Test Result</span>
            {executionResult && (
              <span
                className={`h-2 w-2 rounded-full ${
                  executionResult.status === 'ACCEPTED' ? 'bg-emerald-500' : 'bg-rose-500'
                }`}
              />
            )}
          </button>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 text-muted-foreground hover:text-foreground"
            onClick={onToggleCollapse}
            title={isCollapsed ? 'Expand Console' : 'Collapse Console'}
          >
            {isCollapsed ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {/* Content Area */}
      {!isCollapsed && (
        <div className="flex-1 p-4 font-mono text-xs overflow-y-auto">
          {isRunning ? (
            <div className="flex items-center justify-center h-full min-h-[120px] gap-2.5 text-muted-foreground">
              <Clock className="h-4 w-4 animate-spin text-primary" />
              <span>Running code in protected execution sandbox...</span>
            </div>
          ) : activeTab === 'testcase' ? (
            <div className="space-y-3">
              {/* Case selector pills */}
              <div className="flex items-center gap-1.5 pb-1">
                {visibleCases.map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => onSelectCaseIndex(idx)}
                    className={`px-2.5 py-1 rounded text-xs transition-colors ${
                      selectedCaseIndex === idx
                        ? 'bg-primary text-primary-foreground font-semibold shadow-sm'
                        : 'bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground'
                    }`}
                  >
                    Case {idx + 1}
                  </button>
                ))}
              </div>

              {currentCase && (
                <div className="space-y-2 pt-1">
                  <div>
                    <span className="text-[11px] text-muted-foreground block mb-1 font-sans">Input:</span>
                    <pre className="p-2.5 rounded bg-background/80 border border-border/60 text-foreground overflow-x-auto">
                      <code>{currentCase.input}</code>
                    </pre>
                  </div>
                  <div>
                    <span className="text-[11px] text-muted-foreground block mb-1 font-sans">
                      Expected Output:
                    </span>
                    <pre className="p-2.5 rounded bg-background/80 border border-border/60 text-emerald-400 overflow-x-auto">
                      <code>{currentCase.expectedOutput}</code>
                    </pre>
                  </div>
                </div>
              )}
            </div>
          ) : executionResult ? (
            <div className="space-y-3">
              {/* Verdict header */}
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  {executionResult.status === 'ACCEPTED' ? (
                    <Badge variant="success" className="text-xs gap-1 font-semibold">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                      Accepted
                    </Badge>
                  ) : (
                    <Badge variant="destructive" className="text-xs gap-1 font-semibold">
                      <XCircle className="h-3.5 w-3.5 text-rose-400" />
                      {executionResult.status.replace(/_/g, ' ')}
                    </Badge>
                  )}
                  <span className="text-xs text-muted-foreground font-sans">
                    {executionResult.testCasesPassed} / {executionResult.totalTestCases} test cases passed
                  </span>
                </div>

                <div className="flex items-center gap-3 text-xs">
                  <span>Runtime: <strong>{executionResult.runtimeMs}ms</strong></span>
                  <span>Memory: <strong>{executionResult.memoryKb} KB</strong></span>
                  {executionResult.optimalityScore !== undefined && (
                    <span className="text-primary font-bold">
                      {executionResult.optimalityScore}% Optimal
                    </span>
                  )}
                </div>
              </div>

              {/* Feedback if any */}
              {executionResult.efficiencyFeedback && (
                <div className="p-2.5 rounded bg-primary/10 border border-primary/20 text-xs font-sans text-primary">
                  {executionResult.efficiencyFeedback}
                </div>
              )}

              {/* Failed testcase details if wrong answer */}
              {executionResult.failedTestCase && (
                <div className="p-3 rounded bg-rose-500/10 border border-rose-500/20 space-y-1.5 text-xs">
                  <span className="font-semibold text-rose-400 block font-sans">
                    First Failing Test Case:
                  </span>
                  <div>
                    <span className="text-muted-foreground font-sans">Input: </span>
                    <code className="text-foreground">{executionResult.failedTestCase.input}</code>
                  </div>
                  <div>
                    <span className="text-muted-foreground font-sans">Expected: </span>
                    <code className="text-emerald-400">{executionResult.failedTestCase.expected}</code>
                  </div>
                  <div>
                    <span className="text-muted-foreground font-sans">Actual Output: </span>
                    <code className="text-rose-400">{executionResult.failedTestCase.actual}</code>
                  </div>
                </div>
              )}

              {/* Stdout logs */}
              {executionResult.logs && executionResult.logs.length > 0 && (
                <div>
                  <span className="text-[11px] text-muted-foreground block mb-1 font-sans">Standard Output:</span>
                  <pre className="p-2 rounded bg-black/60 border border-border/50 text-[11px] text-muted-foreground overflow-x-auto">
                    {executionResult.logs.join('\n')}
                  </pre>
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full min-h-[140px] text-muted-foreground/60 select-none">
              <Terminal className="h-7 w-7 mb-2 opacity-30" />
              <p className="text-sm font-sans">You must run your code first</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
