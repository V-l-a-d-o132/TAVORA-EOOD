-- Lesson Engine V2. This migration is additive and preserves every legacy row.
-- It depends on the Prompt 1 security foundation and never restores public raw-content access.
SET lock_timeout = '5s';

CREATE TABLE academy_private.interactive_lessons_backup_20260920 AS
SELECT * FROM public.interactive_lessons;
ALTER TABLE academy_private.interactive_lessons_backup_20260920 ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON academy_private.interactive_lessons_backup_20260920 FROM PUBLIC, anon, authenticated;
GRANT SELECT ON academy_private.interactive_lessons_backup_20260920 TO service_role;

CREATE TABLE public.academy_lessons (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 module_id text NOT NULL,
 lesson_id text NOT NULL,
 status text NOT NULL DEFAULT 'draft' CHECK(status IN ('draft','review','published','archived')),
 published_version_id uuid,
 draft_version_id uuid,
 source_legacy_id uuid UNIQUE,
 created_by uuid REFERENCES auth.users(id),
 updated_by uuid REFERENCES auth.users(id),
 created_at timestamptz NOT NULL DEFAULT now(),
 updated_at timestamptz NOT NULL DEFAULT now(),
 UNIQUE(module_id,lesson_id)
);

CREATE TABLE public.academy_lesson_versions (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 academy_lesson_id uuid NOT NULL REFERENCES public.academy_lessons(id) ON DELETE CASCADE,
 version_number integer NOT NULL CHECK(version_number>0),
 origin_version_id uuid REFERENCES public.academy_lesson_versions(id),
 title text NOT NULL,
 subtitle text NOT NULL DEFAULT '',
 duration text NOT NULL DEFAULT '20 мин',
 objective text NOT NULL DEFAULT '',
 hook text NOT NULL DEFAULT '',
 estimated_minutes integer NOT NULL DEFAULT 20 CHECK(estimated_minutes BETWEEN 1 AND 600),
 source_kind text NOT NULL DEFAULT 'editor' CHECK(source_kind IN ('legacy','editor','reference','rollback','duplicate')),
 validation jsonb NOT NULL DEFAULT '{"errors":[],"warnings":[]}',
 change_note text NOT NULL DEFAULT '',
 created_by uuid REFERENCES auth.users(id),
 created_at timestamptz NOT NULL DEFAULT now(),
 UNIQUE(academy_lesson_id,version_number)
);

ALTER TABLE public.academy_lessons
 ADD CONSTRAINT academy_lessons_published_version_fk FOREIGN KEY(published_version_id) REFERENCES public.academy_lesson_versions(id),
 ADD CONSTRAINT academy_lessons_draft_version_fk FOREIGN KEY(draft_version_id) REFERENCES public.academy_lesson_versions(id);

CREATE TABLE public.academy_lesson_blocks (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 version_id uuid NOT NULL REFERENCES public.academy_lesson_versions(id) ON DELETE CASCADE,
 block_key text NOT NULL CHECK(block_key ~ '^[a-zA-Z0-9][a-zA-Z0-9_-]{0,79}$'),
 position integer NOT NULL CHECK(position>=0),
 block_type text NOT NULL CHECK(block_type IN (
  'objective','hook','concept','rich_text','step_reveal','before_after','flip_cards',
  'sequence_sort','matching','image_hotspot','decision_tree','case_study','scenario',
  'client_simulation','calculator','prompt_builder','practical_response','reflection',
  'checklist','quiz','homework','submission','example','summary'
 )),
 title text NOT NULL DEFAULT '',
 content jsonb NOT NULL DEFAULT '{}',
 required boolean NOT NULL DEFAULT true,
 points integer NOT NULL DEFAULT 5 CHECK(points BETWEEN 0 AND 100),
 created_at timestamptz NOT NULL DEFAULT now(),
 UNIQUE(version_id,block_key),
 UNIQUE(version_id,position),
 CHECK(jsonb_typeof(content)='object')
);

-- Answer keys, model answers and scoring rules are never readable from the browser.
CREATE TABLE academy_private.lesson_block_keys (
 block_id uuid PRIMARY KEY REFERENCES public.academy_lesson_blocks(id) ON DELETE CASCADE,
 answer_key jsonb NOT NULL DEFAULT '{}',
 feedback jsonb NOT NULL DEFAULT '{}',
 scoring jsonb NOT NULL DEFAULT '{}',
 CHECK(jsonb_typeof(answer_key)='object'),
 CHECK(jsonb_typeof(feedback)='object'),
 CHECK(jsonb_typeof(scoring)='object')
);
ALTER TABLE academy_private.lesson_block_keys ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON academy_private.lesson_block_keys FROM PUBLIC,anon,authenticated;
GRANT ALL ON academy_private.lesson_block_keys TO service_role;

CREATE TABLE public.academy_lesson_progress (
 user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
 academy_lesson_id uuid NOT NULL REFERENCES public.academy_lessons(id) ON DELETE CASCADE,
 version_id uuid NOT NULL REFERENCES public.academy_lesson_versions(id),
 current_block_key text,
 block_state jsonb NOT NULL DEFAULT '{}',
 completed_block_keys text[] NOT NULL DEFAULT '{}',
 xp integer NOT NULL DEFAULT 0 CHECK(xp>=0),
 score_percent integer CHECK(score_percent BETWEEN 0 AND 100),
 mastery_status text NOT NULL DEFAULT 'learning' CHECK(mastery_status IN ('learning','practicing','mastered')),
 started_at timestamptz NOT NULL DEFAULT now(),
 last_activity_at timestamptz NOT NULL DEFAULT now(),
 completed_at timestamptz,
 PRIMARY KEY(user_id,academy_lesson_id),
 CHECK(jsonb_typeof(block_state)='object')
);

CREATE TABLE public.academy_lesson_attempts_v2 (
 id uuid PRIMARY KEY,
 user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
 academy_lesson_id uuid NOT NULL REFERENCES public.academy_lessons(id) ON DELETE CASCADE,
 version_id uuid NOT NULL REFERENCES public.academy_lesson_versions(id),
 block_id uuid NOT NULL REFERENCES public.academy_lesson_blocks(id),
 payload jsonb NOT NULL,
 score integer NOT NULL DEFAULT 0 CHECK(score>=0),
 max_score integer NOT NULL DEFAULT 0 CHECK(max_score>=0),
 is_correct boolean,
 feedback jsonb NOT NULL DEFAULT '{}',
 created_at timestamptz NOT NULL DEFAULT now(),
 CHECK(jsonb_typeof(payload)='object'),
 CHECK(jsonb_typeof(feedback)='object')
);

CREATE TABLE public.academy_badges (
 badge_key text PRIMARY KEY,
 title text NOT NULL,
 description text NOT NULL,
 icon text NOT NULL,
 threshold integer NOT NULL DEFAULT 1 CHECK(threshold>0)
);
INSERT INTO public.academy_badges VALUES
 ('first-practice','Първа практика','Завърши първата си смислена учебна дейност.','ri-seedling-line',1),
 ('xp-100','100 XP','Натрупа 100 XP от проверени дейности.','ri-flashlight-line',100),
 ('mastery-3','Тройно майсторство','Овладя три урока с достатъчен резултат.','ri-award-line',3);

CREATE TABLE public.academy_user_badges (
 user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
 badge_key text NOT NULL REFERENCES public.academy_badges(badge_key),
 earned_at timestamptz NOT NULL DEFAULT now(),
 evidence jsonb NOT NULL DEFAULT '{}',
 PRIMARY KEY(user_id,badge_key)
);

