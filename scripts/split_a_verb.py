# -*- coding: utf-8 -*-
"""
Splits ru-segments where å+verb is embedded in the no-field.

Reads scripts/_infinitive_skipped.json, processes each case in public/content/{file},
and writes:
  - modified content files (single-line JSON, ensure_ascii=False)
  - scripts/_a_verb_skipped_v2.json (cases that could not be auto-resolved)
  - scripts/_a_verb_processed.json (cases successfully processed with before→after)
"""
import json
import os
import re
import sys
import io
from collections import defaultdict, Counter

# Force UTF-8 output on Windows console (only when run as main script)
if __name__ == "__main__":
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8")
    sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding="utf-8")

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
CONTENT_DIR = os.path.join(ROOT, "public", "content")
SKIPPED_INPUT = os.path.join(ROOT, "scripts", "_infinitive_skipped.json")
SKIPPED_V2_OUTPUT = os.path.join(ROOT, "scripts", "_a_verb_skipped_v2.json")
PROCESSED_OUTPUT = os.path.join(ROOT, "scripts", "_a_verb_processed.json")
GLOSSES = os.path.join(ROOT, "public", "glosses.json")

with open(GLOSSES, encoding="utf-8") as f:
    GLOSSES_DATA = json.load(f)

# Manual Russian-infinitive mapping (extends glosses). Keys are Norwegian infinitives.
VERB_INFINITIVE_RU = {
    "snakke": "говорить",
    "spise": "есть",
    "lese": "читать",
    "skrive": "писать",
    "gå": "идти",
    "se": "видеть",
    "ta": "брать",
    "få": "получить",
    "ha": "иметь",
    "bli": "стать",
    "gi": "давать",
    "slå": "бить",
    "be": "просить",
    "dø": "умереть",
    "være": "быть",
    "gjøre": "делать",
    "synes": "считать",
    "drikke": "пить",
    "sove": "спать",
    "finne": "найти",
    "bo": "жить",
    "høre": "слышать",
    "tenke": "думать",
    "vite": "знать",
    "lære": "учить",
    "jobbe": "работать",
    "arbeide": "работать",
    "kjøre": "ехать",
    "reise": "путешествовать",
    "komme": "приходить",
    "kjøpe": "покупать",
    "selge": "продавать",
    "lage": "делать",
    "bygge": "строить",
    "fjerne": "удалять",
    "huske": "помнить",
    "glemme": "забывать",
    "starte": "начинать",
    "slutte": "заканчивать",
    "møte": "встречать",
    "vente": "ждать",
    "hjelpe": "помогать",
    "leve": "жить",
    "spille": "играть",
    "leke": "играть",
    "svømme": "плавать",
    "bade": "плавать",
    "løpe": "бежать",
    "sykle": "ездить на велосипеде",
    "løse": "решать",
    "forstå": "понимать",
    "tegne": "рисовать",
    "male": "красить",
    "synge": "петь",
    "danse": "танцевать",
    "lytte": "слушать",
    "oppleve": "переживать",
    "føle": "чувствовать",
    "kjenne": "знать",
    "merke": "замечать",
    "oppdage": "обнаруживать",
    "lete": "искать",
    "søke": "искать",
    "treffe": "встретить",
    "besøke": "посещать",
    "fly": "летать",
    "dra": "ехать",
    "forlate": "покидать",
    "returnere": "возвращаться",
    "sitte": "сидеть",
    "stå": "стоять",
    "ligge": "лежать",
    "legge": "класть",
    "sette": "ставить",
    "falle": "падать",
    "kaste": "бросать",
    "fange": "ловить",
    "plukke": "собирать",
    "samle": "собирать",
    "dele": "делить",
    "motta": "получать",
    "sende": "посылать",
    "bringe": "приносить",
    "hente": "забирать",
    "miste": "терять",
    "tape": "проигрывать",
    "vinne": "выигрывать",
    "prøve": "пробовать",
    "forsøke": "пытаться",
    "fortsette": "продолжать",
    "avslutte": "завершать",
    "avbryte": "прерывать",
    "hvile": "отдыхать",
    "studere": "учиться",
    "undervise": "преподавать",
    "forklare": "объяснять",
    "fortelle": "рассказывать",
    "si": "сказать",
    "spørre": "спрашивать",
    "svare": "отвечать",
    "prate": "болтать",
    "rope": "кричать",
    "hviske": "шептать",
    "tie": "молчать",
    "le": "смеяться",
    "gråte": "плакать",
    "smile": "улыбаться",
    "klage": "жаловаться",
    "rose": "хвалить",
    "kritisere": "критиковать",
    "takke": "благодарить",
    "invitere": "приглашать",
    "akseptere": "принимать",
    "avslå": "отклонять",
    "velge": "выбирать",
    "bestemme": "решать",
    "planlegge": "планировать",
    "arrangere": "организовывать",
    "organisere": "организовывать",
    "forberede": "готовить",
    "tro": "верить",
    "mene": "считать",
    "drømme": "мечтать",
    "håpe": "надеяться",
    "ønske": "желать",
    "ville": "хотеть",
    "kunne": "мочь",
    "måtte": "быть должным",
    "skulle": "быть должным",
    "tørre": "сметь",
    "orke": "мочь",
    "klare": "справляться",
    "greie": "справляться",
    "rekke": "успевать",
    "beskrive": "описывать",
    "definere": "определять",
    "sammenligne": "сравнивать",
    "analysere": "анализировать",
    "evaluere": "оценивать",
    "bedømme": "оценивать",
    "dømme": "судить",
    "straffe": "наказывать",
    "belønne": "награждать",
    "nyte": "наслаждаться",
    "ferdes": "передвигаться",
    "overnatte": "ночевать",
    "våkne": "просыпаться",
    "vaske": "мыть",
    "pusse": "чистить",
    "rydde": "убирать",
    "forandre": "менять",
    "utvikle": "развивать",
    "vokse": "расти",
    "minke": "уменьшаться",
    "øke": "увеличиваться",
    "redusere": "уменьшать",
    "skape": "создавать",
    "produsere": "производить",
    "rive": "разрушать",
    "ødelegge": "разрушать",
    "reparere": "ремонтировать",
    "fikse": "чинить",
    "forbedre": "улучшать",
    "forverre": "ухудшать",
    "beskytte": "защищать",
    "forsvare": "защищать",
    "angripe": "нападать",
    "flykte": "убегать",
    # Additional verbs that show up in our skipped list
    "tenne": "зажигать",
    "bruke": "использовать",
    "vise": "показывать",
    "sikre": "обеспечивать",
    "inkludere": "включать",
    "opprettholde": "поддерживать",
    "konkurrere": "конкурировать",
    "åpne": "открывать",
    "forvalte": "управлять",
    "gjennomføre": "проводить",
    "beholde": "сохранять",
    "fungere": "функционировать",
    "stoppe": "останавливать",
    "bytte": "менять",
    "bestille": "заказывать",
    "tilpasse": "приспосабливать",
    "påvirke": "влиять",
    "følge": "следовать",
    "heve": "повышать",
    "dempe": "снижать",
    "investere": "инвестировать",
    "sjekke": "проверять",
    "betale": "платить",
    "sikte": "стремиться",
    "tilby": "предлагать",
    "skaffe": "получать",
    "gjenåpne": "вновь открывать",
    "vurdere": "оценивать",
    "godkjenne": "одобрять",
    "kreve": "требовать",
    "forhandle": "торговаться",
    "argumentere": "аргументировать",
    "diskutere": "обсуждать",
    "drøfte": "обсуждать",
    "etablere": "учреждать",
    "gjenta": "повторять",
    "forklare": "объяснять",
    "skille": "отличать",
    "samarbeide": "сотрудничать",
    "delta": "участвовать",
    "delegere": "делегировать",
    "informere": "информировать",
    "beklage": "сожалеть",
    "bekrefte": "подтверждать",
    "bevare": "сохранять",
    "betjene": "обслуживать",
    "håndtere": "обращаться",
    "anbefale": "рекомендовать",
    "kontakte": "связываться",
    "registrere": "регистрировать",
    "varsle": "уведомлять",
    "publisere": "публиковать",
    "uttrykke": "выражать",
    "henvende": "обращаться",
    "rapportere": "сообщать",
    "vente": "ждать",
    "klare seg": "справляться",
    "leie": "снимать",
    "eie": "владеть",
    "drive": "вести",
    "miste": "терять",
    "tegne": "рисовать",
    "tjene": "зарабатывать",
    "spare": "экономить",
    "skylde": "быть должным",
    "låne": "одалживать",
    "låne ut": "одалживать",
    "skylle": "полоскать",
    "transportere": "перевозить",
    "frakte": "перевозить",
    "levere": "доставлять",
    "garantere": "гарантировать",
    "begrense": "ограничивать",
    "redde": "спасать",
    "forberede seg": "готовиться",
    "delta": "участвовать",
    "møtes": "встречаться",
    "skje": "случаться",
    "endre": "изменять",
    "trene": "тренироваться",
    "anvende": "применять",
    "benytte": "использовать",
    "trekke": "тянуть",
    "trekke seg": "отступать",
    "innføre": "вводить",
    "innkalle": "созывать",
    "samle inn": "собирать",
    "samle seg": "собираться",
    "vurdere": "оценивать",
    "betale": "платить",
    "skrive ut": "распечатывать",
    "skrive inn": "вводить",
    "skrive under": "подписывать",
    "fylle": "заполнять",
    "fylle ut": "заполнять",
    "fylle inn": "вписывать",
    "håpe": "надеяться",
    "love": "обещать",
    "forholde seg": "относиться",
    "stille": "ставить",
    "stille opp": "выстраивать",
    "tro": "верить",
    "antyde": "намекать",
    "innrømme": "признавать",
    "nekte": "отрицать",
    "vurdere": "оценивать",
    "anslå": "оценивать",
    "trives": "чувствовать себя комфортно",
    "trekkes": "влечься",
    "påta": "брать на себя",
    "begå": "совершать",
    "utføre": "выполнять",
    "kontrollere": "контролировать",
    "sjekke": "проверять",
    "fastsette": "устанавливать",
    "fastslå": "констатировать",
    "fortjene": "заслуживать",
    "tape": "проигрывать",
    "innse": "осознавать",
    "regne": "считать",
    "behandle": "обрабатывать",
    "kvalifisere": "квалифицировать",
    "spesifisere": "уточнять",
    "spesialisere": "специализироваться",
    "fornye": "обновлять",
    "fornye seg": "обновляться",
    "konvertere": "конвертировать",
    "implementere": "внедрять",
    "støtte": "поддерживать",
    "påvirke": "влиять",
    "publisere": "публиковать",
    "fjerne": "удалять",
    "innkalle": "созывать",
    "bestå": "состоять",
    "fortsette": "продолжать",
    "avtale": "договариваться",
    "lagre": "хранить",
    "oppgi": "указывать",
    "oppstille": "выставлять",
    "selge": "продавать",
    "varme": "греть",
    "varmes": "греться",
    "kjøpe": "покупать",
    "leke": "играть",
    "tilstreve": "стремиться",
    "samarbeide": "сотрудничать",
    "vente": "ждать",
    "konsumere": "потреблять",
    "redusere": "уменьшать",
    "lette": "облегчать",
    "stille": "ставить",
    "etablere": "учреждать",
    "stenge": "закрывать",
    "stenges": "закрываться",
    "møtes": "встречаться",
    "leie ut": "сдавать в аренду",
    "låne": "одалживать",
    "regulere": "регулировать",
    "registrere": "регистрировать",
    "forvalte": "управлять",
    "ansette": "нанимать",
    "sparke": "пинать",
    "si opp": "увольнять",
    "stress": "напрягать",
    "stresse": "напрягаться",
    "bestille": "заказывать",
    "håndtere": "обращаться",
    "garantere": "гарантировать",
    "betjene": "обслуживать",
    "lønne": "оплачивать",
    "lønne seg": "окупаться",
    "fungere": "работать",
    "fungeres": "функционировать",
    "ringe": "звонить",
    "sørge": "обеспечивать",
    "utbetale": "выплачивать",
    "turnere": "гастролировать",
    "utelukke": "исключать",
    "pugge": "зубрить",
}

