import { NextRequest, NextResponse } from 'next/server';
import { CodeExecutionService } from '@/services/execution/codeExecutionService';
import { prisma } from '@/lib/prisma';
import { SubmissionStatus } from '@prisma/client';

export async function POST(req: NextRequest) {
  try {
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
      // "Run Code" executes only public sample test cases
      const publicCases = problem.testCases.filter((tc) => !tc.isHidden);
      testCasesToRun = (publicCases.length > 0 ? publicCases : problem.testCases).map((tc) => ({
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

    // Record submission in database if this is a submission attempt
    if (isSubmission && problemId) {
      const user = await prisma.user.findFirst();
      if (user) {
        await prisma.dsaSubmission.create({
          data: {
            userId: user.id,
            problemId,
            code,
            language,
            status: result.status as SubmissionStatus,
            runtimeMs: result.runtimeMs,
            memoryKb: result.memoryKb,
            optimalityScore: result.optimalityScore ?? 0.0,
            efficiencyFeedback: result.efficiencyFeedback ?? null,
            testCasesPassed: result.testCasesPassed,
            totalTestCases: result.totalTestCases,
            hintCountUsed,
            failedTestCase: result.failedTestCase ? JSON.stringify(result.failedTestCase) : null,
            userConfidenceBefore,
          },
        });
      }
    }

    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
