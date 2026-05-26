#!/usr/bin/env python3
"""
Morphology enricher for NorskApp glosses.json + content/*.json.

Phase 1: builds `forms` paradigm for each gloss entry (verb/noun/adj/adv).
Phase 2: writes `form` (key into paradigm) and `forms` (copy) on every
         type:"no" segment whose word matches a known paradigm form.

Handles both English-style POS tags ("verb", "noun", "adj", "adv")
and Russian-style POS tags ("глаг.", "сущ.", "прил.", "нареч.", "прич.").

Run:
    python -X utf8 scripts/enrich_morphology.py
"""
import json
import os
import re
import sys
from collections import defaultdict
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
GLOSSES = ROOT / "public" / "glosses.json"
VOCAB = ROOT / "public" / "vocabulary.json"
CONTENT_DIR = ROOT / "public" / "content"
REVIEW_OUT = ROOT / "scripts" / "_morphology_review.json"
REPORT_OUT = ROOT / "scripts" / "_morphology_report.json"

# -----------------------------------------------------------------------------
# POS normalisation
# -----------------------------------------------------------------------------

VERB_POS = {"verb", "глаг.", "глаг./сущ.", "сущ./глаг.", "глаг./прил.",
            "прил./глаг.", "verb/noun", "noun/verb", "прич./глаг.",
            "имя/глаг.", "прич."}
NOUN_POS = {"noun", "сущ.", "сущ./глаг.", "глаг./сущ.", "сущ./прил.",
            "прил./сущ.", "noun/adj", "adj/noun", "noun/verb",
            "verb/noun", "сущ./прич."}
ADJ_POS  = {"adj", "прил.", "прил./нареч.", "нареч./прил.", "прил./прич.",
            "прил./сущ.", "сущ./прил.", "прил./глаг.", "глаг./прил.",
            "adj/adv", "adj/noun", "noun/adj"}
ADV_POS  = {"adv", "нареч.", "прил./нареч.", "нареч./прил.", "adj/adv"}

def pos_kind(pos: str) -> str:
    """Return primary category: verb / noun / adj / adv / other."""
    if pos in VERB_POS:
        return "verb"
    if pos in NOUN_POS:
        return "noun"
    if pos in ADJ_POS:
        return "adj"
    if pos in ADV_POS:
        return "adv"
    return "other"

# -----------------------------------------------------------------------------
# Irregular verbs — manual mapping (most frequent ~80)
# Each: (infinitive_stem (без å), present, preterite, perfect_participle, imperative)
# perfect rendered as "har <participle>"; imperative may be None to use stem.
# -----------------------------------------------------------------------------

IRREGULAR_VERBS = {
    # core
    "være":   ("være",  "er",     "var",     "vært",    "vær"),
    "ha":     ("ha",    "har",    "hadde",   "hatt",    "ha"),
    "gå":     ("gå",    "går",    "gikk",    "gått",    "gå"),
    "se":     ("se",    "ser",    "så",      "sett",    "se"),
    "ta":     ("ta",    "tar",    "tok",     "tatt",    "ta"),
    "få":     ("få",    "får",    "fikk",    "fått",    "få"),
    "gi":     ("gi",    "gir",    "ga",      "gitt",    "gi"),
    "bli":    ("bli",   "blir",   "ble",     "blitt",   "bli"),
    "komme":  ("komme", "kommer", "kom",     "kommet",  "kom"),
    "finne":  ("finne", "finner", "fant",    "funnet",  "finn"),
    "sitte":  ("sitte", "sitter", "satt",    "sittet",  "sitt"),
    "stå":    ("stå",   "står",   "sto",     "stått",   "stå"),
    "vite":   ("vite",  "vet",    "visste",  "visst",   "vit"),
    "kunne":  ("kunne", "kan",    "kunne",   "kunnet",  None),
    "skulle": ("skulle","skal",   "skulle",  "skullet", None),
    "måtte":  ("måtte", "må",     "måtte",   "måttet",  None),
    "ville":  ("ville", "vil",    "ville",   "villet",  None),
    "burde":  ("burde", "bør",    "burde",   "burdet",  None),
    "drikke": ("drikke","drikker","drakk",   "drukket", "drikk"),
    "sove":   ("sove",  "sover",  "sov",     "sovet",   "sov"),
    "selge":  ("selge", "selger", "solgte",  "solgt",   "selg"),
    "spørre": ("spørre","spør",   "spurte",  "spurt",   "spør"),
    "synge":  ("synge", "synger", "sang",    "sunget",  "syng"),
    "skrive": ("skrive","skriver","skrev",   "skrevet", "skriv"),
    "lese":   ("lese",  "leser",  "leste",   "lest",    "les"),
    "gjøre":  ("gjøre", "gjør",   "gjorde",  "gjort",   "gjør"),
    "si":     ("si",    "sier",   "sa",      "sagt",    "si"),
    "legge":  ("legge", "legger", "la",      "lagt",    "legg"),
    "ligge":  ("ligge", "ligger", "lå",      "ligget",  "ligg"),
    "synes":  ("synes", "synes",  "syntes",  "syntes",  "synes"),
    "treffe": ("treffe","treffer","traff",   "truffet", "treff"),
    "vinne":  ("vinne", "vinner", "vant",    "vunnet",  "vinn"),
    "drive":  ("drive", "driver", "drev",    "drevet",  "driv"),
    "fly":    ("fly",   "flyr",   "fløy",    "fløyet",  "fly"),
    "dra":    ("dra",   "drar",   "dro",     "dratt",   "dra"),
    "by":     ("by",    "byr",    "bød",     "budt",    "by"),
    "be":     ("be",    "ber",    "ba",      "bedt",    "be"),
    "binde":  ("binde", "binder", "bandt",   "bundet",  "bind"),
    "briste": ("briste","brister","brast",   "brustet", "brist"),
    "brenne": ("brenne","brenner","brant",   "brent",   "brenn"),
    "falle":  ("falle", "faller", "falt",    "falt",    "fall"),
    "henge":  ("henge", "henger", "hang",    "hengt",   "heng"),
    "hete":   ("hete",  "heter",  "het",     "hett",    "het"),
    "hjelpe": ("hjelpe","hjelper","hjalp",   "hjulpet", "hjelp"),
    "holde":  ("holde", "holder", "holdt",   "holdt",   "hold"),
    "late":   ("late",  "later",  "lot",     "latt",    "lat"),
    "le":     ("le",    "ler",    "lo",      "ledd",    "le"),
    "løpe":   ("løpe",  "løper",  "løp",     "løpt",    "løp"),
    "nyte":   ("nyte",  "nyter",  "nøt",     "nytt",    "nyt"),
    "rekke":  ("rekke", "rekker", "rakk",    "rukket",  "rekk"),
    "ringe":  ("ringe", "ringer", "ringte",  "ringt",   "ring"),
    "rive":   ("rive",  "river",  "rev",     "revet",   "riv"),
    "skjære": ("skjære","skjærer","skar",    "skåret",  "skjær"),
    "skyte":  ("skyte", "skyter", "skjøt",   "skutt",   "skyt"),
    "skyve":  ("skyve", "skyver", "skjøv",   "skjøvet", "skyv"),
    "slå":    ("slå",   "slår",   "slo",     "slått",   "slå"),
    "slippe": ("slippe","slipper","slapp",   "sluppet", "slipp"),
    "smelle": ("smelle","smeller","smalt",   "smelt",   "smell"),
    "sove":   ("sove",  "sover",  "sov",     "sovet",   "sov"),
    "springe":("springe","springer","sprang","sprunget","spring"),
    "stikke": ("stikke","stikker","stakk",   "stukket", "stikk"),
    "stjele": ("stjele","stjeler","stjal",   "stjålet", "stjel"),
    "strekke":("strekke","strekker","strakk","strukket","strekk"),
    "stryke": ("stryke","stryker","strøk",   "strøket", "stryk"),
    "svømme": ("svømme","svømmer","svømte",  "svømt",   "svøm"),
    "tre":    ("tre",   "trer",   "trådte",  "trådt",   "tre"),
    "trives": ("trives","trives", "trivdes", "trivdes", "trives"),
    "vokse":  ("vokse", "vokser", "vokste",  "vokst",   "voks"),
    "vri":    ("vri",   "vrir",   "vred",    "vridd",   "vri"),
    "gripe":  ("gripe", "griper", "grep",    "grepet",  "grip"),
    "skinne": ("skinne","skinner","skinte",  "skint",   "skinn"),
    "smake":  ("smake", "smaker", "smakte",  "smakt",   "smak"),
    "synke":  ("synke", "synker", "sank",    "sunket",  "synk"),
    "tørre":  ("tørre", "tør",    "torde",   "tort",    None),
    "tigge":  ("tigge", "tigger", "tigget",  "tigget",  "tigg"),
}

