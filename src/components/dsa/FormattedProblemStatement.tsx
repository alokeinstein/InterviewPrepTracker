'use client';

import React, { useMemo } from 'react';
import { marked } from 'marked';
import { Tag, HelpCircle } from 'lucide-react';

interface ExampleItem {
  input: string;
  output: string;
  explanation?: string;
}

interface FormattedProblemStatementProps {
  title?: string;
  leetcodeId?: number | null;
  difficulty?: string;
  statement: string;
  examples?: ExampleItem[] | any;
  constraints?: string[];
  topic?: string;
  hintsCount?: number;
  onOpenHints?: () => void;
}

export function FormattedProblemStatement({
  title,
  leetcodeId,
  difficulty,
  statement,
  examples = [],
  constraints = [],
  topic,
  hintsCount,
  onOpenHints,
}: FormattedProblemStatementProps) {
  // Convert statement markdown to safe HTML
  const parsedStatementHtml = useMemo(() => {
    if (!statement) return '';
    try {
      return marked.parse(statement, {
        gfm: true,
        breaks: true,
      }) as string;
    } catch {
      return statement;
    }
  }, [statement]);

  const parsedExamples: ExampleItem[] = useMemo(() => {
    if (!examples) return [];
    if (Array.isArray(examples)) return examples;
    try {
      if (typeof examples === 'string') {
        return JSON.parse(examples);
      }
    } catch {}
    return [];
  }, [examples]);

  return (
    <div className="space-y-5 text-foreground leading-relaxed text-sm">
      {/* Problem Title & Meta Tags Header (matching LeetCode) */}
      {title && (
        <div className="space-y-2.5 pb-2 border-b border-border/30">
          <h1 className="text-xl font-bold tracking-tight text-foreground">
            {leetcodeId ? `${leetcodeId}. ` : ''}
            {title}
          </h1>

          <div className="flex items-center gap-2 flex-wrap">
            {difficulty && (
              <span
                className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
                  difficulty === 'EASY'
                    ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/25'
                    : difficulty === 'MEDIUM'
                    ? 'bg-amber-500/15 text-amber-400 border-amber-500/25'
                    : 'bg-rose-500/15 text-rose-400 border-rose-500/25'
                }`}
              >
                {difficulty.charAt(0) + difficulty.slice(1).toLowerCase()}
              </span>
            )}

            {topic && (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-muted/60 text-muted-foreground border border-border/50 flex items-center gap-1.5">
                <Tag className="h-3 w-3 opacity-70" />
                <span>{topic}</span>
              </span>
            )}

            {onOpenHints && (
              <button
                type="button"
                onClick={onOpenHints}
                className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-500/10 text-amber-400 border border-amber-500/25 hover:bg-amber-500/20 transition-colors flex items-center gap-1.5 cursor-pointer"
                title="View progressive hints"
              >
                <HelpCircle className="h-3 w-3" />
                <span>Hint{hintsCount ? ` (${hintsCount})` : ''}</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Problem Statement Content with LeetCode Typography & Inline Code Pills */}
      <div
        className="dsa-markdown"
        dangerouslySetInnerHTML={{ __html: parsedStatementHtml }}
      />

      {/* Examples Section */}
      {parsedExamples.length > 0 && (
        <div className="space-y-4 pt-1">
          <div className="space-y-3.5">
            {parsedExamples.map((ex, idx) => (
              <div key={idx} className="space-y-2">
                <div className="font-semibold text-xs text-foreground/90 select-none">
                  Example {idx + 1}:
                </div>
                <div className="rounded-lg border border-border/60 bg-muted/20 dark:bg-[#1a1a1a]/70 p-3.5 space-y-2 font-mono text-xs">
                  <div className="flex items-baseline gap-2">
                    <span className="font-sans font-semibold text-foreground/70 min-w-[55px] select-none text-xs">
                      Input:
                    </span>
                    <code className="dsa-code-pill font-mono text-xs">
                      {typeof ex.input === 'object' ? JSON.stringify(ex.input) : String(ex.input)}
                    </code>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="font-sans font-semibold text-foreground/70 min-w-[55px] select-none text-xs">
                      Output:
                    </span>
                    <code className="dsa-code-pill font-mono text-xs text-emerald-400 font-semibold">
                      {typeof ex.output === 'object' ? JSON.stringify(ex.output) : String(ex.output)}
                    </code>
                  </div>
                  {ex.explanation && (
                    <div className="flex items-baseline gap-2 pt-0.5 font-sans text-xs">
                      <span className="font-semibold text-foreground/70 min-w-[55px] select-none">
                        Explanation:
                      </span>
                      <span
                        className="text-muted-foreground leading-relaxed font-sans"
                        dangerouslySetInnerHTML={{
                          __html: marked.parseInline(String(ex.explanation)) as string,
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Constraints Section */}
      {constraints && constraints.length > 0 && (
        <div className="space-y-2 pt-2">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground select-none">
            Constraints:
          </h3>
          <ul className="list-disc pl-5 space-y-1.5 text-xs text-muted-foreground">
            {constraints.map((c, idx) => (
              <li key={idx} className="leading-relaxed">
                <code className="dsa-code-pill font-mono text-xs">
                  {c}
                </code>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
