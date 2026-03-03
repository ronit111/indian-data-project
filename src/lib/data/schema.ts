/**
 * Shared data schema — the interface contract between the Python pipeline
 * (System A) and the React frontend (System B).
 *
 * Pipeline produces JSON matching these types → Frontend consumes them.
 * Any change here must be reflected in both systems.
 */

// ─── Budget Summary ────────────────────────────────────────────────
export interface BudgetSummary {
  year: string                    // "2025-26"
  totalExpenditure: number        // in Rs crore
  totalReceipts: number           // in Rs crore
  revenueReceipts: number
  capitalReceipts: number
  fiscalDeficit: number
  fiscalDeficitPercentGDP: number // e.g. 4.4
  population: number              // estimated population for per-capita
  perCapitaExpenditure: number    // Rs per person per year
  perCapitaDailyExpenditure: number
  gdp: number                    // nominal GDP in Rs crore
  lastUpdated: string            // ISO date
  source: string                 // URL to original data
}

// ─── Revenue / Receipts ────────────────────────────────────────────
export interface RevenueCategory {
  id: string                     // e.g. "income-tax", "gst", "borrowings"
  name: string
  amount: number                 // Rs crore
  percentOfTotal: number
  previousYear: number | null    // for YoY comparison
  yoyChange: number | null       // percentage
}

export interface ReceiptsData {
  year: string
  total: number
  note?: string
  categories: RevenueCategory[]
}

// ─── Expenditure (Ministry-wise) ───────────────────────────────────
export interface SchemeAllocation {
  id: string
  name: string
  amount: number                 // Rs crore
}

export interface MinistryExpenditure {
  id: string                     // e.g. "defence", "education", "health"
  name: string                   // "Ministry of Defence"
  budgetEstimate: number
  revisedEstimate: number | null
  actualExpenditure: number | null
  percentOfTotal: number
  yoyChange: number | null
  perCapita: number              // Rs per person
  humanContext: string           // "Enough for X school meals"
  schemes: SchemeAllocation[]
}

export interface ExpenditureData {
  year: string
  total: number
  ministries: MinistryExpenditure[]
}

// ─── Sankey Diagram ────────────────────────────────────────────────
export interface SankeyNode {
  id: string
  name: string
  group: 'revenue' | 'center' | 'expenditure'
  value: number                  // Rs crore
}

export interface SankeyLink {
  source: string                 // node id
  target: string                 // node id
  value: number                  // Rs crore
  verified?: boolean
}

export interface SankeyData {
  year: string
  nodes: SankeyNode[]
  links: SankeyLink[]
}

// ─── Treemap ───────────────────────────────────────────────────────
export interface TreemapNode {
  name: string
  id: string
  value?: number                 // Rs crore (leaf nodes)
  percentOfTotal?: number
  children?: TreemapNode[]
}

export interface TreemapData {
  year: string
  root: TreemapNode
}

// ─── State-wise Transfers ──────────────────────────────────────────
export interface StateTransfer {
  id: string                     // state code e.g. "UP", "MH"
  name: string
  transfer: number               // Rs crore
  perCapita: number
  percentOfTotal: number
  population: number
}

export interface StatewiseData {
  year: string
  totalTransfers: number
  note?: string
  states: StateTransfer[]
}

// ─── Schemes ───────────────────────────────────────────────────────
export interface GovernmentScheme {
  id: string
  name: string
  ministry: string               // ministry id
  ministryName: string
  allocation: number             // Rs crore
  previousYear: number | null
  yoyChange: number | null
  humanContext: string           // plain-language description
}

export interface SchemesData {
  year: string
  schemes: GovernmentScheme[]
}

// ─── Old Regime Deductions ─────────────────────────────────────────
export interface OldRegimeDeductions {
  section80C: number;
  section80D_self: number;
  section80D_parents: number;
  section80CCD1B: number;
  section24b: number;
  hra: number;
  section80TTA: number;
}

// ─── Tax Calculator ────────────────────────────────────────────────
export interface TaxSlab {
  from: number
  to: number | null              // null = no upper limit
  rate: number                   // percentage
}

