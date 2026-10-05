"""Assemble public editorial patches from a private curriculum-only snapshot.

No learner data is accepted. No real grading mappings are written to Git.
Usage: python scripts/marketing-basics/assemble_1_5.py source.json hashes.json
"""
import copy
import hashlib
import json
import re
import sys
from pathlib import Path
from content_1_5 import CARDS, HEMUS, CONTACTS, TITLES
from choices_1_5 import CHOICES

ROOT = Path(__file__).resolve().parents[2]
RELEASE = 'marketing_basics_modules_1_5_clear_practice_20261005'
COUNTS = {'s03-m01': 7, 's03-m02': 8, 's03-m03': 8, 's03-m04': 10, 's03-m05': 8}
PUBLIC = ROOT / 'scripts/marketing-basics/releases/modules-1-5-20261005.json'

SOURCES = {
    'ai': ('Google: AI функции и сайт', 'https://developers.google.com/search/docs/appearance/ai-features'),
    'consent': ('Google: Consent Mode, basic и advanced', 'https://developers.google.com/tag-platform/security/concepts/consent-mode'),
    'gdpr': ('EDPB: съгласие по GDPR', 'https://www.edpb.europa.eu/documents/guideline/guidelines-052020-on-consent-under-regulation-2016679_en'),
    'ai_act': ('ЕК: насоки за прозрачност по чл. 50, 20.07.2026', 'https://digital-strategy.ec.europa.eu/en/library/guidelines-transparency-obligations-providers-and-deployers-ai-systems'),
    'mcp': ('MCP: архитектура', 'https://modelcontextprotocol.io/docs/learn/architecture'),
    'mcp_security': ('MCP: практики за сигурност', 'https://modelcontextprotocol.io/docs/tutorials/security/security_best_practices'),
    'euro': ('Официален портал: край на двойното обозначаване', 'https://evroto.bg/bg/news/459-periodat-na-zadalzhitelno-dvoyno-oboznachavane-na-tsenite-priklyuchva-na-8-avgus'),
    'prices': ('КЗП: контрол на потребителските цени след 09.08.2026', 'https://kzp.bg/bg/novini/424'),
    'consumer': ('КЗП: онлайн покупки', 'https://kzp.bg/bg/polezni-saveti/internet'),
}
SOURCE_KEYS = {
    'lm01-01': ['ai'], 'lm03-05': ['ai'], 'lm04-01': ['consent'],
    'lm04-02': ['ai_act'], 'lm04-04': ['gdpr'], 'lm04-09': ['consent', 'gdpr'],
    'lm04-10': ['consent', 'gdpr'],
    'lm02-05': ['gdpr'], 'lm02-06': ['gdpr'], 'lm02-08': ['gdpr'],
    'lm05-01': ['euro','consumer'], 'lm05-02': ['consumer'],
    'lm05-04': ['consumer'], 'lm05-06': ['consumer','ai','euro'],
    'lm05-07': ['euro','consumer'], 'lm05-08': ['prices','euro','consumer'],
}


