-- Publish the reviewed v4.2 editions of Perfect Video modules 1–3 atomically.
-- Existing versions, attempts and learner progress remain untouched.
DO $publish$
DECLARE
  lesson_row public.academy_lessons;
  version_row public.academy_lesson_versions;
  current_validation jsonb;
  total integer := 0;
  affected integer;
  n_blocks integer;
  n_required integer;
  n_quizzes integer;
  n_scenarios integer;
  n_sorts integer;
  n_keys integer;
  n_open_answers integer;
BEGIN
  FOR lesson_row IN
    SELECT * FROM public.academy_lessons
    WHERE module_id IN ('s02-m01','s02-m02','s02-m03')
    ORDER BY module_id, lesson_id FOR UPDATE
  LOOP
    total := total + 1;
    SELECT * INTO version_row
    FROM public.academy_lesson_versions
    WHERE id=lesson_row.draft_version_id AND academy_lesson_id=lesson_row.id;
    IF version_row.id IS NULL
       OR lesson_row.status IS DISTINCT FROM 'published'
       OR lesson_row.published_version_id IS NULL
       OR lesson_row.published_version_id=lesson_row.draft_version_id
       OR coalesce(version_row.change_note,'') NOT LIKE 'Редакционна версия v4.2:%' THEN
      RAISE EXCEPTION 'Unexpected lesson or draft version in %/%',
        lesson_row.module_id,lesson_row.lesson_id;
    END IF;

    SELECT count(*),
           count(*) FILTER (WHERE b.required),
           count(*) FILTER (WHERE b.block_type='quiz'),
           count(*) FILTER (WHERE b.block_type='scenario'),
           count(*) FILTER (WHERE b.block_type='sequence_sort'),
           count(k.block_id),
           count(*) FILTER (WHERE b.block_type IN ('practical_response','reflection','homework','submission','prompt_builder'))
    INTO n_blocks,n_required,n_quizzes,n_scenarios,n_sorts,n_keys,n_open_answers
    FROM public.academy_lesson_blocks b
    LEFT JOIN academy_private.lesson_block_keys k ON k.block_id=b.id
    WHERE b.version_id=version_row.id;

    IF n_blocks<>15 OR n_required<>13 OR n_quizzes<>2
       OR n_scenarios<>2 OR n_sorts<>1 OR n_keys<>5 OR n_open_answers<>0
       OR EXISTS (
         SELECT 1 FROM public.academy_lesson_blocks b
         JOIN academy_private.lesson_block_keys k ON k.block_id=b.id
         WHERE b.version_id=version_row.id AND b.block_type IN ('quiz','scenario')
           AND NOT EXISTS (
             SELECT 1 FROM jsonb_array_elements(b.content->'options') o
             WHERE o->>'id'=k.answer_key->>'correct'
           )
       ) THEN
      RAISE EXCEPTION 'Content structure or answer key changed in %/%',
        lesson_row.module_id,lesson_row.lesson_id;
    END IF;

    current_validation:=academy_private.lesson_validation(version_row.id);
    IF current_validation IS DISTINCT FROM version_row.validation
       OR jsonb_array_length(current_validation->'errors')<>0
       OR jsonb_array_length(current_validation->'warnings')<>0 THEN
      RAISE EXCEPTION 'Lesson validation changed in %/%',
        lesson_row.module_id,lesson_row.lesson_id;
    END IF;
  END LOOP;

  IF total<>65 OR
     (SELECT count(*) FROM public.academy_lessons WHERE module_id='s02-m01')<>24 OR
     (SELECT count(*) FROM public.academy_lessons WHERE module_id='s02-m02')<>20 OR
     (SELECT count(*) FROM public.academy_lessons WHERE module_id='s02-m03')<>21 THEN
    RAISE EXCEPTION 'Expected exactly 24 + 20 + 21 lessons, got %',total;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger
    WHERE tgrelid='public.academy_lesson_progress'::regclass
      AND tgname='archive_academy_lesson_progress_version'
      AND NOT tgisinternal
  ) OR NOT EXISTS (
    SELECT 1 FROM pg_class
    WHERE oid='academy_private.lesson_progress_history'::regclass
      AND relrowsecurity
  ) OR position(
    'complete:=coalesce(correct,true)' IN
    pg_get_functiondef('academy_private.complete_lesson_block(text,text,uuid,text,jsonb,uuid)'::regprocedure)
  )=0 THEN
    RAISE EXCEPTION 'Progress history or scenario grading guard is missing';
  END IF;

  INSERT INTO academy_private.lesson_progress_history
    (user_id,academy_lesson_id,version_id,snapshot,archived_at,reason)
  SELECT p.user_id,p.academy_lesson_id,p.version_id,to_jsonb(p),clock_timestamp(),'pre_publish_v42'
  FROM public.academy_lesson_progress p
  JOIN public.academy_lessons l ON l.id=p.academy_lesson_id
  WHERE l.module_id IN ('s02-m01','s02-m02','s02-m03')
  ON CONFLICT (user_id,academy_lesson_id,version_id) DO NOTHING;

  UPDATE public.academy_lessons
  SET published_version_id=draft_version_id,status='published',updated_at=now()
  WHERE module_id IN ('s02-m01','s02-m02','s02-m03')
    AND published_version_id IS DISTINCT FROM draft_version_id;
  GET DIAGNOSTICS affected = ROW_COUNT;
  IF affected<>65 THEN
    RAISE EXCEPTION 'Expected to publish 65 lessons, published %',affected;
  END IF;

  INSERT INTO public.academy_lesson_audit
    (academy_lesson_id,version_id,actor_id,action,details)
  SELECT l.id,l.published_version_id,NULL,'published',
         jsonb_build_object('status','published','source','perfect_video_v42_release_migration',
           'previous_version_preserved',true,'progress_archived',true)
  FROM public.academy_lessons l
  WHERE l.module_id IN ('s02-m01','s02-m02','s02-m03');
END
$publish$;