export interface TaxRegime {
  slabs: TaxSlab[]
  standardDeduction: number
  rebateLimit: number
  surchargeMaxRate?: number
}

export interface TaxSlabsData {
  assessmentYear: string         // "2026-27"
  financialYear: string          // "2025-26"
  regimes: {
    new: TaxRegime
    old: TaxRegime
  }
  cess: number                   // percentage (4%)
  surchargeSlabs: TaxSlab[]
}

export interface ExpenditureShare {
  id: string                     // ministry id
  name: string
  percentOfExpenditure: number
  humanContext?: string
  humanContextMultiplier?: number
}

export interface ExpenditureSharesData {
  year: string
  shares: ExpenditureShare[]
}

// ─── Budget Trends (20-Year Historical) ───────────────────────────
export interface BudgetTrendYear {
  year: string;
  expenditure: number;           // Rs crore
  receipts: number;              // Rs crore
  fiscalDeficit: number;         // Rs crore
  fiscalDeficitPctGDP: number;   // %
  revenueDeficitPctGDP: number;  // %
}

export interface BudgetTrendsData {
  year: string;
  series: BudgetTrendYear[];
  source: string;
}

// ─── Budget vs Actual ─────────────────────────────────────────────
export interface BudgetVsActualYear {
  year: string;
  be: number;                    // Budget Estimate, Rs crore
  re: number | null;             // Revised Estimate
  actual: number | null;         // Actual expenditure
}

export interface MinistryBudgetHistory {
  id: string;
  name: string;
  history: BudgetVsActualYear[];
}

export interface BudgetVsActualData {
  year: string;
  ministries: MinistryBudgetHistory[];
  source: string;
}

// ─── Available Years ───────────────────────────────────────────────
export interface YearIndex {
  years: string[]                // ["2025-26", "2024-25", ...]
  latest: string
}

// ─── Economic Survey Summary ──────────────────────────────────────
export interface EconomySummary {
  year: string;
  surveyDate: string;
  realGDPGrowth: number;
  nominalGDP: number;
  projectedGrowthLow: number;
  projectedGrowthHigh: number;
  cpiInflation: number;
  fiscalDeficitPercentGDP: number;
  currentAccountDeficitPercentGDP: number;
  population: number;
  perCapitaGDP: number;
  lastUpdated: string;
  source: string;
}

// ─── Time Series (shared) ─────────────────────────────────────────
export interface TimeSeriesPoint {
  year: string;
  value: number;
  label?: string;
}

// ─── GDP Growth ───────────────────────────────────────────────────
export interface GDPGrowthData {
  year: string;
  indicator: string;
  unit: string;
  series: TimeSeriesPoint[];
  source: string;
}

// ─── Inflation ────────────────────────────────────────────────────
export interface InflationSeries {
  period: string;
  cpiHeadline: number;
  cpiFood: number | null;
  cpiCore: number | null;
}

export interface InflationData {
  year: string;
  targetBand: { lower: number; upper: number };
  series: InflationSeries[];
  cpiByCategory?: CPICategoryEntry[];
  source: string;
}

// ─── Fiscal ───────────────────────────────────────────────────────
export interface FiscalYearData {
  year: string;
  fiscalDeficitPctGDP: number;
  revenueDeficitPctGDP: number;
  primaryDeficitPctGDP: number;
}

export interface FiscalData {
  year: string;
  targetFiscalDeficit: number;
  series: FiscalYearData[];
  source: string;
}

// ─── External Sector ──────────────────────────────────────────────
export interface ExternalYearData {
  year: string;
  exports: number;
  imports: number;
  tradeBalance: number;
  cadPctGDP: number;
  forexReserves: number;
}

export interface ExternalData {
  year: string;
  series: ExternalYearData[];
  source: string;
}

// ─── Sectors ──────────────────────────────────────────────────────
export interface SectorGrowth {
  id: string;
  name: string;
  currentGrowth: number;
  fiveYearAvg: number;
  gvaShare: number;
}

export interface SectorsData {
  year: string;
  sectors: SectorGrowth[];
  source: string;
}

