-- Scope: the authorized Silk Road closed-learning release only. Real grading keys stay in private staging.

CREATE OR REPLACE FUNCTION academy_private.complete_lesson_block(p_module text, p_lesson text, p_version uuid, p_block_key text, p_payload jsonb, p_attempt uuid)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
DECLARE uid uuid:=(SELECT auth.uid()); l public.academy_lessons; b public.academy_lesson_blocks; k academy_private.lesson_block_keys; prev public.academy_lesson_attempts_v2; complete boolean:=false; correct boolean:=NULL; score_value integer:=0; max_value integer:=0; response jsonb:='{}'; expected jsonb; supplied jsonb; required_ids text[]; progress jsonb; admin_preview boolean:=false; silk_closed boolean:=false; chosen text;
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
 IF b.block_type='course_exam' THEN RAISE EXCEPTION 'Use the course exam endpoint'; END IF;
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
 silk_closed:=p_module ~ '^s01-m(0[1-9]|1[01])$' AND EXISTS (
  SELECT 1 FROM public.academy_lesson_versions v WHERE v.id=p_version
   AND v.change_note='silk_road_closed_learning_20261008');
 IF silk_closed THEN
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
 IF silk_closed AND b.block_type IN ('quiz','scenario','matching','sequence_sort','image_hotspot') THEN
  correct:=coalesce(correct,false); complete:=correct;
 END IF;
 max_value:=CASE WHEN correct IS NULL THEN 0 ELSE b.points END;
 score_value:=CASE WHEN correct THEN b.points ELSE 0 END;
 IF silk_closed THEN
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

CREATE OR REPLACE FUNCTION academy_private.submit_silk_road_exam(
 p_module text,p_lesson text,p_version uuid,p_block_key text,p_payload jsonb,p_attempt uuid)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path='' AS $function$
DECLARE
 uid uuid:=(SELECT auth.uid()); lesson_row public.academy_lessons; exam_block public.academy_lesson_blocks;
 previous public.academy_lesson_attempts_v2; question jsonb; answers jsonb; expected jsonb; keys jsonb;
 provided text; qid text; total integer:=33; passed_count integer:=0; module_number integer;
 prior_count integer; exam_percent numeric; score_value integer; result jsonb; progress jsonb;
 passed boolean; critical_ok boolean:=true; critical_failed text[]:=ARRAY[]::text[];
 weak_modules text[]:=ARRAY[]::text[]; group_correct integer[]:=array_fill(0,ARRAY[11]);
 group_totals integer[]:=array_fill(0,ARRAY[11]); group_results jsonb:='[]';
