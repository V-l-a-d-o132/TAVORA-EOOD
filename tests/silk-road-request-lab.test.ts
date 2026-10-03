// @vitest-environment jsdom
import { readFileSync } from 'node:fs';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

type Request = { id: string; name: string; contact: string; preferredDate: string };
type Store = { all: () => (Request & { confirmed: boolean })[]; save: (r: Request) => void; clear: () => void };
type Result = { state: string; id?: string; message: string };
type Lab = {
  makeMemoryStore: () => Store;
  processRequest: (r: Request, mode: string, store: Store, delay?: () => Promise<void>) => Promise<Result>;
  runChecks: () => Promise<{ label: string; passed: boolean }[]>;
};
let lab: Lab;
const request: Request = { id: 'request-1', name: 'Учебен посетител', contact: 'test@example.invalid', preferredDate: '' };

beforeEach(() => {
  window.localStorage.clear();
  document.body.innerHTML = readFileSync('public/academy-labs/silk-road/index.html', 'utf8').split('<body>')[1].split('</body>')[0];
  new Function('window', readFileSync('public/academy-labs/silk-road/request-lab.js', 'utf8'))(window);
  lab = (window as unknown as { TavoraRequestLab: Lab }).TavoraRequestLab;
});
afterEach(() => { vi.useRealTimers(); vi.restoreAllMocks(); });

describe('Standalone request laboratory', () => {
  it('receives one request and recognizes a repeat without promising a booking', async () => {
    const store = lab.makeMemoryStore();
    const first = await lab.processRequest(request, 'success', store);
    const second = await lab.processRequest(request, 'success', store);
    expect(first.state).toBe('accepted'); expect(second.state).toBe('duplicate');
    expect(second.id).toBe(first.id); expect(store.all()).toHaveLength(1);
    expect(store.all()[0].confirmed).toBe(false);
    expect(first.message).toContain('не е потвърден');
  });

  it('rejects missing contact, conflicting payload and simulated failure without adding records', async () => {
    const store = lab.makeMemoryStore();
    expect((await lab.processRequest({ ...request, contact: '' }, 'success', store)).state).toBe('invalid');
    expect((await lab.processRequest(request, 'error', store)).state).toBe('error');
    expect(store.all()).toHaveLength(0);
    await lab.processRequest(request, 'success', store);
    expect((await lab.processRequest({ ...request, name: 'Друго име' }, 'success', store)).state).toBe('conflict');
    expect(store.all()).toHaveLength(1);
  });

  it('shows pending before slow acceptance, retains fields after failure and only clears lab storage', async () => {
    vi.useFakeTimers();
    window.localStorage.setItem('academy-bookmark-user-1', 'preserved');
    const form = document.getElementById('request-form')!;
    const mode = document.getElementById('mode') as HTMLSelectElement;
    mode.value = 'slow'; form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    expect(document.getElementById('status')?.textContent).toContain('Изпращане…');
    expect(document.getElementById('record-count')?.textContent).toBe('0');
    await vi.advanceTimersByTimeAsync(1200);
    expect(document.getElementById('record-count')?.textContent).toBe('1');
    (document.getElementById('name') as HTMLInputElement).value = 'Нов учебен посетител';
    mode.value = 'error'; form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    await vi.advanceTimersByTimeAsync(0);
    expect(document.getElementById('status')?.textContent).toContain('не успя');
    expect((document.getElementById('name') as HTMLInputElement).value).toBe('Нов учебен посетител');
    expect(document.getElementById('record-count')?.textContent).toBe('1');
    document.getElementById('clear')!.click();
    expect(document.getElementById('record-count')?.textContent).toBe('0');
    expect(window.localStorage.getItem('academy-bookmark-user-1')).toBe('preserved');
  });

  it('reports the six independent simulated checks without network requests', async () => {
    const fetch = vi.spyOn(globalThis, 'fetch');
    const results = await lab.runChecks();
    expect(results).toHaveLength(6); expect(results.every(r => r.passed)).toBe(true);
    expect(fetch).not.toHaveBeenCalled();
    expect(document.getElementById('record-count')?.textContent).toBe('0');
  });
});
