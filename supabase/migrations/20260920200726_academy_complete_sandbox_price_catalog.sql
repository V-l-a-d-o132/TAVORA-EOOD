do $$
begin
  if not exists (
    select 1 from academy_private.runtime_config
    where singleton and livemode = false
  ) then
    return;
  end if;

  update public.academy_prices
  set price_id = case tier_id
    when 'systems-10' then 'price_1UHr0HBPjXAqYlz1fi0o8dxw'
    when 'perfektno-video' then 'price_1UHr0RBPjXAqYlz1Y4yZD47h'
    when 'strategic_access' then 'price_1UHr0bBPjXAqYlz1LRmF1upu'
  end,
  checkout_enabled = true
  where livemode = false
    and tier_id in ('systems-10', 'perfektno-video', 'strategic_access');

  if (
    select count(*) from public.academy_prices
    where livemode = false and checkout_enabled and not historical
  ) <> 6 then
    raise exception 'Sandbox catalog must contain exactly six enabled current prices';
  end if;
end
$$;
