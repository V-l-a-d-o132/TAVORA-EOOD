import { readFileSync, writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import { gunzipSync } from 'node:zlib';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const assetRoot = resolve(root, 'course-assets/marketing/practical-third-20261015');

export function loadThirdPracticalMarketingCandidates() {
  const manifest = JSON.parse(readFileSync(resolve(assetRoot, 'manifest.json'), 'utf8'));
  if (!Array.isArray(manifest.parts) || !manifest.parts.length) throw new Error('Missing marketing curriculum parts');
  const encoded = manifest.parts.map(part => {
    if (!/^curriculum\.\d{3}\.base64$/.test(part)) throw new Error('Invalid marketing curriculum path');
    return readFileSync(resolve(assetRoot, part), 'utf8').trim();
  }).join('');
  const compressed = Buffer.from(encoded, 'base64');
  if (compressed.length !== manifest.bytes || createHash('sha256').update(compressed).digest('hex') !== manifest.sha256) throw new Error('Marketing curriculum integrity failed');
  const bytes = gunzipSync(compressed);
  if (bytes.length !== manifest.decodedBytes || createHash('sha256').update(bytes).digest('hex') !== manifest.decodedSha256) throw new Error('Decoded marketing curriculum integrity failed');
  return JSON.parse(bytes.toString('utf8'));
}

export function prepareThirdPracticalMarketingAssets() {
  const lessons = loadThirdPracticalMarketingCandidates();
  if (lessons.length !== 51) throw new Error('Incomplete third-five marketing curriculum');
  writeFileSync(resolve(root, 'scripts/marketing-basics/releases/practical-11-15-20261015.json'), `${JSON.stringify(lessons, null, 2)}\n`);
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  prepareThirdPracticalMarketingAssets();
  process.stdout.write('Prepared and verified practical marketing curriculum.\n');
}
