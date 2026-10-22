import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
export function prepareVideoClientAssets() {
  const source = resolve(root, 'course-assets/perfect-video/first-client');
  const target = resolve(root, 'public/academy-labs/perfect-video/first-client');
  const manifest = JSON.parse(readFileSync(resolve(source, 'manifest.json'), 'utf8'));
  if (Object.keys(manifest).sort().join(',') !== 'confusing,process') throw Error('Incomplete client project media');
  mkdirSync(target, { recursive: true });
  for (const [name, entry] of Object.entries(manifest)) {
    if (entry.file !== `${name}.mp4` || !Array.isArray(entry.parts) || entry.parts.some(p => !/^(process|confusing)\.\d{3}\.base64$/.test(p))) throw Error('Invalid client project path');
    const data = Buffer.from(entry.parts.map(part => readFileSync(resolve(source, part), 'utf8').trim()).join(''), 'base64');
    if (data.length !== entry.bytes || createHash('sha256').update(data).digest('hex') !== entry.sha256) throw Error('Client project media integrity failed');
    writeFileSync(resolve(target, entry.file), data);
  }
}
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) prepareVideoClientAssets();
