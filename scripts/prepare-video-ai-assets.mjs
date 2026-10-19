import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import { gunzipSync } from 'node:zlib';
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const dir = resolve(root, 'course-assets/perfect-video/ai-20261019');
const manifest = JSON.parse(readFileSync(resolve(dir, 'manifest.json'), 'utf8'));
function decode(name) {
  const entry = manifest[name];
  if (!entry || !Array.isArray(entry.parts) || !entry.parts.length) throw Error('Missing video AI asset');
  const bytes = Buffer.from(entry.parts.map(part => {
    if (!/^[a-z0-9-]+\.\d{3}\.base64$/.test(part)) throw Error('Invalid video AI asset path');
    return readFileSync(resolve(dir, part), 'utf8').trim();
  }).join(''), 'base64');
  if (bytes.length !== entry.bytes || createHash('sha256').update(bytes).digest('hex') !== entry.sha256) throw Error('Video AI asset integrity failed');
  return bytes;
}
function json(name) {
  const bytes = gunzipSync(decode(name)), entry = manifest[name];
  if (bytes.length !== entry.decodedBytes || createHash('sha256').update(bytes).digest('hex') !== entry.decodedSha256) throw Error('Decoded video AI integrity failed');
  return JSON.parse(bytes.toString('utf8'));
}
export function loadVideoAiCandidates() { return json('curriculum'); }
export function loadVideoAiSource() { return json('source'); }
export function prepareVideoAiAssets() {
  const target = resolve(root, 'public/academy-labs/perfect-video/ai');
  mkdirSync(target, { recursive: true });
  for (const [name, entry] of Object.entries(manifest)) {
    if (!entry || typeof entry !== 'object' || !('file' in entry)) continue;
    if (!/^[a-z-]+\.(mp4|mp3|webp)$/.test(entry.file)) throw Error('Invalid decoded video AI path');
    writeFileSync(resolve(target, entry.file), decode(name));
  }
  const rows = loadVideoAiCandidates();
  if (rows.length !== 69 || rows.reduce((n, r) => n + r.payload.additions.length, 0) !== 75) throw Error('Incomplete video AI course supplement');
}
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) prepareVideoAiAssets();
