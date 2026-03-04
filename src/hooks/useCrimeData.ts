import { useState, useEffect } from 'react';
import {
  loadCrimeSummary,
  loadCrimeOverview,
  loadWomenSafety,
  loadRoadAccidents,
  loadCybercrime,
  loadPolice,
  loadJustice,
} from '../lib/dataLoader.ts';
import type {
  CrimeSummary,
  CrimeOverviewData,
  WomenSafetyData,
  RoadAccidentData,
  CybercrimeData,
  PoliceData,
  JusticeData,
} from '../lib/data/schema.ts';

interface CrimeData {
  summary: CrimeSummary | null;
  overview: CrimeOverviewData | null;
  womenSafety: WomenSafetyData | null;
  roadAccidents: RoadAccidentData | null;
  cybercrime: CybercrimeData | null;
  police: PoliceData | null;
  justice: JusticeData | null;
  loading: boolean;
  error: string | null;
}

export function useCrimeData(year: string): CrimeData {
  const [data, setData] = useState<CrimeData>({
    summary: null,
    overview: null,
    womenSafety: null,
    roadAccidents: null,
    cybercrime: null,
    police: null,
    justice: null,
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
      loadCrimeSummary(year),
      loadCrimeOverview(year),
      loadWomenSafety(year),
      loadRoadAccidents(year),
      loadCybercrime(year),
      loadPolice(year),
      loadJustice(year),
    ])
      .then(([summary, overview, womenSafety, roadAccidents, cybercrime, police, justice]) => {
        if (!cancelled) {
          setData({
            summary,
            overview,
            womenSafety,
            roadAccidents,
            cybercrime,
            police,
            justice,
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
