"""Assemble modules 12–15 over the actual curriculum-only source snapshot.

Usage: python scripts/perfect-video/assemble_perfect_video_1215_editorial.py
       source.json fingerprints.json
Keep valuable theory, cases, identities and all five exam question sets intact.
"""

import copy
import json
import re
import sys
from pathlib import Path

import assemble_perfect_video_711_editorial as language

ROOT = Path(__file__).resolve().parents[2]
PAYLOAD = ROOT / "scripts/perfect-video/releases/modules-12-15-clear-practice-20261004.json"
COUNTS = {"s02-m12": 8, "s02-m13": 18, "s02-m14": 18, "s02-m15": 13}
language.PLAIN.update({
    "workflow": "работен процес", "hook": "начало", "storytelling": "разказване",
    "testimonial": "лична препоръка", "checklist": "списък за проверка",
    "change log": "дневник на промени", "follow-up": "последващ контакт",
    "style guide": "ръководство за стил", "стил гид": "ръководство за стил",
    "темплейт": "шаблон", "stock": "готов чужд материал",
})
language.WORDS = re.compile(r"(?<![\w])(" + "|".join(
    re.escape(w) for w in sorted(language.PLAIN, key=len, reverse=True)) + r")(?![\w])", re.I)
plain_text, prose = language.plain_text, language.prose
IMPERATIVE = {
    "Проверяваш": "Провери", "Приемаш": "Приеми", "Избираш": "Избери",
    "Запазваш": "Запази", "Поправяш": "Поправи", "Оставяш": "Остави",
    "Добавяш": "Добави", "Сравняваш": "Сравни", "Съкращаваш": "Съкрати",
    "Предаваш": "Предай", "Пазиш": "Пази", "Ограничаваш": "Ограничи",
    "Сменяш": "Смени", "Изпращаш": "Изпрати", "Пишеш": "Напиши",
    "Скриваш": "Скрий", "Заменяш": "Замени", "Преименуваш": "Преименувай",
    "Използваш": "Използвай", "Умножаваш": "Умножи", "Описваш": "Опиши",
    "Броиш": "Преброй", "Уточняваш": "Уточни", "Попълваш": "Попълни",
    "Персонализираш": "Персонализирай", "Отбелязваш": "Отбележи",
    "Означаваш": "Означи", "Слагаш": "Сложи", "Наричаш": "Наречи",
}


def imperative(label):
    first, *rest = label.split(" ", 1)
    return IMPERATIVE.get(first, first) + (" " + rest[0] if rest else "")


def reference_notes(lesson, keyed):
    notes = {
        "pv12-04": "YouTube изисква обозначаване на реалистично генерирано или съществено променено съдържание. Помощта му различава имитация на чужд глас от собствен глас и малки редакции. Провери конкретната употреба; обозначението не дава право върху гласа. https://support.google.com/youtube/answer/14328491",
        "pv12-06": "При реалистичен синтетичен говорител провери правилата на избрания канал за AI обозначение. Официалната помощ на YouTube дава примери за съществена промяна и генерирано съдържание: https://support.google.com/youtube/answer/14328491\nЗа TikTok сверявай помощния център и текущия интерфейс на своя профил: https://support.tiktok.com/en/using-tiktok/creating-videos/ai-generated-content",
        "pv13-09": "Пример за конкретен лиценз: CC BY 4.0 допуска търговска употреба при условията си, включително означаване на автора, линк към лиценза и посочване на промените. Други права, например върху личност и лични данни, могат да останат отделни. Това не важи автоматично за всеки безплатен материал. https://creativecommons.org/licenses/by/4.0/",
        "pv14-05": "YouTube предлага A/B тестове на заглавия и миниатюри за допустими видеа. Достъпът и ограниченията се проверяват в профила; това не е функция за всеки Shorts или частен файл. Официалното обяснение оценява вариантите по време за гледане: https://support.google.com/youtube/answer/16391400",
    }
    if lesson in notes:
        block = keyed.get("reference", keyed.get("field_rules"))
        block["content"]["body"] = notes[lesson] + "\n\nИзточници за проверка към 4 октомври 2026. За конкретна публикация свери текущите условия в своя канал."
    if lesson == "pv14-07":
        keyed["field_rules"]["content"]["body"] += (
            "\n\nЗа малкия информационен текст използвай контраст поне 4,5:1 като работен критерий "
            "и провери реалния кадър на телефон. W3C описва този праг за обикновен текст и изображения "
            "на текст; за едър текст има отделен праг 3:1. Това е проверка на четимостта, а не на "
            "психологическа реакция към палитрата. "
            "https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html "
            "(проверка: 4 октомври 2026).")