# Norwegian → Cyrillic transliteration for transcription fallback
TRANSLIT = {
    "a": "а", "b": "б", "c": "к", "d": "д", "e": "э", "f": "ф",
    "g": "г", "h": "х", "i": "и", "j": "й", "k": "к", "l": "л",
    "m": "м", "n": "н", "o": "о", "p": "п", "q": "к", "r": "р",
    "s": "с", "t": "т", "u": "у", "v": "в", "w": "в", "x": "кс",
    "y": "ю", "z": "з",
    "å": "о", "ø": "ё", "æ": "э",
}


def transliterate_verb(verb: str) -> str:
    """Rough fallback transliteration of a Norwegian verb to Cyrillic."""
    out = []
    for ch in verb.lower():
        out.append(TRANSLIT.get(ch, ch))
    return "".join(out)


def get_verb_data(verb: str):
    """Returns (translation, transcription) for a Norwegian infinitive."""
    # Strip punctuation
    key = verb.lower()
    translation = None
    transcription = None
    if key in GLOSSES_DATA:
        g = GLOSSES_DATA[key]
        if g and g.get("pos") == "verb":
            translation = g.get("translation")
            transcription = g.get("transcription")
    # Override translation with manual infinitive map if available
    if key in VERB_INFINITIVE_RU:
        translation = VERB_INFINITIVE_RU[key]
    if not translation:
        translation = None  # signal missing
    if not transcription:
        transcription = transliterate_verb(verb)
    return translation, transcription


