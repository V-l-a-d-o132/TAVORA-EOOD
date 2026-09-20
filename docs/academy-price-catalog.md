# Fixed price catalog

Verified account: `acct_1Too2ABAV4zTG6a3` (ТАВОРА ЕООД).
Created on 2026-09-20. All prices are one-time EUR prices. Old prices were
neither archived nor deleted. No real payment was made.

| Tier | EUR | Live Price ID | Test Price ID | Access |
|---|---:|---|---|---|
| systems-10 | 49 | `price_1UHa8XBAV4zTG6a3NlNZTPGa` | `price_1UHZrLBAV4zTG6a352iWRFlt` | s01-m01 … s01-m10 |
| koprinena-pateka | 99 | `price_1UHa8gBAV4zTG6a3GMS1HtKH` | `price_1UHZrvBAV4zTG6a3cfD3zHVi` | s01-m01 … s01-m11 |
| perfektno-video | 99 | `price_1UHa8nBAV4zTG6a3eBoYFBxC` | `price_1UHZs3BAV4zTG6a3OxkfoYJo` | s02-m01 … s02-m15 |
| marketing-basics | 129 | `price_1UHa8wBAV4zTG6a3arfgrfcD` | `price_1UHZsABAV4zTG6a3uTG7Rzlq` | s03-m01 … s03-m20 |
| premium-all | 249 | `price_1UHa94BAV4zTG6a3TvFuUZkY` | `price_1UHZsIBAV4zTG6a3Z2tfy28j` | All 46 modules and future modules |
| strategic_access | 497 | `price_1UHa9CBAV4zTG6a33WybHpWi` | `price_1UHZsQBAV4zTG6a3xhOVDjXR` | All modules; 2 strategy sessions fulfilled operationally |

Catalog tables have no anon/authenticated write grants or public read grants.
Live checkout_enabled defaults to false in the migration until the release gate
passes. Test prices cannot grant production access. The same grant model can
represent a single module, a group of modules, or all modules; new saleable
single-module products require an explicitly reviewed catalog addition.

Provisioning does not configure webhook destinations. The live endpoint and its
event subscriptions remain unchanged pending the end-to-end gate.
