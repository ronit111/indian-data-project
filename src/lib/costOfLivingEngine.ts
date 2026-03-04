/**
 * Cost-of-living inflation impact calculator.
 *
 * Uses CPI data (headline or by COICOP category) to compute
 * how purchasing power has changed between two years.
 *
 * Math: cumulative multiplier = product of (1 + rate/100) for each year.
 * adjustedAmount = currentAmount / cumulative multiplier.
 */

import type { InflationSeries } from './data/schema.ts';

export interface CPICategoryEntry {
  division: string; // COICOP code: '01', '04', '06', '07', '10'
  name: string;
  series: { period: string; value: number }[];
}

export interface ExpenseCategory {
  id: string;
  label: string;
  amount: number; // monthly Rs
  coicopDivision: string | null; // null = use headline CPI
}

export interface CategoryResult {
  id: string;
  currentAmount: number;
  adjustedAmount: number;
  categoryInflation: number; // cumulative % change
  usedFallback: boolean; // true if headline CPI used instead of category
}

export interface CostOfLivingResult {
  currentTotal: number;
  adjustedTotal: number;
  cumulativeInflation: number; // % total change
  annualizedRate: number; // geometric mean annual rate
  purchasingPowerLoss: number; // currentTotal - adjustedTotal (Rs lost to inflation)
  byCategory: CategoryResult[];
}

export const DEFAULT_EXPENSES: ExpenseCategory[] = [
  { id: 'housing', label: 'Rent / Housing', amount: 15000, coicopDivision: '04' },
  { id: 'food', label: 'Groceries', amount: 8000, coicopDivision: '01' },
  { id: 'transport', label: 'Getting around', amount: 3000, coicopDivision: '07' },
  { id: 'education', label: 'School & college', amount: 5000, coicopDivision: '10' },
  { id: 'healthcare', label: 'Doctor & medicines', amount: 2000, coicopDivision: '06' },
  { id: 'utilities', label: 'Electricity, gas, water', amount: 2000, coicopDivision: '04' },
  { id: 'other', label: 'Everything else', amount: 3000, coicopDivision: null },
];

export const EXPENSE_PRESETS: Record<string, { label: string; total: number; multipliers: Record<string, number> }> = {
  single: {
    label: 'Single (Rs 25K)',
    total: 25000,
    multipliers: { housing: 0.40, food: 0.20, transport: 0.12, education: 0.04, healthcare: 0.06, utilities: 0.08, other: 0.10 },
  },
  family: {
    label: 'Family (Rs 50K)',
    total: 50000,
    multipliers: { housing: 0.30, food: 0.20, transport: 0.08, education: 0.16, healthcare: 0.06, utilities: 0.06, other: 0.14 },
  },
};

/**
 * Parse the starting calendar year from a fiscal year string (e.g., "2019-20" → 2019).
 */
function fiscalYearStart(fy: string): number {
  const n = parseInt(fy.split('-')[0], 10);
  return isNaN(n) ? 0 : n;
}

/**
 * Compute cumulative inflation multiplier between two years.
 * Uses annual % change values (not index levels).
 *
 * Returns null if fromYear or toYear is missing, or if there are
 * any gap years in the series between from and to (which would
 * produce an incorrect multiplier).
 */
function cumulativeMultiplier(
  series: { period: string; value: number }[],
  fromYear: string,
  toYear: string
): number | null {
  // Sort series by period
  const sorted = [...series].sort((a, b) => a.period.localeCompare(b.period));

  // Find the range of years we need
  const fromIdx = sorted.findIndex((s) => s.period === fromYear);
  const toIdx = sorted.findIndex((s) => s.period === toYear);

  if (fromIdx === -1 || toIdx === -1 || fromIdx >= toIdx) return null;

  // Verify no gaps: each adjacent pair in the range must be exactly 1 year apart
  for (let i = fromIdx; i < toIdx; i++) {
    const curr = fiscalYearStart(sorted[i].period);
    const next = fiscalYearStart(sorted[i + 1].period);
    if (next - curr !== 1) return null; // gap detected → fall back to headline
  }

  // Multiply (1 + rate/100) for each year AFTER fromYear up to toYear
  let multiplier = 1;
  for (let i = fromIdx + 1; i <= toIdx; i++) {
    multiplier *= 1 + sorted[i].value / 100;
  }

  return multiplier;
}

export function calculateCostChange(
  expenses: ExpenseCategory[],
  cpiByCategory: CPICategoryEntry[] | null,
  headlineSeries: InflationSeries[],
  fromYear: string,
  toYear: string
): CostOfLivingResult {
  // Convert headline series to simple {period, value} format
  const headlineSimple = headlineSeries
    .filter((s) => s.cpiHeadline != null)
    .map((s) => ({ period: s.period, value: s.cpiHeadline }));

  const byCategory: CategoryResult[] = expenses.map((exp) => {
    let usedFallback = false;
    let catMultiplier: number | null = null;

    // Try category-specific CPI first
    if (exp.coicopDivision && cpiByCategory) {
      const catSeries = cpiByCategory.find((c) => c.division === exp.coicopDivision);
      if (catSeries && catSeries.series.length > 0) {
        catMultiplier = cumulativeMultiplier(catSeries.series, fromYear, toYear);
      }
    }

    // Fallback to headline CPI
    if (catMultiplier == null) {
      catMultiplier = cumulativeMultiplier(headlineSimple, fromYear, toYear);
      usedFallback = true;
    }

    // If still null (missing data), assume no change
    if (catMultiplier == null) catMultiplier = 1;

    const adjustedAmount = exp.amount / catMultiplier;
    const categoryInflation = (catMultiplier - 1) * 100;

    return {
      id: exp.id,
      currentAmount: exp.amount,
      adjustedAmount: Math.round(adjustedAmount),
      categoryInflation: Math.round(categoryInflation * 10) / 10,
      usedFallback,
    };
  });

  const currentTotal = byCategory.reduce((s, c) => s + c.currentAmount, 0);
  const adjustedTotal = byCategory.reduce((s, c) => s + c.adjustedAmount, 0);
  const cumulativeInflation =
    adjustedTotal > 0 ? ((currentTotal / adjustedTotal - 1) * 100) : 0;

  // Compute years between for annualized rate
  const yearCount = estimateYearsBetween(fromYear, toYear);
  const annualizedRate =
    yearCount > 0 && adjustedTotal > 0
      ? (Math.pow(currentTotal / adjustedTotal, 1 / yearCount) - 1) * 100
      : 0;

  const purchasingPowerLoss = currentTotal - adjustedTotal;

  return {
    currentTotal,
    adjustedTotal: Math.round(adjustedTotal),
    cumulativeInflation: Math.round(cumulativeInflation * 10) / 10,
    annualizedRate: Math.round(annualizedRate * 10) / 10,
    purchasingPowerLoss: Math.round(purchasingPowerLoss),
    byCategory,
  };
}

/** Estimate years between two fiscal year strings like "2019-20" and "2024-25" */
function estimateYearsBetween(from: string, to: string): number {
  const fromNum = parseInt(from.split('-')[0], 10);
  const toNum = parseInt(to.split('-')[0], 10);
  return Math.abs(toNum - fromNum);
}

/**
 * Get available comparison years from the inflation series.
 * Returns periods sorted ascending.
 */
export function getAvailableYears(series: InflationSeries[]): string[] {
  return series
    .filter((s) => s.cpiHeadline != null)
    .map((s) => s.period)
    .sort();
}
