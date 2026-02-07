import { useState, useEffect, useCallback } from 'react';
import type { InterviewTranscript } from '../types/transcript.ts';
import { fetchTranscripts } from '../services/api.ts';

export function useTranscripts(projectId: string) {
  const [data, setData] = useState<InterviewTranscript[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const refresh = useCallback(() => {
    setLoading(true);
    setError(null);
    fetchTranscripts(projectId)
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [projectId]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { data, loading, error, refresh };
}
