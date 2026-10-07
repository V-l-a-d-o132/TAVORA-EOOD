"""Assemble public practice revisions from a private curriculum-only snapshot.

No production UUID, answer mapping or scoring metadata is written to Git.
"""
import copy
import hashlib
import json
import re
import sys
from pathlib import Path
from content_6_10 import CARDS, MODE
from amendments_1_5 import AMENDMENTS

ROOT = Path(__file__).resolve().parents[2]
RELEASE = 'marketing_basics_modules_6_10_strategy_practice_20261007'
PUBLIC = ROOT / 'scripts/marketing-basics/releases/modules-6-10-20261007.json'
MODULE_COUNTS = {'s03-m06':12, 's03-m07':10, 's03-m08':14, 's03-m09':14, 's03-m10':12}

# Public prose drafts only. Retained private mappings are read from the source at assembly.
BALANCED = {
    ('lm07-09','check_1'): (
        '60 от 80 допустими услуги: това е покритието на поканите.',
        '15 от 60 покани: това е доказаното покритие на услугите.',
        '15 от всички клиенти: това е съпоставимото покритие.'),
    ('lm08-02','check_1'): (
        'Разрешен случай с база, период, действие и ограничения.',
        'Собствена значка „експерт“ с уверено описание на резултат.',
        'AI обобщение, което нарича метода доказано успешен.'),
    ('lm08-09','check_2'): (
        'Сверяваш приложимия тип и фактите, без измислен адрес.',
        'Добавяш адрес на близък офис, за да мине проверката.',
        'Публикуваш домашния адрес, за да запълниш полето.'),
    ('lm08-10','check_1'): (
        'Не; външният код не променя контекста на собствените отзиви.',
        'Да; собствените отзиви стават допустими при рейтинг над 4,5.',
        'Да; външният widget превръща сайта в независим оценител.'),
    ('lm09-02','check_2'): (
        'Сверяваш подходящите опции и поверителността преди публикация.',
        'Публикуваш домашния адрес, за да има еднакви NAP записи.',
        'Въвеждаш адрес на близък офис за последователна идентичност.'),
    ('lm10-10','check_1'): (
        'Време за изследване, проверка и работа след публикуване.',
        'Още повече теми, за да се изпълни седмичната бройка.',
        'Задължително присъствие във всички налични платформи.'),
}

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
            body = old['content']['body'].replace('Към 30 септември 2026','Към 7 октомври 2026')
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
        elif key in ['check_1','check_2']:
            # Every assessment gets its complete original case; it remains a distinct transfer task.
            field = 'question' if b['type']=='quiz' else 'prompt'
            b['content'][field]='Нов учебен случай за самостоятелна проверка:\n'+original_case+'\n\n'+b['content'][field]
            retained = old['evaluation']['correct']
            if (lid,key) in BALANCED:
                drafts=BALANCED[lid,key]
                alternatives=iter(drafts[1:])
                for option in b['content']['options']:
                    option['label']=drafts[0] if option['id']==retained else next(alternatives)
            label=next(x['label'] for x in b['content']['options'] if x['id']==retained)
            explanation=old.get('feedback',{}).get('explanation','')
            b['feedback']=dict(explanation=label+' '+explanation+'\n\nКъде да провериш: '+c['hints'][0]+'\nПравило: '+c['hints'][1])
            options=b['content']['options']
            shift=int(hashlib.sha256((lid+'/'+key+'/20261007').encode()).hexdigest()[:8],16)%len(options)
            b['content']['options']=options[shift:]+options[:shift]
        elif key == 'sources':
            b.update(title='Първични източници и текущи условия',content=dict(
                body='Първичните правила са сверени за изданието от 7 октомври 2026. '
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
    return blocks,c['opening'],row['version']['title']

def amendment(row):
    a=AMENDMENTS[row['lesson_id']]
    blocks=[]
    for old in row['blocks']:
        b=base_block(old)
        key=b['key']
        if key=='outcome':
            b['content']['body']=a['opening']
            b['content']['outcomes'][-1]=a['skill']
            b['content']['deliverable']+='\n\n'+a['task']
            b['content']['check']+=' '+a['check']
        elif key=='uncomfortable_truth':
            b['content']['body']+='\n\n'+a['theory']
        elif key=='method':
            b['content']['body']+=(
                '\n\n'+a['task']+'\nСамопроверка: '+a['check']+
                '\nПодсказка: отдели цитат, извод и неизвестно. Правило: обещанието следва факта, разхода и изпълнимостта.')
        elif key=='case':
            b['content']['body']+=(
                '\n\nДопълнителен предоставен учебен случай по стратегията:\n'+a['facts']+
                '\n\nПоказано решение за сравнение след собствен опит:\n'+a['sample'])
        elif key=='primary_source':
            b['content']['body']+='\n\nДопълнения по стратегията: 7 октомври 2026. Психологическият механизъм се използва като хипотеза за конкретен случай, без универсална гаранция за продажба.'
            b['content']['sources']=references(old['content'],a['sources'])
        elif key=='handoff':
            b['content']['takeaways'][-1]=a['skill']
            b['content']['nextStep']+='\n\n'+a['task']+' '+a['check']
        else:
            continue
        blocks.append(b)
    return blocks,a['opening'],a.get('title',row['version']['title'])

def assemble(source_path,hashes_path):
    source=json.loads(Path(source_path).read_text())
    hashes={x['lesson_id']:x['fingerprint'] for x in json.loads(Path(hashes_path).read_text())}
    selected=[r for r in source if r['lesson_id'] in CARDS or r['lesson_id'] in AMENDMENTS]
    assert len(CARDS)==62 and len(AMENDMENTS)==6 and len(selected)==68
    assert {m:sum(r['module_id']==m for r in selected) for m in MODULE_COUNTS}==MODULE_COUNTS
    specs=[]
    for row in selected:
        blocks,opening,title=practice(row) if row['lesson_id'] in CARDS else amendment(row)
        assert len({b['key'] for b in blocks})==len(blocks)
        specs.append(dict(module=row['module_id'],lesson=row['lesson_id'],title=title,
            objective=opening,hook=opening,source_version=row['version']['version_number'],
            source_hash=hashes[row['lesson_id']],source_blocks=len(row['blocks']),
            blocks=sorted(blocks,key=lambda b:b['position'])))
    PUBLIC.write_text(json.dumps(specs,ensure_ascii=False,separators=(',',':'))+'\n')
    fixture=[]
    # Include all current first five modules to verify the 35 unaffected lessons too.
    for row in source:
        v=row['version']
        fixture.append(dict(module_id=row['module_id'],lesson_id=row['lesson_id'],
            version={k:v[k] for k in ['title','subtitle','duration','objective','hook','estimated_minutes','source_kind','change_note','version_number']},
            blocks=[{k:b[k] for k in ['block_key','position','block_type','title','content','required','points']} for b in row['blocks']]))
    (ROOT/'tests/fixtures/marketing-basics-6-10-before.json').write_text(json.dumps(fixture,ensure_ascii=False,separators=(',',':'))+'\n')
    path=ROOT/'src/mocks/learning-platform.ts'
    text=path.read_text()
    for lid,a in AMENDMENTS.items():
        if 'title' not in a:continue
        pattern=r"(\{ id: '"+re.escape(lid)+r"', title: )[^\n]+?(, hasQuiz: true \})"
        text,n=re.subn(pattern,lambda m:m[1]+json.dumps(a['title'],ensure_ascii=False)+m[2],text)
        assert n==1,lid
    path.write_text(text)
    print(json.dumps(dict(lessons=len(specs),changed_blocks=sum(len(s['blocks']) for s in specs),
                         archived_blocks=sum(s['source_blocks'] for s in specs),public_bytes=PUBLIC.stat().st_size)))

if __name__=='__main__':
    assemble(*sys.argv[1:])
