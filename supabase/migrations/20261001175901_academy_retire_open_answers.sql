-- Retire free-form learner responses without changing published version IDs or deleting
-- historical submissions. Admin history still sees the original immutable versions.

CREATE OR REPLACE FUNCTION academy_private.get_lesson_v2(p_module text, p_lesson text)
RETURNS jsonb
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path TO '' AS $function$
DECLARE
  l public.academy_lessons;
  lesson jsonb;
  visible_blocks jsonb;
BEGIN
  IF NOT academy_private.can_access(p_module) THEN
    RAISE EXCEPTION 'Access denied' USING ERRCODE='42501';
  END IF;

  SELECT * INTO l FROM public.academy_lessons
  WHERE module_id=p_module AND lesson_id=p_lesson
    AND published_version_id IS NOT NULL AND status<>'archived';
  IF NOT FOUND OR l.published_version_id IS NULL THEN RETURN NULL; END IF;

  lesson:=academy_private.lesson_json(l.id,l.published_version_id,false);
  SELECT coalesce(jsonb_agg(item.block ORDER BY item.position),'[]'::jsonb)
    INTO visible_blocks
  FROM jsonb_array_elements(lesson->'blocks') WITH ORDINALITY AS item(block,position)
  WHERE item.block->>'type' NOT IN
    ('prompt_builder','practical_response','reflection','homework','submission');

  RETURN jsonb_set(lesson,'{blocks}',visible_blocks);
END $function$;

-- Reject submissions from an already open browser tab that still shows a
-- retired input. The original completion function remains for other blocks.
CREATE OR REPLACE FUNCTION academy_private.complete_visible_lesson_block(
  p_module text,p_lesson text,p_version uuid,p_block_key text,p_payload jsonb,p_attempt uuid)
RETURNS jsonb
LANGUAGE plpgsql SECURITY DEFINER SET search_path TO '' AS $function$
BEGIN
  IF NOT academy_private.can_access(p_module)
     OR (auth.uid() IS NULL AND p_module<>'s01-m01') THEN
    RAISE EXCEPTION 'Access denied' USING ERRCODE='42501';
  END IF;
  IF EXISTS (
    SELECT 1 FROM public.academy_lesson_blocks b
    WHERE b.version_id=p_version AND b.block_key=p_block_key
      AND b.block_type IN
        ('prompt_builder','practical_response','reflection','homework','submission')
  ) THEN RAISE EXCEPTION 'Open answer blocks are retired' USING ERRCODE='22023'; END IF;

  RETURN academy_private.complete_lesson_block(
    p_module,p_lesson,p_version,p_block_key,p_payload,p_attempt);
END $function$;

