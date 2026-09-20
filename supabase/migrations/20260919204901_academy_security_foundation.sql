-- Non-destructive foundation. All snapshots and legacy grants are private/server-owned.
SET lock_timeout = '5s';
CREATE SCHEMA IF NOT EXISTS academy_private;
REVOKE ALL ON SCHEMA academy_private FROM PUBLIC;
GRANT USAGE ON SCHEMA academy_private TO anon, authenticated, service_role;

CREATE TABLE academy_private.profile_access_backup AS
 SELECT id, role, has_full_access, unlocked_modules, now() AS captured_at FROM public.profiles;
ALTER TABLE academy_private.profile_access_backup ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON academy_private.profile_access_backup FROM PUBLIC, anon, authenticated;

-- Default is production. A separate staging database may opt into test purchases.
CREATE TABLE academy_private.runtime_config (
 singleton boolean PRIMARY KEY DEFAULT true CHECK(singleton), livemode boolean NOT NULL DEFAULT true
);
INSERT INTO academy_private.runtime_config VALUES(true,true);
ALTER TABLE academy_private.runtime_config ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON academy_private.runtime_config FROM PUBLIC,anon,authenticated;
GRANT SELECT ON academy_private.runtime_config TO service_role;
CREATE FUNCTION academy_private.payment_environment() RETURNS boolean LANGUAGE sql STABLE SET search_path=''
 AS $$ SELECT livemode FROM academy_private.runtime_config WHERE singleton; $$;
REVOKE ALL ON FUNCTION academy_private.payment_environment() FROM PUBLIC,anon,authenticated;
GRANT EXECUTE ON FUNCTION academy_private.payment_environment() TO service_role;

CREATE TABLE public.academy_products (
 tier_id text PRIMARY KEY, amount_cents integer NOT NULL CHECK (amount_cents > 0),
 currency text NOT NULL DEFAULT 'eur', module_ids text[] NOT NULL, full_access boolean NOT NULL DEFAULT false
);
INSERT INTO public.academy_products VALUES
 ('systems-10',4900,'eur',ARRAY(SELECT 's01-m'||lpad(i::text,2,'0') FROM generate_series(1,10) i),false),
 ('koprinena-pateka',9900,'eur',ARRAY(SELECT 's01-m'||lpad(i::text,2,'0') FROM generate_series(1,11) i),false),
 ('perfektno-video',9900,'eur',ARRAY(SELECT 's02-m'||lpad(i::text,2,'0') FROM generate_series(1,15) i),false),
 ('marketing-basics',12900,'eur',ARRAY(SELECT 's03-m'||lpad(i::text,2,'0') FROM generate_series(1,20) i),false),
 ('premium-all',24900,'eur',ARRAY(SELECT 's'||lpad(s::text,2,'0')||'-m'||lpad(i::text,2,'0') FROM generate_series(1,3) s CROSS JOIN LATERAL generate_series(1,CASE s WHEN 1 THEN 11 WHEN 2 THEN 15 ELSE 20 END) i),true),
 ('strategic_access',49700,'eur',ARRAY(SELECT 's'||lpad(s::text,2,'0')||'-m'||lpad(i::text,2,'0') FROM generate_series(1,3) s CROSS JOIN LATERAL generate_series(1,CASE s WHEN 1 THEN 11 WHEN 2 THEN 15 ELSE 20 END) i),true);
