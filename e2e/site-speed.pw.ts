import { expect, test } from '@playwright/test';
import { readFileSync } from 'node:fs';

const paths = [...readFileSync('public/sitemap.xml', 'utf8').matchAll(/<loc>https:\/\/imashnujnoto.com([^<]*)<\/loc>/g)].map(match => match[1]);
const articlePaths = [...readFileSync('src/pages/blog/page.tsx', 'utf8').matchAll(/slug: '([^']+)'/g)].map(match => match[1]);
const cover = '/images/tavora-seo-geo-bulgaria-news.webp';

test.beforeEach(async ({ page }) => {
  // Only the local production build is exercised: no production accounts,
  // database writes, pixels or external video services are contacted.
  await page.route('**/*', route => route.request().url().startsWith('http://127.0.0.1:5180/') ? route.continue() : route.abort());
});

test('every sitemap page renders with its own canonical and native lazy images', async ({ page }) => {
  test.setTimeout(180000);
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  for (const path of paths) {
    await page.goto(path);
    await expect(page.locator('h1').first(), path).toBeVisible();
    await expect(page.locator('link[rel="canonical"]'), path).toHaveAttribute('href', `https://imashnujnoto.com${path}`);
    await expect(page.locator('meta[name="robots"]'), path).toHaveAttribute('content', /index,follow/);
    await expect(page.locator('meta[property="og:url"]'), path).toHaveAttribute('content', `https://imashnujnoto.com${path}`);
    expect(await page.locator('img:not([loading="lazy"]), img:not([decoding="async"])').count(), path).toBe(0);
    if (articlePaths.includes(path)) {
      const image = page.locator(`img[src="${cover}"]`).first();
      await image.scrollIntoViewIfNeeded();
      await expect.poll(() => image.evaluate((element: HTMLImageElement) => element.naturalWidth), { message: path }).toBe(2048);
      await expect(page.locator('meta[property="og:image"]'), path).toHaveAttribute('content', `https://imashnujnoto.com${cover}`);
    }
  }
  expect(errors).toEqual([]);
});

test('SPA navigation restores sharing metadata and indexing after an unknown URL', async ({ page }) => {
  await page.goto('/blog/kak-da-izberete-transportna-lenta');
  await expect(page.locator('h1').first()).toBeVisible();
  const articleTitle = await page.title();
  await expect(page.locator('meta[property="og:title"]')).toHaveAttribute('content', articleTitle);
  await page.locator('nav[aria-label="breadcrumb"]').getByRole('link', { name: 'Блог', exact: true }).click();
  await expect(page).toHaveURL(/\/blog$/);
  await expect(page.locator('meta[property="og:type"]')).toHaveAttribute('content', 'website');
  await expect(page.locator('meta[property="og:title"]')).not.toHaveAttribute('content', articleTitle);
  await page.goto('/missing-audit-page');
  await expect(page.getByRole('heading', { name: 'Страницата не е намерена', exact: true })).toBeVisible();
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex,nofollow');
  await page.getByRole('link', { name: 'Към началната страница', exact: true }).click();
  await expect(page.locator('h1').first()).toBeVisible();
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', 'https://imashnujnoto.com/');
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /index,follow/);
  await expect(page.locator('meta[property="og:image"]')).not.toHaveAttribute('content', `https://imashnujnoto.com${cover}`);
});

test('key public page types fit a phone screen and the shared cover loads', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  for (const path of ['/', '/uslugi', '/kontakt', '/blog', '/blog/meta-reklami-tarnovo', '/kurs', '/kurs/perfektnoto-video']) {
    await page.goto(path);
    await expect(page.locator('h1').first()).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth), path).toBe(true);
    if (path.startsWith('/blog')) {
      const image = page.locator(`img[src="${cover}"]`).first();
      await image.scrollIntoViewIfNeeded();
      await expect.poll(() => image.evaluate((element: HTMLImageElement) => element.naturalWidth)).toBe(2048);
    }
  }
});
