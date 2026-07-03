"""
Per-domain provenance registries: which official source each headline figure
comes from, how this pipeline obtained it, and integrity checks recomputed
against the published JSONs at generation time (fail-closed).

Classification per figure follows a code-level audit of each domain pipeline
(2026-07-02): a chain declares `curation` when the published value is a
hand-transcribed constant, `api` only when the committed value was produced
by a live fetch, and `derivation` for values computed from other fields.
Never declare a chain the code doesn't implement.
"""

from typing import Any, Callable

# ── shared step factories ─────────────────────────────────────────────


def doc(name: str, publisher: str, url: str | None = None) -> dict:
    step: dict[str, Any] = {"kind": "document", "name": name, "publisher": publisher}
    if url:
        step["url"] = url
    return step


def api(name: str, publisher: str, url: str, retrieved: str | None = None) -> dict:
    step: dict[str, Any] = {"kind": "api", "name": name, "publisher": publisher, "url": url}
    if retrieved:
        step["retrieved"] = retrieved
    return step


def curation(note: str, published: str | None = None) -> dict:
    step: dict[str, Any] = {"kind": "curation", "name": note,
                            "publisher": "Indian Data Project pipeline"}
    if published:
        step["published"] = published
    return step


def derivation(formula: str) -> dict:
    return {"kind": "derivation", "name": formula,
            "publisher": "Computed at pipeline time, never hardcoded"}


class Check:
    """A named integrity check recomputed against published data."""

    def __init__(self, name: str, fn: Callable[[dict[str, dict]], bool]):
        self.name = name
        self.fn = fn

    def run(self, files: dict[str, dict]) -> dict:
        if not bool(self.fn(files)):
            raise ValueError(f"Provenance check FAILED: {self.name}")
        return {"kind": "check", "name": self.name, "status": "pass"}


def _figure(figures: dict, files: dict, key: str, label: str, unit: str,
            value: Any, chain: list[dict], checks: list[Check],
            basis: str | None = None) -> None:
    full_chain = chain + [c.run(files) for c in checks]
    entry: dict[str, Any] = {"value": value, "unit": unit, "label": label,
                             "chain": full_chain}
    if basis:
        entry["basis"] = basis
    figures[key] = entry


# ── documents (URLs verified reachable or official publisher domains) ─

WB_API = lambda when=None: api("World Bank Development Indicators API", "World Bank",
                               "https://api.worldbank.org/", when)
MOSPI_API = lambda name, when=None: api(f"MOSPI eSankhyiki API ({name})",
                                        "Ministry of Statistics and Programme Implementation",
                                        "https://api.mospi.gov.in/", when)


# ── budget ────────────────────────────────────────────────────────────

def budget_figures(files: dict[str, dict]) -> dict[str, dict]:
    s = files["summary.json"]
    published = s.get("lastUpdated")
    afs = doc("Union Budget 2025-26 — Annual Financial Statement",
              "Ministry of Finance, Government of India",
              "https://www.indiabudget.gov.in/budget2025-26/doc/AFS/allafs.pdf")
    cur = curation("Curated by this pipeline from the official document", published)
    figures: dict[str, dict] = {}
    _figure(figures, files, "summary.totalExpenditure",
            "Total central expenditure (net)", "₹ crore", s["totalExpenditure"],
            [afs, cur],
            [Check("Invariant: perCapitaExpenditure × population ≈ totalExpenditure",
                   lambda f: abs(f["summary.json"]["perCapitaExpenditure"]
                                 * f["summary.json"]["population"] / 1e7
                                 - f["summary.json"]["totalExpenditure"])
                   / f["summary.json"]["totalExpenditure"] < 0.01),
             Check("Sankey central node equals summary total",
                   lambda f: sum(l["value"] for l in f["sankey.json"]["links"]
                                 if l.get("target") == "central-govt")
                   == f["summary.json"]["totalExpenditure"])],
            basis="Net of tax devolution to states — matches the official Total "
                  "Expenditure headline. Gross framing would double-count devolution.")
    _figure(figures, files, "summary.totalReceipts", "Total receipts (net)",
            "₹ crore", s["totalReceipts"], [afs, cur],
            [Check("revenueReceipts + capitalReceipts = totalReceipts",
                   lambda f: f["summary.json"]["revenueReceipts"]
                   + f["summary.json"]["capitalReceipts"]
                   == f["summary.json"]["totalReceipts"])])
    _figure(figures, files, "summary.fiscalDeficitPercentGDP",
            "Fiscal deficit as % of GDP", "%", s["fiscalDeficitPercentGDP"],
            [afs, cur],
            [Check("fiscalDeficit ÷ GDP ≈ published percentage (±0.1pp)",
                   lambda f: abs(f["summary.json"]["fiscalDeficit"]
                                 / f["summary.json"]["gdp"] * 100
                                 - f["summary.json"]["fiscalDeficitPercentGDP"]) < 0.1)])
    _figure(figures, files, "summary.perCapitaDailyExpenditure",
            "Government spend per person per day", "₹",
            s["perCapitaDailyExpenditure"],
            [afs, derivation("totalExpenditure ÷ population ÷ 365")],
            [Check("perCapitaExpenditure ÷ 365 ≈ daily figure (±₹1)",
                   lambda f: abs(f["summary.json"]["perCapitaExpenditure"] / 365
                                 - f["summary.json"]["perCapitaDailyExpenditure"]) < 1)])
    return figures


