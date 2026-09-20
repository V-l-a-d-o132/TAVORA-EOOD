# Deployment and remaining manual steps

Use this procedure only after reviewing [the rollout and rollback plan](academy-security-rollout.md).
The commands below have **not** been run against production in this change.
Never paste secret values into an issue, chat, commit, or command log.

## 1. Configure and verify staging

Use a separate Supabase project and a separate working copy/branch for staging.
Supply its real project reference as `ACADEMY_STAGING_REF` in the local shell.

```sh
npm ci
npx supabase link --project-ref "$ACADEMY_STAGING_REF"
npx supabase db push --dry-run
npx supabase db push
npx supabase migration new academy_staging_payment_environment
```

In that newly generated **staging-only** migration, set:

```sql
UPDATE academy_private.runtime_config SET livemode=false WHERE singleton;
```

Commit it on the staging configuration branch and apply it there. Do not merge or
copy this staging-only migration into the production migration directory. Production
must retain `livemode=true`. Create dedicated staging Auth accounts; no production
user identities or progress are needed for test payments.

Set Edge secrets using a private file outside the repository or inside ignored
`.academy-private/`. Required names:

| Name | Value/source |
|---|---|
| `STRIPE_SECRET_KEY` | Test secret/restricted key from the verified TAVORA Stripe account in test mode |
| `STRIPE_WEBHOOK_SECRET` | Signing secret belonging to the staging Academy endpoint |
| `ACADEMY_ALLOWED_ORIGINS` | Exact staging origin, comma-separated if more than one; no wildcard or path |
| `RESEND_API_KEY` | Authorized sender credential; use dedicated test recipients |
| `META_CAPI_ACCESS_TOKEN` | Production only after release; test purchases never enqueue email/Meta jobs |

Supabase injects `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` into hosted Edge
functions. Do not put them in the Vite frontend. For the local reconciliation
script only, provide them via a securely managed local environment.

```sh
npx supabase secrets set --project-ref "$ACADEMY_STAGING_REF" --env-file .academy-private/edge.env
npx supabase functions deploy academy-stripe-checkout --project-ref "$ACADEMY_STAGING_REF"
npx supabase functions deploy academy-stripe-verify --project-ref "$ACADEMY_STAGING_REF"
npx supabase functions deploy academy-stripe-webhook --project-ref "$ACADEMY_STAGING_REF" --no-verify-jwt
npx supabase functions deploy send-welcome-email --project-ref "$ACADEMY_STAGING_REF"
npx supabase functions deploy send-downsell-email --project-ref "$ACADEMY_STAGING_REF"
npx supabase functions deploy send-abandoned-cart-email --project-ref "$ACADEMY_STAGING_REF"
npx supabase functions deploy pdf-manager --project-ref "$ACADEMY_STAGING_REF"
npx supabase functions deploy meta-conversions-api --project-ref "$ACADEMY_STAGING_REF"
```

In Stripe test mode, configure a webhook to the staging project's
`/functions/v1/academy-stripe-webhook` with these event types:

```text
checkout.session.completed
checkout.session.async_payment_succeeded
checkout.session.async_payment_failed
charge.refunded
charge.dispute.created
charge.dispute.closed
```

Save its signing secret securely as above. The webhook bypasses Supabase JWT
verification only; it still requires a valid Stripe signature.

Build/deploy this branch's frontend to the exact allowed staging origin. Set
`VITE_PUBLIC_SUPABASE_URL` and `VITE_PUBLIC_SUPABASE_ANON_KEY` to the staging project
through a private environment or the hosting provider. The tracked public `.env`
points to production; do not accidentally use it for staging. SPA routing must
serve `index.html` for `/reset-password` and the existing app routes.

## 2. Finish the hosted integration checks

The final test-payment click requires a user: the automatic approval review
rejected the agent's Sandbox `submit_payment` action. Use Stripe's official test
card data only, never real card details. Start a fresh Checkout from the staging
app while signed in as a dedicated staging user, so metadata/reference identify a
real staging profile. Completing the earlier synthetic-owner checkout alone does
not validate account fulfillment.

| Scenario | Required observation |
|---|---|
| Signup + confirmation | Mail arrives at the controlled inbox; callback creates/uses one profile |
| Login + logout | Intended relative page restored; logout removes member/admin access |
| Google OAuth | Callback returns to the allowed app origin and intended page |
| Forgot/reset password | Recovery mail opens `/reset-password`, new password works, old password fails |
| Ordinary/admin users | Direct REST/storage/RPC requests enforce the same permissions as the UI |
| Preview vs paid lesson | Anon reads s01-m01 via RPC, fails for paid modules and raw answer keys |
| Each paid test tier | One paid test session grants exactly its configured module set |
| Another user's session | Verify returns 403; purchase ownership is unchanged |
| Replay signed event | One purchase and no duplicated side-effect jobs |
| Async success/failure | Access appears only after success; failure cannot grant access |
| Partial/full test refund | Partial flags review; full revokes that purchase; independent rights remain |
| Test dispute events | Lost revokes, won restores; stale created event cannot override terminal status |

