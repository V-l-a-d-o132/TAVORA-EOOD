import { afterAll, beforeAll, expect, test } from 'vitest';
import { readFileSync, mkdtempSync, rmSync, writeFileSync, readdirSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { randomUUID } from 'node:crypto';
import type { PGlite } from '@electric-sql/pglite';
import { actor, createSilkDatabase, STUDENT, OTHER } from './helpers/silk-road-db';
import { loadVideoAiCandidates, loadVideoAiSource } from '../scripts/prepare-video-ai-assets.mjs';
import { countVisibleLessonWords } from '../src/lib/academy-reading-time';
import { ACADEMY_READING_WORDS } from '../src/data/academy-reading-words';
const rows = loadVideoAiCandidates();
// The publication under test is historical; current reading metadata includes the later first-client edition.
const firstClientDir = 'course-assets/perfect-video/first-client/lessons';
const currentFirstClient = new Map(readdirSync(firstClientDir).filter(f=>f.endsWith('.json')).map(f=>{const l=JSON.parse(readFileSync(`${firstClientDir}/${f}`,'utf8'));return [l.lessonId,l];}));
const privateRows = process.env.VIDEO_AI_PRIVATE ? JSON.parse(readFileSync(process.env.VIDEO_AI_PRIVATE, 'utf8')) : null;
const privateSource = process.env.VIDEO_AI_SOURCE ? JSON.parse(readFileSync(process.env.VIDEO_AI_SOURCE, 'utf8')) : null;
const payload = r => privateRows?.find(x => x.lesson === r.lesson).payload || { ...r.payload, additions: r.payload.additions.map(b => b.type === 'matching' ? { ...b, evaluation: { matches: Object.fromEntries(b.content.left.map(s => [s.id, s.choices[0]])) }, feedback: { success: 'Synthetic accepted decision.', retry: 'Synthetic retry guidance.', details: Object.fromEntries(b.content.left.map(s => [s.id, { success: 'Synthetic accepted part.', retry: 'Synthetic part needs revision.' }])) } } : b) };
const practice = r => payload(r).additions.find(b => b.type === 'matching');
const versions = new Map<string, string>();
let db: PGlite, originalProgress: any, originalAttempts: any, beforeOutside: any, beforeTeaching: any, oldVersion: string, examBanks: any;
async function grade(r, matches = practice(r).evaluation.matches, attempt = randomUUID()) { return (await db.query<any>('SELECT academy_complete_lesson_block($1,$2,$3,$4,$5,$6) r', [r.module, r.lesson, versions.get(r.lesson), 'video_ai_toolcheck_20261019', { matches }, attempt])).rows[0].r; }
async function currentTeaching() { return (await db.query<any>(`SELECT l.module_id AS "moduleId",l.lesson_id,v.title,v.subtitle,v.objective,jsonb_agg(jsonb_build_object('key',b.block_key,'title',b.title,'content',b.content,'type',b.block_type) ORDER BY b.position) blocks FROM academy_lessons l JOIN academy_lesson_versions v ON v.id=l.published_version_id JOIN academy_lesson_blocks b ON b.version_id=v.id WHERE l.module_id LIKE 's02-%' GROUP BY l.module_id,l.lesson_id,v.id ORDER BY l.lesson_id`)).rows; }
async function outside() { return (await db.query(`SELECT to_jsonb(l) r FROM academy_lessons l WHERE l.module_id NOT LIKE 's02-%' ORDER BY l.id`)).rows; }
async function banks() { return (await db.query(`SELECT l.lesson_id,b.content,k.answer_key,k.feedback,k.scoring FROM academy_lessons l JOIN academy_lesson_blocks b ON b.version_id=l.published_version_id LEFT JOIN academy_private.lesson_block_keys k ON k.block_id=b.id WHERE l.module_id LIKE 's02-%' AND b.block_type='course_exam' ORDER BY l.lesson_id`)).rows; }
function syntheticKey(b) {
  if (['quiz', 'scenario'].includes(b.block_type)) return { correct: b.content.options[0].id };
  if (b.block_type === 'matching') return { matches: Object.fromEntries(b.content.left.map((s, i) => [s.id, (s.choices || b.content.right.map(x => x.id))[s.choices ? 0 : i % b.content.right.length]])) };
  if (b.block_type === 'sequence_sort') return { order: b.content.items.map(x => x.id) };
  if (b.block_type === 'course_exam') return { answers: Object.fromEntries(b.content.questions.map(q => [q.id, q.options[0].id])), criticalQuestions: b.content.questions.length === 30 ? [5, 12, 13].map(m => b.content.questions.find(q => q.moduleId === `s02-m${String(m).padStart(2, '0')}`).id) : [] };
  return null;
}
beforeAll(async () => {
  db = await createSilkDatabase();
  await db.exec(readFileSync('supabase/migrations/20260929215642_perfect_video_module_15_practical_exam.sql', 'utf8').split('DO $release$')[0]);
  await db.exec(readFileSync('supabase/migrations/20261009190315_silk_road_market_ready_publication.sql', 'utf8').split('-- PUBLISH_MARKET_CURRICULUM')[0]);
  await db.exec(readFileSync('supabase/migrations/20261010163647_perfect_video_story_first_publication.sql', 'utf8').split('-- PUBLISH_VIDEO_STORY_CURRICULUM')[0]);
  const ex = readFileSync('supabase/migrations/20261012181301_marketing_community_final_exams.sql', 'utf8'); await db.exec(ex.slice(ex.indexOf('CREATE OR REPLACE FUNCTION')));
  for (const f of ['20261015064651_practical_video_studio_payloads.sql', '20261015084105_practical_video_11_15_publication.sql', '20261015121821_practical_marketing_first_5_publication.sql', '20261015133829_practical_marketing_6_10_publication.sql', '20261015192236_practical_marketing_11_15_publication.sql', '20261015201823_practical_marketing_16_20_publication.sql', '20261016073844_practical_silk_studio_publication.sql', '20261018081531_silk_applied_materials_and_transfer.sql', '20261018142316_silk_toolkit_guides_and_checks.sql']) await db.exec(readFileSync(`supabase/migrations/${f}`, 'utf8'));
  const full = loadVideoAiSource();
  for (const l of full) {
    const id = (await db.query<any>("INSERT INTO academy_lessons(module_id,lesson_id,status) VALUES($1,$2,'draft') RETURNING id", [l.module_id, l.lesson_id])).rows[0].id;
    const v = l.version;
    const vid = (await db.query<any>(`INSERT INTO academy_lesson_versions(academy_lesson_id,version_number,title,subtitle,duration,objective,hook,estimated_minutes,source_kind,change_note,validation) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) RETURNING id`, [id, v.version_number, v.title, v.subtitle, v.duration, v.objective, v.hook, v.estimated_minutes, v.source_kind, v.change_note, v.validation])).rows[0].id;
    versions.set(l.lesson_id, vid);
    for (const b of l.blocks) {
      const bid = (await db.query<any>('INSERT INTO academy_lesson_blocks(version_id,block_key,position,block_type,title,content,required,points) VALUES($1,$2,$3,$4,$5,$6,$7,$8) RETURNING id', [vid, b.block_key, b.position, b.block_type, b.title, b.content, b.required, b.points])).rows[0].id;
      const privateKey = privateSource?.find(x => x.lesson.lesson_id === l.lesson_id)?.blocks.find(x => x.block.block_key === b.block_key)?.grading;
      const key = privateKey?.answer_key || syntheticKey(b);
      if (key) await db.query('INSERT INTO academy_private.lesson_block_keys(block_id,answer_key,feedback,scoring) VALUES($1,$2,$3,$4)', [bid, key, privateKey?.feedback || {}, privateKey?.scoring || {}]);
    }
    await db.query("UPDATE academy_lessons SET status='published',published_version_id=$2,draft_version_id=$2 WHERE id=$1", [id, vid]);
  }
  await db.exec(readFileSync(`supabase/migrations/${readdirSync('supabase/migrations').find(f => f.endsWith('_perfect_video_ai_guides_and_checks.sql'))}`, 'utf8'));
  for (const r of rows) await db.query(`INSERT INTO academy_private.video_ai_upgrades(release_key,module_id,lesson_id,expected_version_id,expected_fingerprint,payload)
  SELECT 'video_ai_20261019',l.module_id,l.lesson_id,l.published_version_id,md5(to_jsonb(l)::text||to_jsonb(v)::text||coalesce((SELECT string_agg(to_jsonb(b)::text||coalesce(to_jsonb(k)::text,''),'' ORDER BY b.position,b.id) FROM academy_lesson_blocks b LEFT JOIN academy_private.lesson_block_keys k ON k.block_id=b.id WHERE b.version_id=v.id),'')),$3
  FROM academy_lessons l JOIN academy_lesson_versions v ON v.id=l.published_version_id WHERE l.module_id=$1 AND l.lesson_id=$2`, [r.module, r.lesson, payload(r)]);
  oldVersion = versions.get('pv01-11')!;
  await actor(db, 'authenticated', STUDENT);
  await db.query("SELECT academy_complete_lesson_block('s02-m01','pv01-11',$1,'objective','{\"acknowledged\":true}',$2)", [oldVersion, randomUUID()]);
  await actor(db);
  originalProgress = (await db.query<any>('SELECT to_jsonb(p) r FROM academy_lesson_progress p WHERE user_id=$1', [STUDENT])).rows[0].r;
  originalAttempts = (await db.query('SELECT md5(to_jsonb(a)::text) h FROM academy_lesson_attempts_v2 a ORDER BY a.id')).rows;
  beforeOutside = await outside(); beforeTeaching = await currentTeaching(); examBanks = await banks();
}, 120000);
afterAll(async () => { await db?.close(); });

test('malformed final feedback and source drift roll the whole publication back', async () => {
  const r = rows.at(-1), p = payload(r), bad = structuredClone(p); delete bad.additions.find(b => b.type === 'matching').feedback.details['part-5'];
  const n = (await db.query<any>('SELECT count(*) n FROM academy_lesson_versions')).rows[0].n;
  await db.query('UPDATE academy_private.video_ai_upgrades SET payload=$1 WHERE lesson_id=$2', [bad, r.lesson]);
  await expect(db.query('SELECT academy_private.publish_video_ai()')).rejects.toThrow(/Invalid transfer/);
  expect((await db.query<any>('SELECT count(*) n FROM academy_lesson_versions')).rows[0].n).toBe(n);
  await db.query('UPDATE academy_private.video_ai_upgrades SET payload=$1 WHERE lesson_id=$2', [p, r.lesson]);
  await db.exec('BEGIN');
  try { await db.query("UPDATE academy_private.lesson_block_keys SET scoring='{\"drift\":true}' WHERE block_id=(SELECT id FROM academy_lesson_blocks WHERE version_id=$1 AND block_type='quiz' LIMIT 1)", [oldVersion]); await expect(db.query('SELECT academy_private.publish_video_ai()')).rejects.toThrow(/changed since staging/); } finally { await db.exec('ROLLBACK'); }
});

test('atomic publication preserves all 3137 old blocks, 240 openings and five exam banks while adding 75 required blocks', async () => {
  const result = (await db.query<any>('SELECT academy_private.publish_video_ai() r')).rows[0].r;
  expect(result.published).toBe(69); expect(result.addedBlocks).toBe(75);
  for (const r of (await db.query<any>("SELECT lesson_id,published_version_id FROM academy_lessons WHERE module_id LIKE 's02-%'")).rows) versions.set(r.lesson_id, r.published_version_id);
  expect((await db.query<any>('SELECT academy_private.publish_video_ai() r')).rows[0].r.alreadyPublished).toBe(true);
  const changed = (await db.query<any>(`SELECT count(*) n FROM academy_lessons l JOIN academy_lesson_versions v ON v.id=l.published_version_id JOIN academy_lesson_blocks old ON old.version_id=v.origin_version_id LEFT JOIN academy_lesson_blocks b ON b.version_id=v.id AND b.block_key=old.block_key LEFT JOIN academy_private.lesson_block_keys ok ON ok.block_id=old.id LEFT JOIN academy_private.lesson_block_keys nk ON nk.block_id=b.id WHERE v.validation->>'videoAiEdition'='video_ai_20261019' AND (b.id IS NULL OR ROW(b.block_type,b.title,b.content,b.required,b.points,nk.answer_key,nk.feedback,nk.scoring) IS DISTINCT FROM ROW(old.block_type,old.title,old.content,old.required,old.points,ok.answer_key,ok.feedback,ok.scoring))`)).rows[0].n;
  expect(changed).toBe(0); expect(await outside()).toEqual(beforeOutside); expect(await banks()).toEqual(examBanks);
  expect(examBanks).toHaveLength(5); expect(examBanks.reduce((n, b) => n + b.content.questions.length, 0)).toBe(78);
  const after = await currentTeaching(); expect(after).toHaveLength(240); expect(after.reduce((n, l) => n + l.blocks.length, 0)).toBe(3212);
  for (const l of after) expect(ACADEMY_READING_WORDS[`${l.moduleId}/${l.lesson_id}`]).toBe(countVisibleLessonWords(currentFirstClient.get(l.lesson_id) || l));
  for (const [i, l] of after.entries()) expect(l.blocks.find(b => b.type === 'objective')).toEqual(beforeTeaching[i].blocks.find(b => b.type === 'objective'));
  const beforeWords = beforeTeaching.reduce((n, l) => n + countVisibleLessonWords(l), 0), afterWords = after.reduce((n, l) => n + countVisibleLessonWords(l), 0);
  expect(afterWords).toBeGreaterThan(beforeWords);
  expect(afterWords).toBe(304303); // Recorded size of the unchanged video_ai_20261019 edition.
  if (process.env.VIDEO_AI_METRICS) writeFileSync(process.env.VIDEO_AI_METRICS, JSON.stringify({ wordsBefore: beforeWords, wordsAfter: afterWords, lessons: 240, newBlocks: 75, guides: 60, cases: 15, decisions: 61, perLesson: Object.fromEntries(after.map(l => [`${l.moduleId}/${l.lesson_id}`, countVisibleLessonWords(l)])) }, null, 2));
});

test('progress and historical attempts survive; new steps receive no automatic credit', async () => {
  const p = (await db.query<any>('SELECT to_jsonb(p) r FROM academy_lesson_progress p WHERE user_id=$1', [STUDENT])).rows[0].r;
  expect(p.version_id).not.toBe(oldVersion); expect(p.completed_block_keys).toEqual(['objective']); expect(p.completed_at).toBeNull();
  expect((await db.query<any>('SELECT snapshot FROM academy_private.lesson_progress_history WHERE user_id=$1 AND version_id=$2', [STUDENT, oldVersion])).rows[0].snapshot).toEqual(originalProgress);
  expect((await db.query('SELECT md5(to_jsonb(a)::text) h FROM academy_lesson_attempts_v2 a ORDER BY a.id')).rows).toEqual(originalAttempts);
});

test('all 61 decisions accept reviewed maps and reject both alternative choices separately with private feedback', async () => {
  await actor(db, 'authenticated', STUDENT);
  for (const r of rows.filter(r => practice(r))) {
    const b = practice(r), map = b.evaluation.matches, good = await grade(r); expect(good.correct, r.lesson).toBe(true); expect(good.feedback.details.every(d => d.correct)).toBe(true);
    for (const slot of b.content.left) for (const alternative of slot.choices.filter(id => id !== map[slot.id])) {
      const result = await grade(r, { ...map, [slot.id]: alternative }); expect(result.correct).toBe(false); expect(result.feedback.complete).toBe(false); expect(result.feedback.details.filter(d => !d.correct)).toHaveLength(1);
      expect(result.feedback).not.toHaveProperty('answer'); expect(result.feedback).not.toHaveProperty('evaluation'); expect(result.feedback).not.toHaveProperty('answer_key');
    }
  }
  await actor(db);
}, 120000);

test('paid access, owner-only staging, stale writes, open input and replay protections remain enforced', async () => {
  const r = rows.find(r => r.lesson === 'pv01-24'), map = practice(r).evaluation.matches;
  for (const role of ['anon', 'authenticated']) { await actor(db, role, role === 'anon' ? '' : OTHER); await expect(grade(r)).rejects.toThrow(/Access denied/); await expect(db.query('SELECT * FROM academy_private.video_ai_upgrades')).rejects.toThrow(/permission denied/); await expect(db.query('SELECT academy_private.publish_video_ai()')).rejects.toThrow(/permission denied/); }
  await actor(db, 'authenticated', STUDENT);
  for (const extra of [{ text: 'No free response' }, { file: 'data:audio/wav;base64,AAAA' }, { url: 'https://example.invalid' }, { number: 5 }]) await expect(db.query('SELECT academy_complete_lesson_block($1,$2,$3,$4,$5,$6)', [r.module, r.lesson, versions.get(r.lesson), 'video_ai_toolcheck_20261019', { matches: map, ...extra }, randomUUID()])).rejects.toThrow(/Unexpected/);
  await expect(db.query("SELECT academy_complete_lesson_block('s02-m01','pv01-11',$1,'objective','{\"acknowledged\":true}',$2)", [oldVersion, randomUUID()])).rejects.toThrow(/version changed/);
  const id = randomUUID(), one = await grade(r, map, id), two = await grade(r, map, id); expect(two).toEqual(one);
  await actor(db);
});

test('the final exam requires both retained practice and the independent new case at public and private entries', async () => {
  const r = rows.find(r => r.lesson === 'pv15-13'), v = versions.get(r.lesson);
  await actor(db, 'authenticated', STUDENT);
  // The earlier decision test passed this case; remove only its synthetic fixture credit.
  await actor(db, 'postgres', STUDENT);
  await db.query("UPDATE academy_lesson_progress SET completed_block_keys=array_remove(completed_block_keys,'video_ai_toolcheck_20261019') WHERE user_id=$1 AND version_id=$2", [STUDENT, v]);
  const old = (await db.query<any>("SELECT b.block_key,k.answer_key FROM academy_lesson_blocks b JOIN academy_private.lesson_block_keys k ON k.block_id=b.id WHERE b.version_id=$1 AND b.block_key='practical_studio_final_20261015'", [v])).rows[0];
  const ex = (await db.query<any>("SELECT b.block_key,k.answer_key FROM academy_lesson_blocks b JOIN academy_private.lesson_block_keys k ON k.block_id=b.id WHERE b.version_id=$1 AND b.block_type='course_exam'", [v])).rows[0];
  await actor(db, 'authenticated', STUDENT);
  await db.query('SELECT academy_complete_lesson_block($1,$2,$3,$4,$5,$6)', [r.module, r.lesson, v, old.block_key, old.answer_key, randomUUID()]);
  await expect(db.query('SELECT academy_submit_course_exam($1,$2,$3,$4,$5,$6)', [r.module, r.lesson, v, ex.block_key, { answers: ex.answer_key.answers }, randomUUID()])).rejects.toThrow(/практическото решение/);
  await actor(db, 'postgres', STUDENT);
  await expect(db.query('SELECT academy_private.submit_perfect_video_exam($1,$2,$3,$4,$5,$6)', [r.module, r.lesson, v, ex.block_key, { answers: ex.answer_key.answers }, randomUUID()])).rejects.toThrow(/практическото решение/);
  await actor(db, 'authenticated', STUDENT); await grade(r);
  await actor(db, 'postgres', STUDENT); await expect(db.query('SELECT academy_private.assert_video_practice_ready($1,$2,$3)', [r.module, r.lesson, v])).resolves.toBeTruthy();
  expect((await db.query<any>("SELECT md5(prosrc) h FROM pg_proc WHERE oid='academy_private.submit_perfect_video_exam(text,text,uuid,text,jsonb,uuid)'::regprocedure")).rows[0].h).toBe('301524dae39043704201ab87a7466394');
});
