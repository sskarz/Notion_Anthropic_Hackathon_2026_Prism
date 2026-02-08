import { useState } from 'react';
import { ScrollText } from 'lucide-react';
import { cn } from '../lib/utils';
import { useQuotes } from '../hooks/useQuotes';
import { useCompetitors } from '../hooks/useCompetitors';
import { useAnalytics } from '../hooks/useAnalytics';
import { useResearch } from '../context/ResearchContext';
import PanelContainer from '../components/shared/PanelContainer';
import type { Sentiment, QuoteType } from '../types/quote';
import type { UserSentiment } from '../types/competitor';

type Tab = 'quotes' | 'competitive' | 'analytics';
type SentimentFilter = 'All' | Sentiment;

const TABS: { key: Tab; label: string }[] = [
  { key: 'quotes', label: 'Quotes' },
  { key: 'competitive', label: 'Competitive' },
  { key: 'analytics', label: 'Analytics' },
];

const SENTIMENT_DOT: Record<Sentiment, string> = {
  Positive: 'bg-success',
  Negative: 'bg-error',
  Neutral: 'bg-text-tertiary',
  Frustrated: 'bg-warning',
};

const SENTIMENT_BADGE: Record<Sentiment, string> = {
  Positive: 'text-success',
  Negative: 'text-error',
  Neutral: 'text-text-secondary',
  Frustrated: 'text-warning',
};

const QUOTE_TYPE_COLOR: Record<QuoteType, string> = {
  'Pain Point': 'text-error',
  Insight: 'text-accent-cyan',
  'Feature Request': 'text-warning',
  Praise: 'text-success',
};

const COMP_SENTIMENT: Record<UserSentiment, string> = {
  Positive: 'text-success',
  Mixed: 'text-warning',
  Negative: 'text-error',
};

const SEVERITY_BAR_COLOR: Record<string, string> = {
  Critical: 'bg-error',
  High: 'bg-orange-500',
  Medium: 'bg-warning',
  Low: 'bg-text-tertiary',
};

const SENTIMENT_BAR_COLOR: Record<string, string> = {
  Positive: 'bg-success',
  Negative: 'bg-error',
  Neutral: 'bg-text-tertiary',
  Frustrated: 'bg-warning',
};

const TYPE_BAR_COLOR: Record<string, string> = {
  'Pain Point': 'bg-error',
  'Feature Request': 'bg-warning',
  'Workflow Gap': 'bg-accent-cyan',
  'Unmet Need': 'bg-text-secondary',
};

function HorizontalBars({
  data,
  colorMap,
}: {
  data: Record<string, number>;
  colorMap: Record<string, string>;
}) {
  const max = Math.max(...Object.values(data), 1);
  return (
    <div className="space-y-1.5">
      {Object.entries(data).map(([label, count]) => (
        <div key={label} className="flex items-center gap-2">
          <span className="w-24 shrink-0 text-right text-[10px] text-text-secondary">{label}</span>
          <div className="flex-1 h-3 rounded bg-bg-secondary overflow-hidden">
            <div
              className={cn('h-full rounded', colorMap[label] ?? 'bg-accent-cyan')}
              style={{ width: `${(count / max) * 100}%` }}
            />
          </div>
          <span className="w-6 text-[10px] text-text-tertiary">{count}</span>
        </div>
      ))}
    </div>
  );
}

