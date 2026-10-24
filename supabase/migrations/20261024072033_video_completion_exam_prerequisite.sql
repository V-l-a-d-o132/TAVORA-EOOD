-- Extend the existing private prerequisite, preserving its authentication and scope.
DO $completion_gate$
DECLARE definition text; fingerprint text;
BEGIN
 SELECT pg_get_functiondef(oid),md5(prosrc) INTO definition,fingerprint
 FROM pg_proc WHERE oid='academy_private.assert_video_practice_ready(text,text,uuid)'::regprocedure;
 IF position('video_production_transfer_v1' in definition)>0 THEN RETURN; END IF;
 IF fingerprint IS DISTINCT FROM 'f4b75e119ad26f7a497cfe1082ff1acc' THEN
  RAISE EXCEPTION 'Video exam prerequisite changed since review'; END IF;
 IF position('video_ai_20261019'')) LOOP' in definition)=0 THEN RAISE EXCEPTION 'Missing prerequisite anchor'; END IF;
 EXECUTE replace(definition,'video_ai_20261019'')) LOOP',
  'video_ai_20261019'') OR (b.block_key=''video_production_transfer_v1'' AND b.content->''studio''->>''domain''=''video'')) LOOP');
END $completion_gate$;
REVOKE ALL ON FUNCTION academy_private.assert_video_practice_ready(text,text,uuid) FROM PUBLIC,anon,authenticated,service_role;
