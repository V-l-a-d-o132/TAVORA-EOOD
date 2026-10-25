import { afterAll, beforeAll, expect, test } from 'vitest';
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { randomUUID } from 'node:crypto';
import type { PGlite } from '@electric-sql/pglite';
import { actor, createSilkDatabase, STUDENT, OTHER } from './helpers/silk-road-db';
import { loadMarketingSequenceCandidates, loadMarketingSequenceSource } from '../scripts/prepare-marketing-sequence-assets.mjs';
import { countVisibleLessonWords } from '../src/lib/academy-reading-time';
import { ACADEMY_READING_WORDS } from '../src/data/academy-reading-words';
const rows = loadMarketingSequenceCandidates();
const cases = rows.filter(r => r.payload.additions.some(b => b.type === 'matching'));
const privateRows = process.env.MARKETING_SEQUENCE_PRIVATE ? JSON.parse(readFileSync(process.env.MARKETING_SEQUENCE_PRIVATE, 'utf8')) : null;
const privateSource = process.env.MARKETING_SEQUENCE_SOURCE ? JSON.parse(readFileSync(process.env.MARKETING_SEQUENCE_SOURCE, 'utf8')) : null;
const payload = r => privateRows?.find(x => x.lesson === r.lesson).payload || { ...r.payload, additions: r.payload.additions.map(b => b.type === 'matching' ? { ...b, evaluation: { matches: Object.fromEntries(b.content.left.map(s => [s.id, s.choices[0]])) }, feedback: { success: 'Synthetic accepted decision.', retry: 'Synthetic retry guidance.', details: Object.fromEntries(b.content.left.map(s => [s.id, { success: 'Synthetic accepted part.', retry: 'Synthetic part needs revision.' }])) } } : b) };
const practice = r => payload(r).additions.find(b => b.type === 'matching');
const versions = new Map<string, string>();
let db: PGlite, originalProgress: any, originalAttempts: any, beforeOutside: any, beforeTeaching: any, oldVersion: string;
async function grade(r, matches = practice(r).evaluation.matches, attempt = randomUUID()) { return (await db.query<any>('SELECT academy_complete_lesson_block($1,$2,$3,$4,$5,$6) r', [r.module, r.lesson, versions.get(r.lesson), 'marketing_route_case_20261025', { matches }, attempt])).rows[0].r; }
async function currentTeaching() { return (await db.query<any>(`SELECT l.module_id AS "moduleId",l.lesson_id,v.title,v.subtitle,v.objective,jsonb_agg(jsonb_build_object('key',b.block_key,'title',b.title,'content',b.content,'type',b.block_type) ORDER BY b.position) blocks FROM academy_lessons l JOIN academy_lesson_versions v ON v.id=l.published_version_id JOIN academy_lesson_blocks b ON b.version_id=v.id WHERE l.lesson_id IN (SELECT lesson_id FROM academy_private.marketing_sequence_first_ten_upgrades) GROUP BY l.module_id,l.lesson_id,v.id ORDER BY l.lesson_id`)).rows; }
async function outside() { return (await db.query(`SELECT to_jsonb(l) l,to_jsonb(v) v,to_jsonb(b) b,to_jsonb(k) k FROM academy_lessons l JOIN academy_lesson_versions v ON v.id=l.published_version_id JOIN academy_lesson_blocks b ON b.version_id=v.id LEFT JOIN academy_private.lesson_block_keys k ON k.block_id=b.id WHERE l.lesson_id NOT IN(SELECT lesson_id FROM academy_private.marketing_sequence_first_ten_upgrades) ORDER BY l.id,b.id`)).rows; }
function syntheticKey(b) {
  if (['quiz', 'scenario'].includes(b.block_type)) return { correct: b.content.options[0].id };
  if (b.block_type === 'matching') return { matches: Object.fromEntries(b.content.left.map((s, i) => [s.id, (s.choices || b.content.right.map(x => x.id))[s.choices ? 0 : i % b.content.right.length]])) };
  if (b.block_type === 'sequence_sort') return { order: b.content.items.map(x => x.id) };
  if (b.block_type === 'course_exam') return { answers: Object.fromEntries(b.content.questions.map(q => [q.id, q.options[0].id])), criticalQuestions: [] };
  return null;
}
beforeAll(async () => {
  db = await createSilkDatabase();
  await db.exec(readFileSync('supabase/migrations/20260929215642_perfect_video_module_15_practical_exam.sql', 'utf8').split('DO $release$')[0]);
  await db.exec(readFileSync('supabase/migrations/20261009190315_silk_road_market_ready_publication.sql', 'utf8').split('-- PUBLISH_MARKET_CURRICULUM')[0]);
  await db.exec(readFileSync('supabase/migrations/20261010163647_perfect_video_story_first_publication.sql', 'utf8').split('-- PUBLISH_VIDEO_STORY_CURRICULUM')[0]);
  const ex = readFileSync('supabase/migrations/20261012181301_marketing_community_final_exams.sql', 'utf8'); await db.exec(ex.slice(ex.indexOf('CREATE OR REPLACE FUNCTION')));
  for (const f of ['20261015064651_practical_video_studio_payloads.sql', '20261015084105_practical_video_11_15_publication.sql', '20261015121821_practical_marketing_first_5_publication.sql', '20261015133829_practical_marketing_6_10_publication.sql', '20261015192236_practical_marketing_11_15_publication.sql', '20261015201823_practical_marketing_16_20_publication.sql', '20261016073844_practical_silk_studio_publication.sql', '20261018081531_silk_applied_materials_and_transfer.sql', '20261018142316_silk_toolkit_guides_and_checks.sql', '20261019074909_perfect_video_ai_guides_and_checks.sql','20261019173331_marketing_ai_first_five_guides_and_checks.sql','20261020082612_marketing_ai_next_five_guides_and_checks.sql','20261020115403_marketing_ai_final_ten_guides_and_checks.sql']) await db.exec(readFileSync(`supabase/migrations/${f}`, 'utf8'));
  const full = loadMarketingSequenceSource();
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
  await db.exec(readFileSync(`supabase/migrations/${readdirSync('supabase/migrations').find(f => f.endsWith('_marketing_sequence_first_ten.sql'))}`, 'utf8'));
  for (const r of rows) await db.query(`INSERT INTO academy_private.marketing_sequence_first_ten_upgrades(release_key,module_id,lesson_id,expected_version_id,expected_fingerprint,payload)
  SELECT 'marketing_sequence_first_ten_20261025',l.module_id,l.lesson_id,l.published_version_id,md5(to_jsonb(l)::text||to_jsonb(v)::text||coalesce((SELECT string_agg(to_jsonb(b)::text||coalesce(to_jsonb(k)::text,''),'' ORDER BY b.position,b.id) FROM academy_lesson_blocks b LEFT JOIN academy_private.lesson_block_keys k ON k.block_id=b.id WHERE b.version_id=v.id),'')),$3
  FROM academy_lessons l JOIN academy_lesson_versions v ON v.id=l.published_version_id WHERE l.module_id=$1 AND l.lesson_id=$2`, [r.module, r.lesson, payload(r)]);
  oldVersion = versions.get('lm01-01')!;
  await actor(db, 'authenticated', STUDENT);
  await db.query("SELECT academy_complete_lesson_block('s03-m01','lm01-01',$1,'outcome','{\"acknowledged\":true}',$2)", [oldVersion, randomUUID()]);
  await actor(db);
  originalProgress = (await db.query<any>('SELECT to_jsonb(p) r FROM academy_lesson_progress p WHERE user_id=$1', [STUDENT])).rows[0].r;
  originalAttempts = (await db.query('SELECT md5(to_jsonb(a)::text) h FROM academy_lesson_attempts_v2 a ORDER BY a.id')).rows;
  beforeOutside = await outside(); beforeTeaching = await currentTeaching();
}, 120000);
afterAll(async () => { await db?.close(); });

