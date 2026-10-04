import { execFileSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { createBuildManifest, parseBuildManifest, privateAcademyRuntimeSource, sha256, sourceFingerprint, verifyHostedBuild } from '../scripts/lib/academy-build.mjs';
import { checkChangedFiles, findDistributionProblems } from '../scripts/check-academy-distribution.mjs';

const temporary: string[] = [];
afterEach(() => { for (const path of temporary.splice(0)) rmSync(path, { recursive: true, force: true }); });
const directory = () => { const root = mkdtempSync(join(tmpdir(), 'academy-guards-')); temporary.push(root); return root; };
const put = (root: string, path: string, value: string) => {
  mkdirSync(join(root, path, '..'), { recursive: true }); writeFileSync(join(root, path), value);
};
const rootWithSource = () => {
  const root = directory(); put(root, 'src/main.tsx', 'export const release = "synthetic-release";');
  put(root, 'index.html', '<div id="root"></div>'); return root;
};
const entryCode = 'console.log("synthetic built entry");';
const manifest = () => ({ schema: 1, sourceHash: sha256('synthetic frontend'), revision: null,
  builtAt: '2026-10-04T17:00:00.000Z', entries: [{ fileName: 'js/index-test.js', sha256: sha256(entryCode) }],
  chunks: [{ fileName: 'js/index-test.js', sha256: sha256(entryCode) }] });
const hosted = (value = manifest(), html = '<script type="module" src="/js/index-test.js"></script>', code = entryCode) =>
  vi.fn(async (url: URL) => new Response(url.pathname === '/academy-build.json' ? JSON.stringify(value) :
    url.pathname === '/' ? html : code));

describe('academy deployment proof', () => {
  it('tracks actual frontend changes and excludes private environment, database and learner files', () => {
    const root = rootWithSource(); const original = sourceFingerprint(root);
    put(root, '.env.local', 'SYNTHETIC_SECRET=not-for-distribution');
    put(root, 'supabase/private-fixture.json', '{"synthetic":true}');
    put(root, 'tests/student-fixture.json', '{"synthetic":true}');
    expect(sourceFingerprint(root)).toBe(original);
    put(root, 'src/main.tsx', 'export const release = "changed synthetic release";');
    expect(sourceFingerprint(root)).not.toBe(original);
    const result = createBuildManifest(root, [{ fileName: 'js/index-test.js', code: entryCode }], new Date('2026-10-04T17:00:00Z'));
    expect(Object.keys(result).sort()).toEqual(['builtAt', 'chunks', 'entries', 'revision', 'schema', 'sourceHash']);
    expect(JSON.stringify(result)).not.toContain('SYNTHETIC_SECRET');
    expect(result.entries[0].sha256).toBe(sha256(entryCode));
  });
  it('does not treat a successful SPA HTML fallback as a build manifest', () => {
    expect(() => parseBuildManifest('<html><div id="root"></div></html>')).toThrow('HTML fallback');
  });
  it.each(['../entry.js', 'https://another.example/entry.js', 'js/../../entry.js', '/entry.js'])('rejects unsafe manifest entry %s', fileName => {
    expect(() => parseBuildManifest(JSON.stringify({ ...manifest(), entries: [{ fileName, sha256: sha256(entryCode) }] }))).toThrow('Invalid build');
  });
  it('verifies matching source, live HTML and actual served entry without an account', async () => {
    const fetcher = hosted(); const result = await verifyHostedBuild('https://academy.example', manifest(), fetcher);
    expect(result.sourceHash).toBe(manifest().sourceHash);
    expect(fetcher).toHaveBeenCalledTimes(3);
    for (const [, options] of fetcher.mock.calls as unknown as [URL, RequestInit][]) expect(options).toMatchObject({ cache: 'no-store', redirect: 'error' });
  });
  it('supports a deployment under a base path', async () => {
    const fetcher = vi.fn(async (url: URL) => new Response(url.pathname.endsWith('/academy-build.json') ? JSON.stringify(manifest()) :
      url.pathname.endsWith('/js/index-test.js') ? entryCode : '<script src="/preview/js/index-test.js"></script>'));
    await expect(verifyHostedBuild('https://academy.example/preview', manifest(), fetcher)).resolves.toMatchObject({ sourceHash: manifest().sourceHash });
  });
  it('rejects a stale release before accepting any loaded page', async () => {
    await expect(verifyHostedBuild('https://academy.example', manifest(), hosted({ ...manifest(), sourceHash: sha256('older release') }))).rejects.toThrow('source differs');
  });
  it('rejects a fresh manifest paired with old HTML', async () => {
    await expect(verifyHostedBuild('https://academy.example', manifest(), hosted(manifest(), '<script src="/js/old-entry.js"></script>'))).rejects.toThrow('does not load');
  });
  it('rejects stale or corrupted served entry bytes', async () => {
    await expect(verifyHostedBuild('https://academy.example', manifest(), hosted(manifest(), undefined, 'old entry'))).rejects.toThrow('chunk differs');
  });
  it('rejects a stale lazy-loaded course page even when the entry and source hash match', async () => {
    const value = { ...manifest(), chunks: [...manifest().chunks, { fileName: 'js/video-page.js', sha256: sha256('new course page') }] };
    await expect(verifyHostedBuild('https://academy.example', value, hosted(value))).rejects.toThrow('js/video-page.js');
  });
  it('requires every entry in the chunk inventory with the same digest', () => {
    expect(() => parseBuildManifest(JSON.stringify({ ...manifest(), chunks: [] }))).toThrow('Invalid build');
    expect(() => parseBuildManifest(JSON.stringify({ ...manifest(), chunks: [{ fileName: 'js/index-test.js', sha256: sha256('stale') }] }))).toThrow('Invalid build');
  });
  it('rejects missing manifests and credentials rather than reporting success', async () => {
    await expect(verifyHostedBuild('https://academy.example', manifest(), async () => new Response('', { status: 404 }))).rejects.toThrow('HTTP 404');
    await expect(verifyHostedBuild('https://synthetic:password@academy.example', manifest(), hosted())).rejects.toThrow('without credentials');
  });
});

describe('new private mapping distribution guard', () => {
  it.each([
    ['scripts/perfect-video/releases/synthetic.json', '{"evaluation":{"correct":"synthetic-choice"}}'],
    ['public/synthetic.json', '{"answer_key":{"correct":"synthetic-choice"}}'],
    ['src/data/synthetic.ts', 'const task = { correctAnswer: "synthetic-choice" };'],
    ['src/data/synthetic.ts', 'const task = { correctAnswer: 1 };'],
    ['src/data/synthetic.ts', 'const task = { correct: "synthetic-choice" };'],
    ['src/data/synthetic.ts', 'const task = { evaluation: { correct: "synthetic-choice" } };'],
    ['src/data/synthetic.ts', 'const task = { correctIndex: 1 };'],
    ['scripts/perfect-video/synthetic.yaml', 'correct_index: 1'],
    ['supabase/migrations/synthetic.sql', "SELECT jsonb_build_object('correct','synthetic-choice');"],
    ['scripts/perfect-video/synthetic.py', "key = {'correct': ['synthetic-choice']}"],
  ])('blocks literal private mappings in %s without logging their values', (path, content) => {
    expect(findDistributionProblems([{ path, content }])).toEqual([path]);
    expect(JSON.stringify(findDistributionProblems([{ path, content }]))).not.toContain('synthetic-choice');
  });
  it('allows public options, key-name filtering, dynamic grading and isolated synthetic test fixtures', () => {
    expect(findDistributionProblems([
      { path: 'scripts/perfect-video/releases/synthetic.json', content: '{"options":[{"id":"synthetic-choice","label":"Example"}]}' },
      { path: 'src/lib/filter.ts', content: "const hidden = ['correct', 'answer_key', 'evaluation'];" },
      { path: 'supabase/migrations/synthetic.sql', content: "SELECT jsonb_build_object('correct', computed_result);" },
      { path: 'tests/synthetic-fixture.ts', content: '{"evaluation":{"correct":"synthetic-choice"}}' },
    ])).toEqual([]);
  });
  it('checks renamed and untracked files and does not claim to retract existing Git history', () => {
    const root = directory(); const git = (args: string[]) => execFileSync('git', args, { cwd: root, stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim();
    git(['init']);
    put(root, 'supabase/migrations/old.sql', '{"correct":"synthetic-legacy-choice"}');
    git(['add', '.']); git(['-c', 'user.name=Synthetic Test', '-c', 'user.email=synthetic@example.invalid', 'commit', '-m', 'synthetic legacy baseline']);
    const base = git(['rev-parse', 'HEAD']);
    expect(checkChangedFiles(root, base)).toEqual([]);
    git(['mv', 'supabase/migrations/old.sql', 'supabase/migrations/new.sql']);
    put(root, 'public/new.json', '{"answerKey":"synthetic-new-choice"}');
    expect(checkChangedFiles(root, base).sort()).toEqual(['public/new.json', 'supabase/migrations/new.sql']);
  });
  it('the build boundary refuses private artifacts, including queried and Windows paths, and allows actual libraries', () => {
    for (const path of ['/repo/supabase/migrations/release.sql', '/repo/supabase/baseline/schema.json',
      '/repo/scripts/perfect-video/releases/release.json?raw', '/repo/scripts/silk-road/content.js',
      '/repo/supabase/functions/grader/index.ts', 'C:\\repo\\tests\\private-fixture.ts',
      '/repo/e2e/fixture.json', '/repo/src/mocks/quiz-questions.ts', '/repo/src/mocks/interactive-lesson-data.ts']) {
      expect(privateAcademyRuntimeSource(path), path).toBe(true);
    }
    for (const path of ['/repo/node_modules/@supabase/supabase-js/dist/index.js',
      '/repo/node_modules/library/tests/helper.js', '/repo/src/lib/academy.ts']) {
      expect(privateAcademyRuntimeSource(path), path).toBe(false);
    }
  });
});
