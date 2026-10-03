"""Reproducible, invented teaching assets. No accounts, learner data or API calls.

The voice is synthetic eSpeak NG Bulgarian, not a recording of a real customer.
For regeneration install espeakng-loader==0.2.4 in the authoring environment.
The site itself requires no Python or speech dependency.
"""
import csv
import ctypes
import io
import json
import wave
from pathlib import Path
from xml.sax.saxutils import escape

from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak

ROOT = Path(__file__).resolve().parents[2]
ASSETS = ROOT / "src/data/silk-road-packet"
VOICE = "Здравейте. Видях старата обява за диагностика на велосипед за двадесет евро. Може ли да ми потвърдите час за петък? Не знам дали тази обява още важи. Благодаря."


def make_packet():
    ASSETS.mkdir(parents=True, exist_ok=True)
    pdfmetrics.registerFont(TTFont("Packet", "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"))
    pdfmetrics.registerFont(TTFont("PacketBold", "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"))
    body = ParagraphStyle("body", fontName="Packet", fontSize=10.5, leading=17, spaceAfter=12)
    title = ParagraphStyle("title", parent=body, fontName="PacketBold", fontSize=22, leading=29, spaceAfter=18)
    label = ParagraphStyle("label", parent=body, fontName="PacketBold", textColor=colors.HexColor("#ad222f"), fontSize=9)
    story = []
    businesses = [
        ("Велосипедна работилница „Педал“", "Велико Търново", "Диагностика на велосипед", "25 €", "Обявата за 20 € е важала до 30.09.2026 г.", "Ремонтът и необходимите части се уточняват отделно. Няма предоставен график. Заявката не потвърждава час."),
        ("Пекарна „Малина“", "Горна Оряховица", "Кутия с 12 сладки", "18 €", "Обявата за 16 € е изтекла на 30.09.2026 г.", "Доставката не е включена. Наличността и начинът на получаване се уточняват след заявката. Няма предоставена складова система."),
    ]
    for index, (name, town, service, price, old, scope) in enumerate(businesses):
        if index:
            story.append(PageBreak())
        story += [Paragraph("ТАВОРА / ПЪТЯТ НА КОПРИНАТА", label), Paragraph(escape(name), title), Paragraph(f"{escape(town)} · Утвърдени учебни условия от 03.10.2026 г.", body)]
        rows = [[Paragraph("Услуга", label), Paragraph("Цена", label)], [Paragraph(escape(service), body), Paragraph(price, body)]]
        table = Table(rows, colWidths=[340, 115], hAlign="LEFT")
        table.setStyle(TableStyle([("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#f1f3f7")), ("BOX", (0, 0), (-1, -1), .7, colors.HexColor("#c9ced9")), ("LEFTPADDING", (0, 0), (-1, -1), 12), ("RIGHTPADDING", (0, 0), (-1, -1), 12), ("TOPPADDING", (0, 0), (-1, -1), 12), ("BOTTOMPADDING", (0, 0), (-1, -1), 3)]))
        story += [table, Spacer(1, 22), Paragraph("Обхват и следваща стъпка", label), Paragraph(escape(scope), body), Paragraph("Стар материал", label), Paragraph(escape(old), body), Paragraph("Правило за приемане", label), Paragraph("Страницата приема запитване с име и валиден контакт. При повторение на същия номер и данни не създава втори запис. Две различни заявки не се сливат само защото контактът е общ.", body), Spacer(1, 18), Paragraph("Всички бизнеси, условия, числа и контакти са измислени за упражнение. Този файл не е действителна оферта или разрешение за работа с реални клиенти.", body)]
    def footer(canvas, doc):
        canvas.setFont("Packet", 8)
        canvas.setFillColor(colors.HexColor("#555e70"))
        canvas.drawString(48, 33, "Учебен пакет / версия 2026-10-03.1")
        canvas.drawRightString(A4[0]-48, 33, str(doc.page))
    SimpleDocTemplate(str(ASSETS / "approved-conditions.pdf"), pagesize=A4, rightMargin=48, leftMargin=48, topMargin=46, bottomMargin=55, title="Утвърдени учебни условия", author="ТАВОРА", invariant=1).build(story, onFirstPage=footer, onLaterPages=footer)
    rows = [
        ["Z-001", "2026-10-03", "A", "case-a@example.invalid", "час", "Искам час за диагностика в петък.", "email"],
        ["Z-002", "2026-10-03", "B", "case-b@example.invalid", "час", "Има ли свободен час утре?", "form"],
        ["Z-003", "2026-10-03", "C", "case-c@example.invalid", "цена", "Диагностиката още ли е 20 евро?", "email"],
        ["Z-004", "2026-10-03", "D", "case-d@example.invalid", "час", "Кога мога да донеса велосипед?", "form"],
        ["Z-005", "2026-10-03", "E", "case-e@example.invalid", "час", "Може ли в понеделник?", "email"],
        ["Z-006", "2026-10-03", "F", "case-f@example.invalid", "цена", "Ремонтът включен ли е в диагностиката?", "form"],
        ["Z-007", "2026-10-03", "G", "case-g@example.invalid", "час", "Искам да уточня ден за преглед.", "form"],
        ["Z-002", "2026-10-03", "B", "case-b@example.invalid", "час", "Има ли свободен час утре?", "form"],
    ]
    target = io.StringIO(newline="")
    writer = csv.writer(target, lineterminator="\n")
    writer.writerow(["request_id", "date", "visitor", "contact", "topic", "message", "source"])
    writer.writerows(rows)
    (ASSETS / "inquiries.csv").write_text("\ufeff" + target.getvalue(), encoding="utf-8")
    (ASSETS / "old-advert.svg").write_text('''<svg xmlns="http://www.w3.org/2000/svg" width="900" height="600" viewBox="0 0 900 600"><rect width="900" height="600" fill="#edf2f7"/><g font-family="DejaVu Sans,Arial,sans-serif" fill="#182334"><text x="65" y="80" font-size="20">ИЗМИСЛЕНА УЧЕБНА ОБЯВА</text><text x="65" y="164" font-size="38" font-weight="bold">Работилница „Педал“</text><text x="65" y="230" font-size="27">Диагностика на велосипед</text><text x="65" y="335" font-size="70" font-weight="bold">20 €</text><text x="65" y="405" font-size="25">Предложение до 30.09.2026 г.</text><text x="65" y="485" font-size="22">Велико Търново · час след уточнение</text><text x="65" y="535" font-size="18">Стар материал. Провери актуалните условия.</text></g></svg>''', encoding="utf-8")
    (ASSETS / "voicemail-transcript.txt").write_text("Синтетичен учебен запис. Не е действителен клиент.\n\n" + VOICE + "\n", encoding="utf-8")
    manifest = {"version": "2026-10-03.1", "invented": True, "audio": {"synthetic": True, "generator": "eSpeak NG Bulgarian through espeakng-loader 0.2.4", "transcript": VOICE}, "files": ["approved-conditions.pdf", "inquiries.csv", "old-advert.svg", "voicemail.wav", "voicemail-transcript.txt"]}
    (ASSETS / "manifest.json").write_text(json.dumps(manifest, ensure_ascii=False, indent=2)+"\n", encoding="utf-8")