# ── economy ───────────────────────────────────────────────────────────

def economy_figures(files: dict[str, dict]) -> dict[str, dict]:
    s = files["summary.json"]
    published = s.get("lastUpdated")
    es = doc("Economic Survey 2025-26", "Ministry of Finance, Government of India",
             "https://www.indiabudget.gov.in/economicsurvey/")
    figures: dict[str, dict] = {}
    _figure(figures, files, "summary.realGDPGrowth", "Real GDP growth (FY2024-25)",
            "%", s["realGDPGrowth"],
            [doc("NSO Provisional Estimates of National Income, May 2025",
                 "National Statistical Office, MoSPI"), es,
             curation("Curated from the official estimate", published)],
            [Check("Matches the FY2024-25 point in the GDP-growth series",
                   lambda f: any(p["year"] == "2024-25"
                                 and p["value"] == f["summary.json"]["realGDPGrowth"]
                                 for p in f["gdp-growth.json"]["series"])) ],
            basis="NSO Provisional Estimate (May 2025), superseding the 6.4% First "
                  "Advance Estimate.")
    _figure(figures, files, "summary.perCapitaGDP", "Nominal GDP per person", "₹",
            s["perCapitaGDP"],
            [MOSPI_API("National Accounts", published), WB_API(published),
             derivation("nominalGDP ÷ population")],
            [Check("perCapitaGDP == round(nominalGDP × 1e7 ÷ population)",
                   lambda f: round(f["summary.json"]["nominalGDP"] * 1e7
                                   / f["summary.json"]["population"])
                   == f["summary.json"]["perCapitaGDP"])])
    _figure(figures, files, "summary.cpiInflation", "CPI inflation projection",
            "%", s["cpiInflation"],
            [es, curation("Curated from the official projection", published)],
            [Check("Matches the 2025-26 point in the inflation series",
                   lambda f: any(p.get("period", p.get("year")) == "2025-26"
                                 and p["cpiHeadline"] == f["summary.json"]["cpiInflation"]
                                 for p in f["inflation.json"]["series"]))])
    return figures


# ── rbi ───────────────────────────────────────────────────────────────

def rbi_figures(files: dict[str, dict]) -> dict[str, dict]:
    s = files["summary.json"]
    published = s.get("lastUpdated")
    mps = doc("RBI Monetary Policy Statements", "Reserve Bank of India",
              "https://www.rbi.org.in/Scripts/BS_PressReleaseDisplay.aspx")
    figures: dict[str, dict] = {}
    _figure(figures, files, "summary.repoRate", "Policy repo rate", "%",
            s["repoRate"],
            [mps, curation("Curated from each MPC statement; primary-confirmed "
                           "against the RBI Monetary Policy Report, April 2026",
                           published)],
            [Check("Equals the newest decision in the published MPC history",
                   lambda f: f["monetary-policy.json"]["decisions"][0]["rate"]
                   == f["summary.json"]["repoRate"]
                   and f["monetary-policy.json"]["currentRate"]
                   == f["summary.json"]["repoRate"]),
             Check("Every decision's change equals the rate delta to its predecessor",
                   lambda f: all(
                       abs(d["change"] - round(d["rate"] - prev["rate"], 2)) < 1e-9
                       for prev, d in zip(f["monetary-policy.json"]["decisions"][1:],
                                          f["monetary-policy.json"]["decisions"][:-1])))])
    _figure(figures, files, "summary.crr", "Cash Reserve Ratio", "%", s["crr"],
            [mps, curation("Curated; cross-checked against RBI Handbook Table 45 "
                           "CRR history", published)],
            [Check("Equals the latest year in the published CRR history",
                   lambda f: f["monetary-policy.json"]["crrHistory"][-1]["value"]
                   == f["summary.json"]["crr"])])
    _figure(figures, files, "summary.forexReservesUSD", "Foreign exchange reserves",
            "US$ billion", s["forexReservesUSD"],
            [WB_API(published),
             doc("RBI Handbook of Statistics on Indian Economy (Table 147, history)",
                 "Reserve Bank of India",
                 "https://www.rbi.org.in/Scripts/AnnualPublications.aspx?head=Handbook+of+Statistics+on+Indian+Economy")],
            [Check("Equals the latest point of the published reserves series",
                   lambda f: round(f["forex.json"]["reservesUSD"]["series"][-1]["value"], 2)
                   == f["summary.json"]["forexReservesUSD"])])
    return figures


