import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import { gunzipSync } from 'node:zlib';
import { prepareFinalVideoAssets } from './prepare-final-video-assets.mjs';
import { prepareProductionVideoAssets } from './prepare-production-video-assets.mjs';
import { preparePracticalMarketingAssets } from './prepare-practical-marketing-assets.mjs';
import { prepareNextPracticalMarketingAssets } from './prepare-next-practical-marketing-assets.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const assetRoot = resolve(root, 'course-assets/perfect-video/practical-20261014');
const manifest = JSON.parse(readFileSync(resolve(assetRoot, 'manifest.json'), 'utf8'));

function decode(name) {
  const entry = manifest[name];
  if (!entry || !Array.isArray(entry.parts) || !entry.parts.length) throw new Error(`Missing practical asset: ${name}`);
  const encoded = entry.parts.map(part => {
    if (!/^(curriculum|video)\.\d{3}\.base64$/.test(part)) throw new Error('Invalid practical asset path');
    return readFileSync(resolve(assetRoot, part), 'utf8').trim();
  }).join('');
  const bytes = Buffer.from(encoded, 'base64');
  if (bytes.length !== entry.bytes || createHash('sha256').update(bytes).digest('hex') !== entry.sha256) throw new Error(`Practical asset integrity failed: ${name}`);
  return bytes;
}

export function loadPracticalCandidates() {
  const bytes = gunzipSync(decode('curriculum'));
  if (createHash('sha256').update(bytes).digest('hex') !== manifest.curriculum.decodedSha256) throw new Error('Practical curriculum integrity failed');
  return JSON.parse(bytes.toString('utf8'));
}

export function preparePracticalVideoAssets() {
  const target = resolve(root, 'public/academy-labs/perfect-video/practical');
  mkdirSync(target, { recursive: true });
  writeFileSync(resolve(target, 'coffee-machine.mp4'), decode('video'));
  const releasePath = resolve(root, 'scripts/perfect-video/releases/practical-01-05-20261014.json');
  writeFileSync(releasePath, `${JSON.stringify(loadPracticalCandidates(), null, 2)}\n`);
  prepareProductionVideoAssets();
  prepareFinalVideoAssets();
  preparePracticalMarketingAssets();
  prepareNextPracticalMarketingAssets();
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  preparePracticalVideoAssets();
  process.stdout.write('Prepared and verified academy practical assets.\n');
}
