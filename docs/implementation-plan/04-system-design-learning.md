# System Design Learning Engine

## 1. 9-Step Active Learning Loop
Every concept in the DDIA Academy follows a mandatory active loop:
1. **Clear Engineering Explanation**: Precise terminology, zero dumbing down.
2. **The "Why?"**: Core architectural problem it solves.
3. **Interactive Visual / Simulator**: Step-by-step diagram or state transition (e.g. Replication log lag, Quorum check $w+r > n$).
4. **Predictive Check Question**: *"What happens if the primary node crashes after acknowledging 1 out of 2 followers in semi-synchronous mode?"*
5. **Socratic AI Feedback**: Evaluates user reasoning, highlights edge conditions, offers guidance.
6. **Deepen & Contrast**: Introduce trade-offs (e.g. statement-based vs WAL vs logical logs).
7. **Production Scenario Drill**: Realistic high-scale problem (e.g. Twitter timeline hybrid approach).
8. **60-Second Interview Explanation**: User explains concept concisely; AI grades clarity, correctness, and structure.
9. **Active Retrieval & Spaced Recall**: Future automated recall prompts.

## 2. Mastery Scoring Model
Mastery is calculated dynamically across 5 dimensions:
$$\text{Mastery} = 0.15 \times \text{Recognition} + 0.25 \times \text{Understanding} + 0.25 \times \text{Recall} + 0.20 \times \text{Application} + 0.15 \times \text{Interview Explanation}$$

A chapter is only marked **Mastered** when all concepts achieve $>80\%$ composite score.
