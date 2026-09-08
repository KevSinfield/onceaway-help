#!/bin/bash
set -euo pipefail

# Checks the user-facing Help articles under Docs/Help: that every relative
# link resolves, that headings are well formed, that every article is reachable
# from the index, and that no engineering internals or banned phrasing leaked
# into user documentation.
#
# It reads the documents and prints findings; it changes nothing.
#
# Usage: Scripts/check-help-docs.sh

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
HELP_DIR="$ROOT_DIR/Docs/Help"

python3 - "$HELP_DIR" <<'PY'
import pathlib, re, sys, urllib.parse

help_dir = pathlib.Path(sys.argv[1])
articles = sorted(p for p in help_dir.rglob("*.md"))
if not articles:
    print("error: no articles found under", help_dir)
    sys.exit(1)

failures = []

# Engineering internals and phrasing that must never appear in user Help.
# Matched case-insensitively as whole words where sensible.
BANNED = [
    "productivity score", "focus score", "efficiency score", "employee score",
    "employee monitoring", "time wasted",
    "PatternStructuralKey", "ActivityEvent", "FSEvents", "SQLite",
    "user_version", "Levenshtein", "SHA-256", "Apple Events", "NSWorkspace",
    "supercharge", "10x", "AI magic", "coming soon",
]
# Phrases that are fine in the specific article that explains why they are not
# used. Keyed by the article stem.
# Each of these articles exists to say the thing is *not* what Onceaway does,
# so the phrase has to appear for the article to make its point.
ALLOWED_MENTIONS = {
    "why-onceaway-doesnt-score-your-productivity": ["productivity score", "focus score", "time wasted"],
    "does-onceaway-monitor-employees": ["productivity score"],
    "what-is-planned-beyond-preview": ["productivity score", "employee monitoring"],
    "what-is-insights": ["time wasted"],
    "how-to-read-insights": [],
}

link_re = re.compile(r"\[([^\]]*)\]\(([^)]+)\)")

for article in articles:
    rel = article.relative_to(help_dir)
    text = article.read_text(encoding="utf-8")
    stem = article.stem

    # --- headings -------------------------------------------------------
    headings = [l for l in text.splitlines() if l.startswith("#")]
    h1 = [h for h in headings if re.match(r"^# \S", h)]
    if len(h1) != 1:
        failures.append(f"{rel}: expected exactly one H1, found {len(h1)}")
    for h in headings:
        if not re.match(r"^#{1,6} \S", h):
            failures.append(f"{rel}: malformed or empty heading: {h!r}")
    # H2s must not jump straight to H3 without an H2 before them.
    seen_h2 = False
    for h in headings:
        level = len(h) - len(h.lstrip("#"))
        if level == 2:
            seen_h2 = True
        elif level >= 3 and not seen_h2:
            failures.append(f"{rel}: {h.strip()} appears before any H2")

    # --- front matter ---------------------------------------------------
    if article.name != "README.md":
        if not text.startswith("---\n"):
            failures.append(f"{rel}: missing front matter")
        else:
            front = text.split("---", 2)[1]
            for key in ("title:", "section:", "order:"):
                if key not in front:
                    failures.append(f"{rel}: front matter missing {key}")

    # --- links ----------------------------------------------------------
    for label, target in link_re.findall(text):
        if target.startswith(("http://", "https://", "#", "mailto:")):
            continue
        path_part = urllib.parse.unquote(target.split("#", 1)[0])
        if not path_part:
            continue
        resolved = (article.parent / path_part).resolve()
        if not resolved.exists():
            failures.append(f"{rel}: broken link [{label}]({target})")

    # --- banned terms ---------------------------------------------------
    allowed = ALLOWED_MENTIONS.get(stem, [])
    lowered = text.lower()
    for term in BANNED:
        if term.lower() in lowered and term.lower() not in [a.lower() for a in allowed]:
            failures.append(f"{rel}: contains banned term {term!r}")

# --- every article reachable from the index -----------------------------
index = (help_dir / "README.md").read_text(encoding="utf-8")
linked = set()
for _, target in link_re.findall(index):
    if target.startswith(("http://", "https://", "#", "mailto:")):
        continue
    linked.add((help_dir / target.split("#", 1)[0]).resolve())
for article in articles:
    if article.name == "README.md":
        continue
    if article.resolve() not in linked:
        failures.append(f"{article.relative_to(help_dir)}: not linked from the index")

count = len(articles) - 1
if failures:
    print(f"{len(failures)} problem(s) in {count} articles:\n")
    for f in failures:
        print("  -", f)
    sys.exit(1)

print(f"Help documentation OK: {count} articles, all links resolve, "
      f"headings well formed, no banned terms, all reachable from the index.")
PY
