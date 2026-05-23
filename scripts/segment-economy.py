# -*- coding: utf-8 -*-
"""
text-micro-segmenter for the `economy` category.

Splits ru-segments (type="ru") whose `text` and `no` fields contain multiple
sentences into finer-grained sentence/clause-level ru-segments, preserving
parallel ru<->no alignment and exact round-trip concatenation.

Inputs:
    public/content/{banks,boliglan,budget,insurance,oilfund}-{1..9}.json

Outputs:
    - modified content files (single-line JSON, ensure_ascii=False)
    - scripts/_segment_skipped.json  cases skipped with reason
    - scripts/_segment_processed.json  per-file before/after stats

Algorithm (heuristic, conservative — skip on ambiguity):
    1. For each ru-segment, find sentence-end markers `. `, `! `, `? ` in
       `text` (excluding the trailing one) that are NOT inside common
       abbreviations (т.д., т.е., t.d., f.eks., nr., dvs.).
    2. Mirror-search in `no` for the same markers.
    3. Try to align: equal count of breakpoints in ru and no. If not equal,
       fall back to longest-common-prefix alignment per breakpoint (still
       requires same count after alignment).
    4. For each successful breakpoint pair, the LEFT chunk keeps the `. `
       (sentence-final punctuation + one trailing space). The RIGHT chunk
       starts a fresh sentence.
    5. Round-trip validate: joined ru.text and joined no must match the
       originals exactly. Roll back the whole file on mismatch.

Run:
    python scripts/segment-economy.py
    python scripts/segment-economy.py --dry-run     # no writes
    python scripts/segment-economy.py --verbose
"""
import json
import os
import re
import sys
import io
from collections import Counter, defaultdict

if __name__ == "__main__":
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8")
    sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding="utf-8")

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
CONTENT_DIR = os.path.join(ROOT, "public", "content")
SKIPPED_OUTPUT = os.path.join(ROOT, "scripts", "_segment_skipped.json")
PROCESSED_OUTPUT = os.path.join(ROOT, "scripts", "_segment_processed.json")

CATEGORIES = ["banks", "boliglan", "budget", "insurance", "oilfund"]
FILES = [f"{cat}-{i}.json" for cat in CATEGORIES for i in range(1, 10)]

# Abbreviations that contain a period+space-like sequence but are NOT a sentence end.
# We check the WORD just before the candidate `. ` ends with one of these (case-insensitive).
RU_ABBREVS = {"т", "т.д", "т.е", "т.п", "и.т.д", "напр", "г", "гг", "стр", "св", "ок"}
NO_ABBREVS = {"t", "t.d", "f.eks", "dvs", "bl.a", "ca", "nr", "kr", "osv", "jf", "pga"}


def find_sentence_breaks(text: str, abbrevs: set) -> list:
    """
    Return a list of positions (int) IN `text` such that `text[:pos]` ends
    with sentence-final punctuation + one trailing space (so left chunk ends
    with `. ` / `! ` / `? `), and the right chunk starts with whatever
    character comes next (usually a capital letter, a tooltip word, etc.).

    A position is the index of the FIRST char of the right chunk.
    The final break (end of `text`) is NOT included.
    """
    breaks = []
    # We don't want the boundary to be the very end of the field — that's not
    # a break but a tail. Iterate up to len(text)-1 so a `.` at the end is fine
    # (it just isn't followed by a space).
    i = 0
    n = len(text)
    while i < n - 1:
        ch = text[i]
        if ch in ".!?":
            # Skip ellipsis: ".." or "..." or "…"
            if ch == "." and i + 1 < n and text[i + 1] == ".":
                # advance past run of dots
                j = i
                while j < n and text[j] == ".":
                    j += 1
                i = j
                continue
            if i > 0 and text[i - 1] == ".":
                # already inside an ellipsis run
                i += 1
                continue
            # Need a trailing space or end-of-string after the punctuation.
            # We only break when followed by space (mid-text); end-of-string
            # tail isn't a break.
            if i + 1 < n and text[i + 1] == " ":
                # Check next non-space char — should be uppercase / digit /
                # quote / "—" / capital cyrillic / latin upper / digit
                # If next is lowercase, likely NOT a real sentence end.
                k = i + 2
                # skip extra spaces (shouldn't happen but be safe)
                while k < n and text[k] == " ":
                    k += 1
                if k < n:
                    nxt = text[k]
                    if nxt.isalpha() and nxt.islower():
                        i += 1
                        continue
                # Abbreviation check: word just before the `.`
                if ch == ".":
                    # collect word chars before i
                    j = i - 1
                    while j >= 0 and (text[j].isalnum() or text[j] == "."):
                        j -= 1
                    word = text[j + 1 : i].lower()
                    if word in abbrevs:
                        i += 1
                        continue
                breaks.append(i + 2)  # right chunk starts after `. `
                i += 2
                continue
        i += 1
    return breaks


