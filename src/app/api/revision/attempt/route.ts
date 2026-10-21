import { NextRequest, NextResponse } from 'next/server';
import { SpacedRepetitionService } from '@/services/revision/spacedRepetitionService';

export async function POST(req: NextRequest) {
  try {
    const { revisionItemId, qualityScore, durationSec, recalledInvariants } = await req.json();

    if (!revisionItemId || qualityScore === undefined) {
      return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
    }

    const result = await SpacedRepetitionService.recordAttempt(
      revisionItemId,
      qualityScore,
      durationSec || 60,
      recalledInvariants ?? true
    );

    return NextResponse.json({ success: true, result });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
