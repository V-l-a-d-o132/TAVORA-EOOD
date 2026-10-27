import { loadMarketingSequenceCandidates } from '../../scripts/prepare-marketing-sequence-assets.mjs';

type ReadingBlock = { key?: string; type: string; title: string; content: Record<string, unknown> };
const currentSequence = new Map(loadMarketingSequenceCandidates().map(row => [row.lesson, row]));

/** Older release fixtures retain their own assertions; current reading times include the published sequence edition. */
export function withMarketingSequence(lessonId: string, blocks: ReadingBlock[]): ReadingBlock[] {
  const update = currentSequence.get(lessonId);
  if (!update) throw new Error(`Missing current marketing edition: ${lessonId}`);
  for (const amendment of update.payload.amendments) {
    if (!blocks.some(block => block.key === amendment.key)) {
      throw new Error(`Missing amended block: ${lessonId}/${amendment.key}`);
    }
  }
  return [
    ...blocks.map(block => {
      const amendment = update.payload.amendments.find(item => item.key === block.key);
      return amendment ? { ...block, content: amendment.content } : block;
    }),
    ...update.payload.additions,
  ];
}
