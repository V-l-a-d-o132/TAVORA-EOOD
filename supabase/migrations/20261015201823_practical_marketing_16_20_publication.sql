-- Preserve the three published marketing editions and extend selected feedback.
-- Real answer maps are staged privately; existing course exam grading is unchanged.
DO $extend_marketing_feedback$
DECLARE definition text; anchor text; replacement text;
BEGIN
 definition:=pg_get_functiondef('academy_private.marketing_practice_feedback(uuid,jsonb,boolean)'::regprocedure);
 IF strpos(definition,'practical_marketing_16_20_20261015')=0 THEN
  IF (SELECT md5(prosrc) FROM pg_proc WHERE oid='academy_private.marketing_practice_feedback(uuid,jsonb,boolean)'::regprocedure)<>'1315f71a1a9150007b4ce508a80e5143' THEN
   RAISE EXCEPTION 'Marketing feedback helper changed since the modules 16-20 audit'; END IF;
  anchor:=$anchor$coalesce(b.content->'studio'->>'release','') NOT IN ('practical_marketing_first_5_20261015','practical_marketing_6_10_20261015','practical_marketing_11_15_20261015')$anchor$;
  replacement:=$replacement$coalesce(b.content->'studio'->>'release','') NOT IN ('practical_marketing_first_5_20261015','practical_marketing_6_10_20261015','practical_marketing_11_15_20261015','practical_marketing_16_20_20261015')$replacement$;
  IF length(definition)-length(replace(definition,anchor,''))<>length(anchor) THEN
   RAISE EXCEPTION 'Marketing feedback anchor changed'; END IF;
  EXECUTE replace(definition,anchor,replacement);
 END IF;
 definition:=pg_get_functiondef('academy_private.complete_lesson_block(text,text,uuid,text,jsonb,uuid)'::regprocedure);
 IF strpos(definition,'practical_marketing_16_20_20261015')=0 THEN
  IF (SELECT md5(prosrc) FROM pg_proc WHERE oid='academy_private.complete_lesson_block(text,text,uuid,text,jsonb,uuid)'::regprocedure)<>'04e770998b1768c60b3bab120d9b2009' THEN
   RAISE EXCEPTION 'Shared grader changed since the modules 16-20 audit'; END IF;
  anchor:=$anchor$b.content->'studio'->>'release' IN ('practical_marketing_first_5_20261015','practical_marketing_6_10_20261015','practical_marketing_11_15_20261015')$anchor$;
  replacement:=$replacement$b.content->'studio'->>'release' IN ('practical_marketing_first_5_20261015','practical_marketing_6_10_20261015','practical_marketing_11_15_20261015','practical_marketing_16_20_20261015')$replacement$;
  IF length(definition)-length(replace(definition,anchor,''))<>length(anchor) THEN
   RAISE EXCEPTION 'Shared feedback branch anchor changed'; END IF;
  EXECUTE replace(definition,anchor,replacement);
 END IF;
END $extend_marketing_feedback$;

CREATE TABLE academy_private.practical_marketing_16_20_upgrades (
 release_key text NOT NULL CHECK(release_key='practical_marketing_16_20_20261015'),
 module_id text NOT NULL CHECK(module_id IN ('s03-m14','s03-m17','s03-m18','s03-m19','s03-m20')),
 lesson_id text NOT NULL CHECK(lesson_id ~ '^lm(14|17|18|19|20)-[0-9]{2}$'),
 CHECK(module_id='s03-m'||substring(lesson_id FROM 3 FOR 2)),
 expected_version_id uuid NOT NULL REFERENCES public.academy_lesson_versions(id),
 expected_fingerprint text NOT NULL CHECK(expected_fingerprint ~ '^[a-f0-9]{32}$'),
 payload jsonb NOT NULL CHECK(jsonb_typeof(payload)='object'),
 created_at timestamptz NOT NULL DEFAULT now(),
 PRIMARY KEY(release_key,lesson_id)
);
ALTER TABLE academy_private.practical_marketing_16_20_upgrades ENABLE ROW LEVEL SECURITY;
ALTER TABLE academy_private.practical_marketing_16_20_upgrades FORCE ROW LEVEL SECURITY;
REVOKE ALL ON academy_private.practical_marketing_16_20_upgrades FROM PUBLIC,anon,authenticated,service_role;

