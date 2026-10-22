import test, { describe } from 'node:test';
import assert from 'node:assert/strict';
import { CodeExecutionService } from '../src/services/execution/codeExecutionService';

describe('Phase 0: Object-Oriented Design Problem Execution Engine', () => {
  test('MyHashSet correctly executes operations sequence and passes tests', async () => {
    const userCode = `
      class MyHashSet {
        constructor() {
          this.buckets = Array.from({ length: 1000 }, () => []);
        }
        add(key) {
          const b = key % 1000;
          if (!this.buckets[b].includes(key)) {
            this.buckets[b].push(key);
          }
        }
        remove(key) {
          const b = key % 1000;
          const idx = this.buckets[b].indexOf(key);
          if (idx !== -1) {
            this.buckets[b].splice(idx, 1);
          }
        }
        contains(key) {
          const b = key % 1000;
          return this.buckets[b].includes(key);
        }
      }
    `;

    const testCases = [
      {
        input: JSON.stringify([
          ["MyHashSet", "add", "add", "contains", "contains", "add", "contains", "remove", "contains"],
          [[], [1], [2], [1], [3], [2], [2], [2], [2]]
        ]),
        expectedOutput: JSON.stringify([null, null, null, true, false, null, true, null, false])
      },
      {
        input: JSON.stringify([
          ["MyHashSet", "contains", "remove", "contains"],
          [[], [100], [100], [100]]
        ]),
        expectedOutput: JSON.stringify([null, false, null, false])
      }
    ];

    const result = await CodeExecutionService.executeCode(
      userCode,
      'javascript',
      testCases,
      {
        functionName: 'MyHashSet',
        executionModel: 'DESIGN',
        optimalRuntimeMs: 40.0,
        maxAllowedRuntimeMs: 1000.0,
      }
    );

    assert.equal(result.status, 'ACCEPTED');
    assert.equal(result.testCasesPassed, 2);
    assert.equal(result.totalTestCases, 2);
  });

  test('LRUCache correctly executes get, put, and eviction operations', async () => {
    const userCode = `
      class LRUCache {
        constructor(capacity) {
          this.capacity = capacity;
          this.cache = new Map();
        }
        get(key) {
          if (!this.cache.has(key)) return -1;
          const val = this.cache.get(key);
          this.cache.delete(key);
          this.cache.set(key, val);
          return val;
        }
        put(key, value) {
          if (this.cache.has(key)) {
            this.cache.delete(key);
          } else if (this.cache.size >= this.capacity) {
            const oldestKey = this.cache.keys().next().value;
            this.cache.delete(oldestKey);
          }
          this.cache.set(key, value);
        }
      }
    `;

    const testCases = [
      {
        input: JSON.stringify([
          ["LRUCache", "put", "put", "get", "put", "get", "put", "get", "get", "get"],
          [[2], [1, 1], [2, 2], [1], [3, 3], [2], [4, 4], [1], [3], [4]]
        ]),
        expectedOutput: JSON.stringify([null, null, null, 1, null, -1, null, -1, 3, 4])
      }
    ];

    const result = await CodeExecutionService.executeCode(
      userCode,
      'javascript',
      testCases,
      {
        functionName: 'LRUCache',
        executionModel: 'DESIGN',
        optimalRuntimeMs: 35.0,
        maxAllowedRuntimeMs: 1000.0,
      }
    );

    assert.equal(result.status, 'ACCEPTED');
    assert.equal(result.testCasesPassed, 1);
    assert.equal(result.totalTestCases, 1);
  });

  test('Missing method triggers clear runtime error feedback', async () => {
    const buggyCode = `
      class MyHashSet {
        constructor() {}
        add(key) {}
        // missing remove and contains
      }
    `;

    const testCases = [
      {
        input: JSON.stringify([
          ["MyHashSet", "add", "contains"],
          [[], [1], [1]]
        ]),
        expectedOutput: JSON.stringify([null, null, true])
      }
    ];

    const result = await CodeExecutionService.executeCode(
      buggyCode,
      'javascript',
      testCases,
      {
        functionName: 'MyHashSet',
        executionModel: 'DESIGN',
      }
    );

    assert.equal(result.status, 'RUNTIME_ERROR');
    assert.ok(result.failedTestCase?.actual.includes('Method "contains" is not implemented'));
  });
});
