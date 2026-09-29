"""Build the guarded first publication of Perfect Video modules 13–14."""

from __future__ import annotations

import json
import re
from collections import Counter
from pathlib import Path

from perfect_video_1314_content import LESSONS


ROOT = Path(__file__).resolve().parents[2]
MIGRATION = ROOT / "supabase/migrations/20260929212115_perfect_video_modules_13_14_v8_release.sql"
PRIOR_MIGRATION = ROOT / "supabase/migrations/20260929194936_perfect_video_modules_10_12_v7_release.sql"
EXPECTED = {"s02-m13": 18, "s02-m14": 18}
TOPICS = {
    "s02-m13": "Клиентски бриф, изпълним бюджет и професионално предаване",
    "s02-m14": "Работещи шаблони, собствен стил и одит с доказателства",
}
FIELD_RULES = {
    "s02-m13": (
        "Дръж отделно допускане, потвърден факт и обещание към клиента. "
        "Сверявай разходите и часовете с действителния обхват; примерните "
        "суми в урока не са тарифа. За договор, данъци, професионална реклама "
        "или лични данни провери приложимите правила и потърси компетентен "
        "преглед преди реална употреба. Не публикувай човек, музика, "
        "чужд продукт или резултат без проверен обхват на правото."
    ),
    "s02-m14": (
        "Запази изходната версия и описвай промяна с конкретен кадър или "
        "timecode. Шаблонът е структура за собствено доказателство, не "
        "чужд текст за копиране. Провери права за активите, четимост и звук "
        "на целевия екран, както и версията, която действително е качена. "
        "При тест с малко хора записвай ограниченията на наблюдението; "
        "не наричай предположение измерен ефект."
    ),
}
COMPACT = {"pv13-04", "pv13-06"}


def catalog():
    text = (ROOT / "src/mocks/learning-platform.ts").read_text(encoding="utf-8")
    text = text[text.index("id: 's02-m13'"):text.index("id: 's02-m15'")]
    matches = re.findall(
        r"\{ id: '(pv(?:13|14)-\d{2})', title: '([^']+)', "
        r"duration: '(\d+) мин', hasQuiz: true \}", text
    )
    if len(matches) != 36:
        raise ValueError(f"Expected 36 catalog entries, found {len(matches)}")
    return {lesson_id: (title, int(minutes)) for lesson_id, title, minutes in matches}


def arrange(correct, wrong1, wrong2, seed):
    values = [correct, wrong1, wrong2]
    shift = seed % 3
    values = values[shift:] + values[:shift]
    if seed % 2:
        values[1], values[2] = values[2], values[1]
    options = [{"id": chr(97 + i), "label": label}
               for i, label in enumerate(values)]
    answer = next(option["id"] for option in options
                  if option["label"] == correct)
    return options, answer


