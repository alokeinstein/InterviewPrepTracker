import { NextRequest, NextResponse } from 'next/server';
import { getRequestAuth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const auth = await getRequestAuth(req);
    if (!auth) {
      return NextResponse.json(
        { error: 'Authentication required. Sign in to view reference solutions.' },
        {
          status: 401,
          headers: { 'Cache-Control': 'private, no-store, max-age=0' },
        }
      );
    }

    const { slug } = await params;
    const problem = await prisma.dsaProblem.findFirst({
      where: {
        OR: [{ slug }, { id: slug }],
      },
      select: {
        id: true,
        title: true,
        optimalSolution: true,
        optimalTimeComplexity: true,
        optimalSpaceComplexity: true,
        suboptimalSolution: true,
        suboptimalTimeComplexity: true,
        suboptimalSpaceComplexity: true,
      },
    });

    if (!problem) {
      return NextResponse.json({ error: 'Problem not found' }, { status: 404 });
    }

    return NextResponse.json(
      {
        optimalSolution: problem.optimalSolution,
        optimalTimeComplexity: problem.optimalTimeComplexity,
        optimalSpaceComplexity: problem.optimalSpaceComplexity,
        suboptimalSolution: problem.suboptimalSolution,
        suboptimalTimeComplexity: problem.suboptimalTimeComplexity,
        suboptimalSpaceComplexity: problem.suboptimalSpaceComplexity,
      },
      {
        headers: { 'Cache-Control': 'private, no-store, max-age=0' },
      }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Server error' },
      { status: 500 }
    );
  }
}
