-- Read-only production preflight. Keep fingerprints/results private.
BEGIN TRANSACTION READ ONLY;
SELECT 'profiles' AS entity,count(*) AS rows,md5(string_agg(to_jsonb(p)::text,'' ORDER BY id)) AS fingerprint FROM public.profiles p
UNION ALL SELECT 'interactive_lessons',count(*),md5(string_agg(to_jsonb(t)::text,'' ORDER BY id)) FROM public.interactive_lessons t
UNION ALL SELECT 'pdf_progress',count(*),md5(string_agg(to_jsonb(t)::text,'' ORDER BY id)) FROM public.pdf_progress t
UNION ALL SELECT 'checklist_progress',count(*),md5(string_agg(to_jsonb(t)::text,'' ORDER BY id)) FROM public.checklist_progress t;
SELECT stripe_checkout_session_id,count(*) FROM public.academy_purchases GROUP BY 1 HAVING count(*)>1;
SELECT stripe_payment_intent_id,count(*) FROM public.academy_purchases WHERE stripe_payment_intent_id IS NOT NULL GROUP BY 1 HAVING count(*)>1;
SELECT c.conname,pg_get_constraintdef(c.oid) FROM pg_constraint c WHERE c.conrelid='public.pdf_progress'::regclass;
SELECT tablename,policyname,roles,cmd,qual,with_check FROM pg_policies WHERE schemaname IN ('public','storage') ORDER BY tablename,policyname;
SELECT p.proname,p.prosecdef,p.proconfig FROM pg_proc p JOIN pg_namespace n ON n.oid=p.pronamespace WHERE n.nspname='public';
COMMIT;