// ─── Economic Indicators (Explorer) ──────────────────────────────
export interface EconomicIndicator {
  id: string;
  name: string;
  category: string;
  unit: string;
  series: TimeSeriesPoint[];
  source: string;
}

export interface IndicatorsData {
  year: string;
  indicators: EconomicIndicator[];
}

// ─── RBI Data Domain ────────────────────────────────────────────

export interface RBISummary {
  year: string;
  repoRate: number;
  repoRateDate: string;
  stance: string;
  crr: number;
  slr: number;
  cpiLatest: number | null;
  forexReservesUSD: number | null;
  broadMoneyGrowth: number | null;
  lastUpdated: string;
  source: string;
}

export interface PolicyDecision {
  date: string;
  rate: number;
  change: number;
  stance: string;
}

export interface MonetaryPolicyData {
  year: string;
  currentRate: number;
  currentStance: string;
  decisions: PolicyDecision[];
  crrHistory: TimeSeriesPoint[];
  source: string;
}

export interface RBITimeSeries {
  series: TimeSeriesPoint[];
  unit: string;
  source: string;
}

export interface LiquidityData {
  year: string;
  broadMoneyGrowth: RBITimeSeries;
  broadMoneyPctGDP: RBITimeSeries;
}

export interface CreditData {
  year: string;
  domesticCreditPctGDP: RBITimeSeries;
  privateCreditPctGDP: RBITimeSeries;
  lendingRate: RBITimeSeries;
  depositRate: RBITimeSeries;
}

export interface ForexData {
  year: string;
  reservesUSD: RBITimeSeries;
  exchangeRate: RBITimeSeries;
}

export interface RBIIndicator {
  id: string;
  name: string;
  category: string;
  unit: string;
  series: TimeSeriesPoint[];
  source: string;
}

export interface RBIIndicatorsData {
  year: string;
  indicators: RBIIndicator[];
}

// ─── State Finances Domain ──────────────────────────────────────

export interface StateGSDPEntry {
  id: string;
  name: string;
  gsdp: number;              // Rs crore, current prices
  gsdpConstant: number | null; // Rs crore, constant prices (2011-12 base)
  growthRate: number;         // % annual growth
  perCapitaGsdp: number;      // Rs
  population: number;         // lakhs
}

export interface StateGSDPHistoryPoint {
  year: string;
  value: number;
}

export interface StateGSDPHistory {
  id: string;
  name: string;
  gsdp: StateGSDPHistoryPoint[];
}

export interface GSDPData {
  year: string;
  baseYear: string;
  states: StateGSDPEntry[];
  gsdpHistory?: StateGSDPHistory[];
  source: string;
}

export interface StateRevenueEntry {
  id: string;
  name: string;
  ownTaxRevenue: number;        // Rs crore
  centralTransfers: number;     // Rs crore
  totalRevenue: number;         // Rs crore
  selfSufficiencyRatio: number; // own/total as %
}

export interface RevenueData {
  year: string;
  states: StateRevenueEntry[];
  source: string;
}

export interface StateFiscalEntry {
  id: string;
  name: string;
  fiscalDeficitPctGsdp: number;
  debtToGsdp: number;
}

export interface FiscalHealthData {
  year: string;
  states: StateFiscalEntry[];
  source: string;
}

export interface StatesSummary {
  year: string;
  topGsdpState: string;
  topGsdpValue: number;       // Rs lakh crore
  nationalGsdpTotal: number;  // Rs lakh crore
  growthRange: string;        // e.g. "3.2% – 14.1%"
  averagePerCapita: number;   // Rs
  stateCount: number;
  lastUpdated: string;
  source: string;
}

export interface StateValue {
  id: string;
  name: string;
  value: number;
}

export interface StatesIndicator {
  id: string;
  name: string;
  category: string;           // 'gsdp' | 'revenue' | 'fiscal' | 'percapita'
  unit: string;
  states: StateValue[];
  source: string;
}

export interface StatesIndicatorsData {
  year: string;
  indicators: StatesIndicator[];
}

// ─── Census & Demographics Domain ──────────────────────────────