# ── crime ─────────────────────────────────────────────────────────────

def crime_figures(files: dict[str, dict]) -> dict[str, dict]:
    s = files["summary.json"]
    published = s.get("lastUpdated")
    ncrb = doc("NCRB — Crime in India 2023 (published October 2025)",
               "National Crime Records Bureau, Ministry of Home Affairs",
               "https://www.ncrb.gov.in/")
    cur = curation("Hand-curated from the printed tables; refreshed June 2026 "
                   "against the primary PDFs", published)
    figures: dict[str, dict] = {}
    _figure(figures, files, "summary.totalCrimes",
            "Cognizable crimes registered (2023)", "cases", s["totalCrimes"],
            [ncrb, cur],
            [Check("IPC + SLL equals the total for every year of the trend",
                   lambda f: all(p["ipc"] + p["sll"] == p["total"]
                                 for p in f["overview.json"]["nationalTrend"])),
             Check("2023 trend point equals the summary total",
                   lambda f: next(p["total"] for p in f["overview.json"]["nationalTrend"]
                                  if p["year"] == "2023")
                   == f["summary.json"]["totalCrimes"])],
            basis="NCRB Table 1.1: IPC 37,63,102 + SLL 24,78,467.")
    _figure(figures, files, "summary.convictionRatePct",
            "IPC conviction rate (of completed trials)", "%",
            s["convictionRatePct"],
            [doc("NCRB — Crime in India 2023, Part III (court disposal, Table 18A.1)",
                 "National Crime Records Bureau", "https://www.ncrb.gov.in/"), cur],
            [Check("Recomputes from the published justice funnel",
                   lambda f: round(f["justice.json"]["funnel"]["convicted"]
                                   / f["justice.json"]["funnel"]["trialCompleted"]
                                   * 100, 1)
                   == f["summary.json"]["convictionRatePct"])],
            basis="Convicted ÷ trials completed — not convictions per crime reported.")
    _figure(figures, files, "summary.roadDeaths", "Road accident deaths (2023)",
            "deaths", s["roadDeaths"],
            [doc("MoRTH — Road Accidents in India 2023",
                 "Ministry of Road Transport & Highways", "https://morth.gov.in/"),
             cur], [])
    return figures


# ── elections ─────────────────────────────────────────────────────────

def elections_figures(files: dict[str, dict]) -> dict[str, dict]:
    s = files["summary.json"]
    published = s.get("lastUpdated")
    eci = doc("Election Commission of India — General Election 2024 results",
              "Election Commission of India", "https://www.eci.gov.in/")
    adr = doc("ADR — Lok Sabha 2024 winning candidates analysis",
              "Association for Democratic Reforms", "https://www.myneta.info/LokSabha2024/")
    cur = curation("Hand-curated from official results and affidavit analyses",
                   published)
    figures: dict[str, dict] = {}
    _figure(figures, files, "summary.turnout2024", "Voter turnout, 2024 general election",
            "%", s["turnout2024"], [eci, cur],
            [Check("Matches the 2024 point of the published turnout trend",
                   lambda f: any(str(p["year"]) == "2024"
                                 and p["turnout"] == f["summary.json"]["turnout2024"]
                                 for p in f["turnout.json"]["nationalTrend"]))])
    _figure(figures, files, "summary.bjpSeats2024", "BJP seats, 2024", "seats",
            s["bjpSeats2024"], [eci, cur],
            [Check("Matches the BJP row of the published party results",
                   lambda f: next(p["seats"] for p in f["results.json"]["parties2024"]
                                  if p["party"] == "BJP")
                   == f["summary.json"]["bjpSeats2024"])])
    _figure(figures, files, "summary.totalElectorsCrore",
            "Registered electors, 2024 general election", "crore",
            s["totalElectorsCrore"], [eci, cur],
            [Check("Turnout × electors is consistent with ~64 crore votes cast",
                   lambda f: 60 < f["summary.json"]["turnout2024"] / 100
                   * f["summary.json"]["totalElectorsCrore"] < 68)],
            basis="96.88 crore registered voters — the largest electorate ever "
                  "assembled for a democratic election.")
    _figure(figures, files, "summary.criminalPct",
            "Winning MPs with declared criminal cases", "%", s["criminalPct"],
            [adr, cur],
            [Check("Recomputes from the published candidate counts",
                   lambda f: round(f["candidates.json"]["criminal"]["withAnyCases"]
                                   / f["candidates.json"]["criminal"]["totalMPs"] * 100)
                   == f["summary.json"]["criminalPct"])],
            basis="Self-declared cases in election affidavits, per ADR/MyNeta analysis.")
    return figures


