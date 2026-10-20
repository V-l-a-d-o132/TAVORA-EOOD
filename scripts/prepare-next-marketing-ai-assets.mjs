import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import { gunzipSync } from 'node:zlib';
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..'), dir = resolve(root, 'course-assets/marketing/ai-next-five-20261020');
const manifest = JSON.parse(readFileSync(resolve(dir, 'manifest.json'), 'utf8'));
function load(name) {
  const e = manifest[name]; if (!e || !Array.isArray(e.parts) || !e.parts.length) throw Error('Missing marketing AI part');
  const bytes = Buffer.from(e.parts.map(part => { if (!/^(curriculum|source)\.\d{3}\.base64$/.test(part)) throw Error('Invalid marketing AI part path'); return readFileSync(resolve(dir, part), 'utf8').trim(); }).join(''), 'base64');
  if (bytes.length !== e.bytes || createHash('sha256').update(bytes).digest('hex') !== e.sha256) throw Error('Marketing AI integrity failed');
  const raw = gunzipSync(bytes); if (raw.length !== e.decodedBytes || createHash('sha256').update(raw).digest('hex') !== e.decodedSha256) throw Error('Decoded marketing AI integrity failed'); return JSON.parse(raw.toString('utf8'));
}
export const loadNextMarketingAiCandidates = () => load('curriculum');
export const loadNextMarketingAiSource = () => load('source');
export function prepareNextMarketingAiAssets() { const rows = loadNextMarketingAiCandidates(); if (rows.length !== 17 || rows.reduce((n, r) => n + r.payload.additions.length, 0) !== 34 || loadNextMarketingAiSource().length !== 63) throw Error('Incomplete marketing AI supplement'); if (/"(?:evaluation|answer_key|answerKey|answers|correct|scoring|feedback|modelAnswer)"\s*:/.test(JSON.stringify(rows))) throw Error('Private grading in public marketing AI parts'); }
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) prepareNextMarketingAiAssets();