export interface CensusSummary {
  year: string;
  totalPopulation: number;
  populationGrowthRate: number;
  literacyRate: number;
  urbanizationRate: number;
  sexRatio: number;            // females per 1000 males
  topPopulousStates: { name: string; population: number }[];
  lastUpdated: string;
  source: string;
}

export interface StatePopulation {
  id: string;
  name: string;
  population: number;
  density: number;             // per sq km
  urbanPercent: number;
  ruralPercent: number;
  decadalGrowth: number;       // %
}

export interface PopulationData {
  year: string;
  nationalTimeSeries: TimeSeriesPoint[];  // WB total population
  growthTimeSeries: TimeSeriesPoint[];    // WB population growth %
  states: StatePopulation[];              // Census 2011 state entries
  source: string;
}

export interface StateLiteracy {
  id: string;
  name: string;
  overallRate: number;
  maleRate: number;
  femaleRate: number;
  genderGap: number;
}

export interface LiteracyData {
  year: string;
  totalTimeSeries: TimeSeriesPoint[];     // WB literacy total % (sparse)
  maleTimeSeries: TimeSeriesPoint[];
  femaleTimeSeries: TimeSeriesPoint[];
  states: StateLiteracy[];                // Census 2011 state breakdown
  source: string;
}

export interface StateDemographics {
  id: string;
  name: string;
  sexRatio: number;
  urbanizationRate: number;
  growthRate: number;
}

export interface DemographicsData {
  year: string;
  ageStructure: {
    young: TimeSeriesPoint[];       // WB pop 0-14 %
    working: TimeSeriesPoint[];     // WB pop 15-64 %
    elderly: TimeSeriesPoint[];     // WB pop 65+ %
  };
  dependencyRatio: TimeSeriesPoint[];
  vitalStats: {
    birthRate: TimeSeriesPoint[];
    deathRate: TimeSeriesPoint[];
    fertilityRate: TimeSeriesPoint[];
    lifeExpectancy: TimeSeriesPoint[];
    lifeExpectancyMale: TimeSeriesPoint[];
    lifeExpectancyFemale: TimeSeriesPoint[];
  };
  urbanization: TimeSeriesPoint[];  // WB urban population %
  states: StateDemographics[];      // Census 2011 state demographics
  source: string;
}

export interface StateHealthEntry {
  id: string;
  name: string;
  value: number;
}

export interface StateNfhsEntry {
  id: string;
  name: string;
  tfr: number;
  imr: number;
  under5mr: number;
  stunting: number;
  wasting: number;
  fullImmunization: number;
}

export interface HealthData {
  year: string;
  imrNational: TimeSeriesPoint[];
  mmr: TimeSeriesPoint[];
  under5: TimeSeriesPoint[];
  lifeExpectancy: TimeSeriesPoint[];
  fertilityRate: TimeSeriesPoint[];
  stateImr: StateHealthEntry[];       // SRS 2023 state-level IMR
  stateHealth: StateNfhsEntry[];      // NFHS-5 state-level
  source: string;
}

export interface CensusIndicator {
  id: string;
  name: string;
  category: string;
  unit: string;
  states: StateValue[];
  source: string;
}

export interface CensusIndicatorsData {
  year: string;
  indicators: CensusIndicator[];
}

// ─── Education Domain ───────────────────────────────────────────

export interface EducationSummary {
  year: string;
  totalStudents: number;
  totalSchools: number;
  totalTeachers: number;
  gerPrimary: number;
  gerSecondary: number;
  ptrNational: number;
  educationSpendGDP: number;
  topEnrolledStates: { name: string; students: number }[];
  lastUpdated: string;
  source: string;
}

export interface StateEnrollment {
  id: string;
  name: string;
  gerPrimary: number;
  gerSecondary: number;
  gerHigherSec: number;
  dropoutPrimary: number;
  dropoutSecondary: number;
}

export interface EnrollmentData {
  year: string;
  primaryTimeSeries: TimeSeriesPoint[];
  secondaryTimeSeries: TimeSeriesPoint[];
  tertiaryTimeSeries: TimeSeriesPoint[];
  femaleSecondary: TimeSeriesPoint[];
  maleSecondary: TimeSeriesPoint[];
  primaryCompletion: TimeSeriesPoint[];
  states: StateEnrollment[];
  source: string;
}

