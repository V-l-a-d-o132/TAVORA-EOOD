import { test, expect } from '@playwright/test';
import { prepareAcademyTheme, selectTheme, type ThemeLessonFixture } from './helpers/academy-theme-fixture';
import { assertLearningContrast, assertLearningFits } from './helpers/learning-contrast';
import { workflowActions, workflowScenarios } from '../src/lib/silk-road-workflows';

const title = (theme: string) => theme === 'light' ? 'Светла' : 'Тъмна';
const opposite = (theme: string) => title(theme === 'light' ? 'dark' : 'light');
const block = (type: string, content: Record<string, unknown>, i: number) => ({ id: `00000000-0000-4000-8000-${String(200 + i).padStart(12, '0')}`, key: `theme-${type}-${i}`, position: i * 10, title: `Пробен блок: ${type}`, type, required: true, points: 5, content });
const materials: ThemeLessonFixture['blocks'] = [
  block('objective', { body: 'Пробен материал за проверка на интерфейса.', outcomes: ['Разпознаваш предоставеното условие.'], practicalResult: 'Работиш само с учебни избори.', verification: 'Проверяваш избора по нова ситуация.' }, 0),
  block('hook', { body: 'Кое действие следва от предоставения факт?' }, 1),
  block('rich_text', { body: 'ИИ предлага чернова; данните остават за проверка.', columns: ['Учебно условие', 'Следваща стъпка'], table: [{ cells: ['Услуга с предоставена цена', 'Свери източника преди обещание'] }], code: { language: 'HTML', source: '<button>Учебно запитване</button>\n' + ' '.repeat(100) + '<!-- Пример за хоризонтално превъртане -->' }, figure: { src: '/academy-labs/silk-road/closed/typography.svg', alt: 'Учебно сравнение на типография', caption: 'Изображението запазва собствените си цветове.' }, videoLab: 'story' }, 2),
  block('before_after', { before: { text: 'Липсва условие.' }, after: { text: 'Уточни условието.' } }, 3),
  block('example', { body: 'Пробен пример с предоставен факт.', solution: 'Следващата стъпка е уточняване.' }, 4),
  block('case_study', { body: 'Пробен случай с липсващ график.', solution: 'Запитването не потвърждава час.' }, 5),
  block('step_reveal', { steps: [{ id: 'one', title: 'Първо условие', text: 'Отдели предоставения факт.' }, { id: 'two', title: 'Второ условие', text: 'Уточни неизвестното.' }] }, 6),
  block('flip_cards', { cards: [{ id: 'one', front: 'Пробно понятие А', back: 'Обяснение А' }, { id: 'two', front: 'Пробно понятие Б', back: 'Обяснение Б' }] }, 7),
  block('matching', { left: [{ id: 'one', text: 'Условие А' }, { id: 'two', text: 'Условие Б' }], right: [{ id: 'a', text: 'Стъпка А' }, { id: 'b', text: 'Стъпка Б' }] }, 8),
  block('sequence_sort', { items: [{ id: 'a', text: 'Действие А' }, { id: 'b', text: 'Действие Б' }] }, 9),
  block('scenario', { prompt: 'Избери пробното действие.', options: [{ id: 'wrong', label: 'Пробен избор за поправка' }, { id: 'right', label: 'Пробен избор за преминаване' }] }, 10),
  block('quiz', { question: 'Избери пробното основание.', options: [{ id: 'wrong', label: 'Пробен избор за поправка' }, { id: 'right', label: 'Пробен избор за преминаване' }] }, 11),
  block('checklist', { items: [{ id: 'one', text: 'Пробна отметка А' }, { id: 'two', text: 'Пробна отметка Б' }] }, 12),
  block('summary', { takeaways: ['Препрочети условието.', 'Уточни липсващото.'], nextStep: 'Продължи с предоставен случай.' }, 13),
  block('course_exam', { introduction: 'Синтетичен изпит за проверка на интерфейса.', minimumPercent: 100, questions: [{ id: 'q1', prompt: 'Пробен въпрос А', options: [{ id: 'a', label: 'Отговор А' }, { id: 'b', label: 'Отговор Б' }] }, { id: 'q2', prompt: 'Пробен въпрос Б', options: [{ id: 'a', label: 'Отговор В' }, { id: 'b', label: 'Отговор Г' }] }] }, 14),
];

