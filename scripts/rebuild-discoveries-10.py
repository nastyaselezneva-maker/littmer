import json
import sys
sys.stdout.reconfigure(encoding='utf-8')

# Sources for `no_phrase` and `no_noun` segments (carry over translation/dict/transcription/pos)
NO_META = {
    "Norsk Polarinstitutt": {"translation": "Норвежский полярный институт", "dict": "Норвежский полярный институт", "transcription": "норск пуларинститютт", "pos": "phrase"},
    "Først og fremst": {"translation": "Прежде всего", "dict": "прежде всего", "transcription": "фёрст о фрэмст", "pos": "phrase"},
    "I løpet av": {"translation": "В течение", "dict": "в течение", "transcription": "и лёпет ав", "pos": "phrase"},
    "spilt en sentral rolle": {"translation": "сыграл центральную роль", "dict": "играть центральную роль", "transcription": "спильт эн сэнтрал ролле", "pos": "phrase"},
    "klimaendringer": {"translation": "климатических изменений", "dict": "изменение климата", "transcription": "клима-эндрингер", "pos": "noun"},
    "side om side": {"translation": "бок о бок", "dict": "бок о бок", "transcription": "сидэ ом сидэ", "pos": "phrase"},
    "sjøis": {"translation": "морской лёд", "dict": "морской лёд", "transcription": "шёис", "pos": "noun"},
    "issmelting": {"translation": "таяние льда", "dict": "таяние льда", "transcription": "иссмэльтинг", "pos": "noun"},
    "havstrømmer": {"translation": "морские течения", "dict": "морское течение", "transcription": "хавстрёммер", "pos": "noun"},
    "For det meste": {"translation": "В основном", "dict": "в основном", "transcription": "фор дэ мэстэ", "pos": "phrase"},
    "På den måten": {"translation": "Таким образом", "dict": "таким образом", "transcription": "по дэн мотэн", "pos": "phrase"},
    "Når det gjelder": {"translation": "Что касается", "dict": "когда речь идёт о", "transcription": "нор дэ йельдер", "pos": "phrase"},
    "I tillegg til": {"translation": "В дополнение к", "dict": "в дополнение к", "transcription": "и тилэгг тиль", "pos": "phrase"},
    "blant annet": {"translation": "в том числе", "dict": "в том числе", "transcription": "блант аннэт", "pos": "phrase"},
    "Ikke minst": {"translation": "Не в последнюю очередь", "dict": "не в последнюю очередь", "transcription": "икке минст", "pos": "phrase"},
    "I sum": {"translation": "В итоге", "dict": "в итоге", "transcription": "и сюмм", "pos": "phrase"},
}

