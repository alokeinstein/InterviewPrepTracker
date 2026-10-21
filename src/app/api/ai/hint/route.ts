import { NextRequest, NextResponse } from 'next/server';
import { getAIProvider } from '@/services/ai/aiProvider';

export async function POST(req: NextRequest) {
  try {
    const { problemTitle, hintLevel, codeAttempt } = await req.json();

    const ai = getAIProvider();
    const hint = await ai.generateHint(problemTitle || 'DSA Problem', hintLevel || 1, codeAttempt);

    return NextResponse.json({ hint, hintLevel });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
