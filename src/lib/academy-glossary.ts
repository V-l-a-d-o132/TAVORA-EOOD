import { businessTerms } from './glossary-business';
import { marketingTerms } from './glossary-marketing';
import { videoTerms } from './glossary-video';
import type { GlossaryRow, GlossaryTerm } from './academy-glossary-types';

const rows: readonly GlossaryRow[] = [...businessTerms, ...marketingTerms, ...videoTerms];

const escapeRegex = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const indexed = rows.map(([term, aliases, plainBulgarian, familiarAssociation]) => ({
  entry: { term, plainBulgarian, familiarAssociation } satisfies GlossaryTerm,
  patterns: [term, ...aliases].map((alias) =>
    new RegExp(`(^|[^\\p{L}\\p{N}])${escapeRegex(alias)}(?=$|[^\\p{L}\\p{N}])`, 'iu')),
}));

/** Match actual words, not 'AI' inside 'email' or 'log' inside 'catalog'. */
export function findGlossaryTerms(text: string): GlossaryTerm[] {
  if (!text) return [];
  return indexed.flatMap(({ entry, patterns }) => {
    let position = Infinity;
    for (const pattern of patterns) {
      const match = pattern.exec(text);
      if (match) position = Math.min(position, match.index + match[1].length);
    }
    return position === Infinity ? [] : [{ entry, position }];
  }).sort((a, b) => a.position - b.position).map(({ entry }) => entry);
}

const hiddenKeys = new Set([
  'id', 'key', 'imageUrl', 'url', 'sources', 'accept', 'version', 'scoring',
  'correct', 'correctAnswer', 'answerKey',
]);

/** Only inspect content shown to a learner. Never inspect hidden answer keys. */
export function visibleGlossaryText(title: string, content: unknown): string {
  const parts = [title];
  const visit = (value: unknown): void => {
    if (typeof value === 'string') {
      if (!/^https?:\/\//i.test(value)) parts.push(value);
    } else if (Array.isArray(value)) {
      value.forEach(visit);
    } else if (value && typeof value === 'object') {
      Object.entries(value).forEach(([key, part]) => {
        if (!hiddenKeys.has(key)) visit(part);
      });
    }
  };
  visit(content);
  return parts.join('\n');
}

export const GLOSSARY_TERM_COUNT = rows.length;
