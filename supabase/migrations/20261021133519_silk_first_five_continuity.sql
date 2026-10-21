-- Owner-only staged continuation. No learner data or grading keys in source control.
CREATE TABLE academy_private.silk_first_five_candidates (
 release_key text NOT NULL DEFAULT 'silk_first_five_continuity_v1' CHECK (release_key='silk_first_five_continuity_v1'),
 module_id text NOT NULL CHECK (module_id IN ('s01-m03','s01-m04','s01-m05')),
 lesson_id text NOT NULL,
 expected_version_id uuid NOT NULL REFERENCES public.academy_lesson_versions(id),
 expected_fingerprint text NOT NULL CHECK (expected_fingerprint ~ '^[a-f0-9]{32}$'),
 payload jsonb NOT NULL CHECK (jsonb_typeof(payload)='object'),
 updated_at timestamptz NOT NULL DEFAULT now(),
 PRIMARY KEY(release_key,lesson_id)
);
ALTER TABLE academy_private.silk_first_five_candidates ENABLE ROW LEVEL SECURITY;
ALTER TABLE academy_private.silk_first_five_candidates FORCE ROW LEVEL SECURITY;
REVOKE ALL ON academy_private.silk_first_five_candidates FROM PUBLIC,anon,authenticated,service_role;
CREATE OR REPLACE FUNCTION academy_private.publish_silk_first_five_continuity(p_manifest text)
 RETURNS jsonb
 LANGUAGE plpgsql
 SET search_path TO ''
AS $function$
DECLARE
 release_name constant text:='silk_first_five_continuity_v1';
 staged record; target public.academy_lessons; old_version public.academy_lesson_versions;
 prior record; item jsonb; choice_payload jsonb; validation_result jsonb;
 fingerprint text; manifest text; next_version_id uuid; next_block_id uuid;
 next_number integer; next_position integer; safe_keys text[]; kept_keys text[];
 kept_state jsonb; fully_carried boolean; published integer:=0; carried integer:=0;
