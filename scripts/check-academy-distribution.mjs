import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';

const protectedRoots = /^(?:src\/|public\/|supabase\/|scripts\/)/;
const literalMappings = [
  /\b(?:evaluation)["']?\s*:\s*\{/,
  /\b(?:answer_key|answerKey|correctAnswer|correct_answer|correctIndex|correct_index)["']?\s*:\s*["'\[\{\d]/,
  /\bcorrect["']?\s*:\s*["'\[\d]/,
  /jsonb_build_object\s*\(\s*'correct'\s*,\s*(?:'[A-Za-z0-9_-]+'|jsonb_build_array\s*\()/i,
];

export function containsPrivateMapping(text) { return literalMappings.some(pattern => pattern.test(text)); }
export function findDistributionProblems(files) {
  return files.filter(({ path, content }) => protectedRoots.test(path) &&
    /\.(?:json|sql|py|[cm]?js|tsx?|txt|html|ya?ml)$/.test(path) && containsPrivateMapping(content)).map(file => file.path);
}

export function checkChangedFiles(root, base) {
  const git = args => execFileSync('git', args, { cwd: root, encoding: 'utf8' });
  if (!base || /^0+$/.test(base)) base = git(['merge-base', 'HEAD', 'origin/main']).trim();
  if (!/^[A-Za-z0-9_./-]+$/.test(base)) throw new Error('Invalid comparison base.');
  git(['rev-parse', '--verify', base + '^{commit}']);
  const paths = [...new Set((git(['diff', '--name-only', '-z', '--diff-filter=ACMR', base, '--']) +
    git(['ls-files', '--others', '--exclude-standard', '-z'])).split('\0').filter(Boolean))];
  const files = paths.filter(path => protectedRoots.test(path)).map(path => ({ path, content: readFileSync(root + '/' + path, 'utf8') }));
  return findDistributionProblems(files);
}

export function main() {
  const problems = checkChangedFiles(process.cwd(), process.env.ACADEMY_COMPARE_BASE || process.argv[2]);
  if (problems.length) {
    console.error('Blocked new or changed files containing literal academy grading mappings:\n' + problems.join('\n'));
    console.error('Keep real answer mappings in protected server storage. No answer values were logged.');
    process.exitCode = 1;
  } else console.log('No literal grading mappings detected in new or changed distribution files. Existing public history remains a separate exposure.');
}
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  try { main(); } catch (error) { console.error('Distribution check failed: ' + error.message); process.exitCode = 1; }
}
