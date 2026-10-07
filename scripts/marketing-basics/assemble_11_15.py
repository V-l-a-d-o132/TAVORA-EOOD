"""Assemble public practice revisions from a private curriculum-only snapshot.

No production UUID, answer mapping or scoring metadata is written to Git.
"""
import copy
import hashlib
import json
import re
import sys
from pathlib import Path
from content_11_15 import CARDS, MODE
from choices_11_15 import LABELS
from workflows_11_15 import WORKFLOWS

ROOT = Path(__file__).resolve().parents[2]
RELEASE = 'marketing_basics_modules_11_15_ai_mcp_practice_20261007'
PUBLIC = ROOT / 'scripts/marketing-basics/releases/modules-11-15-20261007.json'
MODULE_COUNTS = {'s03-m11':10, 's03-m12':12, 's03-m13':12, 's03-m14':10, 's03-m15':9}

SOURCE_LABELS = {
    'Google: Business Profile guidelines':'Google: правила за бизнес профила',
    'Google: Verify with a video recording':'Google: видео верификация',
    'Google: Image SEO':'Google: изображения в търсенето',
    'Google: Local ranking':'Google: локално класиране',
    'Google: Appeal restrictions':'Google: обжалване на ограничения',
    'Google: Generative AI optimization guide':'Google: работа по AI видимостта',
    'Google: Business Profile performance':'Google: показатели на бизнес профила',
    'Google Maps: Prohibited content and fake engagement':'Google Maps: отзиви и забранени практики',
    'Google: Get more reviews':'Google: честни покани за отзив',
    'Google: Report inappropriate reviews':'Google: докладване на нарушаващи отзиви',
    'Google: Missing and delayed reviews':'Google: липсващи и забавени отзиви',
    'Google: Restrictions for policy violations':'Google: ограничения при нарушения',
    'Google: Spam policies':'Google: правила срещу спам',
    'Google: Helpful, reliable content':'Google: полезно и надеждно съдържание',
    'Google: Core Web Vitals':'Google: показатели за работата на страницата',
    'Google: LocalBusiness structured data':'Google: структурирани данни за бизнес',
    'Google: Review snippets':'Google: допустимост на отзиви със звезди',
    'Google: Search documentation updates':'Google: датирани промени в Search',
    'Google: Robots meta controls':'Google: указания за индексиране и откъси',
    'Google: Consolidate duplicate URLs':'Google: сходни страници и canonical',
    'Google: JavaScript SEO':'Google: достъп и рендериране на JavaScript',
    'Google: Generative AI performance reports — June 3 / August 31, 2026':'Google: AI отчети — юни/август 2026',
    'Google: Multimodal reporting — September 24, 2026':'Google: multimodal отчет — 24.09.2026',
    'YouTube: Search and discovery':'YouTube: търсене и откриване',
    'Google: Video structured data':'Google: структурирани данни за видео',
    'Google: Analyze social and video content':'Google: отчети за социално и видео съдържание',
}

def base_block(old):
    return dict(key=old['block_key'], type=old['block_type'], position=old['position'],
                title=old['title'], content=copy.deepcopy(old['content']),
                required=old['required'], points=old['points'])

def add_table(content, table):
    columns, rows = table
    content.update(columns=list(columns), table=[dict(cells=list(row)) for row in rows])

def references(old, extra):
    links = copy.deepcopy(old.get('sources', []))
    for label, url in extra:
        if url not in [x['url'] for x in links]:
            links.append(dict(label=label, url=url))
    for link in links:
        link['label'] = SOURCE_LABELS.get(link['label'], link['label'])
    return links