-- The reviewed payload is staged separately. No real answer key belongs in git.
CREATE OR REPLACE FUNCTION academy_private.publish_practical_marketing_16_20()
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path='' AS $fn$
DECLARE release_name constant text:='practical_marketing_16_20_20261015';
 staged record; target public.academy_lessons; old_version public.academy_lesson_versions;
 old_block public.academy_lesson_blocks; prior record; new_version_id uuid; new_block_id uuid;
 next_version integer; next_position integer; fingerprint text; item jsonb; bridge jsonb; validation_result jsonb;
 counts integer[]; safe_keys text[]; kept_keys text[]; kept_state jsonb; upgraded integer:=0; carried integer:=0; practice_inserted boolean;
BEGIN
 PERFORM pg_advisory_xact_lock(hashtextextended(release_name,0));
 IF (SELECT count(*) FROM public.academy_lessons l JOIN public.academy_lesson_blocks b
   ON b.version_id=l.published_version_id WHERE l.module_id IN ('s03-m14','s03-m17','s03-m18','s03-m19','s03-m20')
   AND b.content->'studio'->>'release'=release_name)=55 THEN
  RETURN jsonb_build_object('published',55,'alreadyPublished',true); END IF;
 SELECT array_agg(n ORDER BY module_id) INTO counts FROM (
  SELECT module_id,count(*)::integer n FROM academy_private.practical_marketing_16_20_upgrades
  WHERE release_key=release_name GROUP BY module_id) c;
 IF counts IS DISTINCT FROM ARRAY[10,11,9,11,14] OR
   (SELECT count(*) FROM public.academy_lessons WHERE module_id IN ('s03-m14','s03-m17','s03-m18','s03-m19','s03-m20')
    AND status='published')<>55 THEN
  RAISE EXCEPTION 'Incomplete practical marketing batch'; END IF;
 PERFORM 1 FROM public.academy_lessons WHERE module_id IN ('s03-m14','s03-m17','s03-m18','s03-m19','s03-m20')
  ORDER BY id FOR UPDATE;
 FOR staged IN SELECT * FROM academy_private.practical_marketing_16_20_upgrades
  WHERE release_key=release_name ORDER BY module_id,lesson_id LOOP
  SELECT * INTO target FROM public.academy_lessons WHERE module_id=staged.module_id AND lesson_id=staged.lesson_id;
  IF NOT FOUND OR target.status<>'published' OR target.published_version_id IS DISTINCT FROM staged.expected_version_id
    OR target.draft_version_id IS DISTINCT FROM target.published_version_id THEN
   RAISE EXCEPTION 'Course changed since practical audit: %',staged.lesson_id; END IF;
  SELECT * INTO old_version FROM public.academy_lesson_versions WHERE id=target.published_version_id;
  SELECT md5(to_jsonb(target)::text||to_jsonb(old_version)::text||coalesce((
   SELECT string_agg(to_jsonb(b)::text||coalesce(to_jsonb(k)::text,''),'' ORDER BY b.position,b.id)
   FROM public.academy_lesson_blocks b LEFT JOIN academy_private.lesson_block_keys k ON k.block_id=b.id
   WHERE b.version_id=old_version.id),'')) INTO fingerprint;
  IF fingerprint IS DISTINCT FROM staged.expected_fingerprint THEN RAISE EXCEPTION 'Course content changed since staging: %',staged.lesson_id; END IF;
  item:=staged.payload->'practice'; bridge:=staged.payload->'bridge';
  IF item->>'key' IS DISTINCT FROM 'marketing_studio_final_20261015' OR item->>'type' IS DISTINCT FROM 'matching'
    OR item->'content'->'studio'->>'release' IS DISTINCT FROM release_name
    OR item->'content'->'studio'->>'domain' IS DISTINCT FROM 'marketing'
    OR item->>'required' IS DISTINCT FROM 'true' OR item->>'points' IS DISTINCT FROM '20'
    OR bridge->>'key' IS DISTINCT FROM 'marketing_worked_final_20261015' OR bridge->>'type' IS DISTINCT FROM 'example'
    OR bridge->>'required' IS DISTINCT FROM 'true' OR bridge->>'points' IS DISTINCT FROM '0'
    OR jsonb_typeof(bridge->'content') IS DISTINCT FROM 'object' OR length(bridge->'content'->>'body')<100
    OR jsonb_typeof(staged.payload->'opening') IS DISTINCT FROM 'object'
    OR jsonb_typeof(item->'evaluation'->'matches') IS DISTINCT FROM 'object'
    OR jsonb_typeof(item->'feedback'->'details') IS DISTINCT FROM 'object'
    OR (SELECT count(*) FROM jsonb_object_keys(item->'evaluation'->'matches'))<>jsonb_array_length(item->'content'->'left')
    OR (SELECT count(*) FROM jsonb_object_keys(item->'feedback'->'details'))<>jsonb_array_length(item->'content'->'left')
    OR (SELECT count(*) FROM public.academy_lesson_blocks WHERE version_id=old_version.id AND block_type='objective')<>1
    OR staged.payload->'opening'->>'body' IS DISTINCT FROM (
      SELECT content->>'body' FROM public.academy_lesson_blocks WHERE version_id=old_version.id AND block_type='objective')
    OR item->'content' ?| ARRAY['evaluation','answer_key','correct','modelAnswer'] THEN
   RAISE EXCEPTION 'Invalid practical lesson specification: %',staged.lesson_id; END IF;
  IF EXISTS(SELECT 1 FROM jsonb_array_elements(item->'content'->'left') slot
    WHERE coalesce(length(item->'feedback'->'details'->(slot->>'id')->>'success'),0)<10
      OR coalesce(length(item->'feedback'->'details'->(slot->>'id')->>'retry'),0)<10
      OR NOT (item->'feedback'->'details' ? (slot->>'id'))) THEN
   RAISE EXCEPTION 'Missing decision feedback: %',staged.lesson_id; END IF;
  IF coalesce(jsonb_array_length(staged.payload->'amendments'),0)<>0 THEN RAISE EXCEPTION 'Unexpected original-block amendment'; END IF;
  PERFORM academy_private.assert_closed_block_payload('matching',item->'content',jsonb_build_object('matches',item->'evaluation'->'matches'),false);
  SELECT coalesce(max(version_number),0)+1 INTO next_version FROM public.academy_lesson_versions WHERE academy_lesson_id=target.id;
  INSERT INTO public.academy_lesson_versions(academy_lesson_id,version_number,origin_version_id,title,subtitle,duration,
   objective,hook,estimated_minutes,source_kind,change_note)
  VALUES(target.id,next_version,old_version.id,old_version.title,old_version.subtitle,old_version.duration,
   old_version.objective,old_version.hook,old_version.estimated_minutes,'editor',old_version.change_note)
  RETURNING id INTO new_version_id;
  next_position:=0; practice_inserted:=false;
  FOR old_block IN SELECT * FROM public.academy_lesson_blocks WHERE version_id=old_version.id ORDER BY position,id LOOP
   IF NOT practice_inserted AND old_block.block_type IN ('quiz','scenario','matching','sequence_sort','image_hotspot','course_exam','summary') THEN
    INSERT INTO public.academy_lesson_blocks(version_id,block_key,position,block_type,title,content,required,points)
    VALUES(new_version_id,bridge->>'key',next_position,'example',bridge->>'title',bridge->'content',true,0);
    next_position:=next_position+10;
    INSERT INTO public.academy_lesson_blocks(version_id,block_key,position,block_type,title,content,required,points)
    VALUES(new_version_id,item->>'key',next_position,'matching',item->>'title',item->'content',true,20) RETURNING id INTO new_block_id;
    INSERT INTO academy_private.lesson_block_keys(block_id,answer_key,feedback,scoring)
    VALUES(new_block_id,item->'evaluation',item->'feedback','{}'::jsonb);
    next_position:=next_position+10; practice_inserted:=true;
   END IF;
   INSERT INTO public.academy_lesson_blocks(version_id,block_key,position,block_type,title,content,required,points)
   VALUES(new_version_id,old_block.block_key,next_position,old_block.block_type,old_block.title,
    CASE WHEN old_block.block_type='objective' THEN staged.payload->'opening'
     ELSE old_block.content END,old_block.required,old_block.points) RETURNING id INTO new_block_id;
   INSERT INTO academy_private.lesson_block_keys(block_id,answer_key,feedback,scoring)
    SELECT new_block_id,answer_key,feedback,scoring FROM academy_private.lesson_block_keys WHERE block_id=old_block.id;
   next_position:=next_position+10;
  END LOOP;
  IF NOT practice_inserted THEN RAISE EXCEPTION 'No assessment boundary: %',staged.lesson_id; END IF;
  validation_result:=academy_private.lesson_validation(new_version_id);
  IF jsonb_array_length(validation_result->'errors')<>0 THEN RAISE EXCEPTION 'Lesson validation failed: %',staged.lesson_id; END IF;
  UPDATE public.academy_lesson_versions SET validation=validation_result||jsonb_build_object('practicalEdition',release_name) WHERE id=new_version_id;
  UPDATE public.academy_lessons SET published_version_id=new_version_id,draft_version_id=new_version_id,updated_at=now() WHERE id=target.id;
  SELECT coalesce(array_agg(b.block_key ORDER BY b.position),'{}'::text[]) INTO safe_keys
  FROM public.academy_lesson_blocks b JOIN public.academy_lesson_blocks old ON old.version_id=old_version.id AND old.block_key=b.block_key
  LEFT JOIN academy_private.lesson_block_keys nk ON nk.block_id=b.id LEFT JOIN academy_private.lesson_block_keys ok ON ok.block_id=old.id
  WHERE b.version_id=new_version_id AND ROW(b.block_type,b.title,b.content,b.required,b.points) IS NOT DISTINCT FROM ROW(old.block_type,old.title,old.content,old.required,old.points)
   AND ROW(nk.answer_key,nk.feedback,nk.scoring) IS NOT DISTINCT FROM ROW(ok.answer_key,ok.feedback,ok.scoring);
  FOR prior IN SELECT * FROM public.academy_lesson_progress WHERE academy_lesson_id=target.id AND version_id=old_version.id FOR UPDATE LOOP
   SELECT coalesce(array_agg(k ORDER BY ord),'{}'::text[]) INTO kept_keys FROM unnest(prior.completed_block_keys) WITH ORDINALITY x(k,ord) WHERE k=ANY(safe_keys);
   SELECT coalesce(jsonb_object_agg(key,value),'{}'::jsonb) INTO kept_state FROM jsonb_each(prior.block_state) WHERE key=ANY(safe_keys);
   UPDATE public.academy_lesson_progress SET version_id=new_version_id,completed_block_keys=kept_keys,block_state=kept_state,
    current_block_key=(SELECT b.block_key FROM public.academy_lesson_blocks b WHERE b.version_id=new_version_id AND b.required AND NOT b.block_key=ANY(kept_keys) ORDER BY b.position LIMIT 1),
    xp=(SELECT coalesce(sum(points),0) FROM public.academy_lesson_blocks WHERE version_id=new_version_id AND block_key=ANY(kept_keys)),
    score_percent=NULL,mastery_status='learning',completed_at=NULL
   WHERE user_id=prior.user_id AND academy_lesson_id=target.id;
   carried:=carried+1;
  END LOOP;
  INSERT INTO public.academy_lesson_audit(academy_lesson_id,version_id,action,details)
   VALUES(target.id,new_version_id,'published',jsonb_build_object('release',release_name,'originVersionId',old_version.id,
    'allTeachingBlocksRetained',true,'editorialClarifications',coalesce(staged.payload->'amendments','[]'::jsonb),
    'creditPolicy','identical_public_and_private_blocks','closedLearning',true));
  upgraded:=upgraded+1;
 END LOOP;
 RETURN jsonb_build_object('published',upgraded,'progressRowsCarried',carried,'release',release_name);
END $fn$;
REVOKE ALL ON FUNCTION academy_private.publish_practical_marketing_16_20() FROM PUBLIC,anon,authenticated,service_role;
