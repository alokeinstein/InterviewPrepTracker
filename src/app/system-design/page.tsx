import React from 'react';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { getServerAuth } from '@/lib/auth';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { BookOpen, FileText, ArrowRight, CheckCircle2 } from 'lucide-react';

export const revalidate = 0;

export default async function SystemDesignPage() {
  const auth = await getServerAuth();
  const user = auth?.user;

  const parts = await prisma.bookPart.findMany({
    orderBy: { partNumber: 'asc' },
    include: {
      chapters: {
        orderBy: { chapterNumber: 'asc' },
        include: {
          sections: {
            include: {
              progress: user
                ? {
                    where: { userId: user.id, isCompleted: true },
                    select: { isCompleted: true },
                  }
                : false,
            },
          },
          concepts: {
            select: { id: true, name: true, slug: true, sourceRef: true },
          },
        },
      },
    },
  });

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-12">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <Badge variant="outline" className="font-mono text-xs">
              CANONICAL DDIA FOUNDATION
            </Badge>
            <Badge variant="secondary" className="font-mono text-xs">
              Martin Kleppmann
            </Badge>
            <Badge variant="default" className="font-mono text-xs bg-emerald-600">
              NCERT / Physics Wallah Study Mode Active
            </Badge>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
            System Design Academy
          </h1>
          <p className="text-sm text-muted-foreground mt-1 max-w-3xl leading-relaxed">
            Master distributed systems from first principles. Complete chapter-by-chapter reading
            with plain-English breakdowns, everyday analogies, staff-level interview cheat sheets,
            and active recall quizzes.
          </p>
        </div>
      </div>

      {/* Parts & Chapters List */}
      <div className="space-y-10">
        {parts.map((part) => (
          <div key={part.id} className="space-y-4">
            <div className="flex items-center gap-2">
              <Badge variant="default" className="text-xs font-mono">
                PART {part.partNumber}
              </Badge>
              <h2 className="text-xl font-bold tracking-tight text-foreground">{part.title}</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {part.chapters.map((chapter) => {
                const totalSections = chapter.sections.length;
                const completedSections = chapter.sections.filter(
                  (s: any) => s.progress?.[0]?.isCompleted
                ).length;
                const isChapterFullyDone = totalSections > 0 && completedSections === totalSections;

                return (
                  <Card
                    key={chapter.id}
                    className="hover:border-primary/50 transition-all flex flex-col justify-between"
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-mono text-muted-foreground font-semibold">
                          Chapter {chapter.chapterNumber} • {chapter.sourcePages}
                        </span>
                        <div className="flex items-center gap-1.5">
                          {isChapterFullyDone && (
                            <Badge variant="default" className="bg-emerald-600 text-[10px] font-mono gap-1">
                              <CheckCircle2 className="h-3 w-3" /> Done
                            </Badge>
                          )}
                          <Badge variant="outline" className="text-[10px] font-mono">
                            {completedSections}/{totalSections} Sections
                          </Badge>
                        </div>
                      </div>

                      <CardTitle className="text-base font-bold text-foreground mt-1">
                        {chapter.title}
                      </CardTitle>
                      <CardDescription className="text-xs line-clamp-2 mt-1 leading-relaxed">
                        {chapter.summary}
                      </CardDescription>
                    </CardHeader>

                    <CardContent className="pt-0 space-y-3">
                      {/* Interactive Chapter Reader CTA */}
                      <Link
                        href={`/system-design/chapter/${chapter.chapterNumber}`}
                        className="flex items-center justify-between p-3 rounded-xl bg-primary/10 hover:bg-primary/20 text-primary transition-all font-semibold text-xs group"
                      >
                        <div className="flex items-center gap-2">
                          <BookOpen className="h-4 w-4" />
                          <span>Study Chapter (Interactive Reader)</span>
                        </div>
                        <ArrowRight className="h-3.5 w-3.5 transform group-hover:translate-x-1 transition-transform" />
                      </Link>

                      {/* Concepts in this chapter */}
                      <div className="space-y-1.5 pt-1">
                        <p className="text-[11px] font-mono font-semibold uppercase text-muted-foreground">
                          Core Concepts ({chapter.concepts.length}):
                        </p>
                        <div className="space-y-1">
                          {chapter.concepts.slice(0, 3).map((concept) => (
                            <Link
                              key={concept.id}
                              href={`/system-design/${concept.slug}`}
                              className="flex items-center justify-between p-2 rounded-lg bg-muted/40 hover:bg-primary/10 hover:text-primary transition-colors text-xs font-medium group"
                            >
                              <span className="truncate">{concept.name}</span>
                              <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </Link>
                          ))}
                          {chapter.concepts.length > 3 && (
                            <Link
                              href={`/system-design/chapter/${chapter.chapterNumber}`}
                              className="block text-center text-[11px] font-mono text-muted-foreground hover:text-foreground py-1"
                            >
                              + {chapter.concepts.length - 3} more concepts in Chapter Reader →
                            </Link>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
