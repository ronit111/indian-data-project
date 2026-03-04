"""
Pydantic models matching the TypeScript schema contract for the Economy domain.
Used to validate pipeline output before writing JSON.
"""

from pydantic import BaseModel


# ─── Economy Summary ─────────────────────────────────────────────
class EconomySummary(BaseModel):
    year: str
    surveyDate: str
    realGDPGrowth: float
    nominalGDP: float
    projectedGrowthLow: float
    projectedGrowthHigh: float
    cpiInflation: float
    fiscalDeficitPercentGDP: float
    currentAccountDeficitPercentGDP: float
    population: int
    perCapitaGDP: float
    lastUpdated: str
    source: str


# ─── Time Series (shared) ────────────────────────────────────────
class TimeSeriesPoint(BaseModel):
    year: str
    value: float
    label: str | None = None


# ─── GDP Growth ──────────────────────────────────────────────────
class GDPGrowthData(BaseModel):
    year: str
    indicator: str
    unit: str
    series: list[TimeSeriesPoint]
    source: str


# ─── Inflation ───────────────────────────────────────────────────
class InflationSeries(BaseModel):
    period: str
    cpiHeadline: float
    cpiFood: float | None = None
    cpiCore: float | None = None


class CPICategoryPoint(BaseModel):
    period: str
    value: float


class CPICategoryEntry(BaseModel):
    division: str  # COICOP code: '01', '04', '06', '07', '10'
    name: str
    source: str
    series: list[CPICategoryPoint]


class WPIEntry(BaseModel):
    year: str
    wpiIndex: float
    wpiInflation: float | None = None


class TargetBand(BaseModel):
    lower: float
    upper: float


class InflationData(BaseModel):
    year: str
    targetBand: TargetBand
    series: list[InflationSeries]
    cpiByCategory: list[CPICategoryEntry] = []
    wpiSeries: list[WPIEntry] = []
    source: str


# ─── Fiscal ──────────────────────────────────────────────────────
class FiscalYearData(BaseModel):
    year: str
    fiscalDeficitPctGDP: float
    revenueDeficitPctGDP: float
    primaryDeficitPctGDP: float


class FiscalData(BaseModel):
    year: str
    targetFiscalDeficit: float
    series: list[FiscalYearData]
    source: str


# ─── External Sector ─────────────────────────────────────────────
class ExternalYearData(BaseModel):
    year: str
    exports: float
    imports: float
    tradeBalance: float
    cadPctGDP: float
    forexReserves: float


class ExternalData(BaseModel):
    year: str
    series: list[ExternalYearData]
    source: str


# ─── Sectors ─────────────────────────────────────────────────────
class SectorGrowth(BaseModel):
    id: str
    name: str
    currentGrowth: float
    fiveYearAvg: float
    gvaShare: float


class SectorsData(BaseModel):
    year: str
    sectors: list[SectorGrowth]
    source: str


# ─── Economic Indicators (Explorer) ──────────────────────────────
class EconomicIndicator(BaseModel):
    id: str
    name: str
    category: str
    unit: str
    series: list[TimeSeriesPoint]
    source: str


class IndicatorsData(BaseModel):
    year: str
    indicators: list[EconomicIndicator]
