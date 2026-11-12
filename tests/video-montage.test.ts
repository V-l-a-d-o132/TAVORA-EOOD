import { expect, test } from 'vitest';
import { briefIssues, coffee, localSourceId, montageLength, montagePlan, montageSrt, newMontage, restoreMontage, revisionIssues } from '../src/lib/video-montage';

const first = newMontage().shots.map((shot, i) => ({ ...shot, caption: ['Чашата', 'Машината тръгва', 'Кафето се налива', 'Кафето е готово'][i] }));
const second = [first[3], { ...first[0], caption: 'Преди това чашата беше празна.' }, first[1], first[2]];

test('checks actual cuts and puts subtitle cues on the edited timeline', () => {
  expect(montageLength(first)).toBe(21);
  expect(briefIssues(first)).toEqual([]);
  expect(briefIssues(newMontage().shots)).toHaveLength(4);
  expect(briefIssues(first.map(s => ({ ...s, from: '1', to: '6' })))).toContain('Избери четири различни отрязъка.');
  expect(briefIssues(first.map(s => ({ ...s, from: '' })))).toHaveLength(4);
  expect(briefIssues(first.map(s => ({ ...s, to: String(coffee.seconds + 1) })))).not.toHaveLength(0);
  const srt = montageSrt(second);
  expect(srt).toContain('00:00:00,000 --> 00:00:06,000\nКафето е готово');
  expect(srt).toContain('00:00:06,000 --> 00:00:11,000\nПреди това');
  expect(srt).toContain('00:00:16,000 --> 00:00:21,000');
  expect(montagePlan(second, 2)).toContain('От 26 до 32 сек.');
});

test('revision requires both edits against the actual first submission', () => {
  expect(revisionIssues(first, first)).toHaveLength(2);
  expect(revisionIssues(second, first)).toEqual([]);
  expect(revisionIssues([{ ...second[0], from: '25' }, ...second.slice(1)], first)).toHaveLength(1);
  expect(revisionIssues([second[0], { ...second[1], caption: 'Преди това…' }, ...second.slice(2)], first)).toHaveLength(1);
  expect(revisionIssues([second[0], { ...second[1], caption: 'Преди това  — ' }, ...second.slice(2)], first)).toHaveLength(1);
});

test('restores editable partial work and both versions but rejects malformed or unearned completion', () => {
  for (const raw of [null, '{', '{}', JSON.stringify({ shots: [first[0], first[0], first[2], first[3]] })]) expect(restoreMontage(raw)).toEqual(newMontage());
  expect(restoreMontage(JSON.stringify({ shots: first, first, delivered: true })).delivered).toBe(false);
  expect(restoreMontage(JSON.stringify({ shots: second, first, delivered: true }))).toEqual({ shots: second, first, delivered: true });
  const partial = newMontage();
  partial.shots[2].from = '';
  expect(restoreMontage(JSON.stringify(partial))).toEqual(partial);
});

test('reattaches the same personal recording across picker timestamps and distinguishes replaced contents', async () => {
  const file = (content: string, lastModified: number) => new File([content], 'cut.mp4', { lastModified });
  const key = await localSourceId(file('first', 10));
  expect(await localSourceId(file('first', 20))).toBe(key);
  expect(await localSourceId(file('other', 10))).not.toBe(key);
  const draft = newMontage();
  draft.shots[0].source = key;
  expect(restoreMontage(JSON.stringify(draft))).toEqual(draft);
});