Use staging/test payments for refund/dispute simulation. Do not refund historical
live customer purchases as a test. Email/provider delivery and Meta production
configuration need separate controlled verification; synthetic unit fixtures are
not evidence that those providers delivered.

## 3. Prepare production and cut over

1. Confirm a restorable backup/recovery point in Supabase. Run
   `scripts/academy-preflight.sql` read-only and retain results privately.
2. Return to the production release branch, which contains only the six reviewed
   migrations. Stop if the schema or expected counts drifted.
3. Arrange a short coordinated release/maintenance window in the existing hosting
   system (Readdy). Keep the current build/version identifiers privately for rollback.
4. Securely configure the production Stripe key and the signing secret of the
   endpoint that will deliver to the new Academy webhook, plus provider credentials.
   Default allowed production origins are `https://imashnujnoto.com` and its `www`
   origin. Localhost is allowed only with a test-mode key.

```sh
npx supabase link --project-ref plxqbbgjojxfnkgotrba
npx supabase db push --dry-run
npx supabase db push
```

Deploy the same function list as staging with project ref `plxqbbgjojxfnkgotrba`,
using the live secrets and the JWT settings in `supabase/config.toml`. Academy
checkout/verify/email/PDF endpoints require JWTs. The signed webhook and existing
public analytics endpoint do not; client Academy Purchase events are rejected by
the latter and emitted only from the verified payment outbox.
Deploy the matching frontend. Keep checkout disabled until the integration gates
are signed off; do not run the old frontend against the new grading restrictions.

In Stripe live Webhooks, update the Academy delivery destination to
`https://plxqbbgjojxfnkgotrba.supabase.co/functions/v1/academy-stripe-webhook`
and configure the six events above. Existing endpoint
`we_1TrG5ZBAV4zTG6a3Uz6XqIda` currently serves the old handler and legacy analytics.
Preserve routing for the separate checklist product's events; confirm that the old
handler cannot emit a second Academy Meta Purchase. Use the new handler's metadata
filter for unrelated checkout sessions. Check delivery status/signature failures
before enabling checkout.

Generate a new release migration only after the gates pass:

```sh
npx supabase migration new academy_enable_live_checkout
```

Put this reviewed statement in it, commit it, run `db push --dry-run`, then apply:

```sql
UPDATE public.academy_prices
SET checkout_enabled=true
WHERE livemode AND NOT historical AND price_id IN (
 'price_1UHa8XBAV4zTG6a3NlNZTPGa', 'price_1UHa8gBAV4zTG6a3GMS1HtKH',
 'price_1UHa8nBAV4zTG6a3eBoYFBxC', 'price_1UHa8wBAV4zTG6a3arfgrfcD',
 'price_1UHa94BAV4zTG6a3TvFuUZkY', 'price_1UHa9CBAV4zTG6a33WybHpWi'
);
```

In Supabase Auth URL Configuration, set the canonical Site URL and allow production
callback paths, `/reset-password`, and exact staging/local development callbacks
where appropriate. Avoid cross-domain wildcard redirects. Enable leaked-password
protection if the project plan supports it.

Re-run advisors, direct role/API checks, counts and progress fingerprints after the
release. Confirm 17 existing profiles and all original progress survive unchanged,
allowing separately identified real activity since the preflight.

## 4. Reconcile the verified historical purchase

Supply `ACADEMY_HISTORICAL_SESSION` from the verified EUR 14.99 academy transaction
in the account dashboard. Do not use the EUR 12 legacy checklist session. Provide
the live Stripe key and Supabase service credentials securely to Deno.

```sh
npx deno run --allow-env --allow-net scripts/reconcile-academy.ts "$ACADEMY_HISTORICAL_SESSION"
npx deno run --allow-env --allow-net scripts/reconcile-academy.ts "$ACADEMY_HISTORICAL_SESSION" --apply --allow-live
```

The first command is read-only. Review its tier/amount/owner-exists summary before
running the second. The script records the existing settled payment, and cannot
create or confirm a charge. The historical catalog flag suppresses new email/Meta
Purchase jobs. Review the matching legacy grant's provenance; any linkage/removal
of purchase-derived rights must be a narrowly scoped, versioned forward migration.
Retain unrelated legitimate grants and all progress.

For rollback, disable new checkouts through a new migration and follow the
[safe failure procedure](academy-security-rollout.md#safe-failure--rollback).
Do not restore the former public-content or client-writable-access policies.
