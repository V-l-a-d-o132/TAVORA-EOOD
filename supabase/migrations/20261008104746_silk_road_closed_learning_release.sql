-- Protected staging for the explicitly authorized Silk Road rewrite.
-- Curriculum and grading payloads are supplied privately, never in this public repository.
-- This migration does not publish content or modify student progress.
CREATE TABLE academy_private.silk_road_release_lessons (
  release_key text NOT NULL CHECK (release_key = 'silk_road_closed_learning_20261008'),
  module_id text NOT NULL CHECK (module_id ~ '^s01-m(0[1-9]|1[01])$'),
  lesson_id text NOT NULL CHECK (lesson_id ~ '^l(0[1-9]|1[01])-[0-9]{2}$'),
  expected_version_id uuid NOT NULL REFERENCES public.academy_lesson_versions(id),
  payload jsonb NOT NULL CHECK (jsonb_typeof(payload) = 'object'),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (release_key, lesson_id),
  CHECK (payload->>'module' = module_id AND payload->>'lesson' = lesson_id),
  CHECK (payload->>'change_note' = release_key),
  CHECK (jsonb_typeof(payload->'blocks') = 'array')
);

ALTER TABLE academy_private.silk_road_release_lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE academy_private.silk_road_release_lessons FORCE ROW LEVEL SECURITY;
REVOKE ALL ON academy_private.silk_road_release_lessons FROM PUBLIC, anon, authenticated, service_role;
COMMENT ON TABLE academy_private.silk_road_release_lessons IS
  'Owner-only curriculum staging, including private grading. No API exposure or learner access. Publication is a separate guarded transaction.';
