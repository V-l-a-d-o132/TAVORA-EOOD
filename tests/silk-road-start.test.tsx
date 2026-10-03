// @vitest-environment jsdom
import React from 'react';
import { readFileSync } from 'node:fs';
import { JSDOM } from 'jsdom';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import SilkRoadStartPage from '../src/pages/silk-road-start/page';
import { SILK_PRACTICE_CASES } from '../src/data/silk-road-start';
import { buildSilkPrototype, checkSilkPlan, exerciseSilkPrototype, type SilkPagePlan } from '../src/lib/silk-road-practice';
import { lessonOptionOrder } from '../src/lib/lesson-option-order';

const valid = (price = '25'): SilkPagePlan => ({ price, source: 'current', action: 'request', duplicates: 'same-id', missingContact: 'ask' });
const prototype = (plan: SilkPagePlan) => {
  const dom = new JSDOM(buildSilkPrototype(SILK_PRACTICE_CASES[0], plan), { runScripts: 'dangerously', url: 'https://example.invalid' });
  return { dom, api: dom.window.TavoraSilkPrototype as Parameters<typeof exerciseSilkPrototype>[1] };
};
afterEach(() => { cleanup(); vi.restoreAllMocks(); });

describe('a beginner works with facts and an executable artifact', () => {
  it('checks the actual generated form and keeps the downloaded prototype self-contained', async () => {
    const { dom, api } = prototype(valid());
    expect((await exerciseSilkPrototype(dom.window.document, api)).every(item => item.passed)).toBe(true);
    const html = buildSilkPrototype(SILK_PRACTICE_CASES[0], valid());
    expect(html).not.toContain('src="request-lab.js"');
    expect(html).not.toContain('supabase');
    expect(dom.window.document.getElementById('offer-price')?.textContent).toBe('25 €');
    dom.window.close();
  });
  it.each([
    ['duplicates', { duplicates: 'new-record' }, 'repeated'],
    ['invented contact', { missingContact: 'guess' }, 'missing'],
    ['unsupported promise', { action: 'confirm' }, 'received'],
  ])('detects %s in the generated artifact rather than awarding a quiz tick', async (_label, change, expected) => {
    const { dom, api } = prototype({ ...valid(), ...change });
    const results = await exerciseSilkPrototype(dom.window.document, api);
    expect(results.find(item => item.id === expected)?.passed).toBe(false);
    dom.window.close();
  });
  it('retains data on failure, then repeats the same request once and accepts another task from the same contact', async () => {
    const { dom, api } = prototype(valid());
    const doc = dom.window.document;
    (doc.getElementById('mode') as HTMLSelectElement).value = 'error';
    await api.send(false); expect(api.store.all()).toHaveLength(0);
    expect((doc.getElementById('contact') as HTMLInputElement).value).toBe('test@example.invalid');
    (doc.getElementById('mode') as HTMLSelectElement).value = 'success';
    await api.send(true); await api.send(true); expect(api.store.all()).toHaveLength(1);
    (doc.getElementById('date') as HTMLInputElement).value = '2026-10-12';
    await api.send(false); expect(api.store.all()).toHaveLength(2);
    dom.window.close();
  });
  it('requires new facts in the second case and accepts decimal comma without inventing a price', () => {
    expect(checkSilkPlan(SILK_PRACTICE_CASES[1], valid()).find(item => item.id === 'source')?.passed).toBe(false);
    expect(checkSilkPlan(SILK_PRACTICE_CASES[1], valid('18,00')).every(item => item.passed)).toBe(true);
    expect(checkSilkPlan(SILK_PRACTICE_CASES[0], valid('<script>25</script>')).find(item => item.id === 'source')?.passed).toBe(false);
    expect(buildSilkPrototype(SILK_PRACTICE_CASES[0], valid('</script><script>window.stolen=true</script>'))).not.toContain('<script>window.stolen');
    const dom = new JSDOM(buildSilkPrototype(SILK_PRACTICE_CASES[0], valid('20')));
    expect(dom.window.document.getElementById('offer-price')?.textContent).toBe('20 €');
    expect(dom.window.document.getElementById('offer-scope')?.textContent).not.toContain('25');
    dom.window.close();
  });
});