def build(spec, index, listing):
    lesson_id = spec["id"]
    module_id = "s02-m" + lesson_id[2:4]
    title, minutes = listing[lesson_id]
    blocks = []

    def add(key, kind, heading, content, points=2, required=True,
            answer=None, feedback=None):
        block = dict(position=len(blocks), block_key=key, block_type=kind,
                     title=heading, content=content, points=points,
                     required=required)
        if answer is not None:
            block["answer_key"] = answer
            block["feedback"] = {"explanation": feedback}
            block["scoring"] = {"mode": (
                "exact_order" if kind == "sequence_sort" else "single_choice"
            )}
        blocks.append(block)

    add("objective", "objective", "Резултатът от урока",
        {"body": spec["acceptance"]}, points=1)
    add("hook", "hook", "Ситуацията", {"body": spec["hook"]}, points=1)
    add("principle", "rich_text", "Как вземаш решението",
        {"body": spec["principle"]})
    add("field_rules", "rich_text", "Преди да тръгнеш по инерция",
        {"body": FIELD_RULES[module_id] + "\n\nЗа тази задача: " + spec["fix"]})
    add("steps", "rich_text", "Работен ред", {"body": "\n".join(
        f"{i}. {step}" for i, step in enumerate(spec["steps"], 1)
    ) + "\n\nПровери изхода преди да дадеш статуса „готово“. "
         "Ако входът или правата липсват, отбележи блокиращото условие "
         "и назови кой може да го реши."})
    add("case", "example", "Как изглежда в работа", {"body": spec["case"] +
        "\n\nПриеми примера като схема за решение, не като обещание за "
        "същите показатели във всеки проект. Твоят собствен източник и "
        "условия може да наложат друг ход."})
    add("repair", "before_after", "Грешката и поправката", {
        "before": {"label": "Ходът, който се проваля", "text": spec["failure"]},
        "after": {"label": "Как го поправяш", "text": spec["fix"]},
    })
    if lesson_id not in COMPACT:
        add("diagnosis", "rich_text", "Когато пробата не мине", {
            "body": (
                "Наблюдаван симптом: " + spec["failure"] + "\n\n"
                "Запази предишната версия и провери входните условия по ред, "
                "вместо да сменяш всичко едновременно. Първият контролен ход е: "
                + spec["steps"][0] + " След него: " + spec["steps"][2] +
                "\n\nКорекция: " + spec["fix"] +
                "\n\nНови данни, които ще приемеш за успешна поправка: " +
                spec["acceptance"] + " Ако не можеш да покажеш това, "
                "остави работата в статус проба и запиши неизвестното."
            )
        })
    add("practice", "rich_text", "Направи го със свой материал", {
        "body": spec["practice"] + "\n\nИзползвай собствен или разрешен материал. "
        "Запази първа проба, коригирана версия, кратко обяснение защо "
        "си променил решението и финална проверка. Ако работиш без свой "
        "акаунт или данни, използвай предоставен пример и посочи точно "
        "какво не можеш да измериш. Не качвай клиентска медия или лични "
        "данни в портфолио без разрешение."
    })
    add("acceptance", "rich_text", "Как разбираш, че става", {
        "body": spec["acceptance"] + "\n\nПокажи доказателството на човек, "
        "който не е участвал: той трябва да намери изходния материал, "
        "решението, версията и следващото действие. Когато числото е "
        "хипотеза или е извън достъпа ти, не го представяй като измерен "
        "резултат. Отдели чернова, проверено и клиентски одобрено."
    }, points=1)
    if lesson_id not in COMPACT:
        add("handoff", "rich_text", "Предай така, че колега да продължи", {
            "body": (
                "Мини бриф: " + spec["case"] + "\n\n"
                "Доставка: " + spec["practice"] + "\n\n"
                "Към нея добави: кой е собственик; кои файлове или данни "
                "са източник; коя версия е проверена; коя е хипотеза; "
                "какви права и одобрения са нужни; какво се прави след "
                "публикация. Критерий за приемане: " + spec["acceptance"]
            )
        }, points=1, required=False)
    if spec["extra"]:
        add("field_note", "rich_text", "Граничен случай",
            {"body": spec["extra"]}, points=1, required=False)
    if spec["source"]:
        add("reference", "rich_text", "Проверен първоизточник",
            {"body": spec["source"] + "\nПровери текущата версия на "
             "функцията преди да повториш стъпките."},
            points=0, required=False)

    questions = [
        ("quiz", "Избери работещия ход", spec["decision"]),
        ("scenario", "Решение при ограничение", spec["edge"]),
        ("quiz", "Провери решението", spec["measure"]),
        ("scenario", "Поправи грешния изход", (
            "Виждаш тази грешка: " + spec["failure"] + " Как продължаваш?",
            spec["fix"],
            "Продължаваш без проверка и наричаш тази версия окончателна.",
            "Скриваш проблема в доклада и обещаваш резултат без доказателство.",
        )),
    ]
    for n, (kind, heading, (question, correct, wrong1, wrong2)) in enumerate(
        questions, 1
    ):
        options, answer = arrange(correct, wrong1, wrong2, index * 11 + n)
        add(f"{kind}_{1 if n <= 2 else 2}", kind, heading, {
            "prompt" if kind == "scenario" else "question": question,
            "options": options,
        }, points=3, answer={"correct": answer}, feedback=(
            "Причината за избора: " + correct + "\n\nПървият слаб ход — " +
            wrong1 + " — пропуска тази проверка: " + spec["acceptance"] +
            " Вторият — " + wrong2 + " — оставя този риск: " +
            spec["failure"] + " В работна ситуация поправката е: " +
            spec["fix"] + " Не обявявай успех преди да имаш изходния "
            "файл, измерване или позволено потвърждение."
        ))

    first = spec["steps"]
    items = [{"id": f"s{i}", "text": step} for i, step in enumerate(first, 1)]
    shift = (index + 1) % 4
    shuffled = items[shift:] + items[:shift]
    if index % 2:
        shuffled = list(reversed(shuffled))
    add("sequence_sort", "sequence_sort", "Подреди зависимостите", {
        "instruction": "Подреди работните решения така, че проверката да "
                       "предхожда окончателното предаване.",
        "items": shuffled,
    }, points=3, answer={"order": [f"s{i}" for i in range(1, 5)]},
        feedback="Редът следва зависимостите:\n" + "\n".join(
            f"{i}. {step}" for i, step in enumerate(first, 1)) +
        "\n\nПреди окончателното предаване потвърди: " + spec["acceptance"] +
        " Ако разместиш проверката след предаването, остава този риск: " +
        spec["failure"])
    add("summary", "summary", "Какво вземаш в следващата задача", {
        "takeaways": [spec["principle"], spec["fix"], spec["acceptance"]],
        "nextStep": spec["practice"],
    }, points=1)
    return dict(module_id=module_id, lesson_id=lesson_id, title=title,
                subtitle=TOPICS[module_id], objective=spec["acceptance"],
                hook=spec["hook"], estimated_minutes=minutes, blocks=blocks)


