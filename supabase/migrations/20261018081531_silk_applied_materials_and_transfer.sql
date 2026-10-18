-- Owner-staged teaching materials and independent module checks.
-- No production answer values are distributed with the application.
CREATE TABLE academy_private.silk_applied_upgrades (
 release_key text NOT NULL CHECK(release_key='silk_applied_20261018'),
 module_id text NOT NULL CHECK(module_id ~ '^s01-m(0[1-9]|1[01])$'),
 lesson_id text NOT NULL CHECK(lesson_id ~ '^l(0[1-9]|1[01])-[0-9]{2}$'),
 CHECK(module_id='s01-m'||substring(lesson_id FROM 2 FOR 2)),
 expected_version_id uuid NOT NULL REFERENCES public.academy_lesson_versions(id),
 expected_fingerprint text NOT NULL CHECK(expected_fingerprint ~ '^[a-f0-9]{32}$'),
 payload jsonb NOT NULL CHECK(jsonb_typeof(payload)='object'),
 created_at timestamptz NOT NULL DEFAULT now(),
 PRIMARY KEY(release_key,lesson_id)
);
ALTER TABLE academy_private.silk_applied_upgrades ENABLE ROW LEVEL SECURITY;
ALTER TABLE academy_private.silk_applied_upgrades FORCE ROW LEVEL SECURITY;
REVOKE ALL ON academy_private.silk_applied_upgrades FROM PUBLIC,anon,authenticated,service_role;