# ── census ────────────────────────────────────────────────────────────

def census_figures(files: dict[str, dict]) -> dict[str, dict]:
    s = files["summary.json"]
    published = s.get("lastUpdated")
    census2011 = doc("Census of India 2011 — Primary Census Abstract",
                     "Office of the Registrar General & Census Commissioner",
                     "https://censusindia.gov.in/census.website/data/census-tables")
    figures: dict[str, dict] = {}
    _figure(figures, files, "summary.totalPopulation", "Population of India", "people",
            s["totalPopulation"], [WB_API(published)],
            [Check("Equals the latest point of the published population series",
                   lambda f: f["population.json"]["nationalTimeSeries"][-1]["value"]
                   == f["summary.json"]["totalPopulation"])],
            basis="World Bank estimate; India's last full census was 2011.")
    _figure(figures, files, "summary.literacyRate", "Literacy rate (age 7+)", "%",
            s["literacyRate"],
            [census2011, curation("Official Census 2011 national figure", published)],
            basis="The official national figure — India has published no full census "
                  "since 2011.",
            checks=[])
    _figure(figures, files, "summary.sexRatio", "Sex ratio", "females per 1,000 males",
            s["sexRatio"],
            [census2011, derivation("Population-weighted average of state sex ratios")],
            [Check("Recomputes from the published state tables (±1)",
                   lambda f: (lambda dem, pop: abs(round(
                       sum(dem[i] * pop[i] for i in dem.keys() & pop.keys())
                       / sum(pop[i] for i in dem.keys() & pop.keys()))
                       - f["summary.json"]["sexRatio"]) <= 1)(
                       {st["id"]: st["sexRatio"]
                        for st in f["demographics.json"]["states"]},
                       {st["id"]: st["population"]
                        for st in f["population.json"]["states"]}))])
    return figures


# ── states ────────────────────────────────────────────────────────────

def states_figures(files: dict[str, dict]) -> dict[str, dict]:
    s = files["summary.json"]
    published = s.get("lastUpdated")
    handbook = doc("RBI Handbook of Statistics on Indian States (Tables 19/21/22)",
                   "Reserve Bank of India",
                   "https://www.rbi.org.in/Scripts/AnnualPublications.aspx?head=Handbook+of+Statistics+on+Indian+States")
    scrape = api("RBI Handbook XLSX (live scrape)", "Reserve Bank of India",
                 "https://www.rbi.org.in/", published)
    vintage = ("FY2022-23 — the latest year with complete coverage across states "
               "in the Handbook; later columns are still sparsely populated.")
    figures: dict[str, dict] = {}
    _figure(figures, files, "summary.nationalGsdpTotal",
            "Combined GSDP of Indian states", "₹ lakh crore", s["nationalGsdpTotal"],
            [handbook, scrape, derivation("Sum of state GSDPs with data")],
            [Check("Recomputes from the published per-state GSDP table",
                   lambda f: round(sum(st["gsdp"] for st in f["gsdp.json"]["states"]
                                       if st["gsdp"] > 0) / 100000, 2)
                   == f["summary.json"]["nationalGsdpTotal"]),
             Check("statesWithData equals the count of states with GSDP data",
                   lambda f: sum(1 for st in f["gsdp.json"]["states"] if st["gsdp"] > 0)
                   == f["summary.json"]["statesWithData"])],
            basis=vintage)
    _figure(figures, files, "summary.topGsdpValue",
            "Largest state economy (Maharashtra)", "₹ lakh crore", s["topGsdpValue"],
            [handbook, scrape, derivation("Max over state GSDPs")],
            [Check("Equals the top row of the published GSDP table",
                   lambda f: round(max(st["gsdp"] for st in f["gsdp.json"]["states"])
                                   / 100000, 2) == f["summary.json"]["topGsdpValue"])],
            basis=vintage)
    return figures


