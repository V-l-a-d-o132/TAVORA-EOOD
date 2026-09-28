-- Preserve learner progress across lesson editions and require correction of graded scenarios.
CREATE TABLE academy_private.lesson_progress_history (
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  academy_lesson_id uuid NOT NULL REFERENCES public.academy_lessons(id) ON DELETE CASCADE,
  version_id uuid NOT NULL REFERENCES public.academy_lesson_versions(id) ON DELETE RESTRICT,
  snapshot jsonb NOT NULL,
  archived_at timestamptz NOT NULL DEFAULT now(),
  reason text NOT NULL,
  PRIMARY KEY (user_id, academy_lesson_id, version_id)
);
ALTER TABLE academy_private.lesson_progress_history ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON academy_private.lesson_progress_history FROM PUBLIC, anon, authenticated;
CREATE INDEX lesson_progress_history_recent
  ON academy_private.lesson_progress_history(user_id, academy_lesson_id, archived_at DESC);

CREATE FUNCTION academy_private.archive_progress_before_version_change()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path='' AS $history$
BEGIN
  IF OLD.version_id IS DISTINCT FROM NEW.version_id THEN
    INSERT INTO academy_private.lesson_progress_history
      (user_id, academy_lesson_id, version_id, snapshot, archived_at, reason)
    VALUES (OLD.user_id, OLD.academy_lesson_id, OLD.version_id, to_jsonb(OLD), clock_timestamp(), 'version_change')
    ON CONFLICT (user_id, academy_lesson_id, version_id) DO UPDATE
      SET snapshot=EXCLUDED.snapshot, archived_at=EXCLUDED.archived_at, reason=EXCLUDED.reason;
  END IF;
  RETURN NEW;
END $history$;
REVOKE ALL ON FUNCTION academy_private.archive_progress_before_version_change() FROM PUBLIC, anon, authenticated;
CREATE TRIGGER archive_academy_lesson_progress_version
BEFORE UPDATE OF version_id ON public.academy_lesson_progress
FOR EACH ROW WHEN (OLD.version_id IS DISTINCT FROM NEW.version_id)
EXECUTE FUNCTION academy_private.archive_progress_before_version_change();

LOCK TABLE public.academy_lesson_progress IN SHARE ROW EXCLUSIVE MODE;
INSERT INTO academy_private.lesson_progress_history
  (user_id, academy_lesson_id, version_id, snapshot, archived_at, reason)
SELECT p.user_id, p.academy_lesson_id, p.version_id, to_jsonb(p), clock_timestamp(), 'pre_release_v42'
FROM public.academy_lesson_progress p
JOIN public.academy_lessons l ON l.id=p.academy_lesson_id
WHERE l.module_id IN ('s02-m01','s02-m02','s02-m03')
ON CONFLICT (user_id, academy_lesson_id, version_id) DO UPDATE
  SET snapshot=EXCLUDED.snapshot, archived_at=EXCLUDED.archived_at, reason=EXCLUDED.reason;