CREATE TABLE public.academy_lesson_audit (
 id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
 academy_lesson_id uuid NOT NULL REFERENCES public.academy_lessons(id) ON DELETE CASCADE,
 version_id uuid REFERENCES public.academy_lesson_versions(id),
 actor_id uuid REFERENCES auth.users(id),
 action text NOT NULL CHECK(action IN ('migrated','created','saved','submitted_review','published','archived','rolled_back','duplicated')),
 details jsonb NOT NULL DEFAULT '{}',
 created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX academy_lessons_module_status_idx ON public.academy_lessons(module_id,status);
CREATE INDEX academy_lesson_versions_lesson_idx ON public.academy_lesson_versions(academy_lesson_id,version_number DESC);
CREATE INDEX academy_lesson_blocks_version_idx ON public.academy_lesson_blocks(version_id,position);
CREATE INDEX academy_lesson_progress_user_idx ON public.academy_lesson_progress(user_id,last_activity_at DESC);
CREATE INDEX academy_lesson_attempts_user_block_idx ON public.academy_lesson_attempts_v2(user_id,block_id,created_at DESC);

-- Migrate all existing lessons into one immutable published V2 version.
INSERT INTO public.academy_lessons(module_id,lesson_id,status,source_legacy_id,created_at,updated_at)
SELECT module_id,lesson_id,'published',id,created_at,updated_at
FROM public.interactive_lessons;

INSERT INTO public.academy_lesson_versions(
 academy_lesson_id,version_number,title,subtitle,duration,objective,hook,estimated_minutes,
 source_kind,validation,change_note,created_at
)
SELECT nl.id,1,old.title,coalesce(old.subtitle,''),old.duration,coalesce(old.subtitle,''),'',
 greatest(1,coalesce((regexp_match(old.duration,'[0-9]+'))[1]::integer,20)),
 'legacy','{"errors":[],"warnings":["legacy_content_requires_editorial_review"]}',
 'Автоматична миграция от interactive_lessons без загуба на оригинала.',old.created_at
FROM public.interactive_lessons old
JOIN public.academy_lessons nl ON nl.source_legacy_id=old.id;

INSERT INTO public.academy_lesson_blocks(version_id,block_key,position,block_type,title,content,required,points)
SELECT v.id,'legacy-'||slide.ordinality::text,(slide.ordinality-1)::integer,
 CASE slide.value->>'type'
  WHEN 'title' THEN 'objective'
  WHEN 'content' THEN 'rich_text'
  WHEN 'comparison' THEN 'before_after'
  WHEN 'framework' THEN 'step_reveal'
  WHEN 'interactive' THEN 'scenario'
  WHEN 'example' THEN 'example'
  WHEN 'checkpoint' THEN 'quiz'
  WHEN 'summary' THEN 'summary'
  WHEN 'checklist' THEN 'checklist'
  ELSE 'rich_text'
 END,
 coalesce(slide.value->>'title',''),
 CASE
  WHEN slide.value->>'type'='checkpoint' THEN
   (slide.value-'checkpoint')||jsonb_build_object('checkpoint',(slide.value->'checkpoint')-'correctIndex'-'explanation')
  WHEN slide.value->>'type'='interactive' THEN
   (slide.value-'interactivePrompt')||jsonb_build_object('interactivePrompt',(slide.value->'interactivePrompt')-'revealAnswer')
  ELSE slide.value
 END,
 true,
 CASE WHEN slide.value->>'type' IN ('checkpoint','interactive','checklist') THEN 10 ELSE 2 END
FROM public.interactive_lessons old
JOIN public.academy_lessons nl ON nl.source_legacy_id=old.id
JOIN public.academy_lesson_versions v ON v.academy_lesson_id=nl.id AND v.version_number=1
CROSS JOIN LATERAL jsonb_array_elements(
 CASE WHEN jsonb_typeof(old.slides)='array' THEN old.slides ELSE '[]'::jsonb END
) WITH ORDINALITY AS slide(value,ordinality);

INSERT INTO academy_private.lesson_block_keys(block_id,answer_key,feedback,scoring)
SELECT b.id,
 CASE
  WHEN source.slide->>'type'='checkpoint' THEN jsonb_build_object('correct',source.slide->'checkpoint'->'correctIndex')
  WHEN source.slide->>'type'='interactive' THEN jsonb_build_object('solution',source.slide->'interactivePrompt'->>'revealAnswer','complete_on_attempt',true)
  ELSE '{}'
 END,
 CASE
  WHEN source.slide->>'type'='checkpoint' THEN jsonb_build_object('explanation',coalesce(source.slide->'checkpoint'->>'explanation',''))
  WHEN source.slide->>'type'='interactive' THEN jsonb_build_object('explanation',coalesce(source.slide->'interactivePrompt'->>'revealAnswer',''))
  ELSE '{}'
 END,
 CASE WHEN source.slide->>'type'='checkpoint' THEN '{"mode":"single_choice"}'::jsonb ELSE '{}'::jsonb END
FROM public.academy_lesson_blocks b
JOIN public.academy_lesson_versions v ON v.id=b.version_id AND v.source_kind='legacy'
JOIN public.academy_lessons l ON l.id=v.academy_lesson_id
JOIN public.interactive_lessons old ON old.id=l.source_legacy_id
CROSS JOIN LATERAL (
 SELECT value AS slide FROM jsonb_array_elements(old.slides) WITH ORDINALITY x(value,ord)
 WHERE ord=b.position+1
) source
WHERE source.slide->>'type' IN ('checkpoint','interactive');

UPDATE public.academy_lessons l
SET published_version_id=v.id,draft_version_id=v.id
FROM public.academy_lesson_versions v
WHERE v.academy_lesson_id=l.id AND v.version_number=1;

INSERT INTO public.academy_lesson_audit(academy_lesson_id,version_id,action,details)
SELECT id,published_version_id,'migrated',jsonb_build_object('source_legacy_id',source_legacy_id)
FROM public.academy_lessons;

-- Preserve the unambiguous existing per-lesson completion and assessment state.
INSERT INTO public.academy_lesson_progress(
 user_id,academy_lesson_id,version_id,current_block_key,completed_block_keys,xp,
 score_percent,mastery_status,started_at,last_activity_at,completed_at
)
SELECT p.user_id,l.id,l.published_version_id,
 (SELECT block_key FROM public.academy_lesson_blocks WHERE version_id=l.published_version_id ORDER BY position LIMIT 1),
 CASE WHEN p.completed THEN coalesce((SELECT array_agg(block_key ORDER BY position) FROM public.academy_lesson_blocks WHERE version_id=l.published_version_id),'{}') ELSE '{}' END,
 CASE WHEN p.completed THEN coalesce((SELECT sum(points) FROM public.academy_lesson_blocks WHERE version_id=l.published_version_id),0) ELSE 0 END,
 CASE WHEN p.quiz_total>0 THEN round(100.0*p.quiz_score/p.quiz_total)::integer ELSE NULL END,
 CASE WHEN p.completed AND (p.quiz_total IS NULL OR p.quiz_total=0 OR 100.0*p.quiz_score/p.quiz_total>=80) THEN 'mastered'
      WHEN p.completed THEN 'practicing' ELSE 'learning' END,
 coalesce(p.updated_at,now()),coalesce(p.updated_at,now()),CASE WHEN p.completed THEN coalesce(p.updated_at,now()) END
FROM public.pdf_progress p
JOIN public.academy_lessons l ON l.module_id=p.module_id AND l.lesson_id=p.lesson_id
ON CONFLICT(user_id,academy_lesson_id) DO NOTHING;

CREATE FUNCTION academy_private.lesson_validation(p_version uuid) RETURNS jsonb
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path='' AS $$
DECLARE v public.academy_lesson_versions; errors jsonb:='[]'; warnings jsonb:='[]'; n integer; kinds text[];
BEGIN
 SELECT * INTO v FROM public.academy_lesson_versions WHERE id=p_version;
 IF NOT FOUND THEN RAISE EXCEPTION 'Version not found'; END IF;
 SELECT count(*),coalesce(array_agg(DISTINCT block_type),'{}') INTO n,kinds FROM public.academy_lesson_blocks WHERE version_id=p_version;
 IF btrim(v.objective)='' THEN errors:=errors||jsonb_build_array('missing_objective'); END IF;
 IF btrim(v.hook)='' THEN errors:=errors||jsonb_build_array('missing_hook'); END IF;
 IF n<5 THEN errors:=errors||jsonb_build_array('too_few_blocks'); END IF;
 IF NOT (kinds && ARRAY['sequence_sort','matching','image_hotspot','decision_tree','scenario','client_simulation','calculator','prompt_builder','practical_response','reflection','checklist','quiz','homework','submission','flip_cards']) THEN errors:=errors||jsonb_build_array('missing_interaction'); END IF;
 IF NOT ('quiz'=ANY(kinds)) THEN errors:=errors||jsonb_build_array('missing_knowledge_check'); END IF;
 IF NOT (kinds && ARRAY['prompt_builder','practical_response','homework','submission']) THEN errors:=errors||jsonb_build_array('missing_practice'); END IF;
 IF NOT ('summary'=ANY(kinds)) THEN errors:=errors||jsonb_build_array('missing_summary'); END IF;
 IF EXISTS(SELECT 1 FROM public.academy_lesson_blocks b WHERE b.version_id=p_version AND b.required AND b.points=0) THEN warnings:=warnings||jsonb_build_array('required_block_has_no_xp'); END IF;
 IF EXISTS(
  SELECT 1 FROM public.academy_lesson_blocks b LEFT JOIN academy_private.lesson_block_keys k ON k.block_id=b.id
  WHERE b.version_id=p_version AND b.block_type IN ('sequence_sort','matching','image_hotspot','decision_tree','scenario','client_simulation','calculator','quiz') AND k.block_id IS NULL
 ) THEN errors:=errors||jsonb_build_array('missing_server_evaluation'); END IF;
 RETURN jsonb_build_object('errors',errors,'warnings',warnings,'block_count',n,'interactive',kinds && ARRAY['sequence_sort','matching','image_hotspot','decision_tree','scenario','client_simulation','calculator','prompt_builder','practical_response','reflection','checklist','quiz','homework','submission','flip_cards'],'has_quiz','quiz'=ANY(kinds),'has_assignment',kinds && ARRAY['practical_response','homework','submission']);
END $$;

CREATE FUNCTION academy_private.lesson_json(p_lesson uuid,p_version uuid,p_include_keys boolean DEFAULT false) RETURNS jsonb
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path='' AS $$
DECLARE l public.academy_lessons; v public.academy_lesson_versions; blocks jsonb; progress jsonb;
BEGIN
 SELECT * INTO l FROM public.academy_lessons WHERE id=p_lesson;
 SELECT * INTO v FROM public.academy_lesson_versions WHERE id=p_version AND academy_lesson_id=p_lesson;
 IF l.id IS NULL OR v.id IS NULL THEN RETURN NULL; END IF;
 SELECT coalesce(jsonb_agg(jsonb_build_object(
  'id',b.id,'key',b.block_key,'position',b.position,'type',b.block_type,'title',b.title,
  'content',b.content,'required',b.required,'points',b.points
  ) || CASE WHEN p_include_keys THEN jsonb_build_object('evaluation',coalesce(k.answer_key,'{}'),'feedback',coalesce(k.feedback,'{}'),'scoring',coalesce(k.scoring,'{}')) ELSE '{}'::jsonb END ORDER BY b.position),'[]')
 INTO blocks FROM public.academy_lesson_blocks b LEFT JOIN academy_private.lesson_block_keys k ON k.block_id=b.id WHERE b.version_id=v.id;
 SELECT to_jsonb(p) INTO progress FROM public.academy_lesson_progress p WHERE p.user_id=(SELECT auth.uid()) AND p.academy_lesson_id=l.id;
 RETURN jsonb_build_object('id',l.id,'moduleId',l.module_id,'lessonId',l.lesson_id,'status',l.status,
  'versionId',v.id,'version',v.version_number,'title',v.title,'subtitle',v.subtitle,'duration',v.duration,
  'objective',v.objective,'hook',v.hook,'estimatedMinutes',v.estimated_minutes,'sourceKind',v.source_kind,
  'validation',v.validation,'blocks',blocks,'progress',progress,
  'versionChanged',progress IS NOT NULL AND progress->>'version_id' IS DISTINCT FROM v.id::text);
END $$;

CREATE FUNCTION academy_private.get_lesson_v2(p_module text,p_lesson text) RETURNS jsonb
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path='' AS $$
DECLARE l public.academy_lessons;
BEGIN
 IF NOT academy_private.can_access(p_module) THEN RAISE EXCEPTION 'Access denied' USING ERRCODE='42501'; END IF;
 SELECT * INTO l FROM public.academy_lessons WHERE module_id=p_module AND lesson_id=p_lesson AND published_version_id IS NOT NULL AND status<>'archived';
 IF NOT FOUND OR l.published_version_id IS NULL THEN RETURN NULL; END IF;
 RETURN academy_private.lesson_json(l.id,l.published_version_id,false);
END $$;
CREATE FUNCTION public.academy_get_lesson_v2(p_module text,p_lesson text) RETURNS jsonb
LANGUAGE sql STABLE SECURITY INVOKER SET search_path='' AS $$ SELECT academy_private.get_lesson_v2(p_module,p_lesson); $$;

CREATE FUNCTION academy_private.admin_list_lessons() RETURNS jsonb
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path='' AS $$
BEGIN
 IF NOT academy_private.is_admin() THEN RAISE EXCEPTION 'Forbidden' USING ERRCODE='42501'; END IF;
 RETURN (SELECT coalesce(jsonb_agg(jsonb_build_object(
  'id',l.id,'moduleId',l.module_id,'lessonId',l.lesson_id,'status',l.status,'updatedAt',l.updated_at,
  'publishedVersionId',l.published_version_id,'draftVersionId',l.draft_version_id,
  'title',coalesce(d.title,p.title),'version',coalesce(d.version_number,p.version_number),
  'validation',coalesce(d.validation,p.validation),
  'blockCount',(SELECT count(*) FROM public.academy_lesson_blocks WHERE version_id=coalesce(l.draft_version_id,l.published_version_id)),
  'hasQuiz',EXISTS(SELECT 1 FROM public.academy_lesson_blocks WHERE version_id=coalesce(l.draft_version_id,l.published_version_id) AND block_type='quiz'),
  'hasAssignment',EXISTS(SELECT 1 FROM public.academy_lesson_blocks WHERE version_id=coalesce(l.draft_version_id,l.published_version_id) AND block_type IN ('practical_response','homework','submission')),
  'hasInteraction',EXISTS(SELECT 1 FROM public.academy_lesson_blocks WHERE version_id=coalesce(l.draft_version_id,l.published_version_id) AND block_type NOT IN ('objective','hook','concept','rich_text','example','summary'))
 ) ORDER BY l.module_id,l.lesson_id),'[]')
 FROM public.academy_lessons l
 LEFT JOIN public.academy_lesson_versions d ON d.id=l.draft_version_id
 LEFT JOIN public.academy_lesson_versions p ON p.id=l.published_version_id);
END $$;
CREATE FUNCTION public.academy_admin_list_lessons() RETURNS jsonb LANGUAGE sql SECURITY INVOKER SET search_path='' AS $$ SELECT academy_private.admin_list_lessons(); $$;

CREATE FUNCTION academy_private.admin_get_lesson(p_lesson uuid,p_version uuid DEFAULT NULL) RETURNS jsonb
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path='' AS $$
DECLARE l public.academy_lessons; chosen uuid; versions jsonb; audit jsonb;
BEGIN
 IF NOT academy_private.is_admin() THEN RAISE EXCEPTION 'Forbidden' USING ERRCODE='42501'; END IF;
 SELECT * INTO l FROM public.academy_lessons WHERE id=p_lesson;
 chosen:=coalesce(p_version,l.draft_version_id,l.published_version_id);
 SELECT coalesce(jsonb_agg(jsonb_build_object('id',id,'version',version_number,'sourceKind',source_kind,'changeNote',change_note,'createdBy',created_by,'createdAt',created_at,'validation',validation) ORDER BY version_number DESC),'[]') INTO versions FROM public.academy_lesson_versions WHERE academy_lesson_id=p_lesson;
 SELECT coalesce(jsonb_agg(jsonb_build_object('action',action,'versionId',version_id,'actorId',actor_id,'details',details,'createdAt',created_at) ORDER BY id DESC),'[]') INTO audit FROM (SELECT * FROM public.academy_lesson_audit WHERE academy_lesson_id=p_lesson ORDER BY id DESC LIMIT 50) a;
 RETURN academy_private.lesson_json(p_lesson,chosen,true)||jsonb_build_object('versions',versions,'audit',audit,'publishedVersionId',l.published_version_id,'draftVersionId',l.draft_version_id);
END $$;
CREATE FUNCTION public.academy_admin_get_lesson(p_lesson uuid,p_version uuid DEFAULT NULL) RETURNS jsonb LANGUAGE sql SECURITY INVOKER SET search_path='' AS $$ SELECT academy_private.admin_get_lesson(p_lesson,p_version); $$;

CREATE FUNCTION academy_private.admin_preview_lesson(p_lesson uuid,p_version uuid DEFAULT NULL) RETURNS jsonb
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path='' AS $$
DECLARE l public.academy_lessons; chosen uuid;
BEGIN
 IF NOT academy_private.is_admin() THEN RAISE EXCEPTION 'Forbidden' USING ERRCODE='42501'; END IF;
 SELECT * INTO l FROM public.academy_lessons WHERE id=p_lesson;
 IF NOT FOUND THEN RAISE EXCEPTION 'Lesson not found'; END IF;
 chosen:=coalesce(p_version,l.draft_version_id,l.published_version_id);
 IF chosen IS NULL OR NOT EXISTS(SELECT 1 FROM public.academy_lesson_versions WHERE id=chosen AND academy_lesson_id=p_lesson) THEN RAISE EXCEPTION 'Invalid version'; END IF;
 RETURN academy_private.lesson_json(p_lesson,chosen,false)||jsonb_build_object('preview',true);
END $$;
CREATE FUNCTION public.academy_admin_preview_lesson(p_lesson uuid,p_version uuid DEFAULT NULL) RETURNS jsonb LANGUAGE sql SECURITY INVOKER SET search_path='' AS $$ SELECT academy_private.admin_preview_lesson(p_lesson,p_version); $$;

CREATE FUNCTION academy_private.admin_save_lesson(
 p_lesson uuid,p_module text,p_lesson_key text,p_title text,p_subtitle text,p_duration text,
 p_objective text,p_hook text,p_estimated_minutes integer,p_blocks jsonb,p_change_note text DEFAULT ''
) RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path='' AS $$
DECLARE lid uuid; vid uuid; next_version integer; item jsonb; pos integer:=0; bid uuid; validation_result jsonb; actor uuid:=(SELECT auth.uid()); key_text text;
BEGIN
 IF NOT academy_private.is_admin() THEN RAISE EXCEPTION 'Forbidden' USING ERRCODE='42501'; END IF;
 IF p_module!~'^s[0-9]{2}-m[0-9]{2}$' OR p_lesson_key!~'^[a-zA-Z0-9][a-zA-Z0-9_-]{1,79}$' OR btrim(p_title)='' THEN RAISE EXCEPTION 'Invalid lesson identity'; END IF;
 IF p_estimated_minutes NOT BETWEEN 1 AND 600 OR jsonb_typeof(p_blocks) IS DISTINCT FROM 'array' OR jsonb_array_length(p_blocks) NOT BETWEEN 1 AND 80 OR pg_column_size(p_blocks)>524288 THEN RAISE EXCEPTION 'Invalid lesson payload'; END IF;
 IF p_lesson IS NULL THEN
  INSERT INTO public.academy_lessons(module_id,lesson_id,status,created_by,updated_by) VALUES(p_module,p_lesson_key,'draft',actor,actor) RETURNING id INTO lid;
  INSERT INTO public.academy_lesson_audit(academy_lesson_id,actor_id,action) VALUES(lid,actor,'created');
 ELSE
  SELECT id INTO lid FROM public.academy_lessons WHERE id=p_lesson FOR UPDATE;
  IF lid IS NULL THEN RAISE EXCEPTION 'Lesson not found'; END IF;
  IF EXISTS(SELECT 1 FROM public.academy_lessons WHERE id=lid AND (module_id<>p_module OR lesson_id<>p_lesson_key)) THEN RAISE EXCEPTION 'Published lesson identity is immutable; duplicate the lesson instead'; END IF;
  UPDATE public.academy_lessons SET updated_by=actor,updated_at=now() WHERE id=lid;
 END IF;
 SELECT coalesce(max(version_number),0)+1 INTO next_version FROM public.academy_lesson_versions WHERE academy_lesson_id=lid;
 INSERT INTO public.academy_lesson_versions(academy_lesson_id,version_number,title,subtitle,duration,objective,hook,estimated_minutes,source_kind,change_note,created_by)
 VALUES(lid,next_version,btrim(p_title),coalesce(p_subtitle,''),coalesce(nullif(p_duration,''),'20 мин'),coalesce(p_objective,''),coalesce(p_hook,''),p_estimated_minutes,'editor',coalesce(p_change_note,''),actor) RETURNING id INTO vid;
 FOR item IN SELECT value FROM jsonb_array_elements(p_blocks) LOOP
  key_text:=coalesce(nullif(item->>'key',''),'block-'||pos::text);
  IF key_text!~'^[a-zA-Z0-9][a-zA-Z0-9_-]{0,79}$' OR item->>'type' NOT IN (
   'objective','hook','concept','rich_text','step_reveal','before_after','flip_cards','sequence_sort','matching','image_hotspot','decision_tree','case_study','scenario','client_simulation','calculator','prompt_builder','practical_response','reflection','checklist','quiz','homework','submission','example','summary'
  ) OR jsonb_typeof(coalesce(item->'content','{}'::jsonb)) IS DISTINCT FROM 'object' THEN RAISE EXCEPTION 'Invalid lesson block'; END IF;
  INSERT INTO public.academy_lesson_blocks(version_id,block_key,position,block_type,title,content,required,points)
  VALUES(vid,key_text,pos,item->>'type',coalesce(item->>'title',''),coalesce(item->'content','{}'::jsonb),coalesce((item->>'required')::boolean,true),greatest(0,least(100,coalesce((item->>'points')::integer,5)))) RETURNING id INTO bid;
  IF item ? 'evaluation' OR item ? 'feedback' OR item ? 'scoring' THEN
   INSERT INTO academy_private.lesson_block_keys(block_id,answer_key,feedback,scoring) VALUES(bid,coalesce(item->'evaluation','{}'::jsonb),coalesce(item->'feedback','{}'::jsonb),coalesce(item->'scoring','{}'::jsonb));
  END IF;
  pos:=pos+1;
 END LOOP;
 validation_result:=academy_private.lesson_validation(vid);
 UPDATE public.academy_lesson_versions SET validation=validation_result WHERE id=vid;
 UPDATE public.academy_lessons SET draft_version_id=vid,status='draft',updated_by=actor,updated_at=now() WHERE id=lid;
 INSERT INTO public.academy_lesson_audit(academy_lesson_id,version_id,actor_id,action,details) VALUES(lid,vid,actor,'saved',jsonb_build_object('version',next_version,'validation',validation_result));
 RETURN academy_private.admin_get_lesson(lid,vid);
END $$;
CREATE FUNCTION public.academy_admin_save_lesson(p_lesson uuid,p_module text,p_lesson_key text,p_title text,p_subtitle text,p_duration text,p_objective text,p_hook text,p_estimated_minutes integer,p_blocks jsonb,p_change_note text DEFAULT '') RETURNS jsonb LANGUAGE sql SECURITY INVOKER SET search_path='' AS $$ SELECT academy_private.admin_save_lesson(p_lesson,p_module,p_lesson_key,p_title,p_subtitle,p_duration,p_objective,p_hook,p_estimated_minutes,p_blocks,p_change_note); $$;

CREATE FUNCTION academy_private.admin_set_lesson_status(p_lesson uuid,p_status text,p_version uuid DEFAULT NULL) RETURNS jsonb
LANGUAGE plpgsql SECURITY DEFINER SET search_path='' AS $$
DECLARE l public.academy_lessons; chosen uuid; validation_result jsonb; actor uuid:=(SELECT auth.uid()); action_name text;
BEGIN
 IF NOT academy_private.is_admin() THEN RAISE EXCEPTION 'Forbidden' USING ERRCODE='42501'; END IF;
 SELECT * INTO l FROM public.academy_lessons WHERE id=p_lesson FOR UPDATE;
 IF NOT FOUND OR p_status NOT IN ('draft','review','published','archived') THEN RAISE EXCEPTION 'Invalid status'; END IF;
 chosen:=coalesce(p_version,l.draft_version_id,l.published_version_id);
 IF chosen IS NULL OR NOT EXISTS(SELECT 1 FROM public.academy_lesson_versions WHERE id=chosen AND academy_lesson_id=p_lesson) THEN RAISE EXCEPTION 'Invalid version'; END IF;
 validation_result:=academy_private.lesson_validation(chosen);
 UPDATE public.academy_lesson_versions SET validation=validation_result WHERE id=chosen;
 IF p_status='published' AND jsonb_array_length(validation_result->'errors')>0 THEN RAISE EXCEPTION 'Lesson has validation errors'; END IF;
 UPDATE public.academy_lessons SET status=p_status,
  published_version_id=CASE WHEN p_status='published' THEN chosen ELSE published_version_id END,
  draft_version_id=CASE WHEN p_status='archived' THEN draft_version_id ELSE chosen END,
  updated_by=actor,updated_at=now() WHERE id=p_lesson;
 action_name:=CASE p_status WHEN 'review' THEN 'submitted_review' WHEN 'published' THEN 'published' WHEN 'archived' THEN 'archived' ELSE 'saved' END;
 INSERT INTO public.academy_lesson_audit(academy_lesson_id,version_id,actor_id,action,details) VALUES(p_lesson,chosen,actor,action_name,jsonb_build_object('status',p_status));
 RETURN academy_private.admin_get_lesson(p_lesson,chosen);
END $$;
CREATE FUNCTION public.academy_admin_set_lesson_status(p_lesson uuid,p_status text,p_version uuid DEFAULT NULL) RETURNS jsonb LANGUAGE sql SECURITY INVOKER SET search_path='' AS $$ SELECT academy_private.admin_set_lesson_status(p_lesson,p_status,p_version); $$;

CREATE FUNCTION academy_private.admin_rollback_lesson(p_lesson uuid,p_version uuid) RETURNS jsonb
LANGUAGE plpgsql SECURITY DEFINER SET search_path='' AS $$
DECLARE source public.academy_lesson_versions; new_id uuid; next_version integer; actor uuid:=(SELECT auth.uid()); validation_result jsonb;
BEGIN
 IF NOT academy_private.is_admin() THEN RAISE EXCEPTION 'Forbidden' USING ERRCODE='42501'; END IF;
 SELECT * INTO source FROM public.academy_lesson_versions WHERE id=p_version AND academy_lesson_id=p_lesson;
 IF NOT FOUND THEN RAISE EXCEPTION 'Version not found'; END IF;
 PERFORM 1 FROM public.academy_lessons WHERE id=p_lesson FOR UPDATE;
 SELECT max(version_number)+1 INTO next_version FROM public.academy_lesson_versions WHERE academy_lesson_id=p_lesson;
 INSERT INTO public.academy_lesson_versions(academy_lesson_id,version_number,origin_version_id,title,subtitle,duration,objective,hook,estimated_minutes,source_kind,validation,change_note,created_by)
 VALUES(p_lesson,next_version,source.id,source.title,source.subtitle,source.duration,source.objective,source.hook,source.estimated_minutes,'rollback',source.validation,'Възстановена версия '||source.version_number,actor) RETURNING id INTO new_id;
 INSERT INTO public.academy_lesson_blocks(version_id,block_key,position,block_type,title,content,required,points)
 SELECT new_id,block_key,position,block_type,title,content,required,points FROM public.academy_lesson_blocks WHERE version_id=source.id;
 INSERT INTO academy_private.lesson_block_keys(block_id,answer_key,feedback,scoring)
 SELECT copied.id,k.answer_key,k.feedback,k.scoring FROM public.academy_lesson_blocks original
 JOIN public.academy_lesson_blocks copied ON copied.version_id=new_id AND copied.block_key=original.block_key
 JOIN academy_private.lesson_block_keys k ON k.block_id=original.id WHERE original.version_id=source.id;
 validation_result:=academy_private.lesson_validation(new_id);
 IF jsonb_array_length(validation_result->'errors')>0 THEN RAISE EXCEPTION 'Historical version is not publishable'; END IF;
 UPDATE public.academy_lesson_versions SET validation=validation_result WHERE id=new_id;
 UPDATE public.academy_lessons SET published_version_id=new_id,draft_version_id=new_id,status='published',updated_by=actor,updated_at=now() WHERE id=p_lesson;
 INSERT INTO public.academy_lesson_audit(academy_lesson_id,version_id,actor_id,action,details) VALUES(p_lesson,new_id,actor,'rolled_back',jsonb_build_object('from_version_id',source.id,'from_version',source.version_number));
 RETURN academy_private.admin_get_lesson(p_lesson,new_id);
END $$;
CREATE FUNCTION public.academy_admin_rollback_lesson(p_lesson uuid,p_version uuid) RETURNS jsonb LANGUAGE sql SECURITY INVOKER SET search_path='' AS $$ SELECT academy_private.admin_rollback_lesson(p_lesson,p_version); $$;

CREATE FUNCTION academy_private.admin_duplicate_lesson(p_lesson uuid,p_module text,p_lesson_key text) RETURNS jsonb
LANGUAGE plpgsql SECURITY DEFINER SET search_path='' AS $$
DECLARE source_l public.academy_lessons; source_v public.academy_lesson_versions; new_l uuid; new_v uuid; actor uuid:=(SELECT auth.uid());
BEGIN
 IF NOT academy_private.is_admin() THEN RAISE EXCEPTION 'Forbidden' USING ERRCODE='42501'; END IF;
 SELECT * INTO source_l FROM public.academy_lessons WHERE id=p_lesson;
 SELECT * INTO source_v FROM public.academy_lesson_versions WHERE id=coalesce(source_l.draft_version_id,source_l.published_version_id);
 IF source_l.id IS NULL OR source_v.id IS NULL THEN RAISE EXCEPTION 'Lesson not found'; END IF;
 INSERT INTO public.academy_lessons(module_id,lesson_id,status,created_by,updated_by) VALUES(p_module,p_lesson_key,'draft',actor,actor) RETURNING id INTO new_l;
 INSERT INTO public.academy_lesson_versions(academy_lesson_id,version_number,origin_version_id,title,subtitle,duration,objective,hook,estimated_minutes,source_kind,validation,change_note,created_by)
 VALUES(new_l,1,source_v.id,source_v.title||' — копие',source_v.subtitle,source_v.duration,source_v.objective,source_v.hook,source_v.estimated_minutes,'duplicate',source_v.validation,'Дублирано от '||source_l.module_id||'/'||source_l.lesson_id,actor) RETURNING id INTO new_v;
 INSERT INTO public.academy_lesson_blocks(version_id,block_key,position,block_type,title,content,required,points)
 SELECT new_v,block_key,position,block_type,title,content,required,points FROM public.academy_lesson_blocks WHERE version_id=source_v.id;
 INSERT INTO academy_private.lesson_block_keys(block_id,answer_key,feedback,scoring)
 SELECT copied.id,k.answer_key,k.feedback,k.scoring FROM public.academy_lesson_blocks original
 JOIN public.academy_lesson_blocks copied ON copied.version_id=new_v AND copied.block_key=original.block_key
 JOIN academy_private.lesson_block_keys k ON k.block_id=original.id WHERE original.version_id=source_v.id;
 UPDATE public.academy_lessons SET draft_version_id=new_v WHERE id=new_l;
 INSERT INTO public.academy_lesson_audit(academy_lesson_id,version_id,actor_id,action,details) VALUES(new_l,new_v,actor,'duplicated',jsonb_build_object('source_lesson_id',p_lesson));
 RETURN academy_private.admin_get_lesson(new_l,new_v);
END $$;
CREATE FUNCTION public.academy_admin_duplicate_lesson(p_lesson uuid,p_module text,p_lesson_key text) RETURNS jsonb LANGUAGE sql SECURITY INVOKER SET search_path='' AS $$ SELECT academy_private.admin_duplicate_lesson(p_lesson,p_module,p_lesson_key); $$;

CREATE FUNCTION academy_private.autosave_lesson(p_module text,p_lesson text,p_version uuid,p_current_block text,p_state jsonb) RETURNS jsonb
LANGUAGE plpgsql SECURITY DEFINER SET search_path='' AS $$
DECLARE uid uuid:=(SELECT auth.uid()); l public.academy_lessons; current_state jsonb;
BEGIN
 IF uid IS NULL OR NOT academy_private.can_access(p_module) THEN RAISE EXCEPTION 'Access denied' USING ERRCODE='42501'; END IF;
 SELECT * INTO l FROM public.academy_lessons WHERE module_id=p_module AND lesson_id=p_lesson AND published_version_id IS NOT NULL AND status<>'archived';
 IF l.published_version_id IS DISTINCT FROM p_version OR jsonb_typeof(p_state) IS DISTINCT FROM 'object' OR pg_column_size(p_state)>65536 OR NOT EXISTS(SELECT 1 FROM public.academy_lesson_blocks WHERE version_id=p_version AND block_key=p_current_block) THEN RAISE EXCEPTION 'Invalid progress state'; END IF;
 INSERT INTO public.academy_lesson_progress(user_id,academy_lesson_id,version_id,current_block_key,block_state)
 VALUES(uid,l.id,p_version,p_current_block,p_state)
 ON CONFLICT(user_id,academy_lesson_id) DO UPDATE SET version_id=EXCLUDED.version_id,current_block_key=EXCLUDED.current_block_key,
  block_state=CASE WHEN academy_lesson_progress.version_id=EXCLUDED.version_id THEN academy_lesson_progress.block_state||EXCLUDED.block_state ELSE EXCLUDED.block_state END,
  completed_block_keys=CASE WHEN academy_lesson_progress.version_id=EXCLUDED.version_id THEN academy_lesson_progress.completed_block_keys ELSE '{}'::text[] END,
  xp=CASE WHEN academy_lesson_progress.version_id=EXCLUDED.version_id THEN academy_lesson_progress.xp ELSE 0 END,
  score_percent=CASE WHEN academy_lesson_progress.version_id=EXCLUDED.version_id THEN academy_lesson_progress.score_percent ELSE NULL END,
  mastery_status=CASE WHEN academy_lesson_progress.version_id=EXCLUDED.version_id THEN academy_lesson_progress.mastery_status ELSE 'learning' END,
  completed_at=CASE WHEN academy_lesson_progress.version_id=EXCLUDED.version_id THEN academy_lesson_progress.completed_at ELSE NULL END,
  last_activity_at=now()
 RETURNING block_state INTO current_state;
 RETURN jsonb_build_object('saved',true,'currentBlockKey',p_current_block,'state',current_state);
END $$;
CREATE FUNCTION public.academy_autosave_lesson(p_module text,p_lesson text,p_version uuid,p_current_block text,p_state jsonb) RETURNS jsonb LANGUAGE sql SECURITY INVOKER SET search_path='' AS $$ SELECT academy_private.autosave_lesson(p_module,p_lesson,p_version,p_current_block,p_state); $$;

CREATE FUNCTION academy_private.refresh_lesson_progress(p_user uuid,p_lesson uuid) RETURNS jsonb
LANGUAGE plpgsql SECURITY DEFINER SET search_path='' AS $$
DECLARE p public.academy_lesson_progress; required_count integer; completed_count integer; earned integer; score_sum integer; max_sum integer; percent integer; status_text text; done_at timestamptz;
BEGIN
 SELECT * INTO p FROM public.academy_lesson_progress WHERE user_id=p_user AND academy_lesson_id=p_lesson FOR UPDATE;
 SELECT count(*) FILTER(WHERE required),count(*) FILTER(WHERE required AND block_key=ANY(p.completed_block_keys)),coalesce(sum(points) FILTER(WHERE block_key=ANY(p.completed_block_keys)),0)
 INTO required_count,completed_count,earned FROM public.academy_lesson_blocks WHERE version_id=p.version_id;
 SELECT coalesce(sum(score),0),coalesce(sum(max_score),0) INTO score_sum,max_sum FROM (
  SELECT DISTINCT ON(block_id) block_id,score,max_score FROM public.academy_lesson_attempts_v2
  WHERE user_id=p_user AND academy_lesson_id=p_lesson AND version_id=p.version_id ORDER BY block_id,created_at DESC
 ) latest;
 percent:=CASE WHEN max_sum>0 THEN round(100.0*score_sum/max_sum)::integer ELSE NULL END;
 IF required_count>0 AND completed_count=required_count THEN
  done_at:=coalesce(p.completed_at,now());
  status_text:=CASE WHEN percent IS NULL OR percent>=80 THEN 'mastered' ELSE 'practicing' END;
 ELSE status_text:='learning'; done_at:=NULL; END IF;
 UPDATE public.academy_lesson_progress SET xp=earned,score_percent=percent,mastery_status=status_text,completed_at=done_at,last_activity_at=now() WHERE user_id=p_user AND academy_lesson_id=p_lesson RETURNING * INTO p;
 IF done_at IS NOT NULL THEN
  INSERT INTO public.pdf_progress(user_id,module_id,lesson_id,page_number,total_pages,completed,updated_at)
  SELECT p_user,l.module_id,l.lesson_id,1,1,true,now() FROM public.academy_lessons l WHERE l.id=p_lesson
  ON CONFLICT(user_id,module_id,lesson_id) DO UPDATE SET completed=true,updated_at=now();
 END IF;
 IF cardinality(p.completed_block_keys)>0 THEN INSERT INTO public.academy_user_badges(user_id,badge_key,evidence) VALUES(p_user,'first-practice',jsonb_build_object('lessonId',p_lesson)) ON CONFLICT DO NOTHING; END IF;
 IF (SELECT coalesce(sum(xp),0) FROM public.academy_lesson_progress WHERE user_id=p_user)>=100 THEN INSERT INTO public.academy_user_badges(user_id,badge_key,evidence) VALUES(p_user,'xp-100',jsonb_build_object('xp',(SELECT sum(xp) FROM public.academy_lesson_progress WHERE user_id=p_user))) ON CONFLICT DO NOTHING; END IF;
 IF (SELECT count(*) FROM public.academy_lesson_progress WHERE user_id=p_user AND mastery_status='mastered')>=3 THEN INSERT INTO public.academy_user_badges(user_id,badge_key,evidence) VALUES(p_user,'mastery-3',jsonb_build_object('mastered',(SELECT count(*) FROM public.academy_lesson_progress WHERE user_id=p_user AND mastery_status='mastered'))) ON CONFLICT DO NOTHING; END IF;
 RETURN to_jsonb(p);
END $$;

CREATE FUNCTION academy_private.complete_lesson_block(p_module text,p_lesson text,p_version uuid,p_block_key text,p_payload jsonb,p_attempt uuid) RETURNS jsonb
LANGUAGE plpgsql SECURITY DEFINER SET search_path='' AS $$
DECLARE uid uuid:=(SELECT auth.uid()); l public.academy_lessons; b public.academy_lesson_blocks; k academy_private.lesson_block_keys; prev public.academy_lesson_attempts_v2; complete boolean:=false; correct boolean:=NULL; score_value integer:=0; max_value integer:=0; response jsonb:='{}'; expected jsonb; supplied jsonb; required_ids text[]; progress jsonb; admin_preview boolean:=false;
BEGIN
 IF NOT academy_private.can_access(p_module) OR (uid IS NULL AND p_module<>'s01-m01') THEN RAISE EXCEPTION 'Access denied' USING ERRCODE='42501'; END IF;
 IF jsonb_typeof(p_payload) IS DISTINCT FROM 'object' OR pg_column_size(p_payload)>65536 THEN RAISE EXCEPTION 'Invalid interaction payload'; END IF;
 SELECT * INTO l FROM public.academy_lessons WHERE module_id=p_module AND lesson_id=p_lesson;
 IF NOT FOUND THEN RAISE EXCEPTION 'Lesson not found'; END IF;
 admin_preview:=uid IS NOT NULL AND academy_private.is_admin() AND p_version IS DISTINCT FROM l.published_version_id
  AND EXISTS(SELECT 1 FROM public.academy_lesson_versions WHERE id=p_version AND academy_lesson_id=l.id);
 IF NOT admin_preview AND (l.status='archived' OR l.published_version_id IS DISTINCT FROM p_version) THEN RAISE EXCEPTION 'Lesson version changed'; END IF;
 SELECT * INTO b FROM public.academy_lesson_blocks WHERE version_id=p_version AND block_key=p_block_key;
 IF b.id IS NULL THEN RAISE EXCEPTION 'Block not found'; END IF;
 IF uid IS NOT NULL THEN
  PERFORM pg_advisory_xact_lock(hashtextextended(p_attempt::text,0));
  SELECT * INTO prev FROM public.academy_lesson_attempts_v2 WHERE id=p_attempt;
  IF FOUND THEN
   IF prev.user_id<>uid OR prev.block_id<>b.id OR prev.payload<>p_payload THEN RAISE EXCEPTION 'Attempt conflict'; END IF;
   RETURN jsonb_build_object('attemptId',prev.id,'correct',prev.is_correct,'score',prev.score,'maxScore',prev.max_score,'feedback',prev.feedback,'progress',(SELECT to_jsonb(p) FROM public.academy_lesson_progress p WHERE p.user_id=uid AND p.academy_lesson_id=l.id));
  END IF;
 END IF;
 SELECT * INTO k FROM academy_private.lesson_block_keys WHERE block_id=b.id;
 expected:=coalesce(k.answer_key,'{}');
 CASE b.block_type
  WHEN 'sequence_sort' THEN supplied:=p_payload->'order'; correct:=supplied=expected->'order'; complete:=correct;
  WHEN 'matching' THEN supplied:=p_payload->'matches'; correct:=supplied=expected->'matches'; complete:=correct;
  WHEN 'image_hotspot' THEN correct:=p_payload->>'selected'=expected->>'correct'; complete:=correct;
  WHEN 'quiz' THEN correct:=p_payload->'answer'=expected->'correct'; complete:=correct;
  WHEN 'calculator' THEN
   IF coalesce(p_payload->>'value','')!~'^[-+]?[0-9]+([.][0-9]+)?$' THEN RAISE EXCEPTION 'Invalid calculator value'; END IF;
   correct:=(p_payload->>'value')::numeric BETWEEN coalesce((expected->>'min')::numeric,(expected->>'value')::numeric) AND coalesce((expected->>'max')::numeric,(expected->>'value')::numeric); complete:=correct;
  WHEN 'decision_tree' THEN
   IF NOT EXISTS(SELECT 1 FROM jsonb_array_elements(coalesce(b.content->'options','[]'::jsonb)) o WHERE o->>'id'=p_payload->>'selected') THEN RAISE EXCEPTION 'Invalid choice'; END IF;
   correct:=CASE WHEN expected ? 'correct' THEN p_payload->>'selected'=expected->>'correct' ELSE NULL END; complete:=true;
  WHEN 'scenario' THEN
   IF NOT EXISTS(SELECT 1 FROM jsonb_array_elements(coalesce(b.content->'options','[]'::jsonb)) o WHERE o->>'id'=p_payload->>'selected') THEN RAISE EXCEPTION 'Invalid choice'; END IF;
   correct:=CASE WHEN expected ? 'correct' THEN p_payload->>'selected'=expected->>'correct' ELSE NULL END; complete:=true;
  WHEN 'client_simulation' THEN
   IF NOT EXISTS(SELECT 1 FROM jsonb_array_elements(coalesce(b.content->'options','[]'::jsonb)) o WHERE o->>'id'=p_payload->>'selected') THEN RAISE EXCEPTION 'Invalid choice'; END IF;
   correct:=CASE WHEN expected ? 'correct' THEN p_payload->>'selected'=expected->>'correct' ELSE NULL END; complete:=true;
  WHEN 'flip_cards' THEN
   SELECT array_agg(value->>'id' ORDER BY value->>'id') INTO required_ids FROM jsonb_array_elements(coalesce(b.content->'cards','[]'));
   complete:=coalesce(ARRAY(SELECT jsonb_array_elements_text(coalesce(p_payload->'viewed','[]')) ORDER BY 1),'{}') @> coalesce(required_ids,'{}');
  WHEN 'step_reveal' THEN
   SELECT array_agg(value->>'id' ORDER BY value->>'id') INTO required_ids FROM jsonb_array_elements(coalesce(b.content->'steps','[]'));
   complete:=coalesce(ARRAY(SELECT jsonb_array_elements_text(coalesce(p_payload->'revealed','[]')) ORDER BY 1),'{}') @> coalesce(required_ids,'{}');
  WHEN 'checklist' THEN
   SELECT array_agg(value->>'id' ORDER BY value->>'id') INTO required_ids FROM jsonb_array_elements(coalesce(b.content->'items','[]')) WHERE coalesce((value->>'required')::boolean,true);
   complete:=coalesce(ARRAY(SELECT jsonb_array_elements_text(coalesce(p_payload->'checked','[]')) ORDER BY 1),'{}') @> coalesce(required_ids,'{}');
  WHEN 'prompt_builder' THEN complete:=jsonb_typeof(p_payload->'fields')='object' AND (SELECT count(*) FROM jsonb_each_text(p_payload->'fields') WHERE length(btrim(value))>=2)>=coalesce((b.content->>'minFields')::integer,2);
  WHEN 'practical_response' THEN complete:=length(btrim(coalesce(p_payload->>'text','')))>=coalesce((b.content->>'minLength')::integer,20);
  WHEN 'reflection' THEN complete:=length(btrim(coalesce(p_payload->>'text','')))>=coalesce((b.content->>'minLength')::integer,20);
  WHEN 'homework' THEN complete:=length(btrim(coalesce(p_payload->>'text','')))>=coalesce((b.content->>'minLength')::integer,20);
  WHEN 'submission' THEN complete:=(p_payload->>'kind' IN ('link','file')) AND length(btrim(coalesce(p_payload->>'value','')))>=5 AND (p_payload->>'kind'<>'file' OR p_payload->>'value' LIKE uid::text||'/%');
  ELSE complete:=coalesce((p_payload->>'acknowledged')::boolean,false);
 END CASE;
 max_value:=CASE WHEN correct IS NULL THEN 0 ELSE b.points END;
 score_value:=CASE WHEN correct THEN b.points ELSE 0 END;
 response:=coalesce(k.feedback,'{}')||jsonb_build_object('complete',complete);
 IF correct IS NOT NULL THEN response:=response||jsonb_build_object('correct',correct,'answer',expected); END IF;
 IF uid IS NULL OR admin_preview THEN
  RETURN jsonb_build_object('attemptId',p_attempt,'correct',correct,'score',score_value,'maxScore',max_value,'feedback',response,'progress',NULL,'preview',true);
 END IF;
 INSERT INTO public.academy_lesson_attempts_v2(id,user_id,academy_lesson_id,version_id,block_id,payload,score,max_score,is_correct,feedback)
 VALUES(p_attempt,uid,l.id,p_version,b.id,p_payload,score_value,max_value,correct,response);
 INSERT INTO public.academy_lesson_progress(user_id,academy_lesson_id,version_id,current_block_key,block_state,completed_block_keys)
 VALUES(uid,l.id,p_version,p_block_key,jsonb_build_object(p_block_key,p_payload),CASE WHEN complete THEN ARRAY[p_block_key] ELSE '{}' END)
 ON CONFLICT(user_id,academy_lesson_id) DO UPDATE SET version_id=EXCLUDED.version_id,current_block_key=EXCLUDED.current_block_key,
  block_state=CASE WHEN academy_lesson_progress.version_id=EXCLUDED.version_id THEN academy_lesson_progress.block_state||EXCLUDED.block_state ELSE EXCLUDED.block_state END,
  completed_block_keys=CASE
   WHEN academy_lesson_progress.version_id<>EXCLUDED.version_id THEN EXCLUDED.completed_block_keys
   WHEN complete AND NOT p_block_key=ANY(academy_lesson_progress.completed_block_keys) THEN array_append(academy_lesson_progress.completed_block_keys,p_block_key)
   ELSE academy_lesson_progress.completed_block_keys END,
  xp=CASE WHEN academy_lesson_progress.version_id=EXCLUDED.version_id THEN academy_lesson_progress.xp ELSE 0 END,
  score_percent=CASE WHEN academy_lesson_progress.version_id=EXCLUDED.version_id THEN academy_lesson_progress.score_percent ELSE NULL END,
  mastery_status=CASE WHEN academy_lesson_progress.version_id=EXCLUDED.version_id THEN academy_lesson_progress.mastery_status ELSE 'learning' END,
  completed_at=CASE WHEN academy_lesson_progress.version_id=EXCLUDED.version_id THEN academy_lesson_progress.completed_at ELSE NULL END,
  last_activity_at=now();
 progress:=academy_private.refresh_lesson_progress(uid,l.id);
 RETURN jsonb_build_object('attemptId',p_attempt,'correct',correct,'score',score_value,'maxScore',max_value,'feedback',response,'progress',progress);
END $$;
CREATE FUNCTION public.academy_complete_lesson_block(p_module text,p_lesson text,p_version uuid,p_block_key text,p_payload jsonb,p_attempt uuid) RETURNS jsonb LANGUAGE sql SECURITY INVOKER SET search_path='' AS $$ SELECT academy_private.complete_lesson_block(p_module,p_lesson,p_version,p_block_key,p_payload,p_attempt); $$;

CREATE FUNCTION academy_private.module_progress(p_module text) RETURNS jsonb
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path='' AS $$
BEGIN
 IF auth.uid() IS NULL OR NOT academy_private.can_access(p_module) THEN RAISE EXCEPTION 'Access denied' USING ERRCODE='42501'; END IF;
 RETURN (SELECT coalesce(jsonb_agg(jsonb_build_object('lessonId',l.lesson_id,'completed',p.completed_at IS NOT NULL,'xp',coalesce(p.xp,0),'scorePercent',p.score_percent,'masteryStatus',coalesce(p.mastery_status,'learning'),'currentBlockKey',p.current_block_key,'lastActivityAt',p.last_activity_at) ORDER BY l.lesson_id),'[]')
 FROM public.academy_lessons l LEFT JOIN public.academy_lesson_progress p ON p.academy_lesson_id=l.id AND p.user_id=(SELECT auth.uid()) WHERE l.module_id=p_module AND l.published_version_id IS NOT NULL AND l.status<>'archived');
END $$;
CREATE FUNCTION public.academy_get_module_progress(p_module text) RETURNS jsonb LANGUAGE sql SECURITY INVOKER SET search_path='' AS $$ SELECT academy_private.module_progress(p_module); $$;

CREATE FUNCTION academy_private.learning_summary() RETURNS jsonb
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path='' AS $$
DECLARE uid uuid:=(SELECT auth.uid());
BEGIN
 IF uid IS NULL THEN RAISE EXCEPTION 'Authentication required' USING ERRCODE='42501'; END IF;
 RETURN jsonb_build_object(
  'xp',(SELECT coalesce(sum(xp),0) FROM public.academy_lesson_progress WHERE user_id=uid),
  'mastered',(SELECT count(*) FROM public.academy_lesson_progress WHERE user_id=uid AND mastery_status='mastered'),
  'skills',(SELECT coalesce(jsonb_agg(jsonb_build_object('moduleId',l.module_id,'lessonId',l.lesson_id,'title',v.title,'skill',v.objective) ORDER BY p.completed_at DESC),'[]') FROM public.academy_lesson_progress p JOIN public.academy_lessons l ON l.id=p.academy_lesson_id JOIN public.academy_lesson_versions v ON v.id=p.version_id WHERE p.user_id=uid AND p.mastery_status='mastered'),
  'badges',(SELECT coalesce(jsonb_agg(jsonb_build_object('key',b.badge_key,'title',b.title,'description',b.description,'icon',b.icon,'earnedAt',u.earned_at) ORDER BY u.earned_at),'[]') FROM public.academy_user_badges u JOIN public.academy_badges b USING(badge_key) WHERE u.user_id=uid)
 );
END $$;
CREATE FUNCTION public.academy_get_learning_summary() RETURNS jsonb LANGUAGE sql SECURITY INVOKER SET search_path='' AS $$ SELECT academy_private.learning_summary(); $$;

-- Private file submissions use a user-id prefix. The bucket is created only on hosted Supabase.
DO $$ BEGIN
 IF to_regclass('storage.buckets') IS NOT NULL THEN
  EXECUTE $bucket$INSERT INTO storage.buckets(id,name,public,file_size_limit,allowed_mime_types)
   VALUES('academy-submissions','academy-submissions',false,10485760,ARRAY['application/pdf','image/png','image/jpeg','text/plain','application/vnd.openxmlformats-officedocument.wordprocessingml.document'])
   ON CONFLICT(id) DO NOTHING$bucket$;
 END IF;
END $$;
DO $$ DECLARE p record; BEGIN
 FOR p IN SELECT * FROM pg_policies WHERE schemaname='storage' AND tablename='objects' AND (coalesce(qual,'')||coalesce(with_check,'')) LIKE '%academy-submissions%' LOOP
  EXECUTE format('DROP POLICY %I ON storage.objects',p.policyname);
 END LOOP;
END $$;
CREATE POLICY academy_submission_read ON storage.objects FOR SELECT TO authenticated USING(bucket_id='academy-submissions' AND (split_part(name,'/',1)=(SELECT auth.uid())::text OR (SELECT academy_private.is_admin())));
CREATE POLICY academy_submission_insert ON storage.objects FOR INSERT TO authenticated WITH CHECK(bucket_id='academy-submissions' AND split_part(name,'/',1)=(SELECT auth.uid())::text);
CREATE POLICY academy_submission_update ON storage.objects FOR UPDATE TO authenticated USING(bucket_id='academy-submissions' AND split_part(name,'/',1)=(SELECT auth.uid())::text) WITH CHECK(bucket_id='academy-submissions' AND split_part(name,'/',1)=(SELECT auth.uid())::text);

-- RLS and grants. Students only receive lesson content through sanitized RPCs.
DO $$ DECLARE t text; BEGIN
 FOREACH t IN ARRAY ARRAY['academy_lessons','academy_lesson_versions','academy_lesson_blocks','academy_lesson_progress','academy_lesson_attempts_v2','academy_badges','academy_user_badges','academy_lesson_audit'] LOOP
  EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY',t);
  EXECUTE format('REVOKE ALL ON public.%I FROM PUBLIC,anon,authenticated',t);
  EXECUTE format('GRANT ALL ON public.%I TO service_role',t);
 END LOOP;
END $$;
GRANT SELECT ON public.academy_lessons,public.academy_lesson_versions,public.academy_lesson_blocks,public.academy_lesson_audit TO authenticated;
CREATE POLICY lesson_admin_read ON public.academy_lessons FOR SELECT TO authenticated USING((SELECT academy_private.is_admin()));
CREATE POLICY version_admin_read ON public.academy_lesson_versions FOR SELECT TO authenticated USING((SELECT academy_private.is_admin()));
CREATE POLICY block_admin_read ON public.academy_lesson_blocks FOR SELECT TO authenticated USING((SELECT academy_private.is_admin()));
CREATE POLICY audit_admin_read ON public.academy_lesson_audit FOR SELECT TO authenticated USING((SELECT academy_private.is_admin()));
GRANT SELECT ON public.academy_lesson_progress,public.academy_lesson_attempts_v2,public.academy_user_badges,public.academy_badges TO authenticated;
CREATE POLICY progress_own_read ON public.academy_lesson_progress FOR SELECT TO authenticated USING(user_id=(SELECT auth.uid()) OR (SELECT academy_private.is_admin()));
CREATE POLICY attempt_own_read ON public.academy_lesson_attempts_v2 FOR SELECT TO authenticated USING(user_id=(SELECT auth.uid()) OR (SELECT academy_private.is_admin()));
CREATE POLICY badge_catalog_read ON public.academy_badges FOR SELECT TO authenticated USING(true);
CREATE POLICY user_badge_own_read ON public.academy_user_badges FOR SELECT TO authenticated USING(user_id=(SELECT auth.uid()) OR (SELECT academy_private.is_admin()));

-- Retire the legacy editor path. Keep the table and exact backup for rollback/audit.
REVOKE INSERT,UPDATE,DELETE ON public.interactive_lessons FROM authenticated;
CREATE OR REPLACE FUNCTION academy_private.get_lesson(p_module text,p_lesson text) RETURNS jsonb
LANGUAGE sql STABLE SECURITY DEFINER SET search_path='' AS $$ SELECT academy_private.get_lesson_v2(p_module,p_lesson); $$;
REVOKE ALL ON FUNCTION academy_private.checkpoint(text,text,text,integer),public.academy_answer_checkpoint(text,text,text,integer) FROM PUBLIC,anon,authenticated;

REVOKE ALL ON FUNCTION
 academy_private.lesson_validation(uuid),academy_private.lesson_json(uuid,uuid,boolean),academy_private.get_lesson_v2(text,text),
 academy_private.admin_list_lessons(),academy_private.admin_get_lesson(uuid,uuid),academy_private.admin_preview_lesson(uuid,uuid),academy_private.admin_save_lesson(uuid,text,text,text,text,text,text,text,integer,jsonb,text),
 academy_private.admin_set_lesson_status(uuid,text,uuid),academy_private.admin_rollback_lesson(uuid,uuid),academy_private.admin_duplicate_lesson(uuid,text,text),
 academy_private.autosave_lesson(text,text,uuid,text,jsonb),academy_private.refresh_lesson_progress(uuid,uuid),academy_private.complete_lesson_block(text,text,uuid,text,jsonb,uuid),
 academy_private.module_progress(text),academy_private.learning_summary(),
 public.academy_get_lesson_v2(text,text),public.academy_admin_list_lessons(),public.academy_admin_get_lesson(uuid,uuid),public.academy_admin_preview_lesson(uuid,uuid),
 public.academy_admin_save_lesson(uuid,text,text,text,text,text,text,text,integer,jsonb,text),public.academy_admin_set_lesson_status(uuid,text,uuid),
 public.academy_admin_rollback_lesson(uuid,uuid),public.academy_admin_duplicate_lesson(uuid,text,text),public.academy_autosave_lesson(text,text,uuid,text,jsonb),
 public.academy_complete_lesson_block(text,text,uuid,text,jsonb,uuid),public.academy_get_module_progress(text),public.academy_get_learning_summary()
FROM PUBLIC,anon,authenticated;

GRANT EXECUTE ON FUNCTION academy_private.get_lesson_v2(text,text),public.academy_get_lesson_v2(text,text) TO anon,authenticated,service_role;
GRANT EXECUTE ON FUNCTION
 academy_private.admin_list_lessons(),academy_private.admin_get_lesson(uuid,uuid),academy_private.admin_preview_lesson(uuid,uuid),academy_private.admin_save_lesson(uuid,text,text,text,text,text,text,text,integer,jsonb,text),
 academy_private.admin_set_lesson_status(uuid,text,uuid),academy_private.admin_rollback_lesson(uuid,uuid),academy_private.admin_duplicate_lesson(uuid,text,text),
 public.academy_admin_list_lessons(),public.academy_admin_get_lesson(uuid,uuid),public.academy_admin_preview_lesson(uuid,uuid),public.academy_admin_save_lesson(uuid,text,text,text,text,text,text,text,integer,jsonb,text),
 public.academy_admin_set_lesson_status(uuid,text,uuid),public.academy_admin_rollback_lesson(uuid,uuid),public.academy_admin_duplicate_lesson(uuid,text,text)
TO authenticated,service_role;
GRANT EXECUTE ON FUNCTION
 academy_private.autosave_lesson(text,text,uuid,text,jsonb),academy_private.complete_lesson_block(text,text,uuid,text,jsonb,uuid),academy_private.module_progress(text),academy_private.learning_summary(),
 public.academy_autosave_lesson(text,text,uuid,text,jsonb),public.academy_complete_lesson_block(text,text,uuid,text,jsonb,uuid),public.academy_get_module_progress(text),public.academy_get_learning_summary()
TO authenticated,service_role;
GRANT EXECUTE ON FUNCTION academy_private.complete_lesson_block(text,text,uuid,text,jsonb,uuid),public.academy_complete_lesson_block(text,text,uuid,text,jsonb,uuid) TO anon;
GRANT EXECUTE ON FUNCTION academy_private.lesson_validation(uuid),academy_private.lesson_json(uuid,uuid,boolean),academy_private.refresh_lesson_progress(uuid,uuid) TO service_role;
