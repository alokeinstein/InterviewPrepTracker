import { describe, it } from 'node:test';
import assert from 'node:assert';
import { localStore } from '../src/lib/storage/indexedDb';
import { marked } from 'marked';

describe('LeetCode Workspace Refinement: Splitters & Typography Verification', () => {
  // 1. Vertical Splitter Clamping & Defaults
  it('enforces vertical splitter ratio limits between 20% and 80%', () => {
    const clampRatio = (width: number, offsetX: number) => {
      const minPercent = Math.max(20, (280 / width) * 100);
      const maxPercent = Math.min(80, ((width - 280) / width) * 100);
      const raw = (offsetX / width) * 100;
      return Math.min(Math.max(raw, minPercent), maxPercent);
    };

    const containerWidth = 1200;
    // Extremely small drag left
    assert.strictEqual(clampRatio(containerWidth, 50) >= 20, true);
    // Extremely large drag right
    assert.strictEqual(clampRatio(containerWidth, 1150) <= 80, true);
    // Midpoint drag
    const mid = clampRatio(containerWidth, 600);
    assert.strictEqual(mid, 50);
  });

  // 2. Horizontal Splitter Clamping & Console Limits
  it('enforces horizontal splitter limits with minimum usable editor and console heights', () => {
    const clampConsoleHeight = (panelHeight: number, clientY: number, panelBottom: number) => {
      const minH = 110; // Minimum console height
      const maxH = Math.max(minH, panelHeight - 140); // Minimum 140px editor height
      const raw = panelBottom - clientY;
      return Math.min(Math.max(raw, minH), maxH);
    };

    const panelHeight = 800;
    const panelBottom = 800;

    // Dragged all the way to the bottom (below minimum)
    assert.strictEqual(clampConsoleHeight(panelHeight, 790, panelBottom), 110);

    // Dragged all the way to the top (would crush editor)
    assert.strictEqual(clampConsoleHeight(panelHeight, 50, panelBottom), 660); // 800 - 140 = 660

    // Standard drag
    assert.strictEqual(clampConsoleHeight(panelHeight, 560, panelBottom), 240);
  });

  // 3. UI-Preferences Persistence for Splitter Dimensions
  it('persists and retrieves vertical and horizontal splitter dimensions correctly', async () => {
    // Save preferences
    await localStore.setPreference('workspace_split_ratio', 48);
    await localStore.setPreference('workspace_console_height', 280);

    // Retrieve preferences with fallback
    const savedRatio = await localStore.getPreference<number>('workspace_split_ratio', 45);
    const savedHeight = await localStore.getPreference<number>('workspace_console_height', 240);

    assert.strictEqual(savedRatio, 48);
    assert.strictEqual(savedHeight, 280);

    // Verify recovery on missing preference
    const missingPref = await localStore.getPreference<number>('non_existent_pref_key', 99);
    assert.strictEqual(missingPref, 99);
  });

  // 4. Markdown & Inline Code Pills Rendering
  it('correctly renders markdown identifiers into inline-code tags with preserved emphasis', () => {
    const rawStatement = 'Given an array of integers `nums` and an integer `target`, return _indices of the two numbers such that they add up to_ `target`.\n\nYou may assume that each input would have **exactly one solution**, and you may not use the _same_ element twice.';

    const parsedHtml = marked.parse(rawStatement, { gfm: true, breaks: true }) as string;

    // Must contain <code> tags for inline code identifiers
    assert.ok(parsedHtml.includes('<code>nums</code>'));
    assert.ok(parsedHtml.includes('<code>target</code>'));

    // Must contain <em> tags for italics
    assert.ok(parsedHtml.includes('<em>indices of the two numbers such that they add up to</em>'));
    assert.ok(parsedHtml.includes('<em>same</em>'));

    // Must contain <strong> tags for bold
    assert.ok(parsedHtml.includes('<strong>exactly one solution</strong>'));

    // Must contain separate paragraphs
    assert.ok(parsedHtml.includes('<p>') && parsedHtml.includes('</p>'));
  });

  // 5. Example Explanation Formatting
  it('renders inline code inside example explanations safely', () => {
    const explanation = 'The sum of `nums[0]` and `nums[1]` is 2 + 7 = 9, which equals `target`. Therefore, the indices `[0, 1]` are returned.';
    const parsedInline = marked.parseInline(explanation) as string;

    assert.ok(parsedInline.includes('<code>nums[0]</code>'));
    assert.ok(parsedInline.includes('<code>nums[1]</code>'));
    assert.ok(parsedInline.includes('<code>target</code>'));
    assert.ok(parsedInline.includes('<code>[0, 1]</code>'));
  });
});