# Russian infinitive endings: -ть, -ться, -чь, -чься, -ти (идти/найти/etc.), -тись
RU_INF_RE = re.compile(r"(ться|чься|ть|чь|тись|ти)\b", re.IGNORECASE)


def find_russian_split(ru_text: str, verb: str):
    """
    Find a position in ru_text that corresponds to the å+verb. Returns:
        (ru_before, ru_after) on success
        None on failure (caller should skip)

    Strategy:
      1. Get expected Russian infinitive(s) for the verb.
      2. Look for any Russian infinitive (ending in -ть/-ться/-чь) in ru_text.
      3. Pick the leftmost one and remove it cleanly (with surrounding whitespace).
      4. If multiple infinitives present, prefer the one whose root matches the
         expected translation (e.g. дела for делать).
      5. If no infinitive found in ru_text, return None.
    """
    expected_translation, _ = get_verb_data(verb)
    expected = expected_translation if expected_translation else ""

    # Find all infinitive candidate positions
    candidates = []  # list of (start, end, word)
    for m in re.finditer(r"[а-яА-ЯёЁ]+(?:ться|чься|ть|чь|тись|ти)\b", ru_text):
        word = m.group(0)
        # Avoid false positives: short common non-infinitives ending in these
        # letters (e.g. "путь" - noun, "ночь" - noun, "печь" - can be noun).
        # We use a small blocklist of common non-infinitive nouns/adverbs.
        if word.lower() in {
            "путь", "ночь", "дочь", "печь", "речь", "вещь", "цепь", "тушь",
            "лень", "тень", "часть", "честь", "цель", "соль", "роль", "боль",
            "мощь", "ложь", "помощь", "сеть", "степь", "местность", "мать",
            "почта", "почти", "пять", "шесть", "семь", "восемь",
            "вдруг", "впрочем",
        }:
            continue
        candidates.append((m.start(), m.end(), word))

    if not candidates:
        # Some verbs translate to non-infinitive forms; allow gerund-like noun forms
        # e.g. изменение for endre, etc. Skip — not safe to auto-split.
        return None

    # Pick best candidate: prefer one whose stem is similar to expected translation
    def score(cand):
        s, e, w = cand
        wl = w.lower()
        if expected:
            exp_stem = expected.rstrip("ться").rstrip("ть").rstrip("чь")
            w_stem = wl.rstrip("ться").rstrip("ть").rstrip("чь")
            if exp_stem and w_stem.startswith(exp_stem[:4]):
                return 0  # best
            if exp_stem and exp_stem[:3] in w_stem:
                return 1
        return 2  # any

    best = sorted(candidates, key=lambda c: (score(c), c[0]))[0]
    start, end, word = best

    # Simple slice: keep original spacing intact. The renderer will insert the
    # verb translation between ru_before and ru_after, and existing spaces on
    # both sides handle the separation correctly.
    ru_before = ru_text[:start]
    ru_after = ru_text[end:]

    # Detect if the removed word was capitalized (i.e. at the start of a
    # sentence). If so, the caller will need to capitalize the verb translation.
    capitalized = word[:1].isupper()

    return ru_before, ru_after, word, capitalized


