# Pipeline Data Sources Catalog

Comprehensive catalog of all data sources used by the India Data Portal pipelines. Each domain pipeline blends automated API data with manually curated government publication data. This document tracks what needs manual updating and when.

---

## Automated Sources (API-driven)

These are fetched automatically by pipelines on every run. No manual intervention needed.

| Source | API Endpoint | Auth | Domains Using It | Update Cadence |
|--------|-------------|------|-------------------|----------------|
| **World Bank Open Data** | `api.worldbank.org/v2/country/ind/indicator/{code}` | None | Economy, Census, RBI, Education, Employment, Healthcare | ~1 year lag behind national releases |
| **MOSPI eSankhyiki CPI** | `api.mospi.gov.in/api/cpi/getCPIIndex` | None (first 10 records/page) | Economy | Monthly releases, pipeline computes FY averages |
| **Open Budgets India (CKAN)** | `openbudgetsindia.org/api/3/action/package_show` | None | Budget | Updated after Union Budget (Feb 1) |

---

## Curated Sources (Manual Updates Required)

These are hardcoded data constants in Python files, sourced from government PDFs, press releases, and reports that have no public API. The freshness monitor (`data-freshness-monitor.yml`) creates GitHub issues when updates are likely due.

### Budget Domain

| Constant | File | Source | Data Vintage | Update Trigger |
|----------|------|--------|-------------|----------------|
| `BUDGET_TRENDS` | `pipeline/src/main.py` | Union Budget documents (indiabudget.gov.in) | FY 2005-06 to 2025-26 | Annual: Union Budget (Feb 1) |
| `BUDGET_VS_ACTUAL` | `pipeline/src/main.py` | Union Budget documents + CAG reports | 10 ministries x 7 FYs | Annual: Union Budget (Feb 1) for RE/BE, CAG for Actual |

### Economy Domain

