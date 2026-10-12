// Only an editorial update to the existing published opening is permitted.
// Original block identities, version editions and assessment keys remain in place.
export const openingEdition = 'course_detailed_openings_20261012';
export const openingFingerprint = `md5((select jsonb_agg(jsonb_build_object('block',to_jsonb(x),'key',to_jsonb(k)) order by x.position)
  from public.academy_lesson_blocks x left join academy_private.lesson_block_keys k on k.block_id=x.id where x.version_id=v.id)::text)`;

function literal(value) {
  const json=JSON.stringify(value);
  if(json.includes('$opening_patch$'))throw new Error('Unexpected SQL delimiter');
  return `$opening_patch$${json}$opening_patch$::jsonb`;
}

export function updateOpeningPages(specs) {
  if(!specs.length||specs.length>240||new Set(specs.map(s=>s.lesson_id)).size!==specs.length)throw new Error('Invalid opening batch');
  const courses=new Set(specs.map(s=>s.module_id.slice(0,3)));
  if(courses.size!==1||!['s01','s02'].includes([...courses][0]))throw new Error('Unexpected course scope');
  for(const s of specs){
    if(!/^s0[12]-m\d{2}$/.test(s.module_id)||!s.version_hash||!s.blocks_hash||!s.first_block_id||!s.first_block_key)throw new Error('Missing source identity');
    const c=s.content;
    if(typeof c?.body!=='string'||c.body.split(/\n\s*\n/).length<2||!Array.isArray(c.outcomes)||c.outcomes.length<4||!c.outcomes.every(o=>typeof o==='string'&&o.trim())||!c.deliverable||!c.check)throw new Error('Incomplete detailed opening');
  }
  return `with payload as materialized (
    select value spec from jsonb_array_elements(${literal(specs)})
  ), locked as materialized (
    select l.*,p.spec from public.academy_lessons l join payload p
      on l.id=(p.spec->>'academy_lesson_id')::uuid and l.lesson_id=p.spec->>'lesson_id'
    for update of l
  ), checked as materialized (
    select l.*,md5(to_jsonb(v)::text) version_hash,${openingFingerprint} blocks_hash,
      to_jsonb(b) before_block,b.id block_id,
      academy_private.lesson_validation(v.id) validation
    from locked l join public.academy_lesson_versions v on v.id=l.published_version_id
      join public.academy_lesson_blocks b on b.version_id=v.id and b.id=(l.spec->>'first_block_id')::uuid
    where b.block_type='objective' and b.block_key=l.spec->>'first_block_key'
      and b.position=(select min(x.position) from public.academy_lesson_blocks x where x.version_id=v.id)
    for update of b
  ), guard as materialized (
    select 1/(case when count(*)=${specs.length} and bool_and(
      module_id=spec->>'module_id' and status='published'
      and published_version_id=(spec->>'published_version_id')::uuid
      and draft_version_id is not distinct from (spec->>'draft_version_id')::uuid
      and version_hash=spec->>'version_hash' and blocks_hash=spec->>'blocks_hash'
      and jsonb_array_length(validation->'errors')=0
      and not exists(select 1 from public.academy_lesson_audit a
        where a.academy_lesson_id=checked.id and a.version_id=checked.published_version_id
          and a.details->>'edition'='${openingEdition}')) then 1 else 0 end) ok from checked
  ), audited as (
    insert into public.academy_lesson_audit(academy_lesson_id,version_id,action,details)
    select c.id,c.published_version_id,'published',jsonb_build_object('edition','${openingEdition}',
      'scope','published objective block only','before',c.before_block,
      'after_title','Какво ще можеш след урока','after_content',c.spec->'content','after_points',5,
      'source_version_hash',c.version_hash,'source_blocks_hash',c.blocks_hash,
      'same_version_and_block',true,'approved_by_user',true)
    from checked c,guard g where g.ok=1 returning id
  ), updated as (
    update public.academy_lesson_blocks b set title='Какво ще можеш след урока',content=c.spec->'content',points=5
    from checked c,guard g where b.id=c.block_id and g.ok=1
    returning b.id,b.version_id,b.block_key,b.title,b.content,b.points
  ) select (select count(*) from updated) updated_openings,(select count(*) from audited) audit_rows,
    (select jsonb_agg(jsonb_build_object('lesson_id',c.lesson_id,'version_id',u.version_id,'block_id',u.id) order by c.lesson_id)
      from updated u join checked c on c.block_id=u.id) lessons;`;
}
