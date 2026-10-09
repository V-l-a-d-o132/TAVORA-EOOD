import { readFileSync } from 'node:fs';
import { PGlite } from '@electric-sql/pglite';
import { expect, test } from 'vitest';

test('Silk Road staging rejects other courses and is unavailable to API roles', async () => {
  const db = new PGlite();
  try {
    await db.exec(`
      CREATE ROLE anon; CREATE ROLE authenticated; CREATE ROLE service_role;
      CREATE SCHEMA academy_private;
      CREATE TABLE public.academy_lesson_versions (id uuid PRIMARY KEY);
      INSERT INTO public.academy_lesson_versions VALUES ('00000000-0000-4000-8000-000000000001');
    `);
    await db.exec(readFileSync('supabase/migrations/20261008104746_silk_road_closed_learning_release.sql', 'utf8'));
    const insert = `INSERT INTO academy_private.silk_road_release_lessons
      (release_key,module_id,lesson_id,expected_version_id,payload)
      VALUES ('silk_road_closed_learning_20261008',$1,'l01-01',
      '00000000-0000-4000-8000-000000000001',$2)`;
    const payload = (module: string) => JSON.stringify({
      module, lesson: 'l01-01', change_note: 'silk_road_closed_learning_20261008', blocks: [],
    });
    await expect(db.query(insert, ['s02-m01', payload('s02-m01')])).rejects.toThrow();
    await expect(db.query(insert, ['s01-m01', payload('s01-m02')])).rejects.toThrow();
    await db.query(insert, ['s01-m01', payload('s01-m01')]);
    const permissions = await db.query<{ role: string; readable: boolean; writable: boolean }>(`
      SELECT r AS role,
        has_table_privilege(r, 'academy_private.silk_road_release_lessons', 'SELECT') AS readable,
        has_table_privilege(r, 'academy_private.silk_road_release_lessons', 'INSERT') AS writable
      FROM unnest(ARRAY['anon','authenticated','service_role']) r`);
    expect(permissions.rows).toHaveLength(3);
    expect(permissions.rows.every(row => !row.readable && !row.writable)).toBe(true);
    const rls = await db.query<{ relrowsecurity: boolean; relforcerowsecurity: boolean }>(`
      SELECT relrowsecurity, relforcerowsecurity FROM pg_class
      WHERE oid='academy_private.silk_road_release_lessons'::regclass`);
    expect(rls.rows[0]).toEqual({ relrowsecurity: true, relforcerowsecurity: true });
  } finally {
    await db.close();
  }
});