export interface StateInfrastructure {
  id: string;
  name: string;
  ptr: number;
  schoolsWithComputers: number;
  schoolsWithInternet: number;
  girlsToilets: number;
}

export interface StateLearning {
  id: string;
  name: string;
  canReadStd2: number;
  canDoSubtraction: number;
  canReadEnglish: number;
}

export interface QualityData {
  year: string;
  ptrPrimaryTimeSeries: TimeSeriesPoint[];
  ptrSecondaryTimeSeries: TimeSeriesPoint[];
  stateInfrastructure: StateInfrastructure[];
  learningOutcomes: StateLearning[];
  source: string;
}

export interface SpendingData {
  year: string;
  spendGDPTimeSeries: TimeSeriesPoint[];
  spendGovtTimeSeries: TimeSeriesPoint[];
  outOfSchoolTimeSeries: TimeSeriesPoint[];
  source: string;
}

export interface EducationIndicator {
  id: string;
  name: string;
  category: 'enrollment' | 'quality' | 'infrastructure' | 'spending';
  unit: string;
  states: StateValue[];
  source: string;
}

export interface EducationIndicatorsData {
  year: string;
  indicators: EducationIndicator[];
}

// ─── Employment Domain ──────────────────────────────────────────

export interface EmploymentSummary {
  year: string;
  unemploymentRate: number;
  lfpr: number;
  youthUnemployment: number;
  femaleLfpr: number;
  workforceTotal: number;         // in crores
  selfEmployedPct: number;
  lastUpdated: string;
  source: string;
}

export interface UnemploymentData {
  year: string;
  totalTimeSeries: TimeSeriesPoint[];
  youthTimeSeries: TimeSeriesPoint[];
  femaleTimeSeries: TimeSeriesPoint[];
  maleTimeSeries: TimeSeriesPoint[];
  stateUnemployment: StateValue[];
  source: string;
}

export interface ParticipationData {
  year: string;
  lfprTotalTimeSeries: TimeSeriesPoint[];
  lfprMaleTimeSeries: TimeSeriesPoint[];
  lfprFemaleTimeSeries: TimeSeriesPoint[];
  empPopRatioTimeSeries: TimeSeriesPoint[];
  stateLfpr: StateValue[];
  source: string;
}

export interface SectoralEntry {
  id: string;
  name: string;
  employmentShare: number;
}

export interface SectoralData {
  year: string;
  agricultureTimeSeries: TimeSeriesPoint[];
  industryTimeSeries: TimeSeriesPoint[];
  servicesTimeSeries: TimeSeriesPoint[];
  selfEmployedTimeSeries: TimeSeriesPoint[];
  vulnerableTimeSeries: TimeSeriesPoint[];
  currentSectors: SectoralEntry[];
  source: string;
}

export interface EmploymentIndicator {
  id: string;
  name: string;
  category: 'unemployment' | 'participation' | 'sectoral' | 'informality';
  unit: string;
  states: StateValue[];
  source: string;
}

export interface EmploymentIndicatorsData {
  year: string;
  indicators: EmploymentIndicator[];
}

// ─── Healthcare Domain ──────────────────────────────────────────

export interface HealthcareSummary {
  year: string;
  hospitalBedsPer1000: number;
  physiciansPer1000: number;
  healthExpGDP: number;
  outOfPocketPct: number;
  dptImmunization: number;
  tbIncidence: number;
  lastUpdated: string;
  source: string;
}

export interface InfrastructureData {
  year: string;
  hospitalBedsTimeSeries: TimeSeriesPoint[];
  physiciansTimeSeries: TimeSeriesPoint[];
  nursesTimeSeries: TimeSeriesPoint[];
  stateInfrastructure: StateHealthInfra[];
  source: string;
}

export interface StateHealthInfra {
  id: string;
  name: string;
  bedsPerLakh: number;
  phcs: number;
  chcs: number;
  subCentres: number;
  doctorsAtPHC: number;
  doctorsPer10K: number;
}

