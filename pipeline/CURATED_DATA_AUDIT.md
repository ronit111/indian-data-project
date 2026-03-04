# Curated Data Audit Report

**Date**: 2026-03-04
**Scope**: All 11 domains, curated data constants in `pipeline/src/*/sources/curated.py`
**Method**: 9 parallel verification agents cross-referencing curated values against authoritative government publications (PIB, NCRB, ECI, MOSPI, NFHS-5, UDISE+, ISFR, MoRTH, ADR, World Bank)

---

## Summary

| Domain | Verified OK | Issues Found | Critical |
|--------|------------|--------------|----------|
| Budget | 4/4 | 0 | — |
| Economy | 2/3 | 1 (GDP/CPI annotation) | 0 |
| RBI | 8/8 | 0 | — |
| Census | All | 0 (minor SRS 2022 UP/CG flag) | 0 |
| States | All | 0 (data vintage 2022-23) | 0 |
| **Elections** | 6/10 | **4** | **2** (avg assets, wealthiest list) |
| **Employment** | 3/6 | **3** | **2** (youth unemp, self-employed) |
| **Education** | 2/6 | **4** | **3** (GER, schools, state data) |
| **Healthcare** | 3/6 | **3** | **1** (OOP %) |
| **Environment** | 3/5 | **2** | **1** (Mizoram sign reversal) |
| Crime | 6/8 | **2** | 0 |

---

## Fixed in This Audit

| # | Domain | What Changed | Old → New |
|---|--------|-------------|-----------|
| 1 | Elections | Average MP assets | Rs 97.3 cr → **Rs 46.34 cr** |
| 2 | Elections | Wealthiest MPs list | 20 entries with errors → **3 verified** (rest need ADR PDF) |
| 3 | Employment | Youth unemployment | 12.8% → **10.2%** (PLFS 2023-24 annual usual status) |
| 4 | Employment | Self-employed % | 52.4% → **58.4%** (PLFS 2023-24 annual usual status) |
| 5 | Employment | Female LFPR | 35.2% → **34.9%** (PLFS Oct-Dec 2025 CWS) |
| 6 | Education | Total schools | 14,89,115 → **14,71,891** (UDISE+ 2023-24) |
| 7 | Education | Total teachers | 97,40,000 → **98,07,600** (UDISE+ 2023-24) |
| 8 | Education | GER Primary | 104.8% → **93.0%** (post-SDMIS methodology change) |
| 9 | Education | GER Secondary | 79.6% → **77.4%** |
| 10 | Education | PTR national | 26 → **25** |
| 11 | Healthcare | Out-of-pocket % | 48.2% → **45.1%** (World Bank 2021) |
| 12 | Environment | Mizoram forest % | 84.53% → **85.34%** (ISFR 2023) |
| 13 | Environment | Mizoram forest change | -186 km2 → **+242 km2** (sign was reversed!) |
| 14 | Crime | Overspeeding % | 69.3% → **72.3%** (MoRTH 2022) |
| 15 | Crime | Wrong-side driving % | 5.5% → **4.9%** (MoRTH 2022) |

---

## Still Needs Manual Verification

These sections have WARNING flags in the code. They need a human to cross-check against primary source PDFs:

### 1. Education State-Level UDISE+ Data
**File**: `pipeline/src/education/sources/curated.py` → `UDISE_2023_24_STATES`
**Problem**: Internal inconsistencies suggest data was not extracted from a single authoritative table:
- State teacher totals sum to 69 lakh vs national 98 lakh (29% gap)
- Bihar: teachers 430K (actual 657K), PTR 65 (actual 32), GER 104% (actual 83%)
- PTR ≠ students/teachers for ~half the states

**Fix**: Extract from https://dashboard.udiseplus.gov.in/ or UDISE+ 2023-24 PDF

### 2. Education ASER State Data
**File**: `pipeline/src/education/sources/curated.py` → `ASER_2024_STATES`
**Problem**: Contains "canReadEnglish" which is not a real ASER 2024 metric. UP reading figure verified wrong (18.6% vs 27.9%).