def assemble(source_path, fingerprint_path):
    source = json.loads(Path(source_path).read_text())
    fingerprints = {r["lesson_id"]: r["fingerprint"] for r in json.loads(Path(fingerprint_path).read_text())}
    cards = {}
    for module in range(12, 16):
        for card in json.loads((ROOT / f"scripts/perfect-video/editorial/module{module:02d}-20261004.json").read_text()):
            assert card["id"] not in cards
            cards[card["id"]] = card
    assert len(cards) == len(source) == len(fingerprints) == 57
    assert {m: sum(s["module_id"] == m for s in source) for m in COUNTS} == COUNTS
    result = []
    for row in sorted(source, key=lambda r: r["lesson_id"]):
        card, version = cards[row["lesson_id"]], row["version"]
        assert all(isinstance(card[k], str) and card[k].strip()
                   for k in ["intro", "terms", "task", "check", "sample", "retry"])
        blocks = []
        for old in row["blocks"]:
            # Exam questions, options, IDs and feedback stay byte-semantically intact.
            preserved_content = old["block_type"] in ("course_exam", "submission")
            b = {"key": old["block_key"], "type": old["block_type"], "position": old["position"],
                 "title": plain_text(old["title"]), "required": old["required"], "points": old["points"],
                 "content": copy.deepcopy(old["content"]) if preserved_content else prose(copy.deepcopy(old["content"]))}
            if old["evaluation"]:
                b.update(evaluation=copy.deepcopy(old["evaluation"]), scoring=copy.deepcopy(old["scoring"]),
                         feedback=copy.deepcopy(old["feedback"]))
            blocks.append(b)
        keyed = {b["key"]: b for b in blocks}
        keyed["objective"].update(title="Какво ще можеш след урока", content={
            "body": card["intro"], "deliverable": card["task"], "check": card["check"]})
        original_principle = keyed.get("principle")
        if original_principle:
            original_principle["content"]["body"] = card["terms"] + "\n\n" + original_principle["content"]["body"]
        practice = keyed.get("practice", keyed.get("prepare"))
        original_preparation = practice["content"].get("body", "") if practice["key"] == "prepare" else ""
        practice.update(title="Подготовка за изпита" if original_preparation else "Практическа задача",
                        content={"body": card["task"] + "\n\nКритерии за проверка: " + card["check"]
                        + "\n\nПримерна работна бележка — образец, не твой измерен резултат: " + card["sample"]
                        + "\n\nАко проверката не мине: " + card["retry"]
                        + ("\n\n" + original_preparation if original_preparation else "")})
        if "acceptance" in keyed:
            keyed["acceptance"].update(title="Самопроверка на резултата", content={"body": card["check"]
                + "\n\nОтвори действителния файл или документ. За всяко условие запиши „изпълнено“, "
                "„неизпълнено“ или „непроверено“ и мястото на доказателството. Непровереното остава "
                "следваща задача, а не готов резултат."
                + "\n\nМожеш да направиш учебната проверка сам. При реален клиент отделно записваш "
                "полученото одобрение за конкретната версия."})
        if "case" in keyed:
            keyed["case"]["title"] = "Учебен случай и решение"
        if "handoff" in keyed:
            keyed["handoff"]["title"] = "Подготви за предаване"
            keyed["handoff"]["content"]["body"] += (
                "\n\nЗа самостоятелна проверка затвори проекта или документа и го отвори по записаните "
                "указания. Намери източника, версията и следващото действие. Проверка от колега е "
                "допълнителна; реално одобрение се записва само когато е получено.")
        if "rules" in keyed:
            keyed["rules"]["content"]["body"] = card["terms"] + "\n\n" + keyed["rules"]["content"]["body"]
        keyed["summary"].update(title="Какво остава за следващата задача", content={
            "takeaways": [prose(x) for x in keyed["summary"]["content"].get("takeaways", [])[:2]] + [card["check"]],
            "nextStep": card["task"]})
        decision = keyed.get("scenario_2", keyed.get("repair_choice"))
        if decision:
            assert len(card["wrong"]) == 2
            correct = decision["evaluation"]["correct"]
            wrong = [o for o in decision["content"]["options"] if o["id"] != correct]
            assert len(wrong) == 2
            for option, label in zip(wrong, card["wrong"]):
                option["label"] = imperative(label)
        else:
            assert len(card["wrong"]) == 0 and "exam" in keyed
        for b in blocks:
            if "evaluation" not in b or b["type"] == "course_exam":
                continue
            explanation = prose(b["feedback"].get("explanation", "")).split("\n\n")[0]
            if b["type"] in ("quiz", "scenario"):
                label = next(o["label"] for o in b["content"]["options"] if o["id"] == b["evaluation"]["correct"])
                if label not in explanation:
                    explanation += "\n\nРаботният избор: " + label
                if b["key"] in ("scenario_2", "repair_choice"):
                    explanation += "\n\nЗащо частичната поправка не стига: " + card["retry"]
            b["feedback"]["explanation"] = explanation
        reference_notes(row["lesson_id"], keyed)
        result.append({"module": row["module_id"], "lesson": row["lesson_id"],
                       "source_version": version["version_number"], "source_hash": fingerprints[row["lesson_id"]],
                       "objective": card["intro"], "hook": keyed["hook"]["content"]["body"], "blocks": blocks})
    assert sum(len(s["blocks"]) for s in result) == 930
    assert sum("evaluation" in b for s in result for b in s["blocks"]) == 265
    PAYLOAD.write_text(json.dumps(result, ensure_ascii=False, indent=2) + "\n")
    print("Assembled 57 lessons / 930 blocks / 260 checks + 5 unchanged exams")


if __name__ == "__main__":
    if len(sys.argv) != 3:
        raise SystemExit("Pass curriculum-only source.json and fingerprints.json")
    assemble(*sys.argv[1:])
