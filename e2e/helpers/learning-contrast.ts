import { expect, type Locator, type Page } from '@playwright/test';

/** Check rendered teaching text, including native selects and translucent panels.
 * Disabled controls and the deliberately fixed colors inside media are excluded.
 * This supplements visual review; it is not a complete accessibility audit.
 */
export async function assertLearningContrast(root: Locator) {
  // A theme switch changes CSS variables immediately; existing hover transitions
  // can still interpolate for a frame. Audit the rendered state once they finish.
  await root.evaluate(async root => {
    root.getBoundingClientRect();
    await Promise.allSettled(root.getAnimations({ subtree: true }).filter(animation => animation instanceof CSSTransition).map(animation => animation.finished));
  });
  const failures = await root.evaluate(root => {
    const rgba = (value: string) => {
      const values = value.match(/[\d.]+/g)?.map(Number) || [];
      return [values[0] || 0, values[1] || 0, values[2] || 0, values[3] ?? 1];
    };
    const over = (front: number[], back: number[]) => front.slice(0, 3).map((channel, i) => channel * front[3] + back[i] * (1 - front[3])).concat(1);
    const luminance = (color: number[]) => color.slice(0, 3).map(value => {
      const channel = value / 255;
      return channel <= .04045 ? channel / 12.92 : ((channel + .055) / 1.055) ** 2.4;
    }).reduce((sum, channel, i) => sum + channel * [.2126, .7152, .0722][i], 0);
    const failures: Array<{ text: string; ratio: number; color: string }> = [];
    for (const el of [root, ...root.querySelectorAll('*')]) {
      if (el.closest('svg, [disabled], [aria-disabled="true"]') || !el.getClientRects().length || ['OPTION', 'SCRIPT', 'STYLE'].includes(el.tagName)) continue;
      const text = [...el.childNodes].filter(node => node.nodeType === Node.TEXT_NODE).map(node => node.textContent).join('').trim();
      if (!text && el.tagName !== 'SELECT') continue;
      const ancestors: Element[] = [];
      for (let parent: Element | null = el; parent; parent = parent.parentElement) ancestors.unshift(parent);
      let background = [255, 255, 255, 1];
      let opacity = 1;
      for (const parent of ancestors) {
        const style = getComputedStyle(parent);
        background = over(rgba(style.backgroundColor), background);
        opacity *= Number(style.opacity);
      }
      const style = getComputedStyle(el);
      const color = rgba(style.color); color[3] *= opacity;
      const [a, b] = [luminance(over(color, background)), luminance(background)].sort((a, b) => b - a);
      const ratio = (a + .05) / (b + .05);
      const size = Number.parseFloat(style.fontSize);
      const large = size >= 24 || (size >= 18.66 && Number.parseInt(style.fontWeight) >= 700);
      if (ratio + .02 < (large ? 3 : 4.5)) failures.push({ text: (text || (el as HTMLSelectElement).selectedOptions[0]?.textContent || '').slice(0, 90), ratio: Math.round(ratio * 100) / 100, color: style.color });
    }
    return failures;
  });
  expect(failures, 'Rendered teaching text contrast').toEqual([]);
}

export async function assertLearningFits(page: Page) {
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), 'No page-wide horizontal overflow').toBe(true);
}
