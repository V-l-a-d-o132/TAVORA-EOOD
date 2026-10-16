import { test, expect } from '@playwright/test';
import { prepareAcademyTheme } from './helpers/academy-theme-fixture';
import { assertLearningFits } from './helpers/learning-contrast';

const courses = [
  { route: '/kurs/ai-business-blueprint', lessons: 74, lab: '/academy-labs/silk-road/start' },
  { route: '/kurs/perfektnoto-video', lessons: 240, lab: '/academy-labs/perfect-video/start' },
  { route: '/kurs/marketing-basics', lessons: 210, lab: '/academy/marketing-basics-practice.html' },
];

for (const width of [320, 1280]) {
  for (const course of courses) {
    test(`${width}px public ${course.route}: programme, practice and sharing metadata agree`, async ({ page }, info) => {
      await prepareAcademyTheme(page, 'light', undefined, { anonymous: true, hasFullAccess: false });
      await page.setViewportSize({ width, height: 950 });
      const errors: string[] = []; page.on('pageerror', error => errors.push(error.message));
      await page.goto(course.route);
      await expect(page.locator('h1')).toBeVisible();
      const practice = page.locator('#kak-uchish');
      await expect(practice).toContainText('Не качваш файлове');
      await expect(practice).toContainText('не пишеш свободни отговори');
      await expect(practice.getByRole('link')).toHaveAttribute('href', course.lab);
      await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', new RegExp(String(course.lessons)));
      await expect(page.locator('meta[property="og:description"]')).toHaveAttribute('content', await page.locator('meta[name="description"]').getAttribute('content') || '');
      const schema = await page.locator('script[id$="-funnel"]').textContent();
      expect(JSON.parse(schema || '{}')['@graph'].some((item: { '@type': string }) => item['@type'] === 'FAQPage')).toBe(true);
      await assertLearningFits(page);
      await practice.scrollIntoViewIfNeeded(); await page.screenshot({ path: info.outputPath(`practice-${width}.png`) });
      await practice.getByRole('link').click();
      await expect(page).toHaveURL(new RegExp(course.lab.replaceAll('.', '\\.')));
      await expect(page.locator('h1')).toBeVisible();
      expect(errors).toEqual([]);
    });
  }

  for (const [slug, count] of [['perfektnoto-video-biznes-sistema', 15], ['marketing-basics-palna-sistema', 20]] as const) {
    test(`${width}px public article ${slug}: current modules and matching FAQ schema`, async ({ page }) => {
      await prepareAcademyTheme(page, 'light', undefined, { anonymous: true });
      await page.setViewportSize({ width, height: 950 }); await page.goto(`/blog/${slug}`);
      await expect(page.locator('#modules ol > li')).toHaveCount(count);
      const faq = page.locator('#questions details');
      await expect(faq.first()).toBeVisible(); await faq.last().locator('summary').click();
      const graphs = await page.locator(`script[id="schema-${slug}"]`).textContent();
      const schemaFaq = JSON.parse(graphs || '{}')['@graph'].find((item: { '@type': string }) => item['@type'] === 'FAQPage');
      expect(schemaFaq.mainEntity).toHaveLength(await faq.count());
      if (count === 20) {
        await expect(page.locator('#modules h3')).toHaveCount(4);
        await expect(page.locator('#check')).toContainText('финален изпит с 60 въпроса');
      }
      await expect(page.locator('body')).not.toContainText('40 въпроса');
      await assertLearningFits(page);
    });
  }

  test(`${width}px anonymous academy: four real free lessons and three separate lab previews`, async ({ page }) => {
    await prepareAcademyTheme(page, 'dark', undefined, { anonymous: true });
    await page.setViewportSize({ width, height: 950 }); await page.goto('/kurs');
    await expect(page.locator('#module1-preview ol > li')).toHaveCount(4);
    await expect(page.locator('#module1-preview a[href^="/module/s01-m01"]')).toHaveCount(5);
    await expect(page.locator('#akademiya-results article')).toHaveCount(3);
    await expect(page.locator('#akademiya-results')).toContainText('не отключват платени модули');
    await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', /524/);
    await assertLearningFits(page);
    await page.locator('#module1-preview a[href="/module/s01-m01?lesson=0"]').first().click();
    await expect(page.getByRole('heading', { name: 'Какво ще можеш след урока', exact: true })).toBeVisible();
  });
}

for (const [tier, lessons] of [['systems-10', 70], ['koprinena-pateka', 74], ['perfektno-video', 240], ['marketing-basics', 210], ['premium-all', 524], ['strategic_access', 524]] as const) {
  test(`checkout ${tier}: published course scope is visible before authentication`, async ({ page }) => {
    const calls = await prepareAcademyTheme(page, 'dark', undefined, { anonymous: true });
    await page.setViewportSize({ width: 375, height: 950 }); await page.goto(`/kurs/checkout?tier=${tier}`);
    await expect(page.getByText(`${lessons} урока`, { exact: true }).first()).toBeVisible();
    await expect(page.locator('body')).not.toContainText('Revenue Blueprint');
    expect(calls['academy-stripe-checkout'] || 0).toBe(0);
    await assertLearningFits(page);
  });
}
