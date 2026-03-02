import type { LessonPlanDef } from '../multiplierTypes.ts';
import { CLASS10_ECONOMICS_BUDGET } from './class10-economics-budget.ts';
import { CLASS11_ECONOMICS_GDP } from './class11-economics-gdp.ts';
import { CLASS11_ECONOMICS_INFLATION } from './class11-economics-inflation.ts';
import { CLASS12_ECONOMICS_BUDGET } from './class12-economics-budget.ts';
import { CLASS10_POLSCI_ELECTIONS } from './class10-polsci-elections.ts';
import { CLASS10_GEOGRAPHY_POPULATION } from './class10-geography-population.ts';
import { CLASS11_GEOGRAPHY_ENVIRONMENT } from './class11-geography-environment.ts';

export const LESSON_PLAN_CONFIGS: Record<string, LessonPlanDef> = {
  'class10-economics-budget': CLASS10_ECONOMICS_BUDGET,
  'class11-economics-gdp': CLASS11_ECONOMICS_GDP,
  'class11-economics-inflation': CLASS11_ECONOMICS_INFLATION,
  'class12-economics-budget': CLASS12_ECONOMICS_BUDGET,
  'class10-polsci-elections': CLASS10_POLSCI_ELECTIONS,
  'class10-geography-population': CLASS10_GEOGRAPHY_POPULATION,
  'class11-geography-environment': CLASS11_GEOGRAPHY_ENVIRONMENT,
};

export const ALL_LESSON_PLANS: LessonPlanDef[] = Object.values(LESSON_PLAN_CONFIGS);
