-- This exact historical academy price was verified against a paid EUR 14.99
-- Checkout with matching metadata/client reference and an existing profile.
-- Preserve it for reconciliation only; do not offer it for new checkout.
INSERT INTO public.academy_prices(price_id,tier_id,livemode,amount_cents,checkout_enabled,historical)
VALUES('price_1Tt5YBBAV4zTG6a3dOmyhgop','systems-10',true,1499,false,true);

-- Existing email claims are treated as sent to avoid re-emailing customers.
ALTER TABLE public.email_logs ADD COLUMN delivery_state text NOT NULL DEFAULT 'sent';
ALTER TABLE public.email_logs ADD COLUMN first_attempt_at timestamptz;
ALTER TABLE public.email_logs ADD COLUMN lease_until timestamptz;
ALTER TABLE public.email_logs ADD COLUMN lease_token uuid;
CREATE FUNCTION public.academy_claim_email(p_user uuid,p_type text) RETURNS uuid
LANGUAGE plpgsql SECURITY INVOKER SET search_path='' AS $$
DECLARE token uuid;
BEGIN
 IF p_type NOT IN ('welcome','abandoned_cart','downsell') THEN RAISE EXCEPTION 'Invalid email type'; END IF;
 INSERT INTO public.email_logs(user_id,email_type,delivery_state,first_attempt_at,lease_until,lease_token)
 VALUES(p_user,p_type,'sending',now(),now()+interval '2 minutes',gen_random_uuid())
 ON CONFLICT(user_id,email_type) DO UPDATE SET delivery_state='sending',
 lease_until=now()+interval '2 minutes',lease_token=gen_random_uuid()
 WHERE email_logs.delivery_state IN ('pending','sending')
 AND (email_logs.lease_until IS NULL OR email_logs.lease_until<now())
 AND email_logs.first_attempt_at>now()-interval '23 hours'
 RETURNING lease_token INTO token;
 RETURN token;
END $$;
CREATE FUNCTION public.academy_finish_email(p_user uuid,p_type text,p_lease uuid,p_sent boolean) RETURNS void
LANGUAGE sql SECURITY INVOKER SET search_path='' AS $$
 UPDATE public.email_logs SET delivery_state=CASE WHEN p_sent THEN 'sent' ELSE 'pending' END,lease_until=NULL
 WHERE user_id=p_user AND email_type=p_type AND lease_token=p_lease;
$$;
REVOKE ALL ON FUNCTION public.academy_claim_email(uuid,text),public.academy_finish_email(uuid,text,uuid,boolean) FROM PUBLIC,anon,authenticated;
GRANT EXECUTE ON FUNCTION public.academy_claim_email(uuid,text),public.academy_finish_email(uuid,text,uuid,boolean) TO service_role;
CREATE INDEX academy_prices_tier_idx ON public.academy_prices(tier_id);
CREATE INDEX academy_outbox_user_idx ON public.academy_outbox(user_id);
