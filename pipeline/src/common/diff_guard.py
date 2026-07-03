"""Fail-closed data diff guard.

Compares regenerated ``public/data/<domain>`` JSON against the committed
version (git HEAD) and exits non-zero if the change looks *structural* —
files added/removed, top-level JSON keys changed, or item ``id`` values
added/removed in any nested list-of-objects.

Intended to run in CI **between** the pipeline run and the commit step, from
the repository root. A non-zero exit stops the job before commit/push, so the
workflow's ``if: failure()`` handler opens an issue and production stays at the
last known-good data (fail-closed). Magnitude-only changes (values moving,
new years appended) do NOT trip the guard — those are normal refreshes; only
shape changes that a human should eyeball do.

Usage (from repo root):
    python pipeline/src/common/diff_guard.py public/data/budget public/data/tax-calculator
"""

import json
import subprocess
import sys
from pathlib import Path


def _git(*args: str) -> str:
    return subprocess.run(
        ["git", *args], capture_output=True, text=True
    ).stdout


def _top_keys(obj: object) -> set[str]:
    return set(obj.keys()) if isinstance(obj, dict) else set()


def _ids(obj: object) -> set[str]:
    """Collect every ``id`` value from nested dicts/lists."""
    found: set[str] = set()

    def walk(o: object) -> None:
        if isinstance(o, dict):
            if "id" in o and not isinstance(o["id"], (dict, list)):
                found.add(str(o["id"]))
            for v in o.values():
                walk(v)
        elif isinstance(o, list):
            for item in o:
                walk(item)

    walk(obj)
    return found


def check(paths: list[str]) -> list[str]:
    problems: list[str] = []
    # `git diff HEAD` is blind to brand-new untracked files — a pipeline that
    # starts emitting an extra output file would otherwise pass the guard.
    untracked = _git("ls-files", "--others", "--exclude-standard", "--", *paths).strip()
    for path in untracked.splitlines():
        problems.append(f"NEW file added (untracked): {path}")
    out = _git("diff", "--name-status", "HEAD", "--", *paths).strip()
    if not out:
        return problems
    for line in out.splitlines():
        parts = line.split("\t")
        status, path = parts[0], parts[-1]
        if status.startswith("A"):
            problems.append(f"NEW file added: {path}")
        elif status.startswith("D"):
            problems.append(f"file DELETED: {path}")
        elif status.startswith("M") and path.endswith(".json"):
            old_raw = _git("show", f"HEAD:{path}")
            try:
                old = json.loads(old_raw)
                new = json.loads(Path(path).read_text())
            except (json.JSONDecodeError, FileNotFoundError):
                continue
            ok, nk = _top_keys(old), _top_keys(new)
            if ok != nk:
                problems.append(
                    f"{path}: top-level keys changed "
                    f"(+{sorted(nk - ok)} -{sorted(ok - nk)})"
                )
            oi, ni = _ids(old), _ids(new)
            if oi != ni:
                problems.append(
                    f"{path}: item ids changed "
                    f"(+{sorted(ni - oi)} -{sorted(oi - ni)})"
                )
    return problems


def main(argv: list[str]) -> int:
    if not argv:
        print("usage: diff_guard.py <data-path> [<data-path> ...]")
        return 2
    problems = check(argv)
    if problems:
        print("DATA DIFF GUARD TRIPPED — structural change detected; "
              "skipping commit (fail-closed). Review before deploying:")
        for p in problems:
            print(f"  - {p}")
        return 1
    print("diff guard: no structural changes (magnitude-only refresh) ✓")
    return 0


if __name__ == "__main__":
    raise SystemExit(main(sys.argv[1:]))