| Constant | File | Source | Data Vintage | Update Trigger |
|----------|------|--------|-------------|----------------|
| Summary hardcodes | `pipeline/src/economy/main.py` | Economic Survey + NSO estimates | FY 2025-26 | Annual: Economic Survey (late Jan) |
| `_IMF_BASELINE` | `pipeline/src/economy/transform/inflation.py` | IMF CPI via DBnomics (db.nomics.world/IMF/CPI) | FY 2014-15 to 2018-19 | Static (historical, won't change) |
| `_CURATED_MOSPI_FALLBACK` | `pipeline/src/economy/transform/inflation.py` | MOSPI eSankhyiki API (verified 2026-03-01) | FY 2019-20 to 2024-25 | Only if MOSPI API goes down; replaced by live API data when available |
| Fiscal deficit series | `pipeline/src/economy/transform/fiscal.py` | Union Budget + CGA reports | 7-year series | Annual: Union Budget (Feb 1) |

### RBI Domain

| Constant | File | Source | Data Vintage | Update Trigger |
|----------|------|--------|-------------|----------------|
| `REPO_RATE_DECISIONS` | `pipeline/src/rbi/transform/monetary_policy.py` | RBI MPC Statements (rbi.org.in) | 56 decisions, Feb 2014 to Feb 2026 | Bi-monthly: after each MPC meeting (~6x/year) |
| `CURRENT_RATES` | `pipeline/src/rbi/transform/monetary_policy.py` | RBI Current Rates page | As of Feb 6, 2026 | After any MPC rate change |
| `CRR_HISTORY` | `pipeline/src/rbi/transform/monetary_policy.py` | RBI Handbook of Statistics, Table 45 | 12-year series (2014-2026) | After CRR changes (infrequent) |

### States Domain

| Constant | File | Source | Data Vintage | Update Trigger |
|----------|------|--------|-------------|----------------|
| `STATE_GSDP_DATA` | `pipeline/src/states/sources/curated.py` | RBI Handbook of Statistics on Indian States, Table 4 | FY 2022-23 | Annual: RBI Handbook (Aug-Sep) |
| `STATE_GSDP_HISTORY` | `pipeline/src/states/sources/curated.py` | RBI Handbook Table 21 | FY 2020-21 to 2022-23 | Annual: RBI Handbook |
| `STATE_REVENUE_DATA` | `pipeline/src/states/sources/curated.py` | RBI Handbook Tables 24-28 | FY 2022-23 | Annual: RBI Handbook |
| `STATE_FISCAL_DATA` | `pipeline/src/states/sources/curated.py` | RBI Handbook Tables 29-33 | FY 2022-23 | Annual: RBI Handbook |

### Census Domain

| Constant | File | Source | Data Vintage | Update Trigger |
|----------|------|--------|-------------|----------------|
| `CENSUS_2011_STATES` | `pipeline/src/census/sources/curated.py` | Census of India 2011, Primary Census Abstract | 2011 | Next Census (TBD) |
| `NPC_2026_PROJECTIONS` | `pipeline/src/census/sources/curated.py` | National Population Commission projections 2011-2036 | NPC 2020 report | Static (projection model won't change) |
| `NFHS5_STATE_HEALTH` | `pipeline/src/census/sources/curated.py` | NFHS-5 India Report & State Factsheets (2019-21) | 2019-21 | NFHS-6 (expected ~2028) |
| `SRS_STATE_IMR` | `pipeline/src/census/sources/curated.py` | Sample Registration System Statistical Report 2022 | 2022 | Annual: SRS report (typically 1-2 year lag) |

### Education Domain

| Constant | File | Source | Data Vintage | Update Trigger |
|----------|------|--------|-------------|----------------|
| `UDISE_2023_24_STATES` | `pipeline/src/education/sources/curated.py` | UDISE+ Flash Statistics 2023-24 | 2023-24 | Annual: UDISE+ report (typically Apr-May) |
| `ASER_2024_STATES` | `pipeline/src/education/sources/curated.py` | ASER 2024 (Annual Status of Education Report) | 2024 | Annual: ASER report (typically Jan) |
| `NATIONAL_TOTALS` | `pipeline/src/education/sources/curated.py` | UDISE+ 2023-24 Summary | 2023-24 | Annual |

### Employment Domain

| Constant | File | Source | Data Vintage | Update Trigger |
|----------|------|--------|-------------|----------------|
| PLFS Quarterly | `pipeline/src/employment/sources/curated.py` | PLFS Quarterly Bulletin, Oct-Dec 2025 | Q3 2025-26 | Quarterly: PLFS bulletin (~3 month lag) |
| `PLFS_STATE_DATA` | `pipeline/src/employment/sources/curated.py` | PLFS Annual Report 2023-24, Tables E1/E2 | 2023-24 | Annual: PLFS annual report (typically Aug) |
| `SECTORAL_EMPLOYMENT` | `pipeline/src/employment/sources/curated.py` | RBI KLEMS Database + PLFS 2023-24 | 2023-24 | Annual |
| `NATIONAL_TOTALS` | `pipeline/src/employment/sources/curated.py` | PLFS Annual + Quarterly | Q3 2025-26 | Quarterly |

### Healthcare Domain

| Constant | File | Source | Data Vintage | Update Trigger |
|----------|------|--------|-------------|----------------|
| Infrastructure states | `pipeline/src/healthcare/sources/curated.py` | NHP 2022 + Rural Health Statistics 2021-22 | 2022 | NHP typically publishes annually (1-2 year lag) |
| `IMMUNIZATION_STATES` | `pipeline/src/healthcare/sources/curated.py` | NFHS-5 State Factsheets (2019-21) | 2019-21 | NFHS-6 (expected ~2028) |
| `NATIONAL_TOTALS` | `pipeline/src/healthcare/sources/curated.py` | NHP 2022 + World Bank 2022 | 2022 | Annual |

---

## Data Integrity Practices

- **NFHS-5 lesson**: Original AI-assisted curation had 57 wrong values (field misalignment). Now verified against machine-readable reference CSV (github.com/pratapvardhan/NFHS-5, CC-BY-4.0). Always cross-check against machine-readable sources, not just PDFs.
- **Census literacy**: Use Census 2011 national figure (74.04%) directly. Do not compute weighted average of state literacy using total population (literacy is defined for age 7+, not total population).
- **World Bank lag**: ~1 year behind national releases. Always supplement with curated government data for the latest year.
- **CPI three-tier strategy**: IMF baseline (2014-19, static) + MOSPI API (2019+, live) + curated fallback (hardcoded, used only if MOSPI API is down). The pipeline auto-selects the best available source.

---

## Automation Summary

| Domain | Automated % | Manual Update Items | Pipeline Workflow |
|--------|------------|--------------------|--------------------|
| Budget | ~95% | Budget trends, BvA (annual) | `data-pipeline.yml` (daily cron) |
| Economy | ~95% | Summary figures (annual) | `economy-pipeline.yml` (quarterly) |
| RBI | ~85% | MPC decisions (~6x/yr), current rates | `rbi-pipeline.yml` (bi-monthly) |
| States | ~80% | Revenue data, debt/GSDP ratios (annual) | `states-pipeline.yml` (semi-annual) |
| Census | ~40% | Census 2011, NFHS-5, SRS (infrequent) | `census-pipeline.yml` (quarterly) |
| Education | ~40% | UDISE+, ASER (annual) | `education-pipeline.yml` (quarterly) |
| Employment | ~90% | KLEMS sectoral data (annual) | `employment-pipeline.yml` (quarterly) |
| Healthcare | ~40% | NHP, NFHS-5 immunization (annual/5-year) | `healthcare-pipeline.yml` (quarterly) |
| Environment | ~55% | AQI (curated), forest cover, water (curated) | `environment-pipeline.yml` (quarterly) |
| Elections | ~0% | All data (event-driven, no API) | `elections-pipeline.yml` (semi-annual) |
| Crime | ~0% | All data (annual, NCRB publication) | `crime-pipeline.yml` (semi-annual) |

**Additional automated sources**:
- **MOSPI eSankhyiki APIs** (no auth): NAS GDP/GVA, PLFS employment, WPI inflation, Energy balance
- **RBI Handbook XLSX scraper**: Auto-downloads Tables 19-24 (states GSDP), 62 (interest rates), 147 (forex reserves), 164 (fiscal deficit)
- **Shared MOSPI client**: `pipeline/src/common/mospi_client.py` — paginated fetcher with retry logic for all 7 MOSPI endpoints

The **freshness monitor** (`data-freshness-monitor.yml`) runs monthly and creates GitHub issues for upcoming data releases and stale data.
