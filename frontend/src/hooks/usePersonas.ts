import { useState, useEffect, useCallback } from 'react';
import type { Persona } from '../types/persona.ts';
import { fetchPersonas } from '../services/api.ts';

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
  }, [refresh]);

  return { data, loading, error, refresh };
}