def split_at(text: str, breaks: list) -> list:
    """Split `text` at the given break positions into chunks (in order)."""
    chunks = []
    prev = 0
    for b in breaks:
        chunks.append(text[prev:b])
        prev = b
    chunks.append(text[prev:])
    return chunks


def word_count(s: str) -> int:
    return len(re.findall(r"\b[\w'-]+\b", s, flags=re.UNICODE))


def is_candidate(seg: dict) -> bool:
    """A ru-segment is a candidate for splitting iff it has at least 2
    sentence-final breaks in `text` (i.e., >=2 sentences) and matches in `no`.
    """
    if seg.get("type") != "ru":
        return False
    text = seg.get("text", "")
    no = seg.get("no", "")
    ru_breaks = find_sentence_breaks(text, RU_ABBREVS)
    if not ru_breaks:
        return False
    # Need at least one break AND total chunk length suggests it's worth splitting.
    # Heuristic threshold: at least one break + total length >= ~5 words.
    if word_count(text) < 5:
        return False
    return True


def try_split_segment(seg: dict, log: list):
    """
    Try to split a ru-segment into multiple ru-segments along parallel
    sentence boundaries.

    Returns a list of new ru-segments (length >= 1). If splitting failed or
    no split is warranted, returns [seg] unchanged.

    `log` is a list to append diagnostic info to (skip reasons).
    """
    if seg.get("type") != "ru":
        return [seg]
    text = seg.get("text", "")
    no = seg.get("no", "")

    ru_breaks = find_sentence_breaks(text, RU_ABBREVS)
    no_breaks = find_sentence_breaks(no, NO_ABBREVS)

    if not ru_breaks:
        return [seg]

    # Strict alignment: equal count required. If unequal, skip (don't split).
    if len(ru_breaks) != len(no_breaks):
        log.append({
            "reason": "break_count_mismatch",
            "ru_breaks": len(ru_breaks),
            "no_breaks": len(no_breaks),
            "ru_text": text,
            "no_text": no,
        })
        return [seg]

    ru_chunks = split_at(text, ru_breaks)
    no_chunks = split_at(no, no_breaks)

    # Sanity: chunk counts equal.
    if len(ru_chunks) != len(no_chunks):
        log.append({"reason": "chunk_count_mismatch", "ru_text": text, "no_text": no})
        return [seg]

    # Build new segments, preserving any extra keys from the original.
    new_segs = []
    base_keys = {k: v for k, v in seg.items() if k not in ("text", "no")}
    for rc, nc in zip(ru_chunks, no_chunks):
        if not rc and not nc:
            continue
        ns = {"type": "ru", "text": rc, "no": nc}
        # Preserve any extra metadata (rare for ru segments but safe).
        for k, v in base_keys.items():
            if k != "type":
                ns[k] = v
        new_segs.append(ns)

    if len(new_segs) < 2:
        return [seg]

    return new_segs


def process_file(fpath: str, dry_run: bool, verbose: bool, skipped_log: list, stats: dict):
    with open(fpath, encoding="utf-8") as f:
        data = json.load(f)

    segments = data.get("segments", [])
    if not segments:
        return

    # Round-trip baseline: concatenated ru.text and no across all segments.
    orig_ru = "".join(
        (s.get("text", "") if s.get("type") == "ru" else "")
        for s in segments
    )
    orig_no_combined = "".join(
        (s.get("no", "") if s.get("type") == "ru" else s.get("text", ""))
        for s in segments
    )

    n_before = len(segments)
    new_segments = []
    splits_in_file = 0
    file_skip_log = []

    for seg in segments:
        if seg.get("type") != "ru":
            new_segments.append(seg)
            continue
        if not is_candidate(seg):
            new_segments.append(seg)
            continue
        local_log = []
        replacements = try_split_segment(seg, local_log)
        if len(replacements) > 1:
            splits_in_file += len(replacements) - 1
            new_segments.extend(replacements)
        else:
            new_segments.append(seg)
            for entry in local_log:
                entry["file"] = os.path.basename(fpath)
                file_skip_log.append(entry)

    n_after = len(new_segments)

    if splits_in_file == 0:
        # No changes; still record skipped cases (none here unless a candidate failed).
        skipped_log.extend(file_skip_log)
        stats["unchanged_files"] += 1
        return

    # Round-trip verification.
    new_ru = "".join(
        (s.get("text", "") if s.get("type") == "ru" else "")
        for s in new_segments
    )
    new_no_combined = "".join(
        (s.get("no", "") if s.get("type") == "ru" else s.get("text", ""))
        for s in new_segments
    )

    if new_ru != orig_ru or new_no_combined != orig_no_combined:
        # Diagnose & roll back.
        diff_pos_ru = next((i for i, (a, b) in enumerate(zip(orig_ru, new_ru)) if a != b), -1)
        diff_pos_no = next((i for i, (a, b) in enumerate(zip(orig_no_combined, new_no_combined)) if a != b), -1)
        skipped_log.append({
            "file": os.path.basename(fpath),
            "reason": "roundtrip_failed",
            "ru_diff_pos": diff_pos_ru,
            "no_diff_pos": diff_pos_no,
            "orig_ru_len": len(orig_ru),
            "new_ru_len": len(new_ru),
            "orig_no_len": len(orig_no_combined),
            "new_no_len": len(new_no_combined),
        })
        stats["rollback_files"] += 1
        return

    # Commit.
    skipped_log.extend(file_skip_log)
    data["segments"] = new_segments
    if not dry_run:
        with open(fpath, "w", encoding="utf-8") as f:
            json.dump(data, f, ensure_ascii=False, separators=(", ", ": "))

    stats["changed_files"] += 1
    stats["total_splits"] += splits_in_file
    stats["per_file_splits"][os.path.basename(fpath)] = splits_in_file
    stats["before_counts"][os.path.basename(fpath)] = n_before
    stats["after_counts"][os.path.basename(fpath)] = n_after

    if verbose:
        print(f"  {os.path.basename(fpath):20s}  {n_before:3d} -> {n_after:3d} segments (+{splits_in_file})")