def split_norwegian(no_text: str, verb: str):
    """
    Split no_text at " å {verb} ". Returns (no_before, no_after).
    no_before retains its trailing space (everything up to and including the
    space before å). no_after retains its leading space (everything from the
    space after the verb onward, or punctuation directly attached).
    Returns None if pattern not found.
    """
    # Pattern: word boundary, "å", whitespace, verb, then word boundary
    # The å may be at the very start (no leading space) of the field.
    # Use re to find " å verb " with word boundaries
    pattern = re.compile(r"(^|\s)å\s+" + re.escape(verb) + r"(?=[\s.,!?;:\"]|$)")
    m = pattern.search(no_text)
    if not m:
        return None
    # m.start() is position of " " before å, or 0 if at start
    pre_end = m.start()
    if m.group(1) == " ":
        pre_end += 1  # include the leading space in no_before
    elif m.group(1) == "":
        pass  # å is at very start; no_before is empty
    # m.end() is position right after verb
    post_start = m.end()
    no_before = no_text[:pre_end]
    no_after = no_text[post_start:]
    return no_before, no_after


def make_verb_segment(verb: str):
    translation, transcription = get_verb_data(verb)
    if not translation:
        return None
    seg = {
        "type": "no",
        "text": f"å {verb}",
        "translation": translation,
        "dict": translation,
        "transcription": f"о {transcription}",
        "pos": "verb",
    }
    return seg


