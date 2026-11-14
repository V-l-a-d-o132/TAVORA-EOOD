-- Owner-only, versioned preparation. Bind an editorial batch as JSON. No lesson or progress pointers are written.
DO $stage$
DECLARE
  batch jsonb := $material$__PILOT_BATCH__$material$::jsonb;
  edition constant text := 'video_concise_m01_20261114';
  base_edition constant text := 'video_editorial_20261112';
  item jsonb; patch jsonb; op jsonb; path text[]; revised jsonb; candidate uuid; new_block uuid;
  lesson public.academy_lessons%rowtype; base public.academy_lesson_versions%rowtype;
  original public.academy_lesson_blocks%rowtype; validation_result jsonb;
  fingerprint text; actual_content text; candidate_fingerprint text; source_fp text;
BEGIN
  IF jsonb_array_length(batch) NOT BETWEEN 1 AND 24 OR
    (SELECT count(DISTINCT x->>'lesson') FROM jsonb_array_elements(batch) x) <> jsonb_array_length(batch)
    THEN RAISE EXCEPTION 'Invalid pilot batch'; END IF;
  PERFORM pg_advisory_xact_lock(hashtextextended(edition,0));
  FOR item IN SELECT value FROM jsonb_array_elements(batch) ORDER BY value->>'lesson' LOOP
    IF item->>'lesson' !~ '^pv01-(0[1-9]|1[0-9]|2[0-4])$' OR item->>'digest' !~ '^[a-f0-9]{64}$'
      OR item->>'expectedContent' !~ '^[a-f0-9]{32}$' THEN RAISE EXCEPTION 'Unexpected pilot lesson'; END IF;
    SELECT * INTO STRICT lesson FROM public.academy_lessons
      WHERE module_id='s02-m01' AND lesson_id=item->>'lesson' AND status='published' FOR UPDATE;
    SELECT * INTO STRICT base FROM public.academy_lesson_versions WHERE academy_lesson_id=lesson.id
      AND validation->>'videoEditorialEdition'=base_edition AND validation->>'videoEditorialDigest'=item->>'sourceDigest' FOR SHARE;
    SELECT v.id INTO candidate FROM public.academy_lesson_versions v WHERE v.academy_lesson_id=lesson.id
      AND v.origin_version_id=base.id AND v.validation->>'videoEditorialEdition'=edition AND v.validation->>'videoEditorialDigest'=item->>'digest';
    IF lesson.published_version_id IS DISTINCT FROM lesson.draft_version_id OR
       (lesson.published_version_id IS DISTINCT FROM base.origin_version_id AND lesson.published_version_id IS DISTINCT FROM base.id
        AND lesson.published_version_id IS DISTINCT FROM candidate) THEN RAISE EXCEPTION 'Concurrent lesson edit: %',lesson.lesson_id; END IF;
    PERFORM 1 FROM public.academy_lesson_blocks WHERE version_id=base.id ORDER BY position FOR SHARE;
    PERFORM 1 FROM academy_private.lesson_block_keys k JOIN public.academy_lesson_blocks b ON b.id=k.block_id
      WHERE b.version_id=base.id ORDER BY b.position FOR SHARE OF k;
    SELECT md5(string_agg(to_jsonb(b)::text || coalesce(to_jsonb(k)::text,''),'' ORDER BY b.position,b.id)),
      md5(jsonb_build_array(base.title,base.subtitle,base.objective,base.hook,jsonb_agg(jsonb_build_array(
        b.block_key,b.block_type,b.title,b.content,b.required,b.points,
        CASE WHEN b.block_type IN ('quiz','scenario','course_exam') THEN k.answer_key END,
        CASE WHEN b.block_type IN ('quiz','scenario','course_exam') THEN k.feedback END) ORDER BY b.position))::text)
      INTO source_fp,actual_content FROM public.academy_lesson_blocks b LEFT JOIN academy_private.lesson_block_keys k ON k.block_id=b.id WHERE b.version_id=base.id;
    IF source_fp IS DISTINCT FROM base.validation->>'videoEditorialBlocks' OR actual_content IS DISTINCT FROM item->>'sourceContent'
      THEN RAISE EXCEPTION 'Editorial base changed: %',lesson.lesson_id; END IF;
    IF candidate IS NULL THEN
      IF EXISTS(SELECT 1 FROM jsonb_object_keys(item->'blocks') ks(key)
        WHERE NOT EXISTS(SELECT 1 FROM public.academy_lesson_blocks b WHERE b.version_id=base.id AND b.block_key=ks.key))
        THEN RAISE EXCEPTION 'Unknown block key: %',lesson.lesson_id; END IF;
      INSERT INTO public.academy_lesson_versions(academy_lesson_id,version_number,origin_version_id,title,subtitle,duration,objective,hook,estimated_minutes,source_kind,change_note)
        SELECT lesson.id,max(version_number)+1,base.id,base.title,base.subtitle,base.duration,item->>'objective',base.hook,base.estimated_minutes,'editor','Модул 1 · кратка редакция за преглед · 14.11.2026'
        FROM public.academy_lesson_versions WHERE academy_lesson_id=lesson.id RETURNING id INTO candidate;
      FOR original IN SELECT * FROM public.academy_lesson_blocks WHERE version_id=base.id ORDER BY position LOOP
        patch:=item->'blocks'->original.block_key; revised:=original.content;
        FOR op IN SELECT value FROM jsonb_array_elements(coalesce(patch->'ops','[]'::jsonb)) LOOP
          path:=ARRAY(SELECT jsonb_array_elements_text(op->'at'));
          IF cardinality(path)=0 OR path && ARRAY['correct','answerKey','evaluation','scoring','feedback','answers'] THEN RAISE EXCEPTION 'Invalid change path'; END IF;
          IF op ? 'value' THEN revised:=jsonb_set(revised,path,op->'value',true); ELSE revised:=revised #- path; END IF;
        END LOOP;
        IF original.block_type IN ('quiz','scenario','course_exam') AND revised IS DISTINCT FROM original.content THEN RAISE EXCEPTION 'Assessment changed'; END IF;
        IF original.block_type='sequence_sort' AND revised->'items' IS DISTINCT FROM original.content->'items' THEN RAISE EXCEPTION 'Ordering changed'; END IF;
        IF original.block_type='matching' AND (revised->'left' IS DISTINCT FROM original.content->'left' OR
          (SELECT jsonb_agg(o - 'preview' ORDER BY n) FROM jsonb_array_elements(revised->'right') WITH ORDINALITY e(o,n)) IS DISTINCT FROM
          (SELECT jsonb_agg(o - 'preview' ORDER BY n) FROM jsonb_array_elements(original.content->'right') WITH ORDINALITY e(o,n)))
          THEN RAISE EXCEPTION 'Matching fields or options changed'; END IF;
        INSERT INTO public.academy_lesson_blocks(version_id,block_key,position,block_type,title,content,required,points)
          VALUES(candidate,original.block_key,original.position,original.block_type,coalesce(patch->>'title',original.title),revised,
            coalesce((patch->>'required')::boolean,original.required),original.points) RETURNING id INTO new_block;
        INSERT INTO academy_private.lesson_block_keys(block_id,answer_key,feedback,scoring)
          SELECT new_block,answer_key,feedback,scoring FROM academy_private.lesson_block_keys WHERE block_id=original.id;
      END LOOP;
    END IF;
    SELECT md5(string_agg(to_jsonb(b)::text || coalesce(to_jsonb(k)::text,''),'' ORDER BY b.position,b.id)),
      md5(jsonb_build_array(v.title,v.subtitle,v.objective,v.hook,jsonb_agg(jsonb_build_array(
        b.block_key,b.block_type,b.title,b.content,b.required,b.points,
        CASE WHEN b.block_type IN ('quiz','scenario','course_exam') THEN k.answer_key END,
        CASE WHEN b.block_type IN ('quiz','scenario','course_exam') THEN k.feedback END) ORDER BY b.position))::text)
      INTO candidate_fingerprint,actual_content FROM public.academy_lesson_versions v JOIN public.academy_lesson_blocks b ON b.version_id=v.id
      LEFT JOIN academy_private.lesson_block_keys k ON k.block_id=b.id WHERE v.id=candidate GROUP BY v.id;
    IF actual_content IS DISTINCT FROM item->>'expectedContent' THEN RAISE EXCEPTION 'Pilot content mismatch: %',lesson.lesson_id; END IF;
    validation_result:=academy_private.lesson_validation(candidate);
    IF jsonb_array_length(validation_result->'errors') IS DISTINCT FROM 0 THEN RAISE EXCEPTION 'Invalid candidate %: %',lesson.lesson_id,validation_result->'errors'; END IF;
    SELECT validation->>'videoEditorialBlocks' INTO fingerprint FROM public.academy_lesson_versions WHERE id=candidate;
    IF fingerprint IS NOT NULL THEN
      IF fingerprint IS DISTINCT FROM candidate_fingerprint THEN RAISE EXCEPTION 'Existing candidate changed: %',lesson.lesson_id; END IF;
    ELSE
      UPDATE public.academy_lesson_versions SET validation=validation_result || jsonb_build_object(
        'videoEditorialEdition',edition,'videoEditorialDigest',item->>'digest','videoEditorialBlocks',candidate_fingerprint,
        'baseEdition',base_edition,'reviewedContent',actual_content) WHERE id=candidate;
    END IF;
  END LOOP;
END $stage$;
