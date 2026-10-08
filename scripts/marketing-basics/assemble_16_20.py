"""Assemble compatible public revisions without exposing production grading keys."""
import copy
import hashlib
import json
import sys
from pathlib import Path
from content_16_20 import CARDS, MODE
import practice_16, practice_17, practice_18, practice_19, practice_20  # register cards
from choices_16_20 import LABELS

ROOT = Path(__file__).resolve().parents[2]
PUBLIC = ROOT / 'scripts/marketing-basics/releases/modules-16-20-20261007.json'
MODULE_COUNTS = {'s03-m16':8,'s03-m17':11,'s03-m18':9,'s03-m19':11,'s03-m20':14}

def assessment_context(row):
    parts=[]
    for b in row['blocks']:
        if b['block_key'] in ('case','working_table','lab_dataset'):
            c=b['content']
            if c.get('body'): parts.append(c['body'])
            if c.get('table'):
                parts.append(' | '.join(c.get('columns',[])))
                parts.extend(' | '.join(str(x) for x in r['cells']) for r in c['table'])
    return '\n\n'.join(parts)

def revise(row):
    c=CARDS[row['lesson_id']]; blocks=[]
    for old in row['blocks']:
        if old['block_type'] in ('practical_response','sequence_sort','course_exam'): continue
        b=dict(key=old['block_key'],type=old['block_type'],position=old['position'],title=old['title'],
               content=copy.deepcopy(old['content']),required=old['required'],points=old['points'])
        key=b['key']
        if key=='objective': b.update(title='Какво ще можеш след урока',content=dict(body=c['opening'],outcomes=list(c['skills']),deliverable=c['task'],check=' '.join(c['checks'])))
        elif key=='hook': b.update(title='Проблемът, който ще решиш',content=dict(body=c['opening']))
        elif key=='preparation': b.update(title='Подготовка и карта за преговор',content=dict(body=c['preparation']+'\n\n'+MODE))
        elif key=='principle': b.update(title='Обяснение: човекът, изборът и правилото',content=dict(body=c['terms']+'\n\n'+c['bridge']+'\n\n'+(c['principle'] or old['content']['body'])))
        elif key=='case': b.update(title='Предоставени данни за твоята задача',content=dict(body='Учебни факти и неизвестни. Това е симулация, не измерен резултат от твоя проект.\n\n'+c['facts']))
        elif key=='practice_brief': b.update(title='Направи задача и провери резултата',content=dict(body=c['task']+'\n\nКритерии за самопроверка:\n'+'\n'.join(f'{i}. {x}' for i,x in enumerate(c['checks'],1))+'\n\nПърва подсказка: '+c['hints'][0]+'\nВтора подсказка — правилото: '+c['hints'][1]+'\n\nИИ в процеса — упражнение и проверка:\n'+c['ai']+'\n\n'+MODE+'\n\nСлед опита отвори образеца и поправи разлика. Автоматичните проверки използват отделни изрично предоставени случаи.'))
        elif key=='rubric':
            if len(b['content']['items'])==3:
                for item,text in zip(b['content']['items'],c['checks']): item['text']=text
        elif key=='model_solution':
            assert len(b['content']['cards'])==1
            b.update(title='Показано решение — отвори след опит')
            b['content']['cards'][0].update(front='Първо направи собствен опит. Образецът е за сравнение, не твой пазарен резултат.',back=c['sample'])
        elif b['type'] in ('quiz','scenario'):
            field='question' if b['type']=='quiz' else 'prompt'
            b['content'][field]='Отделен учебен случай за автоматична проверка:\n'+assessment_context(row)+'\n\n'+b['content'][field]
            if (row['lesson_id'],key) in LABELS:
                for option,label in zip(b['content']['options'],LABELS[row['lesson_id'],key],strict=True): option['label']=label
            # Public feedback contains guidance only. SQL derives the correct label from the private key.
            b['feedback']=dict(explanation='Къде да провериш: '+c['hints'][0]+'\nПравило: '+c['hints'][1])
            options=b['content']['options']; shift=int(hashlib.sha256((row['lesson_id']+'/'+key+'/20261007').encode()).hexdigest()[:8],16)%len(options)
            b['content']['options']=options[shift:]+options[:shift]
        elif b['type']=='calculator': b['content']['prompt']='Отделна учебна сметка: използвай само оригиналните дадени стойности.\n\n'+b['content']['prompt']
        elif b['type']=='step_reveal':
            # Keep all 4/5/6 step IDs, order and their specific method; strengthen the final verification.
            steps=b['content']['steps']; assert len(steps) in (4,5,6)
            steps[0]['text']=steps[0].get('text','')+'\nПредоставеният случай: '+c['facts']
            steps[-1]['text']=steps[-1].get('text','')+'\nПровери: '+' '.join(c['checks'])+'\nИИ и MCP: '+c['ai']
        elif key=='workflow': b.update(title='Метод за изпълнение и проверка',content=dict(body='1. '+c['bridge']+'\n2. '+c['task']+'\n3. '+' '.join(c['checks'])+'\n4. Отвори образеца, поправи разлика и запази версията.\n'+c['ai']))
        elif key in ('working_table','lab_dataset'):
            b['content']['body']='Предоставени допълнителни данни за отделните автоматични проверки. Не са резултат от твоя проект.\n\n'+b['content'].get('body','')
        elif key=='lab_workbook': b.update(title='Работен документ и дневник на версия 2',content=dict(body=c['task']+'\n\nСекции: предоставено/неизвестно; решение и причина; сметка; разрешени действия; тестове; поправка; следваща проверка.\n\n'+'\n'.join(c['checks'])+'\n\n'+MODE))
        elif key=='sources':
            links=copy.deepcopy(old['content'].get('sources',[]))
            for label,url in c['sources']:
                if url not in [x['url'] for x in links]: links.append(dict(label=label,url=url))
            b.update(title='Първични източници и учебна лаборатория',content=dict(body='Сверено за изданието от 7 октомври 2026. Външният продукт се проверява по текущи план, права, възраст, регион и условия. Действителна настройка или пазарен резултат не се удостоверяват от учебната симулация.',sources=links))
        elif key=='summary': b.update(title='Какво запазваш и как продължаваш',content=dict(takeaways=list(c['skills']),nextStep='Запази резултата, тестовия журнал и поправката. Отдели предоставено, проверено и неизвестно. При неуспех прегледай правилото и реши нов случай.'))
        else: raise AssertionError((row['lesson_id'],key,b['type']))
        blocks.append(b)
    return blocks,c['opening'],c['title'] or row['version']['title']