# (kind, args)
# kind = "no" -> args = (norwegian_phrase,)
# kind = "ru" -> args = (russian_text, norwegian_translation)
SEGMENTS = [
    ("no", "Norsk Polarinstitutt"),
    ("ru", " — самый важный центр ", " — det viktigste senteret "),
    ("ru", "норвежских исследований ", "for norsk forskning "),
    ("ru", "в полярных областях. ", "i polare områder. "),

    ("no", "Først og fremst"),
    ("ru", " институт координирует ", " koordinerer instituttet "),
    ("ru", "научные экспедиции ", "vitenskapelige ekspedisjoner "),
    ("ru", "как в Арктике, так и в Антарктиде. ", "både i Arktis og Antarktis. "),

    ("no", "I løpet av"),
    ("ru", " последних десятилетий он ", " de siste tiårene har det "),
    ("no", "spilt en sentral rolle"),
    ("ru", " в нашем понимании ", " i forståelsen av "),
    ("no", "klimaendringer"),

    ("ru", ". Главный офис находится ", ". Hovedkontoret ligger "),
    ("ru", "в Тромсё, ", "i Tromsø, "),
    ("ru", "прямо в центре ", "midt i det "),
    ("ru", "арктического исследовательского сообщества. ", "arktiske forskningsmiljøet. "),
    ("ru", "Здесь работают ", "Her arbeider "),
    ("ru", "учёные, инженеры и логисты ", "forskere, ingeniører og logistikkfolk "),
    ("no", "side om side"),

    ("ru", ". Они изучают ", ". De studerer "),
    ("no", "sjøis"),
    ("ru", ", ", ", "),
    ("no", "issmelting"),
    ("ru", " и ", " og "),
    ("no", "havstrømmer"),
    ("ru", ". ", ". "),

    ("no", "For det meste"),
    ("ru", " работа ведётся ", " foregår arbeidet "),
    ("ru", "на исследовательском судне ", "ombord i forskningsfartøyet "),
    ("ru", "FF Kronprins Haakon — ", "FF Kronprins Haakon, "),
    ("ru", "одном из самых современных полярных кораблей в мире. ", "et av verdens mest moderne polare skip. "),
    ("ru", "Корабль был построен ", "Skipet ble bygget "),
    ("ru", "в 2018 году ", "i 2018 "),
    ("ru", "и стоил около 1,4 миллиарда крон. ", "og kostet omtrent 1,4 milliarder kroner. "),

    ("no", "På den måten"),
    ("ru", ", Норвегия вложилась ", " investerte Norge "),
    ("ru", "в долгосрочные полярные исследования. ", "i langsiktig polarforskning. "),

    ("no", "Når det gjelder"),
    ("ru", " возможностей, ", " kapasitet, "),
    ("ru", "судно способно ломать лёд ", "kan fartøyet bryte is "),
    ("ru", "толщиной до одного метра ", "opp til en meter tykk "),
    ("ru", "и брать пробы ", "og ta prøver "),
    ("ru", "на глубине до 4000 метров. ", "helt ned til 4000 meters dyp. "),

    ("no", "I tillegg til"),
    ("ru", " полевой работе ", " feltarbeid "),
    ("ru", "институт ведёт ", "driver instituttet "),
    ("ru", "непрерывный мониторинг климата. ", "kontinuerlig overvåking av klimaet. "),
    ("ru", "Каждый год регистрируются ", "Hvert år registreres "),
    ("ru", "данные о температуре, ", "data om temperatur, "),
    ("ru", "толщине льда ", "isstykkelse "),
    ("ru", "и популяциях животных. ", "og dyrebestander. "),
    ("ru", "Эти данные ложатся в основу ", "Disse dataene danner grunnlaget for "),
    ("ru", "международных климатических докладов, ", "internasjonale klimarapporter, "),

    ("no", "blant annet"),
    ("ru", " докладов IPCC. ", " de fra IPCC. "),

    ("no", "Ikke minst"),
    ("ru", " норвежские учёные тесно сотрудничают ", " samarbeider norske forskere tett "),
    ("ru", "с коллегами ", "med kolleger "),
    ("ru", "из Исландии, Швеции и США. ", "fra Island, Sverige og USA. "),
    ("ru", "Сотрудничество необходимо ", "Samarbeidet er nødvendig "),
    ("ru", "потому, что полярные изменения ", "fordi polare endringer "),
    ("ru", "влияют на всю планету. ", "påvirker hele planeten. "),

    ("ru", "На Шпицбергене ", "På Svalbard "),
    ("ru", "у института есть ", "driver instituttet en "),
    ("ru", "научная станция ", "forskningsstasjon "),
    ("ru", "в Ню-Олесунн, ", "i Ny-Ålesund, "),
    ("ru", "где исследователи ", "der forskere "),
    ("ru", "из многих стран ", "fra mange land "),
    ("ru", "живут и работают ", "bor og arbeider "),
    ("ru", "круглый год. ", "hele året. "),
    ("ru", "Станция фиксирует ", "Stasjonen registrerer "),
    ("ru", "температуру воздуха, ", "lufttemperatur, "),
    ("ru", "толщину снега ", "snødybde "),
    ("ru", "и активность животных, ", "og dyreaktivitet, "),
    ("ru", "и эти измерения собираются ", "og disse målingene er samlet "),
    ("ru", "с 1968 года. ", "siden 1968. "),

    ("no", "I sum"),
    ("ru", ", Norsk Polarinstitutt — ", " er Norsk Polarinstitutt "),
    ("ru", "это незаменимое звено ", "en uunnværlig brikke "),
    ("ru", "в глобальной климатологии. ", "i den globale klimavitenskapen. "),
    ("ru", "Без таких учреждений ", "Uten slike institusjoner "),
    ("ru", "мы знали бы гораздо меньше ", "ville verden hatt langt mindre kunnskap "),
    ("ru", "о том, как меняется наша планета.", "om hvordan kloden vår forandrer seg."),
]

# Build segments
segments = []
for s in SEGMENTS:
    kind = s[0]
    if kind == "no":
        word = s[1]
        meta = NO_META[word]
        segments.append({
            "type": "no",
            "text": word,
            "translation": meta["translation"],
            "dict": meta["dict"],
            "transcription": meta["transcription"],
            "pos": meta["pos"]
        })
    elif kind == "ru":
        ru_text, no_text = s[1], s[2]
        segments.append({"type": "ru", "text": ru_text, "no": no_text})
    else:
        raise ValueError(f"Unknown kind: {kind}")

# Read existing file to preserve top-level fields
path = "c:/_JOB_/APP/norsk-app/public/content/discoveries-10.json"
with open(path, encoding="utf-8") as f:
    data = json.load(f)

data["segments"] = segments
data["reveal"] = "frequency"

# Count NO words
no_words = 0
for s in segments:
    if s["type"] == "no":
        no_words += len(s["text"].split())
    else:
        no_words += len(s.get("no", "").split())
print(f"Total NO words: {no_words}")
print(f"Total segments: {len(segments)}")

# Same counting method as catalog script (only ru.no)
catalog_words = sum(len(s.get("no", "").split()) for s in segments)
print(f"Catalog-method words: {catalog_words}")

with open(path, "w", encoding="utf-8") as f:
    json.dump(data, f, ensure_ascii=False)
print("Saved.")
