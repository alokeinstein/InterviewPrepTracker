# Progress, Analytics & Interview Readiness

## 1. Explainable Readiness Score
Rather than an arbitrary percentage, readiness is computed from verifiable evidence:
$$\text{Readiness} = 0.35 \times \text{DSA Mastery} + 0.30 \times \text{System Design Mastery} + 0.15 \times \text{Revision Retention} + 0.20 \times \text{Mock Interview Score}$$

The score breaks down:
- Weakest algorithmic patterns (e.g. Dynamic Programming state transitions at 34%)
- Weakest system design concepts (e.g. Distributed transactions & 2PC at 42%)
- Hint dependency index (ratio of problems solved requiring hints > 2)
- Direct remediation tasks queued into the next session

## 2. Daily Session Generator & Procrastination Recovery
- Time buttons: `[ 10 min ]` `[ 20 min ]` `[ 30 min ]` `[ 45 min ]` `[ 60 min ]`
- "I Have 10 Minutes" Mode: Returns the single highest-yield item (overdue problem, core invariant check, or 60s design pitch).
- Procrastination Recovery: When user has been inactive for $\ge 3$ days, skips overwhelming backlogs and presents an encouraging 7-minute re-entry session.
