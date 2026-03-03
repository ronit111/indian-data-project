import type {
  BudgetSummary,
  BudgetTrendsData,
  BudgetVsActualData,
  ReceiptsData,
  ExpenditureData,
  SankeyData,
  TreemapData,
  StatewiseData,
  SchemesData,
  TaxSlabsData,
  ExpenditureSharesData,
  YearIndex,
  EconomySummary,
  GDPGrowthData,
  InflationData,
  FiscalData,
  ExternalData,
  SectorsData,
  IndicatorsData,
  RBISummary,
  MonetaryPolicyData,
  LiquidityData,
  CreditData,
  ForexData,
  RBIIndicatorsData,
  StatesSummary,
  GSDPData,
  RevenueData,
  FiscalHealthData,
  StatesIndicatorsData,
  CensusSummary,
  PopulationData,
  LiteracyData,
  DemographicsData,
  HealthData,
  CensusIndicatorsData,
  EducationSummary,
  EnrollmentData,
  QualityData,
  SpendingData,
  EducationIndicatorsData,
  EmploymentSummary,
  UnemploymentData,
  ParticipationData,
  SectoralData,
  EmploymentIndicatorsData,
  HealthcareSummary,
  InfrastructureData,
  HealthSpendingData,
  DiseaseData,
  HealthcareIndicatorsData,
  EnvironmentSummary,
  AirQualityData,
  ForestData,
  EnergyData,
  WaterData,
  EnvironmentIndicatorsData,
  ElectionsSummary,
  TurnoutData,
  ResultsData,
  CandidatesData,
  RepresentationData,
  ElectionsIndicatorsData,
  CrimeSummary,
  CrimeOverviewData,
  WomenSafetyData,
  RoadAccidentData,
  CybercrimeData,
  PoliceData,
  JusticeData,
  CrimeIndicatorsData,
  GlossaryData,
  LoanSpreadsData,
  CitizenQuestion,
} from './data/schema.ts';

const cache = new Map<string, unknown>();

async function fetchJson<T>(path: string): Promise<T> {
  if (cache.has(path)) return cache.get(path) as T;
  const res = await fetch(path);
  if (!res.ok) throw new Error(`Failed to fetch ${path}: ${res.status}`);
  const data = await res.json();
  cache.set(path, data);
  return data as T;
}

export const loadYears = () => fetchJson<YearIndex>('/data/years.json');

export const loadSummary = (year: string) =>
  fetchJson<BudgetSummary>(`/data/budget/${year}/summary.json`);

export const loadReceipts = (year: string) =>
  fetchJson<ReceiptsData>(`/data/budget/${year}/receipts.json`);

export const loadExpenditure = (year: string) =>
  fetchJson<ExpenditureData>(`/data/budget/${year}/expenditure.json`);

export const loadSankey = (year: string) =>
  fetchJson<SankeyData>(`/data/budget/${year}/sankey.json`);

export const loadTreemap = (year: string) =>
  fetchJson<TreemapData>(`/data/budget/${year}/treemap.json`);

export const loadStatewise = (year: string) =>
  fetchJson<StatewiseData>(`/data/budget/${year}/statewise.json`);

export const loadSchemes = (year: string) =>
  fetchJson<SchemesData>(`/data/budget/${year}/schemes.json`);

export const loadBudgetTrends = (year: string) =>
  fetchJson<BudgetTrendsData>(`/data/budget/${year}/trends.json`);

export const loadBudgetVsActual = (year: string) =>
  fetchJson<BudgetVsActualData>(`/data/budget/${year}/budget-vs-actual.json`);

export const loadTaxSlabs = () =>
  fetchJson<TaxSlabsData>('/data/tax-calculator/slabs.json');

export const loadExpenditureShares = () =>
  fetchJson<ExpenditureSharesData>('/data/tax-calculator/expenditure-shares.json');

// ─── Economy Domain ──────────────────────────────────────────────
export const loadEconomySummary = (year: string) =>
  fetchJson<EconomySummary>(`/data/economy/${year}/summary.json`);

export const loadGDPGrowth = (year: string) =>
  fetchJson<GDPGrowthData>(`/data/economy/${year}/gdp-growth.json`);

export const loadInflation = (year: string) =>
  fetchJson<InflationData>(`/data/economy/${year}/inflation.json`);

