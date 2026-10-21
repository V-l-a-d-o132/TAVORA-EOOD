CREATE TABLE academy_private.silk_first_service_candidates (
 release_key text NOT NULL CHECK (release_key='silk_first_service_v1'),
 module_id text NOT NULL CHECK (module_id IN ('s01-m01','s01-m02')),
 lesson_id text NOT NULL,
 expected_version_id uuid NOT NULL REFERENCES public.academy_lesson_versions(id),
 expected_fingerprint text NOT NULL CHECK(expected_fingerprint ~ '^[a-f0-9]{32}$'),
 payload jsonb NOT NULL CHECK(jsonb_typeof(payload)='object'),
 updated_at timestamptz NOT NULL DEFAULT now(),
 PRIMARY KEY(release_key,lesson_id)
);
ALTER TABLE academy_private.silk_first_service_candidates ENABLE ROW LEVEL SECURITY;
ALTER TABLE academy_private.silk_first_service_candidates FORCE ROW LEVEL SECURITY;
REVOKE ALL ON academy_private.silk_first_service_candidates FROM PUBLIC,anon,authenticated,service_role;
