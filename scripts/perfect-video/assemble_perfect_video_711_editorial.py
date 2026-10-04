"""Assemble the 75 reviewed lesson cards over a read-only curriculum snapshot.

Usage: python scripts/perfect-video/assemble_perfect_video_711_editorial.py
       source.json fingerprints.json
The input contains curriculum only. Student records must never be exported here.
"""

import copy
import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
PAYLOAD = ROOT / "scripts/perfect-video/releases/modules-7-11-clear-practice-20261004.json"
COUNTS = {"s02-m07": 16, "s02-m08": 16, "s02-m09": 11, "s02-m10": 16, "s02-m11": 16}

# Only prose is translated. URLs, filenames, IDs and private answer mappings stay intact.
PLAIN = {
    "plugin/font dependencies": "нужни добавки и шрифтове", "camera original": "оригинален запис от камерата",
    "project file": "проектен файл", "sample clip": "примерен клип", "sample проект": "пробен проект",
    "adjustment layer": "слой за обща корекция", "motion blur": "размазване при движение",
    "slow motion": "забавено движение", "aspect ratio": "съотношение на страните",
    "frame rate": "кадрова честота", "safe zones": "безопасни зони за важния текст",
    "safe zone": "безопасна зона за важния текст", "jump cut": "срез с видим скок",
    "render/cache": "временни файлове от обработката", "crop-а": "изрязването", "crop-ът": "изрязването",
    "export settings": "настройки за финалния файл", "source frame": "кадър от оригинала",
    "handoff пакет": "пакет за предаване", "master-ът": "основният файл",
    "master-а": "основния файл", "master-и": "основни файлове",
    "export-ът": "финалният файл", "export-а": "финалния файл", "export-и": "финални файлове",
    "rough cut": "първа монтажна версия", "picture lock": "окончателно подредена картина",
    "room tone": "звук на помещението", "shot list": "списък с кадри",
    "handoff": "предаване", "ingest": "приемане и проверка на материалите",
    "timecode": "времеви код", "timeline": "монтажна линия", "screenshot": "снимка на екрана",
    "exports": "финални файлове", "export": "финален файл", "master": "основен файл",
    "source": "източник", "owner": "отговорник", "proxies": "проксита", "proxy": "прокси",
    "checksum": "контролна сума", "restore": "възстановяване", "playback": "възпроизвеждане",
    "sync": "синхрон", "CTA": "покана за действие",
    "dependencies": "нужни външни файлове и функции", "plugin": "добавка за програмата", "font": "шрифт",
    "checksums": "контролни суми", "manifest": "опис на файловете", "readme": "кратко описание на пакета",
    "media": "медийни файлове", "preview": "преглед", "preset": "набор от запазени настройки",
    "crop": "изрязване на кадъра", "blur": "размазване", "layer": "слой",
    "continuity": "непрекъснатост на действието", "cutaway": "допълващ кадър", "bins": "папки в монтажния проект",
    "footage": "заснет материал", "duration": "дължина", "input": "входен материал", "output": "краен резултат",
    "brief": "кратко задание",
}
PROTECTED = re.compile(r"(https?://\S+|`[^`]+`|\b[\w-]+\.(?:mp4|mov|mkv|txt|json|csv|srt|pdf|drp|prproj|xml)\b)", re.I)
WORDS = re.compile(r"(?<![\w])(" + "|".join(re.escape(w) for w in sorted(PLAIN, key=len, reverse=True)) + r")(?![\w])", re.I)
GLOSSARY = {
    "QA": "QA е проверка дали резултатът покрива уговорените критерии.",
    "SOP": "SOP е кратък записан ред за повтаряща се задача.",
    "manifest": "Описът, или manifest, изброява файловете и нужните сведения за тях.",
    "relink": "Relink означава да посочиш на проекта къде се намира нужният файл.",
    "NAS": "NAS е място за съхранение, достъпно през мрежа; само по себе си не е независимо резервно копие.",
    "RAID": "RAID свързва дискове за определена цел; не заменя независимо резервно копие.",
    "bitrate": "Битрейт е количеството данни за секунда; по-голяма стойност не поправя лош звук или липсващ детайл.",
    "HDR": "HDR описва по-широк диапазон на яркост; записът, монтажът и екранът трябва да работят съгласувано.",
    "SDR": "SDR е стандартен диапазон на яркостта с по-прост път за съвместимо предаване.",
    "LUT": "LUT е таблица за преобразуване на цвета; трябва да съответства на материала и не поправя всичко автоматично.",
    "scopes": "Scopes са графики за техническа проверка на яркост и цвят.",
    "waveform": "Waveform е графика на нивата; значението зависи дали гледаш звук или цветен сигнал.",
    "handles": "Handles са оставени кадри преди и след монтажната точка за възможна поправка.",
    "feather": "Feather омекотява границата на маска, когато редакторът поддържа тази функция.",
    "b-roll": "B-roll са допълващи кадри, които показват детайл или контекст към основното обяснение.",
    "drop-off": "Drop-off означава спад в гледането според конкретния отчет, без автоматично доказана причина.",
}


