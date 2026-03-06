"""
Pydantic models matching the TypeScript schema contract for the Crime & Safety domain.
"""

from typing import Optional
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

class CrimeSummary(BaseModel):
    year: str
    totalCrimes: int
    crimeRate: float
    roadDeaths: int
    chargesheetRatePct: float
    convictionRatePct: float
    womenCrimes: int
    cybercrimes: int
    policeRatioActual: float
    dataYear: str
    lastUpdated: str
    source: str


# ── Overview ───────────────────────────────────────────────────────

class CrimeTrendPoint(BaseModel):
    year: str
    total: int
    ipc: int
    sll: int
    rate: float


class CrimeComposition(BaseModel):
    id: str
    name: str
    cases: int
    pct: float


class StateCrimeRate(BaseModel):
    id: str
    name: str
    rate: float
    total: int


class HomicidePoint(BaseModel):
    year: str
    value: float


class CrimeOverviewData(BaseModel):
    year: str
    nationalTrend: list[CrimeTrendPoint]
    ipcComposition: list[CrimeComposition]
    stateRates: list[StateCrimeRate]
    homicideRate: list[HomicidePoint]
    source: str


# ── Women Safety ──────────────────────────────────────────────────

class WomenCrimeTrend(BaseModel):
    year: str
    total: int
    rate: float


class WomenCrimeType(BaseModel):
    id: str
    name: str
    cases: int
    pct: float


class StateWomenRate(BaseModel):
    id: str
    name: str
    rate: float
    total: int


class WomenSafetyData(BaseModel):
    year: str
    nationalTrend: list[WomenCrimeTrend]
    crimeTypes: list[WomenCrimeType]
    stateRates: list[StateWomenRate]
    source: str


# ── Road Accidents ────────────────────────────────────────────────

class RoadAccidentTrend(BaseModel):
    year: str
    accidents: int
    killed: int
    injured: int


class AccidentCause(BaseModel):
    id: str
    name: str
    pct: float


class StateFatality(BaseModel):
    id: str
    name: str
    rate: float
    killed: int


class RoadAccidentData(BaseModel):
    year: str
    nationalTrend: list[RoadAccidentTrend]
    causes: list[AccidentCause]
    stateFatalities: list[StateFatality]
    source: str


# ── Cybercrime ────────────────────────────────────────────────────

class CybercrimeTrend(BaseModel):
    year: str
    cases: int
    rate: float


class CybercrimeType(BaseModel):
    id: str
    name: str
    cases: int
    pct: float


class CybercrimeData(BaseModel):
    year: str
    ncrbTrend: list[CybercrimeTrend]
    crimeTypes: list[CybercrimeType]
    i4cComplaints: int
    i4cFinancialLossCrore: int
    i4cNote: str
    source: str


# ── Police Infrastructure ────────────────────────────────────────

class StatePoliceRatio(BaseModel):
    id: str
    name: str
    sanctioned: float
    actual: float


class PoliceData(BaseModel):
    year: str
    sanctionedStrength: int
    actualStrength: int
    vacancyPct: float
    sanctionedRatePerLakh: float
    actualRatePerLakh: float
    unRecommended: int
    womenPolicePct: float
    womenPoliceTotal: int
    stateRatios: list[StatePoliceRatio]
    source: str


# ── Justice Pipeline ──────────────────────────────────────────────

class JusticeFunnel(BaseModel):
    totalForInvestigation: int
    investigated: int
    chargesheeted: int
    chargesheetRate: float
    totalForTrial: int
    trialCompleted: int
    convicted: int
    acquitted: int
    convictionRate: float
    pendingInvestigation: int
    pendingTrial: int
    pendencyRate: float


class TrialDuration(BaseModel):
    avgYears: float
    casesOver5Years: float
    casesOver10Years: float
    judgesPerMillion: float


class JusticeData(BaseModel):
    year: str
    funnel: JusticeFunnel
    trialDuration: TrialDuration
    source: str


# ── Indicators (Explorer) ────────────────────────────────────────

class CrimeIndicator(BaseModel):
    id: str
    name: str
    category: str
    unit: str
    states: list[StateValue]
    source: str


class CrimeIndicatorsData(BaseModel):
    year: str
    indicators: list[CrimeIndicator]
