# Academy XP and resume — 2026-10-01

## Source of truth

The dashboard and module sidebar report Lesson Engine V2 progress for the current
published version of each accessible lesson, across all three programmes. XP is
the server-computed sum of the points on unique completed blocks, including work
in partially completed lessons. Retrying a block does not multiply its XP.

The old dashboard combined V2 results in s01 with legacy PDF completion in s02/s03
(10 points per lesson) and a 15-point homework bonus. Those synthetic bonuses are
no longer mixed into XP. Homework remains a separate dashboard count.

Completion requires all required blocks. The score percentage uses the latest
attempt per assessed block, weighted by its maximum score. A completed lesson is
`mastered` at 80% or above (or when it has no assessed blocks); below that it is
`practicing`. XP, completion and assessment percentage are different measures.
Course-exam pass rules are unchanged.

Global level thresholds remain 0, 50, 150, 300, 500, 750, 1000, 1500, 2000 and 3000
XP. Level 10 is capped visually at 100%, without limiting earned XP. Module XP
does not trigger a global level-up. Loading existing XP is not a new level-up.

Results for older content editions are not deleted or overwritten by this
migration. They remain in the existing progress/history mechanism, and the lesson
viewer displays the previous result. They do not count as completion or XP for
the new edition. Opening an updated lesson alone does not erase a result.

## Resume behaviour

- A successfully loaded lesson records `{moduleId, lessonId, timestamp}` in the
  learner's own profile through `academy_record_lesson_visit`. The server checks
  the caller, access and published lesson, and assigns the timestamp. It awards
  no XP and does not complete a lesson.
- Stable lesson IDs replace fragile array-index-only bookmarks. Local fallback
  storage is namespaced by user. Shared legacy browser bookmarks are ignored;
  legacy profile indices are accepted only with a matching lesson title.
- Dashboard and catalogue: newest valid local/server bookmark, then most recent
  saved lesson activity, then first unfinished accessible lesson.
- Module entry: an explicit lesson URL wins. Otherwise use the bookmark within
  that module, then recent activity, then the first unfinished lesson.
- The viewer waits for automatic resume selection before loading/recording a
  temporary first lesson. Direct links, next/sidebar clicks and browser Back are
  recorded after the actual destination loads. Admin preview never bookmarks.
- Inside the lesson, the existing V2 cursor and draft state restore the exact
  saved step and answers. Drafts save after 650 ms and flush on navigation,
  visibility loss, pagehide and connection recovery. Failed saves expose retry.
- A network failure or abrupt browser termination before a request finishes can
  still prevent cross-device synchronization. Do not promise offline durability
  for unsent drafts. The separate module notebook remains browser-local.

## Deployment and safety

Apply `academy_unified_progress_resume` before deploying the frontend. It adds
authenticated reporting/bookmark RPCs and updates the private module-report
function. Existing RPC signatures remain compatible. All private definer
functions use an empty search path, qualified object names and access checks.

The migration does not rewrite lessons, attempts, learner progress, history,
access grants or purchases, and does not touch articles or SEO files. Automated
tests cover all programmes, partial XP, version boundaries, authorization,
account isolation, cross-device bookmark selection, navigation races, retries
and draft flushing. Full tests, type checking, lint and production build are
required before release. Readdy publication is a separate deployment step.
