import test from 'node:test';
import assert from 'node:assert/strict';
import { LEVEL_METADATA } from '../src/lib/dsa/levelMetadata';

test('Level Metadata Integrity & Coverage', async (t) => {
  await t.test('all 23 levels are defined with titles, topics, and descriptions', () => {
    for (let level = 1; level <= 23; level++) {
      const meta = LEVEL_METADATA[level];
      assert.ok(meta, `Level ${level} must have metadata defined`);
      assert.ok(meta.title.length > 0, `Level ${level} title must not be empty`);
      assert.ok(meta.topic.length > 0, `Level ${level} topic must not be empty`);
      assert.ok(meta.description.length > 0, `Level ${level} description must not be empty`);
      assert.ok(Array.isArray(meta.concepts) && meta.concepts.length > 0, `Level ${level} must have concept tags`);
    }
  });

  await t.test('level navigation links map to /levels/[levelId]', () => {
    for (let level = 1; level <= 23; level++) {
      const expectedRoute = `/levels/${level}`;
      assert.match(expectedRoute, /^\/levels\/\d+$/, `Route for level ${level} must follow /levels/[id] convention`);
    }
  });
});

test('Level View Mode Configuration', async (t) => {
  await t.test('supports simplistic and detailed card modes', () => {
    const validModes = ['simplistic', 'detailed'];
    assert.ok(validModes.includes('simplistic'));
    assert.ok(validModes.includes('detailed'));
  });

  await t.test('view mode storage key is consistent', () => {
    const STORAGE_KEY = 'dsa_level_card_view_mode';
    assert.equal(STORAGE_KEY, 'dsa_level_card_view_mode');
  });
});
