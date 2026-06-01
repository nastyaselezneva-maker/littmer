# -*- coding: utf-8 -*-
"""v3 splitter: handles cases where Russian uses a verbal noun.
Reads decisions from scripts/_a_verb_v3_decisions.json (built by mk_decisions.py).
"""
import json, os, sys, io
from collections import Counter

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
CONTENT_DIR = os.path.join(ROOT, "public", "content")
SKIPPED_IN = os.path.join(ROOT, "scripts", "_a_verb_skipped_v2.json")
SKIPPED_OUT = os.path.join(ROOT, "scripts", "_a_verb_skipped_v3.json")
PROCESSED_OUT = os.path.join(ROOT, "scripts", "_a_verb_processed_v3.json")
DECISIONS_IN = os.path.join(ROOT, "scripts", "_a_verb_v3_decisions.json")

sys.path.insert(0, os.path.join(ROOT, "scripts"))
from split_a_verb import split_norwegian, find_russian_split, make_verb_segment

if __name__ == "__main__":
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8")
    sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding="utf-8")

VERB_FORMS = {
    "beskytte": {"infinitive": "å beskytte", "present": "beskytter", "preterite": "beskyttet", "perfect": "har beskyttet", "imperative": "beskytt"},
    "forvalte": {"infinitive": "å forvalte", "present": "forvalter", "preterite": "forvaltet", "perfect": "har forvaltet", "imperative": "forvalt"},
    "lage":     {"infinitive": "å lage", "present": "lager", "preterite": "lagde", "perfect": "har lagd", "imperative": "lag"},
    "bruke":    {"infinitive": "å bruke", "present": "bruker", "preterite": "brukte", "perfect": "har brukt", "imperative": "bruk"},
    "påvirke":  {"infinitive": "å påvirke", "present": "påvirker", "preterite": "påvirket", "perfect": "har påvirket", "imperative": "påvirk"},
    "kjøpe":    {"infinitive": "å kjøpe", "present": "kjøper", "preterite": "kjøpte", "perfect": "har kjøpt", "imperative": "kjøp"},
    "få":       {"infinitive": "å få", "present": "får", "preterite": "fikk", "perfect": "har fått", "imperative": "få"},
    "optimalisere": {"infinitive": "å optimalisere", "present": "optimaliserer", "preterite": "optimaliserte", "perfect": "har optimalisert", "imperative": "optimaliser"},
    "forhandle":{"infinitive": "å forhandle", "present": "forhandler", "preterite": "forhandlet", "perfect": "har forhandlet", "imperative": "forhandl"},
    "betale":   {"infinitive": "å betale", "present": "betaler", "preterite": "betalte", "perfect": "har betalt", "imperative": "betal"},
    "spore":    {"infinitive": "å spore", "present": "sporer", "preterite": "sporet", "perfect": "har sporet", "imperative": "spor"},
    "bestille": {"infinitive": "å bestille", "present": "bestiller", "preterite": "bestilte", "perfect": "har bestilt", "imperative": "bestill"},
    "bygge":    {"infinitive": "å bygge", "present": "bygger", "preterite": "bygde", "perfect": "har bygd", "imperative": "bygg"},
    "utvikle":  {"infinitive": "å utvikle", "present": "utvikler", "preterite": "utviklet", "perfect": "har utviklet", "imperative": "utvikl"},
    "behandle": {"infinitive": "å behandle", "present": "behandler", "preterite": "behandlet", "perfect": "har behandlet", "imperative": "behandl"},
    "bremse":   {"infinitive": "å bremse", "present": "bremser", "preterite": "bremset", "perfect": "har bremset", "imperative": "brems"},
    "vinne":    {"infinitive": "å vinne", "present": "vinner", "preterite": "vant", "perfect": "har vunnet", "imperative": "vinn"},
    "bekjempe": {"infinitive": "å bekjempe", "present": "bekjemper", "preterite": "bekjempet", "perfect": "har bekjempet", "imperative": "bekjemp"},
    "håndtere": {"infinitive": "å håndtere", "present": "håndterer", "preterite": "håndterte", "perfect": "har håndtert", "imperative": "håndter"},
    "transportere": {"infinitive": "å transportere", "present": "transporterer", "preterite": "transporterte", "perfect": "har transportert", "imperative": "transporter"},
    "bli":      {"infinitive": "å bli", "present": "blir", "preterite": "ble", "perfect": "har blitt", "imperative": "bli"},
    "skape":    {"infinitive": "å skape", "present": "skaper", "preterite": "skapte", "perfect": "har skapt", "imperative": "skap"},
    "snakke":   {"infinitive": "å snakke", "present": "snakker", "preterite": "snakket", "perfect": "har snakket", "imperative": "snakk"},
    "investere":{"infinitive": "å investere", "present": "investerer", "preterite": "investerte", "perfect": "har investert", "imperative": "invester"},
    "finne":    {"infinitive": "å finne", "present": "finner", "preterite": "fant", "perfect": "har funnet", "imperative": "finn"},
    "ta":       {"infinitive": "å ta", "present": "tar", "preterite": "tok", "perfect": "har tatt", "imperative": "ta"},
    "pugge":    {"infinitive": "å pugge", "present": "pugger", "preterite": "pugget", "perfect": "har pugget", "imperative": "pugg"},
    "bo":       {"infinitive": "å bo", "present": "bor", "preterite": "bodde", "perfect": "har bodd", "imperative": "bo"},
}


