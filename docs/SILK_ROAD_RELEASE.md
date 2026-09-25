# Silk Road: final modules and course review

The published course now contains all 74 lessons across modules 1–11. Lesson content and private answer keys remain in Supabase; this repository contains the presentation and progress logic only.

This release aligns module 9–11 reading estimates and assignments with the published content, preserves the existing navigation titles, and extends the Bulgarian lesson presentation through module 11. Acknowledging a reading step is labelled as reading, not proof of practical mastery. Optional notes do not display a minimum-character assignment or zero-XP reward.

Draft saves now collect edits from multiple steps, serialize writes, retain failed batches for retry, and flush when leaving a lesson. Required-step progress uses the same denominator in the lesson header and parent callback.

For Silk Road, old-edition answers and completion no longer count towards a new published edition. The database migration updates the existing module report and lesson JSON and adds an authenticated, access-filtered dashboard report. It does not rewrite student records or modify payment/access grants. The dashboard resumes at the first unfinished lesson, including when lessons were completed out of order, and displays recorded XP.

Deployment has two parts: publishing lesson versions in Supabase makes the content available immediately; the frontend changes require publishing the repository build through the existing Readdy hosting flow. Do not infer a frontend deployment merely from a GitHub commit or successful build.

Validation covers server-side quiz grading, access controls, version changes, draft persistence during rapid navigation, retry behavior, optional notes, required-step counts, dashboard consistency, TypeScript, lint and production compilation.

Completion and quiz results demonstrate interaction with the course. They do not by themselves establish practical competence or business results. Practical work has stated criteria and model solutions for comparison; automated note saving does not assess the substance of a learner's answer.

## Navigation and practical review, September 25

The deployed site reproduced a navigation failure: after switching lessons and clicking the dashboard, the URL changed to `/dashboard` but the lesson remained rendered. The lesson viewer recreated its progress callback on every render, while the module always wrote a new progress-map object. The resulting effect/update loop is now broken by a stable callback and an unchanged-value guard. A regression test using the real module, lesson engine, router and dashboard fails when the old callback loop is restored and passes with the fix.

Fast page scrolling no longer opens the lesson list. The list opens through an explicitly labelled button and uses a native modal dialog with a close button, Escape cancellation, background scroll locking and direct exit links. Selecting the current lesson also closes it. The academy header exposes Dashboard and Modules directly on mobile; the profile menu no longer places a full-screen click interceptor over navigation.

The router query is now the source of the displayed lesson. Direct links work in the public preview, browser Back/Forward selects the corresponding lesson, delayed progress does not override a manual selection, and changing modules starts a separate resume lifecycle. The delayed lesson-switch timer has been removed. Access-check failures show retry instead of a purchase screen.

Module assignments are visible inside the interactive lesson flow. Completed modules offer the next module within Silk Road; the final module returns to the dashboard. Sidebar progress is labelled as steps, completed-step chips collapse, and desktop keyboard hints are hidden on mobile.

Two further content edits are published in Supabase under `silk_road_practical_review_20260925`: the email automation lesson supplies all three requested email drafts, actions and exit tests; the final lesson replaces a repeated section with evidence-based project acceptance criteria. Original lesson titles and quiz answer keys are preserved. The current course still has 11 modules, 74 lessons, 74 tasks, 74 model solutions and 222 quiz questions, with no validation errors or missing keys.

The full local suite passes 127 tests, including 13 real-module navigation cases. TypeScript and lint pass. At the browser verification, the production site still served the previous frontend. Public source publication was explicitly authorized on September 25; the frontend deployment must still be confirmed on the canonical domain. A browser session reproduced the old navigation fault without signing in. The new frontend has not been visually verified on a signed-in student's phone.
