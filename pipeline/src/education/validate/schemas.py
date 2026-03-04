"""
Pydantic models matching the TypeScript schema contract for the Education domain.
Used to validate pipeline output before writing JSON.
"""

from pydantic import BaseModel


# ─── Shared ────────────────────────────────────────────────────────

class TimeSeriesPoint(BaseModel):
    year: str
    value: float


class StateValue(BaseModel):
    id: str
    name: str
    value: float


# ─── Education Summary ─────────────────────────────────────────────

class TopEnrolledState(BaseModel):
    name: str
    students: float


class EducationSummary(BaseModel):
    year: str
    totalStudents: float
    totalSchools: float
    totalTeachers: float
    gerPrimary: float
    gerSecondary: float
    ptrNational: float
    educationSpendGDP: float
    topEnrolledStates: list[TopEnrolledState]
    lastUpdated: str
    source: str


# ─── Enrollment ─────────────────────────────────────────────────────

class StateEnrollment(BaseModel):
    id: str
    name: str
    gerPrimary: float
    gerSecondary: float
    gerHigherSec: float
    dropoutPrimary: float
    dropoutSecondary: float


class EnrollmentData(BaseModel):
    year: str
    primaryTimeSeries: list[TimeSeriesPoint]
    secondaryTimeSeries: list[TimeSeriesPoint]
    tertiaryTimeSeries: list[TimeSeriesPoint]
    femaleSecondary: list[TimeSeriesPoint]
    maleSecondary: list[TimeSeriesPoint]
    primaryCompletion: list[TimeSeriesPoint]
    states: list[StateEnrollment]
    source: str


# ─── Quality ────────────────────────────────────────────────────────

class StateInfrastructure(BaseModel):
    id: str
    name: str
    ptr: float
    schoolsWithComputers: float
    schoolsWithInternet: float
    girlsToilets: float


class StateLearning(BaseModel):
    id: str
    name: str
    canReadStd2: float
    canDoSubtraction: float


class QualityData(BaseModel):
    year: str
    ptrPrimaryTimeSeries: list[TimeSeriesPoint]
    ptrSecondaryTimeSeries: list[TimeSeriesPoint]
    stateInfrastructure: list[StateInfrastructure]
    learningOutcomes: list[StateLearning]
    source: str


# ─── Spending ───────────────────────────────────────────────────────

class SpendingData(BaseModel):
    year: str
    spendGDPTimeSeries: list[TimeSeriesPoint]
    spendGovtTimeSeries: list[TimeSeriesPoint]
    outOfSchoolTimeSeries: list[TimeSeriesPoint]
    source: str


# ─── Education Indicators (Explorer) ───────────────────────────────

class EducationIndicator(BaseModel):
    id: str
    name: str
    category: str
    unit: str
    states: list[StateValue]
    source: str


class EducationIndicatorsData(BaseModel):
    year: str
    indicators: list[EducationIndicator]


# ─── Glossary ───────────────────────────────────────────────────────

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