def migration_sql(curriculum):
    old = PRIOR_MIGRATION.read_text(encoding="utf-8")
    validator = old.split("DO $release$", 1)[0]
    pattern = "'s02-m10','s02-m11','s02-m12'\n          )"
    if validator.count(pattern) != 1:
        raise ValueError("Prior validation function changed; review manually")
    validator = validator.replace(pattern, (
        "'s02-m10','s02-m11','s02-m12',\n"
        "            's02-m13','s02-m14'\n          )"
    ))
    validator = validator[validator.index("CREATE OR REPLACE FUNCTION"):]
    payload = json.dumps(curriculum, ensure_ascii=False, separators=(",", ":"))
    expected = ",".join("'" + x["lesson_id"] + "'" for x in curriculum)
    return f"""-- First guarded publication of the 36 Perfect Video lessons in modules 13–14.
-- Existing modules, access grants, progress and attempts stay unchanged.
SET lock_timeout = '5s';

{validator}
DO $release$
DECLARE
  payload jsonb := $curriculum${payload}$curriculum$::jsonb;
  lesson record;
  block jsonb;
  lesson_uuid uuid;
  version_uuid uuid;
  block_uuid uuid;
  report jsonb;
  new_lessons integer;
  published_count integer;
  new_keys integer;
  release_note text := 'Перфектното видео, модули 13–14: първо практическо издание v8';
BEGIN
  IF jsonb_typeof(payload)<>'array' OR jsonb_array_length(payload)<>36 THEN
    RAISE EXCEPTION 'Expected 36 lesson records';
  END IF;
  IF (SELECT count(DISTINCT p.lesson_id) FROM jsonb_to_recordset(payload)
      AS p(lesson_id text))<>36 OR
     (SELECT array_agg(p.lesson_id ORDER BY p.lesson_id)
      FROM jsonb_to_recordset(payload) AS p(lesson_id text))
       <>ARRAY[{expected}]::text[] THEN
    RAISE EXCEPTION 'Unexpected or duplicate lesson IDs';
  END IF;
  IF (SELECT ARRAY[
        count(*) FILTER (WHERE p.module_id='s02-m13')::integer,
        count(*) FILTER (WHERE p.module_id='s02-m14')::integer
      ] FROM jsonb_to_recordset(payload) AS p(module_id text))
      <>ARRAY[18,18] THEN
    RAISE EXCEPTION 'Unexpected module distribution';
  END IF;
  IF EXISTS (SELECT 1 FROM public.academy_lessons
             WHERE module_id IN ('s02-m13','s02-m14')) THEN
    RAISE EXCEPTION 'Modules 13–14 already contain lessons; review rather than overwrite';
  END IF;
  IF EXISTS (SELECT 1 FROM public.interactive_lessons
             WHERE module_id IN ('s02-m13','s02-m14')) THEN
    RAISE EXCEPTION 'Legacy lessons exist for this catalog; review before release';
  END IF;
  IF EXISTS (
    SELECT 1 FROM jsonb_to_recordset(payload)
      AS p(module_id text, lesson_id text, title text, objective text,
           hook text, estimated_minutes integer, blocks jsonb)
    WHERE p.module_id<>('s02-m'||substring(p.lesson_id from 3 for 2))
       OR btrim(coalesce(p.title,''))=''
       OR btrim(coalesce(p.objective,''))=''
       OR btrim(coalesce(p.hook,''))=''
       OR p.estimated_minutes NOT BETWEEN 25 AND 50
       OR jsonb_typeof(p.blocks)<>'array'
       OR jsonb_array_length(p.blocks) NOT BETWEEN 13 AND 20
       OR (SELECT count(*) FROM jsonb_array_elements(p.blocks) b
           WHERE b ? 'answer_key')<>5
       OR (SELECT count(*) FROM jsonb_array_elements(p.blocks) b
           WHERE b->>'block_type'='quiz')<>2
       OR (SELECT count(*) FROM jsonb_array_elements(p.blocks) b
           WHERE b->>'block_type'='scenario')<>2
       OR (SELECT count(*) FROM jsonb_array_elements(p.blocks) b
           WHERE b->>'block_type'='sequence_sort')<>1
       OR EXISTS (SELECT 1 FROM jsonb_array_elements(p.blocks) b
           WHERE b->>'block_type' IN (
             'practical_response','reflection','homework','submission','prompt_builder'
           ))
  ) THEN
    RAISE EXCEPTION 'Content, lesson structure or assessment guard failed';
  END IF;

  FOR lesson IN SELECT * FROM jsonb_to_recordset(payload) AS p(
      module_id text,lesson_id text,title text,subtitle text,objective text,
      hook text,estimated_minutes integer,blocks jsonb)
      ORDER BY module_id,lesson_id
  LOOP
    INSERT INTO public.academy_lessons(module_id,lesson_id,status)
    VALUES (lesson.module_id,lesson.lesson_id,'draft')
    RETURNING id INTO lesson_uuid;

    INSERT INTO public.academy_lesson_versions(
      academy_lesson_id,version_number,title,subtitle,duration,objective,
      hook,estimated_minutes,source_kind,change_note)
    VALUES (lesson_uuid,1,lesson.title,lesson.subtitle,
            lesson.estimated_minutes::text||' минути',lesson.objective,
            lesson.hook,lesson.estimated_minutes,'editor',release_note)
    RETURNING id INTO version_uuid;

    FOR block IN SELECT value FROM jsonb_array_elements(lesson.blocks)
    LOOP
      INSERT INTO public.academy_lesson_blocks(
        version_id,block_key,"position",block_type,title,content,required,points)
      VALUES (version_uuid,block->>'block_key',(block->>'position')::integer,
              block->>'block_type',block->>'title',block->'content',
              (block->>'required')::boolean,(block->>'points')::integer)
      RETURNING id INTO block_uuid;

      IF block ? 'answer_key' THEN
        INSERT INTO academy_private.lesson_block_keys(
          block_id,answer_key,feedback,scoring)
        VALUES (block_uuid,block->'answer_key',block->'feedback',block->'scoring');
        IF block->>'block_type' IN ('quiz','scenario') AND NOT EXISTS (
          SELECT 1 FROM jsonb_array_elements(block->'content'->'options') o
          WHERE o->>'id'=block->'answer_key'->>'correct'
        ) THEN
          RAISE EXCEPTION 'Invalid answer key: % / %',
            lesson.lesson_id,block->>'block_key';
        END IF;
        IF block->>'block_type'='sequence_sort' AND
            jsonb_array_length(block->'answer_key'->'order')<>
            jsonb_array_length(block->'content'->'items') THEN
          RAISE EXCEPTION 'Invalid sequence key in %',lesson.lesson_id;
        END IF;
      END IF;
    END LOOP;

    report:=academy_private.lesson_validation(version_uuid);
    IF jsonb_array_length(report->'errors')<>0 OR
       jsonb_array_length(report->'warnings')<>0 THEN
      RAISE EXCEPTION 'Lesson % failed validation: %',lesson.lesson_id,report;
    END IF;
    UPDATE public.academy_lesson_versions SET validation=report
      WHERE id=version_uuid;
    UPDATE public.academy_lessons SET status='published',
      published_version_id=version_uuid,draft_version_id=version_uuid,
      updated_at=clock_timestamp()
      WHERE id=lesson_uuid;
    INSERT INTO public.academy_lesson_audit(
      academy_lesson_id,version_id,actor_id,action,details)
    VALUES (lesson_uuid,version_uuid,NULL,'published',
      jsonb_build_object('source','perfect_video_v8',
                         'previous_version_id',NULL,
                         'preserved_existing_progress',true));
  END LOOP;

  SELECT count(*),count(*) FILTER (WHERE l.status='published'
      AND l.published_version_id IS NOT NULL AND
      l.draft_version_id=l.published_version_id)
    INTO new_lessons,published_count
  FROM public.academy_lessons l
  WHERE l.module_id IN ('s02-m13','s02-m14');
  IF new_lessons<>36 OR published_count<>36 THEN
    RAISE EXCEPTION 'Publication incomplete: % / %',new_lessons,published_count;
  END IF;
  SELECT count(*) INTO new_keys
  FROM academy_private.lesson_block_keys k
  JOIN public.academy_lesson_blocks b ON b.id=k.block_id
  JOIN public.academy_lesson_versions v ON v.id=b.version_id
  JOIN public.academy_lessons l ON l.id=v.academy_lesson_id
  WHERE l.module_id IN ('s02-m13','s02-m14')
    AND l.published_version_id=v.id;
  IF new_keys<>180 THEN
    RAISE EXCEPTION 'Expected 180 private answer keys; found %',new_keys;
  END IF;
END
$release$;
"""