export interface HealthSpendingData {
  year: string;
  healthExpGDPTimeSeries: TimeSeriesPoint[];
  healthExpPerCapitaTimeSeries: TimeSeriesPoint[];
  outOfPocketTimeSeries: TimeSeriesPoint[];
  govtHealthExpTimeSeries: TimeSeriesPoint[];
  source: string;
}

export interface DiseaseData {
  year: string;
  dptTimeSeries: TimeSeriesPoint[];
  measlesTimeSeries: TimeSeriesPoint[];
  tbIncidenceTimeSeries: TimeSeriesPoint[];
  hivTimeSeries: TimeSeriesPoint[];
  birthsAttendedTimeSeries: TimeSeriesPoint[];
  stateImmunization: StateImmunization[];
  source: string;
}

export interface StateImmunization {
  id: string;
  name: string;
  fullImmunization: number;
  bcg: number;
  measles: number;
  dpt3: number;
}

export interface HealthcareIndicator {
  id: string;
  name: string;
  category: 'infrastructure' | 'spending' | 'disease' | 'immunization';
  unit: string;
  states: StateValue[];
  source: string;
}

export interface HealthcareIndicatorsData {
  year: string;
  indicators: HealthcareIndicator[];
}

// ─── CPI Category Data (for cost-of-living calculator) ──────────

export interface CPICategoryEntry {
  division: string;  // COICOP code: '01', '04', '06', '07', '10'
  name: string;
  series: { period: string; value: number }[];
}

// ─── Loan Spreads (for EMI calculator) ──────────────────────────

export interface LoanSpread {
  minSpread: number;
  typicalSpread: number;
  maxSpread: number;
  source: string;
}

export interface LoanSpreadsData {
  year: string;
  lastUpdated: string;
  spreads: {
    home: LoanSpread;
    car: LoanSpread;
    personal: LoanSpread;
  };
}

// ─── Environment Domain ────────────────────────────────────────

export interface EnvironmentSummary {
  year: string;
  co2PerCapita: number;
  forestPct: number;
  renewablesPct: number;
  pm25: number;
  coalPct: number;
  ghgTotal: number;
  lastUpdated: string;
  source: string;
}

export interface StateAQIEntry {
  id: string;
  name: string;
  aqi: number;
  category: string;
}

export interface CityAQIEntry {
  city: string;
  state: string;
  aqi: number;
}

export interface AirQualityData {
  year: string;
  pm25TimeSeries: TimeSeriesPoint[];
  stateAQI: StateAQIEntry[];
  cityAQI: CityAQIEntry[];
  source: string;
}

export interface StateForestEntry {
  id: string;
  name: string;
  forestCoverKm2: number;
  pctGeographicArea: number;
  changeKm2: number;
}

export interface ForestData {
  year: string;
  forestPctTimeSeries: TimeSeriesPoint[];
  forestKm2TimeSeries: TimeSeriesPoint[];
  protectedAreasPct: TimeSeriesPoint[];
  stateForestCover: StateForestEntry[];
  source: string;
}

export interface FuelCapacityEntry {
  year: string;
  coal: number;
  gas: number;
  nuclear: number;
  hydro: number;
  solar: number;
  wind: number;
  biomass: number;
  smallHydro: number;
}

export interface EnergyData {
  year: string;
  renewablesPctTimeSeries: TimeSeriesPoint[];
  renewableElecTimeSeries: TimeSeriesPoint[];
  coalElecTimeSeries: TimeSeriesPoint[];
  energyUsePerCapitaTimeSeries: TimeSeriesPoint[];
  co2PerCapitaTimeSeries: TimeSeriesPoint[];
  co2TotalTimeSeries: TimeSeriesPoint[];
  ghgTotalTimeSeries: TimeSeriesPoint[];
  fuelCapacityMix: FuelCapacityEntry[];
  source: string;
}

export interface ReservoirEntry {
  region: string;
  storagePct: number;
  reservoirCount: number;
  capacityBCM: number;
}

