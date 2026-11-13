-- Run as the database owner with the encoded manifest. All 240 pointers move together.
DO $review$
DECLARE
  manifest jsonb := convert_from(decode('__EDITORIAL_PACKAGE__','base64'),'UTF8')::jsonb;
  item jsonb; lesson public.academy_lessons%rowtype; parent public.academy_lesson_versions%rowtype; candidate public.academy_lesson_versions%rowtype;
  fingerprint text; changed_questions text[]; present integer; edition constant text := 'video_editorial_20261112';
BEGIN
  PERFORM pg_advisory_xact_lock(hashtextextended(edition,0));
  IF jsonb_array_length(manifest)<>240 OR (SELECT count(DISTINCT m->>'id') FROM jsonb_array_elements(manifest) m)<>240 THEN RAISE EXCEPTION 'Incomplete manifest'; END IF;
  PERFORM 1 FROM public.academy_lessons WHERE module_id LIKE 's02-%' AND status='published' ORDER BY id FOR UPDATE;
  SELECT count(*) INTO present FROM public.academy_lessons WHERE module_id LIKE 's02-%' AND status='published';
  IF present<>240 THEN RAISE EXCEPTION 'Course inventory changed'; END IF;
  FOR item IN SELECT value FROM jsonb_array_elements(manifest) ORDER BY value->>'id' LOOP
    SELECT * INTO STRICT lesson FROM public.academy_lessons WHERE module_id='s02-m'||substr(item->>'id',3,2) AND lesson_id=item->>'id' AND status='published';
    SELECT * INTO STRICT parent FROM public.academy_lesson_versions WHERE id=(item->>'v')::uuid AND academy_lesson_id=lesson.id FOR SHARE;
    SELECT * INTO STRICT candidate FROM public.academy_lesson_versions WHERE academy_lesson_id=lesson.id AND origin_version_id=parent.id
      AND validation->>'videoEditorialEdition'=edition AND validation->>'videoEditorialDigest'=item->>'digest' FOR SHARE;
    IF lesson.published_version_id IS DISTINCT FROM lesson.draft_version_id OR lesson.published_version_id NOT IN (parent.id,candidate.id) THEN RAISE EXCEPTION 'Concurrent editorial change: %',lesson.lesson_id; END IF;
    PERFORM 1 FROM public.academy_lesson_blocks WHERE version_id IN (parent.id,candidate.id) ORDER BY id FOR SHARE;
    PERFORM 1 FROM academy_private.lesson_block_keys k JOIN public.academy_lesson_blocks b ON b.id=k.block_id WHERE b.version_id IN (parent.id,candidate.id) ORDER BY k.block_id FOR SHARE OF k;
    SELECT md5(string_agg(to_jsonb(b)::text||coalesce(to_jsonb(k)::text,''),'' ORDER BY b.position,b.id)) INTO fingerprint
      FROM public.academy_lesson_blocks b LEFT JOIN academy_private.lesson_block_keys k ON k.block_id=b.id WHERE b.version_id=candidate.id;
    IF fingerprint IS DISTINCT FROM candidate.validation->>'videoEditorialBlocks' OR jsonb_array_length(candidate.validation->'errors') IS DISTINCT FROM 0 THEN RAISE EXCEPTION 'Staged blocks changed: %',lesson.lesson_id; END IF;
    IF lesson.published_version_id=candidate.id THEN CONTINUE; END IF;
    SELECT md5(to_jsonb(parent)::text||coalesce(string_agg(to_jsonb(b)::text||coalesce(to_jsonb(k)::text,''),'' ORDER BY b.position,b.id),'')) INTO fingerprint
      FROM public.academy_lesson_blocks b LEFT JOIN academy_private.lesson_block_keys k ON k.block_id=b.id WHERE b.version_id=parent.id;
    IF fingerprint IS DISTINCT FROM item->>'fp' THEN RAISE EXCEPTION 'Original lesson changed: %',lesson.lesson_id; END IF;
    -- Detect substantive question or option edits, ignoring only the removed generic prompt prefix.
    SELECT coalesce(array_agg(b.block_key),'{}'::text[]) INTO changed_questions FROM public.academy_lesson_blocks b
      JOIN public.academy_lesson_blocks old ON old.version_id=parent.id AND old.block_key=b.block_key
      WHERE b.version_id=candidate.id AND b.block_type IN ('quiz','scenario','course_exam')
        AND (b.content->'options' IS DISTINCT FROM old.content->'options' OR b.content->'questions' IS DISTINCT FROM old.content->'questions' OR b.content->'question' IS DISTINCT FROM old.content->'question');
    -- Preserve earned blocks, XP, completion and submission history. Clear unsent answers to rewritten items.
    UPDATE public.academy_lesson_progress p SET version_id=candidate.id,block_state=p.block_state-ARRAY(
       SELECT u FROM unnest(changed_questions) u WHERE NOT u=ANY(p.completed_block_keys))
      WHERE p.academy_lesson_id=lesson.id AND p.version_id=parent.id;
    UPDATE public.academy_lessons SET published_version_id=candidate.id,draft_version_id=candidate.id,updated_at=now() WHERE id=lesson.id;
    INSERT INTO public.academy_lesson_audit(academy_lesson_id,version_id,action,details)
      VALUES(lesson.id,candidate.id,'published',jsonb_build_object('release',edition,'digest',item->>'digest','originVersionId',parent.id,'creditPolicy','retain_earned_and_historical_attempts'));
  END LOOP;
END $review$;
