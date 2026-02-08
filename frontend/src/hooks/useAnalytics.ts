import { useState, useEffect, useCallback } from 'react';
import type { AnalyticsData } from '../types/analytics.ts';
import { fetchAnalytics } from '../services/api.ts';

const POLL_MS = 3000;

export function useAnalytics() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const refresh = useCallback(() => {
    setLoading(true);
    setError(null);
    fetchAnalytics()
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    refresh();
    const id = setInterval(refresh, POLL_MS);
    return () => clearInterval(id);
  }, [refresh]);

  return { data, loading, error, refresh };
}