CREATE OR REPLACE FUNCTION academy_private.lesson_json(p_lesson uuid, p_version uuid, p_include_keys boolean DEFAULT false)
 RETURNS jsonb
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path TO ''
AS $function$
DECLARE l public.academy_lessons; v public.academy_lesson_versions; blocks jsonb; progress jsonb; historical_progress jsonb; prior_progress jsonb;
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
 SELECT h.snapshot INTO historical_progress FROM academy_private.lesson_progress_history h WHERE h.user_id=(SELECT auth.uid()) AND h.academy_lesson_id=l.id AND h.version_id<>v.id ORDER BY h.archived_at DESC LIMIT 1;
 prior_progress:=CASE WHEN progress IS NOT NULL AND progress->>'version_id' IS DISTINCT FROM v.id::text THEN progress ELSE historical_progress END;
 RETURN jsonb_build_object('id',l.id,'moduleId',l.module_id,'lessonId',l.lesson_id,'status',l.status,
  'versionId',v.id,'version',v.version_number,'title',v.title,'subtitle',v.subtitle,'duration',v.duration,
  'objective',v.objective,'hook',v.hook,'estimatedMinutes',v.estimated_minutes,'sourceKind',v.source_kind,
  'validation',v.validation,'blocks',blocks,'progress',CASE WHEN progress IS NOT NULL AND progress->>'version_id' IS DISTINCT FROM v.id::text THEN NULL ELSE progress END,
  'priorProgress',CASE WHEN prior_progress IS NULL THEN NULL ELSE jsonb_build_object(
   'version',(SELECT pv.version_number FROM public.academy_lesson_versions pv WHERE pv.id=(prior_progress->>'version_id')::uuid),
   'completedBlocks',jsonb_array_length(coalesce(prior_progress->'completed_block_keys','[]'::jsonb)),
   'xp',coalesce((prior_progress->>'xp')::integer,0),
   'scorePercent',(prior_progress->>'score_percent')::integer,
   'completedAt',prior_progress->>'completed_at') END,
  'versionChanged',progress IS NOT NULL AND progress->>'version_id' IS DISTINCT FROM v.id::text);
END $function$;


