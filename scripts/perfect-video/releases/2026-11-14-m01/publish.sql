-- Separate owner operation, only after the pilot is approved. Bind the 24 lessons from manifest.json.
-- Accepts either the reviewed 12 November version or its still-live predecessor.
DO $publish$
DECLARE
  manifest jsonb := $material$__PILOT_MANIFEST__$material$::jsonb;
  edition constant text := 'video_concise_m01_20261114';
  rec jsonb; lesson public.academy_lessons%rowtype; candidate public.academy_lesson_versions%rowtype;
  base public.academy_lesson_versions%rowtype; live public.academy_lesson_versions%rowtype;
  fingerprint text; live_content text; changed text[];
BEGIN
  IF jsonb_array_length(manifest)<>24 OR EXISTS(SELECT 'pv01-'||lpad(i::text,2,'0') FROM generate_series(1,24) i
    EXCEPT SELECT m->>'lesson' FROM jsonb_array_elements(manifest) m) THEN RAISE EXCEPTION 'Incomplete module 1 pilot'; END IF;
  PERFORM pg_advisory_xact_lock(hashtextextended(edition,0));
  PERFORM 1 FROM public.academy_lessons WHERE module_id='s02-m01' ORDER BY id FOR UPDATE;
  FOR rec IN SELECT value FROM jsonb_array_elements(manifest) ORDER BY value->>'lesson' LOOP
    SELECT * INTO STRICT lesson FROM public.academy_lessons WHERE module_id='s02-m01' AND lesson_id=rec->>'lesson' AND status='published';
    SELECT * INTO STRICT base FROM public.academy_lesson_versions WHERE academy_lesson_id=lesson.id
      AND validation->>'videoEditorialEdition'='video_editorial_20261112' AND validation->>'videoEditorialDigest'=rec->>'sourceDigest' FOR SHARE;
    SELECT * INTO STRICT candidate FROM public.academy_lesson_versions WHERE academy_lesson_id=lesson.id AND origin_version_id=base.id
      AND validation->>'videoEditorialEdition'=edition AND validation->>'videoEditorialDigest'=rec->>'digest' FOR SHARE;
    IF lesson.published_version_id IS DISTINCT FROM lesson.draft_version_id OR lesson.published_version_id NOT IN (candidate.id,base.id,base.origin_version_id)
      THEN RAISE EXCEPTION 'Unexpected live version: %',lesson.lesson_id; END IF;
    SELECT * INTO STRICT live FROM public.academy_lesson_versions WHERE id=lesson.published_version_id FOR SHARE;
    PERFORM 1 FROM public.academy_lesson_blocks WHERE version_id IN (live.id,candidate.id) ORDER BY id FOR SHARE;
    PERFORM 1 FROM academy_private.lesson_block_keys k JOIN public.academy_lesson_blocks b ON b.id=k.block_id
      WHERE b.version_id IN (live.id,candidate.id) ORDER BY k.block_id FOR SHARE OF k;
    SELECT md5(string_agg(to_jsonb(b)::text||coalesce(to_jsonb(k)::text,''),'' ORDER BY b.position,b.id)) INTO fingerprint
      FROM public.academy_lesson_blocks b LEFT JOIN academy_private.lesson_block_keys k ON k.block_id=b.id WHERE b.version_id=candidate.id;
    IF candidate.validation->>'videoEditorialBlocks' IS DISTINCT FROM fingerprint OR candidate.validation->>'reviewedContent' IS DISTINCT FROM rec->>'expectedContent'
      OR jsonb_array_length(academy_private.lesson_validation(candidate.id)->'errors') IS DISTINCT FROM 0 THEN RAISE EXCEPTION 'Pilot was modified: %',lesson.lesson_id; END IF;
    IF live.id=candidate.id THEN CONTINUE; END IF;
    SELECT md5(jsonb_build_array(live.title,live.subtitle,live.objective,live.hook,
      jsonb_agg(jsonb_build_array(b.block_key,b.block_type,b.title,b.content,b.required,b.points,
        CASE WHEN b.block_type IN ('quiz','scenario','course_exam') THEN k.answer_key END,
        CASE WHEN b.block_type IN ('quiz','scenario','course_exam') THEN k.feedback END) ORDER BY b.position))::text)
      INTO live_content FROM public.academy_lesson_blocks b LEFT JOIN academy_private.lesson_block_keys k ON k.block_id=b.id WHERE b.version_id=live.id;
    IF live_content IS DISTINCT FROM (CASE WHEN live.id=base.id THEN rec->>'baseContent' ELSE rec->>'originalContent' END)
      THEN RAISE EXCEPTION 'Live material changed: %',lesson.lesson_id; END IF;
    IF EXISTS(SELECT 1 FROM (SELECT * FROM public.academy_lesson_blocks WHERE version_id=live.id) a
      FULL JOIN (SELECT * FROM public.academy_lesson_blocks WHERE version_id=candidate.id) b USING(block_key)
      WHERE a.id IS NULL OR b.id IS NULL OR (a.block_type,a.points) IS DISTINCT FROM (b.block_type,b.points)
        OR (b.required AND NOT a.required)) THEN RAISE EXCEPTION 'Incompatible progress keys: %',lesson.lesson_id; END IF;
    SELECT coalesce(array_agg(b.block_key),'{}'::text[]) INTO changed FROM public.academy_lesson_blocks b
      JOIN public.academy_lesson_blocks a ON a.version_id=live.id AND a.block_key=b.block_key
      WHERE b.version_id=candidate.id AND b.block_type IN ('quiz','scenario','course_exam')
        AND (b.content->'options',b.content->'questions',b.content->'question',b.content->'prompt')
        IS DISTINCT FROM (a.content->'options',a.content->'questions',a.content->'question',a.content->'prompt');
    UPDATE public.academy_lesson_progress p SET version_id=candidate.id,
      current_block_key=CASE WHEN p.current_block_key='field_diagnostic' AND EXISTS(
        SELECT 1 FROM public.academy_lesson_blocks b WHERE b.version_id=candidate.id AND b.block_key=p.current_block_key
        AND b.content->>'mergedInto'='before_after') THEN 'before_after' ELSE p.current_block_key END,
      block_state=p.block_state-ARRAY(SELECT k FROM unnest(changed) k WHERE NOT k=ANY(p.completed_block_keys))
      WHERE p.academy_lesson_id=lesson.id AND p.version_id=live.id;
    UPDATE public.academy_lessons SET published_version_id=candidate.id,draft_version_id=candidate.id,updated_at=now() WHERE id=lesson.id;
    INSERT INTO public.academy_lesson_audit(academy_lesson_id,version_id,action,details) VALUES
      (lesson.id,candidate.id,'published',jsonb_build_object('release',edition,'sourceVersion',live.id,'editorialBase',base.id));
  END LOOP;
END $publish$;
