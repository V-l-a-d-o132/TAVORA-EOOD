-- Connect all 104 lessons in displayed Marketing Basics modules 1–10.
-- Add ten source-backed teaching guides and ten client dossiers (70 decisions).
-- lm01-01 remains stored under s03-m01 and displayed in module 10; preserve its identity.
-- Staged production grading remains owner-only; public review parts never include answers.
CREATE TABLE academy_private.marketing_sequence_first_ten_upgrades (
 release_key text NOT NULL CHECK(release_key='marketing_sequence_first_ten_20261025'),
 module_id text NOT NULL CHECK(module_id IN ('s03-m01','s03-m02','s03-m03','s03-m05','s03-m06','s03-m07','s03-m08','s03-m09','s03-m10','s03-m11')),
 lesson_id text NOT NULL,
 CHECK(module_id='s03-m'||substring(lesson_id FROM 3 FOR 2)),
 expected_version_id uuid NOT NULL REFERENCES public.academy_lesson_versions(id),
 expected_fingerprint text NOT NULL CHECK(expected_fingerprint ~ '^[a-f0-9]{32}$'),
 payload jsonb NOT NULL CHECK(jsonb_typeof(payload)='object'),
 created_at timestamptz NOT NULL DEFAULT now(),
 PRIMARY KEY(release_key,lesson_id)
);
ALTER TABLE academy_private.marketing_sequence_first_ten_upgrades ENABLE ROW LEVEL SECURITY;
ALTER TABLE academy_private.marketing_sequence_first_ten_upgrades FORCE ROW LEVEL SECURITY;
REVOKE ALL ON academy_private.marketing_sequence_first_ten_upgrades FROM PUBLIC,anon,authenticated,service_role;

CREATE OR REPLACE FUNCTION academy_private.marketing_sequence_first_ten_feedback(p_block uuid,p_payload jsonb,p_correct boolean)
RETURNS jsonb LANGUAGE plpgsql SECURITY INVOKER SET search_path='' AS $feedback$
DECLARE b public.academy_lesson_blocks; k academy_private.lesson_block_keys;
 slot jsonb; passed boolean; detail jsonb; selected_details jsonb:='[]'::jsonb;
BEGIN
 SELECT * INTO b FROM public.academy_lesson_blocks WHERE id=p_block;
 IF b.block_type IS DISTINCT FROM 'matching' OR b.content->'studio'->>'release' IS DISTINCT FROM 'marketing_sequence_first_ten_20261025' THEN
  RAISE EXCEPTION 'Not a marketing AI decision block'; END IF;
 SELECT * INTO k FROM academy_private.lesson_block_keys WHERE block_id=p_block;
 FOR slot IN SELECT value FROM jsonb_array_elements(b.content->'left') LOOP
  passed:=(p_payload->'matches'->>(slot->>'id')) IS NOT DISTINCT FROM (k.answer_key->'matches'->>(slot->>'id'));
  detail:=k.feedback->'details'->(slot->>'id');
  selected_details:=selected_details||jsonb_build_array(jsonb_build_object(
   'label',slot->>'text','correct',passed,'note',CASE WHEN passed THEN detail->>'success' ELSE detail->>'retry' END));
 END LOOP;
 RETURN jsonb_build_object('complete',p_correct,'correct',p_correct,
  'explanation',CASE WHEN p_correct THEN k.feedback->>'success' ELSE k.feedback->>'retry' END,'details',selected_details);
END $feedback$;
REVOKE ALL ON FUNCTION academy_private.marketing_sequence_first_ten_feedback(uuid,jsonb,boolean) FROM PUBLIC,anon,authenticated,service_role;

