-- Generic exam grading only. Paid course text and answer keys are published privately.
-- Preserve the Perfect Video exam contract while adding Marketing Basics coverage.
SET lock_timeout = '5s';

CREATE OR REPLACE FUNCTION academy_private.submit_course_exam(
  p_module text,p_lesson text,p_version uuid,p_block_key text,p_payload jsonb,p_attempt uuid)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path='' AS $exam$
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
END $exam$;

REVOKE ALL ON FUNCTION academy_private.submit_course_exam(text,text,uuid,text,jsonb,uuid) FROM PUBLIC,anon;
REVOKE ALL ON FUNCTION public.academy_submit_course_exam(text,text,uuid,text,jsonb,uuid) FROM PUBLIC,anon;
GRANT EXECUTE ON FUNCTION academy_private.submit_course_exam(text,text,uuid,text,jsonb,uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.academy_submit_course_exam(text,text,uuid,text,jsonb,uuid) TO authenticated;