def process():
    cases = json.load(open(SKIPPED_IN, encoding="utf-8"))
    decisions = json.load(open(DECISIONS_IN, encoding="utf-8"))
    assert len(cases) == len(decisions), f"Case count mismatch {len(cases)} vs {len(decisions)}"

    processed = []
    skipped = []
    file_changes = Counter()

    file_actions = {}
    for case, decision in zip(cases, decisions):
        if case["verb"] != decision["verb"] or case["file"] != decision["file"]:
            print(f"!! mismatch case={case['file']}/{case['verb']} decision={decision['file']}/{decision['verb']}")
            sys.exit(1)
        if decision.get("action") == "skip":
            skipped.append({**case, "v3_reason": decision["skip_reason"]})
            continue
        file_actions.setdefault(case["file"], []).append((case, decision))

    for fname, items in file_actions.items():
        fpath = os.path.join(CONTENT_DIR, fname)
        with open(fpath, encoding="utf-8") as f:
            data = json.load(f)
        segments = data["segments"]
        orig_no = "".join((s.get("no", "") if s.get("type") == "ru" else s.get("text", "")) for s in segments)

        for case, decision in items:
            target_no = case["no"]
            old_ru = decision["old_ru"]
            new_ru = decision["new_ru"]
            override_translation = decision.get("translation")
            verb = case["verb"]

            # First try exact (text+no) match. If that fails (file was modified
            # by previous splitters, so the recorded `case["no"]` is stale),
            # fall back to matching by `old_ru` text only — provided the no
            # field still contains the å+verb pattern.
            idx = None
            for i, seg in enumerate(segments):
                if seg.get("type") == "ru" and seg.get("no") == target_no and seg.get("text") == old_ru:
                    idx = i
                    break
            if idx is None:
                # Fallback: match by old_ru text + å+verb presence in no
                for i, seg in enumerate(segments):
                    if (seg.get("type") == "ru"
                        and seg.get("text") == old_ru
                        and ("å " + verb) in seg.get("no", "")):
                        idx = i
                        break
            if idx is None:
                skipped.append({**case, "v3_reason": "segment_not_found_or_old_ru_mismatch"})
                continue

            segments[idx]["text"] = new_ru

            seg = segments[idx]
            no_text = seg["no"]
            ru_text = seg["text"]
            no_split = split_norwegian(no_text, verb)
            if not no_split:
                segments[idx]["text"] = old_ru
                skipped.append({**case, "v3_reason": "no_split_failed_after_rewrite"})
                continue
            no_before, no_after = no_split

            ru_split = find_russian_split(ru_text, verb)
            if not ru_split:
                segments[idx]["text"] = old_ru
                skipped.append({**case, "v3_reason": "ru_split_failed_after_rewrite"})
                continue
            ru_before, ru_after, removed_word, capitalized = ru_split

            verb_seg = make_verb_segment(verb)
            if not verb_seg:
                segments[idx]["text"] = old_ru
                skipped.append({**case, "v3_reason": "no_translation"})
                continue
            if override_translation:
                t = override_translation
                if capitalized:
                    t = t[:1].upper() + t[1:]
                verb_seg["translation"] = t
                verb_seg["dict"] = override_translation
            else:
                if capitalized and verb_seg.get("translation"):
                    t = verb_seg["translation"]
                    verb_seg["translation"] = t[:1].upper() + t[1:]
            if verb in VERB_FORMS:
                verb_seg["form"] = "infinitive"
                verb_seg["forms"] = VERB_FORMS[verb]

            new_segs = []
            new_ru_before = {"type": "ru", "text": ru_before, "no": no_before}
            new_ru_after = {"type": "ru", "text": ru_after, "no": no_after}
            if new_ru_before["text"] or new_ru_before["no"]:
                new_segs.append(new_ru_before)
            new_segs.append(verb_seg)
            if new_ru_after["text"] or new_ru_after["no"]:
                new_segs.append(new_ru_after)

            segments[idx:idx+1] = new_segs
            processed.append({
                **case,
                "old_ru": old_ru,
                "new_ru": new_ru,
                "after_segments": [
                    {"text": s.get("text"), "no": s.get("no"), "translation": s.get("translation")}
                    for s in new_segs
                ],
            })
            file_changes[fname] += 1

        new_no = "".join((s.get("no", "") if s.get("type") == "ru" else s.get("text", "")) for s in segments)
        if new_no != orig_no:
            print(f"!! Norwegian text changed for {fname}, aborting write")
            for i, (a, b) in enumerate(zip(orig_no, new_no)):
                if a != b:
                    print(f"   diff at pos {i}")
                    print(f"   orig: {orig_no[max(0,i-30):i+30]!r}")
                    print(f"   new : {new_no[max(0,i-30):i+30]!r}")
                    break
            else:
                print(f"   length diff: orig={len(orig_no)} new={len(new_no)}")
            continue

        data["segments"] = segments
        with open(fpath, "w", encoding="utf-8") as f:
            json.dump(data, f, ensure_ascii=False, separators=(", ", ": "))

    with open(SKIPPED_OUT, "w", encoding="utf-8") as f:
        json.dump(skipped, f, ensure_ascii=False, indent=2)
    with open(PROCESSED_OUT, "w", encoding="utf-8") as f:
        json.dump(processed, f, ensure_ascii=False, indent=2)

    print(f"\n=== v3 Report ===")
    print(f"Processed (rewrites applied): {len(processed)}")
    print(f"Skipped: {len(skipped)}")
    print(f"\nTop files by changes:")
    for fn, cnt in file_changes.most_common():
        print(f"  {cnt:3d}  {fn}")


if __name__ == "__main__":
    process()