def main():
    listing = catalog()
    ids = [spec["id"] for spec in LESSONS]
    if len(ids) != 36 or len(set(ids)) != 36 or set(ids) != set(listing):
        raise ValueError("Editorial content and catalog must have the same 36 IDs")
    modules = Counter("s02-m" + lesson_id[2:4] for lesson_id in ids)
    if dict(modules) != EXPECTED:
        raise ValueError(f"Unexpected module counts: {modules}")
    lessons = [build(spec, i, listing) for i, spec in enumerate(LESSONS)]
    counts = Counter(len(item["blocks"]) for item in lessons)
    lengths = []
    positions = Counter()
    for lesson in lessons:
        blocks = lesson["blocks"]
        assert 13 <= len(blocks) <= 20, lesson["lesson_id"]
        assert len({b["block_key"] for b in blocks}) == len(blocks)
        assert [b["position"] for b in blocks] == list(range(len(blocks)))
        assert Counter(b["block_type"] for b in blocks)["quiz"] == 2
        assert Counter(b["block_type"] for b in blocks)["scenario"] == 2
        assert Counter(b["block_type"] for b in blocks)["sequence_sort"] == 1
        assert len([b for b in blocks if "answer_key" in b]) == 5
        for b in blocks:
            if b["block_type"] in {"quiz", "scenario"}:
                positions[b["answer_key"]["correct"]] += 1
                assert b["answer_key"]["correct"] in {
                    option["id"] for option in b["content"]["options"]
                }
                assert len({o["label"] for o in b["content"]["options"]}) == 3
        lengths.append(sum(len(json.dumps(b["content"], ensure_ascii=False))
                           for b in blocks))
    MIGRATION.write_text(migration_sql(lessons), encoding="utf-8")
    print(json.dumps({"lessons": len(lessons), "modules": dict(modules),
                      "blocks": sum(len(x["blocks"]) for x in lessons),
                      "block_distribution": dict(counts),
                      "visible_chars_min": min(lengths),
                      "visible_chars_median": sorted(lengths)[18],
                      "private_keys": 180, "correct_positions": dict(positions),
                      "migration_bytes": MIGRATION.stat().st_size},
                     ensure_ascii=False))


if __name__ == "__main__":
    main()
