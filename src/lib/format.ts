/**
 * Indian number formatting utilities.
 * Indian system: 50,21,536 (not 5,021,536)
 * Pattern: last 3 digits, then groups of 2
 */

export function formatIndianNumber(num: number): string {
  const isNegative = num < 0;
  const absNum = Math.abs(Math.round(num));
  const str = absNum.toString();

  if (str.length <= 3) return (isNegative ? '-' : '') + str;

  const lastThree = str.slice(-3);
  const remaining = str.slice(0, -3);
  const formatted = remaining.replace(/\B(?=(\d{2})+(?!\d))/g, ',');

  return (isNegative ? '-' : '') + formatted + ',' + lastThree;
}

/**
 * Format ₹ in crore with Indian grouping.
 * e.g., 5021536 → "₹50,21,536 Cr"
 */
export function formatRsCrore(crore: number): string {
  return `₹${formatIndianNumber(crore)} Cr`;
}

/**
 * Format large crore values in lakh crore for readability.
 * e.g., 5021536 → "₹50.22 lakh crore"
 */
export function formatLakhCrore(crore: number): string {
  const lakhCrore = crore / 100000;
  return `₹${lakhCrore.toFixed(2)} lakh crore`;
}

/**
 * Format a percentage with optional decimal places.
 */
export function formatPercent(value: number, decimals = 1): string {
  return `${value.toFixed(decimals)}%`;
}

/**
 * Format YoY change with arrow and color hint.
 */
export function formatYoYChange(value: number | null): {
  text: string;
  isPositive: boolean;
  isNeutral: boolean;
} {
  if (value === null) return { text: 'N/A', isPositive: false, isNeutral: true };
  const isPositive = value >= 0;
  const arrow = isPositive ? '\u2191' : '\u2193';
  return {
    text: `${arrow} ${Math.abs(value).toFixed(1)}%`,
    isPositive,
    isNeutral: false,
  };
}

/**
 * Format per-capita amount.
 */
export function formatPerCapita(amount: number): string {
  return `₹${formatIndianNumber(Math.round(amount))}`;
}

/**
 * Calculate "paisa per rupee" for a ministry share.
 */
export function paisaPerRupee(percentOfTotal: number): string {
  const paisa = (percentOfTotal).toFixed(1);
  return `${paisa} paisa per rupee`;
}

/**
 * Format income in LPA for display.
 */
export function formatLPA(amount: number): string {
  const lpa = amount / 100000;
  if (lpa >= 100) return `₹${(lpa / 100).toFixed(0)} Cr`;
  if (lpa >= 10) return `₹${lpa.toFixed(0)} LPA`;
  return `₹${lpa.toFixed(1)} LPA`;
}
