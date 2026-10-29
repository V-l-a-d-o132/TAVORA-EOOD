-- Restore only Module 3 to the exact v13 versions. Preserve pilot attempts and archive its progress.
-- Do not use a whole-database restore or a git reset for an editorial rollback.
BEGIN;
SET LOCAL lock_timeout='5s';
SET LOCAL statement_timeout='30s';
DO $m3_rollback$
DECLARE targets jsonb:=$targets$[{"id":"d1998576-af68-41ef-a6e5-45f1136c23d7","lessonId":"l03-01","baselineVersionId":"772cd784-78b2-4323-889e-36d62314565a","versionId":"24cb6056-2596-5912-8315-94addd4ca182","baselineFingerprint":"787a3feafe9dd6e7c4124c1094373114","candidateFingerprint":"88e48eac9ca5b082914e2f70114e8489"},{"id":"99c6c15e-ad9f-43f2-9380-1c6bf6307d44","lessonId":"l03-02","baselineVersionId":"70022d17-804e-4615-bcf0-3761e2a076fe","versionId":"192a22b6-565c-5f78-8c19-5432ce2ee75e","baselineFingerprint":"974a397a08b0fbfdd25bb01aea7cfbe8","candidateFingerprint":"19af756eaedfc0e80601e2c013bdbadf"},{"id":"87d08016-7a47-48ca-b164-a77233c12bdf","lessonId":"l03-03","baselineVersionId":"defe3923-5602-419c-82be-794249247d65","versionId":"34f9f711-7209-5c83-82a2-458ff4801ecf","baselineFingerprint":"c23e359b97a253f19968300af18a94cb","candidateFingerprint":"58755a9c9d5ffa8d68ba521342281efc"},{"id":"cc96da3e-bbdc-4061-939d-4f9cc643d311","lessonId":"l03-04","baselineVersionId":"0130998a-8323-4e02-9e8e-fba6685d26d2","versionId":"d29d9a91-0d4a-5eb7-867e-25b908308d4c","baselineFingerprint":"975a8279065b2bca491deca061ecc632","candidateFingerprint":"1699c4c8c48e6fa5d955d2e760a3a2bd"},{"id":"096d0530-1c92-4b8a-9c27-67e4d2a91fe8","lessonId":"l03-05","baselineVersionId":"77da4386-ea85-4ce3-9895-94f5e5d2b1ea","versionId":"69e9938c-63ec-5f6d-bb3a-1ba34d9c0f0e","baselineFingerprint":"d6f3fe71ccda6e40279eb541805f0c81","candidateFingerprint":"b95821a3e3f10b45ffa58990bf6cdb4e"},{"id":"aad33a29-2188-421e-9a95-ae04dd5ba562","lessonId":"l03-06","baselineVersionId":"9fc4c455-4382-459a-8dc5-781dca9c6c53","versionId":"60b80026-29bd-58b8-8571-d2ced73af405","baselineFingerprint":"2b18da442835841e4fc7db7af9cd570f","candidateFingerprint":"1e6907a9ebc78b4e122e11075196bb5e"},{"id":"14f14779-3391-4d1a-8075-0a898c94f53c","lessonId":"l03-07","baselineVersionId":"a1006ebc-77a0-4875-adcd-bb3a59805c7d","versionId":"7972bb1e-f03f-552d-a8eb-a59b4f0c21b9","baselineFingerprint":"39cf83b759cd7a36a7b714c103c09501","candidateFingerprint":"e2821281e545952e09693eeee43522ae"},{"id":"633a502e-4fb7-4196-8828-3855aa2bb301","lessonId":"l03-08","baselineVersionId":"b61697b4-8ba0-41b4-9409-d6664e199913","versionId":"99ec61c0-c6df-51bf-af94-3f3323bbe2fd","baselineFingerprint":"506eedce04ee2c98e3232f58eb584398","candidateFingerprint":"bca429bb5e4cdfd27871f65f03e4eabd"},{"id":"8274e8fe-8873-4aa0-9524-4ac2018b4b28","lessonId":"l03-09","baselineVersionId":"b270ace7-d30c-4541-81c0-7d107e2cb447","versionId":"a7fdbaf6-f169-5f81-b5ad-fbebf3a4b76f","baselineFingerprint":"30624c89ea5dac4488225f25f7d23c23","candidateFingerprint":"352cfa17811c94e8dd47a110ea96dec7"},{"id":"8f288ae6-18e2-49ea-a75b-d01313d47196","lessonId":"l03-10","baselineVersionId":"46b4ea0e-db02-454c-9aea-d7829a9428f9","versionId":"ba5fec9b-606a-5d0c-bc3f-58f423811c39","baselineFingerprint":"c627b35e96165823671c0ed2cc75f69e","candidateFingerprint":"943215b78e8cb3bb46971466b359d925"}]$targets$::jsonb; item jsonb; l public.academy_lessons; actual text;
 p public.academy_lesson_progress; restored public.academy_lesson_progress; saved jsonb;