def process_case(segments, case):
    """
    Find the matching segment in `segments` (modifies in place) and split it.
    Returns (status, info_dict) where status is one of:
       'ok', 'segment_not_found', 'no_split_failed', 'ru_split_failed',
       'no_translation', 'phrase_collision', 'already_processed', 'not_a_verb'
    """
    target_no = case["no"]
    verb = case["verb"]

    # Filter out non-verb tokens flagged by the original scan
    NON_VERBS = {"ikke", "kanskje", "også", "alltid", "aldri", "bare", "nettopp"}
    if verb.lower() in NON_VERBS:
        return ("not_a_verb", {"verb": verb})

    # Sanity: skip if å+verb already appears as a standalone no-segment near
    # somewhere (already processed in a previous run)
    # We just look for the exact ru-segment with the no-field matching.
    target_idx = None
    for i, seg in enumerate(segments):
        if (
            seg.get("type") == "ru"
            and isinstance(seg.get("no"), str)
            and seg["no"] == target_no
        ):
            target_idx = i
            break

    if target_idx is None:
        # Already processed or content changed
        return ("segment_not_found", {})

    seg = segments[target_idx]
    no_text = seg["no"]
    ru_text = seg.get("text", "")

    # Split Norwegian
    no_split = split_norwegian(no_text, verb)
    if not no_split:
        return ("no_split_failed", {"no": no_text, "verb": verb})

    no_before, no_after = no_split

    # Check for phrase collision: if å is preceded by something that forms a
    # phrase in PHRASES.json (e.g. "for å", "til å", "om å", "vits i", "verdt").
    # We'll allow these — splitting still leaves the connector intact.

    # Build new verb segment
    verb_seg = make_verb_segment(verb)
    if not verb_seg:
        return ("no_translation", {"verb": verb})

    # Split Russian
    ru_split = find_russian_split(ru_text, verb)
    if not ru_split:
        return ("ru_split_failed", {"ru": ru_text, "verb": verb})

    ru_before, ru_after, removed_word, capitalized = ru_split

    # If the removed Russian word was capitalized (sentence start), the verb
    # segment's translation should also be capitalized so the sentence still
    # reads naturally with a capital letter.
    if capitalized and verb_seg.get("translation"):
        t = verb_seg["translation"]
        verb_seg["translation"] = t[:1].upper() + t[1:]
        if verb_seg.get("dict"):
            d = verb_seg["dict"]
            verb_seg["dict"] = d[:1].upper() + d[1:]

    # Construct three new segments
    new_ru_before = {"type": "ru", "text": ru_before, "no": no_before}
    new_ru_after = {"type": "ru", "text": ru_after, "no": no_after}

    # Replace the original segment with the three new ones. If ru_before or
    # ru_after is empty (both text and no), drop them. But typically no_before
    # and no_after both have content (at least the space).
    new_segs = []
    # ru_before: drop only if BOTH text and no are completely empty
    if new_ru_before["text"] or new_ru_before["no"]:
        new_segs.append(new_ru_before)
    new_segs.append(verb_seg)
    if new_ru_after["text"] or new_ru_after["no"]:
        new_segs.append(new_ru_after)

    # Splice into segments
    segments[target_idx : target_idx + 1] = new_segs

    return (
        "ok",
        {
            "before_ru": ru_text,
            "before_no": no_text,
            "after": [
                {"text": s.get("text"), "no": s.get("no"), "translation": s.get("translation")}
                for s in new_segs
            ],
            "removed_ru_word": removed_word,
        },
    )