export const loadFiscal = (year: string) =>
  fetchJson<FiscalData>(`/data/economy/${year}/fiscal.json`);

export const loadExternal = (year: string) =>
  fetchJson<ExternalData>(`/data/economy/${year}/external.json`);

export const loadSectors = (year: string) =>
  fetchJson<SectorsData>(`/data/economy/${year}/sectors.json`);

export const loadIndicators = (year: string) =>
  fetchJson<IndicatorsData>(`/data/economy/${year}/indicators.json`);

// ─── RBI Domain ─────────────────────────────────────────────────
export const loadRBISummary = (year: string) =>
  fetchJson<RBISummary>(`/data/rbi/${year}/summary.json`);

export const loadMonetaryPolicy = (year: string) =>
  fetchJson<MonetaryPolicyData>(`/data/rbi/${year}/monetary-policy.json`);

export const loadLiquidity = (year: string) =>
  fetchJson<LiquidityData>(`/data/rbi/${year}/liquidity.json`);

export const loadCredit = (year: string) =>
  fetchJson<CreditData>(`/data/rbi/${year}/credit.json`);

export const loadForex = (year: string) =>
  fetchJson<ForexData>(`/data/rbi/${year}/forex.json`);

export const loadRBIIndicators = (year: string) =>
  fetchJson<RBIIndicatorsData>(`/data/rbi/${year}/indicators.json`);

// ─── State Finances Domain ──────────────────────────────────────
export const loadStatesSummary = (year: string) =>
  fetchJson<StatesSummary>(`/data/states/${year}/summary.json`);

export const loadGSDP = (year: string) =>
  fetchJson<GSDPData>(`/data/states/${year}/gsdp.json`);

export const loadStateRevenue = (year: string) =>
  fetchJson<RevenueData>(`/data/states/${year}/revenue.json`);

export const loadFiscalHealth = (year: string) =>
  fetchJson<FiscalHealthData>(`/data/states/${year}/fiscal-health.json`);

export const loadStatesIndicators = (year: string) =>
  fetchJson<StatesIndicatorsData>(`/data/states/${year}/indicators.json`);

// ─── Census & Demographics Domain ──────────────────────────────
export const loadCensusSummary = (year: string) =>
  fetchJson<CensusSummary>(`/data/census/${year}/summary.json`);

export const loadPopulation = (year: string) =>
  fetchJson<PopulationData>(`/data/census/${year}/population.json`);

export const loadLiteracyData = (year: string) =>
  fetchJson<LiteracyData>(`/data/census/${year}/literacy.json`);

export const loadDemographics = (year: string) =>
  fetchJson<DemographicsData>(`/data/census/${year}/demographics.json`);

export const loadHealthData = (year: string) =>
  fetchJson<HealthData>(`/data/census/${year}/health.json`);

export const loadCensusIndicators = (year: string) =>
  fetchJson<CensusIndicatorsData>(`/data/census/${year}/indicators.json`);

// ─── Education Domain ───────────────────────────────────────────
export const loadEducationSummary = (year: string) =>
  fetchJson<EducationSummary>(`/data/education/${year}/summary.json`);

export const loadEnrollment = (year: string) =>
  fetchJson<EnrollmentData>(`/data/education/${year}/enrollment.json`);

export const loadQuality = (year: string) =>
  fetchJson<QualityData>(`/data/education/${year}/quality.json`);

export const loadSpending = (year: string) =>
  fetchJson<SpendingData>(`/data/education/${year}/spending.json`);

export const loadEducationIndicators = (year: string) =>
  fetchJson<EducationIndicatorsData>(`/data/education/${year}/indicators.json`);

// ─── Employment Domain ──────────────────────────────────────────
export const loadEmploymentSummary = (year: string) =>
  fetchJson<EmploymentSummary>(`/data/employment/${year}/summary.json`);

export const loadUnemployment = (year: string) =>
  fetchJson<UnemploymentData>(`/data/employment/${year}/unemployment.json`);

export const loadParticipation = (year: string) =>
  fetchJson<ParticipationData>(`/data/employment/${year}/participation.json`);

export const loadSectoral = (year: string) =>
  fetchJson<SectoralData>(`/data/employment/${year}/sectoral.json`);

