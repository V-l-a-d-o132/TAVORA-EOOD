-- Newly provisioned fixed live prices. Activation requires a separate release migration
-- after a successful signed staging Checkout/refund/Auth test. No old prices are modified.
INSERT INTO public.academy_prices(price_id,tier_id,livemode,amount_cents,checkout_enabled) VALUES
('price_1UHa8XBAV4zTG6a3NlNZTPGa','systems-10',true,4900,false),
('price_1UHa8gBAV4zTG6a3GMS1HtKH','koprinena-pateka',true,9900,false),
('price_1UHa8nBAV4zTG6a3eBoYFBxC','perfektno-video',true,9900,false),
('price_1UHa8wBAV4zTG6a3arfgrfcD','marketing-basics',true,12900,false),
('price_1UHa94BAV4zTG6a3TvFuUZkY','premium-all',true,24900,false),
('price_1UHa9CBAV4zTG6a33WybHpWi','strategic_access',true,49700,false);