def practice(row):
    lid = row['lesson_id']
    c = CARDS[lid]
    original_case = next(b for b in row['blocks'] if b['block_key']=='case')['content']['body']
    original_case = original_case.replace('Учебен пример с илюстративни данни.\n\n','')
    lab = next((b['content']['body'] for b in row['blocks'] if b['block_key']=='lab_dataset'), '')
    blocks = []
    for old in row['blocks']:
        if old['block_type']=='practical_response':
            continue  # Retired input is preserved in protected history.
        b = base_block(old)
        key = b['key']
        if key == 'objective':
            b.update(title='Какво ще можеш след урока', content=dict(
                body=c['opening'], outcomes=list(c['skills']), deliverable=c['task'],
                check=' '.join(c['checks'])))
        elif key == 'principle':
            body = old['content']['body']
            b.update(title='Обяснение: човекът, изборът и правилото', content=dict(
                body=c['terms']+'\n\n'+c['bridge']+'\n\n'+body))
        elif key == 'hook':
            b.update(title='Проблемът, който ще решиш', content=dict(body=c['opening']))
        elif key == 'case':
            content = dict(body='Предоставени учебни факти и неизвестни. Не са пазарна статистика или твой изпълнен проект.\n\n'+c['facts'])
            if c['table'] and not any(x['block_key']=='working_table' for x in row['blocks']):
                add_table(content,c['table'])
            b.update(title='Входни данни за задачата', content=content)
        elif key == 'working_table' and c['table']:
            content = dict(body='Работна таблица за този учебен случай.')
            add_table(content,c['table'])
            b.update(title='Данните в таблица',content=content)
        elif key == 'practice_brief':
            b.update(title='Направи задача и провери резултата', content=dict(body=
                c['task']+'\n\nКритерии за самопроверка:\n'+
                '\n'.join(f'{i}. {x}' for i,x in enumerate(c['checks'],1))+
                '\n\nПърва подсказка при трудност: '+c['hints'][0]+
                '\nВтора подсказка — правилото: '+c['hints'][1]+
                '\n\nИИ в процеса — упражнение и проверка:\n'+c['ai']+
                '\n\n'+MODE+
                '\n\nСлед своя опит отвори показаното решение и поправи една разлика. '
                'Следващите автоматични проверки използват отделни, изрично предоставени случаи.'))
        elif key == 'rubric':
            assert len(b['content']['items'])==3
            for item, criterion in zip(b['content']['items'],c['checks']):
                item['text']=criterion
        elif key == 'model_solution':
            assert len(b['content']['cards'])==1
            b.update(title='Показано решение — отвори след опит')
            b['content']['cards'][0].update(front='Първо направи собствен опит. След това отвори образеца; той не е твой измерен резултат.',
                                           back=c['sample'])
        elif b['type'] in ['quiz','scenario']:
            # Every assessment gets its complete original case; it remains a distinct transfer task.
            field = 'question' if b['type']=='quiz' else 'prompt'
            context=original_case+ ('\n\nДопълнителен учебен отчет:\n'+lab if key not in ['check_1','check_2'] and lab else '')
            b['content'][field]='Нов учебен случай за самостоятелна проверка:\n'+context+'\n\n'+b['content'][field]
            retained = old['evaluation']['correct']
            if (lid,key) in LABELS:
                assert len(LABELS[lid,key])==len(b['content']['options'])
                for option,label in zip(b['content']['options'],LABELS[lid,key]):
                    option['label']=label
            label=next(x['label'] for x in b['content']['options'] if x['id']==retained)
            explanation=old.get('feedback',{}).get('explanation','')
            b['feedback']=dict(explanation=label+' '+explanation+'\n\nКъде да провериш: '+c['hints'][0]+'\nПравило: '+c['hints'][1])
            options=b['content']['options']
            shift=int(hashlib.sha256((lid+'/'+key+'/20261007').encode()).hexdigest()[:8],16)%len(options)
            b['content']['options']=options[shift:]+options[:shift]
        elif b['type']=='step_reveal':
            texts=c['workflow'] or WORKFLOWS[lid]
            assert len(texts)==len(b['content']['steps'])==4
            for step,body in zip(b['content']['steps'],texts):step['text']=body
        elif key=='workflow':
            b.update(title='Метод за изпълнение и проверка',content=dict(body=
                '1. Отдели предоставените факти от неизвестните. Правило: '+c['bridge']+
                '\n\n2. Направи собствен опит: '+c['task']+
                '\n\n3. Провери по критериите: '+' '.join(c['checks'])+
                '\n\n4. Отвори образеца, поправи разлика и запази резултата. При ИИ или MCP: '+c['ai']))
        elif key=='working_table':
            b['content']['body']='Шаблон за минималния договор на данните: попълни по предоставения случай. Непроверен срок или основание остава неизвестно; не въвеждай действителни лични данни.'
        elif b['type']=='calculator':
            b['content']['prompt']='Отделна учебна сметка за автоматична проверка. Използвай само дадените стойности и еднаква основа.\n\n'+b['content']['prompt']
        elif key=='lab_workbook':
            b.update(title='Работен документ за твоя план',content=dict(body=
                c['task']+'\n\nСекции: предоставено и неизвестно; решения и причини; финансови допускания; разрешени действия; тестове; резултат и следваща проверка.\n\n'+
                'Критерии:\n'+'\n'.join(c['checks'])+'\n\nИИ и MCP: '+c['ai']+'\n\n'+MODE))
        elif key=='lab_dataset':
            b.update(title='Отделен учебен отчет за допълнителните проверки')
            b['content']['body']='Този предоставен отчет е за следващите допълнителни проверки; не е измерен резултат от твоя план.\n\n'+b['content']['body']
        elif key == 'sources':
            b.update(title='Първични източници и текущи условия',content=dict(
                body='Новостите за ИИ и MCP са допълнени с датирани първични източници за изданието от 7 октомври 2026. '
                'Дълготрайното умение е да проверяваш факт, обхват и резултат. '
                'За действителна настройка сверявай текущия продукт, регион, роля и условия. '
                'Учебният случай не доказва настройка, разрешение или резултат в твой акаунт.',
                sources=references(old['content'],c['sources'])))
        elif key == 'summary':
            b.update(title='Какво запазваш и как продължаваш',content=dict(
                takeaways=list(c['skills']),
                nextStep='Запази резултата и отбележи дадено, проверено и неизвестно. '
                'Ако видиш измислен факт или неверен статус, поправи го преди следващата задача. '
                'Показаният образец е за сравнение; реалният ти проект се проверява отделно.'))
        else:
            continue
        blocks.append(b)
    return blocks,c['opening'],c['title'] or row['version']['title']

