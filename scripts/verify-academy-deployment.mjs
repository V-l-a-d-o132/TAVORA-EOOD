import { readFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
import { parseBuildManifest, verifyHostedBuild } from './lib/academy-build.mjs';

export async function main(args = process.argv.slice(2)) {
  if (args.length !== 2) throw new Error('Usage: node scripts/verify-academy-deployment.mjs https://imashnujnoto.com out/academy-build.json');
  const expected = parseBuildManifest(readFileSync(args[1], 'utf8'));
  const result = await verifyHostedBuild(args[0], expected);
  console.log('Публикуваният сайт зарежда проверената версия. Отпечатък: ' + result.sourceHash);
}
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch(error => { console.error('Публикацията не е потвърдена: ' + error.message); process.exitCode = 1; });
}
