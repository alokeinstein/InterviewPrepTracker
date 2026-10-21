# AI Mentor & Socratic Architecture

## 1. Provider Abstraction (`AIProvider`)
All AI features interact via a unified service interface:
```typescript
export interface AIProvider {
  generateText(prompt: string, options?: AIOptions): Promise<string>;
  generateStructured<T>(prompt: string, schema: ZodSchema<T>): Promise<T>;
  streamChat(messages: ChatMessage[], options?: AIOptions): AsyncIterable<string>;
}
```
Implementations include:
- `GeminiProvider` (Google Gemini API using `@google/genai` or direct REST)
- `OpenAIProvider` (OpenAI / compatible endpoints)
- `LocalMockProvider` (deterministic, rich offline responses for testing and offline development)

## 2. Centralized Prompt Templates
- `SystemDesignSocraticPrompt`: Guides without revealing architecture solutions.
- `DSAMentorPrompt`: Evaluates invariants, hints gradually.
- `InterviewerFeedbackPrompt`: 5-factor scoring rubric.
- `ArchitectureReviewerPrompt`: Identifies single points of failure, bottlenecks, and CAP trade-offs.