CREATE TABLE public.academy_prices (
 price_id text PRIMARY KEY, tier_id text NOT NULL REFERENCES public.academy_products,
 livemode boolean NOT NULL, amount_cents integer NOT NULL, currency text NOT NULL DEFAULT 'eur',
 checkout_enabled boolean NOT NULL DEFAULT false, historical boolean NOT NULL DEFAULT false,
 created_at timestamptz NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX academy_one_checkout_price ON public.academy_prices(tier_id,livemode) WHERE checkout_enabled;
CREATE TABLE public.academy_access_grants (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), user_id uuid NOT NULL REFERENCES auth.users,
 source text NOT NULL, module_ids text[] NOT NULL DEFAULT '{}', full_access boolean NOT NULL DEFAULT false,
 needs_review boolean NOT NULL DEFAULT true, revoked_at timestamptz, created_at timestamptz NOT NULL DEFAULT now(),
 UNIQUE(user_id,source)
);
INSERT INTO public.academy_access_grants(user_id,source,module_ids,full_access)
 SELECT id,'legacy-preserved-20260919',ARRAY(SELECT jsonb_array_elements_text(coalesce(unlocked_modules,'[]'))),coalesce(has_full_access,false)
 FROM public.profiles WHERE coalesce(has_full_access,false) OR jsonb_array_length(coalesce(unlocked_modules,'[]'))>0;
ALTER TABLE public.academy_purchases ADD COLUMN livemode boolean NOT NULL DEFAULT true;
ALTER TABLE public.academy_purchases ADD COLUMN price_id text;
ALTER TABLE public.academy_purchases ADD COLUMN needs_review boolean NOT NULL DEFAULT false;

CREATE OR REPLACE FUNCTION academy_private.is_admin() RETURNS boolean
 LANGUAGE sql STABLE SECURITY DEFINER SET search_path = '' AS $$
 SELECT auth.uid() IS NOT NULL AND EXISTS(SELECT 1 FROM public.profiles WHERE id=(SELECT auth.uid()) AND role IN ('admin','super_admin'));
$$;
REVOKE ALL ON FUNCTION academy_private.is_admin() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION academy_private.is_admin() TO anon, authenticated, service_role;

CREATE OR REPLACE FUNCTION academy_private.can_access(p_module text) RETURNS boolean
 LANGUAGE sql STABLE SECURITY DEFINER SET search_path = '' AS $$
 SELECT p_module='s01-m01' OR (auth.uid() IS NOT NULL AND (
 academy_private.is_admin() OR EXISTS(SELECT 1 FROM public.academy_access_grants g WHERE g.user_id=(SELECT auth.uid()) AND g.revoked_at IS NULL AND (g.full_access OR p_module=ANY(g.module_ids)))
 OR EXISTS(SELECT 1 FROM public.academy_purchases p JOIN public.academy_products t USING(tier_id)
 WHERE p.user_id=(SELECT auth.uid()) AND p.livemode=academy_private.payment_environment() AND p.status IN ('paid','partially_refunded') AND (t.full_access OR p_module=ANY(t.module_ids)))));
