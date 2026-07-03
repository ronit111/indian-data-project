"""
Generate machine-readable provenance sidecars for published figures.

Every entry maps a figure the site displays to its chain of custody: the
official document it comes from, how this pipeline obtained it (curation or
a live fetch — declared truthfully per domain), and integrity checks that
are RECOMPUTED against the published JSON at generation time — never
asserted. A failing check aborts generation (fail-closed), so a provenance
sidecar can never describe data it doesn't match.

Output: public/data/<domain>/<year>/provenance.json

Honesty rules (non-negotiable, same as the rest of this pipeline):
  - Values are read from the published JSONs, never hardcoded here.
  - Only chains the pipeline code actually implements are declared.
  - Checks must be pure functions of published data.

Domain registries live in provenance_registry.py.
"""

import json
import logging
from datetime import date
from pathlib import Path

from src.publish.writer import PROJECT_ROOT
from src.publish.provenance_registry import DOMAIN_REGISTRIES

logger = logging.getLogger(__name__)

DATA_DIR = PROJECT_ROOT / "public" / "data"


def build_provenance(domain: str, year: str) -> dict:
    """Build the provenance sidecar dict for one domain-year."""
    file_names, builder = DOMAIN_REGISTRIES[domain]
    base = DATA_DIR / domain / year
    files = {name: json.loads((base / name).read_text()) for name in file_names}
    return {
        "domain": domain,
        "year": year,
        "generated": date.today().isoformat(),
        "spec": 1,
        "figures": builder(files),
    }


def publish_provenance(domain: str, year: str) -> Path:
    """Generate and write the provenance sidecar. Fail-closed on bad checks.

    Written directly (NOT via write_json): the writer's empty-list
    preservation could otherwise mutate the sidecar after its checks
    passed, breaking the guarantee that the file equals the checked object.
    """
    sidecar = build_provenance(domain, year)
    rel_path = f"{domain}/{year}/provenance.json"
    path = DATA_DIR / rel_path
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(sidecar, ensure_ascii=False, indent=2) + "\n")
    logger.info(
        f"Provenance sidecar written: {rel_path} "
        f"({len(sidecar['figures'])} figures, all checks passed)"
    )
    return path


if __name__ == "__main__":
    import sys
    logging.basicConfig(level=logging.INFO, format="%(message)s")
    if len(sys.argv) > 1 and sys.argv[1] == "all":
        year = sys.argv[2] if len(sys.argv) > 2 else "2025-26"
        for domain in DOMAIN_REGISTRIES:
            publish_provenance(domain, year)
    else:
        domain = sys.argv[1] if len(sys.argv) > 1 else "budget"
        year = sys.argv[2] if len(sys.argv) > 2 else "2025-26"
        publish_provenance(domain, year)
