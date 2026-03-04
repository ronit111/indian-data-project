import { useState, useEffect } from 'react';
import {
  loadEducationSummary,
  loadEnrollment,
  loadQuality,
  loadSpending,
  loadEducationIndicators,
} from '../lib/dataLoader.ts';
import type {
  EducationSummary,
  EnrollmentData,
  QualityData,
  SpendingData,
  EducationIndicatorsData,
} from '../lib/data/schema.ts';

interface EducationData {
  summary: EducationSummary | null;
  enrollment: EnrollmentData | null;
  quality: QualityData | null;
  spending: SpendingData | null;
  indicators: EducationIndicatorsData | null;
  loading: boolean;
  error: string | null;
}

export function useEducationData(year: string): EducationData {
  const [data, setData] = useState<EducationData>({
    summary: null,
    enrollment: null,
    quality: null,
    spending: null,
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
      loadEducationSummary(year),
      loadEnrollment(year),
      loadQuality(year),
      loadSpending(year),
      loadEducationIndicators(year),
    ])
      .then(([summary, enrollment, quality, spending, indicators]) => {
        if (!cancelled) {
          setData({
            summary,
            enrollment,
            quality,
            spending,
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
