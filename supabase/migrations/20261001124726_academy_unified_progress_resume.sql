-- Read-only current-edition reporting for every programme. No learner rows,
-- attempts, history, content, purchases or access grants are rewritten.
CREATE FUNCTION academy_private.learning_progress()
RETURNS jsonb LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path='' AS $$
DECLARE uid uuid := (SELECT auth.uid());
BEGIN
  IF uid IS NULL THEN RAISE EXCEPTION 'Authentication required' USING ERRCODE='42501'; END IF;
  RETURN (
    SELECT coalesce(jsonb_agg(jsonb_build_object(
      'module_id',l.module_id,'lesson_id',l.lesson_id,
      'completed',p.completed_at IS NOT NULL,'quiz_score',p.score_percent,
      'xp',coalesce(p.xp,0),'updated_at',p.last_activity_at
    ) ORDER BY l.module_id,l.lesson_id),'[]'::jsonb)
    FROM public.academy_lessons l
    LEFT JOIN public.academy_lesson_progress p ON p.academy_lesson_id=l.id
      AND p.user_id=uid AND p.version_id=l.published_version_id
    WHERE l.published_version_id IS NOT NULL AND l.status<>'archived'
      AND academy_private.can_access(l.module_id)
  );
END $$;

CREATE FUNCTION public.academy_get_learning_progress()
RETURNS jsonb LANGUAGE sql SECURITY INVOKER SET search_path='' AS $$
  SELECT academy_private.learning_progress();
$$;

-- Module sidebar and dashboard must agree about completion of updated lessons.
CREATE OR REPLACE FUNCTION academy_private.module_progress(p_module text)
RETURNS jsonb LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path='' AS $$
BEGIN
  IF auth.uid() IS NULL OR NOT academy_private.can_access(p_module) THEN
    RAISE EXCEPTION 'Access denied' USING ERRCODE='42501';
  END IF;
  RETURN (
    SELECT coalesce(jsonb_agg(jsonb_build_object(
      'lessonId',l.lesson_id,'completed',p.completed_at IS NOT NULL,
      'xp',coalesce(p.xp,0),'scorePercent',p.score_percent,
      'masteryStatus',coalesce(p.mastery_status,'learning'),
      'currentBlockKey',p.current_block_key,'lastActivityAt',p.last_activity_at
    ) ORDER BY l.lesson_id),'[]'::jsonb)
    FROM public.academy_lessons l
    LEFT JOIN public.academy_lesson_progress p ON p.academy_lesson_id=l.id
      AND p.user_id=(SELECT auth.uid()) AND p.version_id=l.published_version_id
    WHERE l.module_id=p_module AND l.published_version_id IS NOT NULL AND l.status<>'archived'
  );
END $$;

-- A visit is a bookmark, not completion and not a scored attempt. Stable lesson
-- IDs survive catalogue reordering. The timestamp comes from the server.
CREATE FUNCTION academy_private.record_lesson_visit(p_user uuid,p_module text,p_lesson text)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path='' AS $$
DECLARE uid uuid := (SELECT auth.uid()); bookmark jsonb;
BEGIN
  IF uid IS NULL OR uid IS DISTINCT FROM p_user OR NOT academy_private.can_access(p_module) THEN
    RAISE EXCEPTION 'Access denied' USING ERRCODE='42501';
  END IF;
  IF NOT EXISTS(SELECT 1 FROM public.academy_lessons
    WHERE module_id=p_module AND lesson_id=p_lesson AND published_version_id IS NOT NULL AND status<>'archived') THEN
    RAISE EXCEPTION 'Published lesson not found';
  END IF;
  PERFORM 1 FROM public.profiles WHERE id=uid FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'Profile not found'; END IF;
  bookmark:=jsonb_build_object('moduleId',p_module,'lessonId',p_lesson,'timestamp',clock_timestamp());
  UPDATE public.profiles SET last_opened_lesson=bookmark WHERE id=uid;
  RETURN bookmark;
END $$;

CREATE FUNCTION public.academy_record_lesson_visit(p_user uuid,p_module text,p_lesson text)
RETURNS jsonb LANGUAGE sql SECURITY INVOKER SET search_path='' AS $$
  SELECT academy_private.record_lesson_visit(p_user,p_module,p_lesson);
$$;

REVOKE ALL ON FUNCTION academy_private.learning_progress(),public.academy_get_learning_progress(),
  academy_private.record_lesson_visit(uuid,text,text),public.academy_record_lesson_visit(uuid,text,text)
  FROM PUBLIC,anon,authenticated;
GRANT EXECUTE ON FUNCTION academy_private.learning_progress(),public.academy_get_learning_progress(),
  academy_private.record_lesson_visit(uuid,text,text),public.academy_record_lesson_visit(uuid,text,text)
  TO authenticated,service_role;