export interface StateGroundwaterEntry {
  id: string;
  name: string;
  stagePct: number;
  stage: string;
}

export interface WaterData {
  year: string;
  reservoirStorage: ReservoirEntry[];
  groundwaterStage: StateGroundwaterEntry[];
  source: string;
}

export interface EnvironmentIndicator {
  id: string;
  name: string;
  category: 'air' | 'forest' | 'energy' | 'water' | 'carbon';
  unit: string;
  states: StateValue[];
  source: string;
}

export interface EnvironmentIndicatorsData {
  year: string;
  indicators: EnvironmentIndicator[];
}

// ─── Elections Domain ──────────────────────────────────────────

export interface ElectionsSummary {
  year: string;
  turnout2024: number;
  totalElectorsCrore: number;
  bjpSeats2024: number;
  incSeats2024: number;
  ndaSeats2024: number;
  indiaAllianceSeats2024: number;
  womenMPs2024: number;
  womenMPsPct2024: number;
  criminalPct: number;
  seriousCriminalPct: number;
  avgAssetsCrore: number;
  totalConstituencies: number;
  lastUpdated: string;
  source: string;
}

export interface TurnoutPoint {
  year: string;
  turnout: number;
  electors: number;
  lsNumber: number;
}

export interface TurnoutEvent {
  year: string;
  event: string;
}

export interface StateTurnout {
  id: string;
  name: string;
  turnout: number;
}

export interface TurnoutData {
  year: string;
  nationalTrend: TurnoutPoint[];
  events: TurnoutEvent[];
  stateBreakdown2024: StateTurnout[];
  source: string;
}

export interface SeatDataPoint {
  year: string;
  seats: number;
  totalSeats: number;
  pct: number;
}

export interface PartySeries {
  id: string;
  name: string;
  color: string;
  data: SeatDataPoint[];
}

export interface Party2024 {
  party: string;
  fullName: string;
  seats: number;
  voteShare: number;
  color: string;
  alliance: string;
}

export interface AllianceTotals {
  NDA: number;
  INDIA: number;
  Others: number;
  majorityMark: number;
}

export interface ResultsData {
  year: string;
  seatEvolution: PartySeries[];
  parties2024: Party2024[];
  allianceTotals2024: AllianceTotals;
  source: string;
}

export interface CriminalBreakdown {
  totalMPs: number;
  withAnyCases: number;
  withSeriousCases: number;
  pctAny: number;
  pctSerious: number;
}

export interface AssetsBreakdown {
  avgCrore: number;
  medianCrore: number;
}

export interface EducationBreakdown {
  postGradAndAbove: number;
  graduate: number;
  belowGraduate: number;
}

export interface WealthiestMP {
  rank: number;
  name: string;
  constituency: string;
  party: string;
  assetsCrore: number;
}

export interface CriminalMP {
  rank: number;
  name: string;
  constituency: string;
  party: string;
  cases: number;
}

export interface CandidatesData {
  year: string;
  criminal: CriminalBreakdown;
  assets: AssetsBreakdown;
  education: EducationBreakdown;
  topWealthiest: WealthiestMP[];
  topCriminal: CriminalMP[];
  source: string;
}

export interface WomenMPsPoint {
  year: string;
  totalSeats: number;
  womenMPs: number;
  pct: number;
}

export interface ReservationTarget {
  label: string;
  pct: number;
  note: string;
}

export interface RepresentationData {
  year: string;
  trend: WomenMPsPoint[];
  target: ReservationTarget;
  source: string;
}

export interface ElectionsIndicator {
  id: string;
  name: string;
  category: string;
  unit: string;
  states: StateValue[];
  source: string;
}

export interface ElectionsIndicatorsData {
  year: string;
  indicators: ElectionsIndicator[];
}

// ─── Crime & Safety Domain ──────────────────────────────────────

export interface CrimeSummary {
  year: string;
  totalCrimes: number;
  crimeRate: number;
  roadDeaths: number;
  convictionRatePct: number;
  womenCrimes: number;
  cybercrimes: number;
  policeRatioActual: number;
  dataYear: string;
  lastUpdated: string;
  source: string;
}

