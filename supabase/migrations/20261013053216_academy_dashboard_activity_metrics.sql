-- Read-only dashboard metrics. Preserve XP, completion, access rules and history.
-- Refuse to overwrite a function changed since this release was reviewed.
DO $guard$
BEGIN
  IF (SELECT md5(prosrc) FROM pg_proc
      WHERE oid = 'academy_private.learning_progress()'::regprocedure)
      IS DISTINCT FROM 'eb9af08e9d8ed9f5247771d488f4b4dc' THEN
    RAISE EXCEPTION 'Dashboard progress source changed; review before applying';
  END IF;
END
$guard$;

CREATE OR REPLACE FUNCTION academy_private.learning_progress()
RETURNS jsonb
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path TO ''
AS $function$
DECLARE uid uuid := (SELECT auth.uid());
BEGIN
  IF uid IS NULL THEN
    RAISE EXCEPTION 'Authentication required' USING ERRCODE = '42501';
  END IF;
  RETURN (
    WITH activity AS MATERIALIZED (
      -- Real reading/answer submissions count as learning days, even after an
      -- editorial update. Opening a lesson alone does not create an attempt.
      SELECT a.academy_lesson_id,
        array_agg(DISTINCT (a.created_at AT TIME ZONE 'Europe/Sofia')::date
          ORDER BY (a.created_at AT TIME ZONE 'Europe/Sofia')::date) AS days
      FROM public.academy_lesson_attempts_v2 a
      WHERE a.user_id = uid
      GROUP BY a.academy_lesson_id
    ), solved AS MATERIALIZED (
      SELECT l.id AS academy_lesson_id,
        count(*) FILTER (WHERE b.block_type IN ('quiz', 'course_exam')) AS quiz_count,
        count(*) FILTER (WHERE b.block_type IN (
          'scenario', 'matching', 'sequence_sort', 'image_hotspot',
          'decision_tree', 'client_simulation', 'calculator'
        )) AS practice_count
      FROM public.academy_lessons l
      JOIN public.academy_lesson_progress p ON p.academy_lesson_id = l.id
        AND p.user_id = uid AND p.version_id = l.published_version_id
      JOIN public.academy_lesson_blocks b ON b.version_id = l.published_version_id
        AND b.required AND b.block_key = ANY(p.completed_block_keys)
      WHERE l.published_version_id IS NOT NULL AND l.status <> 'archived'
        AND academy_private.can_access(l.module_id)
        AND EXISTS (
          SELECT 1 FROM public.academy_lesson_attempts_v2 a
          WHERE a.user_id = uid AND a.academy_lesson_id = l.id
            AND a.version_id = l.published_version_id AND a.block_id = b.id
            AND a.is_correct IS TRUE
        )
      GROUP BY l.id
    )
    SELECT coalesce(jsonb_agg(jsonb_build_object(
      'module_id', l.module_id, 'lesson_id', l.lesson_id,
      'completed', p.completed_at IS NOT NULL, 'quiz_score', p.score_percent,
      'xp', coalesce(p.xp, 0), 'updated_at', p.last_activity_at,
      'quiz_count', coalesce(s.quiz_count, 0),
      'practice_count', coalesce(s.practice_count, 0),
      'activity_dates', coalesce(a.days, CASE
        -- Imported completed lessons may predate attempts. Their completion
        -- date is stable; last_activity_at can change on a mere later visit.
        WHEN p.completed_at IS NOT NULL
          THEN ARRAY[(p.completed_at AT TIME ZONE 'Europe/Sofia')::date]
        ELSE ARRAY[]::date[]
      END)
    ) ORDER BY l.module_id, l.lesson_id), '[]'::jsonb)
    FROM public.academy_lessons l
    LEFT JOIN public.academy_lesson_progress p ON p.academy_lesson_id = l.id
      AND p.user_id = uid AND p.version_id = l.published_version_id
    LEFT JOIN solved s ON s.academy_lesson_id = l.id
    LEFT JOIN activity a ON a.academy_lesson_id = l.id
    WHERE l.published_version_id IS NOT NULL AND l.status <> 'archived'
      AND academy_private.can_access(l.module_id)
  );
END
$function$;