for (const theme of ['light', 'dark']) {
  for (const width of [320, 1280]) {
    test(`${theme}: all eleven video demonstrations retain choices at ${width}px`, async ({ page }, info) => {
      await page.setViewportSize({ width, height: 900 }); await prepareAcademyTheme(page, theme);
      const errors: string[] = []; page.on('pageerror', error => errors.push(error.message));
      await page.goto('/academy-labs/perfect-video/start');
      const navigation = page.getByRole('navigation', { name: 'Избери демонстрация' });
      await expect(navigation.getByRole('button')).toHaveCount(11);
      for (let i = 0; i < 11; i++) {
        await navigation.getByRole('button').nth(i).click();
        const choices = page.getByRole('group', { name: 'Вариант на демонстрацията' }).getByRole('button');
        for (let n = 0; n < await choices.count(); n++) {
          await choices.nth(n).click(); await expect(choices.nth(n)).toHaveAttribute('aria-pressed', 'true');
          await assertLearningFits(page); await assertLearningContrast(page.locator('main'));
        }
        const selected = page.getByRole('group', { name: 'Вариант на демонстрацията' }).locator('[aria-pressed=true]');
        const label = await selected.textContent();
        const graphic = page.locator('main svg').first();
        const original = await graphic.count() ? await graphic.evaluate(el => el.outerHTML) : null;
        await selectTheme(page, opposite(theme)); await expect(selected).toHaveText(label!);
        await expect(navigation.getByRole('button').nth(i)).toHaveAttribute('aria-pressed', 'true');
        if (original) expect(await graphic.evaluate(el => el.outerHTML)).toBe(original);
        await selectTheme(page, title(theme));
      }
      await expect(page.locator('textarea,input[type=text],input[type=file]')).toHaveCount(0);
      await navigation.getByRole('button').first().click();
      await page.getByRole('button', { name: 'Следващ момент', exact: true }).click();
      const time = page.getByLabel('Време'); const pausedTime = await time.textContent();
      await selectTheme(page, opposite(theme)); await expect(time).toHaveText(pausedTime!);
      await page.getByRole('button', { name: 'Пусни сцената', exact: true }).click();
      await selectTheme(page, title(theme)); await expect(page.getByRole('button', { name: 'Пауза', exact: true })).toBeVisible();
      await expect.poll(() => time.textContent()).not.toBe(pausedTime);
      await page.getByRole('button', { name: 'Пауза', exact: true }).click();
      await page.screenshot({ path: info.outputPath(`video-${theme}-${width}.png`), fullPage: true });
      expect(errors).toEqual([]);
    });

    test(`${theme}: silk prototype keeps its records, choices and checks at ${width}px`, async ({ page }, info) => {
      await page.setViewportSize({ width, height: 900 }); await prepareAcademyTheme(page, theme);
      const errors: string[] = []; page.on('pageerror', error => errors.push(error.message));
      await page.goto('/academy-labs/silk-road/start');
      await page.getByText('Основните понятия с прости думи', { exact: true }).click();
      await assertLearningContrast(page.locator('main')); await assertLearningFits(page);
      const plan = [
        ['Каква цена ще покажеш в евро?', '25'], ['На кой източник стъпва цената?', 'current'], ['Какво обещава бутонът?', 'request'], ['При повторение на една заявка', 'same-id'], ['Ако контактът липсва', 'ask'],
      ];
      for (const [label, value] of plan) await page.getByRole('combobox', { name: label, exact: true }).selectOption(value);
      const frame = page.frameLocator('iframe[title="Твоят учебен прототип"]');
      await expect(frame.locator('#offer-price')).toHaveText('25 €');
      expect(await frame.locator('body').evaluate(() => {
        try { void window.parent.document; return false; } catch { return true; }
      }), 'The prototype remains isolated from the parent account').toBe(true);
      await frame.getByRole('button', { name: 'Изпрати запитване', exact: true }).press('Enter');
      await expect(frame.locator('#record-count')).toHaveText('1');
      const records = await frame.locator('#records').textContent();
      await selectTheme(page, opposite(theme));
      for (const [label, value] of plan) await expect(page.getByRole('combobox', { name: label, exact: true })).toHaveValue(value);
      await expect(frame.locator('#record-count')).toHaveText('1'); await expect(frame.locator('#records')).toHaveText(records!);
      await frame.getByRole('button', { name: 'Повтори същата заявка', exact: true }).click();
      await expect(frame.locator('#record-count')).toHaveText('1');
      await frame.getByLabel('Учебен контакт', { exact: true }).selectOption('');
      await frame.getByRole('button', { name: 'Изпрати запитване', exact: true }).click();
      await expect(frame.locator('#status')).toContainText('контакт'); await expect(frame.locator('#record-count')).toHaveText('1');
      await frame.getByLabel('Учебен контакт', { exact: true }).selectOption('test@example.invalid');
      await frame.getByLabel('Условие за изпитване').selectOption('error');
      await frame.getByRole('button', { name: 'Изпрати запитване', exact: true }).click();
      await expect(frame.locator('#status')).toContainText('не успя');
      await selectTheme(page, title(theme)); await expect(frame.getByLabel('Условие за изпитване')).toHaveValue('error');
      await expect(frame.getByLabel('Учебен контакт', { exact: true })).toHaveValue('test@example.invalid');
      await page.getByRole('button', { name: 'Провери моя прототип', exact: true }).click();
      await expect(page.getByText('Прототипът покрива проверените условия за този случай. Приложи принципите към различния бизнес.')).toBeVisible();
      await selectTheme(page, opposite(theme));
      await expect(page.getByRole('button', { name: 'Приложи наученото към пекарната' })).toBeEnabled();
      await expect(page.getByText(/Проверени предоставени случаи в тази сесия/)).toContainText('1/2');
      await page.getByRole('button', { name: 'Приложи наученото към пекарната' }).click();
      for (const [label, value] of plan) await page.getByRole('combobox', { name: label, exact: true }).selectOption(label === plan[0][0] ? '18' : value);
      await page.getByRole('button', { name: 'Провери моя прототип', exact: true }).click();
      await expect(page.getByText(/Проверени предоставени случаи в тази сесия/)).toContainText('2/2');
      await assertLearningContrast(page.locator('main')); await assertLearningContrast(frame.locator('main'));
      await assertLearningFits(page);
      expect(await frame.locator('body').evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
      await page.screenshot({ path: info.outputPath(`silk-${theme}-${width}.png`), fullPage: true });
      expect(errors).toEqual([]);
    });
  }

  test(`${theme}: all six audio files play and keep playback through a theme change`, async ({ page }) => {
    await prepareAcademyTheme(page, theme); await page.goto('/academy-labs/perfect-video/start');
    const navigation = page.getByRole('navigation', { name: 'Избери демонстрация' });
    for (const [index, labels] of [[9, ['Референтен сигнал', 'Добавени отражения', 'Добавен шум', 'Ограничени върхове']], [10, ['Звук и картина заедно', 'Първо следващият звук']]] as const) {
      await navigation.getByRole('button').nth(index).click();
      for (const label of labels) {
        await page.getByRole('button', { name: label, exact: true }).click();
        const audio = page.locator('main audio');
        await audio.evaluate(async (el: HTMLAudioElement) => { el.muted = true; el.dataset.themeNode = 'preserved'; await el.play(); });
        await expect.poll(() => audio.evaluate((el: HTMLAudioElement) => el.currentTime)).toBeGreaterThan(.1);
        expect(await audio.evaluate((el: HTMLAudioElement) => el.duration)).toBeGreaterThan(index === 9 ? 6 : 9);
        await selectTheme(page, opposite(theme)); await expect(audio).toHaveAttribute('data-theme-node', 'preserved');
        expect(await audio.evaluate((el: HTMLAudioElement) => el.paused)).toBe(false);
        await audio.evaluate((el: HTMLAudioElement) => { el.pause(); el.currentTime = 2.5; el.dispatchEvent(new Event('timeupdate')); });
        await selectTheme(page, title(theme));
        expect(await audio.evaluate((el: HTMLAudioElement) => el.currentTime)).toBe(2.5);
        if (index === 10) {
          await expect(page.getByText('Пред вратата', { exact: true })).toBeVisible();
          await audio.evaluate((el: HTMLAudioElement) => { el.currentTime = 3.2; el.dispatchEvent(new Event('timeupdate')); });
          await expect(page.getByText('В работилницата', { exact: true })).toBeVisible();
        }
      }
    }
    await expect(page.getByRole('alert')).toHaveCount(0);
  });

  test(`${theme}: embedded request desk accepts keyboard submission and retains its journal`, async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 900 }); await prepareAcademyTheme(page, theme);
    const errors: string[] = []; page.on('pageerror', error => errors.push(error.message));
    await page.goto('/academy-labs/silk-road');
    const frame = page.frameLocator('iframe[title="Учебна форма: какво се случва след Изпрати"]');
    await frame.getByRole('button', { name: 'Изпрати учебна заявка', exact: true }).press('Enter');
    await expect(frame.locator('#record-count')).toHaveText('1');
    const records = await frame.locator('#records').textContent();
    await selectTheme(page, opposite(theme));
    await expect(frame.locator('#records')).toHaveText(records!);
    await frame.getByRole('button', { name: 'Повтори предишната заявка', exact: true }).click();
    await expect(frame.locator('#record-count')).toHaveText('1');
    await frame.getByRole('button', { name: 'Изпълни проверките', exact: true }).click();
    await expect(frame.locator('#checks li')).toHaveCount(6);
    await expect(frame.locator('#checks .failed')).toHaveCount(0);
    await expect(frame.locator('#record-count')).toHaveText('1');
    await selectTheme(page, title(theme));
    await expect(frame.locator('#record-count')).toHaveText('1');
    await assertLearningContrast(page.locator('main')); await assertLearningContrast(frame.locator('main')); await assertLearningFits(page);
    expect(await frame.locator('body').evaluate(() => { try { void window.parent.document; return false; } catch { return true; } })).toBe(true);
    await expect(page.getByRole('link', { name: 'Изтегли страницата', exact: true })).toHaveAttribute('download', 'index.html');
    expect(errors).toEqual([]);
  });

  for (const course of ['s01', 's02', 's03']) {
    test(`${theme}: ${course} lesson blocks preserve work, feedback and XP`, async ({ page }) => {
      test.setTimeout(90000);
      await page.setViewportSize({ width: 375, height: 900 });
      const calls = await prepareAcademyTheme(page, theme, { blocks: materials, title: 'Пробен урок за всички видове учебни блокове' });
      await page.goto(`/module/${course}-m01?lesson=0`);
      await expect(page.getByRole('heading', { name: 'Пробен блок: objective' })).toBeVisible();
      for (let i = 0; i < materials.length; i++) {
        const current = materials[i]; const type = current.type;
        await page.getByRole('button', { name: `Стъпка ${i + 1}: ${current.title}`, exact: true }).click();
        const panel = page.locator('[data-lesson-block]');
        await expect(panel.getByRole('heading', { name: String(current.title), exact: true })).toBeVisible();
        if (type === 'step_reveal') await panel.getByRole('button', { name: /Първо условие/ }).click();
        else if (type === 'flip_cards') await panel.getByRole('button', { name: /Пробно понятие А/ }).click();
        else if (type === 'matching') await panel.getByRole('combobox', { name: 'Свържи Условие А' }).selectOption('a');
        else if (type === 'sequence_sort') await panel.getByRole('button', { name: 'Премести надолу', exact: true }).first().click();
        else if (type === 'checklist') await panel.getByRole('checkbox', { name: 'Пробна отметка А' }).check();
        else if (['quiz', 'scenario'].includes(type)) {
          await panel.getByRole('button', { name: /Пробен избор за поправка/ }).click();
          await expect(panel.getByText('Пробният избор изисква поправка.')).toBeVisible();
        } else if (type === 'course_exam') await panel.getByRole('radio', { name: 'Отговор А', exact: true }).check();
        else { await panel.getByRole('button', { name: 'Прочетох', exact: true }).click(); await expect(panel.getByRole('button', { name: 'Прочетено', exact: true })).toBeVisible(); }
        await assertLearningContrast(panel); await assertLearningFits(page);
        const before = { reads: calls.academy_get_lesson_v2, grades: calls.academy_complete_lesson_block, exams: calls.academy_submit_course_exam };
        const xp = await page.getByText(/^\d+ XP$/).allTextContents();
        await selectTheme(page, opposite(theme));
        await expect(panel.getByRole('heading', { name: String(current.title), exact: true })).toBeVisible();
        if (type === 'step_reveal') await expect(panel.getByRole('button', { name: /Първо условие/ })).toHaveAttribute('aria-expanded', 'true');
        else if (type === 'flip_cards') await expect(panel.getByText('Обяснение А', { exact: true })).toBeVisible();
        else if (type === 'matching') await expect(panel.getByRole('combobox', { name: 'Свържи Условие А' })).toHaveValue('a');
        else if (type === 'sequence_sort') await expect(panel.locator('ol li').first()).toContainText('Действие Б');
        else if (type === 'checklist') await expect(panel.getByRole('checkbox', { name: 'Пробна отметка А' })).toBeChecked();
        else if (['quiz', 'scenario'].includes(type)) {
          await expect(panel.getByRole('button', { name: /Пробен избор за поправка/ })).toHaveAttribute('aria-pressed', 'true');
          await expect(panel.getByText('Пробният избор изисква поправка.')).toBeVisible();
        } else if (type === 'course_exam') await expect(panel.getByRole('radio', { name: 'Отговор А', exact: true })).toBeChecked();
        else await expect(panel.getByRole('button', { name: 'Прочетено', exact: true })).toBeVisible();
        expect({ reads: calls.academy_get_lesson_v2, grades: calls.academy_complete_lesson_block, exams: calls.academy_submit_course_exam }).toEqual(before);
        expect(await page.getByText(/^\d+ XP$/).allTextContents()).toEqual(xp);
        await assertLearningContrast(panel);
        if (['quiz', 'scenario'].includes(type)) {
          await panel.getByRole('button', { name: /Пробен избор за преминаване/ }).click(); await expect(panel.getByText('Пробната проверка е премината.')).toBeVisible();
        }
        await selectTheme(page, title(theme));
      }
      const panel = page.locator('[data-lesson-block]');
      await expect(panel.getByRole('radio', { name: 'Отговор А', exact: true })).toBeChecked();
      await expect(panel.getByRole('button', { name: 'Предай целия изпит' })).toBeDisabled();
      await panel.getByRole('radio', { name: 'Отговор В', exact: true }).check(); await panel.getByRole('button', { name: 'Предай целия изпит' }).click();
      await expect(panel.getByText('Демонстрационна обратна връзка за преглед на темата.')).toBeVisible();
      await selectTheme(page, opposite(theme));
      await expect(panel.getByText('Демонстрационна обратна връзка за преглед на темата.')).toBeVisible();
      expect(calls.academy_submit_course_exam).toBe(1);
      await page.reload();
      await expect(panel.getByRole('heading', { name: 'Пробен блок: course_exam' })).toBeVisible();
      await expect(panel.getByRole('radio', { name: 'Отговор А', exact: true })).toBeChecked();
      await expect(panel.getByRole('radio', { name: 'Отговор В', exact: true })).toBeChecked();
      await expect(page.locator('textarea,input[type=file]')).toHaveCount(0);
    });
  }

  test(`${theme}: payment, publishing and request journals survive theme changes`, async ({ page }) => {
    test.setTimeout(90000);
    const kinds = ['checkout', 'publishing', 'request'] as const;
    const calls = await prepareAcademyTheme(page, theme, { blocks: kinds.map((kind, i) => block('rich_text', { body: 'Учебна симулация с предоставени условия.', simulation: kind }, i)) });
    await page.goto('/module/s01-m01?lesson=0');
    for (let i = 0; i < kinds.length; i++) {
      const kind = kinds[i]; await page.getByRole('button', { name: `Стъпка ${i + 1}: Пробен блок: rich_text`, exact: true }).click();
      const panel = page.locator('[data-lesson-block]');
      for (const [scenario] of workflowScenarios[kind]) {
        await panel.getByRole('combobox', { name: 'Учебен случай' }).selectOption(scenario);
        for (const [, action] of workflowActions[kind]) await panel.getByRole('button', { name: action, exact: true }).click();
        const journal = await panel.getByRole('log').textContent(); const results = await panel.locator('dl').textContent();
        await selectTheme(page, opposite(theme));
        await expect(panel.getByRole('combobox', { name: 'Учебен случай' })).toHaveValue(scenario);
        await expect(panel.getByRole('log')).toHaveText(journal!); await expect(panel.locator('dl')).toHaveText(results!);
        await assertLearningContrast(panel); await assertLearningFits(page);
        await selectTheme(page, title(theme));
        await panel.getByRole('button', { name: 'Започни случая отначало' }).click();
        await expect(panel.getByRole('log').locator('li')).toHaveCount(1);
        await expect(panel.locator('dd').first()).toHaveText('0');
      }
    }
    expect(calls.academy_complete_lesson_block || 0).toBe(0);
  });
}

test('Standalone teaching files remain functional and do not call external services', async ({ page }) => {
  await prepareAcademyTheme(page, 'light'); await page.setViewportSize({ width: 320, height: 900 });
  await page.goto('/academy-labs/silk-road/index.html');
  await page.getByRole('button', { name: 'Изпълни проверките', exact: true }).click();
  await expect(page.locator('#checks li')).toHaveCount(6);
  await expect(page.locator('#checks .failed')).toHaveCount(0); await assertLearningFits(page);
  await page.goto('/academy/marketing-basics-practice.html');
  await page.getByRole('button', { name: 'Провери 7 гранични случая' }).click(); await expect(page.locator('#cpl-tests-result')).toContainText('7/7');
  await page.getByRole('button', { name: 'Изпълни 20 случая', exact: true }).click(); await expect(page.locator('#crm-result')).toContainText('15 записа · 11 задачи');
  await page.getByRole('button', { name: 'Изпълни 10 имейл случая', exact: true }).click(); await expect(page.locator('#email-result')).toContainText('3 уникални чернови · 0 изпратени писма');
  await assertLearningFits(page);
});
