-- Curriculum fingerprints only; no learner data and no raw private answer keys.
SELECT l.module_id,l.lesson_id,md5(jsonb_build_object(
 'title',v.title,'subtitle',v.subtitle,'duration',v.duration,
 'objective',v.objective,'hook',v.hook,'estimated_minutes',v.estimated_minutes,'change_note',v.change_note,
 'blocks',jsonb_agg(jsonb_build_object(
  'block_key',b.block_key,'position',b.position,'block_type',b.block_type,'title',b.title,
  'content',b.content,'required',b.required,'points',b.points,
  'evaluation',coalesce(k.answer_key,'{}'::jsonb),'feedback',coalesce(k.feedback,'{}'::jsonb),
  'scoring',coalesce(k.scoring,'{}'::jsonb)) ORDER BY b.position))::text) source_hash
FROM public.academy_lessons l
JOIN public.academy_lesson_versions v ON v.id=l.published_version_id
JOIN public.academy_lesson_blocks b ON b.version_id=v.id
LEFT JOIN academy_private.lesson_block_keys k ON k.block_id=b.id
WHERE l.module_id LIKE 's02-%'
GROUP BY l.module_id,l.lesson_id,v.id ORDER BY l.module_id,l.lesson_id;
