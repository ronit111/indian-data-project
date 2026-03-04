import { useState, useEffect } from 'react';
import {
  loadStatesSummary,
  loadGSDP,
  loadStateRevenue,
  loadFiscalHealth,
  loadStatesIndicators,
} from '../lib/dataLoader.ts';
import type {
  StatesSummary,
  GSDPData,
  RevenueData,
  FiscalHealthData,
  StatesIndicatorsData,
} from '../lib/data/schema.ts';

interface StatesData {
  summary: StatesSummary | null;
  gsdp: GSDPData | null;
  revenue: RevenueData | null;
  fiscalHealth: FiscalHealthData | null;
  indicators: StatesIndicatorsData | null;
  loading: boolean;
  error: string | null;
}

export function useStatesData(year: string): StatesData {
  const [data, setData] = useState<StatesData>({
    summary: null,
    gsdp: null,
    revenue: null,
    fiscalHealth: null,
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
      loadStatesSummary(year),
      loadGSDP(year),
      loadStateRevenue(year),
      loadFiscalHealth(year),
      loadStatesIndicators(year),
    ])
      .then(([summary, gsdp, revenue, fiscalHealth, indicators]) => {
        if (!cancelled) {
          setData({
            summary,
            gsdp,
            revenue,
            fiscalHealth,
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
