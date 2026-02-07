import { useState, useEffect, useCallback } from 'react';
import type { QuoteEvidence } from '../types/quote.ts';
import { fetchQuotes } from '../services/api.ts';

export function useQuotes(projectId: string) {
  const [data, setData] = useState<QuoteEvidence[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const refresh = useCallback(() => {
    setLoading(true);
    setError(null);
    fetchQuotes(projectId)
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [projectId]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { data, loading, error, refresh };
}
