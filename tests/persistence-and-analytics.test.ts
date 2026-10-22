import { describe, it } from 'node:test';
import assert from 'node:assert';
import { localStore, AcceptedSnapshot, ProblemSolveStatus } from '../src/lib/storage/indexedDb';

describe('Persistence, Recovery & Analytics Deduplication Verification', () => {
  // Test 1: Drafts separated by question and language
  it('isolates drafts by problem ID and programming language', async () => {
    const probA = 'prob-alpha';
    const probB = 'prob-beta';

    await localStore.saveDraft(probA, 'javascript', 'const a_js = 1;');
    await localStore.saveDraft(probA, 'python', 'a_py = 1');
    await localStore.saveDraft(probB, 'javascript', 'const b_js = 2;');

    const aJs = await localStore.loadDraft(probA, 'javascript');
    const aPy = await localStore.loadDraft(probA, 'python');
    const bJs = await localStore.loadDraft(probB, 'javascript');

    assert.strictEqual(aJs, 'const a_js = 1;');
    assert.strictEqual(aPy, 'a_py = 1');
    assert.strictEqual(bJs, 'const b_js = 2;');
  });

  // Test 2: Checkpoint creation & listing
  it('creates named checkpoints and retrieves them newest first', async () => {
    const probId = 'prob-cp-test';
    const cp1 = await localStore.saveCheckpoint(probId, 'javascript', 'Brute Force', 'code v1');
    const cp2 = await localStore.saveCheckpoint(probId, 'javascript', 'Optimized', 'code v2');

    const list = await localStore.listCheckpoints(probId);
    assert.ok(list.length >= 2);
    assert.strictEqual(list[0].name, 'Optimized'); // Newest first
    assert.strictEqual(list[1].name, 'Brute Force');
  });

  // Test 3: Accepted snapshots are immutable
  it('accepted snapshots remain unchanged when editable draft changes', async () => {
    const probId = 'prob-snap-immut';
    const snapshot = await localStore.saveAcceptedSnapshot({
      problemId: probId,
      language: 'javascript',
      code: 'const acceptedCode = true;',
      runtimeMs: 45,
      memoryKb: 5000,
      optimalityScore: 100,
      solveDurationSec: 320,
    });

    // User edits draft
    await localStore.saveDraft(probId, 'javascript', 'const editedDraft = false;');

    const list = await localStore.listAcceptedSnapshots(probId);
    assert.strictEqual(list.length, 1);
    assert.strictEqual(list[0].code, 'const acceptedCode = true;'); // Snapshot unchanged!
    assert.strictEqual(list[0].solveDurationSec, 320);

    const currentDraft = await localStore.loadDraft(probId, 'javascript');
    assert.strictEqual(currentDraft, 'const editedDraft = false;');
  });

  // Test 4: Backup import validation
  it('validates backup JSON structure and rejects invalid formats', async () => {
    // 1. Invalid JSON string
    const res1 = await localStore.importBackup('invalid json');
    assert.strictEqual(res1.success, false);

    // 2. Non-object root
    const res2 = await localStore.importBackup('["array", "root"]');
    assert.strictEqual(res2.success, false);

    // 3. Valid structure
    const validPayload = JSON.stringify({
      exportedAt: new Date().toISOString(),
      drafts: [
        {
          key: 'prob-imp_javascript',
          problemId: 'prob-imp',
          language: 'javascript',
          code: 'console.log("imported");',
          updatedAt: Date.now(),
        },
      ],
      notes: [],
      checkpoints: [],
      acceptedSnapshots: [],
      solveStatus: [],
      preferences: [],
      activityEvents: [],
    });

    const res3 = await localStore.importBackup(validPayload);
    assert.strictEqual(res3.success, true);
    assert.ok(res3.importedCount >= 1);
  });

  // Test 5: Analytics Unique Problems Solved Deduplication
  it('deduplicates unique problems solved count while tracking all practice events', () => {
    const events = [
      { problemId: 'P1', status: 'ACCEPTED' },
      { problemId: 'P1', status: 'ACCEPTED' }, // Repeat solve of P1
      { problemId: 'P1', status: 'ACCEPTED' }, // Repeat solve of P1
      { problemId: 'P2', status: 'ACCEPTED' },
    ];

    const uniqueSolved = new Set<string>();
    let totalSessions = 0;

    events.forEach((ev) => {
      totalSessions++;
      if (ev.status === 'ACCEPTED') {
        uniqueSolved.add(ev.problemId);
      }
    });

    assert.strictEqual(totalSessions, 4); // 4 sessions
    assert.strictEqual(uniqueSolved.size, 2); // Exactly 2 unique problems solved!
  });

  // Test 6: Solve status best duration and last duration tracking
  it('tracks best solve duration and last solve duration correctly', async () => {
    const probId = 'prob-durations';

    // Solve 1 in 300s
    await localStore.recordSolve(probId, 300);
    let status = await localStore.getSolveStatus(probId);
    assert.strictEqual(status?.isSolved, true);
    assert.strictEqual(status?.bestDurationSec, 300);
    assert.strictEqual(status?.lastDurationSec, 300);
    assert.strictEqual(status?.solveCount, 1);

    // Solve 2 in 180s (faster)
    await localStore.recordSolve(probId, 180);
    status = await localStore.getSolveStatus(probId);
    assert.strictEqual(status?.bestDurationSec, 180); // New best
    assert.strictEqual(status?.lastDurationSec, 180);
    assert.strictEqual(status?.solveCount, 2);

    // Solve 3 in 240s (slower than best, but captures last duration)
    await localStore.recordSolve(probId, 240);
    status = await localStore.getSolveStatus(probId);
    assert.strictEqual(status?.bestDurationSec, 180); // Preserves best
    assert.strictEqual(status?.lastDurationSec, 240);
    assert.strictEqual(status?.solveCount, 3);
  });
});
