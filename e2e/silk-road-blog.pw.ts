import { expect, test } from '@playwright/test';
import { SILK_ROAD_ARTICLES } from '../src/pages/blog/silk-road-articles';

test.beforeEach(async ({ page }) => {
  await page.route('**/*', route => route.request().url().startsWith('http://127.0.0.1:5180/') ? route.continue() : route.abort());
});

test.describe('public article HTML', () => {
  test.use({ javaScriptEnabled: false });
  test('all eight articles expose complete text, authorship and metadata without JavaScript', async ({ page }) => {
    for (const article of SILK_ROAD_ARTICLES) {
      const path = `/blog/${article.id}`;
      const response = await page.goto(path);
      expect(response?.status(), path).toBe(200);
      await expect(page.getByRole('heading', { level: 1, name: article.title, exact: true })).toBeVisible();
      await expect(page).toHaveTitle(article.seoTitle);
      await expect(page.locator('main').getByText('Владимир Атанасов', { exact: true })).toBeVisible();
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', `https://imashnujnoto.com${path}`);
      await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /index,follow/);
      await expect(page.locator('meta[property="og:type"]')).toHaveAttribute('content', 'article');
      expect(await page.locator('article table').count(), path).toBeGreaterThan(0);
      await expect(page.getByRole('heading', { name: 'Източници и проверка', exact: true })).toBeVisible();
      const schema = JSON.parse((await page.locator(`#schema-${article.id}`).textContent())!);
      const data = schema['@graph'].find((item: { '@type': string }) => item['@type'] === 'Article');
      expect(data).toMatchObject({ headline: article.title, url: `https://imashnujnoto.com${path}`, datePublished: '2026-10-05', dateModified: '2026-10-05', author: { name: 'Владимир Атанасов' } });
      for (const link of await page.locator('a[href^="#"]').all()) {
        const id = (await link.getAttribute('href'))!.slice(1);
        expect(await page.locator(`[id="${id}"]`).count(), `${path}#${id}`).toBe(1);
      }
    }
  });
});

test('new articles fit phones, tablets and desktop screens', async ({ page }) => {
  test.setTimeout(180000);
  for (const width of [375, 768, 1400]) {
    await page.setViewportSize({ width, height: 900 });
    for (const article of SILK_ROAD_ARTICLES) {
      await page.goto(`/blog/${article.id}`);
      await expect(page.getByRole('heading', { level: 1, name: article.title, exact: true })).toBeVisible();
      await expect(page.getByRole('link', { name: article.ctaPrimaryLabel, exact: true })).toHaveAttribute('href', article.ctaPrimaryTo);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth), `${article.id} at ${width}px`).toBe(true);
      expect(await page.locator('img:not([loading="lazy"]), img:not([decoding="async"])').count()).toBe(0);
    }
  }
});

test('the existing overview and blog list lead to each new article', async ({ page }) => {
  for (const path of ['/blog', '/blog/ai-business-blueprint-putyat-na-koprinata']) {
    await page.goto(path);
    await expect(page.locator('h1')).toBeVisible();
    for (const article of SILK_ROAD_ARTICLES) {
      await expect(page.getByRole('link', { name: article.title, exact: true }).first()).toHaveAttribute('href', `/blog/${article.id}`);
    }
  }
  await page.goto('/blog');
  await page.getByRole('button', { name: 'Измерване', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Измерване', exact: true })).toHaveAttribute('aria-pressed', 'true');
  await expect(page.getByTestId('blog-grid').getByRole('heading', { name: SILK_ROAD_ARTICLES[5].title, exact: true })).toBeVisible();
  await expect(page.getByTestId('blog-grid').getByRole('heading', { name: SILK_ROAD_ARTICLES[0].title, exact: true })).toHaveCount(0);
  await page.getByRole('button', { name: 'Всички', exact: true }).click();
  await expect(page.getByTestId('blog-grid').getByRole('heading', { name: SILK_ROAD_ARTICLES[0].title, exact: true })).toBeVisible();
});
