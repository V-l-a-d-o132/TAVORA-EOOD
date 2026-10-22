"""Build the reviewed 66-lesson edition from a private current-source export.

Real grading stays in the private output; only stripped teaching is packaged.
"""
import argparse
import base64
import copy
import gzip
import hashlib
import json
from pathlib import Path
import random
import uuid
from video_client_production_content import LESSONS

ROOT = Path(__file__).resolve().parents[2]
RELEASE = 'video_client_production_v1'
MODULES = {'s02-m02': 20, 's02-m03': 21, 's02-m04': 17, 's02-m05': 8}
FINAL = {'pv02-20', 'pv03-21', 'pv04-17', 'pv05-08'}

def repaired(value):
    if isinstance(value, str):
        return value.replace('графика на звуковата вълна', 'видео waveform')
    if isinstance(value, list):
        return [repaired(item) for item in value]
    if isinstance(value, dict):
        return {key: repaired(item) for key, item in value.items()}
    return value

def independent_case(case):
    choices, slots, matches, details = [], [], {}, {}
    for index, (prompt, alternatives, accepted, success, retry) in enumerate(case['parts']):
        ids = []
        for label in alternatives:
            choice_id = 'v_' + uuid.uuid4().hex[:14]
            ids.append(choice_id)
            choices.append({'id': choice_id, 'text': label})
        slot = f'part-{index + 1}'
        matches[slot] = ids[accepted]
        random.SystemRandom().shuffle(ids)
        slots.append({'id': slot, 'text': prompt, 'choices': ids, 'preview': False,
                      'phase': 'change' if index == len(case['parts']) - 1 else 'base'})
        details[slot] = {'success': success, 'retry': retry}
    random.SystemRandom().shuffle(choices)
    block = {'key': 'video_production_transfer_v1', 'type': 'matching',
            'title': 'Самостоятелно решение: ' + case['title'], 'required': True, 'points': 20,
            'content': {'studio': {'productionKind': case['kind'], 'domain': 'video', 'surface': 'poster',
                        'title': case['title'], 'initialContext': case['context'], 'change': case['change'],
                        'task': 'Избери обосновано решение за всяка част. След основните решения приложи новото условие.',
                        'limit': 'Всички бизнеси, числа и наблюдения са учебни. Използвай предоставените варианти; не качваш файл и не пишеш собствен отговор.'},
                        'left': slots, 'right': choices},
            'feedback': {'success': 'Решенията следват от предоставените условия.',
                         'retry': 'Прегледай посочените условия и поправи решението.', 'details': details},
            'scoring': {}}
    block['answer_key'] = dict(matches=matches)
    return block

def build(source, cases):
    assert len(source) == len(LESSONS) == 66
    assert {row['lessonId'] for row in source} == set(LESSONS)
    assert {case['lesson'] for case in cases} == FINAL
    case_by_lesson = {case['lesson']: case for case in cases}
    candidates = copy.deepcopy(source)
    for row in candidates:
        code, payload = row['lessonId'], row['payload']
        authored = LESSONS[code]
        blocks = {b['key']: b for b in payload['blocks']}
        opening = blocks['objective']['content']
        if code == 'pv02-20':
            opening['body'] = (
                'Ще свързваш реплика, кадър, звук и надпис в сценарий, по който може да се подготви снимане. '
                'Ще откриваш разликата между записана идея, наличен материал и липсващо покритие. '
                'Когато сценарият обещава резултат, ще проверяваш кой конкретен кадър го показва и какво още трябва да се осигури.\n\n'
                'Готовият снимачен сценарий позволява операторът и монтажистът да следват една история. '
                'Той съдържа действия, време, нужни файлове и условия за съгласуване, а не само текст за говорителя. '
                'Подготвеният план не доказва, че всички кадри вече са заснети или че клиентът е приел готовия клип.')
        opening['body'] += '\n\n' + authored['bridge']
        opening['deliverable'] += '\n\nПродължаваш учебната поръчка V-1. ' + authored['check']
        worked = blocks['worked_example']
        old_body = worked['content']['body']
        if row['moduleId'] == 's02-m04':
            old_body = repaired(old_body)
            # These corrections fix a translation; stable choice IDs and grading remain untouched.
            for block in payload['blocks']:
                block['content'] = repaired(block['content'])
                if 'feedback' in block:
                    block['feedback'] = repaired(block['feedback'])
        worked['title'] = 'V-1: ' + payload['title']
        worked['content']['body'] = (
            'Авторски учебен проект V-1: „Кафе пауза“, Велико Търново. '
            'Името, поръчката и условията са измислени за обучение.\n\n' + authored['walkthrough']
            + '\n\nПроверка на решението\n' + authored['check']
            + '\n\nДопълнителен показан случай\n' + old_body)
        blocks['summary']['content']['nextStep'] = authored['next']
        if code in case_by_lesson:
            opening = blocks['objective']['content']
            opening['check'] += '\n\nОтделният случай в края сменя бизнеса и включва ново условие. Избираш пет решения по предоставените факти; готовият пример V-1 не се приема за твой отговор.'
            payload['blocks'].insert(-1, independent_case(case_by_lesson[code]))
    return candidates

def public_export(candidates):
    rows = []
    for row in candidates:
        payload = copy.deepcopy(row['payload'])
        for b in payload['blocks']:
            for private_key in ['answer_key', 'feedback', 'scoring']:
                b.pop(private_key, None)
        rows.append({'moduleId': row['moduleId'], 'lessonId': row['lessonId'], **payload})
    return rows

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--source', required=True)
    parser.add_argument('--private-cases', required=True)
    parser.add_argument('--private-output', required=True)
    args = parser.parse_args()
    candidates = build(json.loads(Path(args.source).read_text()), json.loads(Path(args.private_cases).read_text()))
    private = Path(args.private_output)
    if private.resolve().is_relative_to(ROOT):
        raise ValueError('Private grading output must stay outside the repository')
    private.write_text(json.dumps(candidates, ensure_ascii=False))
    private.chmod(0o600)
    data = json.dumps(public_export(candidates), ensure_ascii=False, separators=(',', ':')).encode()
    compressed = gzip.compress(data, mtime=0)
    encoded = base64.b64encode(compressed).decode()
    target = ROOT / 'course-assets/perfect-video/client-production'
    target.mkdir(parents=True, exist_ok=True)
    parts = []
    for start in range(0, len(encoded), 50000):
        name = f'lessons.{len(parts):03}.base64'
        (target / name).write_text(encoded[start:start + 50000] + '\n')
        parts.append(name)
    manifest = {'release': RELEASE, 'modules': MODULES, 'lessons': 66, 'newCases': 4, 'newDecisions': 20,
                'curriculum': {'parts': parts, 'bytes': len(compressed), 'sha256': hashlib.sha256(compressed).hexdigest(),
                'decodedBytes': len(data), 'decodedSha256': hashlib.sha256(data).hexdigest()}}
    (target / 'manifest.json').write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + '\n')
    print(json.dumps({'lessons': len(candidates), 'blocks': sum(len(row['payload']['blocks']) for row in candidates),
                      'parts': len(parts), 'newCases': 4, 'newDecisions': 20}))

if __name__ == '__main__':
    main()