BEGIN
 PERFORM pg_advisory_xact_lock(hashtextextended(release_name,0));
 PERFORM 1 FROM academy_private.silk_first_five_candidates WHERE release_key=release_name ORDER BY lesson_id FOR SHARE;
 SELECT md5(string_agg(lesson_id||payload::text,'|' ORDER BY lesson_id)) INTO manifest
  FROM academy_private.silk_first_five_candidates WHERE release_key=release_name;
 IF manifest IS DISTINCT FROM p_manifest OR p_manifest IS NULL THEN RAISE EXCEPTION 'Candidate manifest changed'; END IF;
 IF (SELECT count(*) FROM public.academy_lessons l JOIN public.academy_lesson_versions v ON v.id=l.published_version_id
   WHERE l.module_id IN ('s01-m03','s01-m04','s01-m05') AND v.validation->>'firstServiceEdition'=release_name
     AND v.validation->>'firstServiceManifest'=manifest)=30 THEN
  RETURN jsonb_build_object('published',30,'alreadyPublished',true,'manifest',manifest);
 END IF;
 IF (SELECT count(*) FROM academy_private.silk_first_five_candidates WHERE release_key=release_name)<>30
   OR (SELECT count(*) FROM academy_private.silk_first_five_candidates WHERE module_id='s01-m03')<>10
   OR (SELECT count(*) FROM academy_private.silk_first_five_candidates WHERE module_id='s01-m04')<>10
   OR (SELECT count(*) FROM academy_private.silk_first_five_candidates WHERE module_id='s01-m05')<>10
   OR EXISTS(SELECT 1 FROM academy_private.silk_first_five_candidates WHERE payload->>'ready' IS DISTINCT FROM 'true'
      OR module_id<>'s01-m'||substring(lesson_id FROM 2 FOR 2))
   OR (SELECT count(*) FROM public.academy_lessons WHERE module_id IN ('s01-m03','s01-m04','s01-m05') AND status='published')<>30 THEN
  RAISE EXCEPTION 'Incomplete first-service batch';
 END IF;
 PERFORM 1 FROM public.academy_lessons WHERE module_id IN ('s01-m03','s01-m04','s01-m05') ORDER BY id FOR UPDATE;
 FOR staged IN SELECT * FROM academy_private.silk_first_five_candidates WHERE release_key=release_name ORDER BY lesson_id LOOP
  SELECT * INTO target FROM public.academy_lessons WHERE module_id=staged.module_id AND lesson_id=staged.lesson_id;
  IF NOT FOUND OR target.status<>'published' OR target.published_version_id IS DISTINCT FROM staged.expected_version_id
    OR target.draft_version_id IS DISTINCT FROM target.published_version_id THEN
   RAISE EXCEPTION 'Lesson changed since staging: %',staged.lesson_id;
  END IF;
  SELECT * INTO old_version FROM public.academy_lesson_versions WHERE id=target.published_version_id FOR SHARE;
  IF old_version.change_note IS DISTINCT FROM 'silk_road_market_ready_20261009' THEN RAISE EXCEPTION 'Unexpected learning engine'; END IF;
  PERFORM 1 FROM public.academy_lesson_blocks WHERE version_id=old_version.id ORDER BY id FOR SHARE;
  PERFORM 1 FROM academy_private.lesson_block_keys k JOIN public.academy_lesson_blocks b ON b.id=k.block_id
   WHERE b.version_id=old_version.id ORDER BY k.block_id FOR SHARE OF k;
  SELECT md5(to_jsonb(target)::text||to_jsonb(old_version)::text||coalesce((
   SELECT string_agg(to_jsonb(b)::text||coalesce(to_jsonb(k)::text,''),'' ORDER BY b.position,b.id)
   FROM public.academy_lesson_blocks b LEFT JOIN academy_private.lesson_block_keys k ON k.block_id=b.id
   WHERE b.version_id=old_version.id),'')) INTO fingerprint;
  IF fingerprint IS DISTINCT FROM staged.expected_fingerprint THEN RAISE EXCEPTION 'Content changed since staging: %',staged.lesson_id; END IF;
  IF jsonb_typeof(staged.payload->'blocks') IS DISTINCT FROM 'array'
    OR length(coalesce(staged.payload->>'title',''))<10 OR length(coalesce(staged.payload->>'objective',''))<50
    OR length(coalesce(staged.payload->>'hook',''))<30
    OR staged.payload->'blocks'->0->>'type' IS DISTINCT FROM 'objective'
    OR staged.payload->'blocks'->0->>'points' IS DISTINCT FROM '5'
    OR jsonb_array_length(staged.payload->'blocks'->0->'content'->'outcomes')<5 THEN
   RAISE EXCEPTION 'Invalid detailed opening: %',staged.lesson_id;
  END IF;
  IF (SELECT count(*) FROM jsonb_array_elements(staged.payload->'blocks'))<>
     (SELECT count(DISTINCT b->>'key') FROM jsonb_array_elements(staged.payload->'blocks') b)
    OR EXISTS(SELECT block_key FROM public.academy_lesson_blocks WHERE version_id=old_version.id
      EXCEPT SELECT b->>'key' FROM jsonb_array_elements(staged.payload->'blocks') b)
    OR EXISTS(SELECT b->>'key' FROM jsonb_array_elements(staged.payload->'blocks') b
      EXCEPT SELECT block_key FROM public.academy_lesson_blocks WHERE version_id=old_version.id) THEN
   RAISE EXCEPTION 'Stable block keys changed: %',staged.lesson_id;
  END IF;
  FOR item IN SELECT value FROM jsonb_array_elements(staged.payload->'blocks') LOOP
   IF item->>'type' NOT IN ('objective','hook','rich_text','example','summary','before_after','step_reveal','matching','scenario','quiz','sequence_sort')
     OR jsonb_typeof(item->'content') IS DISTINCT FROM 'object'
     OR jsonb_typeof(item->'required') IS DISTINCT FROM 'boolean'
     OR (item->>'points')::integer NOT BETWEEN 0 AND 100 THEN RAISE EXCEPTION 'Invalid learning block: %',item->>'key'; END IF;
   IF (item->'content')::text ~ '"(evaluation|answer_key|answerKey|answers|correct|correctAnswer|modelAnswer|feedback)"[[:space:]]*:' THEN
    RAISE EXCEPTION 'Private data in public block: %',item->>'key'; END IF;
   IF item->>'type' IN ('matching','scenario','quiz','sequence_sort') THEN
    IF jsonb_typeof(item->'answer_key') IS DISTINCT FROM 'object' THEN RAISE EXCEPTION 'Missing private key'; END IF;
    choice_payload:=CASE item->>'type'
      WHEN 'quiz' THEN jsonb_build_object('answer',item->'answer_key'->'correct')
      WHEN 'scenario' THEN jsonb_build_object('selected',item->'answer_key'->'correct')
      ELSE item->'answer_key' END;
    PERFORM academy_private.assert_closed_block_payload(item->>'type',item->'content',choice_payload,false);
    IF item->>'type'='matching' AND (SELECT count(*) FROM jsonb_object_keys(item->'answer_key'->'matches'))<>
      jsonb_array_length(item->'content'->'left') THEN RAISE EXCEPTION 'Incomplete matching key'; END IF;
    IF item->>'type'='sequence_sort' AND jsonb_array_length(item->'answer_key'->'order')<>
      jsonb_array_length(item->'content'->'items') THEN RAISE EXCEPTION 'Incomplete ordering key'; END IF;
   ELSIF item ? 'answer_key' THEN RAISE EXCEPTION 'Unexpected grading key'; END IF;
   IF item->'content' ? 'studio' THEN
    IF item->>'type'<>'matching' OR item->'content'->'studio'->>'domain'<>'silk-road'
      OR item->'content'->'studio'->>'release' NOT IN ('practical_silk_20261016','silk_applied_20261018','silk_toolkit_20261018')
      OR jsonb_typeof(item->'feedback'->'details') IS DISTINCT FROM 'object'
      OR EXISTS(SELECT 1 FROM jsonb_array_elements(item->'content'->'left') s
        WHERE length(coalesce(item->'feedback'->'details'->(s->>'id')->>'success',''))<15
          OR length(coalesce(item->'feedback'->'details'->(s->>'id')->>'retry',''))<15) THEN
     RAISE EXCEPTION 'Invalid studio or feedback: %',item->>'key'; END IF;
   END IF;
  END LOOP;
  IF NOT EXISTS(SELECT 1 FROM jsonb_array_elements(staged.payload->'blocks') b WHERE b->>'key'='silk_studio_20261016' AND b->>'required'='true')
    OR (staged.lesson_id IN ('l03-10','l04-10','l05-10') AND
      (SELECT count(*) FROM jsonb_array_elements(staged.payload->'blocks') b WHERE b->>'key' IN ('silk_transfer_20261018','silk_toolcheck_20261018') AND b->>'required'='true')<>2) THEN
   RAISE EXCEPTION 'Required independent practice missing'; END IF;
  SELECT coalesce(max(version_number),0)+1 INTO next_number FROM public.academy_lesson_versions WHERE academy_lesson_id=target.id;
  INSERT INTO public.academy_lesson_versions(academy_lesson_id,version_number,origin_version_id,title,subtitle,duration,objective,hook,estimated_minutes,source_kind,change_note)
   VALUES(target.id,next_number,old_version.id,staged.payload->>'title',staged.payload->>'subtitle',old_version.duration,
     staged.payload->>'objective',staged.payload->>'hook',old_version.estimated_minutes,'editor',old_version.change_note)
   RETURNING id INTO next_version_id;
  next_position:=0;
  FOR item IN SELECT value FROM jsonb_array_elements(staged.payload->'blocks') LOOP
   INSERT INTO public.academy_lesson_blocks(version_id,block_key,position,block_type,title,content,required,points)
    VALUES(next_version_id,item->>'key',next_position,item->>'type',item->>'title',item->'content',(item->>'required')::boolean,(item->>'points')::integer)
    RETURNING id INTO next_block_id;
   IF item ? 'answer_key' THEN
    INSERT INTO academy_private.lesson_block_keys(block_id,answer_key,feedback,scoring)
     VALUES(next_block_id,item->'answer_key',coalesce(item->'feedback','{}'::jsonb),coalesce(item->'scoring','{}'::jsonb));
   END IF;
   next_position:=next_position+10;
  END LOOP;
  validation_result:=academy_private.lesson_validation(next_version_id);
  IF jsonb_array_length(validation_result->'errors')<>0 THEN RAISE EXCEPTION 'Lesson validation failed: % %',staged.lesson_id,validation_result; END IF;
  UPDATE public.academy_lesson_versions SET validation=old_version.validation||validation_result||
    jsonb_build_object('firstServiceEdition',release_name,'firstServiceManifest',manifest) WHERE id=next_version_id;
  UPDATE public.academy_lessons SET published_version_id=next_version_id,draft_version_id=next_version_id,updated_at=now() WHERE id=target.id;
  -- Preserve credit only when visible teaching, points and private grading are identical.
  SELECT coalesce(array_agg(b.block_key ORDER BY b.position),'{}'::text[]) INTO safe_keys
   FROM public.academy_lesson_blocks b JOIN public.academy_lesson_blocks old ON old.version_id=old_version.id AND old.block_key=b.block_key
   LEFT JOIN academy_private.lesson_block_keys nk ON nk.block_id=b.id LEFT JOIN academy_private.lesson_block_keys ok ON ok.block_id=old.id
   WHERE b.version_id=next_version_id AND ROW(b.block_type,b.title,b.content,b.required,b.points)
     IS NOT DISTINCT FROM ROW(old.block_type,old.title,old.content,old.required,old.points)
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
   VALUES(target.id,next_version_id,'published',jsonb_build_object('release',release_name,'manifest',manifest,'originVersionId',old_version.id,
    'originalBlockKeysRetained',true,'closedLearning',true,'creditPolicy','identical_teaching_and_grading_only'));
  published:=published+1;
 END LOOP;
 RETURN jsonb_build_object('published',published,'progressRowsCarried',carried,'release',release_name,'manifest',manifest);
END $function$;


REVOKE ALL ON FUNCTION academy_private.publish_silk_first_five_continuity(text) FROM PUBLIC,anon,authenticated,service_role;
CREATE OR REPLACE FUNCTION academy_private.publish_silk_first_five(p_first text,p_continuation text)
RETURNS jsonb LANGUAGE plpgsql SET search_path='' AS $wrapper$
DECLARE first_result jsonb; continuation_result jsonb;
BEGIN
 first_result:=academy_private.publish_silk_first_service(p_first);
 continuation_result:=academy_private.publish_silk_first_five_continuity(p_continuation);
 RETURN jsonb_build_object('firstTwo',first_result,'nextThree',continuation_result);
END $wrapper$;
REVOKE ALL ON FUNCTION academy_private.publish_silk_first_five(text,text) FROM PUBLIC,anon,authenticated,service_role;