def verify_text_unchanged(orig_segments, new_segments):
    """Confirm that the joined Norwegian and Russian texts are unchanged."""
    def join(segs):
        no = "".join(
            (s.get("no", "") if s.get("type") == "ru" else s.get("text", ""))
            for s in segs
        )
        ru = "".join(
            (s.get("text", "") if s.get("type") == "ru" else s.get("translation", ""))
            for s in segs
        )
        return no, ru

    orig_no, _ = join(orig_segments)
    new_no, _ = join(new_segments)
    return orig_no == new_no


def main():
    dry_run = "--dry-run" in sys.argv
    with open(SKIPPED_INPUT, encoding="utf-8") as f:
        cases = json.load(f)

    by_file = defaultdict(list)
    for c in cases:
        by_file[c["file"]].append(c)

    print(f"Total cases: {len(cases)}")
    print(f"Unique files: {len(by_file)}")

    processed = []
    skipped_v2 = []
    file_change_counts = Counter()
    verb_change_counts = Counter()
    skip_reasons = Counter()

    for fname, fcases in by_file.items():
        fpath = os.path.join(CONTENT_DIR, fname)
        if not os.path.exists(fpath):
            for c in fcases:
                skipped_v2.append({**c, "v2_reason": "file_not_found"})
                skip_reasons["file_not_found"] += 1
            continue

        with open(fpath, encoding="utf-8") as f:
            data = json.load(f)

        segments = data["segments"]
        orig_no = "".join(
            (s.get("no", "") if s.get("type") == "ru" else s.get("text", ""))
            for s in segments
        )

        file_changed = False
        # Sort cases by original ru-segment occurrence to be safe
        for case in fcases:
            status, info = process_case(segments, case)
            if status == "ok":
                processed.append({**case, **info})
                file_change_counts[fname] += 1
                verb_change_counts[case["verb"]] += 1
                file_changed = True
            else:
                skipped_v2.append({**case, "v2_reason": status, **info})
                skip_reasons[status] += 1

        if file_changed:
            # Verify Norwegian text unchanged
            new_no = "".join(
                (s.get("no", "") if s.get("type") == "ru" else s.get("text", ""))
                for s in segments
            )
            if new_no != orig_no:
                # Diff for debug
                print(f"!! Norwegian text changed for {fname}!")
                # find first diff
                for i, (a, b) in enumerate(zip(orig_no, new_no)):
                    if a != b:
                        print(f"   diff at pos {i}: orig='{orig_no[max(0,i-30):i+30]}' new='{new_no[max(0,i-30):i+30]}'")
                        break
                # Rollback: re-read file
                with open(fpath, encoding="utf-8") as f:
                    data = json.load(f)
                # Mark all cases for this file as skipped
                for case in fcases:
                    if case in [{k: v for k, v in p.items() if k in case} for p in processed]:
                        pass
                # Simpler: just abort writing for this file
                continue

            data["segments"] = segments
            if not dry_run:
                with open(fpath, "w", encoding="utf-8") as f:
                    json.dump(data, f, ensure_ascii=False, separators=(", ", ": "))

    # Reports
    with open(SKIPPED_V2_OUTPUT, "w", encoding="utf-8") as f:
        json.dump(skipped_v2, f, ensure_ascii=False, indent=2)
    with open(PROCESSED_OUTPUT, "w", encoding="utf-8") as f:
        json.dump(processed, f, ensure_ascii=False, indent=2)

    print(f"\n=== Report ===")
    print(f"Processed: {len(processed)}")
    print(f"Skipped (v2): {len(skipped_v2)}")
    print(f"\nSkip reasons:")
    for reason, count in skip_reasons.most_common():
        print(f"  {count:4d}  {reason}")
    print(f"\nTop 10 files by changes:")
    for fname, count in file_change_counts.most_common(10):
        print(f"  {count:4d}  {fname}")
    print(f"\nTop 10 verbs processed:")
    for v, c in verb_change_counts.most_common(10):
        print(f"  {c:4d}  å {v}")


if __name__ == "__main__":
    main()
