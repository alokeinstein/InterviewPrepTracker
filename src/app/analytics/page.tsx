import React from 'react';
import { prisma } from '@/lib/prisma';
import { MasteryService } from '@/services/learning/masteryService';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { ShieldCheck, AlertTriangle, TrendingUp, Target, CheckCircle2, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export const revalidate = 0;

export default async function AnalyticsPage() {
  const user = await prisma.user.findFirst();
  const userId = user?.id || 'user-default-1';

  const readiness = await MasteryService.getReadinessReport(userId);

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="outline" className="font-mono text-xs">
              EVIDENCE-BASED METRICS
            </Badge>
            <Badge variant="secondary" className="font-mono text-xs">
              No Fake Precision
            </Badge>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
            Interview Readiness & Analytics
          </h1>
          <p className="text-sm text-muted-foreground mt-1 max-w-2xl">
            Calculated from verifiable submission outcomes, active recall retention, Socratic question accuracy,
            and mock interview evaluations.
          </p>
        </div>
      </div>

      {/* Hero Readiness Gauge */}
      <Card className="border-2 border-primary/40 bg-gradient-to-br from-primary/10 via-card to-card p-6 md:p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <span className="text-xs font-mono font-bold uppercase text-primary">
              Composite Readiness Score
            </span>
            <div className="flex items-baseline gap-3">
              <span className="text-5xl font-black font-mono text-foreground">{readiness.overallScore}%</span>
              <Badge variant="success" className="font-mono text-xs">
                Google L5 / MSFT L6 Benchmark
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground max-w-md">
              Target benchmark for Senior Software Engineer interviews is &gt;80% composite readiness with no
              pattern under 50%.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 min-w-[280px]">
            <div className="p-3 rounded-xl bg-background border border-border">
              <p className="text-[10px] text-muted-foreground font-mono">DSA Mastery</p>
              <p className="font-bold text-lg font-mono text-foreground">{readiness.dsaMastery}%</p>
            </div>
            <div className="p-3 rounded-xl bg-background border border-border">
              <p className="text-[10px] text-muted-foreground font-mono">System Design</p>
              <p className="font-bold text-lg font-mono text-foreground">{readiness.systemDesignMastery}%</p>
            </div>
            <div className="p-3 rounded-xl bg-background border border-border">
              <p className="text-[10px] text-muted-foreground font-mono">Retention Index</p>
              <p className="font-bold text-lg font-mono text-foreground">{readiness.retentionScore}%</p>
            </div>
            <div className="p-3 rounded-xl bg-background border border-border">
              <p className="text-[10px] text-muted-foreground font-mono">Mock Rubric</p>
              <p className="font-bold text-lg font-mono text-foreground">{readiness.mockInterviewScore}%</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Weakness Detection & Remediation */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Algorithmic Weaknesses */}
        <Card className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-base text-foreground flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-500" />
              <span>Priority Weakness Areas</span>
            </h3>
            <Badge variant="warning" className="text-[10px] font-mono">Needs Remediation</Badge>
          </div>

          <div className="space-y-3">
            {readiness.weakestPatterns.map((w) => (
              <div key={w.name} className="space-y-1">
                <div className="flex justify-between text-xs font-medium">
                  <span>{w.name}</span>
                  <span className="font-mono text-amber-500">{w.score}% Mastery</span>
                </div>
                <ProgressBar value={w.score} color="warning" />
              </div>
            ))}
          </div>

          <div className="pt-2">
            <Link href="/dsa?level=17">
              <Button variant="outline" size="sm" className="w-full text-xs gap-1.5 border-amber-500/30 text-amber-500 hover:bg-amber-500/10">
                <span>Start Remediation Drill</span>
                <ArrowRight className="h-3 w-3" />
              </Button>
            </Link>
          </div>
        </Card>

        {/* Actionable Recommendations */}
        <Card className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-base text-foreground flex items-center gap-2">
              <Target className="h-4 w-4 text-primary" />
              <span>Actionable Next Steps</span>
            </h3>
            <Badge variant="outline" className="text-[10px] font-mono">AI Curated</Badge>
          </div>

          <div className="space-y-2.5">
            {readiness.actionableRecommendations.map((rec, i) => (
              <div key={i} className="flex gap-2.5 p-3 rounded-lg bg-muted/40 border border-border text-xs leading-relaxed">
                <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                <span className="text-foreground/90">{rec}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
