# Curated Data Audit Report

**Date**: 2026-03-04 (initial), 2026-03-05 (PDF verification pass)
**Scope**: All 11 domains, curated data constants in `pipeline/src/*/sources/curated.py`
**Method**: 9 parallel verification agents cross-referencing curated values against authoritative government publications, followed by manual PDF verification against UDISE+ 2023-24, ASER 2024 Final Report, NFHS-5 dataset, and ADR 2024 analysis

---

## Summary

| Domain | Status | Issues Found | Action Taken |
|--------|--------|--------------|-------------|
| Budget | ✅ Verified | 0 | — |
| Economy | ✅ Verified | 1 minor | GDP/CPI annotation |
| RBI | ✅ Verified | 0 | — |
| Census | ✅ Verified | 0 | — |
| States | ✅ Verified | 0 | — |
| Elections | ✅ Fixed | 4 | Assets, wealthiest list, alliance totals, missing parties |
| Employment | ✅ Fixed | 3 | Youth unemp, self-employed, female LFPR |
| Education | ✅ Fixed | ALL | 32 UDISE+ states + 27 ASER states rebuilt from PDFs |
| Healthcare | ✅ Fixed | 21/30 | All immunization states replaced from NFHS-5 dataset |
| Environment | ✅ Fixed | 2 | Mizoram sign reversal, forest % |
| Crime | ✅ Fixed | 2 | Road accident causes |

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

## Verification Pass 2 (2026-03-05) — PDF Cross-Referencing

All 4 flagged sections from the initial audit have been resolved:

### 1. ✅ Education UDISE+ State Data — REBUILT
**Source**: UDISE+ 2023-24 Flash Statistics PDF (Tables 2.2, 2.5, 6.1, 6.13)
- All 32 state entries rebuilt from PDF tables
- Key corrections: Bihar teachers 430K→657,063, PTR 65→32, GER 104.1→83.4
- National total students updated: 234.9M→248.0M (Pre-Primary to Higher Secondary scope)

### 2. ✅ Education ASER State Data — REBUILT
**Source**: ASER 2024 Final Report (Jan 28, 2025), pages 52-53 state-wise maps
- 47 of 50 previous values were WRONG (AI-fabricated)
- All 27 states replaced with verified data
- Removed fabricated `canReadEnglish` metric
- Added 3 missing states (Arunachal Pradesh, Mizoram, Sikkim)
- Removed Manipur (insufficient sample size per ASER footnote)

### 3. ✅ Healthcare NFHS-5 Immunization — REPLACED
**Source**: pratapvardhan/NFHS-5 CSV dataset (DOI: 10.7910/DVN/42WNZF)
- All 30 state entries replaced from machine-readable NFHS-5 extraction
- 21 of 30 states had errors >5 percentage points
- Bihar 54.2→71.0%, Kerala 84.2→77.8%, Odisha 73.2→90.5%

### 4. ✅ Elections Alliance Totals — FIXED
**Source**: ECI Official Results + ADR 2024 analysis (page 32)
- Added 17 missing smaller alliance parties (9 NDA, 6 INDIA, 2 Others)
- Fixed totals: NDA 284→293, INDIA 221→234, Others 38→16
- Expanded topWealthiest from 3 to 10 verified entries

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
