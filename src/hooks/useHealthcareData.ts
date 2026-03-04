import { useState, useEffect } from 'react';
import {
  loadHealthcareSummary,
  loadInfrastructure,
  loadHealthSpending,
  loadDisease,
  loadHealthcareIndicators,
} from '../lib/dataLoader.ts';
import type {
  HealthcareSummary,
  InfrastructureData,
  HealthSpendingData,
  DiseaseData,
  HealthcareIndicatorsData,
} from '../lib/data/schema.ts';

interface HealthcareData {
  summary: HealthcareSummary | null;
  infrastructure: InfrastructureData | null;
  spending: HealthSpendingData | null;
  disease: DiseaseData | null;
  indicators: HealthcareIndicatorsData | null;
  loading: boolean;
  error: string | null;
}

export function useHealthcareData(year: string): HealthcareData {
  const [data, setData] = useState<HealthcareData>({
    summary: null,
    infrastructure: null,
    spending: null,
    disease: null,
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
      loadHealthcareSummary(year),
      loadInfrastructure(year),
      loadHealthSpending(year),
      loadDisease(year),
      loadHealthcareIndicators(year),
    ])
      .then(([summary, infrastructure, spending, disease, indicators]) => {
        if (!cancelled) {
          setData({
            summary,
            infrastructure,
            spending,
            disease,
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