def assemble(source_path,hashes_path):
    source=json.loads(Path(source_path).read_text())
    hashes={x['lesson_id']:x['fingerprint'] for x in json.loads(Path(hashes_path).read_text())}
    selected=[r for r in source if r['lesson_id'] in CARDS]
    assert len(CARDS)==53 and len(selected)==53
    assert sum(len(r['blocks']) for r in selected)==726
    assert {m:sum(r['module_id']==m for r in selected) for m in MODULE_COUNTS}==MODULE_COUNTS
    specs=[]
    for row in selected:
        blocks,opening,title=practice(row)
        assert len({b['key'] for b in blocks})==len(blocks)
        specs.append(dict(module=row['module_id'],lesson=row['lesson_id'],title=title,
            objective=opening,hook=opening,source_version=row['version']['version_number'],
            source_hash=hashes[row['lesson_id']],source_blocks=len(row['blocks']),
            blocks=sorted(blocks,key=lambda b:b['position'])))
    PUBLIC.write_text(json.dumps(specs,ensure_ascii=False,separators=(',',':'))+'\n')
    fixture=[]
    # Sanitized source exercises preservation; real evaluation stays outside Git.
    for row in source:
        v=row['version']
        fixture.append(dict(module_id=row['module_id'],lesson_id=row['lesson_id'],
            version={k:v[k] for k in ['title','subtitle','duration','objective','hook','estimated_minutes','source_kind','change_note','version_number']},
            blocks=[{k:b[k] for k in ['block_key','position','block_type','title','content','required','points']} for b in row['blocks']]))
    (ROOT/'tests/fixtures/marketing-basics-11-15-before.json').write_text(json.dumps(fixture,ensure_ascii=False,separators=(',',':'))+'\n')
    print(json.dumps(dict(lessons=len(specs),changed_blocks=sum(len(s['blocks']) for s in specs),
                         archived_blocks=sum(s['source_blocks'] for s in specs),public_bytes=PUBLIC.stat().st_size)))

if __name__=='__main__':
    assemble(*sys.argv[1:])
