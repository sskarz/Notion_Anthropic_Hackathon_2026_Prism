import { useState, useEffect, useCallback } from 'react';
import type { Issue } from '../types/issue.ts';
import { fetchIssues } from '../services/api.ts';

export function useIssues() {
  const [data, setData] = useState<Issue[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const refresh = useCallback(() => {
    setLoading(true);
    setError(null);
    fetchIssues()
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { data, loading, error, refresh };
}
