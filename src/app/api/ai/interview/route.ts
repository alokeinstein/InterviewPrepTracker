import { NextRequest, NextResponse } from 'next/server';
import { getAIProvider } from '@/services/ai/aiProvider';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const { action, interviewId, message, prompt, userResponse } = await req.json();
    const ai = getAIProvider();

    if (action === 'chat') {
      // Process conversational message in mock interview
      let aiReply = '';
      const msgLower = (message || '').toLowerCase();

      if (msgLower.includes('approach') || msgLower.includes('solve')) {
        aiReply =
          'Good. Before diving into code: What is your time and space complexity target? And how will your solution handle boundary edge cases such as empty input or duplicate elements?';
      } else if (msgLower.includes('o(n)') || msgLower.includes('complexity')) {
        aiReply =
          'That time complexity is optimal for this tier. Now, walk me through the loop invariants: what condition remains true at the end of each iteration?';
      } else if (msgLower.includes('code') || msgLower.includes('implement')) {
        aiReply =
          'Go ahead and begin writing the clean implementation. Keep your helper variables well-named, and remember to structure your functions modularly.';
      } else {
        aiReply =
          'I see your line of reasoning. In an interview with Google or Microsoft, how would you test this assumption under high-throughput production load?';
      }

      if (interviewId) {
        await prisma.interviewMessage.create({
          data: {
            mockInterviewId: interviewId,
            sender: 'USER',
            content: message,
          },
        });
        await prisma.interviewMessage.create({
          data: {
            mockInterviewId: interviewId,
            sender: 'INTERVIEWER',
            content: aiReply,
          },
        });
      }

      return NextResponse.json({ reply: aiReply });
    }

    if (action === 'evaluate') {
      const evaluation = await ai.evaluateInterviewResponse(prompt || '', userResponse || '');

      if (interviewId) {
        await prisma.interviewEvaluation.upsert({
          where: { mockInterviewId: interviewId },
          update: {
            ...evaluation,
            keyStrengths: ['Structured technical articulation', 'Clear complexity analysis'],
            criticalFlaws: evaluation.actionableFixes.slice(0, 1),
            actionableRecommendations: evaluation.actionableFixes,
          },
          create: {
            mockInterviewId: interviewId,
            ...evaluation,
            keyStrengths: ['Structured technical articulation', 'Clear complexity analysis'],
            criticalFlaws: evaluation.actionableFixes.slice(0, 1),
            actionableRecommendations: evaluation.actionableFixes,
          },
        });

        await prisma.mockInterview.update({
          where: { id: interviewId },
          data: {
            status: 'COMPLETED',
            completedAt: new Date(),
          },
        });
      }

      return NextResponse.json(evaluation);
    }

    return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
