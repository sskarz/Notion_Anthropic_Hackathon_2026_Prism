import { useState, useEffect, useCallback, useRef } from 'react';
import type { Competitor } from '../types/competitor.ts';
import { fetchCompetitors } from '../services/api.ts';

const POLL_MS = 3000;

export function useCompetitors() {
  const [data, setData] = useState<Competitor[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const hasLoaded = useRef(false);

  const refresh = useCallback(() => {
    if (!hasLoaded.current) setLoading(true);
    setError(null);
    fetchCompetitors()
      .then((result) => { setData(result); hasLoaded.current = true; })
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