def assemble(source_path, hashes_path):
    source=json.loads(Path(source_path).read_text()); hashes={x['lesson_id']:x['fingerprint'] for x in json.loads(Path(hashes_path).read_text())}
    assert len(CARDS)==len(source)==53 and sum(len(r['blocks']) for r in source)==720
    assert {m:sum(r['module_id']==m for r in source) for m in MODULE_COUNTS}==MODULE_COUNTS
    specs=[]; fixtures=[]
    for r in source:
        blocks,opening,title=revise(r)
        specs.append(dict(module=r['module_id'],lesson=r['lesson_id'],title=title,objective=opening,hook=opening,
            source_version=r['version']['version_number'],source_hash=hashes[r['lesson_id']],source_blocks=len(r['blocks']),blocks=blocks))
        fields=('version_number','title','subtitle','duration','objective','hook','estimated_minutes','source_kind','change_note')
        fixtures.append(dict(module_id=r['module_id'],lesson_id=r['lesson_id'],version={f:r['version'][f] for f in fields},
            blocks=[{k:b[k] for k in ('block_key','position','block_type','title','content','required','points')} for b in r['blocks']]))
    assert sum(len(s['blocks']) for s in specs)==652
    PUBLIC.write_text(json.dumps(specs,ensure_ascii=False,separators=(',',':'))+'\n')
    (ROOT/'tests/fixtures/marketing-basics-16-20-before.json').write_text(json.dumps(fixtures,ensure_ascii=False,separators=(',',':'))+'\n')
    print('Assembled 53 lessons, 652 revised blocks; protected keys excluded.')

if __name__=='__main__': assemble(*sys.argv[1:])
