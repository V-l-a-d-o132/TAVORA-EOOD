import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import { gunzipSync } from 'node:zlib';
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const source = resolve(root, 'course-assets/perfect-video/client-production');
export function loadVideoProductionLessons() {
  const manifest = JSON.parse(readFileSync(resolve(source, 'manifest.json'), 'utf8'));
  const entry = manifest.curriculum;
  if (manifest.release !== 'video_client_production_v1' || !Array.isArray(entry.parts) || !entry.parts.length) throw Error('Missing production curriculum');
  const bytes = Buffer.from(entry.parts.map(p => {
    if (!/^lessons\.\d{3}\.base64$/.test(p)) throw Error('Invalid production curriculum path');
    return readFileSync(resolve(source, p), 'utf8').trim();
  }).join(''), 'base64');
  const hash = b => createHash('sha256').update(b).digest('hex');
  if (bytes.length !== entry.bytes || hash(bytes) !== entry.sha256) throw Error('Production curriculum integrity failed');
  const decoded = gunzipSync(bytes);
  if (decoded.length !== entry.decodedBytes || hash(decoded) !== entry.decodedSha256) throw Error('Decoded production curriculum integrity failed');
  const rows = JSON.parse(decoded.toString('utf8'));
  if (rows.length !== 66 || rows.reduce((sum, r) => sum + r.blocks.length, 0) !== 900 || rows.some(r => !Object.hasOwn(manifest.modules, r.moduleId))) throw Error('Incomplete production curriculum');
  if (/"(?:answer_key|evaluation|correctAnswer|feedback)"\s*:/.test(decoded.toString('utf8'))) throw Error('Private grading in public production curriculum');
  return rows;
}
export function prepareVideoProductionAssets() { loadVideoProductionLessons(); }
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) prepareVideoProductionAssets();
