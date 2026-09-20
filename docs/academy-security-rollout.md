# Academy security rollout — 2026-09-20

Status: changes implemented and locally verified; **production rollout blocked and not performed**. The Stripe test payment still requires user completion and a staging integration test. See [verification results](academy-validation.md) and [deployment commands](academy-deployment.md).

## Scope and inspected baseline

Repository base: ae0a7dc387c1e42edb6d31220e526ac2798ce11b (Readdy v280).
Supabase: plxqbbgjojxfnkgotrba. Stripe: acct_1Too2ABAV4zTG6a3.
Read-only checks: 17 profiles, 218 interactive lessons, 48 PDF progress rows,
228 checklist progress rows, 0 academy purchases. No production records were
deleted or rewritten. Schema-only capture: supabase/baseline/20260919-schema.json.

The existing public client bundled paid lesson content and answer keys.
New bundles use entitlement-checked RPCs. Old deployments, browser caches, and
public Git history still expose previously published copies. A branch cannot
retract those copies. Repository visibility/content distribution needs an owner
decision; do not rewrite history or delete lessons as a security rollback.

## Preflight before any production writes

1. Keep the deployed frontend and Edge versions available for rollback.
2. Confirm a restorable Supabase backup/PITR recovery point in the dashboard.
   This branch contains schema metadata, **not a user-data backup**.
3. Run scripts/academy-preflight.sql read-only. Capture counts and fingerprints
   privately. Stop on drift, duplicate sessions/intents, or changed index definitions.
4. Replay all versioned migrations on a separate staging database; set
   academy_private.runtime_config.livemode=false there using a staging-only
   migration. Never change that value to false in production.
5. Configure staging Edge secrets securely: Stripe test key, the matching test
   webhook signing secret, Supabase credentials, and exact staging origin.
   Secret values never belong in commits, logs or this document.
6. Complete a Stripe test Checkout, replay its signed event, check exact module
   rights, test full/partial refund and disputes, and test Auth with dedicated
   accounts. No real charges or real-customer test email.
7. Deploy the matching frontend, migrations and Edge functions in a coordinated
   release. Do not deploy only the database while the old client still writes
   quiz scores or falls back to bundled paid content.

## Fixed Stripe prices: mutation and rollback plan

Provision only one-time EUR Price objects for the six user-approved amounts:
4900, 9900, 9900, 12900, 24900, 49700 cents. Before creation, query the exact
academy_v2_<tier>_eur lookup keys in the correct account/mode. Reuse a match only
after verifying amount, currency and tier. Record returned IDs in a versioned
catalog migration; never create price_data dynamically at checkout.

Creating these prices does not charge a customer or alter existing subscriptions,
sessions or historical purchases. Do not archive or delete old prices. If the
release is abandoned, disable checkout_enabled in the catalog with a new migration
and archive only the newly created, unused prices after checking references.
Never delete payment records.

## Access, payments and recovery

- Paid access comes from paid/partially_refunded purchases in the database's
  configured mode plus explicit server-owned grants. Profiles are compatibility
  mirrors, not the authority. Preview s01-m01 remains available anonymously.
- Existing flags are copied into legacy-preserved-20260919 grants, flagged
  needs_review. Their legitimacy cannot be established from mutable old flags.
  Reconcile them with original evidence; a refunded purchase must not silently
  erase an unrelated legitimate manual grant.
- The first migration replays the captured existing schema in an empty
  auth/storage-capable environment. On existing production it leaves tables
  untouched. New migrations are additive and preserve progress.
- Use the six fixed prices in the catalog. Historical prices require explicit
  verified catalog entries with historical=true and checkout_enabled=false.
  Do not backfill by matching email alone. Use session metadata/client reference,
  exact line items, amount, currency and status.
- The webhook has verify_jwt=false and verifies the Stripe signature over the raw
  body. Verify/checkout require authenticated users. Signature secrets for different
  endpoints are not interchangeable.
- Database transactions deduplicate sessions, payment intents, Stripe event IDs,
  attempts and side-effect jobs. Provider retry keys are deterministic.
- Refund amounts are monotonic; a full refund/lost dispute removes only that
  purchase's rights. Partial refund keeps rights and sets needs_review.
  Unsent activation emails are cancelled if their purchase loses access; payment
  history and the original deduplicated analytics job are retained.
- Outbox leases last two minutes; failed/pending jobs make webhooks return 500 so
  Stripe retries. Automated sends stop after 23 hours from first attempt to stay
  within provider deduplication windows. Older/ambiguous jobs require provider
  delivery reconciliation before any manual resend.

## Safe failure / rollback

If checkout or fulfillment fails, disable new checkouts via a forward migration
(academy_prices.checkout_enabled=false). Keep the ledger and webhook signature
checks running so paid events are recoverable. Do not restore public lesson
policies, client-writable entitlements or exposed answer keys.

Restore the last compatible frontend/Edge build only if it uses the secured API.
If that is impossible, show maintenance for checkout/learning while fixing forward.
Do not drop new tables, grants or historical snapshots to roll back application code.
The private access snapshot allows an audited, narrowly scoped restoration of a
specific user's legacy grant; it is not permission to overwrite new purchases.

## Required dashboard settings and remaining release gates

- Auth redirects: canonical production URLs, /reset-password, exact staging URL;
  localhost only for local testing. Email signup and Google provider are enabled,
  email confirmation is required (public Auth settings read successfully).
  Actual email delivery, Google callback and recovery links still need dedicated
  end-to-end accounts. Leaked password protection is currently disabled.
- Use academy-stripe-webhook with checkout.session.completed,
  checkout.session.async_payment_succeeded, checkout.session.async_payment_failed,
  charge.refunded, charge.dispute.created, charge.dispute.closed.
- Existing live endpoint we_1TrG5ZBAV4zTG6a3Uz6XqIda points to stripe-webhook.
  Capture its settings and signing-secret association privately. The old handler
  also served legacy-product analytics: preserve those flows and avoid double
  Academy Purchase events when changing endpoints. Switch only after a signed
  staging delivery and paired frontend release.
- Keep new prices disabled in live catalog until the test payment gate passes.
- Exactly one academy payment was found: EUR 14.99, source downsell-email,
  tier systems-10, matching metadata/client reference, owner present in Auth and
  profiles, 10 legacy module flags, no refund/dispute. Its exact historical price
  is allowlisted by migration 20260920064237. The EUR 12 payment is the separate
  legacy checklist product and must not become an academy purchase.
  After deployment, run scripts/reconcile-academy.ts with that existing session,
  first without --apply, then with --apply --allow-live using securely supplied
  environment variables. The script cannot create/confirm a payment. Historical
  fulfillment suppresses new email/Meta Purchase jobs.
  The matching legacy grant remains needs_review until its provenance is resolved:
  link or retire only its purchase-derived rights in a reviewed forward migration.
  Otherwise it intentionally survives a refund as a preserved legacy grant.
- Advisors were read on production before rollout. Unapplied migrations cannot be
  represented as fixed production findings.