**Fix**: Download state PDFs from https://asercentre.org/aser-2024/. Remove canReadEnglish. Use standard ASER metrics only.

### 3. Healthcare NFHS-5 Immunization
**File**: `pipeline/src/healthcare/sources/curated.py` → `IMMUNIZATION_STATES`
**Problem**: Bihar 54.2% vs NFHS-5 ~71%. Kerala 84.2% vs ~78%.

**Fix**: Verify against NFHS-5 State Factsheets at https://rchiips.org/nfhs/NFHS-5_FCTS/

### 4. Elections Alliance Totals
**File**: `public/data/elections/2025-26/results.json` → `allianceTotals`
**Problem**: NDA=284 in results.json vs 293 in summary.json. Smaller allies lumped into "OTH".

**Fix**: Either add missing NDA/INDIA allies to party list, or document the discrepancy.

---

## Automated Validation

A new validator module catches many of these issues automatically:

```bash
cd pipeline
python -m src.common.curated_validator
```

Checks include:
- State sums ≈ national totals
- PTR = students / teachers
- Percentage fields in [0, 120]
- Sectoral employment shares sum to ~100%
- Known reference value anchors (ADR avg assets, OOP trends, etc.)
- No duplicate IDs
- Elections: known losing candidates not in wealthiest list

**Run this after every curated data update.**

---

## Root Cause: Curated Data Pitfalls

### Why errors happen
1. **No machine-readable source**: Government data often exists only in PDFs, making extraction error-prone
2. **Multiple vintages**: Same metric reported differently across years (UDISE+ GER changed from 103→93 after methodology update)
3. **Methodology confusion**: PLFS usual status vs CWS, NFHS-5 survey vs SRS civil registration, World Bank modelled vs national estimates
4. **AI hallucination risk**: When AI generates curated data without a primary source table, it produces plausible-sounding numbers that are internally inconsistent

### Prevention
1. **Always cite specific table/page**: Not just "UDISE+ 2023-24" but "UDISE+ 2023-24, Table 6, p.42"
2. **Run curated_validator.py** after every manual edit
3. **Cross-check state sums**: If state data doesn't add up to the national total, something is wrong
4. **Never use AI to generate numbers**: AI can help format/transform data, but the numbers themselves must come from a primary source document
5. **Verify derived values**: If PTR is stored alongside students and teachers, check the math
6. **Watch for methodology changes**: UDISE+ SDMIS (2022-23), PLFS usual status vs CWS, Census 2011 vs Census 2025

---

## Verified Domains (No Action Needed)

### Budget
- Total expenditure Rs 50,65,345 crore — EXACT MATCH with Budget at a Glance
- Fiscal deficit 4.4% of GDP — EXACT MATCH
- Per capita daily expenditure arithmetic — CORRECT

### RBI
- Repo rate 5.25% — VERIFIED (Feb 2026 MPC)
- All 8 MPC decisions 2024-2026 — VERIFIED
- CRR 3.0%, SLR 18.0% — VERIFIED
- CRR 12-year history — VERIFIED

### Census
- All population figures (36 states/UTs) — EXACT MATCH with Census 2011 PCA
- NPC 2026 projections (35 entries) — EXACT MATCH
- NFHS-5 national averages (TFR 2.0, IMR 35, U5MR 42) — VERIFIED
- Literacy 74.04%, sex ratio 943 — VERIFIED

### Crime (headline numbers)
- Total cognizable crimes 58,24,946 — EXACT MATCH with NCRB 2022
- Road deaths 1,68,491 — EXACT MATCH with MoRTH 2022
- Crimes against women 4,45,256 — EXACT MATCH
- Cybercrimes 65,893 — VERIFIED

### Elections (headline numbers)
- Turnout 65.8%, BJP 240, INC 99 — VERIFIED
- Criminal MPs 46%/31%, Women MPs 74 — EXACT MATCH with ADR/ECI
