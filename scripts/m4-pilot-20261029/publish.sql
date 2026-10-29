-- Owner pulls main and publishes in Readdy. Run only after the exact workbook is live
-- and browser/download checks pass. Full paid readings stay behind existing Academy access.
-- This changes ten publication pointers. It never replaces old versions or learner attempts.
BEGIN;
SET LOCAL lock_timeout='5s';
SET LOCAL statement_timeout='30s';
DO $m4_publish$
DECLARE targets jsonb:=$targets$[{"id":"0d4f06c3-97e9-4fd6-af1e-69fdb3fcdb21","lessonId":"l04-01","baselineVersionId":"302f9c37-9982-4f35-a941-f6960e951e82","versionId":"2dd5b166-7f2e-5070-86f2-4471457d6f93","baselineFingerprint":"d49938e9159dbbf9ff7197cdbf64a88f","candidateFingerprint":"025346bc33acb29a00781252c0d2aac4"},{"id":"5ad1e281-8953-4970-a14f-7dfa2506a1b2","lessonId":"l04-02","baselineVersionId":"86d42962-241f-4974-99dd-7cd7d4081474","versionId":"830c8a40-7370-5e2e-a6b6-24a2bbb7d42b","baselineFingerprint":"038535db6844151c363a99da841f175f","candidateFingerprint":"323ad2c18f05fc3601d25f3819a45b35"},{"id":"b6d54278-0d3c-4062-9518-feda89bd8fb2","lessonId":"l04-03","baselineVersionId":"b93225a8-5d08-41d8-8f3e-c8a891f8de80","versionId":"40708934-9d94-52d6-b78e-4b7df0acd4cb","baselineFingerprint":"23a17866a739954177f5bf2363b2f3e2","candidateFingerprint":"f74ef59c07b80909f0eb363bb7ee2739"},{"id":"d5956211-276d-41d8-856a-169a3a1813b2","lessonId":"l04-04","baselineVersionId":"199242ae-4c12-4e08-94ec-9bec88b071a6","versionId":"ccee030d-b65e-5a10-9c8a-a4ba9a0f4cb0","baselineFingerprint":"4a6e1bd6d73b34bf0c6a11e59c2f937b","candidateFingerprint":"fe7e3f2ea85cdf4eaaf959a103e52240"},{"id":"647062d4-4485-4a12-8bb3-7e8d5714bb82","lessonId":"l04-05","baselineVersionId":"b9bed05e-19a6-4a90-8683-79cdd7fc470b","versionId":"c24f5275-39b2-549f-85df-d0dffff0019d","baselineFingerprint":"a5e1ad6003d50aff8c6ee4b03b7a9b3d","candidateFingerprint":"4addbe4d070e1090c4d39ab4fb87fef9"},{"id":"eb731d85-17b3-4535-980c-d87de4ccc7e5","lessonId":"l04-06","baselineVersionId":"4ad14bd3-769f-408f-9d1e-c670e381aedf","versionId":"a72ca1ee-015a-5217-9a88-6390db49f642","baselineFingerprint":"0b8bd92ab26871c8c3a5c813bbd730ff","candidateFingerprint":"d4ee86b32d948f811841fc773181dd7d"},{"id":"3e01b99d-ab6a-44fc-bb8a-1c48c175ab8d","lessonId":"l04-07","baselineVersionId":"8f21b6c0-006b-4afd-a431-18a9a7e5675f","versionId":"61229df0-69b9-5bd8-b4b3-7495e8987925","baselineFingerprint":"a01ea55fe840105149ee285228985fa5","candidateFingerprint":"dc327378d4c3a6fa90f88c7671d6d88f"},{"id":"edb882f7-8438-45a2-9b9a-e0716402f7f3","lessonId":"l04-08","baselineVersionId":"1756b682-ffc7-4641-a8f4-a0e3b3d1f576","versionId":"0b1b2c62-89d2-5153-b0f0-f53dcd8e5931","baselineFingerprint":"4231bbf93fbafed77659aba539a4160e","candidateFingerprint":"c1879a6afd8e5168591b15a22d89659d"},{"id":"45ed6290-3aee-4a71-af51-45dbca88ba3e","lessonId":"l04-09","baselineVersionId":"19257d93-92ad-4de6-9d5c-359ba5c40ad0","versionId":"bbb531da-3861-56f9-8dfa-7f27e682d752","baselineFingerprint":"5f5c9e668a69ec8934dddf34953d2875","candidateFingerprint":"2d6f4055bb7a671feb911a9713bb15b1"},{"id":"c2297d76-dd3d-47fc-a10e-eae426fc6f7b","lessonId":"l04-10","baselineVersionId":"27878b28-d9ec-4e47-ac4c-b5acc17a9179","versionId":"da163e26-23fe-5cf6-b57f-6d417cc835df","baselineFingerprint":"1d9f5dfcb610ecb9e0d0e8ae8f2fcd83","candidateFingerprint":"67b3c00aa85dc4bdafc2c97f39b1fbe6"}]$targets$::jsonb; item jsonb; l public.academy_lessons; checks jsonb; actual text;
 p public.academy_lesson_progress; restored public.academy_lesson_progress; saved jsonb;