BEGIN
 IF uid IS NULL OR p_module IS DISTINCT FROM 's01-m11' OR p_lesson IS DISTINCT FROM 'l11-04'
    OR NOT academy_private.can_access(p_module) THEN RAISE EXCEPTION 'Access denied' USING ERRCODE='42501'; END IF;
 IF p_attempt IS NULL OR jsonb_typeof(p_payload) IS DISTINCT FROM 'object' OR pg_column_size(p_payload)>65536
    OR jsonb_typeof(p_payload->'answers') IS DISTINCT FROM 'object' THEN RAISE EXCEPTION 'Invalid exam payload'; END IF;
 SELECT l.* INTO lesson_row FROM public.academy_lessons l JOIN public.academy_lesson_versions v ON v.id=l.published_version_id
 WHERE l.module_id=p_module AND l.lesson_id=p_lesson AND l.status='published' AND v.id=p_version
  AND v.change_note='silk_road_closed_learning_20261008';
 IF NOT FOUND THEN RAISE EXCEPTION 'Published exam not found'; END IF;
 SELECT * INTO exam_block FROM public.academy_lesson_blocks WHERE version_id=p_version
  AND block_key=p_block_key AND block_type='course_exam' AND required;
 IF NOT FOUND THEN RAISE EXCEPTION 'Exam block not found'; END IF;
 SELECT answer_key INTO keys FROM academy_private.lesson_block_keys WHERE block_id=exam_block.id;
 expected:=keys->'answers'; answers:=p_payload->'answers';
 IF jsonb_typeof(expected) IS DISTINCT FROM 'object' OR jsonb_typeof(exam_block.content->'questions') IS DISTINCT FROM 'array'
   OR jsonb_typeof(keys->'criticalQuestions') IS DISTINCT FROM 'array' THEN RAISE EXCEPTION 'Missing exam evaluation'; END IF;
 IF jsonb_array_length(exam_block.content->'questions')<>33 OR jsonb_array_length(keys->'criticalQuestions')<>3
   OR (exam_block.content->>'minimumPercent') IS DISTINCT FROM '80'
   OR (exam_block.content->>'minimumGroupPercent') IS DISTINCT FROM '60'
   OR (SELECT count(*) FROM jsonb_object_keys(expected))<>33
   OR (SELECT count(*) FROM jsonb_object_keys(answers))<>33
   OR (SELECT count(DISTINCT q->>'id') FROM jsonb_array_elements(exam_block.content->'questions') q)<>33
   OR (SELECT count(DISTINCT c) FROM jsonb_array_elements_text(keys->'criticalQuestions') c)<>3
   OR EXISTS(SELECT 1 FROM jsonb_array_elements_text(keys->'criticalQuestions') c WHERE NOT expected ? c) THEN
  RAISE EXCEPTION 'Invalid exam coverage or incomplete answers';
 END IF;
 PERFORM pg_advisory_xact_lock(hashtextextended(p_attempt::text,0));
 PERFORM pg_advisory_xact_lock(hashtextextended(uid::text||':'||exam_block.id::text,0));
 SELECT * INTO previous FROM public.academy_lesson_attempts_v2 WHERE id=p_attempt;
 IF FOUND THEN
  IF previous.user_id<>uid OR previous.block_id<>exam_block.id OR previous.payload<>p_payload THEN RAISE EXCEPTION 'Attempt conflict'; END IF;
  RETURN jsonb_build_object('attemptId',previous.id,'correct',previous.is_correct,'score',previous.score,'maxScore',previous.max_score,
   'feedback',previous.feedback,'progress',(SELECT to_jsonb(p) FROM public.academy_lesson_progress p
    WHERE p.user_id=uid AND p.academy_lesson_id=lesson_row.id));
 END IF;
 IF EXISTS(SELECT 1 FROM public.academy_lesson_progress p WHERE p.user_id=uid AND p.academy_lesson_id=lesson_row.id
  AND p.version_id=p_version AND p_block_key=ANY(p.completed_block_keys)) THEN RAISE EXCEPTION 'Exam already passed'; END IF;
 SELECT count(*) INTO prior_count FROM public.academy_lessons l
 JOIN public.academy_lesson_versions v ON v.id=l.published_version_id AND v.change_note='silk_road_closed_learning_20261008'
 JOIN public.academy_lesson_progress p ON p.academy_lesson_id=l.id AND p.user_id=uid
  AND p.version_id=l.published_version_id AND p.completed_at IS NOT NULL
 WHERE l.module_id ~ '^s01-m(0[1-9]|1[01])$' AND l.status='published' AND l.id<>lesson_row.id;
 IF prior_count<>73 THEN RAISE EXCEPTION 'Завърши текущите версии на предишните 73 урока преди финалния изпит.'; END IF;
 FOR question IN SELECT value FROM jsonb_array_elements(exam_block.content->'questions') LOOP
  qid:=question->>'id'; provided:=answers->>qid;
  IF coalesce(qid,'')='' OR coalesce(question->>'moduleId','') !~ '^s01-m(0[1-9]|1[01])$'
   OR jsonb_typeof(question->'options') IS DISTINCT FROM 'array'
   OR jsonb_typeof(answers->qid) IS DISTINCT FROM 'string'
   OR NOT EXISTS(SELECT 1 FROM jsonb_array_elements(question->'options') o WHERE o->>'id'=provided)
   OR NOT EXISTS(SELECT 1 FROM jsonb_array_elements(question->'options') o WHERE o->>'id'=expected->>qid) THEN
   RAISE EXCEPTION 'Invalid exam question or choice'; END IF;
  module_number:=right(question->>'moduleId',2)::integer;
  group_totals[module_number]:=group_totals[module_number]+1;
  IF provided=expected->>qid THEN passed_count:=passed_count+1; group_correct[module_number]:=group_correct[module_number]+1;
  ELSE
   IF NOT (question->>'moduleId')=ANY(weak_modules) THEN weak_modules:=array_append(weak_modules,question->>'moduleId'); END IF;
   IF (keys->'criticalQuestions') ? qid THEN
    critical_ok:=false; critical_failed:=array_append(critical_failed,question->>'moduleId');
   END IF;
  END IF;
 END LOOP;
 IF group_totals<>array_fill(3,ARRAY[11]) THEN RAISE EXCEPTION 'Incomplete final exam coverage'; END IF;
 passed:=passed_count*100>=33*80 AND critical_ok;
 FOR module_number IN 1..11 LOOP
  passed:=passed AND group_correct[module_number]>=2;
  group_results:=group_results||jsonb_build_array(jsonb_build_object(
   'label',coalesce(exam_block.content->'reviewMap'->>('s01-m'||lpad(module_number::text,2,'0')),'Модул '||module_number),
   'moduleId','s01-m'||lpad(module_number::text,2,'0'),'correctCount',group_correct[module_number],
   'totalQuestions',3,'scorePercent',round(100.0*group_correct[module_number]/3,1),
   'minimumPercent',60,'passed',group_correct[module_number]>=2));
 END LOOP;
 exam_percent:=round(100.0*passed_count/33,1); score_value:=round(exam_block.points::numeric*passed_count/33)::integer;
 result:=jsonb_build_object('complete',passed,'correct',passed,'scorePercent',exam_percent,'correctCount',passed_count,
  'totalQuestions',33,'weakModules',to_jsonb(weak_modules),'groupResults',group_results,
  'criticalPassed',critical_ok,'criticalModules',to_jsonb(critical_failed),
  'explanation',CASE WHEN passed THEN 'Изпитът е преминат. Покрити са общият минимум, всяка тема и критичните решения.'
    ELSE 'Нужни са поне 27 от 33, поне два от три във всяка тема и всички критични решения. Прегледай посочените теми и предай нов пълен опит.' END);
  INSERT INTO public.academy_lesson_attempts_v2(
    id,user_id,academy_lesson_id,version_id,block_id,payload,score,max_score,is_correct,feedback)
  VALUES(p_attempt,uid,lesson_row.id,p_version,exam_block.id,p_payload,
    score_value,exam_block.points,passed,result);
  INSERT INTO public.academy_lesson_progress(
    user_id,academy_lesson_id,version_id,current_block_key,block_state,completed_block_keys)
  VALUES(uid,lesson_row.id,p_version,p_block_key,jsonb_build_object(p_block_key,p_payload),
    CASE WHEN passed THEN ARRAY[p_block_key] ELSE ARRAY[]::text[] END)
  ON CONFLICT(user_id,academy_lesson_id) DO UPDATE SET
    version_id=EXCLUDED.version_id,current_block_key=EXCLUDED.current_block_key,
    block_state=CASE WHEN academy_lesson_progress.version_id=EXCLUDED.version_id
      THEN academy_lesson_progress.block_state||EXCLUDED.block_state ELSE EXCLUDED.block_state END,
    completed_block_keys=CASE WHEN academy_lesson_progress.version_id<>EXCLUDED.version_id
      THEN EXCLUDED.completed_block_keys
      WHEN passed AND NOT p_block_key=ANY(academy_lesson_progress.completed_block_keys)
      THEN array_append(academy_lesson_progress.completed_block_keys,p_block_key)
      ELSE academy_lesson_progress.completed_block_keys END,
    xp=CASE WHEN academy_lesson_progress.version_id=EXCLUDED.version_id THEN academy_lesson_progress.xp ELSE 0 END,
    score_percent=CASE WHEN academy_lesson_progress.version_id=EXCLUDED.version_id THEN academy_lesson_progress.score_percent ELSE NULL END,
    mastery_status=CASE WHEN academy_lesson_progress.version_id=EXCLUDED.version_id THEN academy_lesson_progress.mastery_status ELSE 'learning' END,
    completed_at=CASE WHEN academy_lesson_progress.version_id=EXCLUDED.version_id THEN academy_lesson_progress.completed_at ELSE NULL END,
    last_activity_at=now();
  progress:=academy_private.refresh_lesson_progress(uid,lesson_row.id);
  RETURN jsonb_build_object('attemptId',p_attempt,'correct',passed,
    'score',score_value,'maxScore',exam_block.points,'feedback',result,'progress',progress);