def plain_text(value):
    if not isinstance(value, str):
        return value

    def replacement(match):
        old = match[0]
        new = PLAIN[next(w for w in PLAIN if w.lower() == old.lower())]
        return new[0].upper() + new[1:] if old[0].isupper() and old != old.upper() else new

    return "".join(part if i % 2 else WORDS.sub(replacement, part)
                   for i, part in enumerate(PROTECTED.split(value)))


def prose(value):
    if isinstance(value, str):
        return plain_text(value)
    if isinstance(value, list):
        return [prose(item) for item in value]
    if isinstance(value, dict):
        return {key: item if key == "id" else prose(item) for key, item in value.items()}
    return value


def update_reference(lesson, blocks):
    block = next((b for b in blocks if b["key"] == "reference"), None)
    if block is None:
        return
    notes = {
        "pv07-01": "Apple описва кои модели и режими поддържат ProRes. Не е условие за упражнението: https://support.apple.com/en-gb/109041",
        "pv07-02": "Blackmagic Camera е безплатно приложение за поддържани устройства с iOS и Android; това не означава всички телефони или безплатна облачна услуга: https://www.blackmagicdesign.com/products/blackmagiccamera",
        "pv08-10": "CISA описва принципа 3-2-1 и проверката на възстановяването: https://www.cisa.gov/sites/default/files/publications/data_backup_options.pdf",
        "pv09-01": "Безплатният Clipchamp за личен профил позволява експорт до 1080p със собствено или безплатно съдържание. Платен елемент може да блокира експорта: https://support.microsoft.com/en-us/clipchamp/what-clipchamp-products-are-there-and-what-s-their-cost\nDaVinci Resolve има безплатна версия, но част от AI и разширените функции са само в Studio: https://www.blackmagicdesign.com/products/davinciresolve",
        "pv10-05": "YouTube допуска до три заглавия или миниатюри в наличния A/B тест. Нужни са компютър и достъп до разширените функции; Shorts, частни видеа и други неподходящи типове са изключени. Изборът отчита време за гледане, а не само CTR: https://support.google.com/youtube/answer/16391400",
        "pv10-07": "TikTok описва Creator Search Insights; провери наличността за профила и региона, вместо да обещаваш еднакъв достъп: https://support.tiktok.com/en/using-tiktok/growing-your-audience/creator-search-insights",
        "pv10-08": "В съобщението си от 12 май 2026 Meta описва Your Algorithm за лични Reels и Explore препоръки в англоговорящи държави. Това не е отчет за аудиторията ти и не доказва наличност за всеки български профил: https://about.fb.com/news/2026/05/new-supervision-tools-parents-insights-teens-algorithm/",
        "pv10-10": "Google описва ресурси за социални профили в Search Console: Instagram, TikTok, X и YouTube. Достъпът се въвежда постепенно и изисква потвърдена собственост. Отчетът е за Google търсене, а не за гледания вътре в социалната платформа: https://support.google.com/webmasters/answer/17148418?hl=en-GB",
        "pv11-05": "YouTube обяснява, че задържането е на ниво видео и данните обикновено се обработват 1–2 дни. Пикът може да е повторно гледане, но и неясен момент; графиката сама не доказва причина: https://support.google.com/youtube/answer/9314415",
        "pv11-06": "YouTube изисква първа времева марка 00:00, поне три марки във възходящ ред и глави поне по 10 секунди. Достъпът и допустимостта се проверяват; автоматични глави не са гарантирани: https://support.google.com/youtube/answer/9884579",
        "pv11-09": "YouTube определя средната продължителност според отчета; при Shorts тя използва engaged views. Не я преименувай на процент хора, завършили до край: https://support.google.com/youtube/answer/9314415",
        "pv11-12": "YouTube отчита само определени показвания на миниатюри. CTR тук описва гледанията след тези показвания; не всички гледания са в тази верига: https://support.google.com/youtube/answer/9314486",
    }
    if lesson in notes:
        block["content"]["body"] = notes[lesson] + "\n\nПроверка на документацията: 4 октомври 2026. Провери текущите условия и наличността в своя профил преди реална работа."


