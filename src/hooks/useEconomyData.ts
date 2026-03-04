import { useState, useEffect } from 'react';
import {
  loadEconomySummary,
  loadGDPGrowth,
  loadInflation,
  loadFiscal,
  loadExternal,
  loadSectors,
  loadIndicators,
} from '../lib/dataLoader.ts';
import type {
  EconomySummary,
  GDPGrowthData,
  InflationData,
  FiscalData,
  ExternalData,
  SectorsData,
  IndicatorsData,
} from '../lib/data/schema.ts';

interface EconomyData {
  summary: EconomySummary | null;
  gdpGrowth: GDPGrowthData | null;
  inflation: InflationData | null;
  fiscal: FiscalData | null;
  external: ExternalData | null;
  sectors: SectorsData | null;
  indicators: IndicatorsData | null;
  loading: boolean;
  error: string | null;
}

export function useEconomyData(year: string): EconomyData {
  const [data, setData] = useState<EconomyData>({
    summary: null,
    gdpGrowth: null,
    inflation: null,
    fiscal: null,
    external: null,
    sectors: null,
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
      loadEconomySummary(year),
      loadGDPGrowth(year),
      loadInflation(year),
      loadFiscal(year),
      loadExternal(year),
      loadSectors(year),
      loadIndicators(year),
    ])
      .then(([summary, gdpGrowth, inflation, fiscal, external, sectors, indicators]) => {
        if (!cancelled) {
          setData({
            summary,
            gdpGrowth,
            inflation,
            fiscal,
            external,
            sectors,
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
