"""
Write validated JSON data to the public/data/ directory.
"""

import json
import logging
from pathlib import Path

logger = logging.getLogger(__name__)

# Project root is 3 levels up from this file
PROJECT_ROOT = Path(__file__).parent.parent.parent.parent


def _preserve_nonempty_series(new, old, path=""):
    """
    Recursively replace empty lists in `new` with the corresponding non-empty
    list from the previously published `old` data.

    A source API returning nothing (HTTP error, timeout, indicator gap) makes
    fetch_indicator return [] — that must not erase a series the site already
    publishes. Intentionally emptying a series requires editing the published
    JSON by hand. Every preservation is logged.
    """
    if isinstance(new, dict) and isinstance(old, dict):
        for key, value in new.items():
            if key in old:
                child_path = f"{path}.{key}" if path else key
                new[key] = _preserve_nonempty_series(value, old[key], child_path)
    elif isinstance(new, list) and not new and isinstance(old, list) and old:
        logger.warning(
            f"  Preserving last-known-good series at '{path}' "
            f"({len(old)} points) — fresh fetch was empty"
        )
        return old
    return new


def write_json(data: dict, relative_path: str) -> Path:
    """
    Write a dict as JSON to public/data/{relative_path}.
    Creates parent directories as needed.

    If the file already exists, empty lists in the new data are replaced by
    the existing non-empty series (see _preserve_nonempty_series).
    """
    out_path = PROJECT_ROOT / "public" / "data" / relative_path
    out_path.parent.mkdir(parents=True, exist_ok=True)

    if out_path.exists():
        try:
            with open(out_path) as f:
                previous = json.load(f)
            data = _preserve_nonempty_series(data, previous)
        except (json.JSONDecodeError, OSError) as e:
            logger.warning(f"Could not read previous {out_path} for series preservation: {e}")

    with open(out_path, "w") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)

    logger.info(f"Wrote: {out_path}")
    return out_path


def publish_all(outputs: dict[str, dict]) -> list[Path]:
    """
    Write all pipeline outputs to their respective JSON files.

    Args:
        outputs: dict mapping relative paths to data dicts.
            e.g. {"budget/2025-26/summary.json": {...}, ...}
    """
    paths = []
    for rel_path, data in outputs.items():
        paths.append(write_json(data, rel_path))
    return paths
