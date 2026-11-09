# Silk Road module 4: authored content dossier

The ten primary exercises previously assembled supplied choices. The published v14 lessons ask learners to create text, SVG cards, a real local video, captions, a case study, version records and a production report. Existing theory and 46 additional graded exercises remain. A teacher accepts the artifacts separately from automatic XP.

## Release state

All ten Module 4 lessons were published as v14 on 9 November 2026. The active and editor versions match in every lesson. Each practice links to its matching workbook stage. Modules 1 through 5 now have 44 published lessons, with no newer draft among them.

The live workbook matched the reviewed file byte for byte. The plan, video and report stages opened, and the live HTML download succeeded. Opening the protected student lesson led to the login page. The signed-in student journey remains unverified.

The owner archive contains the full readings, old content, editorial maps, hidden transfer case and teacher rubric. None of that paid or hidden material is in this public repository. Public assets contain generic tooling, metadata and guarded SQL only. Private answer keys are copied server-side; no keys or learner records are exported.

## Workbook

`/academy-labs/silk-road/m04-pilot-20261029/workbook.html`

Ten authoring stages; local saving; first-attempt snapshots; reviewed JSON import/export; self-contained HTML copy; Markdown dossier. M3 import copies five known text fields after review, preserving M4 exclusions and other work. Full M4 restore intentionally replaces the whole dossier after a visible warning.

The generic tools check time budgets, a supplied consent/suppression rule, SVG text fitting, WebVTT cue timing, neutral UTM structure and production ratios. A successful check is limited to its input; it does not approve facts, legal bases, learning outcomes or client results. Zero denominators remain undefined. Reports require declared comparable periods, workload and criteria.

Video is selected locally via a blob URL and never uploaded or embedded in backups. WebVTT is a separate subtitle track; the workbook does not record the screen, edit video or burn captions into frames. A playable real video is required for the primary module project. Save and hand in media separately. Editing cues removes the previous subtitle track until explicitly reapplied.

SVG cards contain escaped text with no external assets or script. Oversized text is rejected rather than clipped. UTM construction is restricted to an inert `example.invalid` destination and requires a human privacy review; syntax checks cannot identify every personal name or identifier.

## Word counts and verification

Exact repository `countVisibleLessonWords`: **19,301 → 19,524**, **+223 (+1.16%)**. See `word-counts.json` for lesson values. This is content volume, not measured completion time. Duration estimates are planning placeholders; no beginner pilot has been conducted.

Local Node + LinkeDOM checks cover restoration, escaping, reviewed imports, suppression, calculations, SVG overflow guards and cue intervals. LinkeDOM has no layout or video decoder; Chromium CI checks actual layout, canvas measurement, local video metadata and downloads. The nine M4 browser checks run with the repository's existing suite.

Supabase candidate validation passed for all ten lessons. The publish → existing/new learner → rollback → republish/resume → rollback rehearsal passed inside an outer transaction that was rolled back. The 12 existing progress records matched before and after publication. Attempts are preserved. No schema, authentication, RLS, payment or email service changes.

## Publication and recovery

The guarded publication completed on 9 November 2026 and created one publication audit for each of the ten lessons. Validation returned zero errors. The ten original v13 versions are available for recovery. The aggregate number of recorded attempts matched before and after publication.

For an editorial rollback of this release, use `scripts/m4-pilot-20261029/rollback.sql`. It verifies the active edition, restores archived progress and the exact v13 versions, and retains v14 progress for resumption. The publication and rehearsal scripts require their expected starting state. The owner continues to pull and publish website assets manually.

Backup branch: `backup/m4-before-pilot-20261029`, at `6ee16dfbea5c32637ac4a737fa584c14295eee34`. Do not rerun the private staging script: the candidates already exist. Changed scope, drafts, pointers or fingerprints cause a failure; inspect the change instead of removing guards.
