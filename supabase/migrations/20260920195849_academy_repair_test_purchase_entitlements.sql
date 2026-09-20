-- Repair purchases recorded by the legacy verifier before the hardened
-- payment columns were added. The session prefix is Stripe-controlled and the
-- three affected sessions were read-only verified against the connected
-- TAVORA sandbox account before this migration was applied.
do $$
begin
  if exists (
    select 1 from public.academy_purchases
    where stripe_checkout_session_id like 'cs_test_%'
      and livemode = true
  ) and not exists (
    select 1 from academy_private.runtime_config
    where singleton and livemode = false
  ) then
    raise exception 'Refusing test purchase repair outside test payment mode';
  end if;

  if exists (
    select 1 from public.academy_purchases
    where stripe_checkout_session_id like 'cs_test_%'
      and status <> 'paid'
  ) then
    raise exception 'A test purchase has a non-paid status; review required';
  end if;
end
$$;

-- The production Supabase project currently uses the separately connected
-- TAVORA sandbox Stripe account. Pin only prices confirmed to exist there.
update public.academy_prices
set price_id = case tier_id
  when 'koprinena-pateka' then 'price_1UAos4BPjXAqYlz1LzU6ynaN'
  when 'marketing-basics' then 'price_1UGhfVBPjXAqYlz1yp7mKQp8'
  when 'premium-all' then 'price_1UHiJ1BPjXAqYlz11yfmm4z7'
end,
checkout_enabled = true
where livemode = false
  and tier_id in ('koprinena-pateka', 'marketing-basics', 'premium-all')
  and exists (
    select 1 from academy_private.runtime_config
    where singleton and livemode = false
  );

-- Do not offer sandbox tiers until their fixed Price IDs exist in this exact
-- Stripe account. This avoids dynamic price creation and cross-account IDs.
update public.academy_prices
set checkout_enabled = false
where livemode = false
  and tier_id in ('systems-10', 'perfektno-video', 'strategic_access')
  and exists (
    select 1 from academy_private.runtime_config
    where singleton and livemode = false
  );

update public.academy_purchases
set livemode = false,
    price_id = p.price_id,
    updated_at = now()
from public.academy_prices p
where academy_purchases.stripe_checkout_session_id like 'cs_test_%'
  and p.tier_id = academy_purchases.tier_id
  and p.livemode = false
  and p.historical = false;

do $$
declare
  affected_user uuid;
begin
  for affected_user in
    select distinct user_id
    from public.academy_purchases
    where stripe_checkout_session_id like 'cs_test_%'
      and livemode = false
      and status in ('paid', 'partially_refunded')
  loop
    perform academy_private.refresh_access(affected_user);
  end loop;
end
$$;
