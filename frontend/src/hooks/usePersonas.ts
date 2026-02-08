import { useState, useEffect, useCallback } from 'react';
import type { Persona } from '../types/persona.ts';
import { fetchPersonas } from '../services/api.ts';

const POLL_MS = 3000;

export function usePersonas() {
  const [data, setData] = useState<Persona[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const refresh = useCallback(() => {
    setLoading(true);
    setError(null);
    fetchPersonas()
      .then(setData)
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
