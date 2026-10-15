-- Owner-only staging; no private grader is distributed in source control.
CREATE TABLE academy_private.practical_video_06_10_upgrades (
 release_key text NOT NULL CHECK(release_key='practical_video_06_10_20261015'),
 module_id text NOT NULL CHECK(module_id ~ '^(s02-m0[6-9]|s02-m10)$'),
 lesson_id text NOT NULL CHECK(lesson_id ~ '^(pv0[6-9]|pv10)-[0-9]{2}$'),
 expected_version_id uuid NOT NULL REFERENCES public.academy_lesson_versions(id),
 expected_fingerprint text NOT NULL CHECK(expected_fingerprint ~ '^[a-f0-9]{32}$'),
 payload jsonb NOT NULL CHECK(jsonb_typeof(payload)='object'),
 created_at timestamptz NOT NULL DEFAULT now(),
 PRIMARY KEY(release_key,lesson_id)
);
ALTER TABLE academy_private.practical_video_06_10_upgrades ENABLE ROW LEVEL SECURITY;
ALTER TABLE academy_private.practical_video_06_10_upgrades FORCE ROW LEVEL SECURITY;
REVOKE ALL ON academy_private.practical_video_06_10_upgrades FROM PUBLIC,anon,authenticated,service_role;

-- This migration installs the owner-only publisher. The reviewed payload is
-- staged separately in academy_private; no real answer key belongs in git.
CREATE OR REPLACE FUNCTION academy_private.publish_practical_video_06_10()
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path='' AS $fn$
DECLARE release_name constant text:='practical_video_06_10_20261015';
 staged record; target public.academy_lessons; old_version public.academy_lesson_versions;
 old_block public.academy_lesson_blocks; prior record; new_version_id uuid; new_block_id uuid;
 next_version integer; next_position integer; fingerprint text; item jsonb; validation_result jsonb;
 counts integer[]; safe_keys text[]; kept_keys text[]; kept_state jsonb; upgraded integer:=0; carried integer:=0;
BEGIN
 PERFORM pg_advisory_xact_lock(hashtextextended(release_name,0));
 IF (SELECT count(*) FROM public.academy_lessons l JOIN public.academy_lesson_blocks b
   ON b.version_id=l.published_version_id WHERE l.module_id ~ '^(s02-m0[6-9]|s02-m10)$'
   AND b.content->'studio'->>'release'=release_name)=77 THEN
  RETURN jsonb_build_object('published',77,'alreadyPublished',true); END IF;
 SELECT array_agg(n ORDER BY module_id) INTO counts FROM (
  SELECT module_id,count(*)::integer n FROM academy_private.practical_video_06_10_upgrades
  WHERE release_key=release_name GROUP BY module_id) c;
 IF counts IS DISTINCT FROM ARRAY[18,16,16,11,16] OR
   (SELECT count(*) FROM public.academy_lessons WHERE module_id ~ '^(s02-m0[6-9]|s02-m10)$' AND status='published')<>77 THEN
  RAISE EXCEPTION 'Incomplete practical video batch'; END IF;
 PERFORM 1 FROM public.academy_lessons WHERE module_id ~ '^(s02-m0[6-9]|s02-m10)$' ORDER BY id FOR UPDATE;
 FOR staged IN SELECT * FROM academy_private.practical_video_06_10_upgrades
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
  item:=staged.payload->'practice';
  IF item->>'key' IS DISTINCT FROM 'practical_studio_20261015' OR item->>'type' IS DISTINCT FROM 'matching'
    OR item->'content'->'studio'->>'release' IS DISTINCT FROM release_name
    OR item->>'required' IS DISTINCT FROM 'true' OR item->>'points' IS DISTINCT FROM '20'
    OR jsonb_typeof(staged.payload->'opening') IS DISTINCT FROM 'object'
    OR jsonb_typeof(item->'evaluation'->'matches') IS DISTINCT FROM 'object'
    OR (SELECT count(*) FROM jsonb_object_keys(item->'evaluation'->'matches'))<>jsonb_array_length(item->'content'->'left')
    OR (SELECT count(*) FROM public.academy_lesson_blocks WHERE version_id=old_version.id AND block_type='objective')<>1
    OR (SELECT count(*) FROM public.academy_lesson_blocks WHERE version_id=old_version.id AND block_type='summary')<>1
    OR staged.payload->'opening'->>'body' IS DISTINCT FROM (
      SELECT content->>'body' FROM public.academy_lesson_blocks WHERE version_id=old_version.id AND block_type='objective')
    OR item->'content' ?| ARRAY['evaluation','answer_key','correct','modelAnswer'] THEN
   RAISE EXCEPTION 'Invalid practical lesson specification: %',staged.lesson_id; END IF;
  PERFORM academy_private.assert_closed_block_payload('matching',item->'content',jsonb_build_object('matches',item->'evaluation'->'matches'),false);
  SELECT coalesce(max(version_number),0)+1 INTO next_version FROM public.academy_lesson_versions WHERE academy_lesson_id=target.id;
  -- Preserve the established course family marker: final exams recognize all
  -- current prerequisite lessons through it. This edition has its own audit id.
  INSERT INTO public.academy_lesson_versions(academy_lesson_id,version_number,origin_version_id,title,subtitle,duration,
   objective,hook,estimated_minutes,source_kind,change_note)
  VALUES(target.id,next_version,old_version.id,old_version.title,old_version.subtitle,old_version.duration,
   old_version.objective,old_version.hook,old_version.estimated_minutes,'editor',old_version.change_note)
  RETURNING id INTO new_version_id;
  next_position:=0;
  FOR old_block IN SELECT * FROM public.academy_lesson_blocks WHERE version_id=old_version.id ORDER BY position,id LOOP
   IF old_block.block_type='summary' THEN
    INSERT INTO public.academy_lesson_blocks(version_id,block_key,position,block_type,title,content,required,points)
    VALUES(new_version_id,item->>'key',next_position,'matching',item->>'title',item->'content',true,20) RETURNING id INTO new_block_id;
    INSERT INTO academy_private.lesson_block_keys(block_id,answer_key,feedback,scoring)
    VALUES(new_block_id,item->'evaluation',coalesce(item->'feedback','{}'::jsonb),'{}'::jsonb);
    next_position:=next_position+10;
   END IF;
   INSERT INTO public.academy_lesson_blocks(version_id,block_key,position,block_type,title,content,required,points)
   VALUES(new_version_id,old_block.block_key,next_position,old_block.block_type,old_block.title,
    CASE WHEN old_block.block_type='objective' THEN staged.payload->'opening' ELSE old_block.content END,
    old_block.required,old_block.points) RETURNING id INTO new_block_id;
   INSERT INTO academy_private.lesson_block_keys(block_id,answer_key,feedback,scoring)
    SELECT new_block_id,answer_key,feedback,scoring FROM academy_private.lesson_block_keys WHERE block_id=old_block.id;
   next_position:=next_position+10;
  END LOOP;
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
    'allTeachingBlocksPreserved',true,'creditPolicy','identical_public_and_private_blocks','closedLearning',true));
  upgraded:=upgraded+1;
 END LOOP;
 RETURN jsonb_build_object('published',upgraded,'progressRowsCarried',carried,'release',release_name);
END $fn$;
REVOKE ALL ON FUNCTION academy_private.publish_practical_video_06_10() FROM PUBLIC,anon,authenticated,service_role;
