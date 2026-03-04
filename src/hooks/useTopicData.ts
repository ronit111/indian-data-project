/**
 * Cross-domain data loader hook for topic pages.
 *
 * Loads an arbitrary set of DomainDataKey files via Promise.allSettled,
 * returning a TopicDataBag where each key is populated or missing.
 * Mirrors the stateReportEngine.ts allSettled pattern.
 */

import { useState, useEffect } from 'react';
import type { DomainDataKey, TopicDataBag } from '../lib/topicConfig.ts';
import { DOMAIN_DATA_MAP } from '../lib/topicDataMap.ts';

export interface TopicDataState {
  data: TopicDataBag;
  loading: boolean;
  error: string | null;
  loadedKeys: DomainDataKey[];
  failedKeys: DomainDataKey[];
}

export function useTopicData(keys: DomainDataKey[]): TopicDataState {
  const [state, setState] = useState<TopicDataState>({
    data: {},
    loading: true,
    error: null,
    loadedKeys: [],
    failedKeys: [],
  });

  const keysKey = keys.join(',');

  // Reset loading state when dependency changes (React-recommended "setState during render" pattern)
  const [prevKeysKey, setPrevKeysKey] = useState(keysKey);
  if (prevKeysKey !== keysKey) {
    setPrevKeysKey(keysKey);
    setState((s) => ({ ...s, loading: true, error: null }));
  }

  useEffect(() => {
    let cancelled = false;

    const currentKeys = keysKey.split(',') as DomainDataKey[];
    const promises = currentKeys.map((key) => {
      const entry = DOMAIN_DATA_MAP[key];
      if (!entry) return Promise.reject(new Error(`Unknown key: ${key}`));
      return entry.loader(entry.year);
    });

    Promise.allSettled(promises).then((results) => {
      if (cancelled) return;

      const bag: TopicDataBag = {};
      const loaded: DomainDataKey[] = [];
      const failed: DomainDataKey[] = [];

      results.forEach((result, i) => {
        const key = currentKeys[i];
        if (result.status === 'fulfilled') {
          bag[key] = result.value;
          loaded.push(key);
        } else {
          failed.push(key);
        }
      });

      const allFailed = loaded.length === 0 && currentKeys.length > 0;

      setState({
        data: bag,
        loading: false,
        error: allFailed ? 'Failed to load any data for this topic' : null,
        loadedKeys: loaded,
        failedKeys: failed,
      });
    });

    return () => {
      cancelled = true;
    };
  }, [keysKey]);

  return state;
}