describe('beginner route and isolated form', () => {
  it('offers four material formats, useful diagnosis and a second case after verification', () => {
    render(<MemoryRouter><SilkRoadStartPage /></MemoryRouter>);
    expect(screen.getByRole('heading', { name: 'Започни с една полезна задача' })).toBeTruthy();
    expect(screen.getByRole('link', { name: 'PDF: утвърдени условия' }).getAttribute('download')).toBe('approved-conditions.pdf');
    expect(screen.getByRole('link', { name: 'CSV: осем учебни запитвания' })).toBeTruthy();
    expect(screen.getByRole('link', { name: 'Изображение: старата обява' })).toBeTruthy();
    expect(screen.getByRole('link', { name: 'Аудио: въпрос от посетител' })).toBeTruthy();
    expect(screen.getByTitle('Твоят учебен прототип').getAttribute('sandbox')).toBe('allow-scripts');
    expect((screen.getByRole('button', { name: 'Приложи наученото към пекарната' }) as HTMLButtonElement).disabled).toBe(true);
    fireEvent.click(screen.getByRole('button', { name: 'Виж откъде да продължиш' }));
    expect(screen.getByRole('status').textContent).toContain('Започни с обясненията');
  });
  it('ignores forged completion messages from other windows and exposes only a temporary teaching report', () => {
    render(<MemoryRouter><SilkRoadStartPage /></MemoryRouter>);
    fireEvent(window, new MessageEvent('message', { source: window, data: { type: 'tavora-silk-check-result', requestId: 'fake', results: Array(4).fill({ passed: true }) } }));
    expect((screen.getByRole('button', { name: 'Приложи наученото към пекарната' }) as HTMLButtonElement).disabled).toBe(true);
    expect(screen.getByText(/Проверени предоставени случаи в тази сесия/).textContent).toContain('0/2');
  });

  it('unlocks the next case only after a matching form check and invalidates a changed plan', () => {
    render(<MemoryRouter><SilkRoadStartPage /></MemoryRouter>);
    fireEvent.change(screen.getByRole('textbox', { name: 'Каква цена ще покажеш в евро?' }), { target: { value: '25' } });
    fireEvent.change(screen.getByRole('combobox', { name: 'На кой източник стъпва цената?' }), { target: { value: 'current' } });
    fireEvent.change(screen.getByRole('combobox', { name: 'Какво обещава бутонът?' }), { target: { value: 'request' } });
    fireEvent.change(screen.getByRole('combobox', { name: 'При повторение на една заявка' }), { target: { value: 'same-id' } });
    fireEvent.change(screen.getByRole('combobox', { name: 'Ако контактът липсва' }), { target: { value: 'ask' } });
    const frame = screen.getByTitle('Твоят учебен прототип') as HTMLIFrameElement;
    const post = vi.spyOn(frame.contentWindow!, 'postMessage').mockImplementation(() => {});
    fireEvent.click(screen.getByRole('button', { name: 'Провери моя прототип' }));
    const request = post.mock.calls[0][0] as { requestId: string };
    const results = ['received', 'repeated', 'missing', 'failure'].map(id => ({ id, passed: true, label: id, help: '' }));
    const next = () => screen.getByRole('button', { name: 'Приложи наученото към пекарната' }) as HTMLButtonElement;
    fireEvent(window, new MessageEvent('message', { source: frame.contentWindow, data: { type: 'tavora-silk-check-result', requestId: 'stale', results } }));
    expect(next().disabled).toBe(true);
    fireEvent(window, new MessageEvent('message', { source: frame.contentWindow, data: { type: 'tavora-silk-check-result', requestId: request.requestId, results } }));
    expect(next().disabled).toBe(false);
    expect(screen.getByText(/Проверени предоставени случаи в тази сесия/).textContent).toContain('1/2');
    fireEvent.change(screen.getByRole('textbox', { name: 'Каква цена ще покажеш в евро?' }), { target: { value: '20' } });
    expect(next().disabled).toBe(true);
    expect(screen.getByText(/Проверени предоставени случаи в тази сесия/).textContent).toContain('0/2');
  });
  it('bundles real assets and the application route instead of depending on hosting arbitrary directories', () => {
    expect(readFileSync('src/router/config.tsx', 'utf8')).toContain("path: '/academy-labs/silk-road/start'");
    const manifest = JSON.parse(readFileSync('src/data/silk-road-packet/manifest.json', 'utf8'));
    expect(manifest.invented).toBe(true); expect(manifest.audio.synthetic).toBe(true);
    const csv = readFileSync('src/data/silk-road-packet/inquiries.csv', 'utf8').trim().split('\n').slice(1);
    expect(csv).toHaveLength(8);
    expect(new Set(csv.map(row => row.split(',')[0])).size).toBe(7);
    expect(readFileSync('src/data/silk-road-packet/voicemail.wav').subarray(0, 4).toString()).toBe('RIFF');
  });
});

describe('unordered answers resume by stable grading ID', () => {
  it('keeps every ID, changes positions between questions and stays stable across resume', () => {
    const options = [{ id: 'a' }, { id: 'b' }, { id: 'c' }];
    const seen = new Set<number>();
    for (let i = 0; i < 25; i++) {
      const output = lessonOptionOrder(options, `lesson/${i}`);
      expect(output).toEqual(lessonOptionOrder(options, `lesson/${i}`));
      expect(output.map(item => item.id).sort()).toEqual(['a', 'b', 'c']);
      seen.add(output.findIndex(item => item.id === 'b'));
    }
    expect(seen.size).toBe(3); expect(options).toEqual([{ id: 'a' }, { id: 'b' }, { id: 'c' }]);
  });
});