test('missing final feedback and a changed source roll the entire publication back', async () => {
  const r = cases.at(-1), bad = structuredClone(payload(r)), check = bad.additions.find(b => b.type === 'matching');
  delete check.feedback.details[check.content.left.at(-1).id];
  const n = (await db.query<any>('SELECT count(*) n FROM academy_lesson_versions')).rows[0].n;
  await db.query('UPDATE academy_private.marketing_sequence_first_ten_upgrades SET payload=$1 WHERE lesson_id=$2', [bad, r.lesson]);
  await expect(db.query('SELECT academy_private.publish_marketing_sequence_first_ten()')).rejects.toThrow(/Invalid transfer/);
  expect((await db.query<any>('SELECT count(*) n FROM academy_lesson_versions')).rows[0].n).toBe(n);
  await db.query('UPDATE academy_private.marketing_sequence_first_ten_upgrades SET payload=$1 WHERE lesson_id=$2', [payload(r), r.lesson]);
  await db.exec('BEGIN');
  try {
    await db.query("UPDATE academy_private.lesson_block_keys SET scoring='{\"drift\":true}' WHERE block_id=(SELECT id FROM academy_lesson_blocks WHERE version_id=$1 AND block_type='quiz' LIMIT 1)", [oldVersion]);
    await expect(db.query('SELECT academy_private.publish_marketing_sequence_first_ten()')).rejects.toThrow(/changed since staging/);
  } finally { await db.exec('ROLLBACK'); }
});

