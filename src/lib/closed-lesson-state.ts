import type { JsonObject, LessonBlockV2 } from '@/lib/lesson-engine-v2';

const object = (value: unknown): JsonObject => value !== null && typeof value === 'object' && !Array.isArray(value) ? value as JsonObject : {};
const items = (value: unknown): JsonObject[] => Array.isArray(value) ? value.map(object) : [];
const ids = (value: unknown) => items(value).map((item, index) => typeof item.id === 'string' ? item.id : String(index));
const choice = (value: unknown, allowed: string[]) => typeof value === 'string' && allowed.includes(value) ? value : undefined;

/** Only catalog-defined choices may leave the browser as learning state. */
export function closedBlockState(block: LessonBlockV2, supplied: unknown): JsonObject {
  const state = object(supplied), content = block.content;
  const scalar = (field: string, allowed: string[]) => { const value = choice(state[field], allowed); return value === undefined ? {} : { [field]: value }; };
  const array = (field: string, allowed: string[]) => ({ [field]: Array.isArray(state[field]) ? [...new Set((state[field] as unknown[]).filter((value): value is string => choice(value, allowed) !== undefined))] : [] });
  switch (block.type) {
    case 'quiz': return scalar('answer', ids(content.options));
    case 'scenario': case 'decision_tree': case 'client_simulation': return scalar('selected', ids(content.options));
    case 'image_hotspot': return scalar('selected', ids(content.hotspots));
    case 'matching': {
      const suppliedMatches = object(state.matches), right = ids(content.right);
      return { matches: Object.fromEntries(items(content.left).flatMap((slot, index) => {
        const id = typeof slot.id === 'string' ? slot.id : String(index);
        const allowed = Array.isArray(slot.choices) ? slot.choices.filter((value): value is string => typeof value === 'string' && right.includes(value)) : right;
        const value = choice(suppliedMatches[id], allowed); return value === undefined ? [] : [[id, value]];
      })) };
    }
    case 'sequence_sort': return array('order', ids(content.items));
    case 'checklist': return array('checked', ids(content.items));
    case 'step_reveal': return array('revealed', items(content.steps).map((item, index) => typeof item.id === 'string' ? item.id : `step-${index}`));
    case 'flip_cards': return array('viewed', items(content.cards).map((item, index) => typeof item.id === 'string' ? item.id : `card-${index}`));
    case 'course_exam': {
      const answers = object(state.answers);
      return { answers: Object.fromEntries(items(content.questions).flatMap(question => {
        const id = typeof question.id === 'string' ? question.id : '';
        const value = choice(answers[id], ids(question.options)); return id && value !== undefined ? [[id, value]] : [];
      })) };
    }
    default: return state.acknowledged === true ? { acknowledged: true } : {};
  }
}

export function closedLessonState(blocks: readonly LessonBlockV2[], supplied: unknown): Record<string, JsonObject> {
  const state = object(supplied);
  return Object.fromEntries(blocks.filter(block => Object.hasOwn(state, block.key)).map(block => [block.key, closedBlockState(block, state[block.key])]));
}