REVOKE ALL ON FUNCTION academy_private.complete_visible_lesson_block(
  text,text,uuid,text,jsonb,uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION academy_private.complete_visible_lesson_block(
  text,text,uuid,text,jsonb,uuid) TO anon,authenticated,service_role;

CREATE OR REPLACE FUNCTION public.academy_complete_lesson_block(
  p_module text,p_lesson text,p_version uuid,p_block_key text,p_payload jsonb,p_attempt uuid)
RETURNS jsonb
LANGUAGE sql SECURITY INVOKER SET search_path TO '' AS $function$
  SELECT academy_private.complete_visible_lesson_block(
    p_module,p_lesson,p_version,p_block_key,p_payload,p_attempt);
$function$;

-- New drafts must meet the practice requirement through an automatically
-- checkable activity. Existing published versions remain available to admins.
CREATE OR REPLACE FUNCTION academy_private.lesson_validation(p_version uuid)
RETURNS jsonb
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path TO '' AS $function$
DECLARE
  v public.academy_lesson_versions;
  errors jsonb:='[]'::jsonb;
  warnings jsonb:='[]'::jsonb;
  n integer;
  kinds text[];
BEGIN
  SELECT * INTO v FROM public.academy_lesson_versions WHERE id=p_version;
  IF NOT FOUND THEN RAISE EXCEPTION 'Version not found'; END IF;

  SELECT count(*),coalesce(array_agg(DISTINCT block_type),'{}')
    INTO n,kinds FROM public.academy_lesson_blocks
  WHERE version_id=p_version AND block_type NOT IN
    ('prompt_builder','practical_response','reflection','homework','submission');

  IF btrim(v.objective)='' THEN errors:=errors||jsonb_build_array('missing_objective'); END IF;
  IF btrim(v.hook)='' THEN errors:=errors||jsonb_build_array('missing_hook'); END IF;
  IF n<5 THEN errors:=errors||jsonb_build_array('too_few_blocks'); END IF;
  IF NOT (kinds && ARRAY[
    'sequence_sort','matching','image_hotspot','decision_tree','scenario',
    'client_simulation','calculator','checklist','quiz','course_exam','flip_cards'
  ]) THEN errors:=errors||jsonb_build_array('missing_interaction'); END IF;
  IF NOT (kinds && ARRAY['quiz','course_exam']) THEN
    errors:=errors||jsonb_build_array('missing_knowledge_check');
  END IF;
  IF NOT (kinds && ARRAY[
    'sequence_sort','matching','image_hotspot','decision_tree','scenario',
    'client_simulation','calculator','course_exam'
  ]) THEN
    IF EXISTS (
      SELECT 1 FROM public.academy_lessons l
      WHERE l.id=v.academy_lesson_id AND l.published_version_id=p_version
    ) THEN
      warnings:=warnings||jsonb_build_array('missing_auto_checked_practice');
    ELSE
      errors:=errors||jsonb_build_array('missing_practice');
    END IF;
  END IF;
  IF NOT ('summary'=ANY(kinds)) THEN errors:=errors||jsonb_build_array('missing_summary'); END IF;
  IF EXISTS (
    SELECT 1 FROM public.academy_lesson_blocks b
    WHERE b.version_id=p_version AND b.block_type IN
      ('prompt_builder','practical_response','reflection','homework','submission')
  ) THEN warnings:=warnings||jsonb_build_array('retired_open_answer_block'); END IF;
  IF EXISTS (
    SELECT 1 FROM public.academy_lesson_blocks b
    WHERE b.version_id=p_version AND b.required AND b.points=0
      AND b.block_type NOT IN
        ('prompt_builder','practical_response','reflection','homework','submission')
  ) THEN warnings:=warnings||jsonb_build_array('required_block_has_no_xp'); END IF;
  IF EXISTS (
    SELECT 1 FROM public.academy_lesson_blocks b
    LEFT JOIN academy_private.lesson_block_keys k ON k.block_id=b.id
    WHERE b.version_id=p_version AND b.block_type IN (
      'sequence_sort','matching','image_hotspot','decision_tree','scenario',
      'client_simulation','calculator','quiz','course_exam') AND k.block_id IS NULL
  ) THEN errors:=errors||jsonb_build_array('missing_server_evaluation'); END IF;

  RETURN jsonb_build_object(
    'errors',errors,'warnings',warnings,'block_count',n,
    'interactive',kinds && ARRAY[
      'sequence_sort','matching','image_hotspot','decision_tree','scenario',
      'client_simulation','calculator','checklist','quiz','course_exam','flip_cards'
    ],
    'has_quiz',kinds && ARRAY['quiz','course_exam'],
    'has_assignment',kinds && ARRAY[
      'sequence_sort','matching','image_hotspot','decision_tree',
      'scenario','client_simulation','calculator','course_exam'
    ]
  );
END $function$;

CREATE OR REPLACE FUNCTION academy_private.refresh_lesson_progress(p_user uuid, p_lesson uuid)
RETURNS jsonb
LANGUAGE plpgsql SECURITY DEFINER SET search_path TO '' AS $function$
DECLARE
  p public.academy_lesson_progress;
  required_count integer;
  completed_count integer;
  earned integer;
  score_sum integer;
  max_sum integer;
  percent integer;
  status_text text;
  done_at timestamptz;
BEGIN
  SELECT * INTO p FROM public.academy_lesson_progress
  WHERE user_id=p_user AND academy_lesson_id=p_lesson FOR UPDATE;

  SELECT count(*) FILTER (WHERE required AND block_type NOT IN
           ('prompt_builder','practical_response','reflection','homework','submission')),
         count(*) FILTER (WHERE required AND block_type NOT IN
           ('prompt_builder','practical_response','reflection','homework','submission')
           AND block_key=ANY(p.completed_block_keys)),
         coalesce(sum(points) FILTER (WHERE block_key=ANY(p.completed_block_keys)),0)
    INTO required_count,completed_count,earned
  FROM public.academy_lesson_blocks WHERE version_id=p.version_id;

  SELECT coalesce(sum(score),0),coalesce(sum(max_score),0)
    INTO score_sum,max_sum FROM (
      SELECT DISTINCT ON (block_id) block_id,score,max_score
      FROM public.academy_lesson_attempts_v2
      WHERE user_id=p_user AND academy_lesson_id=p_lesson AND version_id=p.version_id
      ORDER BY block_id,created_at DESC
    ) latest;
  percent:=CASE WHEN max_sum>0 THEN round(100.0*score_sum/max_sum)::integer ELSE NULL END;

  IF required_count>0 AND completed_count=required_count THEN
    done_at:=coalesce(p.completed_at,now());
    status_text:=CASE WHEN percent IS NULL OR percent>=80 THEN 'mastered' ELSE 'practicing' END;
  ELSE
    status_text:='learning'; done_at:=NULL;
  END IF;

  UPDATE public.academy_lesson_progress
  SET xp=earned,score_percent=percent,mastery_status=status_text,
      completed_at=done_at,last_activity_at=now()
  WHERE user_id=p_user AND academy_lesson_id=p_lesson RETURNING * INTO p;

  IF done_at IS NOT NULL THEN
    INSERT INTO public.pdf_progress(user_id,module_id,lesson_id,page_number,total_pages,completed,updated_at)
    SELECT p_user,l.module_id,l.lesson_id,1,1,true,now()
    FROM public.academy_lessons l WHERE l.id=p_lesson
    ON CONFLICT(user_id,module_id,lesson_id)
    DO UPDATE SET completed=true,updated_at=now();
  END IF;

  IF cardinality(p.completed_block_keys)>0 THEN
    INSERT INTO public.academy_user_badges(user_id,badge_key,evidence)
    VALUES(p_user,'first-practice',jsonb_build_object('lessonId',p_lesson)) ON CONFLICT DO NOTHING;
  END IF;
  IF (SELECT coalesce(sum(xp),0) FROM public.academy_lesson_progress WHERE user_id=p_user)>=100 THEN
    INSERT INTO public.academy_user_badges(user_id,badge_key,evidence)
    VALUES(p_user,'xp-100',jsonb_build_object('xp',
      (SELECT sum(xp) FROM public.academy_lesson_progress WHERE user_id=p_user))) ON CONFLICT DO NOTHING;
  END IF;
  IF (SELECT count(*) FROM public.academy_lesson_progress
      WHERE user_id=p_user AND mastery_status='mastered')>=3 THEN
    INSERT INTO public.academy_user_badges(user_id,badge_key,evidence)
    VALUES(p_user,'mastery-3',jsonb_build_object('mastered',
      (SELECT count(*) FROM public.academy_lesson_progress
       WHERE user_id=p_user AND mastery_status='mastered'))) ON CONFLICT DO NOTHING;
  END IF;
  RETURN to_jsonb(p);
END $function$;

-- Resume learners on a visible block if their cursor pointed at a retired input.
UPDATE public.academy_lesson_progress p
SET current_block_key=coalesce(
  (SELECT next_block.block_key FROM public.academy_lesson_blocks next_block
   WHERE next_block.version_id=p.version_id AND next_block.required
     AND next_block.block_type NOT IN
       ('prompt_builder','practical_response','reflection','homework','submission')
     AND NOT next_block.block_key=ANY(p.completed_block_keys)
   ORDER BY next_block.position LIMIT 1),
  (SELECT last_block.block_key FROM public.academy_lesson_blocks last_block
   WHERE last_block.version_id=p.version_id
     AND last_block.block_type NOT IN
       ('prompt_builder','practical_response','reflection','homework','submission')
   ORDER BY last_block.position DESC LIMIT 1))
FROM public.academy_lessons l
WHERE l.id=p.academy_lesson_id AND p.version_id=l.published_version_id
  AND l.status='published'
  AND EXISTS (
    SELECT 1 FROM public.academy_lesson_blocks b
    WHERE b.version_id=p.version_id AND b.block_key=p.current_block_key
      AND b.block_type IN
        ('prompt_builder','practical_response','reflection','homework','submission'));