END $function$;

REVOKE ALL ON FUNCTION academy_private.submit_silk_road_exam(text,text,uuid,text,jsonb,uuid) FROM PUBLIC,anon,authenticated,service_role;

CREATE OR REPLACE FUNCTION academy_private.submit_course_exam(p_module text, p_lesson text, p_version uuid, p_block_key text, p_payload jsonb, p_attempt uuid)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
DECLARE
  uid uuid := (SELECT auth.uid());
  lesson_row public.academy_lessons;
  exam_block public.academy_lesson_blocks;
  previous public.academy_lesson_attempts_v2;
  question jsonb;
  answers jsonb;
  expected jsonb;
  provided text;
  total integer;
  passed_count integer := 0;
  exam_percent numeric;
  score_value integer;
  weak_modules text[] := ARRAY[]::text[];
  prior_count integer;
  result jsonb;
  progress jsonb;
  passed boolean;
  marketing boolean := p_module='s03-m20';
  final_marketing boolean := p_module='s03-m20' AND p_lesson='lm20-14';
  module_number integer;
  group_number integer;
  group_totals integer[] := ARRAY[0,0,0,0];
  group_correct integer[] := ARRAY[0,0,0,0];
  group_labels text[] := ARRAY['Основи · 01–04','Видимост и съдържание · 05–10',
    'Придобиване и измерване · 11–16','CRM, задържане и икономика · 17–20'];
  group_results jsonb := '[]'::jsonb;
  expected_group integer;
