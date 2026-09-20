-- Baseline captured from project plxqbbgjojxfnkgotrba, 2026-09-19.
-- Existing projects are left intact. Fresh Supabase environments replay the captured schema.
-- Must be followed by the security migration in the same deployment.
DO $baseline$
BEGIN
 IF to_regclass('public.profiles') IS NULL THEN
  EXECUTE $ddl$CREATE TABLE public.profiles (
"id" uuid NOT NULL,
"full_name" text,
"avatar_url" text,
"created_at" timestamp with time zone DEFAULT now(),
"role" text DEFAULT 'user'::text NOT NULL,
"unlocked_modules" jsonb DEFAULT '[]'::jsonb,
"has_full_access" boolean DEFAULT false,
"welcome_email_sent" boolean DEFAULT false,
"welcome_email_sent_at" timestamp with time zone,
"welcome_email_offer_expires_at" timestamp with time zone,
"last_login_at" timestamp with time zone,
"downsell_email_sent" boolean DEFAULT false,
"downsell_email_sent_at" timestamp with time zone,
"checkout_entered_at" timestamp with time zone,
"checkout_tier" text,
"abandoned_cart_email_sent" boolean DEFAULT false,
"abandoned_cart_email_sent_at" timestamp with time zone,
"abandoned_checkout_at" timestamp with time zone,
"abandoned_checkout_tier" text,
"last_opened_lesson" jsonb
);$ddl$;
  EXECUTE $ddl$CREATE TABLE public.video_progress (
"id" uuid DEFAULT gen_random_uuid() NOT NULL,
"user_id" uuid NOT NULL,
"video_id" text NOT NULL,
"module_id" text NOT NULL,
"watched_seconds" integer DEFAULT 0,
"completed" boolean DEFAULT false,
"updated_at" timestamp with time zone DEFAULT now()
);$ddl$;
  EXECUTE $ddl$CREATE TABLE public.homework (
"id" uuid DEFAULT gen_random_uuid() NOT NULL,
"user_id" uuid NOT NULL,
"module_id" text NOT NULL,
"content" text NOT NULL,
"submitted_at" timestamp with time zone DEFAULT now(),
"status" text DEFAULT 'pending'::text
);$ddl$;
  EXECUTE $ddl$CREATE TABLE public.news (
"id" uuid DEFAULT gen_random_uuid() NOT NULL,
"title" text NOT NULL,
"category" text DEFAULT 'Агенция'::text NOT NULL,
"date" date DEFAULT CURRENT_DATE NOT NULL,
"summary" text NOT NULL,
"content" text DEFAULT ''::text,
"published" boolean DEFAULT false NOT NULL,
"image_url" text DEFAULT ''::text,
"created_at" timestamp with time zone DEFAULT now(),
"updated_at" timestamp with time zone DEFAULT now()
);$ddl$;
  EXECUTE $ddl$CREATE TABLE public.course_applications (
"id" uuid DEFAULT gen_random_uuid() NOT NULL,
"first_name" text NOT NULL,
"last_name" text NOT NULL,
"email" text NOT NULL,
"phone" text DEFAULT ''::text,
"message" text DEFAULT ''::text,
"interest" text DEFAULT ''::text,
"status" text DEFAULT 'нова'::text NOT NULL,
"created_at" timestamp with time zone DEFAULT now()
);$ddl$;
  EXECUTE $ddl$CREATE SEQUENCE IF NOT EXISTS public.checklist_customers_id_seq;$ddl$;
  EXECUTE $ddl$CREATE TABLE public.checklist_customers (
"id" integer DEFAULT nextval('checklist_customers_id_seq'::regclass) NOT NULL,
"email" text NOT NULL,
"name" text NOT NULL,
"password" text NOT NULL,
"is_active" boolean DEFAULT true,
"created_at" timestamp with time zone DEFAULT now(),
"tier" text,
"access_code" text,
"selected_modules" jsonb DEFAULT '[]'::jsonb
);$ddl$;
  EXECUTE $ddl$CREATE SEQUENCE IF NOT EXISTS public.checklists_id_seq;$ddl$;
  EXECUTE $ddl$CREATE TABLE public.checklists (
"id" integer DEFAULT nextval('checklists_id_seq'::regclass) NOT NULL,
"num" text NOT NULL,
"icon" text NOT NULL,
"title" text NOT NULL,
"intro" text NOT NULL,
"tier" text DEFAULT 'complete'::text NOT NULL,
"items" jsonb DEFAULT '[]'::jsonb NOT NULL,
"created_at" timestamp with time zone DEFAULT now()
);$ddl$;
  EXECUTE $ddl$CREATE TABLE public.messages (
"id" uuid DEFAULT gen_random_uuid() NOT NULL,
"user_id" uuid NOT NULL,
"subject" text NOT NULL,
"content" text NOT NULL,
"reply" text,
"is_read" boolean DEFAULT false,
"created_at" timestamp with time zone DEFAULT now(),
"replied_at" timestamp with time zone
);$ddl$;
  EXECUTE $ddl$CREATE TABLE public.pdf_progress (
"id" uuid DEFAULT gen_random_uuid() NOT NULL,
"user_id" uuid NOT NULL,
"module_id" text NOT NULL,
"lesson_id" text NOT NULL,
"page_number" integer DEFAULT 1 NOT NULL,
"total_pages" integer DEFAULT 0 NOT NULL,
"updated_at" timestamp with time zone DEFAULT now(),
"completed" boolean DEFAULT false,
"quiz_score" integer,
"quiz_total" integer,
"page_times" jsonb DEFAULT '{}'::jsonb
);$ddl$;
  EXECUTE $ddl$CREATE TABLE public.lesson_quizzes (
"id" uuid DEFAULT gen_random_uuid() NOT NULL,
"module_id" text NOT NULL,
"lesson_id" text NOT NULL,
"question" text NOT NULL,
"options" jsonb DEFAULT '[]'::jsonb NOT NULL,
"correct_index" integer DEFAULT 0 NOT NULL,
"explanation" text,
"order_index" integer DEFAULT 0,
"created_at" timestamp with time zone DEFAULT now(),
"updated_at" timestamp with time zone DEFAULT now()
);$ddl$;
  EXECUTE $ddl$CREATE TABLE public.checklist_progress (
"id" uuid DEFAULT gen_random_uuid() NOT NULL,
"user_id" uuid NOT NULL,
"module_id" text NOT NULL,
"topic_id" integer NOT NULL,
"item_id" integer NOT NULL,
"completed" boolean DEFAULT false,
"updated_at" timestamp with time zone DEFAULT now()
);$ddl$;
  EXECUTE $ddl$CREATE TABLE public.interactive_lessons (
"id" uuid DEFAULT gen_random_uuid() NOT NULL,
"module_id" text NOT NULL,
"lesson_id" text NOT NULL,
"title" text NOT NULL,
"subtitle" text,
"duration" text DEFAULT '20 мин'::text NOT NULL,
"slides" jsonb DEFAULT '[]'::jsonb NOT NULL,
"created_at" timestamp with time zone DEFAULT now(),
"updated_at" timestamp with time zone DEFAULT now()
);$ddl$;
  EXECUTE $ddl$CREATE TABLE public.email_logs (
"id" bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
"user_id" uuid NOT NULL,
"email_type" text NOT NULL,
"created_at" timestamp with time zone DEFAULT now() NOT NULL
);$ddl$;
  EXECUTE $ddl$CREATE TABLE public.meta_capi_logs (
"id" uuid DEFAULT gen_random_uuid() NOT NULL,
"event_name" text NOT NULL,
"event_id" text NOT NULL,
"stripe_session_id" text,
"customer_email" text,
"amount" numeric,
"response_status" integer,
"response_body" jsonb,
"created_at" timestamp with time zone DEFAULT now()
);$ddl$;
  EXECUTE $ddl$CREATE TABLE public.contact_messages (
"id" uuid DEFAULT gen_random_uuid() NOT NULL,
"first_name" text,
"last_name" text,
"email" text NOT NULL,
"phone" text,
"service" text,
"message" text,
"created_at" timestamp with time zone DEFAULT now()
);$ddl$;
  EXECUTE $ddl$CREATE TABLE public.lead_captures (
"id" uuid DEFAULT gen_random_uuid() NOT NULL,
"email" text NOT NULL,
"full_name" text,
"created_at" timestamp with time zone DEFAULT now()
);$ddl$;
  EXECUTE $ddl$CREATE TABLE public.leads (
"id" uuid DEFAULT gen_random_uuid() NOT NULL,
"rank" integer NOT NULL,
"business_name" text NOT NULL,
"category" text,
"sector" text,
"city" text,
"address" text,
"email" text NOT NULL,
"phone" text,
"website" text,
"social_url" text,
"google_maps_url" text,
"latitude" double precision,
"longitude" double precision,
"coordinates_status" text DEFAULT 'manual_review_required'::text NOT NULL,
"coordinates_source_url" text,
"maps_verified_name" text,
"maps_verified_address" text,
"source_website_status" text,
"current_digital_status" text,
"verification_status" text,
"verification_date" date,
"verification_source_url" text,
"recommended_service" text,
"personalization_hook" text,
"email_subject" text,
"email_body" text,
"digital_need_score" smallint,
"commercial_fit_score" smallint,
"contactability_score" smallint,
"locality_score" smallint,
"verification_score" smallint,
"lead_score" smallint,
"priority" text,
"status" text DEFAULT 'new'::text NOT NULL,
"do_not_contact" boolean DEFAULT false NOT NULL,
"email_status" text DEFAULT 'not_sent'::text NOT NULL,
"last_contacted_at" timestamp with time zone,
"source_list" text,
"source_url" text,
"created_at" timestamp with time zone DEFAULT now() NOT NULL,
"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);$ddl$;
  EXECUTE $ddl$CREATE TABLE public.academy_purchases (
"id" uuid DEFAULT gen_random_uuid() NOT NULL,
"user_id" uuid,
"stripe_checkout_session_id" text,
"stripe_payment_intent_id" text,
"tier_id" text NOT NULL,
"amount_paid_cents" integer,
"currency" text DEFAULT 'eur'::text,
"status" text DEFAULT 'paid'::text NOT NULL,
"purchased_at" timestamp with time zone DEFAULT now(),
"refunded_at" timestamp with time zone,
"created_at" timestamp with time zone DEFAULT now(),
"updated_at" timestamp with time zone DEFAULT now()
);$ddl$;
  EXECUTE $ddl$ALTER TABLE public.checklist_progress ADD CONSTRAINT "checklist_progress_pkey" PRIMARY KEY (id);$ddl$;
  EXECUTE $ddl$ALTER TABLE public.profiles ADD CONSTRAINT "profiles_pkey" PRIMARY KEY (id);$ddl$;
  EXECUTE $ddl$ALTER TABLE public.video_progress ADD CONSTRAINT "video_progress_pkey" PRIMARY KEY (id);$ddl$;
  EXECUTE $ddl$ALTER TABLE public.video_progress ADD CONSTRAINT "video_progress_user_id_video_id_key" UNIQUE (user_id, video_id);$ddl$;
  EXECUTE $ddl$ALTER TABLE public.homework ADD CONSTRAINT "homework_status_check" CHECK ((status = ANY (ARRAY['pending'::text, 'reviewed'::text])));$ddl$;
  EXECUTE $ddl$ALTER TABLE public.homework ADD CONSTRAINT "homework_pkey" PRIMARY KEY (id);$ddl$;
  EXECUTE $ddl$ALTER TABLE public.homework ADD CONSTRAINT "homework_user_module_unique" UNIQUE (user_id, module_id);$ddl$;
  EXECUTE $ddl$ALTER TABLE public.news ADD CONSTRAINT "news_pkey" PRIMARY KEY (id);$ddl$;
  EXECUTE $ddl$ALTER TABLE public.course_applications ADD CONSTRAINT "course_applications_pkey" PRIMARY KEY (id);$ddl$;
  EXECUTE $ddl$ALTER TABLE public.checklist_customers ADD CONSTRAINT "checklist_customers_pkey" PRIMARY KEY (id);$ddl$;
  EXECUTE $ddl$ALTER TABLE public.checklist_customers ADD CONSTRAINT "checklist_customers_password_key" UNIQUE (password);$ddl$;
  EXECUTE $ddl$ALTER TABLE public.checklists ADD CONSTRAINT "checklists_pkey" PRIMARY KEY (id);$ddl$;
  EXECUTE $ddl$ALTER TABLE public.messages ADD CONSTRAINT "messages_pkey" PRIMARY KEY (id);$ddl$;
  EXECUTE $ddl$ALTER TABLE public.pdf_progress ADD CONSTRAINT "pdf_progress_pkey" PRIMARY KEY (id);$ddl$;
  EXECUTE $ddl$ALTER TABLE public.pdf_progress ADD CONSTRAINT "pdf_progress_user_id_module_id_lesson_id_key" UNIQUE (user_id, module_id, lesson_id);$ddl$;
  EXECUTE $ddl$ALTER TABLE public.pdf_progress ADD CONSTRAINT "pdf_progress_user_module_lesson_key" UNIQUE (user_id, module_id, lesson_id);$ddl$;
  EXECUTE $ddl$ALTER TABLE public.lesson_quizzes ADD CONSTRAINT "lesson_quizzes_pkey" PRIMARY KEY (id);$ddl$;
  EXECUTE $ddl$ALTER TABLE public.checklist_progress ADD CONSTRAINT "checklist_progress_user_id_module_id_item_id_key" UNIQUE (user_id, module_id, item_id);$ddl$;
  EXECUTE $ddl$ALTER TABLE public.interactive_lessons ADD CONSTRAINT "interactive_lessons_pkey" PRIMARY KEY (id);$ddl$;
  EXECUTE $ddl$ALTER TABLE public.interactive_lessons ADD CONSTRAINT "interactive_lessons_module_id_lesson_id_key" UNIQUE (module_id, lesson_id);$ddl$;
  EXECUTE $ddl$ALTER TABLE public.email_logs ADD CONSTRAINT "email_logs_pkey" PRIMARY KEY (id);$ddl$;
  EXECUTE $ddl$ALTER TABLE public.email_logs ADD CONSTRAINT "email_logs_user_email_type_unique" UNIQUE (user_id, email_type);$ddl$;
  EXECUTE $ddl$ALTER TABLE public.meta_capi_logs ADD CONSTRAINT "meta_capi_logs_pkey" PRIMARY KEY (id);$ddl$;
  EXECUTE $ddl$ALTER TABLE public.contact_messages ADD CONSTRAINT "contact_messages_pkey" PRIMARY KEY (id);$ddl$;
  EXECUTE $ddl$ALTER TABLE public.lead_captures ADD CONSTRAINT "lead_captures_pkey" PRIMARY KEY (id);$ddl$;
  EXECUTE $ddl$ALTER TABLE public.leads ADD CONSTRAINT "leads_rank_check" CHECK ((rank > 0));$ddl$;
  EXECUTE $ddl$ALTER TABLE public.leads ADD CONSTRAINT "leads_coordinates_status_check" CHECK ((coordinates_status = ANY (ARRAY['verified_google_place'::text, 'manual_review_required'::text])));$ddl$;
  EXECUTE $ddl$ALTER TABLE public.leads ADD CONSTRAINT "leads_digital_need_score_check" CHECK (((digital_need_score >= 0) AND (digital_need_score <= 100)));$ddl$;
  EXECUTE $ddl$ALTER TABLE public.leads ADD CONSTRAINT "leads_commercial_fit_score_check" CHECK (((commercial_fit_score >= 0) AND (commercial_fit_score <= 100)));$ddl$;
  EXECUTE $ddl$ALTER TABLE public.leads ADD CONSTRAINT "leads_contactability_score_check" CHECK (((contactability_score >= 0) AND (contactability_score <= 100)));$ddl$;
  EXECUTE $ddl$ALTER TABLE public.leads ADD CONSTRAINT "leads_locality_score_check" CHECK (((locality_score >= 0) AND (locality_score <= 100)));$ddl$;
  EXECUTE $ddl$ALTER TABLE public.leads ADD CONSTRAINT "leads_verification_score_check" CHECK (((verification_score >= 0) AND (verification_score <= 100)));$ddl$;
  EXECUTE $ddl$ALTER TABLE public.leads ADD CONSTRAINT "leads_lead_score_check" CHECK (((lead_score >= 0) AND (lead_score <= 100)));$ddl$;
  EXECUTE $ddl$ALTER TABLE public.leads ADD CONSTRAINT "leads_priority_check" CHECK ((priority = ANY (ARRAY['A'::text, 'B'::text])));$ddl$;
  EXECUTE $ddl$ALTER TABLE public.leads ADD CONSTRAINT "leads_status_check" CHECK ((status = ANY (ARRAY['new'::text, 'reviewed'::text, 'queued'::text, 'contacted'::text, 'replied'::text, 'meeting'::text, 'won'::text, 'lost'::text])));$ddl$;
  EXECUTE $ddl$ALTER TABLE public.leads ADD CONSTRAINT "leads_email_status_check" CHECK ((email_status = ANY (ARRAY['not_sent'::text, 'queued'::text, 'sent'::text, 'delivered'::text, 'bounced'::text, 'replied'::text, 'unsubscribed'::text])));$ddl$;
  EXECUTE $ddl$ALTER TABLE public.leads ADD CONSTRAINT "leads_coordinate_pair_check" CHECK ((((latitude IS NULL) AND (longitude IS NULL)) OR ((latitude IS NOT NULL) AND (longitude IS NOT NULL))));$ddl$;
  EXECUTE $ddl$ALTER TABLE public.leads ADD CONSTRAINT "leads_pkey" PRIMARY KEY (id);$ddl$;
  EXECUTE $ddl$ALTER TABLE public.leads ADD CONSTRAINT "leads_email_key" UNIQUE (email);$ddl$;
  EXECUTE $ddl$ALTER TABLE public.academy_purchases ADD CONSTRAINT "academy_purchases_pkey" PRIMARY KEY (id);$ddl$;
  EXECUTE $ddl$ALTER TABLE public.academy_purchases ADD CONSTRAINT "academy_purchases_stripe_checkout_session_id_key" UNIQUE (stripe_checkout_session_id);$ddl$;
  EXECUTE $ddl$ALTER TABLE public.profiles ADD CONSTRAINT "profiles_id_fkey" FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE;$ddl$;
  EXECUTE $ddl$ALTER TABLE public.video_progress ADD CONSTRAINT "video_progress_user_id_fkey" FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE;$ddl$;
  EXECUTE $ddl$ALTER TABLE public.homework ADD CONSTRAINT "homework_user_id_fkey" FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE;$ddl$;
  EXECUTE $ddl$ALTER TABLE public.messages ADD CONSTRAINT "messages_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id);$ddl$;
  EXECUTE $ddl$ALTER TABLE public.pdf_progress ADD CONSTRAINT "pdf_progress_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;$ddl$;
  EXECUTE $ddl$ALTER TABLE public.checklist_progress ADD CONSTRAINT "checklist_progress_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;$ddl$;
  EXECUTE $ddl$ALTER TABLE public.email_logs ADD CONSTRAINT "email_logs_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;$ddl$;
  EXECUTE $ddl$ALTER TABLE public.academy_purchases ADD CONSTRAINT "academy_purchases_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;$ddl$;
  EXECUTE $ddl$CREATE INDEX idx_lesson_quizzes_module_lesson ON public.lesson_quizzes USING btree (module_id, lesson_id);$ddl$;
  EXECUTE $ddl$CREATE UNIQUE INDEX idx_meta_capi_event_id ON public.meta_capi_logs USING btree (event_id);$ddl$;
  EXECUTE $ddl$CREATE INDEX idx_academy_purchases_user ON public.academy_purchases USING btree (user_id);$ddl$;
  EXECUTE $ddl$CREATE INDEX idx_academy_purchases_pi ON public.academy_purchases USING btree (stripe_payment_intent_id);$ddl$;
  EXECUTE $ddl$CREATE INDEX idx_messages_user_id ON public.messages USING btree (user_id);$ddl$;
  EXECUTE $ddl$CREATE INDEX leads_rank_idx ON public.leads USING btree (rank);$ddl$;
  EXECUTE $ddl$CREATE INDEX leads_priority_score_idx ON public.leads USING btree (priority, lead_score DESC);$ddl$;
  EXECUTE $ddl$CREATE INDEX leads_send_queue_idx ON public.leads USING btree (rank) WHERE ((do_not_contact = false) AND (status = 'reviewed'::text) AND (email_status = 'not_sent'::text));$ddl$;
  EXECUTE $ddl$CREATE INDEX leads_coordinates_idx ON public.leads USING btree (latitude, longitude) WHERE ((latitude IS NOT NULL) AND (longitude IS NOT NULL));$ddl$;
  EXECUTE $ddl$CREATE OR REPLACE FUNCTION public.set_updated_at()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path TO ''
AS $function$
begin
  new.updated_at = now();
  return new;
end;
$function$
;$ddl$;
  EXECUTE $ddl$CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
BEGIN
  INSERT INTO public.profiles (id, full_name, role, created_at)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    'student',
    NOW()
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$function$
;$ddl$;
  EXECUTE $ddl$CREATE OR REPLACE FUNCTION public.prevent_role_self_escalation()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
begin
  if new.role is distinct from old.role then
    if not exists (
      select 1 from profiles
      where id = auth.uid()
      and (role = 'admin' or role = 'super_admin')
    ) then
      raise exception 'Only admins can change role';
    end if;
  end if;
  return new;
end;
$function$
;$ddl$;
  EXECUTE $ddl$CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION handle_new_user();$ddl$;
  EXECUTE $ddl$CREATE TRIGGER enforce_role_change BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION prevent_role_self_escalation();$ddl$;
  EXECUTE $ddl$CREATE TRIGGER leads_set_updated_at BEFORE UPDATE ON public.leads FOR EACH ROW EXECUTE FUNCTION set_updated_at();$ddl$;
  EXECUTE $ddl$ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;$ddl$;
  EXECUTE $ddl$GRANT ALL ON public.profiles TO anon, authenticated, service_role;$ddl$;
  EXECUTE $ddl$ALTER TABLE public.video_progress ENABLE ROW LEVEL SECURITY;$ddl$;
  EXECUTE $ddl$GRANT ALL ON public.video_progress TO anon, authenticated, service_role;$ddl$;
  EXECUTE $ddl$ALTER TABLE public.homework ENABLE ROW LEVEL SECURITY;$ddl$;
  EXECUTE $ddl$GRANT ALL ON public.homework TO anon, authenticated, service_role;$ddl$;
  EXECUTE $ddl$ALTER TABLE public.news ENABLE ROW LEVEL SECURITY;$ddl$;
  EXECUTE $ddl$GRANT ALL ON public.news TO anon, authenticated, service_role;$ddl$;
  EXECUTE $ddl$ALTER TABLE public.course_applications ENABLE ROW LEVEL SECURITY;$ddl$;
  EXECUTE $ddl$GRANT ALL ON public.course_applications TO anon, authenticated, service_role;$ddl$;
  EXECUTE $ddl$ALTER TABLE public.checklist_customers ENABLE ROW LEVEL SECURITY;$ddl$;
  EXECUTE $ddl$GRANT ALL ON public.checklist_customers TO anon, authenticated, service_role;$ddl$;
  EXECUTE $ddl$ALTER TABLE public.checklists ENABLE ROW LEVEL SECURITY;$ddl$;
  EXECUTE $ddl$GRANT ALL ON public.checklists TO anon, authenticated, service_role;$ddl$;
  EXECUTE $ddl$ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;$ddl$;
  EXECUTE $ddl$GRANT ALL ON public.messages TO anon, authenticated, service_role;$ddl$;
  EXECUTE $ddl$ALTER TABLE public.pdf_progress ENABLE ROW LEVEL SECURITY;$ddl$;
  EXECUTE $ddl$GRANT ALL ON public.pdf_progress TO anon, authenticated, service_role;$ddl$;
  EXECUTE $ddl$ALTER TABLE public.lesson_quizzes ENABLE ROW LEVEL SECURITY;$ddl$;
  EXECUTE $ddl$GRANT ALL ON public.lesson_quizzes TO anon, authenticated, service_role;$ddl$;
  EXECUTE $ddl$ALTER TABLE public.checklist_progress ENABLE ROW LEVEL SECURITY;$ddl$;
  EXECUTE $ddl$GRANT ALL ON public.checklist_progress TO anon, authenticated, service_role;$ddl$;
  EXECUTE $ddl$ALTER TABLE public.interactive_lessons ENABLE ROW LEVEL SECURITY;$ddl$;
  EXECUTE $ddl$GRANT ALL ON public.interactive_lessons TO anon, authenticated, service_role;$ddl$;
  EXECUTE $ddl$ALTER TABLE public.email_logs ENABLE ROW LEVEL SECURITY;$ddl$;
  EXECUTE $ddl$GRANT ALL ON public.email_logs TO anon, authenticated, service_role;$ddl$;
  EXECUTE $ddl$ALTER TABLE public.meta_capi_logs ENABLE ROW LEVEL SECURITY;$ddl$;
  EXECUTE $ddl$GRANT ALL ON public.meta_capi_logs TO anon, authenticated, service_role;$ddl$;
  EXECUTE $ddl$ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;$ddl$;
  EXECUTE $ddl$GRANT ALL ON public.contact_messages TO anon, authenticated, service_role;$ddl$;
  EXECUTE $ddl$ALTER TABLE public.lead_captures ENABLE ROW LEVEL SECURITY;$ddl$;
  EXECUTE $ddl$GRANT ALL ON public.lead_captures TO anon, authenticated, service_role;$ddl$;
  EXECUTE $ddl$ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;$ddl$;
  EXECUTE $ddl$GRANT ALL ON public.leads TO anon, authenticated, service_role;$ddl$;
  EXECUTE $ddl$ALTER TABLE public.academy_purchases ENABLE ROW LEVEL SECURITY;$ddl$;
  EXECUTE $ddl$GRANT ALL ON public.academy_purchases TO anon, authenticated, service_role;$ddl$;
  EXECUTE $ddl$GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO service_role;$ddl$;
  EXECUTE $ddl$CREATE POLICY "Users can view own profile" ON public.profiles AS PERMISSIVE FOR SELECT TO "public" USING ((auth.uid() = id));$ddl$;
  EXECUTE $ddl$CREATE POLICY "Users can update own profile" ON public.profiles AS PERMISSIVE FOR UPDATE TO "public" USING ((auth.uid() = id));$ddl$;
  EXECUTE $ddl$CREATE POLICY "Users can insert own profile" ON public.profiles AS PERMISSIVE FOR INSERT TO "public" WITH CHECK ((auth.uid() = id));$ddl$;
  EXECUTE $ddl$CREATE POLICY "profiles_select_own" ON public.profiles AS PERMISSIVE FOR SELECT TO "public" USING ((auth.uid() = id));$ddl$;
  EXECUTE $ddl$CREATE POLICY "profiles_insert_own" ON public.profiles AS PERMISSIVE FOR INSERT TO "public" WITH CHECK ((auth.uid() = id));$ddl$;
  EXECUTE $ddl$CREATE POLICY "profiles_update_own" ON public.profiles AS PERMISSIVE FOR UPDATE TO "public" USING ((auth.uid() = id)) WITH CHECK ((auth.uid() = id));$ddl$;
  EXECUTE $ddl$CREATE POLICY "video_progress_select_own" ON public.video_progress AS PERMISSIVE FOR SELECT TO "public" USING ((auth.uid() = user_id));$ddl$;
  EXECUTE $ddl$CREATE POLICY "video_progress_insert_own" ON public.video_progress AS PERMISSIVE FOR INSERT TO "public" WITH CHECK ((auth.uid() = user_id));$ddl$;
  EXECUTE $ddl$CREATE POLICY "video_progress_update_own" ON public.video_progress AS PERMISSIVE FOR UPDATE TO "public" USING ((auth.uid() = user_id)) WITH CHECK ((auth.uid() = user_id));$ddl$;
  EXECUTE $ddl$CREATE POLICY "homework_select_own" ON public.homework AS PERMISSIVE FOR SELECT TO "public" USING ((auth.uid() = user_id));$ddl$;
  EXECUTE $ddl$CREATE POLICY "homework_insert_own" ON public.homework AS PERMISSIVE FOR INSERT TO "public" WITH CHECK ((auth.uid() = user_id));$ddl$;
  EXECUTE $ddl$CREATE POLICY "homework_update_own" ON public.homework AS PERMISSIVE FOR UPDATE TO "public" USING ((auth.uid() = user_id)) WITH CHECK ((auth.uid() = user_id));$ddl$;
  EXECUTE $ddl$CREATE POLICY "Anyone can insert application" ON public.course_applications AS PERMISSIVE FOR INSERT TO "public" WITH CHECK (true);$ddl$;
  EXECUTE $ddl$CREATE POLICY "Authenticated users can read applications" ON public.course_applications AS PERMISSIVE FOR SELECT TO "public" USING ((auth.role() = 'authenticated'::text));$ddl$;
  EXECUTE $ddl$CREATE POLICY "Authenticated users can update applications" ON public.course_applications AS PERMISSIVE FOR UPDATE TO "public" USING ((auth.role() = 'authenticated'::text));$ddl$;
  EXECUTE $ddl$CREATE POLICY "Allow public read" ON public.checklists AS PERMISSIVE FOR SELECT TO "public" USING (true);$ddl$;
  EXECUTE $ddl$CREATE POLICY "Users can read all messages" ON public.messages AS PERMISSIVE FOR SELECT TO "authenticated" USING (true);$ddl$;
  EXECUTE $ddl$CREATE POLICY "Users can insert messages" ON public.messages AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((auth.uid() = user_id));$ddl$;
  EXECUTE $ddl$CREATE POLICY "Users can update messages" ON public.messages AS PERMISSIVE FOR UPDATE TO "authenticated" USING (true) WITH CHECK (true);$ddl$;
  EXECUTE $ddl$CREATE POLICY "Allow authenticated read course-pdfs" ON storage.objects AS PERMISSIVE FOR SELECT TO "authenticated" USING ((bucket_id = 'course-pdfs'::text));$ddl$;
  EXECUTE $ddl$CREATE POLICY "Allow admin upload course-pdfs" ON storage.objects AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK (((bucket_id = 'course-pdfs'::text) AND (EXISTS ( SELECT 1
   FROM profiles
  WHERE ((profiles.id = auth.uid()) AND (profiles.role = ANY (ARRAY['admin'::text, 'super_admin'::text])))))));$ddl$;
  EXECUTE $ddl$CREATE POLICY "Allow admin update course-pdfs" ON storage.objects AS PERMISSIVE FOR UPDATE TO "authenticated" USING (((bucket_id = 'course-pdfs'::text) AND (EXISTS ( SELECT 1
   FROM profiles
  WHERE ((profiles.id = auth.uid()) AND (profiles.role = ANY (ARRAY['admin'::text, 'super_admin'::text])))))));$ddl$;
  EXECUTE $ddl$CREATE POLICY "Allow admin delete course-pdfs" ON storage.objects AS PERMISSIVE FOR DELETE TO "authenticated" USING (((bucket_id = 'course-pdfs'::text) AND (EXISTS ( SELECT 1
   FROM profiles
  WHERE ((profiles.id = auth.uid()) AND (profiles.role = ANY (ARRAY['admin'::text, 'super_admin'::text])))))));$ddl$;
  EXECUTE $ddl$CREATE POLICY "Users can read own pdf progress" ON public.pdf_progress AS PERMISSIVE FOR SELECT TO "public" USING ((auth.uid() = user_id));$ddl$;
  EXECUTE $ddl$CREATE POLICY "Users can insert own pdf progress" ON public.pdf_progress AS PERMISSIVE FOR INSERT TO "public" WITH CHECK ((auth.uid() = user_id));$ddl$;
  EXECUTE $ddl$CREATE POLICY "Users can update own pdf progress" ON public.pdf_progress AS PERMISSIVE FOR UPDATE TO "public" USING ((auth.uid() = user_id));$ddl$;
  EXECUTE $ddl$CREATE POLICY "Users can delete own pdf progress" ON public.pdf_progress AS PERMISSIVE FOR DELETE TO "public" USING ((auth.uid() = user_id));$ddl$;
  EXECUTE $ddl$CREATE POLICY "Users can manage own checklist progress" ON public.checklist_progress AS PERMISSIVE FOR ALL TO "public" USING ((auth.uid() = user_id)) WITH CHECK ((auth.uid() = user_id));$ddl$;
  EXECUTE $ddl$CREATE POLICY "Users can update own messages strict" ON public.messages AS PERMISSIVE FOR UPDATE TO "public" USING ((auth.uid() = user_id)) WITH CHECK ((auth.uid() = user_id));$ddl$;
  EXECUTE $ddl$CREATE POLICY "Anyone can read lessons" ON public.interactive_lessons AS PERMISSIVE FOR SELECT TO "public" USING (true);$ddl$;
  EXECUTE $ddl$CREATE POLICY "Admin can manage lessons" ON public.interactive_lessons AS PERMISSIVE FOR ALL TO "public" USING ((EXISTS ( SELECT 1
   FROM profiles
  WHERE ((profiles.id = auth.uid()) AND ((profiles.role = 'admin'::text) OR (profiles.role = 'super_admin'::text))))));$ddl$;
  EXECUTE $ddl$CREATE POLICY "restrict_read_own_or_admin" ON public.messages AS RESTRICTIVE FOR SELECT TO "public" USING (((auth.uid() = user_id) OR (EXISTS ( SELECT 1
   FROM profiles
  WHERE ((profiles.id = auth.uid()) AND ((profiles.role = 'admin'::text) OR (profiles.role = 'super_admin'::text)))))));$ddl$;
  EXECUTE $ddl$CREATE POLICY "restrict_update_own_or_admin" ON public.messages AS RESTRICTIVE FOR UPDATE TO "public" USING (((auth.uid() = user_id) OR (EXISTS ( SELECT 1
   FROM profiles
  WHERE ((profiles.id = auth.uid()) AND ((profiles.role = 'admin'::text) OR (profiles.role = 'super_admin'::text)))))));$ddl$;
  EXECUTE $ddl$CREATE POLICY "restrict_read_admin" ON public.course_applications AS RESTRICTIVE FOR SELECT TO "public" USING ((EXISTS ( SELECT 1
   FROM profiles
  WHERE ((profiles.id = auth.uid()) AND ((profiles.role = 'admin'::text) OR (profiles.role = 'super_admin'::text))))));$ddl$;
  EXECUTE $ddl$CREATE POLICY "Public can read news" ON public.news AS PERMISSIVE FOR SELECT TO "public" USING ((published = true));$ddl$;
  EXECUTE $ddl$CREATE POLICY "Public can read quizzes" ON public.lesson_quizzes AS PERMISSIVE FOR SELECT TO "public" USING (true);$ddl$;
  EXECUTE $ddl$CREATE POLICY "academy_purchases_read_own" ON public.academy_purchases AS PERMISSIVE FOR SELECT TO "public" USING ((auth.uid() = user_id));$ddl$;
  EXECUTE $ddl$CREATE POLICY "restrict_update_admin" ON public.course_applications AS RESTRICTIVE FOR UPDATE TO "public" USING ((EXISTS ( SELECT 1
   FROM profiles
  WHERE ((profiles.id = auth.uid()) AND ((profiles.role = 'admin'::text) OR (profiles.role = 'super_admin'::text))))));$ddl$;
  EXECUTE $ddl$CREATE POLICY "Users can manage own homework" ON public.homework AS PERMISSIVE FOR ALL TO "public" USING (((auth.uid() = user_id) OR (EXISTS ( SELECT 1
   FROM profiles
  WHERE ((profiles.id = auth.uid()) AND ((profiles.role = 'admin'::text) OR (profiles.role = 'super_admin'::text)))))));$ddl$;
  EXECUTE $ddl$CREATE POLICY "Allow delete for authenticated" ON public.contact_messages AS PERMISSIVE FOR DELETE TO "public" USING ((auth.role() = 'authenticated'::text));$ddl$;
  EXECUTE $ddl$CREATE POLICY "Users can manage own video progress" ON public.video_progress AS PERMISSIVE FOR ALL TO "public" USING (((auth.uid() = user_id) OR (EXISTS ( SELECT 1
   FROM profiles
  WHERE ((profiles.id = auth.uid()) AND ((profiles.role = 'admin'::text) OR (profiles.role = 'super_admin'::text)))))));$ddl$;
  EXECUTE $ddl$CREATE POLICY "Service role can manage email_logs" ON public.email_logs AS PERMISSIVE FOR ALL TO "public" USING (true) WITH CHECK (true);$ddl$;
  EXECUTE $ddl$CREATE POLICY "Allow select for authenticated" ON public.lead_captures AS PERMISSIVE FOR SELECT TO "public" USING ((auth.role() = 'authenticated'::text));$ddl$;
  EXECUTE $ddl$CREATE POLICY "Allow update for authenticated" ON public.lead_captures AS PERMISSIVE FOR UPDATE TO "public" USING ((auth.role() = 'authenticated'::text));$ddl$;
  EXECUTE $ddl$CREATE POLICY "Allow delete for authenticated" ON public.lead_captures AS PERMISSIVE FOR DELETE TO "public" USING ((auth.role() = 'authenticated'::text));$ddl$;
  EXECUTE $ddl$CREATE POLICY "Admin only all access" ON public.checklist_customers AS PERMISSIVE FOR ALL TO "public" USING ((EXISTS ( SELECT 1
   FROM profiles
  WHERE ((profiles.id = auth.uid()) AND (profiles.role = ANY (ARRAY['admin'::text, 'super_admin'::text])))))) WITH CHECK ((EXISTS ( SELECT 1
   FROM profiles
  WHERE ((profiles.id = auth.uid()) AND (profiles.role = ANY (ARRAY['admin'::text, 'super_admin'::text]))))));$ddl$;
  EXECUTE $ddl$CREATE POLICY "Admin only all access" ON public.news AS PERMISSIVE FOR ALL TO "public" USING ((EXISTS ( SELECT 1
   FROM profiles
  WHERE ((profiles.id = auth.uid()) AND (profiles.role = ANY (ARRAY['admin'::text, 'super_admin'::text])))))) WITH CHECK ((EXISTS ( SELECT 1
   FROM profiles
  WHERE ((profiles.id = auth.uid()) AND (profiles.role = ANY (ARRAY['admin'::text, 'super_admin'::text]))))));$ddl$;
  EXECUTE $ddl$CREATE POLICY "Admin only all access" ON public.lesson_quizzes AS PERMISSIVE FOR ALL TO "public" USING ((EXISTS ( SELECT 1
   FROM profiles
  WHERE ((profiles.id = auth.uid()) AND (profiles.role = ANY (ARRAY['admin'::text, 'super_admin'::text])))))) WITH CHECK ((EXISTS ( SELECT 1
   FROM profiles
  WHERE ((profiles.id = auth.uid()) AND (profiles.role = ANY (ARRAY['admin'::text, 'super_admin'::text]))))));$ddl$;
  EXECUTE $ddl$CREATE POLICY "Allow insert for all" ON public.contact_messages AS PERMISSIVE FOR INSERT TO "public" WITH CHECK (true);$ddl$;
  EXECUTE $ddl$CREATE POLICY "Allow select for authenticated" ON public.contact_messages AS PERMISSIVE FOR SELECT TO "public" USING ((auth.role() = 'authenticated'::text));$ddl$;
  EXECUTE $ddl$CREATE POLICY "Allow update for authenticated" ON public.contact_messages AS PERMISSIVE FOR UPDATE TO "public" USING ((auth.role() = 'authenticated'::text));$ddl$;
  EXECUTE $ddl$CREATE POLICY "Allow insert for all" ON public.lead_captures AS PERMISSIVE FOR INSERT TO "public" WITH CHECK (true);$ddl$;
 END IF;
END $baseline$;
