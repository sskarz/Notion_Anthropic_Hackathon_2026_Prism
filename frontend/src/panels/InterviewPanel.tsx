import { MessageSquare } from 'lucide-react';
import { cn } from '../lib/utils';
import { useQuotes } from '../hooks/useQuotes';
import { useResearch } from '../context/ResearchContext';
import PanelContainer from '../components/shared/PanelContainer';
import LiveKitSession from '../components/LiveKitSession';
import type { Sentiment, QuoteType } from '../types/quote';

const SENTIMENT_DOT: Record<Sentiment, string> = {
  Positive: 'bg-success',
  Negative: 'bg-error',
  Neutral: 'bg-text-tertiary',
  Frustrated: 'bg-warning',
};

const QUOTE_TYPE_COLOR: Record<QuoteType, string> = {
  'Pain Point': 'text-error',
  Insight: 'text-accent-cyan',
  'Feature Request': 'text-warning',
  Praise: 'text-success',
};

export default function InterviewPanel() {
  const { data: quotes, loading } = useQuotes();
  const { highlightedQuoteId, highlightQuote, selectedPersonaId } = useResearch();

  const sorted = (quotes ?? [])
    .slice()
    .sort((a, b) => new Date(b.created_time).getTime() - new Date(a.created_time).getTime());

  return (
    <PanelContainer title="Interview" icon={MessageSquare} active>
      <div className="flex h-full flex-col">
        <div className="flex-1 min-h-0">
          <LiveKitSession />
        </div>

        <div className="mt-3 border-t border-border-primary pt-3">
          <h3 className="mb-2 text-[11px] font-medium uppercase tracking-wider text-text-tertiary">
            Recent Quotes
          </h3>
          <div className="max-h-48 space-y-1.5 overflow-y-auto">
            {loading && <p className="text-xs text-text-tertiary">Loading...</p>}
            {sorted.map((q) => (
              <button
                key={q.id}
                onClick={() => highlightQuote(q.id)}
                className={cn(
                  'w-full rounded border border-border-primary bg-bg-tertiary p-2 text-left transition-colors hover:bg-bg-hover',
                  highlightedQuoteId === q.id && 'border-accent-cyan bg-bg-hover',
                  selectedPersonaId &&
                    q.related_persona_id === selectedPersonaId &&
                    highlightedQuoteId !== q.id &&
                    'border-accent-cyan/30 bg-accent-cyan-glow',
                )}
              >
                <p className="line-clamp-2 text-[11px] text-text-primary">{q.quote_text}</p>
                <div className="mt-1 flex items-center gap-2">
                  <span className={cn('h-1.5 w-1.5 rounded-full', SENTIMENT_DOT[q.sentiment])} />
                  <span className="truncate text-[10px] text-text-secondary">{q.speaker}</span>
                  <span className={cn('ml-auto shrink-0 text-[10px] font-medium', QUOTE_TYPE_COLOR[q.quote_type])}>
                    {q.quote_type}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </PanelContainer>
  );
}
