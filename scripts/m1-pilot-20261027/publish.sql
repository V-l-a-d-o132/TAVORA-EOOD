-- Run only after the exact pilot assets are live and browser/download checks pass.
-- This changes four publication pointers. It never replaces old versions or learner attempts.
BEGIN;
SET LOCAL lock_timeout='5s';
SET LOCAL statement_timeout='30s';
DO $m1_publish$
DECLARE targets jsonb:=$targets$[{"id":"62e8b964-2d0d-4a74-a6f6-d5cb550b4339","lessonId":"l01-01","baselineVersionId":"60c2859c-de22-486a-92e9-120ca8ff922a","versionId":"d8164a00-1a99-4877-8132-5fff10f53e54","version":16},{"id":"9d32e140-6ab8-43e3-bd7b-e52996461bef","lessonId":"l01-02","baselineVersionId":"513a9bb2-cf18-46e2-972e-dc97acad3178","versionId":"12092a2d-ee0c-4067-8e4d-279b859c4aeb","version":16},{"id":"7d0447ff-ed9b-41f2-92f3-35d88fb124ca","lessonId":"l01-03","baselineVersionId":"4fbf482f-da92-4116-8c73-20aac79be2ce","versionId":"dc7798ae-814f-48d2-b999-e92405c1498f","version":16},{"id":"91b689fc-684f-4ea7-a934-2ccd529b0842","lessonId":"l01-04","baselineVersionId":"5024942a-99bf-4194-84f5-8cf2e82d6544","versionId":"f5b5bdae-a22f-4d90-86e6-94f0afc75b42","version":16}]$targets$::jsonb; item jsonb; l public.academy_lessons; checks jsonb;
 p public.academy_lesson_progress; restored public.academy_lesson_progress; saved jsonb;
BEGIN
 PERFORM pg_advisory_xact_lock(hashtext('silk_m01_pilot_20261027'));
 PERFORM 1 FROM public.academy_lessons WHERE module_id='s01-m01' ORDER BY id FOR UPDATE;
 IF (SELECT count(*) FROM public.academy_lessons WHERE module_id='s01-m01')<>4 THEN RAISE EXCEPTION 'Module scope changed'; END IF;
 FOR item IN SELECT value FROM jsonb_array_elements(targets) LOOP
  SELECT * INTO STRICT l FROM public.academy_lessons WHERE id=(item->>'id')::uuid AND module_id='s01-m01';
  IF l.published_version_id IS DISTINCT FROM (item->>'baselineVersionId')::uuid OR l.draft_version_id IS DISTINCT FROM (item->>'versionId')::uuid OR l.status<>'published' THEN RAISE EXCEPTION 'Baseline or candidate changed'; END IF;
  IF NOT EXISTS(SELECT 1 FROM public.academy_lesson_versions WHERE id=(item->>'versionId')::uuid AND academy_lesson_id=l.id AND origin_version_id=l.published_version_id AND change_note='silk_m01_pilot_20261027') THEN RAISE EXCEPTION 'Candidate identity changed'; END IF;
  checks:=academy_private.lesson_validation((item->>'versionId')::uuid);
  IF jsonb_array_length(checks->'errors')<>0 THEN RAISE EXCEPTION 'Candidate no longer validates'; END IF;
 END LOOP;
 INSERT INTO academy_private.lesson_progress_history(user_id,academy_lesson_id,version_id,snapshot,archived_at,reason)
  SELECT current_p.user_id,current_p.academy_lesson_id,current_p.version_id,to_jsonb(current_p),clock_timestamp(),'m01_before_pilot_publication_20261027'
  FROM public.academy_lesson_progress current_p JOIN public.academy_lessons al ON al.id=current_p.academy_lesson_id WHERE al.module_id='s01-m01'
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
   VALUES((item->>'id')::uuid,(item->>'versionId')::uuid,'published',jsonb_build_object('release','silk_m01_pilot_20261027','baselineVersionId',item->>'baselineVersionId'));
 END LOOP;
END $m1_publish$;
COMMIT;
