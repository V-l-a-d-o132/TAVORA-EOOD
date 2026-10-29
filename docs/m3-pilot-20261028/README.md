# Module 3 editorial pilot · 2026-10-28

Ten lessons have separate v14 drafts in Supabase; the existing v13 publication pointers stay active. The full paid readings, baseline copy, standalone transfer cases and teacher rubric are held privately. This directory contains rollout metadata only; the public workbook contains generic authoring tools.

Visible lesson words, counted by the unchanged repository `countVisibleLessonWords`: **18,809 → 19,081 (+272, +1.45%)**. See `word-counts.json` for all ten lessons. The detailed theory and formative questions remain; ten main matching tasks become authored practice, first attempts, feedback, correction and transfer.

## Owner deployment

1. Pull tested `main` and publish using the owner's normal Readdy workflow.
2. Verify `/academy-labs/silk-road/m03-pilot-20261028/workbook.html` at the production origin. Check authoring, JSON-LD export, CTR period mismatch, saved workbook restoration and the existing Academy login/payment boundary.
3. Only after the exact assets are live, run `scripts/m3-pilot-20261028/publish.sql` through an authorized administrative connection. It validates both version fingerprints, archives current progress and changes only the ten Module 3 publication pointers.
4. Inspect one lesson as a permitted student and verify the workbook link. No hosting login or automatic deployment is part of this change.

## Restore the previous edition

Run `scripts/m3-pilot-20261028/rollback.sql` only while this exact pilot is active. It restores the ten v13 versions and archived prior progress, retains pilot attempts and progress history, and leaves the drafts available. A learner who first entered during the pilot receives an empty baseline state while their pilot state is retained. Re-publishing resumes the archived pilot state. Other modules, enrolments, payments and general database state are outside the scripts' scope.

The branch `backup/m3-before-pilot-20261028` records the starting code commit. Editorial rollback uses the guarded SQL, not a repository reset or whole-database restore. Both scripts stop if the recorded content fingerprints or active pointers have changed; inspect that change before retrying.

## Validation and acceptance

- `rehearse.sql` exercises publish → existing/new learner progress → rollback → republish/resume → rollback inside an outer transaction that ends in ROLLBACK. It checks exact prior progress and unchanged attempt counts. The rehearsal passed with all ten v13 lessons still published and all 14 existing progress rows unchanged.
- Local DOM checks cover own text, portable saved state, escaping, weighted CTR, zero denominator, period mismatch, hours and stale-check invalidation. Playwright tests exercise the same user-visible flows in Chromium, including a 320 px viewport, downloads and fresh contexts; the repository CI must pass before merge.
- Automatic lesson questions and workbook calculations are formative checks. Independent review of authored work, the private K-3 transfer case and delayed recall determine project acceptance. No beginner pilot results are claimed.

The workbook imports only seven known text fields from the Module 2 backup. Original layout, images, form behavior and test records remain in that original artifact. The SEO HTML is a separate, clearly marked learning export with noindex. Its local JSON parser does not certify Schema.org facts or Google eligibility. CTR aggregation depends on the student's declared non-overlap and matching periods; the tool does not access Search Console or infer sales.
