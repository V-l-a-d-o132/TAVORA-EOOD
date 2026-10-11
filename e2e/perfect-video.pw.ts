import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.route('**/*', route => route.request().url().startsWith('http://127.0.0.1:5180/') ? route.continue() : route.abort());
  await page.goto('/academy-labs/perfect-video/start');
  const consent=page.getByRole('button', { name: 'Само задължителни', exact: true });
  if(await consent.isVisible())await consent.click();
});

test('all eleven demonstrations work on a narrow screen without text or file inputs', async ({ page }, info) => {
  const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));
  await page.setViewportSize({width:375,height:812});
  const navigation=page.getByRole('navigation',{name:'Избери демонстрация'});
  await expect(navigation.getByRole('button')).toHaveCount(11);
  for(let i=0;i<11;i++){
    await navigation.getByRole('button').nth(i).click();
    const group=page.getByRole('group',{name:'Вариант на демонстрацията'});
    const choices=group.getByRole('button');
    for(let n=0;n<await choices.count();n++){
      await choices.nth(n).click();
      await expect(choices.nth(n)).toHaveAttribute('aria-pressed','true');
      expect(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth)).toBe(true);
    }
  }
  await expect(page.locator('textarea,input[type=text],input[type=file]')).toHaveCount(0);
  await navigation.getByRole('button').first().click();
  await page.getByRole('button',{name:'Следващ момент',exact:true}).click();
  await expect(page.getByText('Подготовката',{exact:true})).toBeVisible();
  await page.screenshot({path:info.outputPath('story-mobile.png'),fullPage:true});
  expect(errors).toEqual([]);
});

test('six audio assets decode and sound leads the image in the J-cut example',async({page},info)=>{
  await page.getByRole('navigation',{name:'Избери демонстрация'}).getByRole('button').nth(9).click();
  for(const label of ['Референтен сигнал','Добавени отражения','Добавен шум','Ограничени върхове']){
    await page.getByRole('button',{name:label,exact:true}).click();
    const audio=page.locator('audio');
    await audio.evaluate(async(el:HTMLAudioElement)=>{el.muted=true;await el.play();});
    await expect.poll(()=>audio.evaluate((el:HTMLAudioElement)=>el.currentTime)).toBeGreaterThan(.1);
    expect(await audio.evaluate((el:HTMLAudioElement)=>el.duration)).toBeGreaterThan(6);
    await audio.evaluate((el:HTMLAudioElement)=>el.pause());
  }
  await page.getByRole('navigation',{name:'Избери демонстрация'}).getByRole('button').nth(10).click();
  for(const label of ['Звук и картина заедно','Първо следващият звук']){
    await page.getByRole('button',{name:label,exact:true}).click();
    const audio=page.locator('audio');await audio.evaluate(async(el:HTMLAudioElement)=>{el.muted=true;await el.play();});
    await expect.poll(()=>audio.evaluate((el:HTMLAudioElement)=>el.duration)).toBeGreaterThan(9);
    await audio.evaluate((el:HTMLAudioElement)=>{el.pause();el.currentTime=2.5;el.dispatchEvent(new Event('timeupdate'));});
    await expect(page.getByText('Пред вратата',{exact:true})).toBeVisible();
    await audio.evaluate((el:HTMLAudioElement)=>{el.currentTime=3.2;el.dispatchEvent(new Event('timeupdate'));});
    await expect(page.getByText('В работилницата',{exact:true})).toBeVisible();
  }
  await page.screenshot({path:info.outputPath('sound-cut-desktop.png'),fullPage:true});
});

test('public promise and schema describe the closed course and show a working sample',async({page},info)=>{
  await page.goto('/kurs/perfektnoto-video');
  await expect(page.getByRole('heading',{name:/История, която се разбира/})).toBeVisible();
  await expect(page.getByRole('region',{name:'Какво свързва кадрите?'})).toBeVisible();
  await page.getByRole('button',{name:'Трябва ли да качвам файлове или да пиша домашни?',exact:true}).click();
  await expect(page.getByText(/Няма свободни писмени отговори/)).toBeVisible();
  const schema=await page.locator('#schema-perfektno-video-funnel').textContent();
  expect(schema).toContain('предишните 239 урока');expect(schema).not.toContain('собствен проект');
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth)).toBe(true);
  await page.screenshot({path:info.outputPath('course-desktop.png'),fullPage:true});
});
