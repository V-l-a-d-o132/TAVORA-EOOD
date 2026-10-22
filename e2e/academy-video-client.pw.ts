import { readFileSync } from 'node:fs';
import { test, expect } from '@playwright/test';
import { prepareAcademyTheme } from './helpers/academy-theme-fixture';
import { assertLearningFits, assertLearningContrast } from './helpers/learning-contrast';
for (const theme of ['light','dark']) for (const width of [320,1280]) {
  test(`first paid video project: ${theme}, ${width}px`, async ({page},info) => {
    await page.setViewportSize({width,height:950});await prepareAcademyTheme(page,theme,undefined,{anonymous:true,hasFullAccess:false});
    const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));await page.goto('/academy-labs/perfect-video/start#client-project');
    const project=page.getByRole('region',{name:'Учебна поръчка V-1'});await expect(project.getByRole('heading',{name:'От кратък клип до изпълнима услуга'})).toBeVisible();
    await expect(project.locator('input,textarea,[contenteditable]')).toHaveCount(0);
    await project.getByRole('button',{name:'2. Сглоби историята'}).click();const movie=project.getByLabel('Действително монтиран учебен файл V-1');
    await expect(movie).toHaveJSProperty('videoWidth',360);await expect(movie).toHaveJSProperty('videoHeight',640);await expect(movie).toHaveJSProperty('duration',16);
    await movie.evaluate((v:HTMLVideoElement)=>v.play());await expect.poll(()=>movie.evaluate((v:HTMLVideoElement)=>v.currentTime)).toBeGreaterThan(0);await movie.evaluate((v:HTMLVideoElement)=>v.pause());
    await project.getByLabel('Монтажна последователност').selectOption('confusing');await expect(movie).toHaveAttribute('src',/confusing.mp4$/);
    await project.getByLabel('Текст за субтитрите').selectOption('delivery');await expect(project.getByRole('status')).toContainText('връща за редакция');
    const pending=page.waitForEvent('download');await project.getByRole('button',{name:'Изтегли избрания SRT'}).click();const file=await pending;expect(readFileSync((await file.path())!,'utf8')).toContain('Доставяме до дома за 5 минути.');
    await assertLearningFits(page);await assertLearningContrast(project);await project.screenshot({path:info.outputPath(`project-${theme}-${width}.png`)});
    await project.getByRole('button',{name:'3. Сметни работата'}).click();await project.getByRole('button',{name:'Добави втори кръг корекции · +2 ч.'}).click();await project.getByRole('button',{name:'Добави отстъпка · 20 €'}).click();await expect(project.getByRole('status')).toContainText('-20 €');
    await project.getByRole('button',{name:'Предложи +40 € за втория кръг'}).click();await expect(project.getByRole('status')).toContainText('180 €');await assertLearningFits(page);await assertLearningContrast(project);
    await project.getByRole('button',{name:'4. Предай резултата'}).click();const proposal=page.waitForEvent('download');await project.getByRole('button',{name:'Изтегли учебното предложение и разчета'}).click();expect(readFileSync((await (await proposal).path())!,'utf8')).toContain('Учебна цена: 180 €');
    await project.getByText('Как поръчката се развива през 15-те модула').click();await expect(project.locator('details a')).toHaveCount(15);await assertLearningFits(page);expect(errors).toEqual([]);
  });
}
