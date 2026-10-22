import { NextRequest, NextResponse } from 'next/server';
import { CodeExecutionService } from '@/services/execution/codeExecutionService';
import { prisma } from '@/lib/prisma';
import { SubmissionStatus } from '@prisma/client';
import { getRequestAuth } from '@/lib/auth';
import { PracticeService } from '@/services/practice/practiceService';

export async function POST(req: NextRequest) {
  try {
    const auth = await getRequestAuth(req);
    if (!auth) {
      return NextResponse.json(
        { error: 'Authentication required. Please sign in to run code or submit solutions.' },
        { status: 401, headers: { 'Cache-Control': 'private, no-store' } }
      );
    }
    const user = auth.user;

    const {
      problemId,
      code,
      language = 'javascript',
      isSubmission = false,
      customTestCases = null,
      hintCountUsed = 0,
      userConfidenceBefore = null,
    } = await req.json();

    if (!code) {
      return NextResponse.json({ error: 'Code is required' }, { status: 400 });
    }

    // Fetch problem and its test cases
    const problem = await prisma.dsaProblem.findUnique({
      where: { id: problemId },
      include: { testCases: true },
    });

    if (!problem) {
      return NextResponse.json({ error: 'Problem not found' }, { status: 404 });
    }

    let testCasesToRun = [];

    if (customTestCases && Array.isArray(customTestCases) && customTestCases.length > 0) {
      testCasesToRun = customTestCases;
    } else if (isSubmission) {
      // Submissions run against ALL test cases (both public and hidden)
      testCasesToRun = problem.testCases.map((tc) => ({
        input: tc.input,
        expectedOutput: tc.expectedOutput,
        isHidden: tc.isHidden,
      }));
    } else {
      // "Run Code" executes approx 3-4 visible sample and quick tests
      const publicCases = problem.testCases.filter((tc) => !tc.isHidden);
      const sourceCases = publicCases.length > 0 ? publicCases : problem.testCases;
      testCasesToRun = sourceCases.slice(0, 4).map((tc) => ({
        input: tc.input,
        expectedOutput: tc.expectedOutput,
        isHidden: false,
      }));
    }

    if (testCasesToRun.length === 0) {
      testCasesToRun = [{ input: '[]', expectedOutput: '[]', isHidden: false }];
    }

    // Execute in sandbox process with optimality benchmarking
    const result = await CodeExecutionService.executeCode(
      code,
      language,
      testCasesToRun,
      {
        functionName: problem.functionName || 'solve',
        executionModel: problem.executionModel || 'FUNCTION',
        optimalRuntimeMs: (problem as any).optimalRuntimeMs || 45.0,
        maxAllowedRuntimeMs: (problem as any).maxAllowedRuntimeMs || 1000.0,
        optimalTimeComplexity: problem.optimalTimeComplexity || 'O(N)',
      }
    );

    // Hidden Test Case Protection: Never expose hidden test inputs or expected outputs to browser
    if (isSubmission && result.failedTestCase && result.status !== 'ACCEPTED') {
      const failedIdx = result.testCasesPassed;
      const failingDef = testCasesToRun[failedIdx];
      if (failingDef && failingDef.isHidden) {
        result.failedTestCase = {
          input: '[Protected Hidden Test Case]',
          expected: '[Protected Hidden Test Case]',
          actual: 'Solution produced incorrect output or exception on private hidden test case.',
        };
      }
    }

    // Submission Persistence Policy:
    // Only accepted submissions create permanent user-visible submission records.
    // Failed submissions display diagnostics to the user without polluting permanent submission history.
    if (isSubmission && problemId) {
      if (result.status === 'ACCEPTED') {
          await prisma.dsaSubmission.create({
            data: {
              userId: user.id,
              problemId,
              code,
              language,
              status: SubmissionStatus.ACCEPTED,
              runtimeMs: result.runtimeMs,
              memoryKb: result.memoryKb,
              optimalityScore: result.optimalityScore ?? 0.0,
              efficiencyFeedback: result.efficiencyFeedback ?? null,
              testCasesPassed: result.testCasesPassed,
              totalTestCases: result.totalTestCases,
              hintCountUsed,
              failedTestCase: null,
              userConfidenceBefore,
            },
          });
        }

        // Always record attempt and upsert unique daily session
        await PracticeService.recordAttempt({
          userId: user.id,
          problemId,
          attemptType: 'IDE_SUBMISSION',
          method: 'IDE',
          status: result.status,
          runtimeMs: result.runtimeMs,
          durationSec: result.runtimeMs ? Math.round(result.runtimeMs / 1000) : 0,
          optimalityScore: result.optimalityScore ?? undefined,
          code,
          userTimezone: user.timezone,
        });
      }

    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