test('publishes 104 linked lessons and ten guides and cases, retaining old blocks and grading', async () => {
  const result = (await db.query<any>('SELECT academy_private.publish_marketing_sequence_first_ten() r')).rows[0].r;
  expect(result.published).toBe(104); expect(result.addedBlocks).toBe(20);
  for (const r of (await db.query<any>("SELECT lesson_id,published_version_id FROM academy_lessons WHERE module_id LIKE 's03-%'")).rows) versions.set(r.lesson_id, r.published_version_id);
  expect((await db.query<any>('SELECT academy_private.publish_marketing_sequence_first_ten() r')).rows[0].r.alreadyPublished).toBe(true);
  const changed = (await db.query<any>(`SELECT count(*) n FROM academy_lessons l JOIN academy_lesson_versions v ON v.id=l.published_version_id JOIN academy_lesson_blocks old ON old.version_id=v.origin_version_id LEFT JOIN academy_lesson_blocks b ON b.version_id=v.id AND b.block_key=old.block_key LEFT JOIN academy_private.lesson_block_keys ok ON ok.block_id=old.id LEFT JOIN academy_private.lesson_block_keys nk ON nk.block_id=b.id WHERE v.validation->>'marketingSequenceEdition'='marketing_sequence_first_ten_20261025' AND (b.id IS NULL OR ROW(b.block_type,b.title,b.required,nk.answer_key,nk.feedback,nk.scoring) IS DISTINCT FROM ROW(old.block_type,old.title,old.required,ok.answer_key,ok.feedback,ok.scoring))`)).rows[0].n;
  expect(changed).toBe(0); expect(await outside()).toEqual(beforeOutside);
  const after = await currentTeaching(); expect(after).toHaveLength(104);
  expect(beforeTeaching.reduce((n, l) => n + l.blocks.length, 0)).toBe(1969);
  expect(after.reduce((n, l) => n + l.blocks.length, 0)).toBe(1989);
  for (const l of after) expect(ACADEMY_READING_WORDS[`${l.moduleId}/${l.lesson_id}`], l.lesson_id).toBe(countVisibleLessonWords(l));
  for (const l of after) { const r = rows.find(r => r.lesson === l.lesson_id); for (const a of r.payload.amendments) expect(l.blocks.find(b => b.key === a.key).content).toEqual(a.content); }
  const beforeWords = beforeTeaching.reduce((n, l) => n + countVisibleLessonWords(l), 0), afterWords = after.reduce((n, l) => n + countVisibleLessonWords(l), 0);
  expect(beforeWords).toBe(208113); expect(afterWords).toBeGreaterThan(beforeWords);
});

test('old progress, XP and attempts survive; new work receives no automatic credit', async () => {
  const p = (await db.query<any>('SELECT to_jsonb(p) r FROM academy_lesson_progress p WHERE user_id=$1', [STUDENT])).rows[0].r;
  expect(p.version_id).not.toBe(oldVersion); expect(p.completed_block_keys).toEqual([]); expect(p.xp).toBe(0); expect(p.completed_at).toBeNull();
  expect(p.completed_block_keys).not.toContain('marketing_route_case_20261025');
  expect((await db.query<any>('SELECT snapshot FROM academy_private.lesson_progress_history WHERE user_id=$1 AND version_id=$2', [STUDENT, oldVersion])).rows[0].snapshot).toEqual(originalProgress);
  expect((await db.query('SELECT md5(to_jsonb(a)::text) h FROM academy_lesson_attempts_v2 a ORDER BY a.id')).rows).toEqual(originalAttempts);
});

test('all 70 reviewed decisions accept reviewed answers and reject both alternatives with private, per-decision feedback', async () => {
  await actor(db, 'authenticated', STUDENT);
  for (const r of cases) {
    const b = practice(r), map = b.evaluation.matches, good = await grade(r);
    expect(good.correct, r.lesson).toBe(true); expect(good.feedback.details.every(d => d.correct)).toBe(true);
    for (const [i, slot] of b.content.left.entries()) {
      expect(good.feedback.details[i].note).toBe(b.feedback.details[slot.id].success);
      for (const alternative of slot.choices.filter(id => id !== map[slot.id])) {
        const result = await grade(r, { ...map, [slot.id]: alternative });
        expect(result.correct, r.lesson).toBe(false); expect(result.feedback.complete).toBe(false);
        expect(result.feedback.details.filter(d => !d.correct)).toHaveLength(1);
        expect(result.feedback.details[i].note).toBe(b.feedback.details[slot.id].retry);
        for (const key of ['answer', 'answers', 'matches', 'evaluation', 'answer_key']) expect(result.feedback).not.toHaveProperty(key);
      }
    }
  }
  await actor(db);
}, 120000);