# Reverse lookup: any form -> infinitive
IRREG_FORM_INDEX = {}
for inf, tup in IRREGULAR_VERBS.items():
    stem, pres, pret, part, imp = tup
    for f in (stem, pres, pret, part):
        IRREG_FORM_INDEX.setdefault(f, inf)
    if imp:
        IRREG_FORM_INDEX.setdefault(imp, inf)

# -----------------------------------------------------------------------------
# Irregular nouns (neuter & gender exceptions)
# -----------------------------------------------------------------------------

IRREGULAR_NOUNS = {
    # word: (gender, sg_indef, sg_def, pl_indef, pl_def)
    "barn":    ("n", "barn",    "barnet",   "barn",     "barna"),
    "mann":    ("m", "mann",    "mannen",   "menn",     "mennene"),
    "far":     ("m", "far",     "faren",    "fedre",    "fedrene"),
    "bror":    ("m", "bror",    "broren",   "brødre",   "brødrene"),
    "mor":     ("f", "mor",     "moren",    "mødre",    "mødrene"),
    "datter":  ("f", "datter",  "datteren", "døtre",    "døtrene"),
    "søster":  ("f", "søster",  "søsteren", "søstre",   "søstrene"),
    "bok":     ("f", "bok",     "boka",     "bøker",    "bøkene"),
    "hånd":    ("f", "hånd",    "hånda",    "hender",   "hendene"),
    "fot":     ("m", "fot",     "foten",    "føtter",   "føttene"),
    "natt":    ("f", "natt",    "natta",    "netter",   "nettene"),
    "tann":    ("f", "tann",    "tanna",    "tenner",   "tennene"),
    "tre":     ("n", "tre",     "treet",    "trær",     "trærne"),
    "øye":     ("n", "øye",     "øyet",     "øyne",     "øynene"),
    "menneske":("n", "menneske","mennesket","mennesker","menneskene"),
    "hus":     ("n", "hus",     "huset",    "hus",      "husene"),
    "år":      ("n", "år",      "året",     "år",       "årene"),
    "land":    ("n", "land",    "landet",   "land",     "landene"),
    "barn":    ("n", "barn",    "barnet",   "barn",     "barna"),
    "fjell":   ("n", "fjell",   "fjellet",  "fjell",    "fjellene"),
    "sko":     ("m", "sko",     "skoen",    "sko",      "skoene"),
    "ski":     ("f", "ski",     "skia",     "ski",      "skiene"),
    "lærer":   ("m", "lærer",   "læreren",  "lærere",   "lærerne"),
    "søsken":  ("n", "søsken",  "søskenet", "søsken",   "søsknene"),
    "ku":      ("f", "ku",      "kua",      "kyr",      "kyrne"),
    "gjest":   ("m", "gjest",   "gjesten",  "gjester",  "gjestene"),
}
IRREG_NOUN_FORM_INDEX = {}
for base, tup in IRREGULAR_NOUNS.items():
    g, si, sd, pi, pd = tup
    for f in (si, sd, pi, pd):
        IRREG_NOUN_FORM_INDEX.setdefault(f, base)

# -----------------------------------------------------------------------------
# Irregular adjectives
# -----------------------------------------------------------------------------

IRREGULAR_ADJS = {
    # base: (mf, n, pl, def, comp, sup)
    "god":     ("god",    "godt",    "gode",     "gode",    "bedre",   "best"),
    "gammel":  ("gammel", "gammelt", "gamle",    "gamle",   "eldre",   "eldst"),
    "ung":     ("ung",    "ungt",    "unge",     "unge",    "yngre",   "yngst"),
    "stor":    ("stor",   "stort",   "store",    "store",   "større",  "størst"),
    "liten":   ("liten",  "lite",    "små",      "lille",   "mindre",  "minst"),
    "mange":   ("mange",  "mange",   "mange",    "mange",   "flere",   "flest"),
    "mye":     ("mye",    "mye",     "mye",      "mye",     "mer",     "mest"),
    "lang":    ("lang",   "langt",   "lange",    "lange",   "lengre",  "lengst"),
    "tung":    ("tung",   "tungt",   "tunge",    "tunge",   "tyngre",  "tyngst"),
    "vond":    ("vond",   "vondt",   "vonde",    "vonde",   "verre",   "verst"),
    "ille":    ("ille",   "ille",    "ille",     "ille",    "verre",   "verst"),
    "få":      ("få",     "få",      "få",       "få",      "færre",   "færrest"),
    "egen":    ("egen",   "eget",    "egne",     "egne",    None,      None),
    "blå":     ("blå",    "blått",   "blå",      "blå",     "blåere",  "blåest"),
    "grå":     ("grå",    "grått",   "grå",      "grå",     "gråere",  "gråest"),
    "ny":      ("ny",     "nytt",    "nye",      "nye",     "nyere",   "nyest"),
    "fri":     ("fri",    "fritt",   "frie",     "frie",    "friere",  "friest"),
    "tro":     ("tro",    "trofast", "tro",      "tro",     None,      None),
}
IRREG_ADJ_FORM_INDEX = {}
for base, tup in IRREGULAR_ADJS.items():
    for f in tup:
        if f:
            IRREG_ADJ_FORM_INDEX.setdefault(f, base)

