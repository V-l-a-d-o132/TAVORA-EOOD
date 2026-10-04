"""Prepare narrow audit repairs from a curriculum-only snapshot and guarded hashes.

Usage: python scripts/perfect-video/assemble_perfect_video_audit.py source.json hashes.json
Never export learner data or embed production UUIDs in the release payload.
"""
import copy
import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
OUT = ROOT / 'scripts/perfect-video/releases/audit-repairs-20261004.json'
LABELS = ROOT / 'scripts/perfect-video/editorial/audit-public-choices-20261004.json'
RELEASE = 'perfect_video_audit_repairs_20261004'
FIXES = {
    'Драматичен лична препоръка': 'Драматична лична препоръка',
    'дословен начало': 'дословно начало',
    'Кой покана за действие е конкретен?': 'Коя покана за действие е конкретна?',
    'няма разрешен лична препоръка': 'няма разрешена лична препоръка',
    'чуждо лична препоръка видео': 'чуждо видео с лична препоръка',
    'Нов изрязване на кадъра': 'Ново изрязване на кадъра',
    'със готов чужд материал': 'с готов чужд материал',
    'Друг монтажист прилага го': 'Друг монтажист го прилага',
    'със измервателни': 'с измервателни',
    'Готов чужд материал лицензът е': 'Лицензът на чуждия материал е',
}


def fix(value):
    if isinstance(value, str):
        for old, new in FIXES.items():
            value = value.replace(old, new)
        return value
    if isinstance(value, list):
        return [fix(v) for v in value]
    if isinstance(value, dict):
        return {k: fix(v) for k, v in value.items()}
    return value


def traffic_comparison(row):
    v = row['version']
    v['title'] = 'Сравни източниците на трафик за две видеа'
    v['objective'] = ('Ще сравниш източниците на трафик за две видеа за един и същ период. '
        'Ще различиш броя гледания от дела на всеки източник и ще запишеш предпазлива следваща хипотеза. '
        'Точните категории, ниво на отчета и ограничения остават видими.')
    v['hook'] = 'Search има по-малък дял във второто видео. Намалели ли са гледанията от търсене?'
    task = ('Сравни два условни отчета за видеа с еднакъв формат за едни и същи 7 дни. '
        'Видео А: Search 60, Suggested 30, Browse 10 гледания. '
        'Видео Б: Search 60, Suggested 120, Browse 20 гледания. '
        'Направи таблица с точните категории, общия брой и дела на Search за всяко видео. '
        'Напиши какво е наблюдавано, две възможни обяснения и едно предложение за следващ тест. '
        'Ако използваш свои отчети, запиши видео, период и източник; не смесвай видео и канално ниво.')
    check = ('Общото за А е 100, за Б е 200. Search е 60% при А и 30% при Б, '
        'но броят гледания от Search е 60 и в двете. Категориите и периодът са отделно означени. '
        'Няма извод за спад на търсенето само от по-малкия му дял, за намерението на отделен човек '
        'или за причината за разликата без допълнителни данни.')
    sample = ('Примерна работна бележка — учебни данни, не резултат на твой канал: '
        '„А има 100 гледания, Б — 200. От Search идват 60 и в двете: 60/100 = 60%, '
        '60/200 = 30%. По-малкият дял не е спад на броя гледания от търсене. '
        'Suggested е 30 при А и 120 при Б. Възможно е темата или контекстът на препоръчване да е различен; '
        'самата таблица не доказва защо. За следващ тест ще запазя формата и ще опиша една промяна в темата. '
        'Тук липсват данни за време на гледане и външни събития.“')
    by = {b['block_key']: b for b in row['blocks']}
    by['objective']['content'] = {'body': v['objective'], 'deliverable': task, 'check': check}
    by['hook']['content']['body'] = v['hook']
    by['principle']['content']['body'] += ('\n\nДял = гледания от източника / всички отчетени гледания × 100. '
        'Сравнявай едновременно броя и дела: делът може да намалее, защото друг източник е нараснал. '
        'Две видеа с еднакъв формат и период пак не са контролиран експеримент; тема, заглавие и външни събития може да са различни.')
    by['steps']['content']['body'] = ('1. Отвори отчетите за две конкретни видеа и фиксирай един и същ период.\n'
        '2. Запиши точните източници и общия брой; изчисли дела на Search.\n'
        '3. Сравни броя и дела заедно; провери времето на гледане, ако имаш такива данни.\n'
        '4. Напиши едно решение и едно алтернативно обяснение.\n\n'
        'Липсващите данни се записват като непроверени. Учебната таблица не доказва причина.')
    by['practice']['content']['body'] = task + '\n\nКритерии за проверка: ' + check + '\n\n' + sample + ('\n\nАко сметките не съвпадат, '
        'събери категориите отново и използвай общото на съответното видео. Пази източника и означението „учебни данни“.')
    old_check = by['acceptance']['content']['body'].split('\n\n', 1)[1]
    by['acceptance']['content']['body'] = check + '\n\n' + old_check
    by['handoff']['content']['body'] = by['handoff']['content']['body'].replace(
        'Направи кратък отчет за един клип: период, два основни източника, свързана сцена и предпазлива следваща хипотеза.',
        'Направи сравнение за два клипа: общ период, точни източници, брой и дял, ограничения и следваща хипотеза.')
    by['summary']['content']['nextStep'] = task
    by['summary']['content']['takeaways'][-1] = check
    items = {i['id']: i for i in by['sequence_sort']['content']['items']}
    items['s1']['text'] = 'Отвори отчетите за две конкретни видеа и фиксирай един и същ период.'
    items['s2']['text'] = 'Запиши точните източници и общия брой; изчисли дела на Search.'
    items['s3']['text'] = 'Сравни броя и дела заедно; провери времето на гледане, ако имаш такива данни.'


