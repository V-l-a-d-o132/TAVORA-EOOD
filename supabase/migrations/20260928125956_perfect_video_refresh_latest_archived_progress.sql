-- A learner autosaved the older lesson edition after the initial history backfill.
-- Refresh the archived snapshot for every learner still on an older published version.
UPDATE academy_private.lesson_progress_history h
SET snapshot=to_jsonb(p),
    archived_at=clock_timestamp(),
    reason='pre_publish_v42_latest'
FROM public.academy_lesson_progress p
JOIN public.academy_lessons l ON l.id=p.academy_lesson_id
WHERE h.user_id=p.user_id
  AND h.academy_lesson_id=p.academy_lesson_id
  AND h.version_id=p.version_id
  AND l.module_id IN ('s02-m01','s02-m02','s02-m03')
  AND p.version_id IS DISTINCT FROM l.published_version_id
  AND h.snapshot IS DISTINCT FROM to_jsonb(p);