BEGIN
  IF p_module='s01-m11' AND p_lesson='l11-04' THEN
    RETURN academy_private.submit_silk_road_exam(p_module,p_lesson,p_version,p_block_key,p_payload,p_attempt);
  END IF;
  IF uid IS NULL OR p_module IS NULL OR p_module NOT IN ('s02-m15','s03-m20')
    OR NOT academy_private.can_access(p_module) THEN
    RAISE EXCEPTION 'Access denied' USING ERRCODE='42501';
  END IF;
  IF p_attempt IS NULL OR jsonb_typeof(p_payload) IS DISTINCT FROM 'object' OR
     pg_column_size(p_payload)>65536 OR jsonb_typeof(p_payload->'answers') IS DISTINCT FROM 'object' THEN
    RAISE EXCEPTION 'Invalid exam payload';
  END IF;
  SELECT * INTO lesson_row FROM public.academy_lessons
  WHERE module_id=p_module AND lesson_id=p_lesson AND status='published'
    AND published_version_id=p_version;
  IF NOT FOUND OR NOT (
    (p_module='s02-m15' AND p_lesson IN ('pv15-09','pv15-10','pv15-11','pv15-12','pv15-13')) OR
    (marketing AND p_lesson IN ('lm20-10','lm20-11','lm20-12','lm20-13','lm20-14'))
  ) THEN RAISE EXCEPTION 'Published exam not found'; END IF;
  SELECT * INTO exam_block FROM public.academy_lesson_blocks
  WHERE version_id=p_version AND block_key=p_block_key AND block_type='course_exam';
  IF NOT FOUND THEN RAISE EXCEPTION 'Exam block not found'; END IF;
  SELECT k.answer_key->'answers' INTO expected
  FROM academy_private.lesson_block_keys k WHERE k.block_id=exam_block.id;
  IF jsonb_typeof(expected) IS DISTINCT FROM 'object' OR
     jsonb_typeof(exam_block.content->'questions') IS DISTINCT FROM 'array' THEN
    RAISE EXCEPTION 'Exam has no answer key';
  END IF;

  -- Idempotency spans blocks; the learner/block lock also serializes different attempts.
  PERFORM pg_advisory_xact_lock(hashtextextended(p_attempt::text,0));
  PERFORM pg_advisory_xact_lock(hashtextextended(uid::text || ':' || exam_block.id::text,0));
  SELECT * INTO previous FROM public.academy_lesson_attempts_v2 WHERE id=p_attempt;
  IF FOUND THEN
    IF previous.user_id<>uid OR previous.block_id<>exam_block.id OR previous.payload<>p_payload THEN
      RAISE EXCEPTION 'Attempt conflict';
    END IF;
    RETURN jsonb_build_object('attemptId',previous.id,'correct',previous.is_correct,
      'score',previous.score,'maxScore',previous.max_score,'feedback',previous.feedback,
      'progress',(SELECT to_jsonb(p) FROM public.academy_lesson_progress p
        WHERE p.user_id=uid AND p.academy_lesson_id=lesson_row.id));
  END IF;
  IF EXISTS (SELECT 1 FROM public.academy_lesson_progress p
    WHERE p.user_id=uid AND p.academy_lesson_id=lesson_row.id AND p.version_id=p_version
      AND p_block_key=ANY(p.completed_block_keys)) THEN
    RAISE EXCEPTION 'Exam already passed';
  END IF;
  IF p_module='s02-m15' AND p_lesson='pv15-13' THEN
    SELECT count(*) INTO prior_count FROM public.academy_lessons l
    JOIN public.academy_lesson_progress p ON p.academy_lesson_id=l.id
      AND p.user_id=uid AND p.version_id=l.published_version_id AND p.completed_at IS NOT NULL
    WHERE l.module_id='s02-m15' AND l.status='published'
      AND l.lesson_id BETWEEN 'pv15-01' AND 'pv15-12';
    IF prior_count<>12 THEN
      RAISE EXCEPTION 'Complete the 12 previous module 15 lessons before the final exam';
    END IF;
  ELSIF final_marketing THEN
    SELECT count(*) INTO prior_count FROM public.academy_lessons l
    JOIN public.academy_lesson_progress p ON p.academy_lesson_id=l.id
      AND p.user_id=uid AND p.version_id=l.published_version_id AND p.completed_at IS NOT NULL
    WHERE l.module_id='s03-m20' AND l.status='published'
      AND l.lesson_id BETWEEN 'lm20-01' AND 'lm20-13';
    IF prior_count<>13 THEN
      RAISE EXCEPTION 'Завърши предишните 13 урока на модул 20, включително четирите групови проверки, преди финалния изпит.';
    END IF;
  END IF;

  answers:=p_payload->'answers';
  total:=jsonb_array_length(exam_block.content->'questions');
  IF total NOT BETWEEN 8 AND (CASE WHEN marketing THEN 60 ELSE 35 END) OR
     (SELECT count(*) FROM jsonb_object_keys(answers))<>total OR
     (SELECT count(*) FROM jsonb_object_keys(expected))<>total THEN
    RAISE EXCEPTION 'Answer every exam question exactly once';
  END IF;
  IF (SELECT count(DISTINCT q->>'id') FROM jsonb_array_elements(exam_block.content->'questions') q)<>total THEN
    RAISE EXCEPTION 'Invalid exam question identifiers';
  END IF;
  IF marketing THEN
    expected_group:=CASE p_lesson WHEN 'lm20-10' THEN 1 WHEN 'lm20-11' THEN 2
      WHEN 'lm20-12' THEN 3 WHEN 'lm20-13' THEN 4 ELSE 0 END;
    IF total<>(CASE p_lesson WHEN 'lm20-10' THEN 12 WHEN 'lm20-11' THEN 18
       WHEN 'lm20-12' THEN 18 WHEN 'lm20-13' THEN 12 ELSE 40 END)
       OR (exam_block.content->>'minimumPercent') IS DISTINCT FROM '80'
       OR (final_marketing AND (exam_block.content->>'minimumGroupPercent') IS DISTINCT FROM '60')
       OR EXISTS (SELECT 1 FROM jsonb_array_elements(exam_block.content->'questions') q
         GROUP BY q->>'moduleId' HAVING count(*)<>CASE WHEN final_marketing THEN 2 ELSE 3 END) THEN
      RAISE EXCEPTION 'Invalid Marketing Basics exam coverage';
    END IF;
  END IF;
  FOR question IN SELECT value FROM jsonb_array_elements(exam_block.content->'questions') LOOP
    IF coalesce(question->>'id','')='' OR jsonb_typeof(question->'options') IS DISTINCT FROM 'array' OR
       NOT EXISTS (SELECT 1 FROM jsonb_array_elements(question->'options') o
         WHERE o->>'id'=expected->>(question->>'id')) THEN
      RAISE EXCEPTION 'Invalid exam question configuration';
    END IF;
    provided:=answers->>(question->>'id');
    IF provided IS NULL OR jsonb_typeof(answers->(question->>'id')) IS DISTINCT FROM 'string' OR NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements(question->'options') o WHERE o->>'id'=provided
    ) THEN RAISE EXCEPTION 'Invalid or missing exam choice'; END IF;
    IF marketing THEN
      IF coalesce(question->>'moduleId','') !~ '^s03-m(0[1-9]|1[0-9]|20)$' THEN
        RAISE EXCEPTION 'Invalid Marketing Basics exam module';
      END IF;
      module_number:=right(question->>'moduleId',2)::integer;
      group_number:=CASE WHEN module_number<=4 THEN 1 WHEN module_number<=10 THEN 2
        WHEN module_number<=16 THEN 3 ELSE 4 END;
      IF expected_group<>0 AND group_number<>expected_group THEN
        RAISE EXCEPTION 'Invalid Marketing Basics exam coverage';
      END IF;
      group_totals[group_number]:=group_totals[group_number]+1;
    END IF;
    IF provided=expected->>(question->>'id') THEN
      passed_count:=passed_count+1;
      IF marketing THEN group_correct[group_number]:=group_correct[group_number]+1; END IF;
    ELSIF NOT (question->>'moduleId')=ANY(weak_modules) THEN
      weak_modules:=array_append(weak_modules,question->>'moduleId');
    END IF;
  END LOOP;
  -- Compare exact counts, never a rounded display percentage, to the pass threshold.
  passed:=passed_count*100>=total*80;
  exam_percent:=round(100.0*passed_count/total,CASE WHEN marketing THEN 1 ELSE 0 END);
  IF final_marketing THEN
    IF group_totals<>ARRAY[8,12,12,8] THEN RAISE EXCEPTION 'Incomplete final exam coverage'; END IF;
    FOR group_number IN 1..4 LOOP
      passed:=passed AND group_correct[group_number]*100>=group_totals[group_number]*60;
      group_results:=group_results||jsonb_build_array(jsonb_build_object(
        'label',group_labels[group_number],'correctCount',group_correct[group_number],
        'totalQuestions',group_totals[group_number],
        'scorePercent',round(100.0*group_correct[group_number]/group_totals[group_number],1),
        'minimumPercent',60,'passed',group_correct[group_number]*100>=group_totals[group_number]*60));
    END LOOP;
  END IF;
  score_value:=round(exam_block.points::numeric*passed_count/total)::integer;
  result:=jsonb_build_object('complete',passed,
    'scorePercent',exam_percent,'correctCount',passed_count,'totalQuestions',total,
    'weakModules',to_jsonb(weak_modules),'groupResults',group_results,
    'explanation',CASE WHEN passed THEN
      'Изпитът е преминат. Виж темите с грешки и провери тези решения в собствения си проект.'
      WHEN final_marketing THEN
      'Нужни са поне 80% общо и 60% във всяка група. Повтори посочените теми и предай нов пълен опит.'
      ELSE 'Повтори темите с грешки, после предай нов пълен опит. Верните отговори не се показват.' END);
  INSERT INTO public.academy_lesson_attempts_v2(
    id,user_id,academy_lesson_id,version_id,block_id,payload,score,max_score,is_correct,feedback)
  VALUES(p_attempt,uid,lesson_row.id,p_version,exam_block.id,p_payload,
    score_value,exam_block.points,passed,result);
  INSERT INTO public.academy_lesson_progress(
    user_id,academy_lesson_id,version_id,current_block_key,block_state,completed_block_keys)
  VALUES(uid,lesson_row.id,p_version,p_block_key,jsonb_build_object(p_block_key,p_payload),
    CASE WHEN passed THEN ARRAY[p_block_key] ELSE ARRAY[]::text[] END)
  ON CONFLICT(user_id,academy_lesson_id) DO UPDATE SET
    version_id=EXCLUDED.version_id,current_block_key=EXCLUDED.current_block_key,
    block_state=CASE WHEN academy_lesson_progress.version_id=EXCLUDED.version_id
      THEN academy_lesson_progress.block_state||EXCLUDED.block_state ELSE EXCLUDED.block_state END,
    completed_block_keys=CASE WHEN academy_lesson_progress.version_id<>EXCLUDED.version_id
      THEN EXCLUDED.completed_block_keys
      WHEN passed AND NOT p_block_key=ANY(academy_lesson_progress.completed_block_keys)
      THEN array_append(academy_lesson_progress.completed_block_keys,p_block_key)
      ELSE academy_lesson_progress.completed_block_keys END,
    xp=CASE WHEN academy_lesson_progress.version_id=EXCLUDED.version_id THEN academy_lesson_progress.xp ELSE 0 END,
    score_percent=CASE WHEN academy_lesson_progress.version_id=EXCLUDED.version_id THEN academy_lesson_progress.score_percent ELSE NULL END,
    mastery_status=CASE WHEN academy_lesson_progress.version_id=EXCLUDED.version_id THEN academy_lesson_progress.mastery_status ELSE 'learning' END,
    completed_at=CASE WHEN academy_lesson_progress.version_id=EXCLUDED.version_id THEN academy_lesson_progress.completed_at ELSE NULL END,
    last_activity_at=now();
  progress:=academy_private.refresh_lesson_progress(uid,lesson_row.id);
  RETURN jsonb_build_object('attemptId',p_attempt,'correct',passed,
    'score',score_value,'maxScore',exam_block.points,'feedback',result,'progress',progress);
