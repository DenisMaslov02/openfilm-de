import { test } from 'node:test';
import assert from 'node:assert/strict';
import { enUS } from '../chat/src/i18n/locales/en-US.ts';
import { de } from '../chat/src/i18n/locales/de.ts';
import { es } from '../chat/src/i18n/locales/es.ts';
import { ja } from '../chat/src/i18n/locales/ja.ts';
import { ko } from '../chat/src/i18n/locales/ko.ts';
import { zhCN } from '../chat/src/i18n/locales/zh-CN.ts';

/** Every phrase of a table, by its dotted path. @param {unknown} table @returns {Map<string, string>} */
function phrases(table, prefix = '', out = new Map()) {
  for (const [key, value] of Object.entries(/** @type {Record<string, unknown>} */ (table))) {
    const path = prefix ? `${prefix}.${key}` : key;
    if (typeof value === 'string') out.set(path, value);
    else if (value && typeof value === 'object') phrases(value, path, out);
  }
  return out;
}
const placeholders = (/** @type {string} */ text) => [...text.matchAll(/\{\w+\}/g)].map((m) => m[0]).sort();
const english = phrases(enUS);

test('the chat says every phrase in German that it says in English, and nothing more', () => {
  const german = phrases(de);
  const missing = [...english.keys()].filter((path) => !german.get(path)?.trim());
  const extra = [...german.keys()].filter((path) => !english.has(path));
  assert.deepEqual(missing, [], `missing in locales/de.ts: ${missing.slice(0, 20).join(', ')}`);
  assert.deepEqual(extra, [], `in locales/de.ts but not in en-US.ts: ${extra.slice(0, 20).join(', ')}`);
});

test("each of the chat's languages keeps the placeholders of each English phrase", () => {
  for (const [code, table] of Object.entries({ de, es, ja, ko, 'zh-CN': zhCN })) {
    for (const [path, said] of phrases(table)) {
      const source = english.get(path);
      if (source !== undefined) assert.deepEqual(placeholders(said), placeholders(source), `${code} ${path}: "${said}"`);
    }
  }
});
