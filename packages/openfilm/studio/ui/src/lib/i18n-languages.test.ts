import { test } from 'node:test';
import assert from 'node:assert/strict';
import { en } from '../i18n/en.ts';
import { de } from '../i18n/de.ts';
import { LANGUAGES, languageFor, lookup } from '../i18n/index.ts';

/** Every phrase of a table, by its dotted path. */
function phrases(table: unknown, prefix = '', out = new Map<string, string>()): Map<string, string> {
  for (const [key, value] of Object.entries(table as Record<string, unknown>)) {
    const path = prefix ? `${prefix}.${key}` : key;
    if (typeof value === 'string') out.set(path, value);
    else if (value && typeof value === 'object') phrases(value, path, out);
  }
  return out;
}

const placeholders = (text: string) => [...text.matchAll(/\{\w+\}/g)].map((m) => m[0]).sort();
/* what is never translated: a file name, a command, words in backticks */
const literals = (text: string) => [...text.matchAll(/`[^`]+`|\b[\w-]+\.(?:html|json|md|mp4|mov|srt|vtt|log)\b|\bopenfilm [a-z]+\b/g)].map((m) => m[0]).sort();

const english = phrases(en);

test('German says every phrase English has, and nothing English does not', () => {
  const german = phrases(de);
  const missing = [...english.keys()].filter((path) => !german.get(path)?.trim());
  const extra = [...german.keys()].filter((path) => !english.has(path));
  assert.deepEqual(missing, [], `missing in de.ts: ${missing.slice(0, 20).join(', ')}`);
  assert.deepEqual(extra, [], `in de.ts but not in en.ts: ${extra.slice(0, 20).join(', ')}`);
});

test('German keeps the placeholders of each English phrase, as many times as English has them', () => {
  for (const [path, said] of phrases(de)) {
    const source = english.get(path);
    if (source !== undefined) assert.deepEqual(placeholders(said), placeholders(source), `de ${path}: "${said}"`);
  }
});

test('Deutsch is offered among the languages, after the ones before it', () => {
  assert.deepEqual(LANGUAGES.map((l) => l.code), ['en', 'zh-CN', 'ja', 'ko', 'es', 'de']);
  assert.equal(LANGUAGES.find((l) => l.code === 'de')?.name, 'Deutsch');
});

test('German keeps file names, commands and code as English writes them', () => {
  for (const [path, said] of phrases(de)) {
    const source = english.get(path);
    if (source === undefined) continue;
    for (const literal of literals(source)) assert.ok(said.includes(literal), `de ${path} lost ${literal}: "${said}"`);
  }
});

test('a German system is shown in German, whatever its region', () => {
  assert.equal(languageFor(['de-DE']), 'de');
  assert.equal(languageFor(['de-AT', 'en-US']), 'de');
  assert.equal(languageFor(['de-CH']), 'de');
  assert.equal(languageFor(['fr-FR', 'de']), 'de');
  assert.equal(languageFor(['zh-TW', 'de-DE']), 'de');
  assert.equal(languageFor(['en-US', 'de-DE']), 'en');
});

test('a German phrase is looked up in German, and one it lacks falls back to English', () => {
  assert.equal(lookup('nav.projects', 'de'), de.nav?.projects);
  assert.notEqual(lookup('nav.projects', 'de'), en.nav.projects);
  assert.equal(lookup('nav.projects', 'en'), en.nav.projects);
  assert.equal(lookup('no.such.path', 'de'), 'no.such.path');
});
