import { useState, useEffect, useCallback } from 'react';
import type { InsightTheme } from '../types/insight.ts';
import { fetchInsights } from '../services/api.ts';

export function useInsights(projectId: string) {
  const [data, setData] = useState<InsightTheme[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const refresh = useCallback(() => {
    setLoading(true);
    setError(null);
    fetchInsights(projectId)
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [projectId]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { data, loading, error, refresh };
}
