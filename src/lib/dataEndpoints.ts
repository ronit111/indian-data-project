import type { DataEndpoint } from './multiplierTypes.ts';

export const DATA_ENDPOINTS: DataEndpoint[] = [
  // Budget
  {
    domain: 'budget',
    file: 'summary.json',
    path: '/data/budget/2025-26/summary.json',
    description:
      'Headline Union Budget figures including total expenditure, receipts, fiscal deficit, GDP context, and per-capita spending.',
    schema: 'BudgetSummary',
    source: 'Open Budgets India',
    sourceUrl: 'https://openbudgetsindia.org',
  },
  {
    domain: 'budget',
    file: 'receipts.json',
    path: '/data/budget/2025-26/receipts.json',
    description:
      'Breakdown of total government receipts by major categories such as revenue and capital receipts.',
    schema: 'ReceiptsData',
    source: 'Open Budgets India',
    sourceUrl: 'https://openbudgetsindia.org',
  },
  {
    domain: 'budget',
    file: 'expenditure.json',
    path: '/data/budget/2025-26/expenditure.json',
    description:
      'Total Union expenditure with ministry-level allocations for the fiscal year.',
    schema: 'ExpenditureData',
    source: 'Open Budgets India',
    sourceUrl: 'https://openbudgetsindia.org',
  },
  {
    domain: 'budget',
    file: 'sankey.json',
    path: '/data/budget/2025-26/sankey.json',
    description:
      'Flow network of budget receipts-to-expenditure linkages encoded as Sankey nodes and links.',
    schema: 'SankeyData',
    source: 'Open Budgets India',
    sourceUrl: 'https://openbudgetsindia.org',
  },
  {
    domain: 'budget',
    file: 'treemap.json',
    path: '/data/budget/2025-26/treemap.json',
    description:
      'Hierarchical composition of budget allocations structured for treemap visualization.',
    schema: 'TreemapData',
    source: 'Open Budgets India',
    sourceUrl: 'https://openbudgetsindia.org',
  },
  {
    domain: 'budget',
    file: 'statewise.json',
    path: '/data/budget/2025-26/statewise.json',
    description:
      'State-wise transfer amounts and total central transfers across states.',
    schema: 'StatewiseData',
    source: 'Open Budgets India',
    sourceUrl: 'https://openbudgetsindia.org',
  },
  {
    domain: 'budget',
    file: 'schemes.json',
    path: '/data/budget/2025-26/schemes.json',
    description:
      'Major central schemes with allocation amounts and year-wise scheme details.',
    schema: 'SchemesData',
    source: 'Open Budgets India',
    sourceUrl: 'https://openbudgetsindia.org',
  },
  {
    domain: 'budget',
    file: 'trends.json',
    path: '/data/budget/2025-26/trends.json',
    description:
      'Time-series of key budget aggregates used for long-run fiscal trend analysis.',
    schema: 'BudgetTrendsData',
    source: 'Open Budgets India',
    sourceUrl: 'https://openbudgetsindia.org',
  },
  {
    domain: 'budget',
    file: 'budget-vs-actual.json',
    path: '/data/budget/2025-26/budget-vs-actual.json',
    description:
      'Year-wise comparison of budget estimates versus actual spending by ministry.',
    schema: 'BudgetVsActualData',
    source: 'Open Budgets India',
    sourceUrl: 'https://openbudgetsindia.org',
  },
  {
    domain: 'budget',
    file: 'glossary.json',
    path: '/data/budget/2025-26/glossary.json',
    description:
      'Definitions of budget and public-finance terms used across the budget dataset.',
    schema: 'GlossaryData',
    source: 'Open Budgets India',
    sourceUrl: 'https://openbudgetsindia.org',
  },

  // Economy
  {
    domain: 'economy',
    file: 'summary.json',
    path: '/data/economy/2025-26/summary.json',
    description:
      'Macro snapshot covering GDP growth, nominal GDP, inflation, fiscal and current-account deficits, and per-capita GDP.',
    schema: 'EconomySummary',
    source: 'World Bank + MOSPI',
    sourceUrl: 'https://mospi.gov.in',
  },
  {
    domain: 'economy',
    file: 'gdp-growth.json',
    path: '/data/economy/2025-26/gdp-growth.json',
    description:
      'Historical GDP growth series with indicator metadata and units.',
    schema: 'GDPGrowthData',
    source: 'World Bank + MOSPI',
    sourceUrl: 'https://mospi.gov.in',
  },
  {
    domain: 'economy',
    file: 'inflation.json',
    path: '/data/economy/2025-26/inflation.json',
    description:
      'Inflation series with RBI target band and CPI category-level breakdowns.',
    schema: 'InflationData',
    source: 'World Bank + MOSPI',
    sourceUrl: 'https://mospi.gov.in',
  },
  {
    domain: 'economy',
    file: 'fiscal.json',
    path: '/data/economy/2025-26/fiscal.json',
    description:
      'Fiscal deficit target and historical fiscal balance series for trend tracking.',
    schema: 'FiscalData',
    source: 'World Bank + MOSPI',
    sourceUrl: 'https://mospi.gov.in',
  },
  {
    domain: 'economy',
    file: 'external.json',
    path: '/data/economy/2025-26/external.json',
    description:
      'External-sector time series for tracking India\'s balance-of-payments and openness dynamics.',
    schema: 'ExternalData',
    source: 'World Bank + MOSPI',
    sourceUrl: 'https://mospi.gov.in',
  },
  {
    domain: 'economy',
    file: 'sectors.json',
    path: '/data/economy/2025-26/sectors.json',
    description:
      'Sector-wise output composition and growth across agriculture, industry, and services.',
    schema: 'SectorsData',
    source: 'World Bank + MOSPI',
    sourceUrl: 'https://mospi.gov.in',
  },
  {
    domain: 'economy',
    file: 'indicators.json',
    path: '/data/economy/2025-26/indicators.json',
    description:
      'Compact economy indicator cards with values, units, and directional context.',
    schema: 'IndicatorsData',
    source: 'World Bank + MOSPI',
    sourceUrl: 'https://mospi.gov.in',
  },
  {
    domain: 'economy',
    file: 'glossary.json',
    path: '/data/economy/2025-26/glossary.json',
    description:
      'Definitions of macroeconomic terms used in the economy dashboards.',
    schema: 'GlossaryData',
    source: 'World Bank + MOSPI',
    sourceUrl: 'https://mospi.gov.in',
  },

  // RBI
  {
    domain: 'rbi',
    file: 'summary.json',
    path: '/data/rbi/2025-26/summary.json',
    description:
      'Current monetary-policy snapshot including repo rate, stance, CRR/SLR, CPI, forex reserves, and money growth.',
    schema: 'RBISummary',
    source: 'World Bank + RBI',
    sourceUrl: 'https://rbi.org.in',
  },
  {
    domain: 'rbi',
    file: 'monetary-policy.json',
    path: '/data/rbi/2025-26/monetary-policy.json',
    description:
      'Policy rate decisions, stance history, and CRR timeline from RBI monetary policy updates.',
    schema: 'MonetaryPolicyData',
    source: 'World Bank + RBI',
    sourceUrl: 'https://rbi.org.in',
  },
  {
    domain: 'rbi',
    file: 'liquidity.json',
    path: '/data/rbi/2025-26/liquidity.json',
    description:
      'Money-supply liquidity indicators including broad money growth and M3-to-GDP ratios.',
    schema: 'LiquidityData',
    source: 'World Bank + RBI',
    sourceUrl: 'https://rbi.org.in',
  },
  {
    domain: 'rbi',
    file: 'credit.json',
    path: '/data/rbi/2025-26/credit.json',
    description:
      'Credit conditions including domestic/private credit ratios and lending/deposit rates.',
    schema: 'CreditData',
    source: 'World Bank + RBI',
    sourceUrl: 'https://rbi.org.in',
  },
  {
    domain: 'rbi',
    file: 'forex.json',
    path: '/data/rbi/2025-26/forex.json',
    description:
      'Foreign-exchange reserve levels and INR exchange-rate reference data.',
    schema: 'ForexData',
    source: 'World Bank + RBI',
    sourceUrl: 'https://rbi.org.in',
  },
  {
    domain: 'rbi',
    file: 'indicators.json',
    path: '/data/rbi/2025-26/indicators.json',
    description:
      'Key RBI and monetary indicators packaged for quick reference cards.',
    schema: 'RBIIndicatorsData',
    source: 'World Bank + RBI',
    sourceUrl: 'https://rbi.org.in',
  },
  {
    domain: 'rbi',
    file: 'glossary.json',
    path: '/data/rbi/2025-26/glossary.json',
    description:
      'Definitions of monetary-policy and banking terms used in RBI visuals.',
    schema: 'GlossaryData',
    source: 'World Bank + RBI',
    sourceUrl: 'https://rbi.org.in',
  },

  // States
  {
    domain: 'states',
    file: 'summary.json',
    path: '/data/states/2025-26/summary.json',
    description:
      'State economy overview with top GSDP state, national GSDP total, growth range, and average per-capita output.',
    schema: 'StatesSummary',
    source: 'RBI Handbook',
    sourceUrl:
      'https://www.rbi.org.in/scripts/AnnualPublications.aspx?head=Handbook%20of%20Statistics%20on%20Indian%20States',
  },
  {
    domain: 'states',
    file: 'gsdp.json',
    path: '/data/states/2025-26/gsdp.json',
    description:
      'State-wise GSDP levels plus historical GSDP trajectories and base-year metadata.',
    schema: 'GSDPData',
    source: 'RBI Handbook',
    sourceUrl:
      'https://www.rbi.org.in/scripts/AnnualPublications.aspx?head=Handbook%20of%20Statistics%20on%20Indian%20States',
  },
  {
    domain: 'states',
    file: 'revenue.json',
    path: '/data/states/2025-26/revenue.json',
    description:
      'State revenue totals and composition for comparing fiscal capacity across states.',
    schema: 'RevenueData',
    source: 'RBI Handbook',
    sourceUrl:
      'https://www.rbi.org.in/scripts/AnnualPublications.aspx?head=Handbook%20of%20Statistics%20on%20Indian%20States',
  },
  {
    domain: 'states',
    file: 'fiscal-health.json',
    path: '/data/states/2025-26/fiscal-health.json',
    description:
      'State-level fiscal health metrics to benchmark deficits, debt, and budget stability.',
    schema: 'FiscalHealthData',
    source: 'RBI Handbook',
    sourceUrl:
      'https://www.rbi.org.in/scripts/AnnualPublications.aspx?head=Handbook%20of%20Statistics%20on%20Indian%20States',
  },
  {
    domain: 'states',
    file: 'indicators.json',
    path: '/data/states/2025-26/indicators.json',
    description:
      'Cross-state indicator set for quick comparisons on growth and fiscal metrics.',
    schema: 'StatesIndicatorsData',
    source: 'RBI Handbook',
    sourceUrl:
      'https://www.rbi.org.in/scripts/AnnualPublications.aspx?head=Handbook%20of%20Statistics%20on%20Indian%20States',
  },
  {
    domain: 'states',
    file: 'glossary.json',
    path: '/data/states/2025-26/glossary.json',
    description:
      'Definitions of state-finance and GSDP terms used in the states section.',
    schema: 'GlossaryData',
    source: 'RBI Handbook',
    sourceUrl:
      'https://www.rbi.org.in/scripts/AnnualPublications.aspx?head=Handbook%20of%20Statistics%20on%20Indian%20States',
  },

  // Census
  {
    domain: 'census',
    file: 'summary.json',
    path: '/data/census/2025-26/summary.json',
    description:
      'Population snapshot with growth, literacy, urbanization, sex ratio, and most populous states.',
    schema: 'CensusSummary',
    source: 'Census 2011 + World Bank',
    sourceUrl: 'https://censusindia.gov.in',
  },
  {
    domain: 'census',
    file: 'population.json',
    path: '/data/census/2025-26/population.json',
    description:
      'National and state population trends with historical growth time series.',
    schema: 'PopulationData',
    source: 'Census 2011 + World Bank',
    sourceUrl: 'https://censusindia.gov.in',
  },
  {
    domain: 'census',
    file: 'demographics.json',
    path: '/data/census/2025-26/demographics.json',
    description:
      'Age structure, dependency ratios, urbanization, and vital demographic statistics.',
    schema: 'DemographicsData',
    source: 'Census 2011 + World Bank',
    sourceUrl: 'https://censusindia.gov.in',
  },
  {
    domain: 'census',
    file: 'literacy.json',
    path: '/data/census/2025-26/literacy.json',
    description:
      'Literacy trends over time by total, male, and female rates with state-level splits.',
    schema: 'LiteracyData',
    source: 'Census 2011 + World Bank',
    sourceUrl: 'https://censusindia.gov.in',
  },
  {
    domain: 'census',
    file: 'health.json',
    path: '/data/census/2025-26/health.json',
    description:
      'Population health outcomes including IMR, MMR, life expectancy, fertility, and state health indicators.',
    schema: 'HealthData',
    source: 'Census 2011 + World Bank',
    sourceUrl: 'https://censusindia.gov.in',
  },
  {
    domain: 'census',
    file: 'indicators.json',
    path: '/data/census/2025-26/indicators.json',
    description:
      'Core census-derived indicators formatted for concise benchmark cards.',
    schema: 'CensusIndicatorsData',
    source: 'Census 2011 + World Bank',
    sourceUrl: 'https://censusindia.gov.in',
  },
  {
    domain: 'census',
    file: 'glossary.json',
    path: '/data/census/2025-26/glossary.json',
    description:
      'Definitions of census and demographic terms used in this domain.',
    schema: 'GlossaryData',
    source: 'Census 2011 + World Bank',
    sourceUrl: 'https://censusindia.gov.in',
  },

  // Education
  {
    domain: 'education',
    file: 'summary.json',
    path: '/data/education/2025-26/summary.json',
    description:
      'Education snapshot with total students, schools, teachers, GER, PTR, and top enrollment states.',
    schema: 'EducationSummary',
    source: 'UDISE+ + World Bank',
    sourceUrl: 'https://udiseplus.gov.in',
  },
  {
    domain: 'education',
    file: 'enrollment.json',
    path: '/data/education/2025-26/enrollment.json',
    description:
      'Enrollment and completion trends across primary, secondary, and tertiary levels with gender splits.',
    schema: 'EnrollmentData',
    source: 'UDISE+ + World Bank',
    sourceUrl: 'https://udiseplus.gov.in',
  },
  {
    domain: 'education',
    file: 'quality.json',
    path: '/data/education/2025-26/quality.json',
    description:
      'Education quality proxies including pupil-teacher ratios, infrastructure, and learning outcomes.',
    schema: 'QualityData',
    source: 'UDISE+ + World Bank',
    sourceUrl: 'https://udiseplus.gov.in',
  },
  {
    domain: 'education',
    file: 'spending.json',
    path: '/data/education/2025-26/spending.json',
    description:
      'Education expenditure trends versus GDP/government spend and out-of-school rates.',
    schema: 'SpendingData',
    source: 'UDISE+ + World Bank',
    sourceUrl: 'https://udiseplus.gov.in',
  },
  {
    domain: 'education',
    file: 'indicators.json',
    path: '/data/education/2025-26/indicators.json',
    description:
      'Key education indicators consolidated for at-a-glance monitoring.',
    schema: 'EducationIndicatorsData',
    source: 'UDISE+ + World Bank',
    sourceUrl: 'https://udiseplus.gov.in',
  },
  {
    domain: 'education',
    file: 'glossary.json',
    path: '/data/education/2025-26/glossary.json',
    description:
      'Definitions of education-system metrics and terms used in charts.',
    schema: 'GlossaryData',
    source: 'UDISE+ + World Bank',
    sourceUrl: 'https://udiseplus.gov.in',
  },

  // Employment
  {
    domain: 'employment',
    file: 'summary.json',
    path: '/data/employment/2025-26/summary.json',
    description:
      'Labor-market snapshot covering unemployment, LFPR, youth unemployment, female LFPR, and workforce structure.',
    schema: 'EmploymentSummary',
    source: 'PLFS + World Bank',
    sourceUrl: 'https://mospi.gov.in',
  },
  {
    domain: 'employment',
    file: 'unemployment.json',
    path: '/data/employment/2025-26/unemployment.json',
    description:
      'Unemployment trends by total, youth, female, and male rates with state-level comparisons.',
    schema: 'UnemploymentData',
    source: 'PLFS + World Bank',
    sourceUrl: 'https://mospi.gov.in',
  },
  {
    domain: 'employment',
    file: 'participation.json',
    path: '/data/employment/2025-26/participation.json',
    description:
      'Labor-force participation and employment-population ratio trends, including gender and state splits.',
    schema: 'ParticipationData',
    source: 'PLFS + World Bank',
    sourceUrl: 'https://mospi.gov.in',
  },
  {
    domain: 'employment',
    file: 'sectoral.json',
    path: '/data/employment/2025-26/sectoral.json',
    description:
      'Employment distribution across agriculture, industry, services, and vulnerable/self-employment categories.',
    schema: 'SectoralData',
    source: 'PLFS + World Bank',
    sourceUrl: 'https://mospi.gov.in',
  },
  {
    domain: 'employment',
    file: 'indicators.json',
    path: '/data/employment/2025-26/indicators.json',
    description:
      'Headline employment indicators presented as compact reference metrics.',
    schema: 'EmploymentIndicatorsData',
    source: 'PLFS + World Bank',
    sourceUrl: 'https://mospi.gov.in',
  },
  {
    domain: 'employment',
    file: 'glossary.json',
    path: '/data/employment/2025-26/glossary.json',
    description:
      'Definitions of labor-market and employment terms used in this section.',
    schema: 'GlossaryData',
    source: 'PLFS + World Bank',
    sourceUrl: 'https://mospi.gov.in',
  },

  // Healthcare
  {
    domain: 'healthcare',
    file: 'summary.json',
    path: '/data/healthcare/2025-26/summary.json',
    description:
      'Healthcare snapshot including beds and doctors per 1,000, spending burden, and disease-prevention signals.',
    schema: 'HealthcareSummary',
    source: 'NHP + World Bank',
    sourceUrl: 'https://www.cbhidghs.nic.in',
  },
  {
    domain: 'healthcare',
    file: 'infrastructure.json',
    path: '/data/healthcare/2025-26/infrastructure.json',
    description:
      'Health-system capacity trends for hospital beds, physicians, nurses, and state infrastructure levels.',
    schema: 'InfrastructureData',
    source: 'NHP + World Bank',
    sourceUrl: 'https://www.cbhidghs.nic.in',
  },
  {
    domain: 'healthcare',
    file: 'spending.json',
    path: '/data/healthcare/2025-26/spending.json',
    description:
      'Healthcare financing trends for total and government spend, per-capita spend, and out-of-pocket share.',
    schema: 'HealthSpendingData',
    source: 'NHP + World Bank',
    sourceUrl: 'https://www.cbhidghs.nic.in',
  },
  {
    domain: 'healthcare',
    file: 'disease.json',
    path: '/data/healthcare/2025-26/disease.json',
    description:
      'Disease and prevention series covering immunization, TB incidence, HIV trends, and skilled birth attendance.',
    schema: 'DiseaseData',
    source: 'NHP + World Bank',
    sourceUrl: 'https://www.cbhidghs.nic.in',
  },
  {
    domain: 'healthcare',
    file: 'indicators.json',
    path: '/data/healthcare/2025-26/indicators.json',
    description:
      'Core healthcare indicators prepared for quick comparisons across key outcomes.',
    schema: 'HealthcareIndicatorsData',
    source: 'NHP + World Bank',
    sourceUrl: 'https://www.cbhidghs.nic.in',
  },
  {
    domain: 'healthcare',
    file: 'glossary.json',
    path: '/data/healthcare/2025-26/glossary.json',
    description:
      'Definitions of public-health and healthcare-financing terms used across visuals.',
    schema: 'GlossaryData',
    source: 'NHP + World Bank',
    sourceUrl: 'https://www.cbhidghs.nic.in',
  },

  // Environment
  {
    domain: 'environment',
    file: 'summary.json',
    path: '/data/environment/2025-26/summary.json',
    description:
      'Environmental snapshot with CO2 emissions, forest cover, renewable share, PM2.5 exposure, and coal dependence.',
    schema: 'EnvironmentSummary',
    source: 'CPCB + World Bank',
    sourceUrl: 'https://cpcb.nic.in',
  },
  {
    domain: 'environment',
    file: 'air-quality.json',
    path: '/data/environment/2025-26/air-quality.json',
    description:
      'Air-quality trends including PM2.5 history plus state and city AQI benchmarks.',
    schema: 'AirQualityData',
    source: 'CPCB + World Bank',
    sourceUrl: 'https://cpcb.nic.in',
  },
  {
    domain: 'environment',
    file: 'forest.json',
    path: '/data/environment/2025-26/forest.json',
    description:
      'Forest cover trends in percent and area with protected-area share and state coverage.',
    schema: 'ForestData',
    source: 'CPCB + World Bank',
    sourceUrl: 'https://cpcb.nic.in',
  },
  {
    domain: 'environment',
    file: 'energy.json',
    path: '/data/environment/2025-26/energy.json',
    description:
      'Energy and emissions mix covering renewables, coal electricity, per-capita energy use, and GHG series.',
    schema: 'EnergyData',
    source: 'CPCB + World Bank',
    sourceUrl: 'https://cpcb.nic.in',
  },
  {
    domain: 'environment',
    file: 'water.json',
    path: '/data/environment/2025-26/water.json',
    description:
      'Water security indicators including reservoir storage and groundwater stress stage.',
    schema: 'WaterData',
    source: 'CPCB + World Bank',
    sourceUrl: 'https://cpcb.nic.in',
  },
  {
    domain: 'environment',
    file: 'indicators.json',
    path: '/data/environment/2025-26/indicators.json',
    description:
      'Headline climate and environment indicators assembled for quick tracking.',
    schema: 'EnvironmentIndicatorsData',
    source: 'CPCB + World Bank',
    sourceUrl: 'https://cpcb.nic.in',
  },
  {
    domain: 'environment',
    file: 'glossary.json',
    path: '/data/environment/2025-26/glossary.json',
    description:
      'Definitions of environmental, emissions, and energy-transition terms used in this domain.',
    schema: 'GlossaryData',
    source: 'CPCB + World Bank',
    sourceUrl: 'https://cpcb.nic.in',
  },

  // Elections
  {
    domain: 'elections',
    file: 'summary.json',
    path: '/data/elections/2025-26/summary.json',
    description:
      'Election snapshot with turnout, seat tallies, women representation, criminality share, and candidate wealth markers.',
    schema: 'ElectionsSummary',
    source: 'ECI + TCPD + ADR',
    sourceUrl: 'https://eci.gov.in',
  },
  {
    domain: 'elections',
    file: 'turnout.json',
    path: '/data/elections/2025-26/turnout.json',
    description:
      'National turnout trend with major election events and state-wise turnout breakdown for 2024.',
    schema: 'TurnoutData',
    source: 'ECI + TCPD + ADR',
    sourceUrl: 'https://eci.gov.in',
  },
  {
    domain: 'elections',
    file: 'results.json',
    path: '/data/elections/2025-26/results.json',
    description:
      'Seat evolution and 2024 party/alliance totals for Lok Sabha outcome analysis.',
    schema: 'ResultsData',
    source: 'ECI + TCPD + ADR',
    sourceUrl: 'https://eci.gov.in',
  },
  {
    domain: 'elections',
    file: 'candidates.json',
    path: '/data/elections/2025-26/candidates.json',
    description:
      'Candidate profile distributions covering criminal records, assets, education, and top-ranked cases.',
    schema: 'CandidatesData',
    source: 'ECI + TCPD + ADR',
    sourceUrl: 'https://eci.gov.in',
  },
  {
    domain: 'elections',
    file: 'representation.json',
    path: '/data/elections/2025-26/representation.json',
    description:
      'Representation trend series benchmarked against participation targets.',
    schema: 'RepresentationData',
    source: 'ECI + TCPD + ADR',
    sourceUrl: 'https://eci.gov.in',
  },
  {
    domain: 'elections',
    file: 'indicators.json',
    path: '/data/elections/2025-26/indicators.json',
    description:
      'Key electoral indicators for quick comparisons across participation and representation metrics.',
    schema: 'ElectionsIndicatorsData',
    source: 'ECI + TCPD + ADR',
    sourceUrl: 'https://eci.gov.in',
  },
  {
    domain: 'elections',
    file: 'glossary.json',
    path: '/data/elections/2025-26/glossary.json',
    description:
      'Definitions of election and representation terms used in the elections data.',
    schema: 'GlossaryData',
    source: 'ECI + TCPD + ADR',
    sourceUrl: 'https://eci.gov.in',
  },

  // Crime & Safety
  {
    domain: 'crime',
    file: 'summary.json',
    path: '/data/crime/2025-26/summary.json',
    description:
      'Crime snapshot with total crimes, crime rate, road deaths, conviction rate, and police ratio.',
    schema: 'CrimeSummary',
    source: 'NCRB + MoRTH + BPRD',
    sourceUrl: 'https://ncrb.gov.in',
  },
  {
    domain: 'crime',
    file: 'overview.json',
    path: '/data/crime/2025-26/overview.json',
    description:
      'National crime trend (IPC vs SLL), IPC composition by type, state crime rates, and homicide rate.',
    schema: 'CrimeOverviewData',
    source: 'NCRB + World Bank',
    sourceUrl: 'https://ncrb.gov.in',
  },
  {
    domain: 'crime',
    file: 'women-safety.json',
    path: '/data/crime/2025-26/women-safety.json',
    description:
      'Crimes against women — national trend, crime types breakdown, and state-wise rates per lakh women.',
    schema: 'WomenSafetyData',
    source: 'NCRB Crime in India 2022',
    sourceUrl: 'https://ncrb.gov.in',
  },
  {
    domain: 'crime',
    file: 'road-accidents.json',
    path: '/data/crime/2025-26/road-accidents.json',
    description:
      'Road accident deaths and injuries trend, cause breakdown, and state fatality rates.',
    schema: 'RoadAccidentData',
    source: 'MoRTH Annual Report 2022',
    sourceUrl: 'https://morth.nic.in',
  },
  {
    domain: 'crime',
    file: 'cybercrime.json',
    path: '/data/crime/2025-26/cybercrime.json',
    description:
      'NCRB cybercrime FIR trend, I4C complaint volume, financial losses, and crime type breakdown.',
    schema: 'CybercrimeData',
    source: 'NCRB + I4C',
    sourceUrl: 'https://ncrb.gov.in',
  },
  {
    domain: 'crime',
    file: 'police.json',
    path: '/data/crime/2025-26/police.json',
    description:
      'Police strength, vacancy, women in force, police-population ratio by state.',
    schema: 'PoliceData',
    source: 'BPRD Data on Police Organisations 2022',
    sourceUrl: 'https://bprd.nic.in',
  },
  {
    domain: 'crime',
    file: 'justice.json',
    path: '/data/crime/2025-26/justice.json',
    description:
      'Justice pipeline funnel (FIR to conviction), trial duration, judges per million, pendency.',
    schema: 'JusticeData',
    source: 'NCRB Crime in India 2022',
    sourceUrl: 'https://ncrb.gov.in',
  },
  {
    domain: 'crime',
    file: 'indicators.json',
    path: '/data/crime/2025-26/indicators.json',
    description:
      'Key crime indicators (crime rate, women crime rate, road fatality, police ratio, vacancy) by state.',
    schema: 'CrimeIndicatorsData',
    source: 'NCRB + MoRTH + BPRD',
    sourceUrl: 'https://ncrb.gov.in',
  },
  {
    domain: 'crime',
    file: 'glossary.json',
    path: '/data/crime/2025-26/glossary.json',
    description:
      'Definitions of crime, safety, and justice terms used in the crime data story.',
    schema: 'GlossaryData',
    source: 'NCRB + MoRTH + BPRD',
    sourceUrl: 'https://ncrb.gov.in',
  },

  // Cross-domain questions
  {
    domain: 'all',
    file: 'questions.json',
    path: '/data/questions.json',
    description:
      'Citizen-facing Q&A entries mapped to domains, routes, and section IDs for explainer workflows.',
    schema: 'CitizenQuestion[]',
    source: 'Indian Data Project',
    sourceUrl: 'https://indiandataproject.org',
  },
];
