export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface AIOptions {
  temperature?: number;
  maxTokens?: number;
}

export interface AIProvider {
  generateText(prompt: string, options?: AIOptions): Promise<string>;
  generateFeedback(input: {
    context: string;
    userAnswer: string;
    expectedConcepts: string[];
  }): Promise<{
    score: number;
    isCorrect: boolean;
    feedback: string;
    misconceptions: string[];
    nextQuestion: string;
  }>;
  generateHint(problemTitle: string, hintLevel: number, codeAttempt?: string): Promise<string>;
  evaluateInterviewResponse(prompt: string, userResponse: string): Promise<{
    problemSolvingScore: number;
    communicationScore: number;
    complexityScore: number;
    edgeCaseScore: number;
    implementationScore: number;
    overallScore: number;
    critique: string;
    actionableFixes: string[];
  }>;
  reviewArchitecture(canvasState: {
    nodes: any[];
    edges: any[];
    requirements: string;
  }): Promise<{
    scalabilityScore: number;
    spofs: string[];
    bottlenecks: string[];
    recommendations: string[];
    summary: string;
  }>;
}

// Deterministic Socratic Mock Provider for guaranteed offline / local operation
export class MockAIProvider implements AIProvider {
  async generateText(prompt: string): Promise<string> {
    if (prompt.includes('Why?')) {
      return 'The fundamental reason this mechanism exists is to prevent data loss and inconsistency across network partitions without blocking writes to available nodes.';
    }
    return 'Consider how this state transition affects the overall system invariants before proceeding.';
  }

  async generateFeedback(input: {
    context: string;
    userAnswer: string;
    expectedConcepts: string[];
  }): Promise<{
    score: number;
    isCorrect: boolean;
    feedback: string;
    misconceptions: string[];
    nextQuestion: string;
  }> {
    const answerLower = input.userAnswer.toLowerCase();
    const matches = input.expectedConcepts.filter((c) =>
      answerLower.includes(c.toLowerCase())
    );
    const ratio = matches.length / Math.max(input.expectedConcepts.length, 1);

    if (ratio >= 0.5 || answerLower.length > 50) {
      return {
        score: Math.min(Math.round(75 + ratio * 25), 100),
        isCorrect: true,
        feedback:
          'Strong engineering reasoning. You accurately identified the trade-off. Notice how this aligns with the canonical DDIA principle where the replication log must be totally ordered to guarantee replica convergence.',
        misconceptions: [],
        nextQuestion:
          'What happens if a node receives a write with a lower epoch number than its current leader epoch?',
      };
    } else {
      return {
        score: Math.max(Math.round(40 + ratio * 30), 45),
        isCorrect: false,
        feedback:
          'You have the general intuition, but missed a critical constraint. Consider what happens when the network between datacenters experiences a temporary partition while clients continue issuing writes.',
        misconceptions: ['Assuming synchronous acknowledgment without considering network delay variability.'],
        nextQuestion:
          'Can you restate how quorum overlap (w + r > n) protects against stale reads in this scenario?',
      };
    }
  }

  async generateHint(problemTitle: string, hintLevel: number): Promise<string> {
    const hints = [
      `Hint 1 (Subtle intuition): Look at what values you are repeatedly recalculating. Can you store past observations in a fast lookup structure?`,
      `Hint 2 (Pattern recognition): This problem can be mapped directly to the Sliding Window / Two-Pointer pattern by maintaining an invariant window boundary.`,
      `Hint 3 (Data structure): An auxiliary Hash Map or Monotonic Deque will reduce your lookup time from O(N) to O(1).`,
      `Hint 4 (Algorithmic approach): Expand your right boundary until the condition breaks, then shrink the left pointer while updating the maximum valid range.`,
      `Hint 5 (Pseudocode outline):\n1. Initialize left = 0, maxLen = 0, map = {}\n2. For right in range(0, n):\n     update state with nums[right]\n     while state invalid: nums[left] removed, left++\n     maxLen = max(maxLen, right - left + 1)\n3. Return maxLen`,
    ];
    return hints[Math.min(Math.max(hintLevel - 1, 0), hints.length - 1)];
  }

  async evaluateInterviewResponse(
    prompt: string,
    userResponse: string
  ): Promise<{
    problemSolvingScore: number;
    communicationScore: number;
    complexityScore: number;
    edgeCaseScore: number;
    implementationScore: number;
    overallScore: number;
    critique: string;
    actionableFixes: string[];
  }> {
    const wordCount = userResponse.trim().split(/\s+/).length;
    const isDetailed = wordCount > 40;

    return {
      problemSolvingScore: isDetailed ? 8.5 : 6.0,
      communicationScore: isDetailed ? 8.0 : 5.5,
      complexityScore: userResponse.includes('O(') ? 9.0 : 6.5,
      edgeCaseScore: isDetailed ? 7.5 : 5.0,
      implementationScore: isDetailed ? 8.0 : 6.0,
      overallScore: isDetailed ? 8.2 : 5.8,
      critique: isDetailed
        ? 'Well-structured explanation. You articulated the trade-offs clearly and addressed both time and space complexity with appropriate interview precision.'
        : 'Explanation was overly concise. In an interview with Google or Microsoft, structure your answer into: 1) Requirements & assumptions, 2) Core approach, 3) Trade-offs, 4) Edge cases.',
      actionableFixes: [
        'Explicitly state what happens with null, empty, or duplicate inputs before diving into the core algorithm.',
        'Contrast your proposed design with at least one alternative to demonstrate breadth of technical judgment.',
      ],
    };
  }

  async reviewArchitecture(canvasState: {
    nodes: any[];
    edges: any[];
    requirements: string;
  }): Promise<{
    scalabilityScore: number;
    spofs: string[];
    bottlenecks: string[];
    recommendations: string[];
    summary: string;
  }> {
    const hasDB = canvasState.nodes.some((n) => n.type === 'database');
    const hasCache = canvasState.nodes.some((n) => n.type === 'cache');
    const hasLB = canvasState.nodes.some((n) => n.type === 'load_balancer');
    const hasQueue = canvasState.nodes.some((n) => n.type === 'queue');

    const spofs: string[] = [];
    const bottlenecks: string[] = [];
    const recommendations: string[] = [];

    if (!hasLB) {
      spofs.push('Single point of ingress: no load balancer between clients and servers.');
      recommendations.push('Add a redundant Load Balancer cluster (e.g. Nginx or AWS ALB) with DNS failover.');
    }
    if (!hasCache) {
      bottlenecks.push('Database will be overwhelmed by repetitive read queries.');
      recommendations.push('Introduce a distributed Redis/Memcached cache layer with LRU eviction.');
    }
    if (!hasQueue) {
      recommendations.push('Decouple heavy background writes/email notifications with an asynchronous message queue (e.g. Kafka or RabbitMQ).');
    }

    const score = (hasDB ? 3 : 0) + (hasCache ? 2.5 : 1) + (hasLB ? 2.5 : 1) + (hasQueue ? 2 : 0);

    return {
      scalabilityScore: Math.min(score, 10),
      spofs,
      bottlenecks,
      recommendations,
      summary: `Architecture consists of ${canvasState.nodes.length} nodes and ${canvasState.edges.length} connections. ${
        hasCache && hasDB ? 'Strong separation of read-heavy caching and durable storage.' : 'Requires tier decoupling to withstand peak load.'
      }`,
    };
  }
}

// Factory function
export function getAIProvider(): AIProvider {
  // If GEMINI_API_KEY is available in future, can return GeminiProvider
  // Defaults to resilient, fast MockAIProvider
  return new MockAIProvider();
}