def assemble(source_path, hashes_path):
    source = json.loads(Path(source_path).read_text())
    hashes = {x['lesson_id']: x['fingerprint'] for x in json.loads(Path(hashes_path).read_text())}
    assert len(source) == len(hashes) == len(CARDS) == 41
    assert {m: sum(r['module_id'] == m for r in source) for m in COUNTS} == COUNTS
    result = []
    for row in source:
        lid = row['lesson_id']
        c = CARDS[lid]
        blocks = []
        for old in row['blocks']:
            if old['block_key'] == 'work':
                continue  # retired input stays unchanged in protected history
            b = {'key': old['block_key'], 'type': old['block_type'], 'position': old['position'],
                 'title': old['title'], 'content': copy.deepcopy(old['content']),
                 'required': old['required'], 'points': old['points']}
            key = b['key']
            if key == 'outcome':
                b.update(title='Какво ще можеш след урока', content={
                    'body': c['opening'], 'outcomes': list(c['skills']),
                    'deliverable': c['task'], 'check': ' '.join(c['checks'])})
            elif key == 'uncomfortable_truth':
                b.update(title='Обяснение и основен принцип', content={
                    'body': c['terms'] + '\n\n' + c['explanation'] + '\n\n' + old['content']['body']})
                if lid == 'lm04-07':
                    b['content']['sources'] = [{'label': SOURCES[k][0], 'url': SOURCES[k][1]} for k in ['mcp', 'mcp_security']]
            elif key == 'method':
                b.update(title='Практическа задача и следващи стъпки', content={
                    'body': c['task'] + '\n\nКритерии за самопроверка:\n' + '\n'.join(f'{i}. {x}' for i,x in enumerate(c['checks'],1))
                    + '\n\nАко проверката не мине: ' + c['retry']
                    + '\n\nРазширена работа със собствен или разрешен проект:\n' + old['content']['body']
                    + '\n\nРазговорите и пробите с други хора са отделна проверка, когато имаш участници. '
                    'Не измисляй реакции, продажби или технически успех. Пази собствената работа при себе си; няма поле за свободен отговор или задължителен преподавателски преглед.'})
            elif key == 'case':
                dataset = ('\n\n' + CONTACTS) if row['module_id'] == 's03-m02' or lid in ['lm01-06','lm01-07','lm03-06'] else ''
                b.update(title='Учебен случай и показано решение', content={
                    'body': old['content']['body'] + '\n\n' + HEMUS + dataset
                    + '\n\nПоказано решение на новата задача — образец за сравнение, не твой измерен резултат:\n' + c['sample']})
            elif key == 'self_audit':
                for i,item in enumerate(b['content']['items']):
                    item['text'] = c['checks'][i]
            elif key == 'repair':
                # Read the retained identity from the private source; emit only public labels.
                retained = old['evaluation'].get('correct')
                assert retained in [o['id'] for o in b['content']['options']]
                alternative = iter(c['alternatives'])
                for option in b['content']['options']:
                    option['label'] = c['action'] if option['id'] == retained else next(alternative)
                b['feedback'] = {'explanation': c['action'] + ' ' + c['retry']}
            elif key in CHOICES[lid]:
                drafts = CHOICES[lid][key]
                retained = old['evaluation'].get('correct')
                alternative = iter(drafts[1:])
                for option in b['content']['options']:
                    option['label'] = drafts[0] if option['id'] == retained else next(alternative)
                if lid == 'lm01-05' and key == 'measurement':
                    b['content']['question'] = 'Кой резултат е полезен сигнал за следваща проверка?'
                if lid == 'lm05-07' and key == 'knowledge':
                    b['content']['question'] = 'Кое е вярно към 5 октомври 2026 за платимите цени?'
                b['feedback'] = {'explanation': drafts[0] + ' ' + c['retry']}
            elif key == 'primary_source':
                links = [SOURCES[k] for k in SOURCE_KEYS.get(lid, [])]
                b.update(title='Първични източници и граници', content={
                    'body': 'Проверка на първичните източници: 5 октомври 2026. За реална работа сверявай текущите условия, ролята, региона и конкретния процес. Учебната проверка не е правно одобрение или технически тест на твой сайт.',
                    'sources': [{'label': label, 'url': url} for label,url in links]})
            elif key == 'handoff':
                b.update(title='Какво запазваш и как продължаваш', content={
                    'takeaways': list(c['skills']), 'nextStep': c['task']
                    + '\n\nОтбележи кое е проверено, кое не е и по какъв източник. Автоматичните задачи проверяват решение по казус; собствените файлове и действителните бизнес резултати остават отделна самопроверка.'})
            else:
                continue
            blocks.append(b)
        # Avoid a fixed display position while retaining IDs, semantics, state and server grading.
        for b in blocks:
            if b['type'] not in ['quiz','scenario']:
                continue
            options = b['content']['options']
            shift = int(hashlib.sha256((lid + '/' + b['key']).encode()).hexdigest()[:8],16) % len(options)
            b['content']['options'] = options[shift:] + options[:shift]
        assert len({b['key'] for b in blocks}) == len(blocks)
        result.append({'module':row['module_id'],'lesson':lid,
            'title':TITLES.get(lid,row['version']['title']), 'objective':c['opening'],
            'hook':row['version']['hook'], 'source_version':row['version']['version_number'],
            'source_hash':hashes[lid], 'source_blocks':len(row['blocks']),
            'blocks': sorted(blocks,key=lambda b:b['position'])})
    PUBLIC.parent.mkdir(parents=True,exist_ok=True)
    PUBLIC.write_text(json.dumps(result,ensure_ascii=False,separators=(',',':'))+'\n')
    # Public pre-edit fixture; private mappings and production UUIDs never leave scratch.
    fixture = []
    for row in source:
        v = row['version']
        fixture.append({'module_id':row['module_id'],'lesson_id':row['lesson_id'],
            'version':{k:v[k] for k in ['title','subtitle','duration','objective','hook','estimated_minutes','source_kind','change_note','version_number']},
            'blocks':[{k:b[k] for k in ['block_key','position','block_type','title','content','required','points']} for b in row['blocks']]})
    (ROOT/'tests/fixtures/marketing-basics-1-5-before.json').write_text(json.dumps(fixture,ensure_ascii=False,separators=(',',':'))+'\n')
    metadata = ROOT/'src/mocks/learning-platform.ts'
    text = metadata.read_text()
    for lid,title in TITLES.items():
        pattern = r"(\{ id: '" + re.escape(lid) + r"', title: )[^\n]+?(, hasQuiz: true \})"
        text,n = re.subn(pattern,lambda m:m[1]+json.dumps(title,ensure_ascii=False)+m[2],text)
        assert n == 1, lid
    prompts = {
        's03-m01': 'Подготви карта на проверените факти, клиентската нужда, пет алтернативи и един ограничен бюджетен тест. Можеш да започнеш с предоставените данни за учебния сервиз „Хемус“, без платени акаунти или собствен бизнес.',
        's03-m02': 'По предоставените реплики или разрешени собствени данни направи карта на клиентската задача, повода, възраженията и подходящия обхват. Добави три полезни въпроса и сравнение на проекти по труд и разходи; не събирай ненужни лични данни.',
        's03-m03': 'Подготви едно проверено послание в три дължини, страница „За нас“ и ограничено задание към AI. Сравни ги с показаните решения и отбележи кои факти и проверки с други хора още липсват.',
        's03-m04': 'Подготви маршрут от запитване до човешки отговор и прочети учебните записи за съгласие, повторение и грешка. Опиши минималните права, общия разход и нерешените проверки. Реална настройка и платен абонамент не са условие за учебната работа.',
        's03-m05': 'Събери оферта с обхват, калкулация, три изпълними варианта, условия и ясна цена. Използвай учебните данни или потвърдени собствени разходи; отдели сметката от готовата потребителска оферта и непроверените резултати.',
    }
    for module,prompt in prompts.items():
        pattern = r"(id: '" + re.escape(module) + r"',[\s\S]*?homeworkPrompt: )[^\n]+"
        text,n = re.subn(pattern,lambda m:m[1]+json.dumps(prompt,ensure_ascii=False)+',',text)
        assert n == 1, module
    text = text.replace('Съобщението и AI цитирирането','Съобщението и AI цитирането')
    metadata.write_text(text)
    print(json.dumps({'lessons':len(result),'patched_blocks':sum(len(s['blocks']) for s in result),'title_changes':len(TITLES),'public_characters':PUBLIC.stat().st_size}))


if __name__ == '__main__':
    assemble(*sys.argv[1:])
