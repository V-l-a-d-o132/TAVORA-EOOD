import { readFileSync } from 'node:fs';
import { test, expect } from '@playwright/test';
import { loadFinalMarketingAiCandidates } from '../scripts/prepare-final-marketing-ai-assets.mjs';
const demos=JSON.parse(readFileSync('src/data/marketing-ai-final-demos.json','utf8')); 
const models=JSON.parse(readFileSync('src/data/marketing-ai-final-workbenches.json','utf8'));
import { prepareAcademyTheme } from './helpers/academy-theme-fixture';
import { assertLearningFits, assertLearningContrast } from './helpers/learning-contrast';
const rows=loadFinalMarketingAiCandidates();
const privateRows=process.env.MARKETING_AI_FINAL_PRIVATE?JSON.parse(readFileSync(process.env.MARKETING_AI_FINAL_PRIVATE,'utf8')):null;
test.setTimeout(240000);
for(const [mode,{theme,width}] of [{theme:'light',width:320},{theme:'light',width:1280},{theme:'dark',width:320},{theme:'dark',width:1280}].entries()){
  test(`ten final modules and eight working models: ${theme}, ${width}px`,async({page},info)=>{
    await page.setViewportSize({width,height:950});const requests=await prepareAcademyTheme(page,theme,undefined,{anonymous:true,hasFullAccess:false});const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));
    await page.goto('/academy-tools/marketing-basics');const demo=page.getByRole('region',{name:'Предоставена демонстрация'});
    await expect(page.getByRole('combobox',{name:'Избери модул'}).locator('option')).toHaveCount(20);
    for(const guide of demos){
      await page.getByRole('combobox',{name:'Избери модул'}).selectOption(guide.module);
      await expect(demo.getByRole('heading',{name:guide.title,exact:true})).toBeVisible();
      await demo.getByRole('button',{name:'Свери с източниците',exact:true}).click();await expect(demo.getByRole('status').first()).toBeVisible();
      await demo.getByRole('group',{name:'Избери учебна версия'}).getByRole('button').nth(1).click();await expect(demo.getByRole('button',{name:'Свери с източниците',exact:true})).toHaveAttribute('aria-expanded','false');
      if('finalWorkbench'in guide){
        const model=models[guide.finalWorkbench],work=demo.getByRole('region',{name:model.title,exact:true});
        for(const c of model.cases){await work.getByRole('combobox',{name:'Готов случай'}).selectOption(c.id);for(const a of model.actions)await work.getByRole('button',{name:a.label,exact:true}).click();await expect(work.getByRole('status')).toBeVisible();}
        await assertLearningContrast(work);await work.screenshot({path:info.outputPath(`${guide.finalWorkbench}-${theme}-${width}.png`)});
        await work.getByRole('button',{name:'Започни случая отначало'}).click();await expect(work.getByRole('status')).toHaveCount(0);
      }
      await assertLearningFits(page);await assertLearningContrast(demo);
    }
    await expect(page.getByRole('region',{name:'Подбрани инструменти'}).getByRole('article')).toHaveCount(23);
    await assertLearningContrast(page.locator('main'));expect(await page.locator('input,textarea,[contenteditable="true"]').count()).toBe(0);
    expect(requests.academy_complete_lesson_block||0).toBe(0);expect(requests.academy_autosave_lesson||0).toBe(0);expect(errors).toEqual([]);
  });
  test(`all assigned paid guides, independent cases and retries: ${theme}, ${width}px`,async({page},info)=>{
    await page.setViewportSize({width,height:950});
    // Partition the 34 actual additions across four theme/width combinations.
    // Every new paid guide and case is exercised; models receive all four combinations above.
    for(const row of rows.filter((_,index)=>index%4===mode)){
      await page.unrouteAll({behavior:'wait'});
      const guide=row.payload.additions[0],block=row.payload.additions[1],privateCheck=privateRows?.find(r=>r.lesson===row.lesson).payload.additions[1];
      const matches=privateCheck?.evaluation.matches||Object.fromEntries(block.content.left.map(s=>[s.id,s.choices[0]]));
      await prepareAcademyTheme(page,theme,{title:guide.title,blocks:[{...guide,id:'00000000-0000-4000-8000-000000000087',position:0},{...block,id:'00000000-0000-4000-8000-000000000088',position:1}],matchingExpected:matches,matchingFeedback:block.content.left.map(s=>({slot:s.id,label:s.text,success:'Изборът пази условията на предоставения случай.',retry:'Свери избора с дадения обхват и условия.'}))});
      await page.goto(`/module/${row.module}?lesson=${row.lesson}`);
      await expect(page.getByText(guide.content.marketingAi.intro.replace(/\s+/g,' '),{exact:true})).toHaveCount(1);
      await assertLearningFits(page);
      await page.getByRole('button',{name:'Прочетох',exact:true}).click();await page.getByRole('button',{name:'Следваща',exact:true}).click();
      const studio=page.getByTestId('closed-practice-studio');await expect(studio).toBeVisible();
      for(const slot of block.content.left)await studio.getByRole('combobox',{name:slot.text,exact:true}).selectOption(matches[slot.id]);
      const first=block.content.left[0];await studio.getByRole('combobox',{name:first.text,exact:true}).selectOption(first.choices.find(id=>id!==matches[first.id]));
      await studio.getByRole('button',{name:'Провери решенията',exact:true}).click();await expect(page.getByText('Свери избора с дадения обхват и условия.',{exact:true})).toBeVisible();
      await studio.getByRole('combobox',{name:first.text,exact:true}).selectOption(matches[first.id]);await studio.getByRole('button',{name:'Провери решенията',exact:true}).click();await expect(studio.getByRole('button',{name:'Практиката е премината'})).toBeVisible();
      await assertLearningFits(page);await assertLearningContrast(studio);expect(await studio.locator('input,textarea,[contenteditable="true"]').count()).toBe(0);
      if(row.lesson==='lm20-09'||row.lesson==='lm17-06')await page.screenshot({path:info.outputPath(`${row.lesson}-${theme}-${width}.png`),fullPage:true});
    }
  });
}
test('public final-module examples keep paid lessons closed',async({page})=>{
  const requests=await prepareAcademyTheme(page,'light',undefined,{anonymous:true,hasFullAccess:false});await page.goto('/academy-tools/marketing-basics?module=s03-m20');await expect(page.getByRole('combobox',{name:'Избери модул'})).toHaveValue('s03-m20');await page.goto('/module/s03-m20?lesson=lm20-09');await expect(page.getByRole('heading',{name:/създай|Влез|вход|Достъп|заключен/i}).first()).toBeVisible();expect(requests.academy_get_lesson_v2||0).toBe(0);
});