def make_voice():
    import espeakng_loader
    lib = espeakng_loader.load_library()
    lib.espeak_Initialize.argtypes = [ctypes.c_int, ctypes.c_int, ctypes.c_char_p, ctypes.c_int]
    lib.espeak_Initialize.restype = ctypes.c_int
    lib.espeak_SetVoiceByName.argtypes = [ctypes.c_char_p]
    lib.espeak_Synth.argtypes = [ctypes.c_void_p, ctypes.c_size_t, ctypes.c_uint, ctypes.c_int, ctypes.c_uint, ctypes.c_uint, ctypes.c_void_p, ctypes.c_void_p]
    sample_rate = lib.espeak_Initialize(2, 0, espeakng_loader.get_data_path().encode(), 0)
    if sample_rate <= 0 or lib.espeak_SetVoiceByName(b"bg") != 0:
        raise RuntimeError("Bulgarian synthetic voice is unavailable")
    chunks = []
    callback_type = ctypes.CFUNCTYPE(ctypes.c_int, ctypes.POINTER(ctypes.c_short), ctypes.c_int, ctypes.c_void_p)
    @callback_type
    def receive(samples, count, events):
        if samples and count:
            chunks.append(ctypes.string_at(samples, count*2))
        return 0
    lib.espeak_SetSynthCallback(receive)
    lib.espeak_SetParameter(1, 145, 0)
    text = ctypes.create_string_buffer(VOICE.encode("utf-8"))
    code = lib.espeak_Synth(text, len(text), 0, 1, 0, 1, None, None)
    if code != 0 or not chunks:
        raise RuntimeError("Synthetic recording failed")
    with wave.open(str(ASSETS / "voicemail.wav"), "wb") as output:
        output.setnchannels(1)
        output.setsampwidth(2)
        output.setframerate(sample_rate)
        output.writeframes(b"".join(chunks))


if __name__ == "__main__":
    make_packet()
    make_voice()
    print("Created five invented teaching files and the source manifest.")
