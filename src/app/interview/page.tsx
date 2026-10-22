import React from 'react';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { getServerAuth } from '@/lib/auth';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Bot, Code2, Server, ArrowRight, Award, Clock } from 'lucide-react';
import { redirect } from 'next/navigation';

export const revalidate = 0;

export default async function InterviewHubPage() {
  const auth = await getServerAuth();
  const userId = auth?.user?.id;

  const pastInterviews = userId
    ? await prisma.mockInterview.findMany({
        where: { userId },
        include: { evaluation: true },
        orderBy: { startedAt: 'desc' },
        take: 10,
      })
    : [];

  async function createMockInterview(formData: FormData) {
    'use server';
    const serverAuth = await getServerAuth();
    if (!serverAuth?.user) {
      redirect('/login');
    }
    const currentUserId = serverAuth.user.id;

    const type = formData.get('type') as 'DSA_CODING' | 'SYSTEM_DESIGN';
    const title =
      type === 'DSA_CODING'
        ? 'DSA Mock Interview: Sliding Window & Two Pointers'
        : 'System Design Mock: Distributed URL Shortener & Analytics';

    const session = await prisma.mockInterview.create({
      data: {
        userId: currentUserId,
        interviewType: type,
        title,
        durationMinutes: type === 'DSA_CODING' ? 45 : 60,
      },
    });

    redirect(`/interview/${session.id}`);
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="outline" className="font-mono text-xs">
              MOCK SIMULATOR
            </Badge>
            <Badge variant="secondary" className="font-mono text-xs">
              Google / Microsoft Rubric
            </Badge>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
            Mock Interview Center
          </h1>
          <p className="text-sm text-muted-foreground mt-1 max-w-2xl">
            Simulate real 45-60 minute interview pressure. The Socratic AI evaluates your problem formulation,
            complexity communication, edge case identification, and architectural trade-offs.
          </p>
        </div>
      </div>

      {/* Start Interview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* DSA Coding Interview */}
        <Card className="hover:border-primary/50 transition-all flex flex-col justify-between p-6 bg-card/60">
          <div className="space-y-4">
            <div className="h-12 w-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <Code2 className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <Badge variant="default" className="text-xs font-mono">
                  45 MINS
                </Badge>
                <Badge variant="outline" className="text-xs">
                  Coding & Algorithms
                </Badge>
              </div>
              <h3 className="text-xl font-bold text-foreground mt-2">DSA Technical Interview</h3>
              <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                Test your algorithmic reasoning, verbal clarification, brute force analysis, code
                cleanliness, and edge case rigor under timed pressure.
              </p>
            </div>
          </div>

          <form action={createMockInterview} className="pt-6">
            <input type="hidden" name="type" value="DSA_CODING" />
            <Button type="submit" className="w-full gap-2">
              <span>Start DSA Mock Interview</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </form>
        </Card>

        {/* System Design Interview */}
        <Card className="hover:border-primary/50 transition-all flex flex-col justify-between p-6 bg-card/60">
          <div className="space-y-4">
            <div className="h-12 w-12 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
              <Server className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <Badge variant="warning" className="text-xs font-mono">
                  60 MINS
                </Badge>
                <Badge variant="outline" className="text-xs">
                  Distributed Architecture
                </Badge>
              </div>
              <h3 className="text-xl font-bold text-foreground mt-2">System Design Interview</h3>
              <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                Scope scale, specify APIs and data schemas, draw high-level architecture, select storage
                engines (B-Tree vs LSM), and analyze replication and consensus.
              </p>
            </div>
          </div>

          <form action={createMockInterview} className="pt-6">
            <input type="hidden" name="type" value="SYSTEM_DESIGN" />
            <Button type="submit" variant="secondary" className="w-full gap-2">
              <span>Start System Design Mock</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </form>
        </Card>
      </div>

      {/* Past Mock Interviews */}
      {pastInterviews.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-foreground">Past Interview History</h2>
          <div className="space-y-2">
            {pastInterviews.map((iv) => (
              <Link
                key={iv.id}
                href={`/interview/${iv.id}`}
                className="flex items-center justify-between p-4 rounded-xl border border-border bg-card/40 hover:bg-muted/40 transition-colors"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-muted-foreground uppercase">
                      {iv.interviewType.replace(/_/g, ' ')}
                    </span>
                    <Badge variant={iv.status === 'COMPLETED' ? 'success' : 'outline'} className="text-[10px]">
                      {iv.status}
                    </Badge>
                  </div>
                  <h4 className="font-semibold text-sm text-foreground mt-1">{iv.title}</h4>
                </div>

                <div className="flex items-center gap-3">
                  {iv.evaluation && (
                    <Badge variant="success" className="font-mono text-xs">
                      Score: {iv.evaluation.overallScore}/10
                    </Badge>
                  )}
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
