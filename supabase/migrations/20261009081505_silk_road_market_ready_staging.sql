-- Protected authoring checkpoint for the authorized s01 depth and practice release.
-- This migration changes no published lesson or learner record.
CREATE TABLE academy_private.silk_road_market_lessons (
 release_key text NOT NULL CHECK (release_key='silk_road_market_ready_20261009'),
 module_id text NOT NULL CHECK (module_id ~ '^s01-m(0[1-9]|1[01])$'),
 lesson_id text NOT NULL CHECK (lesson_id ~ '^l(0[1-9]|1[01])-[0-9]{2}$'),
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
ALTER TABLE academy_private.silk_road_market_lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE academy_private.silk_road_market_lessons FORCE ROW LEVEL SECURITY;
REVOKE ALL ON academy_private.silk_road_market_lessons FROM PUBLIC,anon,authenticated,service_role;
COMMENT ON TABLE academy_private.silk_road_market_lessons IS
 'Owner-only full curriculum and private grading checkpoint. Guarded publication occurs separately; original snapshot cannot be refreshed by routine payload updates.';