def assemble(source, hashes):
    labels = json.loads(LABELS.read_text())
    fingerprints = {r['lesson_id']: r['source_hash'] for r in hashes}
    assert len(source) == len(fingerprints) == 39
    payload = []
    for original in source:
        row = fix(copy.deepcopy(original))
        lid, v = row['lesson_id'], row['version']
        if lid in labels:
            checks = [b for b in row['blocks'] if b['block_type'] in ['quiz', 'scenario']]
            assert [b['block_key'] for b in checks] == ['quiz_1', 'scenario_1', 'quiz_2', 'scenario_2']
            for block in checks:
                options = labels[lid][block['block_key']]
                assert [o['id'] for o in options] == [o['id'] for o in block['content']['options']]
                block['content']['options'] = copy.deepcopy(options)
        if lid == 'pv11-13':
            traffic_comparison(row)
        if lid == 'pv13-18':
            v['title'] = 'Подготви ценова рамка и конкретна оферта'
        if lid == 'pv15-05':
            v['title'] = 'Measure: провери видеото и запиши ограниченията'
        if lid == 'pv14-18':
            v['title'] = 'Направи одит на свое видео и провери поправката'
        by = {b['block_key']: b for b in row['blocks']}
        questions = {
            ('pv13-02', 'quiz_1'): 'Коя информация превръща „искам модерно видео“ в изпълнима работна задача?',
            ('pv13-10', 'quiz_2'): 'Кое показва наблюдавано движение на потенциалния клиент към работен разговор?',
            ('pv13-14', 'quiz_2'): 'Какво е нужно, преди учебният договорен списък да стане документ за реално подписване?',
            ('pv14-10', 'quiz_2'): 'Как проверяваш какво предават картината и звукът?',
        }
        for (lesson, key), text in questions.items():
            if lesson == lid:
                by[key]['content']['question'] = text
        explanations = {
            ('pv13-02', 'quiz_2'): 'Ясният бриф позволява да направиш план и да назовеш действително липсващите условия. Можеш да провериш това сам, като отвориш бележките отново; прегледът от колега е допълнителна проверка.',
            ('pv14-10', 'quiz_2'): 'Прегледът без звук показва какво предават кадрите, а слушането без картина — какво предава звукът. После провери съчетанието. Външен зрител дава допълнителна обратна връзка, когато имаш участник.',
            ('pv14-12', 'quiz_2'): 'Приложи правилата към пробен откъс само по написаните указания. Ако липсва настройка или пример, допълни ги. Проверка от друг монтажист е полезна, когато е възможна.',
        }
        for (lesson, key), text in explanations.items():
            if lesson == lid:
                by[key]['feedback']['explanation'] = text
        blocks = []
        for old, new in zip(original['blocks'], row['blocks'], strict=True):
            assert old['block_key'] == new['block_key']
            assert old['evaluation'] == new['evaluation'] and old['scoring'] == new['scoring']
            if old['content'] == new['content'] and old['title'] == new['title'] and old['feedback'] == new['feedback']:
                continue
            patch = {'key': new['block_key'], 'type': new['block_type'], 'position': new['position'],
                'required': new['required'], 'points': new['points'], 'title': new['title'], 'content': new['content']}
            if old['feedback'] != new['feedback']:
                patch['feedback'] = new['feedback']
            if new['block_type'] in ['quiz', 'scenario']:
                assert [o['id'] for o in old['content']['options']] == [o['id'] for o in new['content']['options']]
            blocks.append(patch)
        assert blocks or v['title'] != original['version']['title']
        payload.append({'module': row['module_id'], 'lesson': lid, 'source_version': v['version_number'],
            'source_hash': fingerprints[lid], 'source_blocks': len(original['blocks']),
            'title': v['title'], 'objective': v['objective'], 'hook': v['hook'], 'blocks': blocks})
    OUT.write_text(json.dumps(payload, ensure_ascii=False, separators=(',', ':')) + '\n')
    print(f'Prepared {len(payload)} lessons / {sum(len(s["blocks"]) for s in payload)} changed blocks')


if __name__ == '__main__':
    assemble(json.loads(Path(sys.argv[1]).read_text()), json.loads(Path(sys.argv[2]).read_text()))
