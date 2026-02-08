import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';

interface ResearchState {
  selectedIssueId: string | null;
  highlightedQuoteId: string | null;
  selectedPersonaId: string | null;
  selectIssue: (id: string | null) => void;
  highlightQuote: (id: string | null) => void;
  selectPersona: (id: string | null) => void;
  clearAll: () => void;
}

const ResearchContext = createContext<ResearchState | null>(null);

export function ResearchProvider({ children }: { children: ReactNode }) {
  const [selectedIssueId, setSelectedIssueId] = useState<string | null>(null);
  const [highlightedQuoteId, setHighlightedQuoteId] = useState<string | null>(null);
  const [selectedPersonaId, setSelectedPersonaId] = useState<string | null>(null);

  const selectIssue = useCallback((id: string | null) => {
    setSelectedIssueId((prev) => (prev === id ? null : id));
  }, []);

  const highlightQuote = useCallback((id: string | null) => {
    setHighlightedQuoteId((prev) => (prev === id ? null : id));
  }, []);

  const selectPersona = useCallback((id: string | null) => {
    setSelectedPersonaId((prev) => (prev === id ? null : id));
  }, []);

  const clearAll = useCallback(() => {
    setSelectedIssueId(null);
    setHighlightedQuoteId(null);
    setSelectedPersonaId(null);
  }, []);

  return (
    <ResearchContext.Provider
      value={{
        selectedIssueId,
        highlightedQuoteId,
        selectedPersonaId,
        selectIssue,
        highlightQuote,
        selectPersona,
        clearAll,
      }}
    >
      {children}
    </ResearchContext.Provider>
  );
}

export function useResearch(): ResearchState {
  const ctx = useContext(ResearchContext);
  if (!ctx) throw new Error('useResearch must be used within a ResearchProvider');
  return ctx;
}
