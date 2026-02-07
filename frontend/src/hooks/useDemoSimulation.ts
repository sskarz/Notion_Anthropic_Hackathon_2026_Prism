import { useState, useCallback } from 'react';
import { simulateNewInterviewData } from '../services/api.ts';
import type { SimulationResult } from '../services/api.ts';
import { MOCK_DELAY_MS } from '../lib/constants.ts';

export function useDemoSimulation() {
  const [simulating, setSimulating] = useState(false);
  const [newData, setNewData] = useState<SimulationResult | null>(null);

  const triggerSimulation = useCallback(() => {
    setSimulating(true);
    setTimeout(() => {
      const result = simulateNewInterviewData();
      setNewData(result);
      setSimulating(false);
    }, MOCK_DELAY_MS);
  }, []);

  return { simulating, newData, triggerSimulation };
}