export const loadEmploymentIndicators = (year: string) =>
  fetchJson<EmploymentIndicatorsData>(`/data/employment/${year}/indicators.json`);

// ─── Healthcare Domain ──────────────────────────────────────────
export const loadHealthcareSummary = (year: string) =>
  fetchJson<HealthcareSummary>(`/data/healthcare/${year}/summary.json`);

export const loadInfrastructure = (year: string) =>
  fetchJson<InfrastructureData>(`/data/healthcare/${year}/infrastructure.json`);

export const loadHealthSpending = (year: string) =>
  fetchJson<HealthSpendingData>(`/data/healthcare/${year}/spending.json`);

export const loadDisease = (year: string) =>
  fetchJson<DiseaseData>(`/data/healthcare/${year}/disease.json`);

export const loadHealthcareIndicators = (year: string) =>
  fetchJson<HealthcareIndicatorsData>(`/data/healthcare/${year}/indicators.json`);

// ─── Environment Domain ────────────────────────────────────────
export const loadEnvironmentSummary = (year: string) =>
  fetchJson<EnvironmentSummary>(`/data/environment/${year}/summary.json`);

export const loadAirQuality = (year: string) =>
  fetchJson<AirQualityData>(`/data/environment/${year}/air-quality.json`);

export const loadForest = (year: string) =>
  fetchJson<ForestData>(`/data/environment/${year}/forest.json`);

export const loadEnergy = (year: string) =>
  fetchJson<EnergyData>(`/data/environment/${year}/energy.json`);

export const loadWater = (year: string) =>
  fetchJson<WaterData>(`/data/environment/${year}/water.json`);

export const loadEnvironmentIndicators = (year: string) =>
  fetchJson<EnvironmentIndicatorsData>(`/data/environment/${year}/indicators.json`);

// ─── Elections Domain ─────────────────────────────────────────
export const loadElectionsSummary = (year: string) =>
  fetchJson<ElectionsSummary>(`/data/elections/${year}/summary.json`);

export const loadTurnout = (year: string) =>
  fetchJson<TurnoutData>(`/data/elections/${year}/turnout.json`);

export const loadResults = (year: string) =>
  fetchJson<ResultsData>(`/data/elections/${year}/results.json`);

export const loadCandidates = (year: string) =>
  fetchJson<CandidatesData>(`/data/elections/${year}/candidates.json`);

export const loadRepresentation = (year: string) =>
  fetchJson<RepresentationData>(`/data/elections/${year}/representation.json`);

export const loadElectionsIndicators = (year: string) =>
  fetchJson<ElectionsIndicatorsData>(`/data/elections/${year}/indicators.json`);

// ─── Crime & Safety Domain ─────────────────────────────────────
export const loadCrimeSummary = (year: string) =>
  fetchJson<CrimeSummary>(`/data/crime/${year}/summary.json`);

export const loadCrimeOverview = (year: string) =>
  fetchJson<CrimeOverviewData>(`/data/crime/${year}/overview.json`);

export const loadWomenSafety = (year: string) =>
  fetchJson<WomenSafetyData>(`/data/crime/${year}/women-safety.json`);

export const loadRoadAccidents = (year: string) =>
  fetchJson<RoadAccidentData>(`/data/crime/${year}/road-accidents.json`);

export const loadCybercrime = (year: string) =>
  fetchJson<CybercrimeData>(`/data/crime/${year}/cybercrime.json`);

export const loadPolice = (year: string) =>
  fetchJson<PoliceData>(`/data/crime/${year}/police.json`);

export const loadJustice = (year: string) =>
  fetchJson<JusticeData>(`/data/crime/${year}/justice.json`);

export const loadCrimeIndicators = (year: string) =>
  fetchJson<CrimeIndicatorsData>(`/data/crime/${year}/indicators.json`);

// ─── EMI Calculator ────────────────────────────────────────────
export const loadLoanSpreads = () =>
  fetchJson<LoanSpreadsData>('/data/emi/loan-spreads.json');

// ─── Glossary (shared across domains) ──────────────────────────
export const loadGlossary = (domain: string, year: string) =>
  fetchJson<GlossaryData>(`/data/${domain}/${year}/glossary.json`);

// ─── Citizen Questions (search) ─────────────────────────────────
export const loadQuestions = () =>
  fetchJson<CitizenQuestion[]>('/data/questions.json');