# -----------------------------------------------------------------------------
# Helpers
# -----------------------------------------------------------------------------

VOWELS = set("aeiouyæøåAEIOUYÆØÅ")

def strip_aa(text: str) -> str:
    """Remove leading 'å ' particle for verbs."""
    t = text.strip()
    if t.lower().startswith("å "):
        return t[2:].strip()
    return t

def split_article(text: str):
    """Return (article, base) if text starts with en/ei/et + space, else (None, text)."""
    t = text.strip()
    for art in ("en ", "ei ", "et "):
        if t.lower().startswith(art):
            return art.strip(), t[len(art):].strip()
    return None, t

# -----------------------------------------------------------------------------
# VERB paradigm builder
# -----------------------------------------------------------------------------

def detect_verb_class(infinitive: str):
    """
    Detect Norwegian verb conjugation class from infinitive form (no leading 'å').
    Returns one of: 'irregular', 'weak_1', 'weak_2', 'weak_3', 'weak_4'.
    Heuristic:
      - ends in vowel (not -e): weak_4 (bo, tro)
      - ends in -e + double consonant + e? no...
      - we use stem = infinitive without trailing -e
      - if stem ends in voiced consonant (l, n, m, r, v) or vowel diphthong before -e: weak_2 default
      - if stem ends in diphthong / long vowel: weak_3 candidate (leve, prøve)
      - if stem ends in -er- (er-verbs, latinate): weak_1 (kaste pattern)
    For safety, we default short consonant-cluster verbs to weak_2 (commonest),
    long stems (>2 syll, -ere) to weak_2 as well.
    """
    inf = infinitive
    if inf in IRREGULAR_VERBS:
        return "irregular"

    # ends in vowel (no final -e): weak_4
    if inf and inf[-1] in "aoåuiy":
        return "weak_4"

    # ends in -e: standard
    if inf.endswith("e"):
        stem = inf[:-1]
        # -ere verbs (latinate borrowings): weak_2 (informere/informerte)
        if stem.endswith("er"):
            return "weak_2"
        # Double liquid/nasal (ll, nn, mm): weak_2 with degemination
        # (spille/spilte, kjenne/kjente, brenne/brente)
        if len(stem) >= 2 and stem[-1] == stem[-2] and stem[-1] in "lnm":
            return "weak_2"
        # Double stop/fricative (kk, pp, tt, ff, ss, bb, dd, gg): weak_1
        # (snakke/snakket, hoppe/hoppet, jobbe/jobbet)
        if len(stem) >= 2 and stem[-1] == stem[-2] and stem[-1] in "kptfsbdg":
            return "weak_1"
        # Voiced cluster (ld, nd, rd, rg, rt, ng, mb): weak_2
        if len(stem) >= 2 and stem[-1] in "dgtbk" and stem[-2] in "lrnmg":
            return "weak_2"
        # Vowel + d (arbeide, leie, mate-style): treat as weak_1
        if len(stem) >= 2 and stem[-1] == "d" and stem[-2] in VOWELS:
            return "weak_1"
        # Other two-consonant stems (kaste, vaske, koste): mostly weak_1
        if len(stem) >= 2 and stem[-1] not in VOWELS and stem[-2] not in VOWELS:
            return "weak_1"
        # Single consonant after vowel: weak_2 default (spise, bruke, kjøpe)
        return "weak_2"

    # no trailing -e (already irreg likely) — fallback
    return "weak_2"


def build_verb_forms(infinitive: str):
    """
    Build paradigm. Returns dict or None.
    Infinitive must NOT have leading 'å'.
    """
    inf = infinitive.strip()
    if not inf or len(inf) < 2:
        return None, "too_short"

    if inf in IRREGULAR_VERBS:
        stem, pres, pret, part, imp = IRREGULAR_VERBS[inf]
        return {
            "infinitive": f"å {stem}",
            "present":    pres,
            "preterite":  pret,
            "perfect":    f"har {part}",
            "imperative": imp if imp else stem,
        }, "irregular"

    # Prefixed irregulars (oppholde, beholde, opprettholde — all share holde
    # paradigm); detect by suffix.
    for irr_root in ("holde", "stå", "gå", "komme", "finne", "ta", "se", "være",
                     "ha", "få", "gi", "bli", "drikke", "skrive", "lese", "selge",
                     "sove", "vinne", "synge"):
        if inf.endswith(irr_root) and inf != irr_root and len(inf) > len(irr_root) + 1:
            stem, pres, pret, part, imp = IRREGULAR_VERBS[irr_root]
            prefix = inf[:-len(irr_root)]
            return {
                "infinitive": f"å {inf}",
                "present":    prefix + pres,
                "preterite":  prefix + pret,
                "perfect":    f"har {prefix}{part}",
                "imperative": (prefix + imp) if imp else (prefix + stem),
            }, "irregular_prefixed"

    cls = detect_verb_class(inf)

    # Base stem
    if inf.endswith("e"):
        stem = inf[:-1]
    else:
        stem = inf  # weak_4 verbs like bo, tro, bli (but bli is irregular)

    if cls == "weak_1":
        return {
            "infinitive": f"å {inf}",
            "present":    stem + "er",
            "preterite":  stem + "et",
            "perfect":    f"har {stem}et",
            "imperative": stem,
        }, cls

    if cls == "weak_2":
        # Degemination: stem ending in double liquid/nasal (ll, nn, mm) drops
        # one consonant before -te/-t (spille → spilte/spilt, kjenne → kjente).
        pret_stem = stem
        imp_stem = stem
        if len(stem) >= 2 and stem[-1] == stem[-2] and stem[-1] in "lnm":
            pret_stem = stem[:-1]
        return {
            "infinitive": f"å {inf}",
            "present":    stem + "er",
            "preterite":  pret_stem + "te",
            "perfect":    f"har {pret_stem}t",
            "imperative": imp_stem,
        }, cls

    if cls == "weak_3":
        return {
            "infinitive": f"å {inf}",
            "present":    stem + "er",
            "preterite":  stem + "de",
            "perfect":    f"har {stem}d",
            "imperative": stem,
        }, cls

    if cls == "weak_4":
        # vowel-final infinitive: bo/bor/bodde/har bodd
        return {
            "infinitive": f"å {inf}",
            "present":    inf + "r",
            "preterite":  inf + "dde",
            "perfect":    f"har {inf}dd",
            "imperative": inf,
        }, cls

    return None, "unknown"


