"""
Pydantic models matching the TypeScript schema contract for the State Finances domain.
Used to validate pipeline output before writing JSON.
"""

from pydantic import BaseModel


# ─── State GSDP ─────────────────────────────────────────────────────────

class StateGSDPEntry(BaseModel):
    id: str
    name: str
    gsdp: float            # Rs crore, current prices
    gsdpConstant: float | None = None  # Rs crore, constant prices (2011-12 base)
    growthRate: float      # % annual growth
    perCapitaNsdp: float   # Rs (Per Capita NSDP from RBI Table 19)
    population: float      # lakhs


class StateGSDPHistoryPoint(BaseModel):
    year: str
    value: float

class StateGSDPHistory(BaseModel):
    id: str
    name: str
    gsdp: list[StateGSDPHistoryPoint]

class GSDPData(BaseModel):
    year: str
    baseYear: str          # e.g. "2011-12"
    states: list[StateGSDPEntry]
    gsdpHistory: list[StateGSDPHistory] | None = None
    source: str


# ─── State Revenue ──────────────────────────────────────────────────────

class StateRevenueEntry(BaseModel):
    id: str
    name: str
    ownTaxRevenue: float        # Rs crore
    centralTransfers: float     # Rs crore
    totalRevenue: float         # Rs crore
    selfSufficiencyRatio: float # own/total as %


class RevenueData(BaseModel):
    year: str
    states: list[StateRevenueEntry]
    source: str


# ─── State Fiscal Health ────────────────────────────────────────────────

class StateFiscalEntry(BaseModel):
    id: str
    name: str
    fiscalDeficitPctGsdp: float
    debtToGsdp: float


class FiscalHealthData(BaseModel):
    year: str
    states: list[StateFiscalEntry]
    source: str


# ─── Summary (Hub Card) ────────────────────────────────────────────────

class StatesSummary(BaseModel):
    year: str
    topGsdpState: str
    topGsdpValue: float         # Rs lakh crore
    nationalGsdpTotal: float    # Rs lakh crore
    growthRange: str            # e.g. "3.2% – 14.1%"
    averagePerCapita: float     # Rs
    totalStatesAndUTs: int = 36
    statesWithData: int
    stateCount: int             # backward compat alias for statesWithData
    lastUpdated: str
    source: str
    note: str = ""


# ─── Indicators (Explorer) ─────────────────────────────────────────────

class StateValue(BaseModel):
    id: str
    name: str
    value: float


class StatesIndicator(BaseModel):
    id: str
    name: str
    category: str  # 'gsdp' | 'revenue' | 'fiscal' | 'percapita'
    unit: str
    states: list[StateValue]
    source: str


class StatesIndicatorsData(BaseModel):
    year: str
    indicators: list[StatesIndicator]
