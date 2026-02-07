import { useState, useEffect, useCallback } from 'react';
import type { CompetitorEntry } from '../types/competitor.ts';
import { fetchCompetitors } from '../services/api.ts';

export function useCompetitors(projectId: string) {
  const [data, setData] = useState<CompetitorEntry[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const refresh = useCallback(() => {
    setLoading(true);
    setError(null);
    fetchCompetitors(projectId)
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [projectId]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { data, loading, error, refresh };
}
