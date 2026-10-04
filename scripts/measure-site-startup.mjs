import { readFileSync } from 'node:fs';
import { resolve, dirname, relative } from 'node:path';
import { gzipSync } from 'node:zlib';
import ts from 'typescript';

// Measure local production assets only. Dynamic imports and third-party scripts
// are intentionally excluded; this does not replace browser LCP/INP/CLS metrics.
const root = resolve(process.argv[2] || 'out');
const html = readFileSync(resolve(root, 'index.html'), 'utf8');
const entry = html.match(/<script[^>]+type="module"[^>]+src="([^"]+)"/)?.[1];
if (!entry) throw new Error('Build the site first: no production module entry found.');
const files = new Set();
function visit(file) {
  if (relative(root, file).startsWith('..')) throw new Error('A build import points outside the output directory.');
  if (files.has(file)) return;
  files.add(file);
  const code = readFileSync(file, 'utf8');
  const source = ts.createSourceFile(file, code, ts.ScriptTarget.Latest, true, ts.ScriptKind.JS);
  for (const statement of source.statements) {
    if ((ts.isImportDeclaration(statement) || ts.isExportDeclaration(statement))
      && statement.moduleSpecifier && ts.isStringLiteral(statement.moduleSpecifier)
      && statement.moduleSpecifier.text.startsWith('.')) {
      visit(resolve(dirname(file), statement.moduleSpecifier.text));
    }
  }
}
visit(resolve(root, entry.replace(/^\//, '')));
console.log(JSON.stringify({
  initialRawBytes: [...files].reduce((total, file) => total + readFileSync(file).length, 0),
  initialGzipBytes: [...files].reduce((total, file) => total + gzipSync(readFileSync(file)).length, 0),
  initialJsFiles: files.size,
  htmlBytes: Buffer.byteLength(html),
}, null, 2));