# -----------------------------------------------------------------------------
# NOUN paradigm builder
# -----------------------------------------------------------------------------

def detect_gender(dict_field: str, key: str):
    """
    Detect gender from `dict` (which sometimes holds 'en bil' / 'et hus' / 'ei jente').
    Returns 'm' / 'f' / 'n' / None.
    """
    if dict_field:
        article, _ = split_article(dict_field)
        if article == "en":
            return "m"
        if article == "ei":
            return "f"
        if article == "et":
            return "n"
    # heuristics by ending
    base = key.lower()
    if base.endswith(("eri", "skap", "ment", "tek")):
        return "n"
    return "m"  # default


def build_noun_forms(base: str, gender: str):
    """
    Build noun paradigm.
    base = singular indefinite (no article), already lowercase Norwegian.
    """
    if not base or len(base) < 2:
        return None, "too_short"

    if base in IRREGULAR_NOUNS:
        g, si, sd, pi, pd = IRREGULAR_NOUNS[base]
        return {
            "sg_indef": si,
            "sg_def":   sd,
            "pl_indef": pi,
            "pl_def":   pd,
        }, "irregular"

    ends_e = base.endswith("e")
    ends_el = base.endswith("el") or base.endswith("en") or base.endswith("er")

    if gender == "n":
        # neuter
        if ends_e:
            sg_def = base + "t"
            pl_indef = base + "r"
            pl_def = base + "ne"
        else:
            sg_def = base + "et"
            # short neuters (1 syllable) often unchanged pl, but safer: +er
            if len(base) <= 4 and not any(v in base[1:] for v in "aeiouyæøå"[1:]):
                pl_indef = base
                pl_def = base + "ene"
            else:
                pl_indef = base + "er"
                pl_def = base + "ene"
        return {
            "sg_indef": base,
            "sg_def":   sg_def,
            "pl_indef": pl_indef,
            "pl_def":   pl_def,
        }, "regular_n"

    if gender == "f":
        # feminine — most modern texts treat as masculine, but keep -a option
        if ends_e:
            sg_def = base + "n"
        else:
            sg_def = base + "en"  # could be -a; pick -en (bokmål default)
        # plural
        if base.endswith("er") and len(base) > 3:
            # lærer / lærere
            pl_indef = base + "e"
            pl_def = base + "ne"
        elif ends_e:
            pl_indef = base + "r"
            pl_def = base + "ne"
        elif base.endswith("el") or base.endswith("en"):
            # syncope: gammel→gamle
            pl_indef = base[:-2] + base[-1] + "e"
            pl_def = pl_indef + "ne"
        else:
            pl_indef = base + "er"
            pl_def = base + "ene"
        return {
            "sg_indef": base,
            "sg_def":   sg_def,
            "pl_indef": pl_indef,
            "pl_def":   pl_def,
        }, "regular_f"

    # masculine default
    if ends_e:
        sg_def = base + "n"
        pl_indef = base + "r"
        pl_def = base + "ne"
    elif base.endswith("er") and len(base) > 3:
        # lærer / lærere / lærerne
        sg_def = base + "en"
        pl_indef = base + "e"
        pl_def = base + "ne"
    elif base.endswith("el") or base.endswith("en"):
        # syncope: nøkkel → nøkler
        sg_def = base + "en"
        pl_indef = base[:-2] + base[-1] + "er"
        pl_def = base[:-2] + base[-1] + "ene"
    else:
        sg_def = base + "en"
        pl_indef = base + "er"
        pl_def = base + "ene"

    return {
        "sg_indef": base,
        "sg_def":   sg_def,
        "pl_indef": pl_indef,
        "pl_def":   pl_def,
    }, "regular_m"


# -----------------------------------------------------------------------------
# ADJ paradigm builder
# -----------------------------------------------------------------------------

def build_adj_forms(base: str):
    """
    Build adjective paradigm: indef_m_f, indef_n, indef_pl, definite, comparative, superlative.
    `base` = positive indefinite m/f form.
    """
    if not base or len(base) < 2:
        return None, "too_short"

    if base in IRREGULAR_ADJS:
        mf, n, pl, df, cmp_, sup = IRREGULAR_ADJ_FORM(base)
        d = {
            "indef_m_f": mf,
            "indef_n": n,
            "indef_pl": pl,
            "definite": df,
        }
        if cmp_:
            d["comparative"] = cmp_
        if sup:
            d["superlative"] = sup
        return d, "irregular"

    # -- regular
    last = base[-1]
    last2 = base[-2:] if len(base) >= 2 else ""

    # Adjectives ending in -ig, -lig, -som, -et: don't add -t for neuter (just same form)
    if base.endswith(("ig", "lig", "som")):
        n_form = base + "t"  # actually -ig+t is fine in modern bokmål; keep simple
        # but standard: -ig/-lig take -t (viktig→viktig in n? No: viktig stays viktig).
        # Norwegian rule: -ig adjectives are uninflected in neuter (en viktig dag / et viktig år)
        n_form = base
    elif base.endswith("sk"):
        # nasjonal sk + t? -sk usually doesn't take -t
        n_form = base
    elif base.endswith("e") and len(base) >= 3:
        # ende-forms uninflected
        n_form = base
    elif last == "t":
        # already ends in -t: no change
        n_form = base
    elif last in VOWELS:
        # vowel + tt
        n_form = base + "tt"
    elif last2 in ("dd", "tt"):
        n_form = base
    else:
        n_form = base + "t"

    # plural / definite: +e (or -el/-en/-er → syncope)
    if base.endswith("e") and len(base) >= 3:
        pl_form = base  # already ends in -e
    elif base.endswith(("el", "en", "er")) and len(base) >= 4:
        # gammel → gamle
        pl_form = base[:-2] + base[-1] + "e"
    elif base.endswith("ig") or base.endswith("som"):
        pl_form = base + "e"
    else:
        pl_form = base + "e"

    # comparative / superlative: skip for -ende, -et adjectives or long latinate
    add_grades = True
    if base.endswith(("ende", "et")) or len(base) > 12:
        add_grades = False

    comp = sup = None
    if add_grades:
        # vowel-final base (få) → +ere? but irregular -- skip
        if base.endswith("e"):
            comp = base + "re"
            sup = base + "st"
        elif base.endswith(("el", "en", "er")) and len(base) >= 4:
            comp = base[:-2] + base[-1] + "ere"
            sup = base[:-2] + base[-1] + "est"
        else:
            comp = base + "ere"
            sup = base + "est"

    d = {
        "indef_m_f": base,
        "indef_n": n_form,
        "indef_pl": pl_form,
        "definite": pl_form,
    }
    if comp:
        d["comparative"] = comp
    if sup:
        d["superlative"] = sup
    return d, "regular_adj"


