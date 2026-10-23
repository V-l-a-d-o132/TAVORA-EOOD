import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join, relative } from 'node:path';

const sourceRoots = ['src', 'public', 'index.html', 'package.json', 'package-lock.json',
  'vite.config.ts', 'tailwind.config.ts', 'postcss.config.ts', 'tsconfig.app.json',
  'scripts/lib/academy-build.mjs'];

export const sha256 = value => createHash('sha256').update(value).digest('hex');

export function privateAcademyRuntimeSource(id) {
  const path = id.replaceAll('\\', '/').split('?')[0];
  return path.includes('/mocks/interactive-lesson-data') || path.includes('/mocks/quiz-questions') ||
    (!path.includes('/node_modules/') && /\/(?:supabase\/(?:migrations|baseline|functions)|scripts\/(?:perfect-video|silk-road)|tests|e2e)\//.test(path));
}

export function sourceFingerprint(root) {
  const files = [];
  const visit = path => {
    for (const entry of readdirSync(path, { withFileTypes: true })) {
      if (entry.isSymbolicLink()) throw new Error('Frontend source must not contain symlinks.');
      const child = join(path, entry.name);
      if (entry.isDirectory()) visit(child);
      else if (entry.isFile()) files.push(child);
    }
  };
  for (const name of sourceRoots) {
    const path = join(root, name);
    if (!existsSync(path)) continue;
    if (name === 'src' || name === 'public') visit(path);
    else files.push(path);
  }
  if (!files.length) throw new Error('No frontend source found.');
  const hash = createHash('sha256');
  for (const file of files.sort()) {
    const bytes = readFileSync(file);
    hash.update(relative(root, file).replaceAll('\\', '/') + '\0' + bytes.length + '\0');
    hash.update(bytes);
  }
  return hash.digest('hex');
}

export function createBuildManifest(root, entries, now = new Date(), chunks = entries) {
  let revision = null;
  try {
    const value = execFileSync('git', ['rev-parse', 'HEAD'], { cwd: root, stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim();
    if (/^[a-f0-9]{40}$/.test(value)) revision = value;
  } catch { /* Readdy may build an export without Git metadata. */ }
  return { schema: 1, sourceHash: sourceFingerprint(root), revision,
    builtAt: now.toISOString(), entries: entries.map(({ fileName, code }) => ({ fileName, sha256: sha256(code) })),
    chunks: chunks.map(({ fileName, code }) => ({ fileName, sha256: sha256(code) })) };
}

export function academyBuildManifest() {
  let root;
  return {
    name: 'academy-build-manifest',
    enforce: 'post',
    configResolved(config) { root = config.root; },
    generateBundle(_options, bundle) {
      const chunks = Object.values(bundle).filter(output => output.type === 'chunk');
      const entries = chunks.filter(output => output.isEntry);
      if (!entries.length) this.error('No frontend entry found for deployment verification.');
      this.emitFile({ type: 'asset', fileName: 'academy-build.json',
        source: JSON.stringify(createBuildManifest(root, entries, new Date(), chunks), null, 2) + '\n' });
    },
  };
}

export function parseBuildManifest(text) {
  let value;
  try { value = JSON.parse(text); } catch { throw new Error('Build manifest missing or replaced by an HTML fallback.'); }
  if (value?.schema !== 1 || !/^[a-f0-9]{64}$/.test(value.sourceHash || '') ||
      !Array.isArray(value.entries) || !value.entries.length || value.entries.length > 10 ||
      !Array.isArray(value.chunks) || !value.chunks.length || value.chunks.length > 1000 ||
      [...value.entries, ...value.chunks].some(entry => !entry || typeof entry.fileName !== 'string' ||
        !/^(?:[A-Za-z0-9_-]+\/)*[A-Za-z0-9_.-]+\.js$/.test(entry.fileName) ||
        entry.fileName.includes('..') || !/^[a-f0-9]{64}$/.test(entry.sha256 || '')) ||
      new Set(value.chunks.map(chunk => chunk.fileName)).size !== value.chunks.length ||
      value.entries.some(entry => !value.chunks.some(chunk => chunk.fileName === entry.fileName && chunk.sha256 === entry.sha256))) {
    throw new Error('Invalid build manifest.');
  }
  return value;
}

export async function verifyHostedBuild(origin, expected, fetcher = fetch) {
  const base = new URL(origin.endsWith('/') ? origin : origin + '/');
  if (base.protocol !== 'https:' || base.username || base.password || base.search || base.hash) {
    throw new Error('Use an HTTPS deployment URL without credentials, query or fragment.');
  }
  const read = async url => {
    url.searchParams.set('_academy_verify', String(Date.now()));
    const response = await fetcher(url, { cache: 'no-store', redirect: 'error', signal: AbortSignal.timeout(15000) });
    if (!response.ok) throw new Error('Deployment request failed: HTTP ' + response.status);
    return response.text();
  };
  const actual = parseBuildManifest(await read(new URL('academy-build.json', base)));
  if (actual.sourceHash !== expected.sourceHash) throw new Error('Hosted frontend source differs from the tested release.');
  const html = await read(new URL(base));
  const scripts = [...html.matchAll(/<script\b[^>]*\bsrc\s*=\s*["']([^"']+)["'][^>]*>/gi)]
    .map(match => new URL(match[1], base).href);
  for (const entry of actual.entries) {
    const url = new URL(entry.fileName, base);
    if (!scripts.includes(url.href)) throw new Error('The live HTML does not load the declared frontend entry.');
  }
  // Route pages are lazy-loaded. Checking the entry alone misses mixed releases.
  let next = 0;
  await Promise.all(Array.from({ length: Math.min(6, actual.chunks.length) }, async () => {
    while (next < actual.chunks.length) {
      const chunk = actual.chunks[next++];
      if (sha256(await read(new URL(chunk.fileName, base))) !== chunk.sha256) {
        throw new Error('The served frontend chunk differs from its build manifest: ' + chunk.fileName);
      }
    }
  }));
  return { sourceHash: actual.sourceHash, revision: actual.revision, builtAt: actual.builtAt };
}