export interface CrimeTrendPoint {
  year: string;
  total: number;
  ipc: number;
  sll: number;
  rate: number;
}

export interface CrimeComposition {
  id: string;
  name: string;
  cases: number;
  pct: number;
}

export interface StateCrimeRate {
  id: string;
  name: string;
  rate: number;
  total: number;
}

export interface HomicidePoint {
  year: string;
  value: number;
}

export interface CrimeOverviewData {
  year: string;
  nationalTrend: CrimeTrendPoint[];
  ipcComposition: CrimeComposition[];
  stateRates: StateCrimeRate[];
  homicideRate: HomicidePoint[];
  source: string;
}

export interface WomenCrimeTrend {
  year: string;
  total: number;
  rate: number;
}

export interface WomenCrimeType {
  id: string;
  name: string;
  cases: number;
  pct: number;
}

export interface StateWomenRate {
  id: string;
  name: string;
  rate: number;
  total: number;
}

export interface WomenSafetyData {
  year: string;
  nationalTrend: WomenCrimeTrend[];
  crimeTypes: WomenCrimeType[];
  stateRates: StateWomenRate[];
  source: string;
}

export interface RoadAccidentTrend {
  year: string;
  accidents: number;
  killed: number;
  injured: number;
}

export interface AccidentCause {
  id: string;
  name: string;
  pct: number;
}

export interface StateFatality {
  id: string;
  name: string;
  rate: number;
  killed: number;
}

export interface RoadAccidentData {
  year: string;
  nationalTrend: RoadAccidentTrend[];
  causes: AccidentCause[];
  stateFatalities: StateFatality[];
  source: string;
}

export interface CybercrimeTrend {
  year: string;
  cases: number;
  rate: number;
}

export interface CybercrimeType {
  id: string;
  name: string;
  cases: number;
  pct: number;
}

export interface CybercrimeData {
  year: string;
  ncrbTrend: CybercrimeTrend[];
  crimeTypes: CybercrimeType[];
  i4cComplaints: number;
  i4cFinancialLossCrore: number;
  i4cNote: string;
  source: string;
}

export interface StatePoliceRatio {
  id: string;
  name: string;
  sanctioned: number;
  actual: number;
}

export interface PoliceData {
  year: string;
  sanctionedStrength: number;
  actualStrength: number;
  vacancyPct: number;
  sanctionedRatePerLakh: number;
  actualRatePerLakh: number;
  unRecommended: number;
  womenPolicePct: number;
  womenPoliceTotal: number;
  stateRatios: StatePoliceRatio[];
  source: string;
}

export interface JusticeFunnel {
  totalForInvestigation: number;
  investigated: number;
  chargesheeted: number;
  chargesheetRate: number;
  totalForTrial: number;
  trialCompleted: number;
  convicted: number;
  acquitted: number;
  convictionRate: number;
  pendingInvestigation: number;
  pendingTrial: number;
  pendencyRate: number;
}

export interface TrialDuration {
  avgYears: number;
  casesOver5Years: number;
  casesOver10Years: number;
  judgesPerMillion: number;
}

export interface JusticeData {
  year: string;
  funnel: JusticeFunnel;
  trialDuration: TrialDuration;
  source: string;
}

export interface CrimeIndicator {
  id: string;
  name: string;
  category: string;
  unit: string;
  states: StateValue[];
  source: string;
}

export interface CrimeIndicatorsData {
  year: string;
  indicators: CrimeIndicator[];
}

// ─── Glossary (shared across domains) ──────────────────────────

export interface GlossaryTerm {
  id: string;
  term: string;
  simple: string;
  detail: string;
  inContext?: string;
  relatedTerms?: string[];
}

export interface GlossaryData {
  domain: 'budget' | 'economy' | 'rbi' | 'states' | 'census' | 'education' | 'employment' | 'healthcare' | 'environment' | 'elections' | 'crime';
  year: string;
  terms: GlossaryTerm[];
}

export interface CitizenQuestion {
  id: string;
  domain: string;
  question: string;
  answer: string;
  sectionId: string;
  route: string;
}
