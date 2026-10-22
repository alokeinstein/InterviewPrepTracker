import { NextRequest, NextResponse } from 'next/server';
import { getAIProvider } from '@/services/ai/aiProvider';
import { MasteryService } from '@/services/learning/masteryService';
import { getRequestAuth } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const { conceptId, userAnswer, expectedConcepts, stepIndex } = await req.json();

    const ai = getAIProvider();
    const feedback = await ai.generateFeedback({
      context: `System Design concept checkpoint`,
      userAnswer: userAnswer || '',
      expectedConcepts: expectedConcepts || ['replication', 'log', 'consistency'],
    });

    // Update user mastery dynamically
    const auth = await getRequestAuth(req);
    const user = auth?.user;
    if (user && conceptId) {
      await MasteryService.updateConceptMastery(user.id, conceptId, {
        understanding: feedback.isCorrect ? 85 : 55,
        application: feedback.isCorrect ? 80 : 50,
      });
    }

    return NextResponse.json(feedback);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
