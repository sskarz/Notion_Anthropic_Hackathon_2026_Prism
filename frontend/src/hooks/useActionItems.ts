import { useState, useEffect, useCallback } from 'react';
import type { ActionItem } from '../types/action.ts';
import { fetchActionItems } from '../services/api.ts';

export function useActionItems(projectId: string) {
  const [data, setData] = useState<ActionItem[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const refresh = useCallback(() => {
    setLoading(true);
    setError(null);
    fetchActionItems(projectId)
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [projectId]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { data, loading, error, refresh };
}