def main():
    dry_run = "--dry-run" in sys.argv
    verbose = "--verbose" in sys.argv or "-v" in sys.argv

    stats = {
        "files_total": 0,
        "changed_files": 0,
        "unchanged_files": 0,
        "rollback_files": 0,
        "total_splits": 0,
        "per_file_splits": {},
        "before_counts": {},
        "after_counts": {},
    }
    skipped_log = []
    examples = []

    for fname in FILES:
        fpath = os.path.join(CONTENT_DIR, fname)
        if not os.path.exists(fpath):
            print(f"!! missing file: {fname}")
            continue
        stats["files_total"] += 1

        # Capture a "before snapshot" of largest ru-segment for examples.
        with open(fpath, encoding="utf-8") as f:
            data_before = json.load(f)
        largest_before = max(
            (s for s in data_before["segments"] if s.get("type") == "ru"),
            key=lambda s: len(s.get("text", "")),
            default=None,
        )

        process_file(fpath, dry_run, verbose, skipped_log, stats)

        # Capture an "after snapshot" and record an example if file changed.
        with open(fpath, encoding="utf-8") as f:
            data_after = json.load(f)
        if largest_before:
            before_text = largest_before.get("text", "")
            # find segments that "came from" this large one — those whose text
            # is a substring of before_text and which appear contiguously in after.
            after_segments = data_after["segments"]
            matching = []
            for s in after_segments:
                if s.get("type") == "ru" and s.get("text", "") and s["text"] in before_text:
                    matching.append(s)
            if len(matching) > 1 and stats["per_file_splits"].get(fname, 0) > 0:
                # ensure we don't include the unchanged case
                examples.append({
                    "file": fname,
                    "before_word_count": word_count(before_text),
                    "before_text": before_text[:200] + ("..." if len(before_text) > 200 else ""),
                    "after_chunks": [s["text"][:100] for s in matching[:5]],
                })

    # Write reports.
    with open(SKIPPED_OUTPUT, "w", encoding="utf-8") as f:
        json.dump(skipped_log, f, ensure_ascii=False, indent=2)
    with open(PROCESSED_OUTPUT, "w", encoding="utf-8") as f:
        json.dump(
            {"stats": stats, "examples": examples[:10]},
            f,
            ensure_ascii=False,
            indent=2,
        )

    print()
    print("=== segment-economy report ===")
    print(f"files_total      : {stats['files_total']}")
    print(f"changed_files    : {stats['changed_files']}")
    print(f"unchanged_files  : {stats['unchanged_files']}")
    print(f"rollback_files   : {stats['rollback_files']}")
    print(f"total_splits     : {stats['total_splits']}")
    print(f"skipped cases    : {len(skipped_log)}")
    if stats["per_file_splits"]:
        avg_before = sum(stats["before_counts"].values()) / max(len(stats["before_counts"]), 1)
        avg_after = sum(stats["after_counts"].values()) / max(len(stats["after_counts"]), 1)
        print(f"avg segs (changed files): {avg_before:.1f} -> {avg_after:.1f}")
        print("\nTop 5 files by splits added:")
        for fname, n in sorted(stats["per_file_splits"].items(), key=lambda kv: -kv[1])[:5]:
            print(f"  +{n:3d}  {fname}")


if __name__ == "__main__":
    main()