$$;
REVOKE ALL ON FUNCTION academy_private.can_access(text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION academy_private.can_access(text) TO anon, authenticated, service_role;
CREATE FUNCTION public.academy_has_module_access(p_module text) RETURNS boolean
 LANGUAGE sql STABLE SECURITY INVOKER SET search_path='' AS $$ SELECT academy_private.can_access(p_module); $$;
REVOKE ALL ON FUNCTION public.academy_has_module_access(text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.academy_has_module_access(text) TO anon,authenticated,service_role;

-- Replace overlapping policies rather than layering more permissive OR rules.
DO $$ DECLARE p record; BEGIN
 FOR p IN SELECT * FROM pg_policies WHERE schemaname='public' LOOP
  EXECUTE format('DROP POLICY %I ON public.%I',p.policyname,p.tablename);
 END LOOP;
END $$;
REVOKE ALL ON ALL TABLES IN SCHEMA public FROM anon, authenticated;
GRANT SELECT ON public.profiles TO authenticated;
GRANT INSERT(id,full_name,avatar_url,last_login_at) ON public.profiles TO authenticated;
GRANT UPDATE(full_name,avatar_url,last_login_at,checkout_entered_at,checkout_tier,abandoned_checkout_at,abandoned_checkout_tier,last_opened_lesson) ON public.profiles TO authenticated;
CREATE POLICY profiles_read ON public.profiles FOR SELECT TO authenticated USING(id=(SELECT auth.uid()) OR (SELECT academy_private.is_admin()));
CREATE POLICY profiles_insert ON public.profiles FOR INSERT TO authenticated WITH CHECK(id=(SELECT auth.uid()));
CREATE POLICY profiles_update ON public.profiles FOR UPDATE TO authenticated USING(id=(SELECT auth.uid())) WITH CHECK(id=(SELECT auth.uid()));

CREATE OR REPLACE FUNCTION public.prevent_role_self_escalation() RETURNS trigger
 LANGUAGE plpgsql SECURITY INVOKER SET search_path='' AS $$ BEGIN
 IF current_user IN ('anon','authenticated') AND
 (NEW.role IS DISTINCT FROM OLD.role OR NEW.has_full_access IS DISTINCT FROM OLD.has_full_access OR NEW.unlocked_modules IS DISTINCT FROM OLD.unlocked_modules) THEN
 RAISE EXCEPTION 'Access and role are server controlled' USING ERRCODE='42501'; END IF; RETURN NEW;
END $$;
ALTER FUNCTION public.handle_new_user() SET search_path='';
REVOKE ALL ON FUNCTION public.handle_new_user(), public.prevent_role_self_escalation(), public.set_updated_at() FROM PUBLIC,anon,authenticated;

GRANT SELECT,INSERT,UPDATE,DELETE ON public.interactive_lessons, public.lesson_quizzes TO authenticated;
CREATE POLICY lessons_admin ON public.interactive_lessons FOR ALL TO authenticated USING((SELECT academy_private.is_admin())) WITH CHECK((SELECT academy_private.is_admin()));
CREATE POLICY quizzes_admin ON public.lesson_quizzes FOR ALL TO authenticated USING((SELECT academy_private.is_admin())) WITH CHECK((SELECT academy_private.is_admin()));
-- No raw content or answer keys are exposed to students: use the sanitized RPCs.

DO $$ DECLARE t text; BEGIN
 FOREACH t IN ARRAY ARRAY['academy_products','academy_prices','academy_access_grants'] LOOP
 EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY',t);
 EXECUTE format('GRANT ALL ON public.%I TO service_role',t);
 END LOOP;
 FOREACH t IN ARRAY ARRAY['academy_purchases','academy_access_grants'] LOOP
 EXECUTE format('GRANT SELECT ON public.%I TO authenticated',t);
 EXECUTE format('CREATE POLICY academy_read ON public.%I FOR SELECT TO authenticated USING(user_id=(SELECT auth.uid()) OR (SELECT academy_private.is_admin()))',t);
 END LOOP;
 FOREACH t IN ARRAY ARRAY['video_progress','pdf_progress','checklist_progress','homework'] LOOP
 EXECUTE format('GRANT SELECT,INSERT,UPDATE ON public.%I TO authenticated',t);
 EXECUTE format('CREATE POLICY progress_read ON public.%I FOR SELECT TO authenticated USING(user_id=(SELECT auth.uid()) OR (SELECT academy_private.is_admin()))',t);
 EXECUTE format('CREATE POLICY progress_insert ON public.%I FOR INSERT TO authenticated WITH CHECK(user_id=(SELECT auth.uid()) AND academy_private.can_access(module_id))',t);
 EXECUTE format('CREATE POLICY progress_update ON public.%I FOR UPDATE TO authenticated USING(user_id=(SELECT auth.uid()) OR (SELECT academy_private.is_admin())) WITH CHECK((user_id=(SELECT auth.uid()) AND academy_private.can_access(module_id)) OR (SELECT academy_private.is_admin()))',t);
 END LOOP;
 FOREACH t IN ARRAY ARRAY['news','checklist_customers','course_applications','contact_messages','lead_captures'] LOOP
 EXECUTE format('GRANT SELECT,INSERT,UPDATE,DELETE ON public.%I TO authenticated',t);
 EXECUTE format('CREATE POLICY admin_manage ON public.%I FOR ALL TO authenticated USING((SELECT academy_private.is_admin())) WITH CHECK((SELECT academy_private.is_admin()))',t);
 END LOOP;
 FOREACH t IN ARRAY ARRAY['course_applications','contact_messages','lead_captures'] LOOP
 EXECUTE format('GRANT INSERT ON public.%I TO anon',t);
 EXECUTE format('CREATE POLICY public_submit ON public.%I FOR INSERT TO anon,authenticated WITH CHECK(true)',t);
 END LOOP;
END $$;
GRANT SELECT ON public.news,public.checklists TO anon,authenticated;
CREATE POLICY news_public ON public.news FOR SELECT TO anon,authenticated USING(published);
CREATE POLICY checklists_public ON public.checklists FOR SELECT TO anon,authenticated USING(true);
GRANT SELECT,INSERT,UPDATE ON public.messages TO authenticated;
CREATE POLICY messages_read ON public.messages FOR SELECT TO authenticated USING(user_id=(SELECT auth.uid()) OR (SELECT academy_private.is_admin()));
CREATE POLICY messages_insert ON public.messages FOR INSERT TO authenticated WITH CHECK(user_id=(SELECT auth.uid()) AND reply IS NULL AND replied_at IS NULL);
CREATE POLICY messages_reply ON public.messages FOR UPDATE TO authenticated USING((SELECT academy_private.is_admin())) WITH CHECK((SELECT academy_private.is_admin()));
-- Logs and leads are intentionally server-only, with no client grants.

DO $$ DECLARE p record; BEGIN
 FOR p IN SELECT * FROM pg_policies WHERE schemaname='storage' AND tablename='objects' AND (coalesce(qual,'')||coalesce(with_check,'')) LIKE '%course-pdfs%' LOOP
 EXECUTE format('DROP POLICY %I ON storage.objects',p.policyname);
 END LOOP;
END $$;
CREATE POLICY academy_pdf_read ON storage.objects FOR SELECT TO anon,authenticated USING(bucket_id='course-pdfs' AND academy_private.can_access(split_part(name,'/',1)));
CREATE POLICY academy_pdf_insert ON storage.objects FOR INSERT TO authenticated WITH CHECK(bucket_id='course-pdfs' AND (SELECT academy_private.is_admin()));
CREATE POLICY academy_pdf_update ON storage.objects FOR UPDATE TO authenticated USING(bucket_id='course-pdfs' AND (SELECT academy_private.is_admin())) WITH CHECK(bucket_id='course-pdfs' AND (SELECT academy_private.is_admin()));
CREATE POLICY academy_pdf_delete ON storage.objects FOR DELETE TO authenticated USING(bucket_id='course-pdfs' AND (SELECT academy_private.is_admin()));

-- Exact redundant UNIQUE constraint/index confirmed in the captured catalog.
DO $$ BEGIN
 IF EXISTS (
   SELECT 1 FROM pg_constraint a JOIN pg_constraint b ON a.conrelid=b.conrelid AND a.conkey=b.conkey
   WHERE a.conrelid='public.pdf_progress'::regclass AND a.conname='pdf_progress_user_module_lesson_key'
     AND b.conname<>a.conname AND a.contype='u' AND b.contype='u'
 ) THEN ALTER TABLE public.pdf_progress DROP CONSTRAINT pdf_progress_user_module_lesson_key; END IF;
END $$;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public REVOKE ALL ON TABLES FROM anon,authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public REVOKE EXECUTE ON FUNCTIONS FROM PUBLIC;
CREATE INDEX IF NOT EXISTS academy_grants_user ON public.academy_access_grants(user_id) WHERE revoked_at IS NULL;
CREATE INDEX IF NOT EXISTS homework_user_idx ON public.homework(user_id);
CREATE INDEX IF NOT EXISTS video_progress_user_idx ON public.video_progress(user_id);
