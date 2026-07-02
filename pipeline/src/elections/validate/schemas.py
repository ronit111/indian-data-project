"""
Pydantic models matching the TypeScript schema contract for the Elections domain.
"""

from pydantic import BaseModel


# ── Shared ─────────────────────────────────────────────────────────

class GlossaryTerm(BaseModel):
    id: str
    term: str
    simple: str
    detail: str
    inContext: str | None = None
    relatedTerms: list[str] | None = None


class GlossaryData(BaseModel):
    domain: str
    year: str
    terms: list[GlossaryTerm]


class StateValue(BaseModel):
    id: str
    name: str
    value: float


# ── Summary ────────────────────────────────────────────────────────

class ElectionsSummary(BaseModel):
    year: str
    turnout2024: float
    totalElectorsCrore: float
    bjpSeats2024: int
    incSeats2024: int
    ndaSeats2024: int
    indiaAllianceSeats2024: int
    womenMPs2024: int
    womenMPsPct2024: float
    criminalPct: int
    seriousCriminalPct: int
    avgAssetsCrore: float
    totalConstituencies: int
    lastUpdated: str
    source: str


# ── Turnout ────────────────────────────────────────────────────────

class TurnoutPoint(BaseModel):
    year: str
    turnout: float
    electors: float
    lsNumber: int


class TurnoutEvent(BaseModel):
    year: str
    event: str


class StateTurnout(BaseModel):
    id: str
    name: str
    turnout: float


class TurnoutData(BaseModel):
    year: str
    nationalTrend: list[TurnoutPoint]
    events: list[TurnoutEvent]
    stateBreakdown2024: list[StateTurnout]
    source: str


# ── Results ────────────────────────────────────────────────────────

class SeatDataPoint(BaseModel):
    year: str
    seats: int
    totalSeats: int
    pct: float


class PartySeries(BaseModel):
    id: str
    name: str
    color: str
    data: list[SeatDataPoint]


class Party2024(BaseModel):
    party: str
    fullName: str
    seats: int
    voteShare: float
    color: str
    alliance: str


class AllianceTotals(BaseModel):
    NDA: int
    INDIA: int
    Others: int
    majorityMark: int


class ResultsData(BaseModel):
    year: str
    seatEvolution: list[PartySeries]
    parties2024: list[Party2024]
    allianceTotals2024: AllianceTotals
    source: str


# ── Candidates ─────────────────────────────────────────────────────

class CriminalBreakdown(BaseModel):
    totalMPs: int
    withAnyCases: int
    withSeriousCases: int
    pctAny: int
    pctSerious: int


class AssetsBreakdown(BaseModel):
    avgCrore: float


class EducationBreakdown(BaseModel):
    postGradAndAbove: int
    graduate: int
    belowGraduate: int


class WealthiestMP(BaseModel):
    rank: int
    name: str
    constituency: str
    party: str
    assetsCrore: float


class CriminalMP(BaseModel):
    rank: int
    name: str
    constituency: str
    party: str
    cases: int


class CandidatesData(BaseModel):
    year: str
    criminal: CriminalBreakdown
    assets: AssetsBreakdown
    education: EducationBreakdown
    topWealthiest: list[WealthiestMP]
    topCriminal: list[CriminalMP]
    source: str


# ── Representation ─────────────────────────────────────────────────

class WomenMPsPoint(BaseModel):
    year: str
    totalSeats: int
    womenMPs: int
    pct: float


class ReservationTarget(BaseModel):
    label: str
    pct: int
    note: str


class RepresentationData(BaseModel):
    year: str
    trend: list[WomenMPsPoint]
    target: ReservationTarget
    source: str


# ── Indicators (Explorer) ─────────────────────────────────────────

class ElectionsIndicator(BaseModel):
    id: str
    name: str
    category: str
    unit: str
    states: list[StateValue]
    source: str


class ElectionsIndicatorsData(BaseModel):
    year: str
    indicators: list[ElectionsIndicator]
