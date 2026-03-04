/**
 * EMI calculation engine.
 *
 * Core formula: EMI = P × r × (1+r)^n / ((1+r)^n − 1)
 * where r = annual rate / 12 / 100, n = tenure in months.
 *
 * Source: Standard reducing-balance amortization used by all Indian banks.
 * Spread data from SBI/HDFC/ICICI published EBLR rate cards.
 */

export interface LoanSpreadsData {
  year: string;
  lastUpdated: string;
  spreads: {
    home: LoanSpread;
    car: LoanSpread;
    personal: LoanSpread;
  };
}

export interface LoanSpread {
  minSpread: number;
  typicalSpread: number;
  maxSpread: number;
  source: string;
}

export type LoanType = 'home' | 'car' | 'personal';

export interface EMIBreakdown {
  monthlyEMI: number;
  totalPayment: number;
  totalInterest: number;
  effectiveRate: number;
  interestRatio: number; // totalInterest / principal — "Rs X interest per Rs 1 borrowed"
}

export interface RateScenario {
  label: string;
  bpsChange: number;
  rate: number;
  monthlyEMI: number;
  monthlyDiff: number; // vs current EMI (positive = costlier)
  totalDiff: number; // total difference over full tenure
}

export interface RateChangeImpact {
  scenarios: RateScenario[];
  currentScenarioIndex: number;
}

export function calculateEMI(
  principal: number,
  annualRate: number,
  tenureMonths: number
): EMIBreakdown {
  if (principal <= 0) {
    return { monthlyEMI: 0, totalPayment: 0, totalInterest: 0, effectiveRate: annualRate, interestRatio: 0 };
  }
  if (tenureMonths <= 0) {
    throw new Error('Tenure must be > 0 months');
  }
  if (annualRate <= 0) {
    const monthlyEMI = principal / tenureMonths;
    return { monthlyEMI, totalPayment: principal, totalInterest: 0, effectiveRate: 0, interestRatio: 0 };
  }

  const r = annualRate / 12 / 100;
  const n = tenureMonths;
  const power = Math.pow(1 + r, n);
  // Guard against overflow (extremely high rate × long tenure)
  if (!isFinite(power) || power <= 1) {
    return { monthlyEMI: 0, totalPayment: 0, totalInterest: 0, effectiveRate: annualRate, interestRatio: 0 };
  }
  const monthlyEMI = (principal * r * power) / (power - 1);
  const totalPayment = monthlyEMI * n;
  const totalInterest = totalPayment - principal;
  const interestRatio = totalInterest / principal;

  return {
    monthlyEMI: Math.round(monthlyEMI),
    totalPayment: Math.round(totalPayment),
    totalInterest: Math.round(totalInterest),
    effectiveRate: annualRate,
    interestRatio: Math.round(interestRatio * 100) / 100,
  };
}

export function calculateRateImpact(
  principal: number,
  tenureMonths: number,
  currentRate: number
): RateChangeImpact {
  const bpsOffsets = [-50, -25, 0, 25, 50];
  const labels = ['-50 bps', '-25 bps', 'Current', '+25 bps', '+50 bps'];
  const currentBreakdown = calculateEMI(principal, currentRate, tenureMonths);

  const scenarios: RateScenario[] = bpsOffsets.map((bps, i) => {
    const rate = Math.max(0, currentRate + bps / 100);
    const breakdown = calculateEMI(principal, rate, tenureMonths);
    return {
      label: labels[i],
      bpsChange: bps,
      rate,
      monthlyEMI: breakdown.monthlyEMI,
      monthlyDiff: breakdown.monthlyEMI - currentBreakdown.monthlyEMI,
      totalDiff: breakdown.totalPayment - currentBreakdown.totalPayment,
    };
  });

  return { scenarios, currentScenarioIndex: 2 };
}

export function getEffectiveRate(
  repoRate: number,
  loanType: LoanType,
  spreads: LoanSpreadsData
): number {
  const spread = spreads.spreads[loanType];
  if (!spread) return repoRate;
  return repoRate + spread.typicalSpread;
}
