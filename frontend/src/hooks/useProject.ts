import { useState, useEffect, useCallback } from 'react';
import type { ResearchProject } from '../types/project.ts';
import { fetchProject } from '../services/api.ts';

export function useProject(projectId: string) {
  const [data, setData] = useState<ResearchProject | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const refresh = useCallback(() => {
    setLoading(true);
    setError(null);
    fetchProject(projectId)
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [projectId]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { data, loading, error, refresh };
}
