import { useRef, useEffect, useState } from 'react';
import type { Issue } from '../types/issue';
import { runExaResearch } from '../services/api';

interface UseExaTriggerOptions {
  issues: Issue[] | null;
  companyContext: string;
  onComplete?: () => void;
}

export function useExaTrigger({ issues, companyContext, onComplete }: UseExaTriggerOptions) {
  const processed = useRef<Set<string>>(new Set());
  const [running, setRunning] = useState(false);

  useEffect(() => {
    if (!issues || !companyContext) return;

    const pending = issues.filter(
      (i) => i.exa_trigger && !processed.current.has(i.id),
    );
    if (pending.length === 0) return;

    // Mark as processed immediately to avoid duplicate fires
    pending.forEach((i) => processed.current.add(i.id));

    setRunning(true);
    Promise.allSettled(
      pending.map((i) => runExaResearch(companyContext, i.issue_details)),
    ).then(() => {
      setRunning(false);
      onComplete?.();
    });
  }, [issues, companyContext, onComplete]);

  return { running };
}
