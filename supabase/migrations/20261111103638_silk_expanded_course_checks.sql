CREATE OR REPLACE FUNCTION academy_private.submit_silk_road_exam(p_module text, p_lesson text, p_version uuid, p_block_key text, p_payload jsonb, p_attempt uuid)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
DECLARE
 uid uuid:=(SELECT auth.uid()); lesson_row public.academy_lessons; exam_block public.academy_lesson_blocks;
 previous public.academy_lesson_attempts_v2; question jsonb; answers jsonb; expected jsonb; keys jsonb;
 provided text; qid text; total integer:=33; passed_count integer:=0; module_number integer;
 prior_count integer; required_count integer; exam_percent numeric; score_value integer; result jsonb; progress jsonb;
 passed boolean; critical_ok boolean:=true; critical_failed text[]:=ARRAY[]::text[];
 weak_modules text[]:=ARRAY[]::text[]; group_correct integer[]:=array_fill(0,ARRAY[11]);
 group_totals integer[]:=array_fill(0,ARRAY[11]); group_results jsonb:='[]';
BEGIN
 IF uid IS NULL OR p_module IS DISTINCT FROM 's01-m11' OR p_lesson IS DISTINCT FROM 'l11-04'
    OR NOT academy_private.can_access(p_module) THEN RAISE EXCEPTION 'Access denied' USING ERRCODE='42501'; END IF;
 IF p_attempt IS NULL OR jsonb_typeof(p_payload) IS DISTINCT FROM 'object' OR pg_column_size(p_payload)>65536
    OR jsonb_typeof(p_payload->'answers') IS DISTINCT FROM 'object' THEN RAISE EXCEPTION 'Invalid exam payload'; END IF;
 SELECT l.* INTO lesson_row FROM public.academy_lessons l JOIN public.academy_lesson_versions v ON v.id=l.published_version_id
 WHERE l.module_id=p_module AND l.lesson_id=p_lesson AND l.status='published' AND v.id=p_version FOR SHARE OF l;
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
 IF EXISTS(SELECT 1 FROM public.academy_lesson_blocks b WHERE b.version_id=p_version
   AND b.required AND b.block_key IN ('silk_studio_20261016','silk_worked_20261016','silk_transfer_20261018','silk_toolcheck_20261018')
   AND NOT EXISTS(SELECT 1 FROM public.academy_lesson_progress p WHERE p.user_id=uid
    AND p.academy_lesson_id=lesson_row.id AND p.version_id=p_version AND b.block_key=ANY(p.completed_block_keys))) THEN
  RAISE EXCEPTION 'Премини новата работна задача и разбора преди финалния изпит.'; END IF;
 SELECT count(*), count(p.completed_at) INTO required_count, prior_count
 FROM public.academy_lessons l
 LEFT JOIN public.academy_lesson_progress p ON p.academy_lesson_id=l.id
   AND p.user_id=uid AND p.version_id=l.published_version_id
 WHERE l.module_id ~ '^s01-m(0[1-9]|1[01])$' AND l.status='published'
   AND l.published_version_id IS NOT NULL AND l.id<>lesson_row.id;
 IF required_count=0 OR prior_count<>required_count THEN
  RAISE EXCEPTION 'Преди финалния изпит завърши текущите уроци. Преминати % от %.',prior_count,required_count;
 END IF;
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

-- Opt-in per private assessment key. Return the explanation for the selected option only.
DO $migration$
DECLARE
 signature regprocedure := 'academy_private.complete_lesson_block(text,text,uuid,text,jsonb,uuid)'::regprocedure;
 definition text := pg_get_functiondef(signature);
 anchor constant text := ' IF uid IS NULL OR admin_preview THEN';
 patch constant text := $guard$
 IF b.block_type IN ('quiz','scenario') AND k.scoring->>'feedbackMode'='selected_choice' THEN
  chosen:=CASE b.block_type WHEN 'quiz' THEN p_payload->>'answer' ELSE p_payload->>'selected' END;
  IF p_attempt IS NULL OR NOT EXISTS (
   SELECT 1 FROM jsonb_array_elements(b.content->'options') o WHERE o->>'id'=chosen
  ) THEN RAISE EXCEPTION 'Invalid choice or attempt'; END IF;
  IF correct IS NULL OR k.feedback->'choices'->>chosen IS NULL THEN RAISE EXCEPTION 'Missing choice evaluation'; END IF;
  response:=jsonb_build_object('complete',complete,'correct',correct,'explanation',k.feedback->'choices'->>chosen);
 END IF;
$guard$;
BEGIN
 IF strpos(definition,patch)>0 THEN RETURN; END IF;
 IF length(definition)-length(replace(definition,anchor,''))<>length(anchor) THEN
  RAISE EXCEPTION 'Unexpected grading function';
 END IF;
 EXECUTE replace(definition,anchor,patch||anchor);
END $migration$;