function QuotesTab() {
  const { data: quotes, loading } = useQuotes();
  const { highlightedQuoteId, highlightQuote } = useResearch();
  const [filter, setFilter] = useState<SentimentFilter>('All');

  const filters: SentimentFilter[] = ['All', 'Positive', 'Negative', 'Neutral', 'Frustrated'];

  const filtered = (quotes ?? []).filter((q) => filter === 'All' || q.sentiment === filter);

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-1">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={cn(
              'rounded px-2 py-0.5 text-[10px] font-medium transition-colors',
              filter === f
                ? 'bg-accent-cyan text-bg-primary'
                : 'bg-bg-secondary text-text-secondary hover:text-text-primary',
            )}
          >
            {f}
          </button>
        ))}
      </div>
      {loading && <p className="text-xs text-text-tertiary">Loading...</p>}
      <div className="space-y-1">
        {filtered.map((q) => (
          <button
            key={q.id}
            onClick={() => highlightQuote(q.id)}
            className={cn(
              'flex w-full items-start gap-2 rounded border border-border-primary bg-bg-tertiary px-2.5 py-2 text-left transition-colors hover:bg-bg-hover',
              highlightedQuoteId === q.id && 'border-accent-cyan bg-bg-hover',
            )}
          >
            <span className={cn('mt-1 h-1.5 w-1.5 shrink-0 rounded-full', SENTIMENT_DOT[q.sentiment])} />
            <div className="min-w-0 flex-1">
              <p className="line-clamp-1 text-[11px] text-text-primary">{q.quote_text}</p>
              <div className="mt-0.5 flex items-center gap-2">
                <span className="truncate text-[10px] text-text-secondary">{q.speaker}</span>
                <span className={cn('shrink-0 text-[10px] font-medium', SENTIMENT_BADGE[q.sentiment])}>
                  {q.sentiment}
                </span>
                <span className={cn('shrink-0 text-[10px]', QUOTE_TYPE_COLOR[q.quote_type])}>
                  {q.quote_type}
                </span>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

function CompetitiveTab() {
  const { data: competitors, loading } = useCompetitors();

  if (loading) return <p className="text-xs text-text-tertiary">Loading...</p>;

  return (
    <div className="grid grid-cols-2 gap-2">
      {competitors?.map((c) => (
        <div
          key={c.id}
          className="rounded border border-border-primary bg-bg-tertiary p-2.5"
        >
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-medium text-text-primary">{c.competitor_name}</span>
            <span className={cn('text-[10px] font-medium', COMP_SENTIMENT[c.user_sentiment])}>
              {c.user_sentiment}
            </span>
          </div>
          <p className="mt-1 line-clamp-2 text-[11px] text-text-tertiary">{c.key_features}</p>
          <div className="mt-1.5 flex items-center justify-between">
            <span className="text-[10px] text-text-secondary">{c.pricing}</span>
            <a
              href={c.website}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[10px] text-accent-cyan-dim hover:text-accent-cyan"
            >
              website
            </a>
          </div>
        </div>
      ))}
    </div>
  );
}

function AnalyticsTab() {
  const { data: analytics, loading } = useAnalytics();

  if (loading || !analytics) return <p className="text-xs text-text-tertiary">Loading...</p>;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {[
          { label: 'Issues', value: analytics.total_issues },
          { label: 'Quotes', value: analytics.total_quotes },
          { label: 'Personas', value: analytics.total_personas },
          { label: 'Competitors', value: analytics.total_competitors },
        ].map((s) => (
          <div
            key={s.label}
            className="rounded border border-border-primary bg-bg-tertiary px-3 py-2 text-center"
          >
            <div className="text-lg font-semibold text-text-primary">{s.value}</div>
            <div className="text-[10px] text-text-secondary">{s.label}</div>
          </div>
        ))}
      </div>

      <div>
        <h4 className="mb-1.5 text-[11px] font-medium uppercase tracking-wider text-text-tertiary">
          Issues by Severity
        </h4>
        <HorizontalBars data={analytics.issues_by_severity} colorMap={SEVERITY_BAR_COLOR} />
      </div>

      <div>
        <h4 className="mb-1.5 text-[11px] font-medium uppercase tracking-wider text-text-tertiary">
          Issues by Type
        </h4>
        <HorizontalBars data={analytics.issues_by_type} colorMap={TYPE_BAR_COLOR} />
      </div>

      <div>
        <h4 className="mb-1.5 text-[11px] font-medium uppercase tracking-wider text-text-tertiary">
          Quotes by Sentiment
        </h4>
        <HorizontalBars data={analytics.quotes_by_sentiment} colorMap={SENTIMENT_BAR_COLOR} />
      </div>
    </div>
  );
}

export default function ResearchLogPanel() {
  const [tab, setTab] = useState<Tab>('quotes');

  return (
    <PanelContainer title="Research Log" icon={ScrollText}>
      <div className="flex h-full flex-col">
        <div className="flex shrink-0 gap-1 border-b border-border-primary pb-2">
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={cn(
                'rounded px-2.5 py-1 text-xs font-medium transition-colors',
                tab === t.key
                  ? 'bg-accent-cyan/15 text-accent-cyan'
                  : 'text-text-secondary hover:bg-bg-hover hover:text-text-primary',
              )}
            >
              {t.label}
            </button>
          ))}
        </div>
        <div className="mt-2 flex-1 min-h-0 overflow-y-auto">
          {tab === 'quotes' && <QuotesTab />}
          {tab === 'competitive' && <CompetitiveTab />}
          {tab === 'analytics' && <AnalyticsTab />}
        </div>
      </div>
    </PanelContainer>
  );
}
