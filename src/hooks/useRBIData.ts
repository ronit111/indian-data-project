import { useState, useEffect } from 'react';
import {
  loadRBISummary,
  loadMonetaryPolicy,
  loadLiquidity,
  loadCredit,
  loadForex,
  loadRBIIndicators,
} from '../lib/dataLoader.ts';
import type {
  RBISummary,
  MonetaryPolicyData,
  LiquidityData,
  CreditData,
  ForexData,
  RBIIndicatorsData,
} from '../lib/data/schema.ts';

interface RBIData {
  summary: RBISummary | null;
  monetaryPolicy: MonetaryPolicyData | null;
  liquidity: LiquidityData | null;
  credit: CreditData | null;
  forex: ForexData | null;
  indicators: RBIIndicatorsData | null;
  loading: boolean;
  error: string | null;
}

export function useRBIData(year: string): RBIData {
  const [data, setData] = useState<RBIData>({
    summary: null,
    monetaryPolicy: null,
    liquidity: null,
    credit: null,
    forex: null,
    indicators: null,
    loading: true,
    error: null,
  });

  // Reset loading state when dependency changes (React-recommended "setState during render" pattern)
  const [prevYear, setPrevYear] = useState(year);
  if (prevYear !== year) {
    setPrevYear(year);
    setData((d) => ({ ...d, loading: true, error: null }));
  }

  useEffect(() => {
    let cancelled = false;

    Promise.all([
      loadRBISummary(year),
      loadMonetaryPolicy(year),
      loadLiquidity(year),
      loadCredit(year),
      loadForex(year),
      loadRBIIndicators(year),
    ])
      .then(([summary, monetaryPolicy, liquidity, credit, forex, indicators]) => {
        if (!cancelled) {
          setData({
            summary,
            monetaryPolicy,
            liquidity,
            credit,
            forex,
            indicators,
            loading: false,
            error: null,
          });
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setData((d) => ({ ...d, loading: false, error: String(err) }));
        }
      });

    return () => {
      cancelled = true;
    };
  }, [year]);

  return data;
}