def IRREGULAR_ADJ_FORM(base):
    return IRREGULAR_ADJS[base]


# -----------------------------------------------------------------------------
# ADV with degrees (limited)
# -----------------------------------------------------------------------------

ADV_DEGREES = {
    "fort":    ("fort",   "fortere",  "fortest"),
    "gjerne":  ("gjerne", "heller",   "helst"),
    "godt":    ("godt",   "bedre",    "best"),
    "vondt":   ("vondt",  "verre",    "verst"),
    "lite":    ("lite",   "mindre",   "minst"),
    "mye":     ("mye",    "mer",      "mest"),
    "ofte":    ("ofte",   "oftere",   "oftest"),
    "sent":    ("sent",   "senere",   "senest"),
    "tidlig":  ("tidlig", "tidligere","tidligst"),
    "langt":   ("langt",  "lengre",   "lengst"),
    "nær":     ("nær",    "nærmere",  "nærmest"),
    "sakte":   ("sakte",  "saktere",  "saktest"),
}

def build_adv_forms(base):
    if base in ADV_DEGREES:
        pos, comp, sup = ADV_DEGREES[base]
        return {"positive": pos, "comparative": comp, "superlative": sup}, "irregular"
    return None, "no_degrees"


# -----------------------------------------------------------------------------
# Determine canonical (dictionary) Norwegian form for an entry
# -----------------------------------------------------------------------------

def canonical_verb(key: str, dict_field: str, translation: str = ""):
    """
    Choose infinitive (no leading å) for a verb entry.
    Russian-style entries put `å verb` in `dict` (Norwegian).
    English-style entries put Russian translation in `dict`. `translation` (the
    actual Russian word) carries the tense info that disambiguates whether the
    Norwegian key is infinitive / past / present.
    """
    # Russian-style: dict contains Norwegian "å verb"
    if dict_field:
        d = strip_aa(dict_field)
        # Make sure it doesn't look like a Russian translation
        if d and re.match(r"^[a-zæøåA-ZÆØÅ\-]+$", d):
            return d.lower()

    k = key.lower().strip()
    if k.startswith("å "):
        k = k[2:].strip()
    # Already infinitive heuristic
    if k in IRREGULAR_VERBS:
        return k
    if k in IRREG_FORM_INDEX:
        return IRREG_FORM_INDEX[k]

    # Use the Russian translation as a TENSE HINT.
    # Russian infinitive ends in -ть / -ти / -чь.
    # Russian past ends in -л / -ла / -ло / -ли.
    # Russian present 3sg ends in -т / -ет / -ит / -ует etc.
    # The `translation` field has the form-specific Russian word; `dict_field`
    # for English-style entries usually holds the dictionary Russian infinitive.
    tr_lower = (translation or "").strip().lower()
    is_past = bool(re.search(r"[вл][аои]?$", tr_lower))
    is_present = bool(re.search(r"(ет|ит|ёт|ает|яет|ует|уют|ают|ют|ит|ат|ят)$", tr_lower))
    is_inf_ru = tr_lower.endswith(("ть", "ти", "чь"))

    # ends -dde (weak_4 preterite) bodde→bo
    if k.endswith("dde") and len(k) > 3:
        return k[:-3]
    # ends -dd (perfect of weak_4) bodd→bo
    if k.endswith("dd") and len(k) > 2:
        return k[:-2]

    # If Russian hint says preterite/past:
    if is_past:
        if k.endswith("erte") and len(k) > 4:
            return k[:-2] + "e"  # absorberte → absorbere
        if k.endswith("te") and len(k) > 3:
            return k[:-2] + "e"
        if k.endswith("de") and len(k) > 3:
            return k[:-2] + "e"
        if k.endswith("et") and len(k) > 3:
            return k[:-2] + "e"
    # If Russian hint says present 3sg:
    if is_present:
        if k.endswith("er") and len(k) > 3:
            return k[:-2] + "e"
        if k.endswith("r") and len(k) > 1 and k[-2] in VOWELS:
            return k[:-1]  # bor → bo

    # If Russian hint is infinitive OR no hint: trust Norwegian form
    if is_inf_ru or not tr_lower:
        # ends with -e → looks like infinitive
        if k.endswith("e") and len(k) > 2:
            return k
        # ends in vowel → weak_4 infinitive
        if k and k[-1] in "aoåuiy":
            return k

    # ends 'er' → present tense → strip
    if k.endswith("er") and len(k) > 3:
        return k[:-2] + "e"
    # ends -et → past/perfect of weak_1 → try stem+e
    if k.endswith("et") and len(k) > 3:
        return k[:-2] + "e"
    # ends -te / -de → preterite of weak_2 / weak_3
    if k.endswith(("te", "de")) and len(k) > 3:
        return k[:-2] + "e"
    # default: key is infinitive
    if k.endswith("e"):
        return k
    if k and k[-1] in "aoåuiy":
        return k
    return k


def canonical_noun(key: str, dict_field: str):
    """
    Returns (base, gender). base = singular indefinite.
    Russian-style: dict_field contains "en bil" / "et hus" / "ei jente".
    English-style: dict_field is Russian, use key.
    """
    gender = None
    if dict_field:
        article, base = split_article(dict_field)
        if article:
            gender = {"en": "m", "ei": "f", "et": "n"}[article]
            return base.lower(), gender

    k = key.lower()
    # If key already known irregular noun
    if k in IRREGULAR_NOUNS:
        return k, IRREGULAR_NOUNS[k][0]
    # Reverse irregular noun forms
    if k in IRREG_NOUN_FORM_INDEX:
        base = IRREG_NOUN_FORM_INDEX[k]
        return base, IRREGULAR_NOUNS[base][0]

    # Strip plural/def endings as heuristics
    # -ene plural definite
    if k.endswith("ene") and len(k) > 5:
        return k[:-3], "m"
    # -er plural indef
    if k.endswith("er") and len(k) > 4:
        return k[:-2], "m"
    # -et neuter sg definite
    if k.endswith("et") and len(k) > 3:
        return k[:-2], "n"
    # -en m sg definite
    if k.endswith("en") and len(k) > 3:
        return k[:-2], "m"
    return k, gender or "m"