END $function$;

-- PUBLISH_CLOSED_CURRICULUM
-- One atomic publication. The old versions, attempts and progress rows remain intact.
DO $publish$
DECLARE
 release_name constant text:='silk_road_closed_learning_20261008';
 staged record; target public.academy_lessons; payload jsonb; item jsonb;
 next_version integer; version_id uuid; block_id uuid; validation_result jsonb;
 published_count integer; module_counts integer[]; active_count integer;
BEGIN
 PERFORM pg_advisory_xact_lock(hashtextextended(release_name,0));
 SELECT count(*) INTO published_count FROM public.academy_lessons l
 JOIN public.academy_lesson_versions v ON v.id=l.published_version_id
 WHERE l.module_id ~ '^s01-m(0[1-9]|1[01])$' AND v.change_note=release_name;
 IF published_count=74 THEN RETURN; END IF;
 IF published_count<>0 THEN RAISE EXCEPTION 'Partial release detected; publication stopped'; END IF;
 SELECT count(*) INTO active_count FROM public.academy_lessons
 WHERE module_id ~ '^s01-m(0[1-9]|1[01])$' AND status='published';
 SELECT array_agg(n ORDER BY module_id) INTO module_counts FROM (
  SELECT module_id,count(*)::integer AS n FROM academy_private.silk_road_release_lessons
  WHERE release_key=release_name GROUP BY module_id) s;
 IF active_count<>74 OR module_counts IS DISTINCT FROM ARRAY[4,10,10,10,10,10,4,4,4,4,4] THEN
  RAISE EXCEPTION 'Incomplete course staging'; END IF;
 -- Lock the scoped catalog before checking its original version pointers.
 PERFORM 1 FROM public.academy_lessons l WHERE l.module_id ~ '^s01-m(0[1-9]|1[01])$' ORDER BY l.id FOR UPDATE;
 FOR staged IN SELECT * FROM academy_private.silk_road_release_lessons
  WHERE release_key=release_name ORDER BY module_id,lesson_id LOOP
  SELECT * INTO target FROM public.academy_lessons WHERE module_id=staged.module_id AND lesson_id=staged.lesson_id;
  IF NOT FOUND OR target.status<>'published' OR target.published_version_id IS DISTINCT FROM staged.expected_version_id
    OR target.draft_version_id IS DISTINCT FROM target.published_version_id THEN
   RAISE EXCEPTION 'Course changed since audit: %/%',staged.module_id,staged.lesson_id; END IF;
  payload:=staged.payload;
  IF payload->>'module' IS DISTINCT FROM staged.module_id OR payload->>'lesson' IS DISTINCT FROM staged.lesson_id
    OR payload->>'change_note' IS DISTINCT FROM release_name OR jsonb_typeof(payload->'blocks') IS DISTINCT FROM 'array'
    OR jsonb_array_length(payload->'blocks') NOT BETWEEN 8 AND 35
    OR btrim(coalesce(payload->>'title',''))='' OR btrim(coalesce(payload->>'objective',''))=''
    OR btrim(coalesce(payload->>'hook',''))='' THEN RAISE EXCEPTION 'Invalid staged lesson'; END IF;
  IF (SELECT count(*) FROM jsonb_array_elements(payload->'blocks') b
      WHERE b->>'type' IN ('quiz','scenario','matching','sequence_sort','image_hotspot') AND (b->>'required')::boolean)<3
    OR EXISTS(SELECT 1 FROM jsonb_array_elements(payload->'blocks') b WHERE b->>'type' NOT IN
      ('objective','hook','rich_text','example','before_after','step_reveal','summary','quiz','scenario','matching','sequence_sort','image_hotspot','course_exam')
       OR b->'content' ?| ARRAY['evaluation','answer_key','correct','modelAnswer']) THEN
   RAISE EXCEPTION 'Invalid closed-learning structure'; END IF;
  SELECT coalesce(max(version_number),0)+1 INTO next_version FROM public.academy_lesson_versions WHERE academy_lesson_id=target.id;
  INSERT INTO public.academy_lesson_versions(academy_lesson_id,version_number,origin_version_id,title,subtitle,duration,
    objective,hook,estimated_minutes,source_kind,change_note)
  VALUES(target.id,next_version,target.published_version_id,payload->>'title',payload->>'subtitle',
    (payload->>'estimated_minutes')||' мин',payload->>'objective',payload->>'hook',(payload->>'estimated_minutes')::integer,'editor',release_name)
  RETURNING id INTO version_id;
  FOR item IN SELECT value FROM jsonb_array_elements(payload->'blocks') LOOP
   IF item->>'type' IN ('quiz','scenario','image_hotspot') THEN
    IF jsonb_typeof(item->'evaluation') IS DISTINCT FROM 'object'
      OR NOT EXISTS(SELECT 1 FROM jsonb_array_elements(item->'content'->'options') o WHERE o->>'id'=item->'evaluation'->>'correct')
      OR jsonb_typeof(item->'feedback'->'choices') IS DISTINCT FROM 'object' THEN RAISE EXCEPTION 'Invalid choice evaluation'; END IF;
   ELSIF item->>'type'='matching' AND jsonb_typeof(item->'evaluation'->'matches') IS DISTINCT FROM 'object' THEN
    RAISE EXCEPTION 'Invalid matching evaluation';
   ELSIF item->>'type'='sequence_sort' AND jsonb_typeof(item->'evaluation'->'order') IS DISTINCT FROM 'array' THEN
    RAISE EXCEPTION 'Invalid sequence evaluation';
   ELSIF item->>'type'='course_exam' THEN
    IF staged.lesson_id<>'l11-04' OR staged.module_id<>'s01-m11'
      OR jsonb_array_length(item->'content'->'questions')<>33
      OR (SELECT count(*) FROM jsonb_object_keys(item->'evaluation'->'answers'))<>33
      OR jsonb_array_length(item->'evaluation'->'criticalQuestions')<>3
      OR (SELECT count(DISTINCT q->>'moduleId') FROM jsonb_array_elements(item->'content'->'questions') q)<>11
      OR EXISTS(SELECT 1 FROM jsonb_array_elements(item->'content'->'questions') q
        WHERE q->>'moduleId' !~ '^s01-m(0[1-9]|1[01])$'
           OR NOT EXISTS(SELECT 1 FROM jsonb_array_elements(q->'options') o
               WHERE o->>'id'=item->'evaluation'->'answers'->>(q->>'id')))
      OR EXISTS(SELECT 1 FROM jsonb_array_elements(item->'content'->'questions') q GROUP BY q->>'moduleId' HAVING count(*)<>3)
      THEN RAISE EXCEPTION 'Invalid final exam'; END IF;
   END IF;
   INSERT INTO public.academy_lesson_blocks(version_id,block_key,position,block_type,title,content,required,points)
   VALUES(version_id,item->>'key',(item->>'position')::integer,item->>'type',item->>'title',item->'content',
     (item->>'required')::boolean,(item->>'points')::integer) RETURNING id INTO block_id;
   IF item ? 'evaluation' THEN
    INSERT INTO academy_private.lesson_block_keys(block_id,answer_key,feedback,scoring)
    VALUES(block_id,item->'evaluation',coalesce(item->'feedback','{}'),coalesce(item->'scoring','{}'));
   END IF;
  END LOOP;
  validation_result:=academy_private.lesson_validation(version_id);
  IF jsonb_array_length(validation_result->'errors')<>0 THEN RAISE EXCEPTION 'Lesson validation failed: %',staged.lesson_id; END IF;
  UPDATE public.academy_lesson_versions SET validation=validation_result WHERE id=version_id;
  UPDATE public.academy_lessons SET published_version_id=version_id,draft_version_id=version_id,status='published',updated_at=now()
  WHERE id=target.id;
  INSERT INTO public.academy_lesson_audit(academy_lesson_id,version_id,action,details)
  VALUES(target.id,version_id,'published',jsonb_build_object('release',release_name,'originVersionId',target.published_version_id,
    'closedLearning',true,'studentRecordsPreserved',true));
 END LOOP;
 IF (SELECT count(*) FROM public.academy_lesson_blocks b JOIN public.academy_lesson_versions v ON v.id=b.version_id
  WHERE v.change_note=release_name AND b.block_type='course_exam')<>1 THEN RAISE EXCEPTION 'Expected exactly one final exam'; END IF;
END $publish$;
