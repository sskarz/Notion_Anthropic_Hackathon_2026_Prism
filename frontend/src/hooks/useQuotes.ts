import { useState, useEffect, useCallback } from 'react';
import type { Quote } from '../types/quote.ts';
import { fetchQuotes } from '../services/api.ts';

export function useQuotes() {
  const [data, setData] = useState<Quote[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const refresh = useCallback(() => {
    setLoading(true);
    setError(null);
    fetchQuotes()
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { data, loading, error, refresh };
}