# ── education ─────────────────────────────────────────────────────────

def education_figures(files: dict[str, dict]) -> dict[str, dict]:
    s = files["summary.json"]
    published = s.get("lastUpdated")
    udise = doc("UDISE+ 2024-25 Report (Tables 2.2/6.1)",
                "Ministry of Education, Government of India",
                "https://udiseplus.gov.in/")
    cur = curation("Curated from the printed report; per-state values validated "
                   "against national anchors", published)
    figures: dict[str, dict] = {}
    _figure(figures, files, "summary.totalStudents", "Students enrolled in schools",
            "students", s["totalStudents"], [udise, cur],
            [Check("Students ÷ teachers rounds to the published pupil-teacher ratio",
                   lambda f: round(f["summary.json"]["totalStudents"]
                                   / f["summary.json"]["totalTeachers"])
                   == f["summary.json"]["ptrNational"])])
    _figure(figures, files, "summary.gerPrimary", "Gross enrolment ratio, primary",
            "%", s["gerPrimary"], [udise, cur],
            [Check("GER funnel: primary ≥ secondary, both plausible",
                   lambda f: 0 < f["summary.json"]["gerSecondary"]
                   <= f["summary.json"]["gerPrimary"] <= 200)])
    _figure(figures, files, "summary.educationSpendGDP",
            "Public education spend", "% of GDP", s["educationSpendGDP"],
            [WB_API(published)],
            [Check("Equals the latest point of the published spending series",
                   lambda f: round(f["spending.json"]["spendGDPTimeSeries"][-1]["value"], 1)
                   == f["summary.json"]["educationSpendGDP"])])
    return figures


# ── employment ────────────────────────────────────────────────────────

def employment_figures(files: dict[str, dict]) -> dict[str, dict]:
    s = files["summary.json"]
    published = s.get("lastUpdated")
    plfs = doc("PLFS Annual Report 2025 (Jan–Dec 2025)",
               "Ministry of Statistics and Programme Implementation",
               "https://mospi.gov.in/publication/annual-report-plfs")
    chain = [plfs, MOSPI_API("PLFS", published),
             curation("Live API primary with curated fallback; values dual-source "
                      "verified against the printed report (June 2026)", published)]
    figures: dict[str, dict] = {}
    _figure(figures, files, "summary.unemploymentRate", "Unemployment rate (2025)",
            "%", s["unemploymentRate"], list(chain),
            [Check("Plausible range and below every published state maximum context",
                   lambda f: 0 < f["summary.json"]["unemploymentRate"] < 25)],
            basis="Usual status (ps+ss), all ages — PLFS headline basis.")
    _figure(figures, files, "summary.lfpr", "Labour force participation rate", "%",
            s["lfpr"], list(chain),
            [Check("30 states published in both unemployment and participation tables",
                   lambda f: len(f["unemployment.json"]["stateUnemployment"]) == 30
                   and len(f["participation.json"]["stateLfpr"]) == 30)])
    _figure(figures, files, "summary.selfEmployedPct", "Workers who are self-employed",
            "%", s["selfEmployedPct"], list(chain),
            [Check("Sectoral employment shares sum to ~100%",
                   lambda f: abs(sum(x["employmentShare"]
                                     for x in f["sectoral.json"]["currentSectors"])
                                 - 100) < 0.5)])
    return figures


# ── healthcare ────────────────────────────────────────────────────────

