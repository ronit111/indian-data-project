import { useState, useEffect } from 'react';
import {
  loadEnvironmentSummary,
  loadAirQuality,
  loadForest,
  loadEnergy,
  loadWater,
  loadEnvironmentIndicators,
} from '../lib/dataLoader.ts';
import type {
  EnvironmentSummary,
  AirQualityData,
  ForestData,
  EnergyData,
  WaterData,
  EnvironmentIndicatorsData,
} from '../lib/data/schema.ts';

interface EnvironmentData {
  summary: EnvironmentSummary | null;
  airQuality: AirQualityData | null;
  forest: ForestData | null;
  energy: EnergyData | null;
  water: WaterData | null;
  indicators: EnvironmentIndicatorsData | null;
  loading: boolean;
  error: string | null;
}

export function useEnvironmentData(year: string): EnvironmentData {
  const [data, setData] = useState<EnvironmentData>({
    summary: null,
    airQuality: null,
    forest: null,
    energy: null,
    water: null,
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
      loadEnvironmentSummary(year),
      loadAirQuality(year),
      loadForest(year),
      loadEnergy(year),
      loadWater(year),
      loadEnvironmentIndicators(year),
    ])
      .then(([summary, airQuality, forest, energy, water, indicators]) => {
        if (!cancelled) {
          setData({
            summary,
            airQuality,
            forest,
            energy,
            water,
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
