-- Protected authoring checkpoint for the authorized s02 story-first release.
-- This migration changes no published lesson or learner record.
CREATE TABLE academy_private.perfect_video_story_lessons (
 release_key text NOT NULL CHECK (release_key='perfect_video_story_first_20261010'),
 module_id text NOT NULL CHECK (module_id ~ '^s02-m(0[1-9]|1[0-5])$'),
 lesson_id text NOT NULL CHECK (lesson_id ~ '^pv(0[1-9]|1[0-5])-[0-9]{2}$'),
 expected_version_id uuid NOT NULL REFERENCES public.academy_lesson_versions(id),
 expected_fingerprint text NOT NULL CHECK (expected_fingerprint ~ '^[a-f0-9]{32}$'),
 payload jsonb NOT NULL CHECK (jsonb_typeof(payload)='object'),
 created_at timestamptz NOT NULL DEFAULT now(),
 updated_at timestamptz NOT NULL DEFAULT now(),
 PRIMARY KEY (release_key,lesson_id),
 CHECK (payload->>'module'=module_id AND payload->>'lesson'=lesson_id),
 CHECK (payload->>'change_note'=release_key),
 CHECK (jsonb_typeof(payload->'blocks')='array')
);
ALTER TABLE academy_private.perfect_video_story_lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE academy_private.perfect_video_story_lessons FORCE ROW LEVEL SECURITY;
REVOKE ALL ON academy_private.perfect_video_story_lessons FROM PUBLIC,anon,authenticated,service_role;
COMMENT ON TABLE academy_private.perfect_video_story_lessons IS
 'Owner-only full curriculum and private grading checkpoint. Guarded publication occurs separately; original snapshot cannot be refreshed by routine payload updates.';
