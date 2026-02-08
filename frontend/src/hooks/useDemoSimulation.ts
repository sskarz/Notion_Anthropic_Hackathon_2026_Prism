import { useState, useCallback } from 'react';
import { simulateInterview } from '../services/api.ts';
import type { SimulationResult } from '../services/api.ts';

export function useDemoSimulation() {
  const [simulating, setSimulating] = useState(false);
  const [newData, setNewData] = useState<SimulationResult | null>(null);

  const triggerSimulation = useCallback(async () => {
    setSimulating(true);
    try {
      const result = await simulateInterview();
      setNewData(result);
    } finally {
      setSimulating(false);
    }
  }, []);

  return { simulating, newData, triggerSimulation };
}
