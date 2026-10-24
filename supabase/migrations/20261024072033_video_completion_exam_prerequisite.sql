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

-- Clarify one existing budget question without changing its choices or private key.
DO $completion_question$
DECLARE definition text; fingerprint text;
 anchor constant text := $anchor$AND NOT(staged.lesson_id='pv11-06' AND b.block_key='reference')$anchor$;
 exception constant text := $exception$
      AND NOT(staged.lesson_id='pv13-03' AND b.block_key='quiz_1'
        AND i->'content'=jsonb_set(b.content,'{question}',to_jsonb('В отделния учебен разчет: 14 часа × 40 €, 120 € външни разходи и резерв 10% върху сбора. Колко е основата преди клиентска надценка?'::text)))$exception$;
BEGIN
 SELECT pg_get_functiondef(oid),md5(prosrc) INTO definition,fingerprint
 FROM pg_proc WHERE oid='academy_private.publish_video_client_completion(text)'::regprocedure;
 IF position(exception in definition)>0 THEN RETURN; END IF;
 IF fingerprint IS DISTINCT FROM '4824932af51715f0ed830d188fc32fa1' THEN
  RAISE EXCEPTION 'Video completion publisher changed since review'; END IF;
 IF position(anchor in definition)=0 THEN RAISE EXCEPTION 'Missing content guard anchor'; END IF;
 EXECUTE replace(definition,anchor,anchor||exception);
END $completion_question$;
REVOKE ALL ON FUNCTION academy_private.publish_video_client_completion(text) FROM PUBLIC,anon,authenticated,service_role;
