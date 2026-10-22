import { prisma } from '../src/lib/prisma';
import { getCalendarDateForTimezone, normalizeTimezone } from '../src/lib/timezone';
import { PracticeService } from '../src/services/practice/practiceService';

async function backfill() {
  console.log('=== Starting Practice Sessions & Attempts Backfill ===');

  const users = await prisma.user.findMany();
  console.log(`Found ${users.length} users in database.`);

  for (const user of users) {
    console.log(`\nProcessing user: ${user.name} (${user.id}) - Email: ${user.email}`);

    const safeTimezone = normalizeTimezone(user.timezone || 'UTC');
    const normalizedEmail = user.email.trim().toLowerCase();
    const defaultUsername = (user.name || user.email.split('@')[0] || 'coder')
      .toLowerCase()
      .replace(/[^a-z0-9_]/g, '')
      .slice(0, 30) || 'user';

    // 1. Ensure User normalizedEmail and Profile exist
    let usernameToUse = user.username;
    if (!usernameToUse) {
      // Check if username taken
      const existing = await prisma.user.findFirst({
        where: { normalizedUsername: defaultUsername },
      });
      usernameToUse = existing && existing.id !== user.id ? `${defaultUsername}_${user.id.slice(0, 4)}` : defaultUsername;
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        normalizedEmail,
        username: usernameToUse,
        normalizedUsername: usernameToUse.toLowerCase(),
        timezone: safeTimezone,
      },
    });

    // Ensure Profile exists
    await prisma.profile.upsert({
      where: { userId: user.id },
      create: {
        userId: user.id,
        username: usernameToUse,
        normalizedUsername: usernameToUse.toLowerCase(),
        displayName: user.name,
      },
      update: {
        username: usernameToUse,
        normalizedUsername: usernameToUse.toLowerCase(),
      },
    });

    // 2. Fetch existing submissions
    const submissions = await prisma.dsaSubmission.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'asc' },
    });
    console.log(`- Submissions to process: ${submissions.length}`);

    for (const sub of submissions) {
      const attemptId = `sub_${sub.id}`;
      const existingAttempt = await prisma.practiceAttempt.findUnique({
        where: { id: attemptId },
      });

      if (!existingAttempt) {
        const activityDate = getCalendarDateForTimezone(sub.createdAt, safeTimezone);
        const isSolved = sub.status === 'ACCEPTED';

        // Upsert unique PracticeSession
        const session = await prisma.practiceSession.upsert({
          where: {
            userId_problemId_activityDate: {
              userId: user.id,
              problemId: sub.problemId,
              activityDate,
            },
          },
          create: {
            userId: user.id,
            problemId: sub.problemId,
            activityDate,
            attemptCount: 1,
            lastAttemptAt: sub.createdAt,
            firstAttemptAt: sub.createdAt,
            solved: isSolved,
          },
          update: {
            attemptCount: { increment: 1 },
            lastAttemptAt: sub.createdAt,
            ...(isSolved ? { solved: true } : {}),
          },
        });

        // Create PracticeAttempt record
        await prisma.practiceAttempt.create({
          data: {
            id: attemptId,
            userId: user.id,
            problemId: sub.problemId,
            sessionId: session.id,
            activityDate,
            attemptType: 'IDE_SUBMISSION',
            method: 'IDE',
            status: sub.status,
            runtimeMs: sub.runtimeMs,
            optimalityScore: sub.optimalityScore,
            code: sub.code,
            createdAt: sub.createdAt,
          },
        });
      }
    }

    // 3. Fetch existing revision attempts
    const revisionAttempts = await prisma.revisionAttempt.findMany({
      where: { revisionItem: { userId: user.id } },
      include: { revisionItem: true },
      orderBy: { createdAt: 'asc' },
    });
    console.log(`- Revision attempts to process: ${revisionAttempts.length}`);

    for (const rev of revisionAttempts) {
      const problemId = rev.revisionItem.dsaProblemId;
      if (!problemId) continue;

      const attemptId = `rev_${rev.id}`;
      const existingAttempt = await prisma.practiceAttempt.findUnique({
        where: { id: attemptId },
      });

      if (!existingAttempt) {
        const activityDate = getCalendarDateForTimezone(rev.createdAt, safeTimezone);
        const method = rev.mode === 'CODE' ? 'IDE' : rev.mode === 'HAND' ? 'HAND' : 'MENTAL';
        const isSolved = !rev.struggled;

        const session = await prisma.practiceSession.upsert({
          where: {
            userId_problemId_activityDate: {
              userId: user.id,
              problemId,
              activityDate,
            },
          },
          create: {
            userId: user.id,
            problemId,
            activityDate,
            attemptCount: 1,
            lastAttemptAt: rev.createdAt,
            firstAttemptAt: rev.createdAt,
            solved: isSolved,
          },
          update: {
            attemptCount: { increment: 1 },
            lastAttemptAt: rev.createdAt,
            ...(isSolved ? { solved: true } : {}),
          },
        });

        await prisma.practiceAttempt.create({
          data: {
            id: attemptId,
            userId: user.id,
            problemId,
            sessionId: session.id,
            activityDate,
            attemptType: `REVISION_${rev.mode}`,
            method,
            status: isSolved ? 'ACCEPTED' : 'FAILED',
            durationSec: rev.durationSec || 60,
            notes: rev.notes,
            createdAt: rev.createdAt,
          },
        });
      }
    }

    // 4. Refresh streak
    const streakResult = await PracticeService.refreshUserStreak(user.id, safeTimezone);
    console.log(`- Streak updated: Current = ${streakResult.currentStreak}, Longest = ${streakResult.longestStreak}`);

    // 5. Verification & Reconciliation
    const totalSessions = await prisma.practiceSession.count({ where: { userId: user.id } });
    const totalAttempts = await prisma.practiceAttempt.count({ where: { userId: user.id } });
    const sessionList = await prisma.practiceSession.findMany({
      where: { userId: user.id },
      include: { problem: { select: { title: true } } },
      orderBy: [{ activityDate: 'asc' }, { problem: { title: 'asc' } }],
    });

    console.log(`\nReconciliation Summary for ${user.name}:`);
    console.log(`- Total Practice Attempts stored: ${totalAttempts}`);
    console.log(`- Total Unique Practice Sessions: ${totalSessions}`);
    console.log('Detailed Session Breakdown:');
    sessionList.forEach((s) => {
      console.log(`   Date: ${s.activityDate} | Problem: ${s.problem.title} | Attempts: ${s.attemptCount} | Solved: ${s.solved}`);
    });
  }

  console.log('\n=== Backfill Completed Successfully ===');
}

backfill()
  .catch((err) => {
    console.error('Backfill failed:', err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