test('paid access, private staging, stale writes, no open input, autosave and replay protection stay enforced', async () => {
  const r = cases[0], map = practice(r).evaluation.matches, version = versions.get(r.lesson), key = 'marketing_route_case_20261025';
  for (const role of ['anon', 'authenticated']) {
    await actor(db, role, role === 'anon' ? '' : OTHER);
    await expect(grade(r)).rejects.toThrow(/Access denied/);
    await expect(db.query('SELECT * FROM academy_private.marketing_sequence_first_ten_upgrades')).rejects.toThrow(/permission denied/);
    await expect(db.query('SELECT academy_private.publish_marketing_sequence_first_ten()')).rejects.toThrow(/permission denied/);
  }
  await actor(db, 'authenticated', STUDENT);
  for (const extra of [{ text: 'No free response' }, { file: 'data:audio/wav;base64,AAAA' }, { url: 'https://example.invalid' }, { number: 5 }]) {
    await expect(db.query('SELECT academy_complete_lesson_block($1,$2,$3,$4,$5,$6)', [r.module, r.lesson, version, key, { matches: map, ...extra }, randomUUID()])).rejects.toThrow(/Unexpected/);
    await expect(db.query('SELECT academy_autosave_lesson($1,$2,$3,$4,$5)', [r.module, r.lesson, version, key, { [key]: { matches: map, ...extra } }])).rejects.toThrow(/Unexpected/);
  }
  const first = practice(r).content.left[0];
  await db.query('SELECT academy_autosave_lesson($1,$2,$3,$4,$5)', [r.module, r.lesson, version, key, { [key]: { matches: { [first.id]: map[first.id] } } }]);
  await expect(db.query("SELECT academy_complete_lesson_block('s03-m01','lm01-01',$1,'outcome','{\"acknowledged\":true}',$2)", [oldVersion, randomUUID()])).rejects.toThrow(/version changed/);
  const id = randomUUID(), one = await grade(r, map, id), two = await grade(r, map, id); expect(two).toEqual(one);
  await actor(db);
});

test('the scoped feedback hook preserves other-course grading', async () => {
  await actor(db, 'postgres', STUDENT);
  const old = (await db.query<any>("SELECT l.module_id,l.lesson_id,l.published_version_id,b.block_key,k.answer_key FROM academy_lessons l JOIN academy_lesson_blocks b ON b.version_id=l.published_version_id JOIN academy_private.lesson_block_keys k ON k.block_id=b.id WHERE l.module_id='s01-m01' AND b.block_type='quiz' LIMIT 1")).rows[0];
  await actor(db, 'authenticated', STUDENT);
  const result = (await db.query<any>('SELECT academy_complete_lesson_block($1,$2,$3,$4,$5,$6) r',[old.module_id,old.lesson_id,old.published_version_id,old.block_key,{answer:old.answer_key.correct},randomUUID()])).rows[0].r;
  expect(result.correct).toBe(true);expect(result.feedback).not.toHaveProperty('details');await actor(db);
});

test('all ten client-case lessons can be completed with the retained work and new required guide and case', async () => {
  for (const r of cases) {
    await actor(db, 'postgres', STUDENT);
    const blocks = (await db.query<any>('SELECT b.*,k.answer_key FROM academy_lesson_blocks b LEFT JOIN academy_private.lesson_block_keys k ON k.block_id=b.id WHERE b.version_id=$1 AND b.required ORDER BY b.position', [versions.get(r.lesson)])).rows;
    await actor(db, 'authenticated', STUDENT);
    for (const b of blocks) {
      const p = b.block_type === 'quiz' ? {answer:b.answer_key.correct} : b.block_type === 'scenario' ? {selected:b.answer_key.correct} : b.block_type === 'matching' ? {matches:b.answer_key.matches} : b.block_type === 'sequence_sort' ? {order:b.answer_key.order} : b.block_type === 'checklist' ? {checked:b.content.items.map(i=>i.id)} : b.block_type === 'step_reveal' ? {revealed:b.content.steps.map(i=>i.id)} : b.block_type === 'flip_cards' ? {viewed:b.content.cards.map(i=>i.id)} : {acknowledged:true};
      const result = (await db.query<any>('SELECT academy_complete_lesson_block($1,$2,$3,$4,$5,$6) r',[r.module,r.lesson,versions.get(r.lesson),b.block_key,p,randomUUID()])).rows[0].r;
      expect(result.feedback.complete,`${r.lesson}/${b.block_key}`).toBe(true);
    }
  }
  await actor(db);
  expect((await db.query<any>("SELECT count(*) n FROM academy_lesson_progress p JOIN academy_lessons l ON l.id=p.academy_lesson_id WHERE p.user_id=$1 AND p.version_id=l.published_version_id AND p.completed_at IS NOT NULL AND l.lesson_id IN(SELECT lesson_id FROM academy_private.marketing_sequence_first_ten_upgrades)",[STUDENT])).rows[0].n).toBe(10);
}, 120000);

