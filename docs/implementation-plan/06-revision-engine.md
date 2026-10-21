# Adaptive Spaced Repetition Revision Engine

## 1. SM-2 Adaptive Algorithm
The revision engine adapts the SuperMemo SM-2 interval algorithm to technical interviewing:

$$EF' = EF + (0.1 - (5 - q) \times (0.08 + (5 - q) \times 0.02))$$

Where $q \in [0, 5]$ is user recall quality:
- 5: Perfect recall without hesitation
- 4: Correct after hesitation / mental recalculation
- 3: Correct with significant effort or minor hint
- 2: Incorrect, but remembered upon seeing answer
- 1: Incorrect, completely blank
- 0: Total blackout

Interval computation:
- $I(1) = 1\text{ day}$
- $I(2) = 3\text{ days}$ (or 6 days if $q=5$)
- $I(n) = I(n-1) \times EF$

## 2. Invariant & Mistake Retrieval
Active recall is forced before showing old solutions:
- What invariant broke in your previous attempt?
- Can you reconstruct the state transition from memory?
- What would break if input contains negative values or duplicates?
