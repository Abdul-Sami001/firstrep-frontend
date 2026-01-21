// @ts-nocheck
// Lightweight, opt-in smoke tests for support helpers.
// Run manually with: npx ts-node --transpile-only tests/support-helpers.test.ts
import assert from 'assert';
import { extractCursor, mergeCursorPages } from '../lib/utils/pagination';
import { buildMessageFormData } from '../lib/api/support';

(() => {
  const cursor = extractCursor('https://api.test/support/tickets/?cursor=abc123');
  assert.strictEqual(cursor, 'abc123');

  const merged = mergeCursorPages([
    { next: 'https://api.test/support/tickets/?cursor=next-token', previous: null, results: [{ id: 1 }] },
    { next: null, previous: 'https://api.test/support/tickets/?cursor=prev-token', results: [{ id: 2 }] },
  ]);
  assert.strictEqual(merged.items.length, 2);
  assert.strictEqual(merged.nextCursor, null);
  assert.strictEqual(merged.previousCursor, 'prev-token');
})();

(() => {
  const formData = buildMessageFormData({ ticket: 't-1', body: 'Hello world' });
  assert.strictEqual(formData.get('ticket'), 't-1');
  assert.strictEqual(formData.get('body'), 'Hello world');
})();

console.log('support helper smoke tests passed');
