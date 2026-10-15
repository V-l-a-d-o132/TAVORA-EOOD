-- Owner-only, read-only publication verification. Never return actual keys.
WITH scoped AS (
 SELECT l.id,l.module_id,l.lesson_id,l.published_version_id,v.origin_version_id,v.change_note,v.validation
 FROM public.academy_lessons l JOIN public.academy_lesson_versions v ON v.id=l.published_version_id
 WHERE l.module_id ~ '^s02-m1[1-5]$' AND l.status='published'
), originals AS (
 SELECT count(*) FILTER(WHERE old.block_type<>'objective' AND
  (b.id IS NULL OR ROW(b.block_type,b.title,b.content,b.required,b.points,nk.answer_key,nk.feedback,nk.scoring)
   IS DISTINCT FROM ROW(old.block_type,old.title,old.content,old.required,old.points,ok.answer_key,ok.feedback,ok.scoring))) AS changed_teaching,
 count(*) FILTER(WHERE old.block_type='objective' AND b.content->>'body' IS DISTINCT FROM old.content->>'body') AS changed_opening_bodies
 FROM scoped l JOIN public.academy_lesson_blocks old ON old.version_id=l.origin_version_id
 LEFT JOIN public.academy_lesson_blocks b ON b.version_id=l.published_version_id AND b.block_key=old.block_key
 LEFT JOIN academy_private.lesson_block_keys ok ON ok.block_id=old.id
 LEFT JOIN academy_private.lesson_block_keys nk ON nk.block_id=b.id
), reviewed AS (
 SELECT count(*) FILTER(WHERE b.id IS NULL OR b.content IS DISTINCT FROM s.payload->'practice'->'content'
  OR b.title IS DISTINCT FROM s.payload->'practice'->>'title' OR NOT b.required OR b.points<>20
  OR o.content IS DISTINCT FROM s.payload->'opening') AS public_mismatch,
 count(*) FILTER(WHERE k.answer_key IS DISTINCT FROM s.payload->'practice'->'evaluation'
  OR k.feedback IS DISTINCT FROM s.payload->'practice'->'feedback' OR k.scoring IS DISTINCT FROM '{}'::jsonb) AS grader_mismatch
 FROM scoped l JOIN academy_private.practical_video_11_15_upgrades s ON s.lesson_id=l.lesson_id
 LEFT JOIN public.academy_lesson_blocks b ON b.version_id=l.published_version_id AND b.block_key='practical_studio_final_20261015'
 LEFT JOIN public.academy_lesson_blocks o ON o.version_id=l.published_version_id AND o.block_type='objective'
 LEFT JOIN academy_private.lesson_block_keys k ON k.block_id=b.id
), exam_order AS (
 SELECT count(*) AS exams,count(*) FILTER(WHERE p.id IS NULL OR p.position>=e.position) AS blocked_order
 FROM scoped l JOIN public.academy_lesson_blocks e ON e.version_id=l.published_version_id AND e.block_type='course_exam'
 LEFT JOIN public.academy_lesson_blocks p ON p.version_id=l.published_version_id AND p.block_key='practical_studio_final_20261015'
)
SELECT jsonb_build_object(
 'release','practical_video_11_15_20261015',
 'publishedLessons',(SELECT count(*) FROM scoped),
 'lessonsPerModule',(SELECT jsonb_object_agg(module_id,n) FROM (SELECT module_id,count(*) n FROM scoped GROUP BY module_id) m),
 'requiredNewStudios',(SELECT count(*) FROM scoped l JOIN public.academy_lesson_blocks b ON b.version_id=l.published_version_id
  WHERE b.block_key='practical_studio_final_20261015' AND b.required AND b.content->'studio'->>'release'='practical_video_11_15_20261015'),
 'allVideoRequiredStudios',(SELECT count(*) FROM public.academy_lessons l JOIN public.academy_lesson_blocks b ON b.version_id=l.published_version_id
  WHERE l.module_id LIKE 's02-%' AND l.status='published' AND b.required AND b.content->'studio' IS NOT NULL),
 'videoStudioReleases',(SELECT jsonb_object_agg(release,n) FROM (SELECT b.content->'studio'->>'release' release,count(*) n
  FROM public.academy_lessons l JOIN public.academy_lesson_blocks b ON b.version_id=l.published_version_id
  WHERE l.module_id LIKE 's02-%' AND b.required AND b.content->'studio' IS NOT NULL GROUP BY 1) r),
 'changedOriginalTeaching',(SELECT changed_teaching FROM originals),
 'changedOriginalOpeningBodies',(SELECT changed_opening_bodies FROM originals),
 'reviewedPublicContentMismatches',(SELECT public_mismatch FROM reviewed),
 'reviewedPrivateGraderMismatches',(SELECT grader_mismatch FROM reviewed),
 'validationErrors',(SELECT coalesce(sum(jsonb_array_length(validation->'errors')),0) FROM scoped),
 'wrongFamilyMarker',(SELECT count(*) FROM scoped WHERE change_note<>'perfect_video_story_first_20261010'),
 'examCount',(SELECT exams FROM exam_order),
 'practiceNotBeforeExam',(SELECT blocked_order FROM exam_order),
 'ownPracticeGateInstalled',strpos(pg_get_functiondef('academy_private.submit_perfect_video_exam(text,text,uuid,text,jsonb,uuid)'::regprocedure),'assert_video_practice_ready')>0,
 'final239PrerequisitesRetained',strpos(pg_get_functiondef('academy_private.submit_perfect_video_exam(text,text,uuid,text,jsonb,uuid)'::regprocedure),'prior_count<>239')>0,
 'openVideoBlocks',(SELECT count(*) FROM public.academy_lessons l JOIN public.academy_lesson_blocks b ON b.version_id=l.published_version_id
  WHERE l.module_id LIKE 's02-%' AND b.block_type IN ('practical_response','reflection','homework','submission')),
 'privateStageReadableByLearner',has_table_privilege('authenticated','academy_private.practical_video_11_15_upgrades','SELECT'),
 'publisherExecutableByLearner',has_function_privilege('authenticated','academy_private.publish_practical_video_11_15()','EXECUTE'),
 'practiceGateExecutableByLearner',has_function_privilege('authenticated','academy_private.assert_video_practice_ready(text,text,uuid)','EXECUTE')
) AS verification;