def canonical_adj(key: str, dict_field: str):
    """Return positive indefinite m/f form."""
    if dict_field and re.match(r"^[a-zæøåA-ZÆØÅ\-]+$", dict_field):
        return dict_field.lower()
    k = key.lower()
    if k in IRREGULAR_ADJS:
        return k
    if k in IRREG_ADJ_FORM_INDEX:
        return IRREG_ADJ_FORM_INDEX[k]
    # comparative/superlative → strip
    if k.endswith("ere") and len(k) > 4:
        return k[:-3]
    if k.endswith("est") and len(k) > 4:
        return k[:-3]
    # plural/definite -e → strip
    if k.endswith("e") and len(k) > 3:
        return k[:-1]
    # neuter -t → strip if base would still be plausible
    if k.endswith("t") and len(k) > 3:
        cand = k[:-1]
        if not cand.endswith(("ig", "lig")):  # don't strip from -igt actually that's fine
            return cand
    return k


# -----------------------------------------------------------------------------
# Main enrichment
# -----------------------------------------------------------------------------

def main():
    print("Loading glosses…", file=sys.stderr)
    with open(GLOSSES, encoding="utf-8") as f:
        glosses = json.load(f)

    stats = defaultdict(int)
    review = []

    # Cache built paradigms keyed by canonical base form so we don't recompute.
    paradigm_cache = {}  # ("verb", "spille") -> forms dict

    enriched_keys = []

    # Pre-pass: Build a reverse index for verbs grouped by Russian dict.
    # For English-style verb entries, `dict` is the Russian infinitive
    # (e.g. "играть"). For the corresponding *Norwegian* infinitive entry
    # (e.g. key="spille"), `dict` is often empty but `translation` IS the
    # Russian infinitive. We group by either side so a Norwegian-infinitive
    # entry can be picked as canonical.
    verb_group_by_ru_dict = defaultdict(list)  # ru_dict -> [(key, entry)]
    for k, e in glosses.items():
        if not isinstance(e, dict):
            continue
        if pos_kind(e.get("pos", "")) != "verb":
            continue
        d = (e.get("dict") or "").strip().lower()
        tr = (e.get("translation") or "").strip().lower()
        if d and re.search(r"[а-яё]", d):
            verb_group_by_ru_dict[d].append((k, e))
        elif not d and tr.endswith(("ть", "ти", "чь")):
            verb_group_by_ru_dict[tr].append((k, e))

    # Choose canonical Norwegian infinitive per group.
    verb_canonical_per_group = {}  # ru_dict -> canonical_norsk
    for ru_dict, members in verb_group_by_ru_dict.items():
        # 1) Prefer the entry whose translation == ru_dict (= Russian infinitive)
        #    AND key looks like an infinitive (ends in -e or vowel).
        infinitive_member = None
        for k, e in members:
            tr = (e.get("translation") or "").strip().lower()
            if tr == ru_dict and (k.endswith("e") or (k and k[-1] in "aoåuiy")):
                infinitive_member = k
                break
        # 2) Any member whose translation == ru_dict (might not end in -e but
        #    e.g. modal verbs like "skal" / "vil" — these are infinitives in
        #    those special cases).
        if infinitive_member is None:
            for k, e in members:
                tr = (e.get("translation") or "").strip().lower()
                if tr == ru_dict:
                    infinitive_member = k
                    break
        # 3) Try to derive infinitive from any inflected member using its
        #    translation tense hint — useful when the gloss only has a
        #    past/present form (e.g. only "absorberte" exists, not "absorbere").
        if infinitive_member is None:
            for k, e in members:
                cand_inf = canonical_verb(
                    k, e.get("dict", "") or "", e.get("translation", "") or ""
                )
                if cand_inf and (cand_inf.endswith("e") or (cand_inf and cand_inf[-1] in "aoåuiy")):
                    infinitive_member = cand_inf
                    break
        # 4) Last resort: pick any infinitive-looking key
        if infinitive_member is None:
            cands = [k for k, _ in members if k.endswith("e") or (k and k[-1] in "aoåuiy")]
            if cands:
                infinitive_member = min(cands, key=len)
        if infinitive_member is None:
            infinitive_member = members[0][0]
        verb_canonical_per_group[ru_dict] = infinitive_member.lower()

    for key, entry in glosses.items():
        if not isinstance(entry, dict):
            continue
        pos = entry.get("pos", "")
        kind = pos_kind(pos)
        if kind == "other":
            continue
        # skip proper names — pos == "" already filtered out
        # skip very short
        if len(key.strip()) < 2:
            stats["skipped_short"] += 1
            continue
        # skip phrases
        if pos == "phrase":
            continue
        # skip entries whose key looks like a phrase (contains space)
        if " " in key.strip() and not key.strip().lower().startswith("å "):
            stats[f"skipped_phrase_{kind}"] += 1
            continue

        dict_field = entry.get("dict", "")

        try:
            if kind == "verb":
                # Prefer the canonical infinitive from the Russian-dict group.
                # English-style: dict = Russian infinitive.
                # Norwegian-infinitive entries: dict empty, translation = Russian inf.
                ru_dict_low = (dict_field or "").strip().lower()
                tr_low = (entry.get("translation") or "").strip().lower()
                base = None
                # 1) Russian-style entry: dict is Norwegian (e.g. "å spille", "være")
                if ru_dict_low and re.match(r"^[a-zæøåA-ZÆØÅ\- ]+$", ru_dict_low):
                    base = strip_aa(ru_dict_low).strip()
                # 2) English-style entry: dict is Russian infinitive → use group
                elif ru_dict_low and ru_dict_low in verb_canonical_per_group:
                    base = verb_canonical_per_group[ru_dict_low]
                # 3) Norwegian-infinitive entry with empty dict but translation
                #    being a Russian infinitive → no need to redirect; use the
                #    key itself if it ends in -e/vowel.
                elif tr_low.endswith(("ть", "ти", "чь")):
                    k_low = key.lower().strip()
                    if k_low.startswith("å "):
                        k_low = k_low[2:].strip()
                    if k_low.endswith("e") or (k_low and k_low[-1] in "aoåuiy"):
                        base = k_low
                if not base:
                    base = canonical_verb(key, dict_field, entry.get("translation", ""))
                # If base is itself a non-infinitive form of an irregular verb,
                # normalise to infinitive
                if base in IRREG_FORM_INDEX and base not in IRREGULAR_VERBS:
                    base = IRREG_FORM_INDEX[base]
                cache_key = ("verb", base)
                if cache_key not in paradigm_cache:
                    forms, cls = build_verb_forms(base)
                    paradigm_cache[cache_key] = (forms, cls)
                forms, cls = paradigm_cache[cache_key]
                if forms is None:
                    review.append({"key": key, "pos": pos, "reason": cls})
                    stats["skipped_verb"] += 1
                    continue
                entry["forms"] = forms
                stats["enriched_verb"] += 1
                stats[f"verb_{cls}"] += 1
                enriched_keys.append((key, "verb", cls))
            elif kind == "noun":
                base, gender = canonical_noun(key, dict_field)
                cache_key = ("noun", base, gender)
                if cache_key not in paradigm_cache:
                    forms, cls = build_noun_forms(base, gender)
                    paradigm_cache[cache_key] = (forms, cls)
                forms, cls = paradigm_cache[cache_key]
                if forms is None:
                    review.append({"key": key, "pos": pos, "reason": cls})
                    stats["skipped_noun"] += 1
                    continue
                entry["forms"] = forms
                if "gender" not in entry:
                    entry["gender"] = gender
                stats["enriched_noun"] += 1
                stats[f"noun_{cls}"] += 1
                enriched_keys.append((key, "noun", cls))
            elif kind == "adj":
                base = canonical_adj(key, dict_field)
                cache_key = ("adj", base)
                if cache_key not in paradigm_cache:
                    forms, cls = build_adj_forms(base)
                    paradigm_cache[cache_key] = (forms, cls)
                forms, cls = paradigm_cache[cache_key]
                if forms is None:
                    review.append({"key": key, "pos": pos, "reason": cls})
                    stats["skipped_adj"] += 1
                    continue
                entry["forms"] = forms
                stats["enriched_adj"] += 1
                stats[f"adj_{cls}"] += 1
                enriched_keys.append((key, "adj", cls))
            elif kind == "adv":
                base = key.lower().strip()
                forms, cls = build_adv_forms(base)
                if forms is None:
                    # adverbs without degrees: skip silently
                    stats["adv_no_degrees"] += 1
                    continue
                entry["forms"] = forms
                stats["enriched_adv"] += 1
                stats[f"adv_{cls}"] += 1
                enriched_keys.append((key, "adv", cls))
        except Exception as e:
            review.append({"key": key, "pos": pos, "reason": f"exception: {e}"})
            stats["exception"] += 1

    print("Glosses enrichment stats:", dict(stats), file=sys.stderr)

    # Save updated glosses
    with open(GLOSSES, "w", encoding="utf-8") as f:
        json.dump(glosses, f, ensure_ascii=False, indent=2)

    # ---- Phase 2: tag segments ---------------------------------------------
    print("Tagging segments…", file=sys.stderr)

    # Build a lookup index: (lowercase form) -> list of (glossKey, formKey)
    # Prefer the entry whose key matches form exactly; otherwise use dict-canonical entry.
    form_index = defaultdict(list)
    for gk, entry in glosses.items():
        if not isinstance(entry, dict):
            continue
        forms = entry.get("forms")
        if not forms:
            continue
        for fk, fv in forms.items():
            if isinstance(fv, str):
                # remove "har " / "å " prefixes for matching
                norm = fv.lower()
                form_index[norm].append((gk, fk))
                if norm.startswith("har "):
                    form_index[norm[4:]].append((gk, fk))
                if norm.startswith("å "):
                    form_index[norm[2:]].append((gk, fk))

    seg_stats = defaultdict(int)
    seg_files_changed = 0

    for cfile in CONTENT_DIR.glob("*.json"):
        try:
            with open(cfile, encoding="utf-8") as f:
                doc = json.load(f)
        except Exception as e:
            print(f"  skip {cfile.name}: {e}", file=sys.stderr)
            continue
        segments = doc.get("segments")
        if not isinstance(segments, list):
            continue
        changed = False
        for seg in segments:
            if not isinstance(seg, dict):
                continue
            if seg.get("type") != "no":
                continue
            pos = seg.get("pos", "")
            kind = pos_kind(pos)
            if kind == "other":
                continue
            text = seg.get("text", "").strip()
            if not text:
                continue
            tnorm = text.lower()
            # strip leading å for verbs
            if tnorm.startswith("å "):
                tnorm = tnorm[2:]
            if tnorm.startswith("har "):
                tnorm = tnorm[4:]
            # Choose entry: prefer key == text (lowercase) if it has forms
            chosen_entry = None
            chosen_form_key = None
            primary_text = seg.get("text", "").strip().lower()
            if primary_text.startswith("å "):
                primary_text = primary_text[2:]
            # 1) direct match: gloss key == lowercased text, entry has forms
            #    AND POS kind matches segment kind.
            ge = glosses.get(primary_text)
            if (isinstance(ge, dict)
                    and ge.get("forms")
                    and pos_kind(ge.get("pos", "")) == kind):
                # find form value
                for fk, fv in ge["forms"].items():
                    if isinstance(fv, str) and (
                        fv.lower() == primary_text
                        or fv.lower() == f"å {primary_text}"
                        or fv.lower() == f"har {primary_text}"
                    ):
                        chosen_entry = ge
                        chosen_form_key = fk
                        break
                # If text didn't appear as a form value (entry's own paradigm),
                # still tag with paradigm — but without form key
                if not chosen_form_key:
                    chosen_entry = ge

            # 2) fallback: search form_index — only accept entries whose POS
            #    kind matches the segment's kind (avoid noun→verb collisions).
            if not chosen_entry:
                for gk, fk in form_index.get(primary_text, []):
                    cand_entry = glosses.get(gk)
                    if not isinstance(cand_entry, dict):
                        continue
                    if pos_kind(cand_entry.get("pos", "")) != kind:
                        continue
                    chosen_entry = cand_entry
                    chosen_form_key = fk
                    break

            # Same-key direct hit but mismatched POS — reject
            if chosen_entry and pos_kind(chosen_entry.get("pos", "")) != kind:
                chosen_entry = None
                chosen_form_key = None

            built_forms = None
            # 3) Last fallback: build paradigm directly from segment data
            #    (segment word has no matching gloss entry — common for inflected
            #    forms like `vannet`, `sekken`, `stien`).
            if not chosen_entry or not chosen_entry.get("forms"):
                candidates_built = []
                if kind == "verb":
                    # try multiple infinitive candidates
                    bases = set()
                    if primary_text in IRREG_FORM_INDEX:
                        bases.add(IRREG_FORM_INDEX[primary_text])
                    bases.add(canonical_verb(primary_text, "", seg.get("translation", "")))
                    # explicit candidates
                    if primary_text.endswith("er") and len(primary_text) > 3:
                        bases.add(primary_text[:-2] + "e")
                        bases.add(primary_text[:-1])  # for short verbs like bor->bo
                    if primary_text.endswith(("te","de")) and len(primary_text) > 3:
                        bases.add(primary_text[:-2] + "e")
                    if primary_text.endswith("et") and len(primary_text) > 3:
                        bases.add(primary_text[:-2] + "e")
                    if primary_text.endswith("t") and len(primary_text) > 2:
                        bases.add(primary_text[:-1] + "e")
                    for b in bases:
                        f, c = build_verb_forms(b)
                        if f:
                            candidates_built.append((b, "verb", f, c))
                elif kind == "noun":
                    bases_genders = set()
                    if primary_text in IRREG_NOUN_FORM_INDEX:
                        b = IRREG_NOUN_FORM_INDEX[primary_text]
                        bases_genders.add((b, IRREGULAR_NOUNS[b][0]))
                    # try common stems × all 3 genders
                    stems = {primary_text}
                    pt = primary_text
                    # plural definite
                    if pt.endswith("ene") and len(pt) > 4:
                        stems.add(pt[:-3])
                        stems.add(pt[:-3] + "e")
                    # plural indef -er
                    if pt.endswith("er") and len(pt) > 3:
                        stems.add(pt[:-2])
                        stems.add(pt[:-1])  # singular base for -e nouns (jenter->jente)
                    # sg def -et (neuter)
                    if pt.endswith("et") and len(pt) > 3:
                        stems.add(pt[:-2])
                        stems.add(pt[:-1])
                    # sg def -en
                    if pt.endswith("en") and len(pt) > 3:
                        stems.add(pt[:-2])
                        stems.add(pt[:-1])
                    # sg def -a (feminine)
                    if pt.endswith("a") and len(pt) > 2:
                        stems.add(pt[:-1])
                    # plural -a (some neuter: barna)
                    # already handled by irregulars
                    for s in stems:
                        if not s:
                            continue
                        for g in ("m", "n", "f"):
                            bases_genders.add((s, g))
                    for b, g in bases_genders:
                        f, c = build_noun_forms(b, g)
                        if f:
                            candidates_built.append((b, "noun", f, c))
                elif kind == "adj":
                    pt = primary_text
                    bases = {pt}
                    if pt.endswith("est") and len(pt) > 4: bases.add(pt[:-3])
                    if pt.endswith("ere") and len(pt) > 4: bases.add(pt[:-3])
                    if pt.endswith("e") and len(pt) > 2: bases.add(pt[:-1])
                    if pt.endswith("t") and len(pt) > 2: bases.add(pt[:-1])
                    if pt.endswith("tt") and len(pt) > 3: bases.add(pt[:-2])
                    for b in bases:
                        f, c = build_adj_forms(b)
                        if f:
                            candidates_built.append((b, "adj", f, c))
                elif kind == "adv":
                    f, c = build_adv_forms(primary_text)
                    if f:
                        candidates_built.append((primary_text, "adv", f, c))

                # pick the candidate whose paradigm actually contains primary_text
                for b, k_, f, c in candidates_built:
                    for fk, fv in f.items():
                        if isinstance(fv, str):
                            low = fv.lower()
                            if low == primary_text or low == f"å {primary_text}" or low == f"har {primary_text}":
                                built_forms = f
                                chosen_form_key = fk
                                break
                    if built_forms:
                        break

            # 4) Apply: prefer gloss entry's forms, else use built_forms
            forms_to_attach = None
            if chosen_entry and chosen_entry.get("forms"):
                forms_to_attach = chosen_entry["forms"]
            elif built_forms:
                forms_to_attach = built_forms

            if forms_to_attach:
                if chosen_form_key and "form" not in seg:
                    seg["form"] = chosen_form_key
                    changed = True
                    seg_stats[f"form_set_{kind}"] += 1
                # always attach the paradigm copy
                if "forms" not in seg:
                    seg["forms"] = dict(forms_to_attach)
                    changed = True
                    seg_stats[f"forms_set_{kind}"] += 1
        if changed:
            with open(cfile, "w", encoding="utf-8") as f:
                json.dump(doc, f, ensure_ascii=False)
            seg_files_changed += 1

    print("Segment tagging stats:", dict(seg_stats), file=sys.stderr)
    print(f"Files changed: {seg_files_changed}", file=sys.stderr)

    # Sanity scan of produced paradigms — record suspicious ones to review.
    for k, e in glosses.items():
        if not isinstance(e, dict):
            continue
        forms = e.get("forms")
        if not forms:
            continue
        pos = e.get("pos", "")
        kind = pos_kind(pos)
        if kind == "verb":
            inf = forms.get("infinitive", "")
            pret = forms.get("preterite", "")
            perf = forms.get("perfect", "")
            # Triple letter (e.g. "beståttt") → built from a participle
            if re.search(r"(.)\1{2,}", pret) or re.search(r"(.)\1{2,}", perf):
                review.append({"key": k, "pos": pos, "forms": forms,
                               "issue": "looks-like-non-infinitive-base"})
                continue
            # Suspect: infinitive ends in -t (participles like "diktert", "bøtelagt")
            inf_stem = inf.replace("å ", "").strip()
            if inf_stem.endswith(("ert", "lagt", "tt", "kt")) and len(inf_stem) > 4:
                review.append({"key": k, "pos": pos, "forms": forms,
                               "issue": "infinitive-looks-like-participle"})
                continue
            # `tte`-cluster on stem ending in tt (bytte → byttet correct;
            # bryte → brytte wrong because bryte is strong). Flag for review.
            stem_chk = inf_stem[:-1] if inf_stem.endswith("e") else inf_stem
            if pret.endswith("tte") and stem_chk.endswith("t") and not stem_chk.endswith("tt"):
                review.append({"key": k, "pos": pos, "forms": forms,
                               "issue": "tte-cluster-suspected-strong-verb"})
        elif kind == "noun":
            sg_def = forms.get("sg_def", "")
            sg_indef = forms.get("sg_indef", "")
            if sg_def == sg_indef and sg_indef:
                review.append({"key": k, "pos": pos, "forms": forms,
                               "issue": "sg_def-equals-sg_indef"})

    # Save review + report
    REVIEW_OUT.write_text(
        json.dumps(review, ensure_ascii=False, indent=2),
        encoding="utf-8",
    )
    REPORT_OUT.write_text(
        json.dumps({
            "gloss_stats": dict(stats),
            "segment_stats": dict(seg_stats),
            "files_changed": seg_files_changed,
            "sample_enriched": enriched_keys[:30],
        }, ensure_ascii=False, indent=2),
        encoding="utf-8",
    )
    print(f"Review entries: {len(review)} -> {REVIEW_OUT}", file=sys.stderr)


if __name__ == "__main__":
    main()
