import { NextRequest, NextResponse } from 'next/server';
import { getAIProvider } from '@/services/ai/aiProvider';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const { designId, versionNumber, nodes, edges, requirements } = await req.json();

    const ai = getAIProvider();
    const review = await ai.reviewArchitecture({
      nodes: nodes || [],
      edges: edges || [],
      requirements: requirements || 'High availability, sub-10ms latency',
    });

    if (designId && versionNumber) {
      await prisma.architectureVersion.upsert({
        where: {
          designId_versionNumber: {
            designId,
            versionNumber,
          },
        },
        update: {
          scalabilityScore: review.scalabilityScore,
          spofsDetected: review.spofs,
          bottleneckNotes: review.bottlenecks.join('; '),
          aiReviewSummary: review.summary,
        },
        create: {
          designId,
          versionNumber,
          title: `Architecture v${versionNumber}`,
          nodes,
          edges,
          scalabilityScore: review.scalabilityScore,
          spofsDetected: review.spofs,
          bottleneckNotes: review.bottlenecks.join('; '),
          aiReviewSummary: review.summary,
        },
      });
    }

    return NextResponse.json(review);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
