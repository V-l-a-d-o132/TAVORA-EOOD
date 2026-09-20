# TAVORA security verification — 2026-09-20

Branch: `security/academy-foundation-20260919`.
Base: `ae0a7dc387c1e42edb6d31220e526ac2798ce11b`.

The branch implements the security foundation and passes the local checks below.
**This is not a completed production rollout or an end-to-end payment certification.**
No Supabase production migrations or Edge deployments were performed. The existing
production vulnerabilities remain until the coordinated release and its checks pass.

## Executed checks

| Check | Result | Scope |
|---|---|---|
| `npm ci --no-fund` | PASS | Clean dependency installation from the committed lockfile |
| `npm run lint` | PASS | Zero ESLint warnings/errors |
| `npm run typecheck` | PASS | React/TypeScript application |
| `npm test` | PASS, 64 tests / 4 files | PostgreSQL policies, transactions, Stripe validation, signed HTTP handler, reset UI |
| `npm run check:edge` | PASS | Eight Edge entrypoints and historical reconciliation script |
| `npm run build` | PASS | Production assets, matching PDF worker, paid-content bundle exclusion guard |
| `npm audit --omit=dev --json` | PASS, 0 known vulnerabilities | Production dependency tree at time of verification |
| `git diff --check` | PASS | Patch whitespace |
| Credential scan | PASS | No Stripe secrets, webhook signing secrets, Resend keys or service-role JWTs in changed/tracked text files |

The PostgreSQL tests replay the actual six migrations in PGlite with isolated
synthetic users, Supabase-style roles, JWT identity functions, and a storage table.
They exercise PostgreSQL permissions/RLS and transactions, not a mocked permission
check. They do not run the hosted Supabase Auth, Storage gateway or PostgREST service.
HTTP webhook tests use Stripe's signature verifier and a mocked Stripe/database
transport; database behavior is independently exercised in PostgreSQL.

Coverage includes self-elevation denial, anonymous preview and paid-content denial,
server grading without exposed answers, admin/member separation, exact package
grants, owner/price/currency/mode/amount validation, duplicate sessions and events,
test/live separation, partial/full refunds, overlapping purchases, refunds arriving
before completion, disputes and stale events, email/outbox claims and retry windows,
cancelled activation emails, safe redirects and password-reset success/failure UI.

## External checks and changes

- Supabase read-only baseline: 17 profiles, 218 lessons, 48 PDF progress rows,
  228 checklist progress rows, zero academy purchases. Migration history was empty.
  No users, progress, lessons or payments were deleted or rewritten.
- Public Auth settings respond successfully: signup/email/Google enabled;
  email confirmation required. Actual confirmation mail, Google OAuth callback,
  recovery mail, login/logout and reset completion against hosted Auth remain
  unverified end to end. Component tests are not a substitute for those checks.
- Created six test and six live fixed one-time prices in the verified TAVORA
  account. Exact IDs and access mapping: [price catalog](academy-price-catalog.md).
  No old price was archived/deleted. Live prices stay disabled in the new database
  catalog until a separate release migration enables them.
- Existing live webhook destination/event settings were not changed. It still
  points to `stripe-webhook`; migration to `academy-stripe-webhook` is a release gate.
- An actual Stripe test Checkout was created for EUR 49 and opened in Sandbox.
  **Automatic approval review rejected the final `submit_payment` browser action**
  and required user handoff even in test mode. The session was re-read as open/unpaid;
  no charge was made. No alternate API was used to bypass this rejection.
  This checkout used a synthetic owner and does not prove staging fulfillment.
- One historical academy payment (EUR 14.99, systems-10, downsell source) was
  checked against its Price, line item, metadata owner, matching client reference,
  Auth/profile presence, and latest charge: no refund/dispute. Its owner already
  has ten legacy module flags. The separate EUR 12 checklist payment is excluded.
  A dry-run-first reconciliation script is included but has not been executed
  against production because the schema and secure runtime configuration are not
  deployed. No historical purchase was silently invented.

## Versioned migrations

