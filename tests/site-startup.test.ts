import { readFileSync } from 'node:fs';
import { JSDOM } from 'jsdom';
import { describe, expect, it } from 'vitest';

const html = readFileSync('index.html', 'utf8');
const bootstrap = html.match(/<script id="meta-pixel-bootstrap">([\s\S]*?)<\/script>/)![1];

describe('deferred analytics startup', () => {
  it('keeps early conversion events queued until the page has painted and the browser is idle', () => {
    const dom = new JSDOM('<html><head></head><body></body></html>', { runScripts: 'outside-only' });
    const window = dom.window;
    let paint: FrameRequestCallback | undefined;
    let idle: (() => void) | undefined;
    window.requestAnimationFrame = (callback) => { paint = callback; return 1; };
    window.requestIdleCallback = (callback: () => void) => { idle = callback; return 1; };
    window.eval(bootstrap);
    window.fbq('trackSingle', 'academy-test-pixel', 'Purchase', { value: 119, currency: 'EUR' }, { eventID: 'order-test' });
    expect(window.document.querySelector('script[src*="fbevents"]')).toBeNull();
    expect(window.fbq.queue[1]).toEqual(expect.objectContaining({
      0: 'trackSingle', 1: 'academy-test-pixel', 2: 'Purchase',
      3: { value: 119, currency: 'EUR' }, 4: { eventID: 'order-test' },
    }));
    window.dispatchEvent(new window.Event('tavora:page-ready'));
    expect(window.document.querySelector('script[src*="fbevents"]')).toBeNull();
    paint!(0);
    expect(window.document.querySelector('script[src*="fbevents"]')).toBeNull();
    idle!();
    expect(window.document.querySelectorAll('script[src*="fbevents"]')).toHaveLength(1);
    window.dispatchEvent(new window.Event('tavora:page-ready'));
    expect(window.document.querySelectorAll('script[src*="fbevents"]')).toHaveLength(1);
    expect(window.fbq.queue).toHaveLength(2);
    dom.window.close();
  });

  it('loads through a delayed fallback when requestIdleCallback is unavailable', () => {
    const dom = new JSDOM('<html><head></head><body></body></html>', { runScripts: 'outside-only' });
    const window = dom.window;
    let delayed: (() => void) | undefined;
    window.requestAnimationFrame = (callback) => { callback(0); return 1; };
    window.setTimeout = ((callback: () => void) => { delayed = callback; return 1; }) as typeof window.setTimeout;
    window.eval(bootstrap);
    window.dispatchEvent(new window.Event('tavora:page-ready'));
    expect(window.document.querySelector('script[src*="fbevents"]')).toBeNull();
    delayed!();
    expect(window.document.querySelectorAll('script[src*="fbevents"]')).toHaveLength(1);
    dom.window.close();
  });
});
