type Step = { key?: string; type?: string; required?: boolean; points?: number; content: unknown };

/** Keep the old key in version history while presenting its explanation at the destination. */
export function videoLessonSteps<T extends Step>(blocks: readonly T[]): readonly T[] {
  const merged = blocks.find(block => block.key === 'field_diagnostic' && block.type === 'rich_text'
    && block.required === false && block.points === 0 && block.content && typeof block.content === 'object'
    && 'mergedInto' in block.content && block.content.mergedInto === 'before_after');
  if (!merged || !blocks.some(block => block.key === 'before_after' && block.type === 'before_after')) return blocks;
  return blocks.filter(block => block !== merged);
}
