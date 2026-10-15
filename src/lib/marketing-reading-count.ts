type Block = { title: string; type: string; content: unknown };
type Lesson = { title: string; subtitle: string; blocks: readonly Block[] };

const object = (value: unknown): Record<string, unknown> =>
  value && typeof value === 'object' && !Array.isArray(value) ? value as Record<string, unknown> : {};
const objects = (value: unknown): Record<string, unknown>[] =>
  Array.isArray(value) ? value.map(object) : [];
const strings = (value: unknown): string[] =>
  Array.isArray(value) ? value.filter((item): item is string => typeof item === 'string') : [];

/** Count what the Marketing renderer shows, including revealed examples.
 * URLs, metadata-only objectives and ignored content fields are excluded.
 */
export function marketingVisibleFragments(lesson: Lesson): string[] {
  const fragments: string[] = [];
  const put = (value: unknown) => { if (typeof value === 'string' && value.trim()) fragments.push(value); };
  put(lesson.title);
  put(lesson.subtitle);
  for (const block of lesson.blocks) {
    if (['prompt_builder', 'practical_response', 'reflection', 'homework', 'submission'].includes(block.type)) continue;
    put(block.title);
    const c = object(block.content);
    switch (block.type) {
      case 'objective':
        put(c.body || c.objective); strings(c.outcomes).forEach(put); put(c.deliverable); put(c.check); break;
      case 'hook': put(c.body || c.problem); break;
      case 'concept':
      case 'rich_text': {
        const columns = strings(c.columns);
        const rows = objects(c.table).map(row => strings(row.cells));
        const hasTable = columns.length > 0 && rows.length > 0 && rows.every(row => row.length === columns.length);
        const sources = objects(c.sources).filter(source => typeof source.url === 'string' && source.url.startsWith('https://') && typeof source.label === 'string');
        let body = typeof c.body === 'string' ? c.body : '';
        if (hasTable && c.tableFallback === true) body = typeof c.tableIntro === 'string' ? c.tableIntro : '';
        if (sources.length && c.sourceFallback === true) body = body.split('\n\n')[0];
        put(body); objects(c.points).forEach(point => put(point.text));
        if (hasTable) { columns.forEach(put); rows.forEach(row => row.forEach(put)); }
        sources.forEach(source => put(source.label)); break;
      }
      case 'before_after':
        put(object(c.before).label); put(object(c.before).text); put(object(c.after).label); put(object(c.after).text); break;
      case 'example':
      case 'case_study': put(c.body || c.case); put(c.solution); break;
      case 'step_reveal': objects(c.steps).forEach(step => { put(step.title); put(step.text); }); break;
      case 'flip_cards': objects(c.cards).forEach(card => { put(card.front); put(card.back); }); break;
      case 'sequence_sort': objects(c.items).forEach(item => put(item.text)); break;
      case 'matching': {
        const studio = object(c.studio);
        if (Object.keys(studio).length) {
          put(studio.title); put(studio.initialContext || studio.context); put(studio.task); put(studio.change); put(studio.limit);
        } else put(c.body);
        objects(c.left).forEach(item => put(item.text)); objects(c.right).forEach(item => put(item.text)); break;
      }
      case 'scenario':
      case 'decision_tree':
      case 'client_simulation': put(c.prompt || c.body); objects(c.options).forEach(option => put(option.label)); break;
      case 'quiz': put(c.question || c.body); objects(c.options).forEach(option => put(option.label)); break;
      case 'calculator': put(c.prompt || c.body); put(c.unit); break;
      case 'checklist': objects(c.items).forEach(item => put(item.text)); break;
      case 'summary': strings(c.takeaways).forEach(put); put(c.nextStep); break;
      case 'image_hotspot': put(c.instruction); objects(c.hotspots).forEach(spot => put(spot.label)); break;
      case 'course_exam':
        put(c.introduction);
        objects(c.questions).forEach(question => { put(question.prompt); objects(question.options).forEach(option => put(option.label)); });
        break;
    }
  }
  return fragments;
}

export function marketingVisibleWords(lesson: Lesson): number {
  return (marketingVisibleFragments(lesson).join('\n').match(/[\p{L}\p{N}]+/gu) || []).length;
}