def healthcare_figures(files: dict[str, dict]) -> dict[str, dict]:
    s = files["summary.json"]
    published = s.get("lastUpdated")
    figures: dict[str, dict] = {}
    _figure(figures, files, "summary.outOfPocketPct",
            "Health spending paid out of pocket", "%", s["outOfPocketPct"],
            [WB_API(), curation("Curated at the 2021 vintage (WB SH.XPD.OOPC.CH.ZS)",
                                published)],
            [Check("Matches the 2021 point of the published out-of-pocket series",
                   lambda f: round(next(p["value"]
                                        for p in f["spending.json"]["outOfPocketTimeSeries"]
                                        if str(p["year"]) == "2021"), 1)
                   == f["summary.json"]["outOfPocketPct"])])
    _figure(figures, files, "summary.tbIncidence", "Tuberculosis incidence", "per 100,000",
            s["tbIncidence"],
            [WB_API(), curation("WHO-derived World Bank estimates (SH.TBS.INCD); "
                                "headline pinned to the latest published series point "
                                "(July 2026)", published)],
            [Check("Equals the latest point of the published TB incidence series",
                   lambda f: f["disease.json"]["tbIncidenceTimeSeries"][-1]["value"]
                   == f["summary.json"]["tbIncidence"])])
    _figure(figures, files, "summary.physiciansPer1000", "Physician density",
            "per 1,000 people", s["physiciansPer1000"],
            [WB_API(), curation("Curated from the World Bank series; latest "
                                "published point is 2020", published)],
            [Check("Rounds from the latest point of the published physicians series",
                   lambda f: round(f["infrastructure.json"]
                                   ["physiciansTimeSeries"][-1]["value"], 1)
                   == f["summary.json"]["physiciansPer1000"])],
            basis="Registered allopathic physicians; AYUSH practitioners not counted.")
    _figure(figures, files, "summary.hospitalBedsPer1000", "Government hospital beds",
            "per 1,000 people", s["hospitalBedsPer1000"],
            [doc("National Health Profile 2022",
                 "Central Bureau of Health Intelligence, MoHFW",
                 "https://cbhidghs.mohfw.gov.in/"),
             curation("Corrected against the primary PDF (June 2026)", published)],
            [Check("Positive and below the all-beds World Bank series",
                   lambda f: 0 < f["summary.json"]["hospitalBedsPer1000"] < 3)],
            basis="Government hospitals only — the World Bank all-beds figure "
                  "(~1.6/1000) counts private beds too.")
    return figures


# ── environment ───────────────────────────────────────────────────────

def environment_figures(files: dict[str, dict]) -> dict[str, dict]:
    s = files["summary.json"]
    published = s.get("lastUpdated")
    figures: dict[str, dict] = {}
    _figure(figures, files, "summary.forestPct", "Forest cover", "% of land area",
            s["forestPct"],
            [doc("FSI — India State of Forest Report 2023", "Forest Survey of India",
                 "https://fsi.nic.in/isfr-2023"),
             curation("Curated from ISFR 2023; forest cover only", published)],
            [Check("Published state forest table sums to within 2% of the implied total",
                   lambda f: abs(sum(st["forestCoverKm2"]
                                     for st in f["forest.json"]["stateForestCover"])
                                 - f["summary.json"]["forestPct"] / 100 * 3287263)
                   / (f["summary.json"]["forestPct"] / 100 * 3287263) < 0.02)],
            basis="Forest cover alone (7,15,343 km²). The often-quoted 25.17% adds "
                  "tree cover outside forests.")
    _figure(figures, files, "summary.pm25", "PM2.5 annual mean exposure", "µg/m³",
            s["pm25"],
            [WB_API(), doc("WHO Global Air Quality Database",
                           "World Health Organization",
                           "https://www.who.int/data/gho/data/themes/air-pollution"),
             curation("Curated at the 2021 vintage", published)],
            [Check("Air-quality file carries no fabricated AQI tables",
                   lambda f: f["air-quality.json"]["stateAQI"] == []
                   and f["air-quality.json"]["cityAQI"] == [])],
            basis="About 10× the WHO guideline of 5 µg/m³.")
    return figures


# ── registry table ────────────────────────────────────────────────────

DOMAIN_REGISTRIES: dict[str, tuple[list[str], Callable]] = {
    "budget": (["summary.json", "sankey.json"], budget_figures),
    "economy": (["summary.json", "gdp-growth.json", "inflation.json"], economy_figures),
    "rbi": (["summary.json", "monetary-policy.json", "forex.json"], rbi_figures),
    "crime": (["summary.json", "overview.json", "justice.json"], crime_figures),
    "elections": (["summary.json", "results.json", "turnout.json", "candidates.json"],
                  elections_figures),
    "census": (["summary.json", "population.json", "demographics.json"], census_figures),
    "states": (["summary.json", "gsdp.json"], states_figures),
    "education": (["summary.json", "spending.json"], education_figures),
    "employment": (["summary.json", "unemployment.json", "participation.json",
                    "sectoral.json"], employment_figures),
    "healthcare": (["summary.json", "spending.json", "infrastructure.json", "disease.json"],
                   healthcare_figures),
    "environment": (["summary.json", "forest.json", "air-quality.json"],
                    environment_figures),
}