BEGIN
 PERFORM pg_advisory_xact_lock(hashtext('silk_m04_pilot_20261029'));
 PERFORM 1 FROM public.academy_lessons WHERE module_id='s01-m04' ORDER BY id FOR UPDATE;
 IF (SELECT count(*) FROM public.academy_lessons WHERE module_id='s01-m04')<>10 THEN RAISE EXCEPTION 'Module scope changed'; END IF;
 FOR item IN SELECT value FROM jsonb_array_elements(targets) LOOP
  SELECT * INTO STRICT l FROM public.academy_lessons WHERE id=(item->>'id')::uuid AND module_id='s01-m04';
  IF l.published_version_id IS DISTINCT FROM (item->>'baselineVersionId')::uuid OR l.draft_version_id IS DISTINCT FROM (item->>'versionId')::uuid OR l.status<>'published' THEN RAISE EXCEPTION 'Baseline or candidate changed'; END IF;
  IF NOT EXISTS(SELECT 1 FROM public.academy_lesson_versions WHERE id=(item->>'versionId')::uuid AND academy_lesson_id=l.id AND origin_version_id=l.published_version_id AND change_note='silk_m04_pilot_20261029') THEN RAISE EXCEPTION 'Candidate identity changed'; END IF;

  SELECT md5(jsonb_build_object('version',to_jsonb(v)-'created_at'-'created_by'-'updated_at'-'updated_by'-'validation','blocks',(select jsonb_agg(to_jsonb(blk)-'created_at' order by blk.position,blk.id) from public.academy_lesson_blocks blk where blk.version_id=v.id))::text) INTO actual FROM public.academy_lesson_versions v WHERE v.id=(item->>'baselineVersionId')::uuid;
  IF actual IS DISTINCT FROM item->>'baselineFingerprint' THEN RAISE EXCEPTION 'Baseline content fingerprint changed'; END IF;
  SELECT md5(jsonb_build_object('version',to_jsonb(v)-'created_at'-'created_by'-'updated_at'-'updated_by'-'validation','blocks',(select jsonb_agg(to_jsonb(blk)-'created_at' order by blk.position,blk.id) from public.academy_lesson_blocks blk where blk.version_id=v.id))::text) INTO actual FROM public.academy_lesson_versions v WHERE v.id=(item->>'versionId')::uuid;
  IF actual IS DISTINCT FROM item->>'candidateFingerprint' THEN RAISE EXCEPTION 'Pilot content fingerprint changed'; END IF;
  checks:=academy_private.lesson_validation((item->>'versionId')::uuid);
  IF jsonb_array_length(checks->'errors')<>0 THEN RAISE EXCEPTION 'Candidate no longer validates'; END IF;
 END LOOP;
 INSERT INTO academy_private.lesson_progress_history(user_id,academy_lesson_id,version_id,snapshot,archived_at,reason)
  SELECT current_p.user_id,current_p.academy_lesson_id,current_p.version_id,to_jsonb(current_p),clock_timestamp(),'m04_before_pilot_publication_20261029'
  FROM public.academy_lesson_progress current_p JOIN public.academy_lessons al ON al.id=current_p.academy_lesson_id WHERE al.module_id='s01-m04'
  ON CONFLICT(user_id,academy_lesson_id,version_id) DO UPDATE SET snapshot=EXCLUDED.snapshot,archived_at=EXCLUDED.archived_at,reason=EXCLUDED.reason;
 FOR item IN SELECT value FROM jsonb_array_elements(targets) LOOP
  UPDATE public.academy_lessons SET published_version_id=(item->>'versionId')::uuid,updated_at=now() WHERE id=(item->>'id')::uuid;
  -- If this exact pilot was used before a rollback, resume its archived progress.
  FOR p IN SELECT * FROM public.academy_lesson_progress WHERE academy_lesson_id=(item->>'id')::uuid AND version_id<>(item->>'versionId')::uuid FOR UPDATE LOOP
   saved:=NULL;
   SELECT h.snapshot INTO saved FROM academy_private.lesson_progress_history h WHERE h.user_id=p.user_id AND h.academy_lesson_id=p.academy_lesson_id AND h.version_id=(item->>'versionId')::uuid;
   IF saved IS NOT NULL THEN
    restored:=jsonb_populate_record(NULL::public.academy_lesson_progress,saved);
    IF restored.user_id<>p.user_id OR restored.academy_lesson_id<>p.academy_lesson_id OR restored.version_id<>(item->>'versionId')::uuid THEN RAISE EXCEPTION 'Pilot snapshot identity mismatch'; END IF;
    UPDATE public.academy_lesson_progress SET version_id=restored.version_id,current_block_key=restored.current_block_key,block_state=restored.block_state,completed_block_keys=restored.completed_block_keys,xp=restored.xp,score_percent=restored.score_percent,mastery_status=restored.mastery_status,started_at=restored.started_at,last_activity_at=restored.last_activity_at,completed_at=restored.completed_at WHERE user_id=p.user_id AND academy_lesson_id=p.academy_lesson_id;
   END IF;
  END LOOP;
  INSERT INTO public.academy_lesson_audit(academy_lesson_id,version_id,action,details)
   VALUES((item->>'id')::uuid,(item->>'versionId')::uuid,'published',jsonb_build_object('release','silk_m04_pilot_20261029','baselineVersionId',item->>'baselineVersionId'));
 END LOOP;
END $m4_publish$;
COMMIT;