DO $extend_marketing_ai_feedback$
DECLARE definition text; anchor text; replacement text;
BEGIN
 definition:=pg_get_functiondef('academy_private.complete_lesson_block(text,text,uuid,text,jsonb,uuid)'::regprocedure);
 IF strpos(definition,'academy_private.marketing_sequence_first_ten_feedback(')=0 THEN
  -- Preserve the current grader verbatim; only add a release-scoped branch at a unique anchor.
  anchor:=' IF uid IS NULL OR admin_preview THEN';
  replacement:=' IF b.block_type=''matching'' AND b.content->''studio''->>''release''=''marketing_sequence_first_ten_20261025'' THEN'||chr(10)||
   '  response:=academy_private.marketing_sequence_first_ten_feedback(b.id,p_payload,correct);'||chr(10)||
   ' END IF;'||chr(10)||anchor;
  IF length(definition)-length(replace(definition,anchor,''))<>length(anchor) THEN RAISE EXCEPTION 'Preview branch changed'; END IF;
  EXECUTE replace(definition,anchor,replacement);
 END IF;
END $extend_marketing_ai_feedback$;

CREATE FUNCTION academy_private.publish_marketing_sequence_first_ten()
RETURNS jsonb LANGUAGE plpgsql SECURITY INVOKER SET search_path='' AS $publish$
DECLARE release_name constant text:='marketing_sequence_first_ten_20261025';
 staged record; target public.academy_lessons; old_version public.academy_lesson_versions;
 old_block public.academy_lesson_blocks; prior record; amendment jsonb; item jsonb;
 next_version_id uuid; next_block_id uuid; next_number integer; next_position integer;
 fingerprint text; validation_result jsonb; counts integer[]; safe_keys text[];
 kept_keys text[]; kept_state jsonb; fully_carried boolean; checkpoint_inserted boolean;
 published integer:=0; carried integer:=0; added integer:=0;
