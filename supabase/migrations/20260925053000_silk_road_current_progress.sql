-- A completed older edition is not completion of newly published exercises.
-- Preserve the stored history and the behavior of other academy programmes.
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
  LEFT JOIN public.academy_lesson_progress p
   ON p.academy_lesson_id=l.id AND p.user_id=(SELECT auth.uid())
   AND (l.module_id NOT BETWEEN 's01-m01' AND 's01-m11' OR p.version_id=l.published_version_id)
  WHERE l.module_id=p_module AND l.published_version_id IS NOT NULL AND l.status<>'archived'
 );
END $$;

-- Dashboard reads the same current-edition results as the lesson engine.
-- No supplied user id, paid text, private quiz keys or other users' data.
CREATE FUNCTION public.academy_get_silk_road_progress()
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
  LEFT JOIN public.academy_lesson_progress p
   ON p.academy_lesson_id=l.id AND p.user_id=uid AND p.version_id=l.published_version_id
  WHERE l.module_id BETWEEN 's01-m01' AND 's01-m11'
   AND l.published_version_id IS NOT NULL AND l.status<>'archived'
   AND academy_private.can_access(l.module_id)
 );
END $$;
REVOKE ALL ON FUNCTION public.academy_get_silk_road_progress() FROM PUBLIC,anon;
GRANT EXECUTE ON FUNCTION public.academy_get_silk_road_progress() TO authenticated;


-- Protect existing deployed clients from carrying answers across editions.
CREATE OR REPLACE FUNCTION academy_private.lesson_json(p_lesson uuid, p_version uuid, p_include_keys boolean DEFAULT false)
 RETURNS jsonb
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path TO ''
AS $function$
DECLARE l public.academy_lessons; v public.academy_lesson_versions; blocks jsonb; progress jsonb;
BEGIN
 SELECT * INTO l FROM public.academy_lessons WHERE id=p_lesson;
 SELECT * INTO v FROM public.academy_lesson_versions WHERE id=p_version AND academy_lesson_id=p_lesson;
 IF l.id IS NULL OR v.id IS NULL THEN RETURN NULL; END IF;
 SELECT coalesce(jsonb_agg(jsonb_build_object(
  'id',b.id,'key',b.block_key,'position',b.position,'type',b.block_type,'title',b.title,
  'content',b.content,'required',b.required,'points',b.points
  ) || CASE WHEN p_include_keys THEN jsonb_build_object('evaluation',coalesce(k.answer_key,'{}'),'feedback',coalesce(k.feedback,'{}'),'scoring',coalesce(k.scoring,'{}')) ELSE '{}'::jsonb END ORDER BY b.position),'[]')
 INTO blocks FROM public.academy_lesson_blocks b LEFT JOIN academy_private.lesson_block_keys k ON k.block_id=b.id WHERE b.version_id=v.id;
 SELECT to_jsonb(p) INTO progress FROM public.academy_lesson_progress p WHERE p.user_id=(SELECT auth.uid()) AND p.academy_lesson_id=l.id;
 RETURN jsonb_build_object('id',l.id,'moduleId',l.module_id,'lessonId',l.lesson_id,'status',l.status,
  'versionId',v.id,'version',v.version_number,'title',v.title,'subtitle',v.subtitle,'duration',v.duration,
  'objective',v.objective,'hook',v.hook,'estimatedMinutes',v.estimated_minutes,'sourceKind',v.source_kind,
  'validation',v.validation,'blocks',blocks,'progress',CASE WHEN l.module_id BETWEEN 's01-m01' AND 's01-m11' AND progress->>'version_id' IS DISTINCT FROM v.id::text THEN NULL ELSE progress END,
  'versionChanged',progress IS NOT NULL AND progress->>'version_id' IS DISTINCT FROM v.id::text);
END $function$
;