def assemble(source_path, fingerprint_path):
    source = json.loads(Path(source_path).read_text())
    fingerprints = {r["lesson_id"]: r["fingerprint"] for r in json.loads(Path(fingerprint_path).read_text())}
    cards = {}
    for module in range(7, 12):
        for card in json.loads((ROOT / f"scripts/perfect-video/editorial/module{module:02d}-20261004.json").read_text()):
            assert card["id"] not in cards
            cards[card["id"]] = card
    assert len(cards) == len(source) == len(fingerprints) == 75
    assert {m: sum(s["module_id"] == m for s in source) for m in COUNTS} == COUNTS
    result = []
    for row in sorted(source, key=lambda r: r["lesson_id"]):
        card = cards[row["lesson_id"]]
        version = row["version"]
        assert all(isinstance(card[k], str) and card[k].strip() for k in ["intro", "terms", "task", "check", "sample", "retry"])
        assert len(card["wrong"]) == 2
        blocks = []
        for old in row["blocks"]:
            b = {"key": old["block_key"], "type": old["block_type"], "position": old["position"],
                 "title": plain_text(old["title"]), "required": old["required"], "points": old["points"],
                 "content": prose(copy.deepcopy(old["content"]))}
            if old["evaluation"]:
                b.update(evaluation=copy.deepcopy(old["evaluation"]), scoring=copy.deepcopy(old["scoring"]),
                         feedback=copy.deepcopy(old["feedback"]))
            blocks.append(b)
        keyed = {b["key"]: b for b in blocks}
        keyed["objective"].update(title="Какво ще можеш след урока", content={
            "body": card["intro"], "deliverable": card["task"], "check": card["check"]})
        theory = keyed["principle"]["content"]["body"]
        text = json.dumps([b["content"] for b in blocks], ensure_ascii=False)
        additions = [definition for word, definition in GLOSSARY.items()
                     if re.search(r"(?<![\w])" + re.escape(word) + r"(?![\w])", text, re.I)
                     and word.lower() not in card["terms"].lower()]
        keyed["principle"]["content"]["body"] = card["terms"] + ("\n\n" + " ".join(additions) if additions else "") + "\n\n" + theory
        practical = keyed.get("field_task", keyed.get("practice"))
        practical.update(title="Практическа задача", content={"body": card["task"]
            + "\n\nКритерии за проверка: " + card["check"]
            + "\n\nПримерна работна бележка — образец, не твой измерен резултат: " + card["sample"]
            + "\n\nАко проверката не мине: " + card["retry"]})
        keyed["acceptance"].update(title="Самопроверка на резултата", content={"body": card["check"]
            + "\n\nОтвори крайния файл или документ и провери всяко условие. До него запиши „изпълнено“, „неизпълнено“ или „непроверено“ и конкретното доказателство. За непровереното запиши какво още липсва; то не е готов резултат."
            + "\n\nМожеш да изпълниш учебната проверка сам. При реален клиент техническата проверка не заменя неговото одобрение."})
        case = keyed.get("worked_case", keyed.get("case"))
        if case:
            case["title"] = "Учебен случай и решение"
        handoff = keyed.get("portfolio_handoff", keyed.get("handoff"))
        if handoff:
            handoff["title"] = "Подготви за предаване"
            handoff["content"]["body"] += "\n\nЗа самостоятелната проверка затвори проекта и го отвори от пакета по собствените указания. При текстова задача намери източника и следващата стъпка само по бележките. Участие на колега е допълнителна проверка, а действително клиентско одобрение се записва само когато е получено."
        keyed["summary"].update(title="Какво остава за следващата задача", content={
            "takeaways": [prose(x) for x in keyed["summary"]["content"].get("takeaways", [])[:2]] + [card["check"]],
            "nextStep": card["task"]})
        decision = keyed["scenario_2"]
        correct = decision["evaluation"]["correct"]
        wrong_options = [o for o in decision["content"]["options"] if o["id"] != correct]
        assert len(wrong_options) == 2
        for option, label in zip(wrong_options, card["wrong"]):
            option["label"] = label
        if row["lesson_id"] == "pv07-04":
            correct_option = next(o for o in decision["content"]["options"] if o["id"] == correct)
            correct_option["label"] = correct_option["label"].replace("Изключваш или изключваш от сцената", "Изключваш или премахваш от сцената")
        for b in blocks:
            if "evaluation" not in b:
                continue
            explanation = prose(b["feedback"].get("explanation", "")).split("\n\n")[0]
            if b["type"] in ("quiz", "scenario"):
                label = next(o["label"] for o in b["content"]["options"] if o["id"] == b["evaluation"]["correct"])
                if label not in explanation:
                    explanation += "\n\nРаботният избор: " + label
                if b["key"] == "scenario_2":
                    explanation += "\n\nЗащо частичната поправка не стига: " + card["retry"]
            b["feedback"]["explanation"] = explanation
        if row["lesson_id"] == "pv07-13":
            keyed["principle"]["content"]["body"] = keyed["principle"]["content"]["body"].replace(
                "провери броя файлове или използвай контролна сума при приемане и проверка на материалите",
                "свери броя и размерите на файловете и сравни контролни суми, когато имаш подходящ инструмент")
            keyed["work_order"]["content"]["body"] = keyed["work_order"]["content"]["body"].replace(
                "Пусни контролна сума или сравни отчета за брой и размер на файловете.",
                "Свери броя и размерите; сравни контролни суми, когато имаш подходящ инструмент. Запиши ограниченията на използваната проверка.")
            keyed["principle"]["content"]["body"] += "\n\nБрой и размер на файлове са първа проверка, но не доказват еднакво съдържание. Сравни контролни суми, когато имаш подходящ инструмент, и пробвай възпроизвеждането на копието. Копие в друга папка на същия диск не е независимо резервно копие."
        if row["lesson_id"] == "pv08-12":
            keyed["principle"]["content"]["body"] = keyed["principle"]["content"]["body"].replace(
                "нужни медии или прокси", "нужните оригинални медии и зависимости за уговореното възстановяване")
            keyed["principle"]["content"]["body"] += "\n\nПроксито не замества оригинала за пълноценен архив. За възстановим монтаж запази необходимите оригинали и зависимости според уговорения обхват. Ако предаваш само финален файл, означи точно това ограничение."
        update_reference(row["lesson_id"], blocks)
        result.append({"module": row["module_id"], "lesson": row["lesson_id"],
                       "source_version": version["version_number"], "source_hash": fingerprints[row["lesson_id"]],
                       "objective": card["intro"], "hook": keyed["hook"]["content"]["body"], "blocks": blocks})
    assert sum(len(s["blocks"]) for s in result) == 1282
    assert sum("evaluation" in b for s in result for b in s["blocks"]) == 375
    PAYLOAD.write_text(json.dumps(result, ensure_ascii=False, indent=2) + "\n")
    print(f"Assembled {len(result)} lessons / 1282 blocks / 375 retained checks")


if __name__ == "__main__":
    if len(sys.argv) != 3:
        raise SystemExit("Pass curriculum-only source.json and fingerprints.json")
    assemble(*sys.argv[1:])