CREATE OR REPLACE FUNCTION academy_private.complete_lesson_block(p_module text, p_lesson text, p_version uuid, p_block_key text, p_payload jsonb, p_attempt uuid)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
DECLARE uid uuid:=(SELECT auth.uid()); l public.academy_lessons; b public.academy_lesson_blocks; k academy_private.lesson_block_keys; prev public.academy_lesson_attempts_v2; complete boolean:=false; correct boolean:=NULL; score_value integer:=0; max_value integer:=0; response jsonb:='{}'; expected jsonb; supplied jsonb; required_ids text[]; progress jsonb; admin_preview boolean:=false;
BEGIN
 IF NOT academy_private.can_access(p_module) OR (uid IS NULL AND p_module<>'s01-m01') THEN RAISE EXCEPTION 'Access denied' USING ERRCODE='42501'; END IF;
 IF jsonb_typeof(p_payload) IS DISTINCT FROM 'object' OR pg_column_size(p_payload)>65536 THEN RAISE EXCEPTION 'Invalid interaction payload'; END IF;
 SELECT * INTO l FROM public.academy_lessons WHERE module_id=p_module AND lesson_id=p_lesson;
 IF NOT FOUND THEN RAISE EXCEPTION 'Lesson not found'; END IF;
 admin_preview:=uid IS NOT NULL AND academy_private.is_admin() AND p_version IS DISTINCT FROM l.published_version_id
  AND EXISTS(SELECT 1 FROM public.academy_lesson_versions WHERE id=p_version AND academy_lesson_id=l.id);
 IF NOT admin_preview AND (l.status='archived' OR l.published_version_id IS DISTINCT FROM p_version) THEN RAISE EXCEPTION 'Lesson version changed'; END IF;
 SELECT * INTO b FROM public.academy_lesson_blocks WHERE version_id=p_version AND block_key=p_block_key;
 IF b.id IS NULL THEN RAISE EXCEPTION 'Block not found'; END IF;
 IF uid IS NOT NULL THEN
  PERFORM pg_advisory_xact_lock(hashtextextended(p_attempt::text,0));
  SELECT * INTO prev FROM public.academy_lesson_attempts_v2 WHERE id=p_attempt;
  IF FOUND THEN
   IF prev.user_id<>uid OR prev.block_id<>b.id OR prev.payload<>p_payload THEN RAISE EXCEPTION 'Attempt conflict'; END IF;
   RETURN jsonb_build_object('attemptId',prev.id,'correct',prev.is_correct,'score',prev.score,'maxScore',prev.max_score,'feedback',prev.feedback,'progress',(SELECT to_jsonb(p) FROM public.academy_lesson_progress p WHERE p.user_id=uid AND p.academy_lesson_id=l.id));
  END IF;
 END IF;
 SELECT * INTO k FROM academy_private.lesson_block_keys WHERE block_id=b.id;
 expected:=coalesce(k.answer_key,'{}');
 CASE b.block_type
  WHEN 'sequence_sort' THEN supplied:=p_payload->'order'; correct:=supplied=expected->'order'; complete:=correct;
  WHEN 'matching' THEN supplied:=p_payload->'matches'; correct:=supplied=expected->'matches'; complete:=correct;
  WHEN 'image_hotspot' THEN correct:=p_payload->>'selected'=expected->>'correct'; complete:=correct;
  WHEN 'quiz' THEN correct:=p_payload->'answer'=expected->'correct'; complete:=correct;
  WHEN 'calculator' THEN
   IF coalesce(p_payload->>'value','')!~'^[-+]?[0-9]+([.][0-9]+)?$' THEN RAISE EXCEPTION 'Invalid calculator value'; END IF;
   correct:=(p_payload->>'value')::numeric BETWEEN coalesce((expected->>'min')::numeric,(expected->>'value')::numeric) AND coalesce((expected->>'max')::numeric,(expected->>'value')::numeric); complete:=correct;
  WHEN 'decision_tree' THEN
   IF NOT EXISTS(SELECT 1 FROM jsonb_array_elements(coalesce(b.content->'options','[]'::jsonb)) o WHERE o->>'id'=p_payload->>'selected') THEN RAISE EXCEPTION 'Invalid choice'; END IF;
   correct:=CASE WHEN expected ? 'correct' THEN p_payload->>'selected'=expected->>'correct' ELSE NULL END; complete:=true;
  WHEN 'scenario' THEN
   IF NOT EXISTS(SELECT 1 FROM jsonb_array_elements(coalesce(b.content->'options','[]'::jsonb)) o WHERE o->>'id'=p_payload->>'selected') THEN RAISE EXCEPTION 'Invalid choice'; END IF;
   correct:=CASE WHEN expected ? 'correct' THEN p_payload->>'selected'=expected->>'correct' ELSE NULL END; complete:=coalesce(correct,true);
  WHEN 'client_simulation' THEN
   IF NOT EXISTS(SELECT 1 FROM jsonb_array_elements(coalesce(b.content->'options','[]'::jsonb)) o WHERE o->>'id'=p_payload->>'selected') THEN RAISE EXCEPTION 'Invalid choice'; END IF;
   correct:=CASE WHEN expected ? 'correct' THEN p_payload->>'selected'=expected->>'correct' ELSE NULL END; complete:=true;
  WHEN 'flip_cards' THEN
   SELECT array_agg(value->>'id' ORDER BY value->>'id') INTO required_ids FROM jsonb_array_elements(coalesce(b.content->'cards','[]'));
   complete:=coalesce(ARRAY(SELECT jsonb_array_elements_text(coalesce(p_payload->'viewed','[]')) ORDER BY 1),'{}') @> coalesce(required_ids,'{}');
  WHEN 'step_reveal' THEN
   SELECT array_agg(value->>'id' ORDER BY value->>'id') INTO required_ids FROM jsonb_array_elements(coalesce(b.content->'steps','[]'));
   complete:=coalesce(ARRAY(SELECT jsonb_array_elements_text(coalesce(p_payload->'revealed','[]')) ORDER BY 1),'{}') @> coalesce(required_ids,'{}');
  WHEN 'checklist' THEN
   SELECT array_agg(value->>'id' ORDER BY value->>'id') INTO required_ids FROM jsonb_array_elements(coalesce(b.content->'items','[]')) WHERE coalesce((value->>'required')::boolean,true);
   complete:=coalesce(ARRAY(SELECT jsonb_array_elements_text(coalesce(p_payload->'checked','[]')) ORDER BY 1),'{}') @> coalesce(required_ids,'{}');
  WHEN 'prompt_builder' THEN complete:=jsonb_typeof(p_payload->'fields')='object' AND (SELECT count(*) FROM jsonb_each_text(p_payload->'fields') WHERE length(btrim(value))>=2)>=coalesce((b.content->>'minFields')::integer,2);
  WHEN 'practical_response' THEN complete:=length(btrim(coalesce(p_payload->>'text','')))>=coalesce((b.content->>'minLength')::integer,20);
  WHEN 'reflection' THEN complete:=length(btrim(coalesce(p_payload->>'text','')))>=coalesce((b.content->>'minLength')::integer,20);
  WHEN 'homework' THEN complete:=length(btrim(coalesce(p_payload->>'text','')))>=coalesce((b.content->>'minLength')::integer,20);
  WHEN 'submission' THEN complete:=(p_payload->>'kind' IN ('link','file')) AND length(btrim(coalesce(p_payload->>'value','')))>=5 AND (p_payload->>'kind'<>'file' OR p_payload->>'value' LIKE uid::text||'/%');
  ELSE complete:=coalesce((p_payload->>'acknowledged')::boolean,false);
 END CASE;
 max_value:=CASE WHEN correct IS NULL THEN 0 ELSE b.points END;
 score_value:=CASE WHEN correct THEN b.points ELSE 0 END;
 response:=coalesce(k.feedback,'{}')||jsonb_build_object('complete',complete);
 IF correct IS NOT NULL THEN
  response:=response||jsonb_build_object('correct',correct);
  IF NOT (p_module IN ('s02-m01','s02-m02','s02-m03') AND correct IS DISTINCT FROM TRUE) THEN
   response:=response||jsonb_build_object('answer',expected);
  END IF;
 END IF;
 IF uid IS NULL OR admin_preview THEN
  RETURN jsonb_build_object('attemptId',p_attempt,'correct',correct,'score',score_value,'maxScore',max_value,'feedback',response,'progress',NULL,'preview',true);
 END IF;
 INSERT INTO public.academy_lesson_attempts_v2(id,user_id,academy_lesson_id,version_id,block_id,payload,score,max_score,is_correct,feedback)
 VALUES(p_attempt,uid,l.id,p_version,b.id,p_payload,score_value,max_value,correct,response);
 INSERT INTO public.academy_lesson_progress(user_id,academy_lesson_id,version_id,current_block_key,block_state,completed_block_keys)
 VALUES(uid,l.id,p_version,p_block_key,jsonb_build_object(p_block_key,p_payload),CASE WHEN complete THEN ARRAY[p_block_key] ELSE '{}' END)
 ON CONFLICT(user_id,academy_lesson_id) DO UPDATE SET version_id=EXCLUDED.version_id,current_block_key=EXCLUDED.current_block_key,
  block_state=CASE WHEN academy_lesson_progress.version_id=EXCLUDED.version_id THEN academy_lesson_progress.block_state||EXCLUDED.block_state ELSE EXCLUDED.block_state END,
  completed_block_keys=CASE
   WHEN academy_lesson_progress.version_id<>EXCLUDED.version_id THEN EXCLUDED.completed_block_keys
   WHEN complete AND NOT p_block_key=ANY(academy_lesson_progress.completed_block_keys) THEN array_append(academy_lesson_progress.completed_block_keys,p_block_key)
   ELSE academy_lesson_progress.completed_block_keys END,
  xp=CASE WHEN academy_lesson_progress.version_id=EXCLUDED.version_id THEN academy_lesson_progress.xp ELSE 0 END,
  score_percent=CASE WHEN academy_lesson_progress.version_id=EXCLUDED.version_id THEN academy_lesson_progress.score_percent ELSE NULL END,
  mastery_status=CASE WHEN academy_lesson_progress.version_id=EXCLUDED.version_id THEN academy_lesson_progress.mastery_status ELSE 'learning' END,
  completed_at=CASE WHEN academy_lesson_progress.version_id=EXCLUDED.version_id THEN academy_lesson_progress.completed_at ELSE NULL END,
  last_activity_at=now();
 progress:=academy_private.refresh_lesson_progress(uid,l.id);
 RETURN jsonb_build_object('attemptId',p_attempt,'correct',correct,'score',score_value,'maxScore',max_value,'feedback',response,'progress',progress);
END $function$;

