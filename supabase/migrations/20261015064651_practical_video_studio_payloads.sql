-- Finite learning choices only. Historical attempts/files remain readable; no new
-- student file or free-form answer can enter the academy endpoints.
CREATE OR REPLACE FUNCTION academy_private.assert_closed_block_payload(
 p_type text,p_content jsonb,p_payload jsonb,p_partial boolean DEFAULT false)
RETURNS void LANGUAGE plpgsql SET search_path='' AS $fn$
DECLARE field text; allowed jsonb; pair record; item jsonb; source jsonb; slot jsonb;
BEGIN
 IF jsonb_typeof(p_payload) IS DISTINCT FROM 'object' OR pg_column_size(p_payload)>65536 THEN
  RAISE EXCEPTION 'Only catalog-defined learning choices are accepted' USING ERRCODE='22023'; END IF;
 field:=CASE p_type WHEN 'quiz' THEN 'answer' WHEN 'scenario' THEN 'selected'
  WHEN 'decision_tree' THEN 'selected' WHEN 'client_simulation' THEN 'selected' WHEN 'image_hotspot' THEN 'selected'
  WHEN 'matching' THEN 'matches' WHEN 'sequence_sort' THEN 'order' WHEN 'checklist' THEN 'checked'
  WHEN 'step_reveal' THEN 'revealed' WHEN 'flip_cards' THEN 'viewed' WHEN 'course_exam' THEN 'answers'
  WHEN 'objective' THEN 'acknowledged' WHEN 'hook' THEN 'acknowledged' WHEN 'concept' THEN 'acknowledged'
  WHEN 'rich_text' THEN 'acknowledged' WHEN 'before_after' THEN 'acknowledged' WHEN 'case_study' THEN 'acknowledged'
  WHEN 'example' THEN 'acknowledged' WHEN 'summary' THEN 'acknowledged' ELSE NULL END;
 IF field IS NULL THEN RAISE EXCEPTION 'Open answer blocks are retired' USING ERRCODE='22023'; END IF;
 IF EXISTS(SELECT 1 FROM jsonb_object_keys(p_payload) k WHERE k<>field) THEN
  RAISE EXCEPTION 'Unexpected learning payload field' USING ERRCODE='22023'; END IF;
 IF p_payload='{}'::jsonb AND p_partial THEN RETURN; END IF;
 IF NOT p_payload ? field THEN RAISE EXCEPTION 'Missing learning choice' USING ERRCODE='22023'; END IF;
 IF field='acknowledged' THEN
  IF p_payload->field IS DISTINCT FROM 'true'::jsonb THEN RAISE EXCEPTION 'Invalid acknowledgement' USING ERRCODE='22023'; END IF;
 ELSIF field IN ('answer','selected') THEN
  source:=CASE WHEN p_type='image_hotspot' THEN p_content->'hotspots' ELSE p_content->'options' END;
  IF jsonb_typeof(p_payload->field) IS DISTINCT FROM 'string' OR NOT EXISTS(
   SELECT 1 FROM jsonb_array_elements(coalesce(source,'[]'::jsonb)) WITH ORDINALITY o(v,n)
   WHERE coalesce(o.v->>'id',(o.n-1)::text)=p_payload->>field) THEN
   RAISE EXCEPTION 'Unknown learning choice' USING ERRCODE='22023'; END IF;
 ELSIF field IN ('matches','answers') THEN
  IF jsonb_typeof(p_payload->field) IS DISTINCT FROM 'object' THEN RAISE EXCEPTION 'Invalid choice map' USING ERRCODE='22023'; END IF;
  FOR pair IN SELECT * FROM jsonb_each(p_payload->field) LOOP
   source:=CASE WHEN field='matches' THEN p_content->'left' ELSE p_content->'questions' END;
   SELECT o.v INTO slot FROM jsonb_array_elements(coalesce(source,'[]'::jsonb)) WITH ORDINALITY o(v,n)
    WHERE coalesce(o.v->>'id',(o.n-1)::text)=pair.key;
   IF slot IS NULL OR jsonb_typeof(pair.value) IS DISTINCT FROM 'string' THEN
    RAISE EXCEPTION 'Unknown choice slot' USING ERRCODE='22023'; END IF;
   allowed:=CASE WHEN field='matches' THEN p_content->'right' ELSE slot->'options' END;
   IF NOT EXISTS(SELECT 1 FROM jsonb_array_elements(coalesce(allowed,'[]'::jsonb)) WITH ORDINALITY o(v,n)
      WHERE coalesce(o.v->>'id',(o.n-1)::text)=pair.value#>>'{}')
      OR (field='matches' AND slot ? 'choices' AND NOT slot->'choices' @> jsonb_build_array(pair.value#>>'{}')) THEN
    RAISE EXCEPTION 'Unknown slot choice' USING ERRCODE='22023'; END IF;
  END LOOP;
 ELSE
  IF jsonb_typeof(p_payload->field) IS DISTINCT FROM 'array' THEN RAISE EXCEPTION 'Invalid choice list' USING ERRCODE='22023'; END IF;
  source:=CASE field WHEN 'revealed' THEN p_content->'steps' WHEN 'viewed' THEN p_content->'cards' ELSE p_content->'items' END;
  FOR item IN SELECT value FROM jsonb_array_elements(p_payload->field) LOOP
   IF jsonb_typeof(item) IS DISTINCT FROM 'string' OR NOT EXISTS(
    SELECT 1 FROM jsonb_array_elements(coalesce(source,'[]'::jsonb)) WITH ORDINALITY o(v,n)
    WHERE coalesce(o.v->>'id',CASE field WHEN 'revealed' THEN 'step-' WHEN 'viewed' THEN 'card-' ELSE '' END||(o.n-1)::text)=item#>>'{}') THEN
    RAISE EXCEPTION 'Unknown list choice' USING ERRCODE='22023'; END IF;
  END LOOP;
  IF jsonb_array_length(p_payload->field)<>(SELECT count(DISTINCT value) FROM jsonb_array_elements(p_payload->field)) THEN
   RAISE EXCEPTION 'Repeated list choice' USING ERRCODE='22023'; END IF;
 END IF;
END $fn$;
REVOKE ALL ON FUNCTION academy_private.assert_closed_block_payload(text,jsonb,jsonb,boolean) FROM PUBLIC,anon,authenticated,service_role;

-- A restrictive policy also closes this legacy upload path if another broad
-- storage policy is introduced later. Instructor-managed assets use other paths.
DROP POLICY IF EXISTS academy_submission_insert ON storage.objects;
DROP POLICY IF EXISTS academy_submission_update ON storage.objects;
CREATE POLICY academy_no_student_submission_insert ON storage.objects AS RESTRICTIVE FOR INSERT TO anon,authenticated
 WITH CHECK (bucket_id IS DISTINCT FROM 'academy-submissions');
CREATE POLICY academy_no_student_submission_update ON storage.objects AS RESTRICTIVE FOR UPDATE TO anon,authenticated
 USING (bucket_id IS DISTINCT FROM 'academy-submissions') WITH CHECK (bucket_id IS DISTINCT FROM 'academy-submissions');

-- Private publication checkpoints contain grading keys; they are never part of
-- client source, public REST, downloadable assets or git fixtures.
CREATE TABLE academy_private.practical_lesson_upgrades (
 release_key text NOT NULL CHECK(release_key='practical_video_01_05_20261014'),
 module_id text NOT NULL CHECK(module_id ~ '^s02-m0[1-5]$'),
 lesson_id text NOT NULL CHECK(lesson_id ~ '^pv0[1-5]-[0-9]{2}$'),
 expected_version_id uuid NOT NULL REFERENCES public.academy_lesson_versions(id),
 expected_fingerprint text NOT NULL CHECK(expected_fingerprint ~ '^[a-f0-9]{32}$'),
 payload jsonb NOT NULL CHECK(jsonb_typeof(payload)='object'),
 created_at timestamptz NOT NULL DEFAULT now(),
 PRIMARY KEY(release_key,lesson_id)
);
ALTER TABLE academy_private.practical_lesson_upgrades ENABLE ROW LEVEL SECURITY;
ALTER TABLE academy_private.practical_lesson_upgrades FORCE ROW LEVEL SECURITY;
REVOKE ALL ON academy_private.practical_lesson_upgrades FROM PUBLIC,anon,authenticated,service_role;

CREATE OR REPLACE FUNCTION academy_private.autosave_lesson(p_module text, p_lesson text, p_version uuid, p_current_block text, p_state jsonb)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
DECLARE uid uuid:=(SELECT auth.uid()); l public.academy_lessons; current_state jsonb; pair record; b public.academy_lesson_blocks;
BEGIN
 IF uid IS NULL OR NOT academy_private.can_access(p_module) THEN RAISE EXCEPTION 'Access denied' USING ERRCODE='42501'; END IF;
 SELECT * INTO l FROM public.academy_lessons WHERE module_id=p_module AND lesson_id=p_lesson AND published_version_id IS NOT NULL AND status<>'archived' FOR SHARE;
 IF l.published_version_id IS DISTINCT FROM p_version OR jsonb_typeof(p_state) IS DISTINCT FROM 'object' OR pg_column_size(p_state)>65536 OR NOT EXISTS(SELECT 1 FROM public.academy_lesson_blocks WHERE version_id=p_version AND block_key=p_current_block) THEN RAISE EXCEPTION 'Invalid progress state'; END IF;
 FOR pair IN SELECT * FROM jsonb_each(p_state) LOOP
  SELECT * INTO b FROM public.academy_lesson_blocks WHERE version_id=p_version AND block_key=pair.key;
  IF NOT FOUND THEN RAISE EXCEPTION 'Unknown progress block' USING ERRCODE='22023'; END IF;
  PERFORM academy_private.assert_closed_block_payload(b.block_type,b.content,pair.value,true);
 END LOOP;
 INSERT INTO public.academy_lesson_progress(user_id,academy_lesson_id,version_id,current_block_key,block_state)
 VALUES(uid,l.id,p_version,p_current_block,p_state)
 ON CONFLICT(user_id,academy_lesson_id) DO UPDATE SET version_id=EXCLUDED.version_id,current_block_key=EXCLUDED.current_block_key,
  block_state=CASE WHEN academy_lesson_progress.version_id=EXCLUDED.version_id THEN academy_lesson_progress.block_state||EXCLUDED.block_state ELSE EXCLUDED.block_state END,
  completed_block_keys=CASE WHEN academy_lesson_progress.version_id=EXCLUDED.version_id THEN academy_lesson_progress.completed_block_keys ELSE '{}'::text[] END,
  xp=CASE WHEN academy_lesson_progress.version_id=EXCLUDED.version_id THEN academy_lesson_progress.xp ELSE 0 END,
  score_percent=CASE WHEN academy_lesson_progress.version_id=EXCLUDED.version_id THEN academy_lesson_progress.score_percent ELSE NULL END,
  mastery_status=CASE WHEN academy_lesson_progress.version_id=EXCLUDED.version_id THEN academy_lesson_progress.mastery_status ELSE 'learning' END,
  completed_at=CASE WHEN academy_lesson_progress.version_id=EXCLUDED.version_id THEN academy_lesson_progress.completed_at ELSE NULL END,
  last_activity_at=now()
 RETURNING block_state INTO current_state;
 RETURN jsonb_build_object('saved',true,'currentBlockKey',p_current_block,'state',current_state);
END $function$
;
CREATE OR REPLACE FUNCTION academy_private.complete_lesson_block(p_module text, p_lesson text, p_version uuid, p_block_key text, p_payload jsonb, p_attempt uuid)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
DECLARE uid uuid:=(SELECT auth.uid()); l public.academy_lessons; b public.academy_lesson_blocks; k academy_private.lesson_block_keys; prev public.academy_lesson_attempts_v2; complete boolean:=false; correct boolean:=NULL; score_value integer:=0; max_value integer:=0; response jsonb:='{}'; expected jsonb; supplied jsonb; required_ids text[]; progress jsonb; admin_preview boolean:=false; closed_learning boolean:=false; chosen text; failed_slots text;
BEGIN
 IF NOT academy_private.can_access(p_module) OR (uid IS NULL AND p_module<>'s01-m01') THEN RAISE EXCEPTION 'Access denied' USING ERRCODE='42501'; END IF;
 IF jsonb_typeof(p_payload) IS DISTINCT FROM 'object' OR pg_column_size(p_payload)>65536 THEN RAISE EXCEPTION 'Invalid interaction payload'; END IF;
 SELECT * INTO l FROM public.academy_lessons WHERE module_id=p_module AND lesson_id=p_lesson;
 IF p_module ~ '^s01-m(0[1-9]|1[01])$' OR p_module ~ '^s02-m(0[1-9]|1[0-5])$' THEN
  SELECT * INTO l FROM public.academy_lessons WHERE module_id=p_module AND lesson_id=p_lesson FOR SHARE;
 END IF;
 IF NOT FOUND THEN RAISE EXCEPTION 'Lesson not found'; END IF;
 admin_preview:=uid IS NOT NULL AND academy_private.is_admin() AND p_version IS DISTINCT FROM l.published_version_id
  AND EXISTS(SELECT 1 FROM public.academy_lesson_versions WHERE id=p_version AND academy_lesson_id=l.id);
 IF NOT admin_preview AND (l.status='archived' OR l.published_version_id IS DISTINCT FROM p_version) THEN RAISE EXCEPTION 'Lesson version changed'; END IF;
 SELECT * INTO b FROM public.academy_lesson_blocks WHERE version_id=p_version AND block_key=p_block_key;
 IF b.id IS NULL THEN RAISE EXCEPTION 'Block not found'; END IF;
 PERFORM academy_private.assert_closed_block_payload(b.block_type,b.content,p_payload,false);
 IF b.block_type='course_exam' THEN RAISE EXCEPTION 'Use the course exam endpoint'; END IF;
 IF uid IS NOT NULL THEN
  PERFORM pg_advisory_xact_lock(hashtextextended(p_attempt::text,0));
  SELECT * INTO prev FROM public.academy_lesson_attempts_v2 WHERE id=p_attempt;
  IF FOUND THEN
   IF prev.user_id<>uid OR prev.block_id<>b.id OR prev.payload<>p_payload THEN RAISE EXCEPTION 'Attempt conflict'; END IF;
   RETURN jsonb_build_object('attemptId',prev.id,'correct',prev.is_correct,'score',prev.score,'maxScore',prev.max_score,'feedback',(prev.feedback-'answer'-'answers'-'evaluation'-'answer_key'-'correctAnswer'),'progress',(SELECT to_jsonb(p) FROM public.academy_lesson_progress p WHERE p.user_id=uid AND p.academy_lesson_id=l.id));
  END IF;
 END IF;
 SELECT * INTO k FROM academy_private.lesson_block_keys WHERE block_id=b.id;
 expected:=coalesce(k.answer_key,'{}');
 closed_learning:=(p_module ~ '^s01-m(0[1-9]|1[01])$' AND EXISTS (
  SELECT 1 FROM public.academy_lesson_versions v WHERE v.id=p_version
   AND v.change_note IN ('silk_road_closed_learning_20261008','silk_road_market_ready_20261009')))
 OR (p_module ~ '^s02-m(0[1-9]|1[0-5])$' AND EXISTS (SELECT 1 FROM public.academy_lesson_versions v WHERE v.id=p_version AND v.change_note='perfect_video_story_first_20261010'));
 IF closed_learning THEN
  IF p_attempt IS NULL THEN RAISE EXCEPTION 'Invalid attempt identifier'; END IF;
  IF b.block_type IN ('quiz','scenario','image_hotspot') THEN
   chosen:=CASE WHEN b.block_type='quiz' THEN p_payload->>'answer' ELSE p_payload->>'selected' END;
   IF NOT EXISTS(SELECT 1 FROM jsonb_array_elements(b.content->'options') o WHERE o->>'id'=chosen)
     OR NOT EXISTS(SELECT 1 FROM jsonb_array_elements(b.content->'options') o WHERE o->>'id'=expected->>'correct') THEN
    RAISE EXCEPTION 'Invalid choice or missing evaluation';
   END IF;
  ELSIF b.block_type='matching' AND jsonb_typeof(expected->'matches') IS DISTINCT FROM 'object' THEN
   RAISE EXCEPTION 'Missing evaluation';
  ELSIF b.block_type='sequence_sort' AND jsonb_typeof(expected->'order') IS DISTINCT FROM 'array' THEN
   RAISE EXCEPTION 'Missing evaluation';
  ELSIF b.block_type NOT IN ('objective','hook','rich_text','example','before_after','summary',
      'step_reveal','quiz','scenario','matching','sequence_sort','image_hotspot') THEN
   RAISE EXCEPTION 'Unsupported closed-learning block';
  END IF;
 END IF;
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
 IF closed_learning AND b.block_type IN ('quiz','scenario','matching','sequence_sort','image_hotspot') THEN
  correct:=coalesce(correct,false); complete:=correct;
 END IF;
 max_value:=CASE WHEN correct IS NULL THEN 0 ELSE b.points END;
 score_value:=CASE WHEN correct THEN b.points ELSE 0 END;
 IF closed_learning THEN
  complete:=coalesce(complete,false);
  response:=jsonb_build_object('complete',complete);
  IF correct IS NOT NULL THEN
   response:=response||jsonb_build_object('correct',correct,'explanation',
    CASE WHEN chosen IS NOT NULL THEN coalesce(k.feedback->'choices'->>chosen,k.feedback->>'explanation','Провери условията и опитай отново.')
      WHEN correct THEN coalesce(k.feedback->>'success','Решението покрива дадените условия.')
      ELSE coalesce(k.feedback->>'retry','Провери зависимостите и опитай отново.') END);
  END IF;
 ELSE
 response:=coalesce(k.feedback,'{}')||jsonb_build_object('complete',complete);
 IF correct IS NOT NULL THEN
  response:=response||jsonb_build_object('correct',correct);
  IF NOT (p_module IN ('s02-m01','s02-m02','s02-m03') AND correct IS DISTINCT FROM TRUE) THEN
   response:=response||jsonb_build_object('answer',expected);
  END IF;
 END IF;
 END IF;
 -- Never return an evaluator through a learner endpoint, including legacy versions.
 response:=response-'answer'-'answers'-'evaluation'-'answer_key'-'correctAnswer';
 IF b.block_type='matching' AND b.content ? 'studio' THEN
  SELECT string_agg(o->>'text','; ' ORDER BY ord) INTO failed_slots
  FROM jsonb_array_elements(b.content->'left') WITH ORDINALITY x(o,ord)
  WHERE p_payload->'matches'->>(o->>'id') IS DISTINCT FROM expected->'matches'->>(o->>'id');
  response:=response||jsonb_build_object('explanation',CASE WHEN correct THEN
   coalesce(k.feedback->>'success','Решенията покриват дадените условия.')
   ELSE 'Прегледай: '||coalesce(failed_slots,'връзката между изборите')||'. '||
    coalesce(k.feedback->>'retry','Сравни избраното с конкретните факти. Коригирай и опитай отново.') END);
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
END $function$
;

CREATE OR REPLACE FUNCTION academy_private.submit_visible_course_exam(
 p_module text,p_lesson text,p_version uuid,p_block_key text,p_payload jsonb,p_attempt uuid)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path='' AS $fn$
DECLARE b public.academy_lesson_blocks;
BEGIN
 IF auth.uid() IS NULL OR NOT academy_private.can_access(p_module) THEN
  RAISE EXCEPTION 'Access denied' USING ERRCODE='42501'; END IF;
 SELECT b0.* INTO b FROM public.academy_lessons l JOIN public.academy_lesson_blocks b0
 ON b0.version_id=l.published_version_id
 WHERE l.module_id=p_module AND l.lesson_id=p_lesson AND l.status='published'
 AND l.published_version_id=p_version AND b0.block_key=p_block_key AND b0.block_type='course_exam'
 FOR SHARE OF l;
 IF NOT FOUND THEN RAISE EXCEPTION 'Published exam not found'; END IF;
 PERFORM academy_private.assert_closed_block_payload(b.block_type,b.content,p_payload,false);
 RETURN academy_private.submit_course_exam(p_module,p_lesson,p_version,p_block_key,p_payload,p_attempt);
END $fn$;
REVOKE ALL ON FUNCTION academy_private.submit_visible_course_exam(text,text,uuid,text,jsonb,uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION academy_private.submit_visible_course_exam(text,text,uuid,text,jsonb,uuid) TO authenticated,service_role;

CREATE OR REPLACE FUNCTION public.academy_submit_course_exam(
 p_module text,p_lesson text,p_version uuid,p_block_key text,p_payload jsonb,p_attempt uuid)
RETURNS jsonb LANGUAGE sql SECURITY INVOKER SET search_path='' AS $fn$
 SELECT academy_private.submit_visible_course_exam(p_module,p_lesson,p_version,p_block_key,p_payload,p_attempt);
$fn$;
CREATE OR REPLACE FUNCTION academy_private.lesson_validation(p_version uuid)
 RETURNS jsonb
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path TO ''
AS $function$
DECLARE
  v public.academy_lesson_versions;
  errors jsonb:='[]'::jsonb;
  warnings jsonb:='[]'::jsonb;
  n integer;
  kinds text[];
BEGIN
  SELECT * INTO v FROM public.academy_lesson_versions WHERE id=p_version;
  IF NOT FOUND THEN RAISE EXCEPTION 'Version not found'; END IF;
 IF EXISTS(SELECT 1 FROM public.academy_lesson_blocks WHERE version_id=p_version AND block_type='calculator') THEN
  errors:=errors||jsonb_build_array('retired_unbounded_number_input'); END IF;

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
END $function$
;