DO $extend_checked_graders$
DECLARE item record; definition text;
BEGIN
 FOR item IN SELECT * FROM (VALUES
  ('academy_private.complete_lesson_block(text,text,uuid,text,jsonb,uuid)',
   '0c4f5fee5894129da27cb1725df499c7',
   'b.content->''studio''->>''release''=''practical_silk_20261016''',
   'b.content->''studio''->>''release'' IN (''practical_silk_20261016'',''silk_applied_20261018'')'),
  ('academy_private.silk_practice_feedback(uuid,jsonb,boolean)',
   '7daac86eb005a47490afb4150ea41508',
   'b.content->''studio''->>''release'' IS DISTINCT FROM ''practical_silk_20261016''',
   'coalesce(b.content->''studio''->>''release'','''') NOT IN (''practical_silk_20261016'',''silk_applied_20261018'')'),
  ('academy_private.submit_silk_road_exam(text,text,uuid,text,jsonb,uuid)',
   '139a8980485ff76f6f5eae4c04adfbfd',
   'b.block_key IN (''silk_studio_20261016'',''silk_worked_20261016'')',
   'b.block_key IN (''silk_studio_20261016'',''silk_worked_20261016'',''silk_transfer_20261018'')')
 ) changes(signature,expected_hash,anchor,replacement) LOOP
  SELECT pg_get_functiondef(item.signature::regprocedure) INTO definition;
  IF strpos(definition,item.replacement)>0 THEN CONTINUE; END IF;
  IF (SELECT md5(prosrc) FROM pg_proc WHERE oid=item.signature::regprocedure)<>item.expected_hash
    OR length(definition)-length(replace(definition,item.anchor,''))<>length(item.anchor) THEN
   RAISE EXCEPTION 'Grader changed since applied-course review: %',item.signature;
  END IF;
  EXECUTE replace(definition,item.anchor,item.replacement);
 END LOOP;
END $extend_checked_graders$;

CREATE FUNCTION academy_private.publish_silk_applied()
RETURNS jsonb LANGUAGE plpgsql SET search_path='' AS $publish$
DECLARE release_name constant text:='silk_applied_20261018';
 staged record; target public.academy_lessons; old_version public.academy_lesson_versions;
 old_block public.academy_lesson_blocks; prior record; amendment jsonb; item jsonb;
 next_version_id uuid; next_block_id uuid; next_number integer; next_position integer;
 fingerprint text; validation_result jsonb; counts integer[]; safe_keys text[];
 kept_keys text[]; kept_state jsonb; fully_carried boolean; checkpoint_inserted boolean;
 published integer:=0; carried integer:=0; added integer:=0;
BEGIN
 PERFORM pg_advisory_xact_lock(hashtextextended(release_name,0));
 IF (SELECT count(*) FROM public.academy_lessons l JOIN public.academy_lesson_versions v ON v.id=l.published_version_id
     WHERE l.module_id ~ '^s01-m(0[1-9]|1[01])$' AND v.validation->>'appliedEdition'=release_name)=74 THEN
  RETURN jsonb_build_object('published',74,'alreadyPublished',true); END IF;
 SELECT array_agg(n ORDER BY module_id) INTO counts FROM (
  SELECT module_id,count(*)::integer n FROM academy_private.silk_applied_upgrades
  WHERE release_key=release_name GROUP BY module_id) c;
 IF counts IS DISTINCT FROM ARRAY[4,10,10,10,10,10,4,4,4,4,4]
    OR (SELECT count(*) FROM public.academy_lessons WHERE module_id ~ '^s01-m(0[1-9]|1[01])$' AND status='published')<>74 THEN
  RAISE EXCEPTION 'Incomplete applied Silk Road batch'; END IF;
 IF (SELECT count(*) FROM academy_private.silk_applied_upgrades s CROSS JOIN LATERAL jsonb_array_elements(s.payload->'additions') a
     WHERE a->>'key'='silk_transfer_20261018')<>11
   OR EXISTS(SELECT 1 FROM academy_private.silk_applied_upgrades s
    WHERE (EXISTS(SELECT 1 FROM jsonb_array_elements(s.payload->'additions') a WHERE a->>'key'='silk_transfer_20261018'))
     IS DISTINCT FROM (s.lesson_id=(SELECT max(l.lesson_id) FROM public.academy_lessons l WHERE l.module_id=s.module_id))) THEN
  RAISE EXCEPTION 'Expected one transfer case at the end of each module'; END IF;
 PERFORM 1 FROM public.academy_lessons WHERE module_id ~ '^s01-m(0[1-9]|1[01])$' ORDER BY id FOR UPDATE;
 FOR staged IN SELECT * FROM academy_private.silk_applied_upgrades WHERE release_key=release_name ORDER BY module_id,lesson_id FOR SHARE LOOP
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
     OR jsonb_typeof(staged.payload->'additions') IS DISTINCT FROM 'array' THEN RAISE EXCEPTION 'Invalid applied payload'; END IF;
  IF EXISTS(SELECT 1 FROM jsonb_array_elements(staged.payload->'amendments') a
    LEFT JOIN public.academy_lesson_blocks b ON b.version_id=old_version.id AND b.block_key=a->>'key'
    WHERE b.id IS NULL OR (b.block_type<>'objective' AND b.block_key<>'silk_studio_20261016')
      OR jsonb_typeof(a->'content') IS DISTINCT FROM 'object')
    OR (SELECT count(*) FROM jsonb_array_elements(staged.payload->'amendments'))<>
       (SELECT count(DISTINCT a->>'key') FROM jsonb_array_elements(staged.payload->'amendments') a) THEN
   RAISE EXCEPTION 'Unexpected amendment: %',staged.lesson_id; END IF;
  FOR item IN SELECT value FROM jsonb_array_elements(staged.payload->'additions') LOOP
   IF item->>'key' NOT IN ('silk_materials_20261018','silk_transfer_20261018')
     OR item->>'required' IS DISTINCT FROM 'true' OR length(coalesce(item->>'title',''))<10
     OR jsonb_typeof(item->'content') IS DISTINCT FROM 'object'
     OR (item->'content')::text ~ '"(evaluation|answer_key|answerKey|answers|correct|modelAnswer|feedback)"[[:space:]]*:' THEN
    RAISE EXCEPTION 'Invalid public addition: %',staged.lesson_id; END IF;
   IF item->>'key'='silk_materials_20261018' THEN
    IF item->>'type' IS DISTINCT FROM 'rich_text' OR item->>'points' IS DISTINCT FROM '0'
      OR length(coalesce(item->'content'->>'body',''))<100
      OR item->'content'->>'materialsFallback' IS DISTINCT FROM 'true'
      OR jsonb_typeof(item->'content'->'materials'->'items') IS DISTINCT FROM 'array'
      OR item->>'insertBefore' IS DISTINCT FROM 'silk_worked_20261016' THEN RAISE EXCEPTION 'Missing material fallback'; END IF;
   ELSE
    IF item->>'type' IS DISTINCT FROM 'matching' OR item->>'points' IS DISTINCT FROM '20'
      OR item->'content'->'studio'->>'domain' IS DISTINCT FROM 'silk-road'
      OR item->'content'->'studio'->>'release' IS DISTINCT FROM release_name
      OR jsonb_array_length(item->'content'->'left') NOT BETWEEN 3 AND 6
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
     WHERE (a->>'key'='silk_materials_20261018' AND a->>'insertBefore'=old_block.block_key)
       OR (a->>'key'='silk_transfer_20261018' AND NOT checkpoint_inserted AND old_block.block_type IN ('course_exam','summary')) LOOP
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
    VALUES(next_version_id,old_block.block_key,next_position,old_block.block_type,old_block.title,coalesce(amendment->'content',old_block.content),old_block.required,old_block.points)
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
  UPDATE public.academy_lesson_versions SET validation=validation_result||jsonb_build_object('appliedEdition',release_name) WHERE id=next_version_id;
  UPDATE public.academy_lessons SET published_version_id=next_version_id,draft_version_id=next_version_id,updated_at=now() WHERE id=target.id;
  -- Editorial labels and objective instructions do not invalidate an identical
  -- taught body/outcomes. Changed graded options always require a fresh pass.
  SELECT coalesce(array_agg(b.block_key ORDER BY b.position),'{}'::text[]) INTO safe_keys
   FROM public.academy_lesson_blocks b JOIN public.academy_lesson_blocks old ON old.version_id=old_version.id AND old.block_key=b.block_key
   LEFT JOIN academy_private.lesson_block_keys nk ON nk.block_id=b.id LEFT JOIN academy_private.lesson_block_keys ok ON ok.block_id=old.id
   WHERE b.version_id=next_version_id AND ROW(b.block_type,b.required,b.points) IS NOT DISTINCT FROM ROW(old.block_type,old.required,old.points)
    AND (b.content IS NOT DISTINCT FROM old.content OR (b.block_type='objective' AND
      ROW(b.content->'body',b.content->'outcomes') IS NOT DISTINCT FROM ROW(old.content->'body',old.content->'outcomes')))
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
    'originalBlockKeysRetained',true,'closedLearning',true,'creditPolicy','identical_graded_work_and_editorial_objective_body_outcomes'));
  published:=published+1;
 END LOOP;
 RETURN jsonb_build_object('published',published,'addedBlocks',added,'progressRowsCarried',carried,'release',release_name);
END $publish$;
REVOKE ALL ON FUNCTION academy_private.publish_silk_applied() FROM PUBLIC,anon,authenticated,service_role;
