// Release builders accept private grading data only at execution time.
// Never commit a private candidate or interpolate credentials into these queries.
export const communityEdition = 'marketing_basics_community_third_stage3_20261012';
export const versionFingerprint = `md5(jsonb_build_object('version',to_jsonb(v),'blocks',(
  select jsonb_agg(jsonb_build_object('block',to_jsonb(b),'key',to_jsonb(k)) order by b.position)
  from public.academy_lesson_blocks b left join academy_private.lesson_block_keys k on k.block_id=b.id
  where b.version_id=v.id))::text)`;

function jsonLiteral(value, tag) {
  const json = JSON.stringify(value);
  if (json.includes(`$${tag}$`)) throw new Error('Unexpected SQL delimiter in curriculum');
  return `$${tag}$${json}$${tag}$::jsonb`;
}

export function stageCommunityLessons(lessons) {
  if (!lessons.length || lessons.length > 51 || new Set(lessons.map(l => l.lesson_id)).size !== lessons.length) throw new Error('Invalid release batch');
  for (const l of lessons) {
    if (!['s03-m04','s03-m16','s03-m15','s03-m12','s03-m13'].includes(l.source_module_id) || l.change_note !== communityEdition || !l.source_fingerprint) throw new Error('Unexpected release scope');
    if (l.blocks.some(b => ['prompt_builder','practical_response','reflection','homework','submission','calculator'].includes(b.type))) throw new Error('Open input is outside this edition');
  }
  return `with payload as materialized (
    select value spec from jsonb_array_elements(${jsonLiteral(lessons,'community_stage')})
  ), locked as materialized (
    select l.*,p.spec from public.academy_lessons l join payload p
    on l.id=(p.spec->>'academy_lesson_id')::uuid and l.lesson_id=p.spec->>'lesson_id'
    for update of l
  ), checked as materialized (
    select l.*,${versionFingerprint} fingerprint
    from locked l join public.academy_lesson_versions v on v.id=l.published_version_id
  ), guard as materialized (
    select 1/(case when count(*)=${lessons.length} and bool_and(
      module_id=spec->>'source_module_id' and status='published'
      and published_version_id=(spec->>'origin_version_id')::uuid
      and draft_version_id is not distinct from (spec->>'previous_draft_version_id')::uuid
      and fingerprint=spec->>'source_fingerprint') then 1 else 0 end) ok from checked
  ), versions as (
    insert into public.academy_lesson_versions(academy_lesson_id,version_number,origin_version_id,title,subtitle,duration,objective,hook,estimated_minutes,source_kind,change_note)
    select l.id,(select coalesce(max(v.version_number),0)+1 from public.academy_lesson_versions v where v.academy_lesson_id=l.id),
      l.published_version_id,l.spec->>'title',l.spec->>'subtitle',l.spec->>'duration',l.spec->>'objective',l.spec->>'hook',
      (l.spec->>'estimated_minutes')::integer,'editor',l.spec->>'change_note'
    from checked l,guard g where g.ok=1 returning id,academy_lesson_id,version_number
  ), blocks as (
    insert into public.academy_lesson_blocks(version_id,block_key,position,block_type,title,content,required,points)
    select v.id,b->>'key',(b->>'position')::integer,b->>'type',b->>'title',b->'content',(b->>'required')::boolean,(b->>'points')::integer
    from versions v join checked l on l.id=v.academy_lesson_id cross join lateral jsonb_array_elements(l.spec->'blocks') b
    returning id,version_id,block_key
  ), keys as (
    insert into academy_private.lesson_block_keys(block_id,answer_key,feedback,scoring)
    select b.id,item->'evaluation',coalesce(item->'feedback','{}'::jsonb),coalesce(item->'scoring','{}'::jsonb)
    from blocks b join versions v on v.id=b.version_id join checked l on l.id=v.academy_lesson_id
    cross join lateral jsonb_array_elements(l.spec->'blocks') item
    where item->>'key'=b.block_key and item?'evaluation' and item->'evaluation'<>'{}'::jsonb
    returning block_id
  ), pointers as (
    update public.academy_lessons l set draft_version_id=v.id,updated_at=now()
    from versions v where l.id=v.academy_lesson_id returning l.id,l.lesson_id,l.draft_version_id
  ), audited as (
    insert into public.academy_lesson_audit(academy_lesson_id,version_id,action,details)
    select p.id,p.draft_version_id,'saved',jsonb_build_object('edition','${communityEdition}',
      'source_version_id',l.published_version_id,'previous_draft_version_id',l.draft_version_id,
      'approved_by_user',true,'new_module_number',l.spec->'new_module_number')
    from pointers p join checked l on l.id=p.id returning id
  ) select (select count(*) from versions) drafts,(select count(*) from blocks) blocks,
    (select count(*) from keys) grading_keys,(select count(*) from audited) audit_rows,
    (select jsonb_agg(jsonb_build_object('lesson_id',p.lesson_id,'version_id',p.draft_version_id,'version_number',v.version_number) order by p.lesson_id)
       from pointers p join versions v on v.id=p.draft_version_id) lessons;`;
}

export function publishCommunityLessons(lessons) {
  if (!lessons.length || lessons.length > 51) throw new Error('Invalid publication batch');
  return `with payload as materialized (
    select value spec from jsonb_array_elements(${jsonLiteral(lessons,'community_publish')})
  ), locked as materialized (
    select l.*,p.spec from public.academy_lessons l join payload p
    on l.id=(p.spec->>'academy_lesson_id')::uuid and l.lesson_id=p.spec->>'lesson_id' for update of l
  ), checked as materialized (
    select l.*,v.change_note,${versionFingerprint} fingerprint,academy_private.lesson_validation(v.id) validation
    from locked l join public.academy_lesson_versions v on v.id=(l.spec->>'draft_version_id')::uuid and v.academy_lesson_id=l.id
  ), guard as materialized (
    select 1/(case when count(*)=${lessons.length} and bool_and(
      change_note='${communityEdition}' and module_id=spec->>'source_module_id' and status='published'
      and published_version_id=(spec->>'origin_version_id')::uuid
      and draft_version_id=(spec->>'draft_version_id')::uuid and fingerprint=spec->>'draft_fingerprint'
      and jsonb_array_length(validation->'errors')=0 and jsonb_array_length(validation->'warnings')=0)
      then 1 else 0 end) ok from checked
  ), updated as (
    update public.academy_lessons l set published_version_id=(c.spec->>'draft_version_id')::uuid,
      status='published',updated_at=now() from checked c,guard g where l.id=c.id and g.ok=1
    returning l.id,l.lesson_id,l.published_version_id
  ), audited as (
    insert into public.academy_lesson_audit(academy_lesson_id,version_id,action,details)
    select u.id,u.published_version_id,'published',jsonb_build_object('edition','${communityEdition}',
      'source_version_id',c.published_version_id,'approved_by_user',true,'new_module_number',c.spec->'new_module_number')
    from updated u join checked c on c.id=u.id returning id
  ) select (select count(*) from updated) published_lessons,(select count(*) from audited) audit_rows;`;
}
