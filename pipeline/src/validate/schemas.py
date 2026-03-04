"""
Pydantic models matching the TypeScript schema contract.
Used to validate pipeline output before writing JSON.
"""

from pydantic import BaseModel, ConfigDict, Field, field_validator, model_validator


# ─── Budget Summary ───────────────────────────────────────────────
class BudgetSummary(BaseModel):
    year: str
    totalExpenditure: float
    totalReceipts: float
    revenueReceipts: float
    capitalReceipts: float
    fiscalDeficit: float
    fiscalDeficitPercentGDP: float
    population: int
    perCapitaExpenditure: float
    perCapitaDailyExpenditure: float
    gdp: float
    lastUpdated: str
    source: str


# ─── Revenue / Receipts ──────────────────────────────────────────
class RevenueCategory(BaseModel):
    id: str
    name: str
    amount: float
    percentOfTotal: float
    previousYear: float | None
    yoyChange: float | None


class ReceiptsData(BaseModel):
    year: str
    total: float
    note: str | None = None
    categories: list[RevenueCategory]


# ─── Expenditure ─────────────────────────────────────────────────
class SchemeAllocation(BaseModel):
    id: str
    name: str
    amount: float


class MinistryExpenditure(BaseModel):
    id: str
    name: str
    budgetEstimate: float
    revisedEstimate: float | None
    actualExpenditure: float | None
    percentOfTotal: float
    yoyChange: float | None
    perCapita: float
    humanContext: str
    schemes: list[SchemeAllocation]


class ExpenditureData(BaseModel):
    year: str
    total: float
    ministries: list[MinistryExpenditure]


# ─── Sankey ──────────────────────────────────────────────────────
class SankeyNode(BaseModel):
    id: str
    name: str
    group: str  # 'revenue' | 'center' | 'expenditure'
    value: float

    @field_validator("group")
    @classmethod
    def validate_group(cls, v: str) -> str:
        if v not in ("revenue", "center", "expenditure"):
            raise ValueError(f"Invalid group: {v}")
        return v


class SankeyLink(BaseModel):
    source: str
    target: str
    value: float
    verified: bool


class SankeyData(BaseModel):
    year: str
    nodes: list[SankeyNode]
    links: list[SankeyLink]


# ─── Treemap ─────────────────────────────────────────────────────
class TreemapNode(BaseModel):
    name: str
    id: str
    value: float | None = None
    percentOfTotal: float | None = None
    children: list["TreemapNode"] | None = None


class TreemapData(BaseModel):
    year: str
    root: TreemapNode


# ─── State-wise Transfers ────────────────────────────────────────
class StateTransfer(BaseModel):
    id: str
    name: str
    transfer: float
    perCapita: float
    percentOfTotal: float
    population: int


class StatewiseData(BaseModel):
    year: str
    totalTransfers: float
    note: str | None = None
    states: list[StateTransfer]


# ─── Schemes ─────────────────────────────────────────────────────
class GovernmentScheme(BaseModel):
    id: str
    name: str
    ministry: str
    ministryName: str
    allocation: float
    previousYear: float | None
    yoyChange: float | None
    humanContext: str


class SchemesData(BaseModel):
    year: str
    schemes: list[GovernmentScheme]


# ─── Tax Calculator ──────────────────────────────────────────────
class TaxSlab(BaseModel):
    from_: float = Field(alias="from")  # 'from' is reserved in Python
    to: float | None
    rate: float

    model_config = ConfigDict(populate_by_name=True)

    # Serialize with 'from' key (not 'from_')
    def model_dump(self, **kwargs):
        d = super().model_dump(**kwargs)
        d["from"] = d.pop("from_")
        return d


class TaxRegime(BaseModel):
    slabs: list[TaxSlab]
    standardDeduction: float
    rebateLimit: float


class TaxSlabsData(BaseModel):
    assessmentYear: str
    financialYear: str
    regimes: dict[str, TaxRegime]  # {"new": TaxRegime, "old": TaxRegime}
    cess: float
    surchargeSlabs: list[TaxSlab]


class ExpenditureShare(BaseModel):
    id: str
    name: str
    percentOfExpenditure: float
    humanContext: str
    humanContextMultiplier: float


class ExpenditureSharesData(BaseModel):
    year: str
    shares: list[ExpenditureShare]


# ─── Budget Trends (20-Year Historical) ──────────────────────────
class BudgetTrendYear(BaseModel):
    year: str
    expenditure: float           # Rs crore
    receipts: float              # Rs crore
    fiscalDeficit: float         # Rs crore
    fiscalDeficitPctGDP: float   # %
    revenueDeficitPctGDP: float  # %


class BudgetTrendsData(BaseModel):
    year: str
    series: list[BudgetTrendYear]
    source: str


# ─── Budget vs Actual ────────────────────────────────────────────
class BudgetVsActualYear(BaseModel):
    year: str
    be: float                    # Budget Estimate, Rs crore
    re: float | None = None      # Revised Estimate (may be absent for oldest years)
    actual: float | None = None  # Actual expenditure (may be absent for current year)


class MinistryBudgetHistory(BaseModel):
    id: str
    name: str
    history: list[BudgetVsActualYear]


class BudgetVsActualData(BaseModel):
    year: str
    ministries: list[MinistryBudgetHistory]
    source: str


# ─── Year Index ──────────────────────────────────────────────────
class YearIndex(BaseModel):
    years: list[str]
    latest: str
