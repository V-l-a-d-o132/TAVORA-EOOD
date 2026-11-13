-- Owner-only release transport. Bind the protected editorial package in place of the token.
-- Staging clones versioned blocks and copies the existing server-side grading by stable block key.
DO $review$
DECLARE
  batch jsonb := convert_from(decode('__EDITORIAL_PACKAGE__','base64'),'UTF8')::jsonb;
  item jsonb; edit jsonb; operation jsonb; fragment jsonb; path text[]; value jsonb;
  source public.academy_lesson_versions%rowtype; lesson public.academy_lessons%rowtype;
  original public.academy_lesson_blocks%rowtype; private_key academy_private.lesson_block_keys%rowtype;
  candidate uuid; new_block uuid; revised jsonb; replacement text; check_result jsonb; fingerprint text;
  candidate_fingerprint text; attempt jsonb; previous_options jsonb; next_options jsonb;
  edition constant text := 'video_editorial_20261112';
BEGIN
  FOR item IN SELECT value_ FROM jsonb_array_elements(batch) AS entries(value_) ORDER BY value_->>'id' LOOP
    IF item->>'id' !~ '^pv(0[1-9]|1[0-5])-[0-9]{2}$' THEN RAISE EXCEPTION 'Unexpected lesson'; END IF;
    SELECT * INTO STRICT lesson FROM public.academy_lessons
      WHERE lesson_id=item->>'id' AND module_id='s02-m'||substr(item->>'id',3,2) FOR UPDATE;
    IF lesson.status <> 'published' OR lesson.published_version_id IS DISTINCT FROM lesson.draft_version_id THEN RAISE EXCEPTION 'Lesson pointers changed: %',lesson.lesson_id; END IF;
    SELECT * INTO STRICT source FROM public.academy_lesson_versions WHERE id=(item->>'v')::uuid FOR SHARE;
    SELECT v.id INTO candidate FROM public.academy_lesson_versions v
      WHERE v.academy_lesson_id=lesson.id AND v.origin_version_id=source.id
        AND v.validation->>'videoEditorialEdition'=edition AND v.validation->>'videoEditorialDigest'=item->>'digest';
    IF candidate IS NOT NULL AND lesson.published_version_id IN (source.id,candidate) THEN CONTINUE; END IF;
    IF source.id IS DISTINCT FROM lesson.published_version_id OR source.change_note IS DISTINCT FROM 'perfect_video_story_first_20261010' THEN RAISE EXCEPTION 'Changed source: %',lesson.lesson_id; END IF;
    PERFORM 1 FROM public.academy_lesson_blocks WHERE version_id=source.id ORDER BY id FOR SHARE;
    PERFORM 1 FROM academy_private.lesson_block_keys k JOIN public.academy_lesson_blocks b ON b.id=k.block_id WHERE b.version_id=source.id ORDER BY k.block_id FOR SHARE OF k;
    SELECT md5(to_jsonb(source)::text||coalesce(string_agg(to_jsonb(b)::text||coalesce(to_jsonb(k)::text,''),'' ORDER BY b.position,b.id),'')) INTO fingerprint
      FROM public.academy_lesson_blocks b LEFT JOIN academy_private.lesson_block_keys k ON k.block_id=b.id WHERE b.version_id=source.id;
    IF fingerprint IS DISTINCT FROM item->>'fp' THEN RAISE EXCEPTION 'Source fingerprint changed: %',lesson.lesson_id; END IF;
    IF EXISTS(SELECT 1 FROM jsonb_object_keys(item->'blocks') AS ks(key) WHERE NOT EXISTS(SELECT 1 FROM public.academy_lesson_blocks b WHERE b.version_id=source.id AND b.block_key=ks.key)) THEN RAISE EXCEPTION 'Unknown block key'; END IF;
    INSERT INTO public.academy_lesson_versions(academy_lesson_id,version_number,origin_version_id,title,subtitle,duration,objective,hook,estimated_minutes,source_kind,change_note)
      SELECT lesson.id,max(version_number)+1,source.id,coalesce(item->'fields'->>'title',source.title),coalesce(item->'fields'->>'subtitle',source.subtitle),
        source.duration,coalesce(item->'fields'->>'objective',source.objective),coalesce(item->'fields'->>'hook',source.hook),source.estimated_minutes,'editor',source.change_note
      FROM public.academy_lesson_versions WHERE academy_lesson_id=lesson.id RETURNING id INTO candidate;
    FOR original IN SELECT * FROM public.academy_lesson_blocks WHERE version_id=source.id ORDER BY position LOOP
      edit:=item->'blocks'->original.block_key;
      revised:=original.content;
      FOR operation IN SELECT value_ FROM jsonb_array_elements(coalesce(edit->'set','[]'::jsonb)) AS ops(value_) LOOP
        path:=ARRAY(SELECT jsonb_array_elements_text(operation->0));
        value:=operation->1;
        IF jsonb_typeof(value)='object' AND value ? 'edits' THEN
          replacement:=revised#>>path;
          IF md5(replacement) IS DISTINCT FROM value->>'was' THEN RAISE EXCEPTION 'Source text changed: % %',lesson.lesson_id,original.block_key; END IF;
          FOR fragment IN SELECT value_ FROM jsonb_array_elements(value->'edits') AS fragments(value_) LOOP
            replacement:=overlay(replacement PLACING fragment->>2 FROM (fragment->>0)::integer+1 FOR (fragment->>1)::integer);
          END LOOP;
          value:=to_jsonb(replacement);
        END IF;
        revised:=jsonb_set(revised,path,value,true);
      END LOOP;
      IF revised::text ~ '"(evaluation|answer_key|answerKey|answers|correct|correctAnswer|modelAnswer|feedback)"[[:space:]]*:' THEN RAISE EXCEPTION 'Private fields in learner content'; END IF;
      IF original.block_type IN ('scenario','quiz','course_exam') THEN
        -- All option/question identifiers, their order and groupings must remain stable.
        SELECT jsonb_path_query_array(original.content,'$.**.id'),jsonb_path_query_array(revised,'$.**.id') INTO previous_options,next_options;
        IF previous_options IS DISTINCT FROM next_options THEN RAISE EXCEPTION 'Assessment identifiers changed'; END IF;
      END IF;
      INSERT INTO public.academy_lesson_blocks(version_id,block_key,position,block_type,title,content,required,points)
        VALUES(candidate,original.block_key,original.position,original.block_type,coalesce(edit->>'title',original.title),revised,original.required,original.points) RETURNING id INTO new_block;
      SELECT * INTO private_key FROM academy_private.lesson_block_keys WHERE block_id=original.id;
      IF FOUND THEN
        IF original.block_type IN ('quiz','scenario','matching','sequence_sort') THEN
          attempt:=CASE original.block_type WHEN 'quiz' THEN jsonb_build_object('answer',private_key.answer_key->'correct')
            WHEN 'scenario' THEN jsonb_build_object('selected',private_key.answer_key->'correct') ELSE private_key.answer_key END;
          PERFORM academy_private.assert_closed_block_payload(original.block_type,revised,attempt,false);
        END IF;
        INSERT INTO academy_private.lesson_block_keys(block_id,answer_key,feedback,scoring)
          VALUES(new_block,private_key.answer_key,coalesce(edit->'response',private_key.feedback),private_key.scoring);
      ELSIF edit ? 'response' THEN RAISE EXCEPTION 'Unexpected assessment feedback'; END IF;
    END LOOP;
    check_result:=academy_private.lesson_validation(candidate);
    IF jsonb_array_length(check_result->'errors') IS DISTINCT FROM 0 THEN RAISE EXCEPTION 'Invalid lesson %: %',lesson.lesson_id,check_result->'errors'; END IF;
    SELECT md5(string_agg(to_jsonb(b)::text||coalesce(to_jsonb(k)::text,''),'' ORDER BY b.position,b.id)) INTO candidate_fingerprint
      FROM public.academy_lesson_blocks b LEFT JOIN academy_private.lesson_block_keys k ON k.block_id=b.id WHERE b.version_id=candidate;
    UPDATE public.academy_lesson_versions SET validation=source.validation||check_result||jsonb_build_object('videoEditorialEdition',edition,'videoEditorialDigest',item->>'digest','videoEditorialBlocks',candidate_fingerprint) WHERE id=candidate;
  END LOOP;
END $review$;