BEGIN
 PERFORM pg_advisory_xact_lock(hashtext('silk_m03_pilot_20261028'));
 PERFORM 1 FROM public.academy_lessons WHERE module_id='s01-m03' ORDER BY id FOR UPDATE;
 IF (SELECT count(*) FROM public.academy_lessons WHERE module_id='s01-m03')<>10 THEN RAISE EXCEPTION 'Module scope changed'; END IF;
 FOR item IN SELECT value FROM jsonb_array_elements(targets) LOOP
  SELECT * INTO STRICT l FROM public.academy_lessons WHERE id=(item->>'id')::uuid AND module_id='s01-m03';
  IF l.published_version_id IS DISTINCT FROM (item->>'versionId')::uuid THEN RAISE EXCEPTION 'Active version differs from this pilot; stop and review'; END IF;
  IF NOT EXISTS(SELECT 1 FROM public.academy_lesson_versions WHERE id=(item->>'baselineVersionId')::uuid AND academy_lesson_id=l.id AND version_number=13) THEN RAISE EXCEPTION 'Baseline missing'; END IF;

  SELECT md5(jsonb_build_object('version',to_jsonb(v)-'created_at'-'created_by'-'updated_at'-'updated_by'-'validation','blocks',(select jsonb_agg(to_jsonb(blk)-'created_at' order by blk.position,blk.id) from public.academy_lesson_blocks blk where blk.version_id=v.id))::text) INTO actual FROM public.academy_lesson_versions v WHERE v.id=(item->>'baselineVersionId')::uuid;
  IF actual IS DISTINCT FROM item->>'baselineFingerprint' THEN RAISE EXCEPTION 'Baseline content fingerprint changed'; END IF;
  SELECT md5(jsonb_build_object('version',to_jsonb(v)-'created_at'-'created_by'-'updated_at'-'updated_by'-'validation','blocks',(select jsonb_agg(to_jsonb(blk)-'created_at' order by blk.position,blk.id) from public.academy_lesson_blocks blk where blk.version_id=v.id))::text) INTO actual FROM public.academy_lesson_versions v WHERE v.id=(item->>'versionId')::uuid;
  IF actual IS DISTINCT FROM item->>'candidateFingerprint' THEN RAISE EXCEPTION 'Pilot content fingerprint changed'; END IF;
 END LOOP;
 FOR item IN SELECT value FROM jsonb_array_elements(targets) LOOP
  FOR p IN SELECT * FROM public.academy_lesson_progress WHERE academy_lesson_id=(item->>'id')::uuid AND version_id=(item->>'versionId')::uuid FOR UPDATE LOOP
   saved:=NULL;
   SELECT h.snapshot INTO saved FROM academy_private.lesson_progress_history h JOIN public.academy_lesson_versions v ON v.id=h.version_id
    WHERE h.user_id=p.user_id AND h.academy_lesson_id=p.academy_lesson_id AND v.academy_lesson_id=p.academy_lesson_id AND v.version_number<=13
    ORDER BY h.archived_at DESC LIMIT 1;
   IF saved IS NOT NULL THEN
    restored:=jsonb_populate_record(NULL::public.academy_lesson_progress,saved);
    IF restored.user_id<>p.user_id OR restored.academy_lesson_id<>p.academy_lesson_id THEN RAISE EXCEPTION 'Snapshot identity mismatch'; END IF;
    UPDATE public.academy_lesson_progress SET version_id=restored.version_id,current_block_key=restored.current_block_key,block_state=restored.block_state,completed_block_keys=restored.completed_block_keys,xp=restored.xp,score_percent=restored.score_percent,mastery_status=restored.mastery_status,started_at=restored.started_at,last_activity_at=restored.last_activity_at,completed_at=restored.completed_at WHERE user_id=p.user_id AND academy_lesson_id=p.academy_lesson_id;
   ELSE
    UPDATE public.academy_lesson_progress SET version_id=(item->>'baselineVersionId')::uuid,current_block_key=NULL,block_state='{}'::jsonb,completed_block_keys='{}'::text[],xp=0,score_percent=NULL,mastery_status='learning',completed_at=NULL,last_activity_at=now() WHERE user_id=p.user_id AND academy_lesson_id=p.academy_lesson_id;
   END IF;
   IF NOT EXISTS(SELECT 1 FROM academy_private.lesson_progress_history h WHERE h.user_id=p.user_id AND h.academy_lesson_id=p.academy_lesson_id AND h.version_id=p.version_id AND h.snapshot=to_jsonb(p)) THEN RAISE EXCEPTION 'Pilot progress was not archived'; END IF;
  END LOOP;
  -- Restore archived older progress while the pilot is still selected inside this
  -- transaction. The v13 guard rejects writes of older version IDs; no guard is disabled.
  UPDATE public.academy_lessons SET published_version_id=(item->>'baselineVersionId')::uuid,updated_at=now() WHERE id=(item->>'id')::uuid;
  INSERT INTO public.academy_lesson_audit(academy_lesson_id,version_id,action,details)
   VALUES((item->>'id')::uuid,(item->>'baselineVersionId')::uuid,'rolled_back',jsonb_build_object('release','silk_m03_pilot_20261028','pilotVersionId',item->>'versionId','pilotProgressRetained',true));
 END LOOP;
END $m3_rollback$;
COMMIT;
