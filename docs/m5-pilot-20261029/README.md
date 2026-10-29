# Module 5 · author-produced practice

Release `silk_m05_pilot_20261029` changes all ten Module 5 lessons from v12 to v13. Each primary exercise now requires the learner's own text, image, video, response or channel report, with an initial attempt, feedback, correction, transfer and delayed recall. The 48 other graded blocks retain their content and points. Teacher acceptance of the produced work is separate from XP.

The current fictional client brief is P-3. All mandatory inputs are in the lessons; exercises use the existing renderer, the existing Module 2 prototype and local files. No new frontend asset, paid plan, advertising spend or public social account is required. No frontend code or access rules change.

## Release and recovery

The owner explicitly requested direct delivery to `main` and active Module 5 lessons. GitHub contains editorial release metadata and word counts. Readings, database identities, fingerprints, recovery scripts, old-content export, transfer cases and the teacher rubric remain in the private owner package. Merging or pulling code alone does not publish database lessons. Run the guarded publication script only after validation and verify the actual pointers afterwards.

- Code baseline: `0cc4e67a579ef205d1cf7ac43aa2fcaeb7e4da26`.
- Backup branch: `backup/m5-before-pilot-20261029`.
- Database baseline: the ten original v12 versions, retained in the database.
- The private owner package contains the exact manifest and guarded publish, rollback, rehearsal and read-only verification scripts.

Scripts lock only Module 5, verify exact version identities and content fingerprints, and stop if an editor has changed the expected state. They retain attempts, archive version-specific progress, restore prior progress on rollback and resume pilot progress on republication. A learner who first starts in the pilot receives an empty baseline state on rollback while the pilot snapshot remains recoverable. Do not restore the whole database or reset unrelated code. A publication or rollback is deliberately not blindly repeatable.

## Validation

The staged candidate has 10 lessons, 179 blocks and no database validation errors. The `required_block_has_no_xp` warning is expected for the ten manually reviewed practice blocks. Visible words are **18,940 → 19,250**, an increase of 310 (+1.64%), counted by the repository's `countVisibleLessonWords` function.

On 29 October 2026 the database rehearsal passed publication, existing/new learner simulation, rollback, republication with pilot progress resumption and a second rollback inside an outer transaction that was rolled back. All 13 pre-existing progress rows had the same aggregate fingerprint afterward; attempt counts were unchanged. No student records or private quiz keys are exported here.

Current product claims were checked against dated primary sources in the private editorial package. Arithmetic and content invariants were checked separately. GitHub Actions records the automated build, security and browser checks for the commit. These are not a signed-in production learner journey or a beginner pilot. Teaching effectiveness and transfer still require observation with real beginners and a competent reviewer; the package includes the review protocol.

Module 4 publication is outside this release. This release does not change its pointers.
