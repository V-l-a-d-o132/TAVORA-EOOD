import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';
import {gunzipSync} from 'node:zlib';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
export function loadPracticalSilkCandidates(edition='practical-20261016'){
  if(!['practical-20261016','applied-20261018','toolkit-20261018'].includes(edition))throw Error('Invalid Silk Road edition');
  const dir=resolve(root,`course-assets/silk-road/${edition}`);
  const manifest=JSON.parse(readFileSync(resolve(dir,'manifest.json'),'utf8'));
  if(!Array.isArray(manifest.parts)||!manifest.parts.length)throw Error('Missing Silk Road curriculum');
  const zipped=Buffer.from(manifest.parts.map(name=>{if(!/^curriculum\.\d{3}\.base64$/.test(name))throw Error('Invalid Silk Road asset path');return readFileSync(resolve(dir,name),'utf8').trim();}).join(''),'base64');
  if(zipped.length!==manifest.bytes||createHash('sha256').update(zipped).digest('hex')!==manifest.sha256)throw Error('Silk Road asset integrity failed');
  const bytes=gunzipSync(zipped);
  if(bytes.length!==manifest.decodedBytes||createHash('sha256').update(bytes).digest('hex')!==manifest.decodedSha256)throw Error('Decoded Silk Road integrity failed');
  return JSON.parse(bytes.toString('utf8'));
}
export function preparePracticalSilkAssets(){
  const lessons=loadPracticalSilkCandidates();
  if(lessons.length!==74)throw Error('Incomplete Silk Road curriculum');
  mkdirSync(resolve(root,'scripts/silk-road/releases'),{recursive:true});
  writeFileSync(resolve(root,'scripts/silk-road/releases/practical-20261016.json'),JSON.stringify(lessons,null,2)+'\n');
  const applied=loadPracticalSilkCandidates('applied-20261018');
  if(applied.length!==74)throw Error('Incomplete applied Silk Road curriculum');
  writeFileSync(resolve(root,'scripts/silk-road/releases/applied-20261018.json'),JSON.stringify(applied,null,2)+'\n');
  const toolkit=loadPracticalSilkCandidates('toolkit-20261018');
  if(toolkit.length!==74)throw Error('Incomplete Silk Road toolkit');
  writeFileSync(resolve(root,'scripts/silk-road/releases/toolkit-20261018.json'),JSON.stringify(toolkit,null,2)+'\n');
}
if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url)){preparePracticalSilkAssets();process.stdout.write('Prepared and verified practical Silk Road curriculum.\n');}
