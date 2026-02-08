import { useState, useEffect, useCallback } from 'react';
import type { Competitor } from '../types/competitor.ts';
import { fetchCompetitors } from '../services/api.ts';

export function useCompetitors() {
  const [data, setData] = useState<Competitor[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const refresh = useCallback(() => {
    setLoading(true);
    setError(null);
    fetchCompetitors()
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { data, loading, error, refresh };
}
