import json
import sys
sys.stdout.reconfigure(encoding='utf-8')

NEW = {
    "bryte": {"translation": "ломать / разбивать", "transcription": "брютэ", "pos": "verb", "dict": "ломать"},
    "dyreaktivitet": {"translation": "активность животных", "transcription": "дюреактивитет", "pos": "noun", "dict": "активность животных"},
    "dyrebestander": {"translation": "популяции животных", "transcription": "дюребестаннер", "pos": "noun", "dict": "популяция"},
    "ekspedisjoner": {"translation": "экспедиции", "transcription": "экспедисьюнэр", "pos": "noun", "dict": "экспедиция"},
    "fartøyet": {"translation": "судно", "transcription": "фартёйет", "pos": "noun", "dict": "судно"},
    "feltarbeid": {"translation": "полевая работа", "transcription": "фэльтарбэйд", "pos": "noun", "dict": "полевая работа"},
    "ff": {"translation": "FF (научное судно)", "transcription": "эф-эф", "pos": "", "dict": ""},
    "forandrer": {"translation": "меняет", "transcription": "фораннрэр", "pos": "verb", "dict": "менять"},
    "forskningsfartøyet": {"translation": "исследовательское судно", "transcription": "форсканингсфартёйет", "pos": "noun", "dict": "исследовательское судно"},
    "forskningsmiljøet": {"translation": "научное сообщество", "transcription": "форсканингсмилёэт", "pos": "noun", "dict": "научное сообщество"},
    "forskningsstasjon": {"translation": "исследовательская станция", "transcription": "форсканингсстасьюн", "pos": "noun", "dict": "исследовательская станция"},
    "forståelsen": {"translation": "понимание", "transcription": "форстолсэн", "pos": "noun", "dict": "понимание"},
    "hovedkontoret": {"translation": "главный офис", "transcription": "ховэдконторэт", "pos": "noun", "dict": "главный офис"},
    "investerte": {"translation": "инвестировал", "transcription": "инвэстэртэ", "pos": "verb", "dict": "инвестировать"},
    "isstykkelse": {"translation": "толщина льда", "transcription": "исстюккэльсэ", "pos": "noun", "dict": "толщина льда"},
    "kapasitet": {"translation": "ёмкость / возможности", "transcription": "капасситэт", "pos": "noun", "dict": "ёмкость"},
    "klimaet": {"translation": "климат", "transcription": "климаэт", "pos": "noun", "dict": "климат"},
    "klimarapporter": {"translation": "климатические доклады", "transcription": "климарапортэр", "pos": "noun", "dict": "климатический доклад"},
    "klimavitenskapen": {"translation": "климатология", "transcription": "климавитэнскапэн", "pos": "noun", "dict": "климатология"},
    "kloden": {"translation": "планета", "transcription": "клудэн", "pos": "noun", "dict": "планета"},
    "logistikkfolk": {"translation": "логисты", "transcription": "логистикфольк", "pos": "noun", "dict": "логист"},
    "lufttemperatur": {"translation": "температура воздуха", "transcription": "люфттэмпэратюр", "pos": "noun", "dict": "температура воздуха"},
    "meters": {"translation": "метров", "transcription": "мэтэрс", "pos": "noun", "dict": "метр"},
    "målingene": {"translation": "измерения", "transcription": "молингэнэ", "pos": "noun", "dict": "измерение"},
    "ombord": {"translation": "на борту", "transcription": "омборд", "pos": "adv", "dict": "на борту"},
    "planeten": {"translation": "планета", "transcription": "планэтэн", "pos": "noun", "dict": "планета"},
    "polare": {"translation": "полярные", "transcription": "пуларэ", "pos": "adj", "dict": "полярный"},
    "polarforskning": {"translation": "полярные исследования", "transcription": "пуларфорсканинг", "pos": "noun", "dict": "полярное исследование"},
    "senteret": {"translation": "центр", "transcription": "сэнтэрэт", "pos": "noun", "dict": "центр"},
    "skipet": {"translation": "корабль", "transcription": "шипэт", "pos": "noun", "dict": "корабль"},
    "snødybde": {"translation": "толщина снега", "transcription": "снёдюбдэ", "pos": "noun", "dict": "толщина снега"},
    "temperatur": {"translation": "температура", "transcription": "тэмпэратюр", "pos": "noun", "dict": "температура"},
    "tykk": {"translation": "толстый", "transcription": "тюкк", "pos": "adj", "dict": "толстый"},
    "uunnværlig": {"translation": "незаменимый", "transcription": "юннвэрлиг", "pos": "adj", "dict": "незаменимый"},
}

path = "c:/_JOB_/APP/norsk-app/public/glosses.json"
with open(path, encoding="utf-8") as f:
    glosses = json.load(f)

added = 0
for k, v in NEW.items():
    if k not in glosses:
        glosses[k] = v
        added += 1
    else:
        print(f"Skipping existing: {k}")

# Resort alphabetically
glosses = dict(sorted(glosses.items()))

with open(path, "w", encoding="utf-8") as f:
    json.dump(glosses, f, ensure_ascii=False, indent=2)

print(f"Added {added} new glosses. Total: {len(glosses)}")