| File | Purpose |
|---|---|
| `20260919204858_existing_public_schema.sql` | Captured schema baseline; replay only when the existing schema is absent |
| `20260919204901_academy_security_foundation.sql` | Private snapshot, products/prices/grants, RLS, privileges, storage access, guarded redundant-index removal |
| `20260919204904_academy_payments_and_quizzes.sql` | Atomic purchases/adjustments/outbox, grading RPCs and sanitized lesson API |
| `20260920015546_academy_existing_quizzes_and_test_prices.sql` | Eight existing authored quizzes (22 questions) and six verified test prices |
| `20260920020657_academy_live_price_catalog.sql` | Six verified live prices, checkout disabled pending release |
| `20260920064237_academy_historical_price_and_delivery_safety.sql` | Verified historical price, leased email delivery and supporting indexes |

All six are tested locally and unapplied on production. The schema baseline is
not a backup of customer data. Progress data is not rewritten by these migrations.

## Production advisors, before rollout

These counts come from the Supabase security/performance advisors, read again on
2026-09-20. They describe production, not the locally migrated test database.

| Finding | Count | Treatment in this branch / remaining work |
|---|---:|---|
| [Mutable function search path](https://supabase.com/docs/guides/database/database-linter?lint=0011_function_search_path_mutable) | 2 | Migration fixes the two existing functions |
| [Anon SECURITY DEFINER execution](https://supabase.com/docs/guides/database/database-linter?lint=0028_anon_security_definer_function_executable) | 2 | Trigger function execution revoked; new privileged implementations live in the private schema |
| [Authenticated SECURITY DEFINER execution](https://supabase.com/docs/guides/database/database-linter?lint=0029_authenticated_security_definer_function_executable) | 2 | Same privilege reduction; exposed content RPCs are invokers |
| [Extension in public](https://supabase.com/docs/guides/database/database-linter?lint=0014_extension_in_public) | 1 | `pg_net` remains; verify managed-extension relocation support and dependencies before a separate migration |
| [RLS with no policy](https://supabase.com/docs/guides/database/database-linter?lint=0008_rls_enabled_no_policy) | 2 info | `leads` and `meta_capi_logs` intentionally server-only; no permissive client policy added |
| [Leaked-password protection](https://supabase.com/docs/guides/auth/password-security#password-strength-and-leaked-password-protection) | 1 | Disabled; enable in Auth settings if supported by the project plan |
| [Auth RLS initplan](https://supabase.com/docs/guides/database/database-linter?lint=0003_auth_rls_initplan) | 38 | Replacement policies use `(select auth.uid())` where independent of the row |
| [Multiple permissive policies](https://supabase.com/docs/guides/database/database-linter?lint=0006_multiple_permissive_policies) | 61 | Existing public-policy set replaced; rerun advisors after rollout for remaining intentional overlaps |
| [Duplicate index](https://supabase.com/docs/guides/database/database-linter?lint=0009_duplicate_index) | 1 | Remove only the confirmed redundant PDF-progress UNIQUE constraint if its equivalent still exists |
| [Unused index](https://supabase.com/docs/guides/database/database-linter?lint=0005_unused_index) | 6 info | Kept: low-traffic usage statistics alone do not justify deleting indexes |

## Remaining release gates and risks

1. A separate staging project, securely configured test key/signing secret, matching
   frontend deployment, and a user-completed test Checkout are required. The
   available connector does not expose Edge secret configuration, and no local
   service-role/Stripe secret was supplied or extracted. See the
   [deployment procedure](academy-deployment.md).
2. Confirm a restorable production backup before changing data; capture the private
   preflight fingerprints. Then run the hosted Auth/payment/storage integration matrix
   and compare counts and progress fingerprints after rollout.
3. Legacy flags were client-writable. They are preserved as server-owned grants
   with `needs_review=true`, not treated as evidence of payment. Review their
   provenance. The historical ten-module grant must be linked/retired only when
   proven to derive from the historical purchase; otherwise it survives a refund
   as a preserved grant. This is an unresolved historical-access risk.
4. Previously published lesson/answer bundles and public Git history remain
   recoverable. The new bundle excludes them, but cannot retract existing copies.
5. Webhook cutover must preserve the legacy checklist product's event handling.
   Outbox/email retries stop after 23 hours to avoid crossing provider idempotency
   windows; older ambiguous deliveries require provider-log reconciliation before
   any resend. Monitor failed webhook deliveries and pending outbox rows.
6. The existing eight authored quizzes are migrated; lessons without authored
   questions no longer receive fake fallback quizzes. New educational content and
   the two strategy sessions are outside this security phase.

Rollback/preflight details: [security rollout](academy-security-rollout.md).
