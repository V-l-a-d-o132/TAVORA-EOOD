SET lock_timeout='5s';
CREATE TABLE public.academy_webhook_events(event_id text PRIMARY KEY, kind text NOT NULL, received_at timestamptz NOT NULL DEFAULT now());
CREATE TABLE public.academy_payment_adjustments(
 payment_intent_id text PRIMARY KEY, refunded_cents integer NOT NULL DEFAULT 0 CHECK(refunded_cents>=0),
 dispute_status text, dispute_event_time bigint NOT NULL DEFAULT 0, updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE public.academy_outbox(
 id text PRIMARY KEY, kind text NOT NULL CHECK(kind IN ('access_email','meta_purchase')),
 user_id uuid NOT NULL REFERENCES auth.users, session_id text NOT NULL,
 payload jsonb NOT NULL DEFAULT '{}', state text NOT NULL DEFAULT 'pending',
 attempts integer NOT NULL DEFAULT 0, first_attempt_at timestamptz, lease_until timestamptz,
 lease_token uuid, sent_at timestamptz, created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE public.academy_rate_limits(key text PRIMARY KEY, window_at timestamptz NOT NULL DEFAULT now(), hits integer NOT NULL DEFAULT 0);
CREATE TABLE public.academy_quiz_attempts(
 id uuid PRIMARY KEY, user_id uuid NOT NULL REFERENCES auth.users, module_id text NOT NULL,
 lesson_id text NOT NULL, score integer NOT NULL, total integer NOT NULL, answers jsonb NOT NULL,
 result jsonb NOT NULL, created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX academy_quiz_attempts_user ON public.academy_quiz_attempts(user_id,module_id,lesson_id);
CREATE INDEX academy_outbox_pending ON public.academy_outbox(state,created_at) WHERE state IN ('pending','sending');
CREATE UNIQUE INDEX academy_unique_payment_intent ON public.academy_purchases(stripe_payment_intent_id) WHERE stripe_payment_intent_id IS NOT NULL;
DO $$ DECLARE t text; BEGIN
 FOREACH t IN ARRAY ARRAY['academy_webhook_events','academy_payment_adjustments','academy_outbox','academy_rate_limits','academy_quiz_attempts'] LOOP
 EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY',t);
 EXECUTE format('REVOKE ALL ON public.%I FROM PUBLIC,anon,authenticated',t);
 EXECUTE format('GRANT ALL ON public.%I TO service_role',t);
 END LOOP;
END $$;
GRANT SELECT ON public.academy_quiz_attempts TO authenticated;
CREATE POLICY own_quiz_attempts ON public.academy_quiz_attempts FOR SELECT TO authenticated USING(user_id=(SELECT auth.uid()) OR (SELECT academy_private.is_admin()));

CREATE FUNCTION academy_private.refresh_access(p_user uuid) RETURNS void LANGUAGE plpgsql SET search_path='' AS $$
DECLARE mods text[]; full_a boolean;
BEGIN
 PERFORM 1 FROM public.profiles WHERE id=p_user FOR UPDATE;
 SELECT coalesce(array_agg(DISTINCT m) FILTER(WHERE m IS NOT NULL),'{}'),coalesce(bool_or(a.full_access),false) INTO mods,full_a
 FROM (
 SELECT g.module_ids,g.full_access FROM public.academy_access_grants g WHERE g.user_id=p_user AND g.revoked_at IS NULL
 UNION ALL SELECT t.module_ids,t.full_access FROM public.academy_purchases p JOIN public.academy_products t USING(tier_id)
 WHERE p.user_id=p_user AND p.livemode=academy_private.payment_environment() AND p.status IN ('paid','partially_refunded')
 ) a LEFT JOIN LATERAL unnest(a.module_ids) m ON true;
 UPDATE public.profiles SET unlocked_modules=to_jsonb(mods),has_full_access=full_a WHERE id=p_user;
END $$;
REVOKE ALL ON FUNCTION academy_private.refresh_access(uuid) FROM PUBLIC,anon,authenticated;
GRANT EXECUTE ON FUNCTION academy_private.refresh_access(uuid) TO service_role;

CREATE FUNCTION public.academy_record_purchase(p_session jsonb,p_event_id text DEFAULT NULL) RETURNS jsonb
 LANGUAGE plpgsql SECURITY INVOKER SET search_path='' AS $$
DECLARE cfg public.academy_prices; prev public.academy_purchases; adj public.academy_payment_adjustments;
 uid uuid := (p_session->>'user_id')::uuid; sid text:=p_session->>'session_id'; pi text:=p_session->>'payment_intent_id'; purchase_status text;
BEGIN
 IF current_user NOT IN ('postgres','service_role') THEN RAISE EXCEPTION 'Forbidden' USING ERRCODE='42501'; END IF;
 IF sid IS NULL OR pi IS NULL OR uid IS NULL THEN RAISE EXCEPTION 'Missing purchase identity'; END IF;
 PERFORM pg_advisory_xact_lock(hashtextextended(pi,0));
 SELECT * INTO cfg FROM public.academy_prices WHERE price_id=p_session->>'price_id';
 IF NOT FOUND OR cfg.tier_id IS DISTINCT FROM p_session->>'tier' OR cfg.livemode IS DISTINCT FROM (p_session->>'livemode')::boolean
 OR cfg.amount_cents IS DISTINCT FROM (p_session->>'amount_total')::integer OR cfg.currency IS DISTINCT FROM p_session->>'currency'
 OR p_session->>'mode' IS DISTINCT FROM 'payment' OR p_session->>'payment_status' IS DISTINCT FROM 'paid' THEN RAISE EXCEPTION 'Invalid purchase'; END IF;
 IF p_event_id IS NOT NULL THEN INSERT INTO public.academy_webhook_events VALUES(p_event_id,'purchase',now()) ON CONFLICT DO NOTHING; END IF;
 SELECT * INTO prev FROM public.academy_purchases WHERE stripe_checkout_session_id=sid;
 IF FOUND AND (prev.user_id IS DISTINCT FROM uid OR prev.tier_id IS DISTINCT FROM cfg.tier_id OR prev.stripe_payment_intent_id IS DISTINCT FROM pi) THEN RAISE EXCEPTION 'Purchase ownership conflict'; END IF;
 SELECT * INTO adj FROM public.academy_payment_adjustments WHERE payment_intent_id=pi;
 purchase_status:=CASE WHEN adj.refunded_cents>=cfg.amount_cents THEN 'refunded' WHEN adj.dispute_status='lost' THEN 'disputed' WHEN adj.refunded_cents>0 THEN 'partially_refunded' ELSE 'paid' END;
 INSERT INTO public.academy_purchases(user_id,stripe_checkout_session_id,stripe_payment_intent_id,tier_id,amount_paid_cents,currency,status,livemode,price_id,needs_review)
 VALUES(uid,sid,pi,cfg.tier_id,cfg.amount_cents,cfg.currency,purchase_status,cfg.livemode,cfg.price_id,coalesce(adj.refunded_cents>0 OR adj.dispute_status IS NOT NULL,false))
 ON CONFLICT(stripe_checkout_session_id) DO NOTHING;
 PERFORM academy_private.refresh_access(uid);
 IF cfg.livemode AND NOT cfg.historical AND purchase_status IN ('paid','partially_refunded') THEN
 INSERT INTO public.academy_outbox(id,kind,user_id,session_id,payload)
 SELECT sid||':'||kind,kind,uid,sid,jsonb_build_object('tier',cfg.tier_id,'amount',cfg.amount_cents,'currency',cfg.currency,'event_id','academy-purchase-'||sid)
 FROM unnest(ARRAY['access_email','meta_purchase']) kind ON CONFLICT DO NOTHING;
 END IF;
 RETURN jsonb_build_object('tier',cfg.tier_id,'access_granted',purchase_status IN ('paid','partially_refunded') AND cfg.livemode=academy_private.payment_environment(),'payment_confirmed',true,'livemode',cfg.livemode,'event_id','academy-purchase-'||sid,'amount_total',cfg.amount_cents,'currency',cfg.currency);
END $$;

CREATE FUNCTION public.academy_apply_adjustment(p_event_id text,p_payment_intent text,p_refunded_cents integer DEFAULT 0,p_dispute_status text DEFAULT NULL,p_event_time bigint DEFAULT 0) RETURNS void
 LANGUAGE plpgsql SECURITY INVOKER SET search_path='' AS $$ DECLARE uid uuid;
BEGIN
 IF current_user NOT IN ('postgres','service_role') THEN RAISE EXCEPTION 'Forbidden' USING ERRCODE='42501'; END IF;
 IF p_payment_intent IS NULL OR p_event_id IS NULL THEN RAISE EXCEPTION 'Missing adjustment identity'; END IF;
 PERFORM pg_advisory_xact_lock(hashtextextended(p_payment_intent,0));
 INSERT INTO public.academy_webhook_events(event_id,kind) VALUES(p_event_id,'adjustment') ON CONFLICT DO NOTHING;
 IF NOT FOUND THEN RETURN; END IF;
 INSERT INTO public.academy_payment_adjustments(payment_intent_id,refunded_cents,dispute_status,dispute_event_time)
 VALUES(p_payment_intent,greatest(p_refunded_cents,0),p_dispute_status,p_event_time)
 ON CONFLICT(payment_intent_id) DO UPDATE SET
 refunded_cents=greatest(academy_payment_adjustments.refunded_cents,EXCLUDED.refunded_cents),
 dispute_status=CASE WHEN EXCLUDED.dispute_status IS NOT NULL AND EXCLUDED.dispute_event_time>=academy_payment_adjustments.dispute_event_time
 AND (academy_payment_adjustments.dispute_status NOT IN ('won','lost','warning_closed') OR academy_payment_adjustments.dispute_status IS NULL OR EXCLUDED.dispute_status IN ('won','lost','warning_closed'))
 THEN EXCLUDED.dispute_status ELSE academy_payment_adjustments.dispute_status END,
 dispute_event_time=greatest(academy_payment_adjustments.dispute_event_time,EXCLUDED.dispute_event_time),updated_at=now();
 UPDATE public.academy_purchases p SET status=CASE WHEN a.refunded_cents>=p.amount_paid_cents THEN 'refunded' WHEN a.dispute_status='lost' THEN 'disputed' WHEN a.refunded_cents>0 THEN 'partially_refunded' ELSE 'paid' END,
 needs_review=a.refunded_cents>0 OR a.dispute_status IS NOT NULL,refunded_at=CASE WHEN a.refunded_cents>0 THEN now() ELSE p.refunded_at END,updated_at=now()
 FROM public.academy_payment_adjustments a WHERE p.stripe_payment_intent_id=p_payment_intent AND a.payment_intent_id=p_payment_intent RETURNING p.user_id INTO uid;
 IF uid IS NOT NULL THEN
  PERFORM academy_private.refresh_access(uid);
  -- Do not deliver an activation email queued before a full refund/lost dispute.
  -- Invalidate any worker lease so a late acknowledgement cannot revive the job.
  UPDATE public.academy_outbox o SET state='cancelled',lease_until=NULL,lease_token=NULL
  FROM public.academy_purchases p
  WHERE p.stripe_payment_intent_id=p_payment_intent AND p.status IN ('refunded','disputed')
    AND o.session_id=p.stripe_checkout_session_id AND o.kind='access_email'
    AND o.state IN ('pending','sending');
 END IF;
END $$;

CREATE FUNCTION public.academy_rate_limit(p_key text,p_limit integer,p_window integer) RETURNS boolean LANGUAGE plpgsql SET search_path='' AS $$ DECLARE n integer; BEGIN
 INSERT INTO public.academy_rate_limits(key,hits) VALUES(p_key,1) ON CONFLICT(key) DO UPDATE SET
 hits=CASE WHEN academy_rate_limits.window_at<now()-make_interval(secs=>p_window) THEN 1 ELSE academy_rate_limits.hits+1 END,
 window_at=CASE WHEN academy_rate_limits.window_at<now()-make_interval(secs=>p_window) THEN now() ELSE academy_rate_limits.window_at END RETURNING hits INTO n;
 RETURN n<=p_limit; END $$;
CREATE FUNCTION public.academy_claim_outbox(p_session text) RETURNS SETOF public.academy_outbox LANGUAGE sql SET search_path='' AS $$
 UPDATE public.academy_outbox SET state='sending',attempts=attempts+1,first_attempt_at=coalesce(first_attempt_at,now()),lease_until=now()+interval '2 minutes',lease_token=gen_random_uuid()
 WHERE id IN (SELECT id FROM public.academy_outbox WHERE session_id=p_session AND (state='pending' OR (state='sending' AND lease_until<now()))
 AND (first_attempt_at IS NULL OR first_attempt_at>now()-interval '23 hours') FOR UPDATE SKIP LOCKED) RETURNING *;
$$;
-- Only trusted backend processes can record purchases, adjustments, or claim side effects.
REVOKE ALL ON FUNCTION public.academy_record_purchase(jsonb,text),public.academy_apply_adjustment(text,text,integer,text,bigint),public.academy_rate_limit(text,integer,integer),public.academy_claim_outbox(text) FROM PUBLIC,anon,authenticated;
GRANT EXECUTE ON FUNCTION public.academy_record_purchase(jsonb,text),public.academy_apply_adjustment(text,text,integer,text,bigint),public.academy_rate_limit(text,integer,integer),public.academy_claim_outbox(text) TO service_role;

CREATE FUNCTION academy_private.get_lesson(p_module text,p_lesson text) RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path='' AS $$
DECLARE lesson public.interactive_lessons; safe_slides jsonb;
BEGIN
 IF NOT academy_private.can_access(p_module) THEN RAISE EXCEPTION 'Access denied' USING ERRCODE='42501'; END IF;
 SELECT * INTO lesson FROM public.interactive_lessons WHERE module_id=p_module AND lesson_id=p_lesson;
 IF NOT FOUND THEN RETURN NULL; END IF;
 SELECT coalesce(jsonb_agg(CASE WHEN s ? 'checkpoint' THEN s||jsonb_build_object('checkpoint',(s->'checkpoint')-'correctIndex'-'explanation') ELSE s END ORDER BY ord),'[]')
 INTO safe_slides FROM jsonb_array_elements(lesson.slides) WITH ORDINALITY AS a(s,ord);
 RETURN jsonb_build_object('id',lesson.id,'title',lesson.title,'subtitle',lesson.subtitle,'duration',lesson.duration,'slides',safe_slides);
END $$;
CREATE FUNCTION public.academy_get_lesson(p_module text,p_lesson text) RETURNS jsonb LANGUAGE sql SECURITY INVOKER SET search_path='' AS $$ SELECT academy_private.get_lesson(p_module,p_lesson); $$;

CREATE FUNCTION academy_private.get_quiz(p_module text,p_lesson text) RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path='' AS $$ BEGIN
 IF NOT academy_private.can_access(p_module) THEN RAISE EXCEPTION 'Access denied' USING ERRCODE='42501'; END IF;
 RETURN (SELECT coalesce(jsonb_agg(jsonb_build_object('id',id,'question',question,'options',options) ORDER BY order_index,id),'[]') FROM public.lesson_quizzes WHERE module_id=p_module AND lesson_id=p_lesson);
END $$;
CREATE FUNCTION public.academy_get_quiz(p_module text,p_lesson text) RETURNS jsonb LANGUAGE sql SECURITY INVOKER SET search_path='' AS $$ SELECT academy_private.get_quiz(p_module,p_lesson); $$;

CREATE FUNCTION academy_private.submit_quiz(p_module text,p_lesson text,p_answers jsonb,p_attempt uuid) RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path='' AS $$
DECLARE q record; count_q integer; score_q integer:=0; a integer; result_q jsonb:='[]'; prev public.academy_quiz_attempts; result_all jsonb;
BEGIN
 IF auth.uid() IS NULL OR NOT academy_private.can_access(p_module) THEN RAISE EXCEPTION 'Access denied' USING ERRCODE='42501'; END IF;
 PERFORM pg_advisory_xact_lock(hashtextextended(p_attempt::text,0));
 SELECT * INTO prev FROM public.academy_quiz_attempts WHERE id=p_attempt;
 IF FOUND THEN IF prev.user_id<>(SELECT auth.uid()) OR prev.module_id<>p_module OR prev.lesson_id<>p_lesson OR prev.answers<>p_answers THEN RAISE EXCEPTION 'Attempt conflict'; END IF; RETURN prev.result; END IF;
 IF NOT public.academy_rate_limit('quiz:'||auth.uid()::text,30,3600) THEN RAISE EXCEPTION 'Too many attempts'; END IF;
 SELECT count(*) INTO count_q FROM public.lesson_quizzes WHERE module_id=p_module AND lesson_id=p_lesson;
 IF count_q=0 OR jsonb_typeof(p_answers) IS DISTINCT FROM 'object' OR (SELECT count(*) FROM jsonb_object_keys(p_answers))<>count_q THEN RAISE EXCEPTION 'Answer every question'; END IF;
 FOR q IN SELECT * FROM public.lesson_quizzes WHERE module_id=p_module AND lesson_id=p_lesson ORDER BY order_index,id LOOP
 IF NOT p_answers ? q.id::text OR jsonb_typeof(p_answers->q.id::text)<>'number' THEN RAISE EXCEPTION 'Invalid answer'; END IF;
 a:=(p_answers->>q.id::text)::integer;
 IF a<0 OR a>=jsonb_array_length(q.options) THEN RAISE EXCEPTION 'Invalid option'; END IF;
 IF a=q.correct_index THEN score_q:=score_q+1; END IF;
 result_q:=result_q||jsonb_build_array(jsonb_build_object('id',q.id,'correctIndex',q.correct_index,'explanation',q.explanation,'correct',a=q.correct_index));
 END LOOP;
 result_all:=jsonb_build_object('score',score_q,'total',count_q,'feedback',result_q);
 INSERT INTO public.academy_quiz_attempts VALUES(p_attempt,auth.uid(),p_module,p_lesson,score_q,count_q,p_answers,result_all,now());
 INSERT INTO public.pdf_progress(user_id,module_id,lesson_id,quiz_score,quiz_total) VALUES(auth.uid(),p_module,p_lesson,score_q,count_q)
 ON CONFLICT(user_id,module_id,lesson_id) DO UPDATE SET quiz_score=EXCLUDED.quiz_score,quiz_total=EXCLUDED.quiz_total,updated_at=now();
 RETURN result_all;
END $$;
CREATE FUNCTION public.academy_submit_quiz(p_module text,p_lesson text,p_answers jsonb,p_attempt uuid) RETURNS jsonb LANGUAGE sql SECURITY INVOKER SET search_path='' AS $$ SELECT academy_private.submit_quiz(p_module,p_lesson,p_answers,p_attempt); $$;

CREATE FUNCTION academy_private.checkpoint(p_module text,p_lesson text,p_slide text,p_answer integer) RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path='' AS $$ DECLARE cp jsonb; BEGIN
 IF NOT academy_private.can_access(p_module) THEN RAISE EXCEPTION 'Access denied' USING ERRCODE='42501'; END IF;
 SELECT s->'checkpoint' INTO cp FROM public.interactive_lessons l CROSS JOIN LATERAL jsonb_array_elements(l.slides) s WHERE l.module_id=p_module AND l.lesson_id=p_lesson AND s->>'id'=p_slide;
 IF cp IS NULL OR p_answer IS NULL OR p_answer<0 OR p_answer>=jsonb_array_length(cp->'options') THEN RAISE EXCEPTION 'Invalid checkpoint'; END IF;
 RETURN jsonb_build_object('correct',p_answer=(cp->>'correctIndex')::integer,'correctIndex',cp->'correctIndex','explanation',cp->'explanation');
END $$;
CREATE FUNCTION public.academy_answer_checkpoint(p_module text,p_lesson text,p_slide text,p_answer integer) RETURNS jsonb LANGUAGE sql SECURITY INVOKER SET search_path='' AS $$ SELECT academy_private.checkpoint(p_module,p_lesson,p_slide,p_answer); $$;

REVOKE ALL ON FUNCTION academy_private.get_lesson(text,text),academy_private.get_quiz(text,text),academy_private.submit_quiz(text,text,jsonb,uuid),academy_private.checkpoint(text,text,text,integer),public.academy_get_lesson(text,text),public.academy_get_quiz(text,text),public.academy_submit_quiz(text,text,jsonb,uuid),public.academy_answer_checkpoint(text,text,text,integer) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION academy_private.get_lesson(text,text),academy_private.get_quiz(text,text),academy_private.checkpoint(text,text,text,integer),public.academy_get_lesson(text,text),public.academy_get_quiz(text,text),public.academy_answer_checkpoint(text,text,text,integer) TO anon,authenticated,service_role;
GRANT EXECUTE ON FUNCTION academy_private.submit_quiz(text,text,jsonb,uuid),public.academy_submit_quiz(text,text,jsonb,uuid) TO authenticated,service_role;
-- Browsers may save reading position, never assessment scores.
REVOKE INSERT,UPDATE ON public.pdf_progress FROM authenticated;
GRANT INSERT(user_id,module_id,lesson_id,page_number,total_pages,completed,page_times,updated_at),UPDATE(page_number,total_pages,completed,page_times,updated_at) ON public.pdf_progress TO authenticated;
