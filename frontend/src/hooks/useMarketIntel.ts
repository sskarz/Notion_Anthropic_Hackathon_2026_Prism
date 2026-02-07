import { useState, useEffect, useCallback } from 'react';
import type { MarketIntelligence } from '../types/market.ts';
import { fetchMarketIntel } from '../services/api.ts';

export function useMarketIntel(projectId: string) {
  const [data, setData] = useState<MarketIntelligence[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const refresh = useCallback(() => {
    setLoading(true);
    setError(null);
    fetchMarketIntel(projectId)
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [projectId]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { data, loading, error, refresh };
}
