# Data Pipelines

Fetches, transforms, and validates data for all 11 domains of the India Data Portal. Each pipeline produces JSON files consumed by the React frontend.

## Setup

```bash
cd pipeline
pip install -e ".[dev]"
```

## Running Pipelines

```bash
# Run a specific domain pipeline
python src/{domain}/main.py

# Run the budget pipeline
python src/main.py
```

Each pipeline:
1. Fetches data from automated sources (APIs, XLSX scrapers)
2. Falls back to curated data if APIs are unavailable
3. Transforms into visualization-ready structures
4. Validates output against Pydantic schemas
5. Writes JSON files to `../public/data/{domain}/`

## Architecture

```
src/
├── main.py              # Budget pipeline (original)
├── common/              # Shared infrastructure
│   ├── world_bank.py    # World Bank API client (7 domains)
│   ├── mospi_client.py  # MOSPI eSankhyiki API client (CPI, GDP, PLFS, WPI, IIP, Energy)
│   └── rbi_handbook.py  # RBI Handbook XLSX scraper
├── {domain}/            # Per-domain pipeline
│   ├── main.py          # Orchestrates stages
│   ├── sources/         # Data fetching (API + curated constants)
│   ├── transform/       # Normalization, metrics, viz structures
│   └── validate/        # Pydantic models matching TypeScript schema
└── publish/             # JSON file writer
```

## Data Sources

See [PIPELINE_DATA_SOURCES.md](./PIPELINE_DATA_SOURCES.md) for the full catalog of automated and curated sources, update triggers, and data integrity practices.

## Tests

```bash
pytest tests/ -v
```
