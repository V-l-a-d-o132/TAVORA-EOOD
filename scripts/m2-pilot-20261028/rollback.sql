-- Restore only Module 2 to the exact v13 versions. Preserve pilot attempts and archive its progress.
-- Do not use a whole-database restore or a git reset for an editorial rollback.
BEGIN;
SET LOCAL lock_timeout='5s';
SET LOCAL statement_timeout='30s';
DO $m2_rollback$
DECLARE targets jsonb:=$targets$[{"id":"bffe58de-8f2c-4e98-9832-79e34cf829b2","lessonId":"l02-01","baselineVersionId":"953a362a-d63a-4495-b449-a7cc6e4c7b43","versionId":"f40504b8-e93f-5ca8-b144-b5e012c4bbab","baselineFingerprint":"5103fa63e207fbebdbbbfd42140df503","candidateFingerprint":"697d6514d2444d734eacb0d189483b3b"},{"id":"cc3210d5-596d-416a-8f6e-42f95d19cca5","lessonId":"l02-02","baselineVersionId":"d8b21754-a24c-4696-ba2a-77fa1f93ef09","versionId":"ef04aee9-20e2-5de7-a3ad-24c3e18862e2","baselineFingerprint":"bb9afd0bf7d4141ad81dc1a7eff148f1","candidateFingerprint":"c283294ef09595ab0b9c5964b3dc3fb9"},{"id":"0f468808-ab21-4070-a22b-e6ac348ceddd","lessonId":"l02-03","baselineVersionId":"602cd2e8-a4aa-417d-adc0-bc12d612655c","versionId":"ccaa3d49-5abe-57db-b5a4-6c9e83dd089a","baselineFingerprint":"866af2c4e7b51e7e8c83461a879accb9","candidateFingerprint":"994386330338eaef5653e707daaf6970"},{"id":"53505ebb-7e3b-497c-b6fe-fd641965f702","lessonId":"l02-04","baselineVersionId":"0478cf9e-745e-4139-8607-03b803de49ef","versionId":"c11f3f37-7848-5d8d-8781-8e0a5aa170a8","baselineFingerprint":"c196db17bbaa11f9eaff69aeb68ab4ef","candidateFingerprint":"f2969ab734e14757f7dc476153e7ca9e"},{"id":"f8f794a5-e38e-43bf-b814-17f3073efc6b","lessonId":"l02-05","baselineVersionId":"6a92dab7-d814-4c8e-b2de-89f83156562e","versionId":"53570844-f1be-554e-8582-2f0b66cfedd0","baselineFingerprint":"33acb0e89450b5d479d7b9f1613336c6","candidateFingerprint":"3dbeaf07e372b0b55313ffb565f05174"},{"id":"cc4a4cba-5117-4414-aacc-f063402ba7e8","lessonId":"l02-06","baselineVersionId":"ba154384-ac54-4af7-aeaf-563c482aa8d2","versionId":"cf3da611-11dc-5d73-93c2-e4606d4ce496","baselineFingerprint":"de0d87fa37ffab76a8f308146798610d","candidateFingerprint":"9253379d54728885317c25750437c2ab"},{"id":"cfaf2e04-eec7-4391-bb58-11feaea6e5ac","lessonId":"l02-07","baselineVersionId":"d97ade42-89da-456c-8016-14b8d15428d2","versionId":"44456081-6da0-59c2-90ed-f4ab6856d580","baselineFingerprint":"d03248c1d7c5276eb63dfd42c1d5f4e0","candidateFingerprint":"28172a78a4cce3335219bf5c97338991"},{"id":"f00b544f-be36-4780-a73b-95f0c0aa20d8","lessonId":"l02-08","baselineVersionId":"a5ca430e-f7ec-43a6-ae10-8147702043b7","versionId":"02b8d021-d3c8-5401-9748-6120e998f523","baselineFingerprint":"10c92091e7eb60a087095b2af1d45246","candidateFingerprint":"6a5922282d39fff3ab3ecb4a6e4de549"},{"id":"64a0baf7-a082-40c3-8c15-395e3008b5e1","lessonId":"l02-09","baselineVersionId":"3d2c4c7b-0bc8-4b66-b2db-e2016372e357","versionId":"52a3aa0e-eae1-5e4f-b509-13c8a0becebe","baselineFingerprint":"3c0c41c6fc05a65efee742c68912f25f","candidateFingerprint":"0d576da434f39fb95dbee0930d41006e"},{"id":"c6eedc0e-a137-485c-9681-59f98175fc80","lessonId":"l02-10","baselineVersionId":"fcb8c507-ac5f-43a3-ad20-09f8a4724b1e","versionId":"4edf67d9-423e-540f-804e-562f477d5ac9","baselineFingerprint":"0cf848b9406b1c28817b6b8e015f208f","candidateFingerprint":"0056dc71518ea6e0f30f416913a847c6"}]$targets$::jsonb; item jsonb; l public.academy_lessons; actual text;
 p public.academy_lesson_progress; restored public.academy_lesson_progress; saved jsonb;
BEGIN
 PERFORM pg_advisory_xact_lock(hashtext('silk_m02_pilot_20261028'));
 PERFORM 1 FROM public.academy_lessons WHERE module_id='s01-m02' ORDER BY id FOR UPDATE;
 IF (SELECT count(*) FROM public.academy_lessons WHERE module_id='s01-m02')<>10 THEN RAISE EXCEPTION 'Module scope changed'; END IF;
 FOR item IN SELECT value FROM jsonb_array_elements(targets) LOOP
  SELECT * INTO STRICT l FROM public.academy_lessons WHERE id=(item->>'id')::uuid AND module_id='s01-m02';
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
   VALUES((item->>'id')::uuid,(item->>'baselineVersionId')::uuid,'rolled_back',jsonb_build_object('release','silk_m02_pilot_20261028','pilotVersionId',item->>'versionId','pilotProgressRetained',true));
 END LOOP;
END $m2_rollback$;
COMMIT;