BEGIN
 PERFORM pg_advisory_xact_lock(hashtextextended(release_name,0));
 IF (SELECT count(*) FROM public.academy_lessons l JOIN public.academy_lesson_versions v ON v.id=l.published_version_id WHERE v.validation->>'marketingSequenceEdition'=release_name)=104 THEN RETURN jsonb_build_object('published',104,'alreadyPublished',true); END IF;
 SELECT array_agg(n ORDER BY module_id) INTO counts FROM (SELECT module_id,count(*)::integer n FROM academy_private.marketing_sequence_first_ten_upgrades WHERE release_key=release_name GROUP BY module_id) c;
 IF counts IS DISTINCT FROM ARRAY[8,8,8,8,12,10,14,14,12,10] OR (SELECT count(*) FROM public.academy_lessons WHERE module_id IN ('s03-m01','s03-m02','s03-m03','s03-m05','s03-m06','s03-m07','s03-m08','s03-m09','s03-m10','s03-m11') AND status='published')<>104 THEN RAISE EXCEPTION 'Incomplete first-ten sequence batch'; END IF;
 IF (SELECT count(*) FROM academy_private.marketing_sequence_first_ten_upgrades s CROSS JOIN LATERAL jsonb_array_elements(s.payload->'additions') a WHERE a->>'key'='marketing_route_guide_20261025')<>10 OR (SELECT count(*) FROM academy_private.marketing_sequence_first_ten_upgrades s CROSS JOIN LATERAL jsonb_array_elements(s.payload->'additions') a WHERE a->>'key'='marketing_route_case_20261025')<>10 THEN RAISE EXCEPTION 'Expected ten guides and ten client cases'; END IF;
 PERFORM 1 FROM public.academy_lessons l WHERE (l.module_id,l.lesson_id) IN (SELECT module_id,lesson_id FROM academy_private.marketing_sequence_first_ten_upgrades) ORDER BY l.id FOR UPDATE;
 FOR staged IN SELECT * FROM academy_private.marketing_sequence_first_ten_upgrades WHERE release_key=release_name ORDER BY module_id,lesson_id FOR SHARE LOOP
  SELECT * INTO target FROM public.academy_lessons WHERE module_id=staged.module_id AND lesson_id=staged.lesson_id;
  IF NOT FOUND OR target.status<>'published' OR target.published_version_id IS DISTINCT FROM staged.expected_version_id
    OR target.draft_version_id IS DISTINCT FROM target.published_version_id THEN
   RAISE EXCEPTION 'Course changed since staging: %',staged.lesson_id; END IF;
  SELECT * INTO old_version FROM public.academy_lesson_versions WHERE id=target.published_version_id FOR SHARE;
  PERFORM 1 FROM public.academy_lesson_blocks WHERE version_id=old_version.id ORDER BY id FOR SHARE;
  PERFORM 1 FROM academy_private.lesson_block_keys k JOIN public.academy_lesson_blocks b ON b.id=k.block_id
   WHERE b.version_id=old_version.id ORDER BY k.block_id FOR SHARE OF k;
  SELECT md5(to_jsonb(target)::text||to_jsonb(old_version)::text||coalesce((
   SELECT string_agg(to_jsonb(b)::text||coalesce(to_jsonb(k)::text,''),'' ORDER BY b.position,b.id)
   FROM public.academy_lesson_blocks b LEFT JOIN academy_private.lesson_block_keys k ON k.block_id=b.id
   WHERE b.version_id=old_version.id),'')) INTO fingerprint;
  IF fingerprint IS DISTINCT FROM staged.expected_fingerprint THEN RAISE EXCEPTION 'Content changed since staging: %',staged.lesson_id; END IF;
  IF jsonb_typeof(staged.payload->'amendments') IS DISTINCT FROM 'array'
     OR jsonb_typeof(staged.payload->'additions') IS DISTINCT FROM 'array'
     OR jsonb_array_length(staged.payload->'amendments') NOT BETWEEN 2 AND 3
     OR jsonb_array_length(staged.payload->'additions') NOT BETWEEN 0 AND 2
     OR (SELECT count(DISTINCT a->>'key') FROM jsonb_array_elements(staged.payload->'additions') a)<>jsonb_array_length(staged.payload->'additions') THEN RAISE EXCEPTION 'Invalid sequence payload'; END IF;
  IF EXISTS(SELECT 1 FROM jsonb_array_elements(staged.payload->'amendments') a
    LEFT JOIN public.academy_lesson_blocks b ON b.version_id=old_version.id AND b.block_key=a->>'key'
    WHERE b.id IS NULL OR b.block_type NOT IN ('objective','summary','rich_text','concept')
      OR jsonb_typeof(a->'content') IS DISTINCT FROM 'object'
      OR (b.block_type='objective' AND a->>'points' IS DISTINCT FROM '5')
      OR (b.block_type<>'objective' AND a ? 'points')
      OR (b.block_type<>'summary' AND NOT starts_with(coalesce(a->'content'->>'body',''),replace(replace(replace(coalesce(b.content->>'body',''),'напиши две задания','сравни двете посоки за задание'),'направи шест реда по маршрута. За всеки дай наличен факт, липса и полезна следваща проверка.','проследи шестте етапа на маршрута. За всеки различи наличен факт, липса и полезна следваща проверка.'),'за три учебни реплики напиши цитат, видима липса, какво не знаеш и отговор.','при трите учебни реплики различи точния цитат, видимата липса, неизвестното и подходящия отговор.')))
      OR (b.block_type='summary' AND (NOT starts_with(coalesce(a->'content'->>'nextStep',''),replace(replace(replace(coalesce(b.content->>'nextStep',''),'напиши две задания','сравни двете посоки за задание'),'направи шест реда по маршрута. За всеки дай наличен факт, липса и полезна следваща проверка.','проследи шестте етапа на маршрута. За всеки различи наличен факт, липса и полезна следваща проверка.'),'за три учебни реплики напиши цитат, видима липса, какво не знаеш и отговор.','при трите учебни реплики различи точния цитат, видимата липса, неизвестното и подходящия отговор.')) OR a->'content'->'takeaways' IS DISTINCT FROM b.content->'takeaways'))
      OR (b.block_type='objective' AND (a->'content'->'outcomes' IS DISTINCT FROM b.content->'outcomes'
        OR NOT starts_with(coalesce(a->'content'->>'deliverable',''),coalesce(b.content->>'deliverable',''))
        OR NOT starts_with(coalesce(a->'content'->>'check',''),coalesce(b.content->>'check','')))))
    OR (SELECT count(*) FROM jsonb_array_elements(staged.payload->'amendments'))<>
       (SELECT count(DISTINCT a->>'key') FROM jsonb_array_elements(staged.payload->'amendments') a)
    OR NOT EXISTS(SELECT 1 FROM jsonb_array_elements(staged.payload->'amendments') a JOIN public.academy_lesson_blocks b ON b.version_id=old_version.id AND b.block_key=a->>'key' WHERE b.block_type='objective')
    OR NOT EXISTS(SELECT 1 FROM jsonb_array_elements(staged.payload->'amendments') a JOIN public.academy_lesson_blocks b ON b.version_id=old_version.id AND b.block_key=a->>'key' WHERE b.block_type='summary') THEN
   RAISE EXCEPTION 'Unexpected amendment: %',staged.lesson_id; END IF;
  FOR item IN SELECT value FROM jsonb_array_elements(staged.payload->'additions') LOOP
   IF item->>'key' NOT IN ('marketing_route_guide_20261025','marketing_route_case_20261025')
     OR item->>'required' IS DISTINCT FROM 'true' OR length(coalesce(item->>'title',''))<10
     OR jsonb_typeof(item->'content') IS DISTINCT FROM 'object'
     OR (item->'content')::text ~ '"(evaluation|answer_key|answerKey|answers|correct|modelAnswer|feedback)"[[:space:]]*:' THEN
    RAISE EXCEPTION 'Invalid public addition: %',staged.lesson_id; END IF;
   IF item->>'key'='marketing_route_guide_20261025' THEN
    IF item->>'type' IS DISTINCT FROM 'rich_text' OR item->>'points' IS DISTINCT FROM '0'
      OR length(coalesce(item->'content'->>'body',''))<500
      OR staged.lesson_id NOT IN ('lm01-00','lm02-01','lm05-01','lm03-01','lm07-01','lm10-01','lm11-01','lm08-01','lm06-01','lm09-01')
      OR NOT EXISTS(SELECT 1 FROM public.academy_lesson_blocks g WHERE g.version_id=old_version.id AND g.block_key=item->>'insertBefore' AND g.block_type IN ('rich_text','concept')) THEN RAISE EXCEPTION 'Invalid sequence guide'; END IF;
   ELSE
    IF item->>'type' IS DISTINCT FROM 'matching' OR item->>'points' IS DISTINCT FROM '20'
      OR item->'content'->'studio'->>'domain' IS DISTINCT FROM 'marketing'
      OR item->'content'->'studio'->>'release' IS DISTINCT FROM release_name
      OR staged.lesson_id NOT IN ('lm01-07','lm02-07','lm05-08','lm03-04','lm07-10','lm10-12','lm11-10','lm08-14','lm06-12','lm09-14')
      OR item->'content'->'studio'->>'productionKind' IS DISTINCT FROM 'brief'
      OR jsonb_array_length(item->'content'->'left')<>7
      OR (SELECT count(*) FROM jsonb_array_elements(item->'content'->'left') s WHERE s->>'phase'='base')<>5
      OR jsonb_typeof(item->'evaluation'->'matches') IS DISTINCT FROM 'object'
      OR jsonb_typeof(item->'feedback'->'details') IS DISTINCT FROM 'object'
      OR (SELECT count(*) FROM jsonb_object_keys(item->'evaluation'->'matches'))<>jsonb_array_length(item->'content'->'left')
      OR (SELECT count(*) FROM jsonb_object_keys(item->'feedback'->'details'))<>jsonb_array_length(item->'content'->'left')
      OR EXISTS(SELECT 1 FROM jsonb_array_elements(item->'content'->'left') s
        WHERE jsonb_array_length(s->'choices')<>3
        OR length(coalesce(item->'feedback'->'details'->(s->>'id')->>'success',''))<15
        OR length(coalesce(item->'feedback'->'details'->(s->>'id')->>'retry',''))<15) THEN
     RAISE EXCEPTION 'Invalid transfer specification: %',staged.lesson_id; END IF;
    PERFORM academy_private.assert_closed_block_payload('matching',item->'content',item->'evaluation',false);
   END IF;
  END LOOP;
  SELECT coalesce(max(version_number),0)+1 INTO next_number FROM public.academy_lesson_versions WHERE academy_lesson_id=target.id;
  INSERT INTO public.academy_lesson_versions(academy_lesson_id,version_number,origin_version_id,title,subtitle,duration,objective,hook,estimated_minutes,source_kind,change_note)
   -- Existing closed-learning and exam guards identify their engine through
   -- change_note. Track this edition in validation/audit, preserving that guard.
   VALUES(target.id,next_number,old_version.id,old_version.title,old_version.subtitle,old_version.duration,old_version.objective,old_version.hook,old_version.estimated_minutes,'editor',old_version.change_note)
   RETURNING id INTO next_version_id;
  next_position:=0; checkpoint_inserted:=false;
  FOR old_block IN SELECT * FROM public.academy_lesson_blocks WHERE version_id=old_version.id ORDER BY position,id LOOP
   FOR item IN SELECT value FROM jsonb_array_elements(staged.payload->'additions') a
     WHERE (a->>'key'='marketing_route_guide_20261025' AND a->>'insertBefore'=old_block.block_key)
       OR (a->>'key'='marketing_route_case_20261025' AND NOT checkpoint_inserted AND old_block.block_type IN ('course_exam','summary')) LOOP
    INSERT INTO public.academy_lesson_blocks(version_id,block_key,position,block_type,title,content,required,points)
     VALUES(next_version_id,item->>'key',next_position,item->>'type',item->>'title',item->'content',true,(item->>'points')::integer)
     RETURNING id INTO next_block_id;
    IF item->>'type'='matching' THEN
     INSERT INTO academy_private.lesson_block_keys(block_id,answer_key,feedback,scoring)
      VALUES(next_block_id,item->'evaluation',item->'feedback','{}'::jsonb);
     checkpoint_inserted:=true;
    END IF;
    added:=added+1; next_position:=next_position+10;
   END LOOP;
   SELECT value INTO amendment FROM jsonb_array_elements(staged.payload->'amendments') a WHERE a->>'key'=old_block.block_key;
   INSERT INTO public.academy_lesson_blocks(version_id,block_key,position,block_type,title,content,required,points)
    VALUES(next_version_id,old_block.block_key,next_position,old_block.block_type,old_block.title,coalesce(amendment->'content',old_block.content),old_block.required,CASE WHEN old_block.block_type='objective' THEN 5 ELSE old_block.points END)
    RETURNING id INTO next_block_id;
   INSERT INTO academy_private.lesson_block_keys(block_id,answer_key,feedback,scoring)
    SELECT next_block_id,answer_key,feedback,scoring FROM academy_private.lesson_block_keys WHERE block_id=old_block.id;
   next_position:=next_position+10;
  END LOOP;
  IF (SELECT count(*) FROM public.academy_lesson_blocks WHERE version_id=next_version_id)<>
     (SELECT count(*) FROM public.academy_lesson_blocks WHERE version_id=old_version.id)+jsonb_array_length(staged.payload->'additions') THEN
   RAISE EXCEPTION 'Addition boundary missing: %',staged.lesson_id; END IF;
  validation_result:=academy_private.lesson_validation(next_version_id);
  IF jsonb_array_length(validation_result->'errors')<>0 THEN RAISE EXCEPTION 'Lesson validation failed: %',staged.lesson_id; END IF;
  UPDATE public.academy_lesson_versions SET validation=old_version.validation||validation_result||jsonb_build_object('marketingSequenceEdition',release_name) WHERE id=next_version_id;
  UPDATE public.academy_lessons SET published_version_id=next_version_id,draft_version_id=next_version_id,updated_at=now() WHERE id=target.id;
  -- Carry only byte-identical taught and graded blocks. New work needs a new pass.
  SELECT coalesce(array_agg(b.block_key ORDER BY b.position),'{}'::text[]) INTO safe_keys
   FROM public.academy_lesson_blocks b JOIN public.academy_lesson_blocks old ON old.version_id=old_version.id AND old.block_key=b.block_key
   LEFT JOIN academy_private.lesson_block_keys nk ON nk.block_id=b.id LEFT JOIN academy_private.lesson_block_keys ok ON ok.block_id=old.id
   WHERE b.version_id=next_version_id AND ROW(b.block_type,b.title,b.required,b.points) IS NOT DISTINCT FROM ROW(old.block_type,old.title,old.required,old.points)
    AND b.content IS NOT DISTINCT FROM old.content
    AND ROW(nk.answer_key,nk.feedback,nk.scoring) IS NOT DISTINCT FROM ROW(ok.answer_key,ok.feedback,ok.scoring);
  FOR prior IN SELECT * FROM public.academy_lesson_progress WHERE academy_lesson_id=target.id AND version_id=old_version.id FOR UPDATE LOOP
   SELECT coalesce(array_agg(k ORDER BY ord),'{}'::text[]) INTO kept_keys FROM unnest(prior.completed_block_keys) WITH ORDINALITY x(k,ord) WHERE k=ANY(safe_keys);
   SELECT coalesce(jsonb_object_agg(key,value),'{}'::jsonb) INTO kept_state FROM jsonb_each(prior.block_state) WHERE key=ANY(safe_keys);
   SELECT NOT EXISTS(SELECT 1 FROM public.academy_lesson_blocks WHERE version_id=next_version_id AND required AND NOT block_key=ANY(kept_keys)) INTO fully_carried;
   UPDATE public.academy_lesson_progress SET version_id=next_version_id,completed_block_keys=kept_keys,block_state=kept_state,
    current_block_key=(SELECT b.block_key FROM public.academy_lesson_blocks b WHERE b.version_id=next_version_id AND b.required AND NOT b.block_key=ANY(kept_keys) ORDER BY b.position LIMIT 1),
    xp=(SELECT coalesce(sum(points),0) FROM public.academy_lesson_blocks WHERE version_id=next_version_id AND block_key=ANY(kept_keys)),
    score_percent=CASE WHEN fully_carried THEN prior.score_percent ELSE NULL END,
    mastery_status=CASE WHEN fully_carried THEN prior.mastery_status ELSE 'learning' END,
    completed_at=CASE WHEN fully_carried THEN prior.completed_at ELSE NULL END
   WHERE user_id=prior.user_id AND academy_lesson_id=target.id;
   carried:=carried+1;
  END LOOP;
  INSERT INTO public.academy_lesson_audit(academy_lesson_id,version_id,action,details)
   VALUES(target.id,next_version_id,'published',jsonb_build_object('release',release_name,'originVersionId',old_version.id,
    'originalBlockKeysRetained',true,'closedLearning',true,'creditPolicy','identical_existing_blocks_only'));
  published:=published+1;
 END LOOP;
 RETURN jsonb_build_object('published',published,'addedBlocks',added,'progressRowsCarried',carried,'release',release_name);
END $publish$;
REVOKE ALL ON FUNCTION academy_private.publish_marketing_sequence_first_ten() FROM PUBLIC,anon,authenticated,service_role;

