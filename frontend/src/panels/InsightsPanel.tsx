import { useMemo } from 'react';
import { Lightbulb, Zap } from 'lucide-react';
import { cn } from '../lib/utils';
import { useIssues } from '../hooks/useIssues';
import { useQuotes } from '../hooks/useQuotes';
import { usePersonas } from '../hooks/usePersonas';
import { useAnalytics } from '../hooks/useAnalytics';
import { useResearch } from '../context/ResearchContext';
import PanelContainer from '../components/shared/PanelContainer';
import LineChart from '../components/charts/LineChart';
import Heatmap from '../components/charts/Heatmap';
import { parseGraphData, aggregateIssuesByDate } from '../utils/chartUtils';
import type { Issue, Severity, IssueType } from '../types/issue';
import type { Persona } from '../types/persona';
import type { Quote, Sentiment, QuoteType } from '../types/quote';
import type { AnalyticsData } from '../types/analytics';

const SEVERITY_BADGE: Record<Severity, string> = {
  Critical: 'bg-error text-white',
  High: 'bg-orange-500 text-white',
  Medium: 'bg-warning text-black',
  Low: 'bg-text-tertiary text-white',
};

const TYPE_COLOR: Record<IssueType, string> = {
  'Pain Point': 'text-error',
  'Feature Request': 'text-warning',
  'Workflow Gap': 'text-accent-cyan',
  'Unmet Need': 'text-text-secondary',
};

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

function IssueDetailView({
  issue,
  persona,
  relatedQuotes,
  onBackToPersona,
}: {
  issue: Issue;
  persona: Persona | null;
  relatedQuotes: Quote[];
  onBackToPersona: () => void;
}) {
  const graphData = useMemo(() => {
    if (!issue.graph_type || issue.graph_type === 'None' || !issue.graph_data) return null;
    try {
      return parseGraphData(issue.graph_data);
    } catch {
      return null;
    }
  }, [issue.graph_type, issue.graph_data]);

  const maxValue = graphData
    ? Math.max(...graphData.entries.map((e) => e.value), 1)
    : 0;

  return (
    <div className="space-y-4">
      {persona && (
        <button
          onClick={onBackToPersona}
          className="text-[11px] text-accent-cyan hover:text-accent-cyan-dim transition-colors"
        >
          {persona.speaker_name}
        </button>
      )}

      <div>
        <h2 className="text-sm font-medium text-text-primary">{issue.issue_title}</h2>
        <div className="mt-2 flex items-center gap-2 flex-wrap">
          <span
            className={cn(
              'rounded px-1.5 py-0.5 text-[10px] font-medium',
              SEVERITY_BADGE[issue.severity],
            )}
          >
            {issue.severity}
          </span>
          <span className={cn('text-[10px] font-medium', TYPE_COLOR[issue.issue_type])}>
            {issue.issue_type}
          </span>
          {issue.exa_trigger && (
            <Zap size={10} className="text-warning" />
          )}
        </div>
      </div>

      <p className="text-xs text-text-secondary leading-relaxed">{issue.issue_details}</p>

      {issue.engineer_matching && (
        <div className="rounded border border-border-primary bg-bg-tertiary p-2.5">
          <h3 className="mb-1 text-[10px] font-medium uppercase tracking-wider text-text-tertiary">
            Engineer Matching
          </h3>
          <p className="text-xs text-text-secondary">{issue.engineer_matching}</p>
        </div>
      )}

      {graphData && graphData.entries.length > 0 && (
        <div className="rounded border border-border-primary bg-bg-tertiary p-2.5">
          <h3 className="mb-1 text-[10px] font-medium uppercase tracking-wider text-text-tertiary">
            {issue.graph_type} Chart
          </h3>
          {graphData.title && (
            <p className="mb-2 text-[10px] text-text-secondary">{graphData.title}</p>
          )}

          {issue.graph_type === 'Trend' ? (
            <LineChart
              data={graphData.entries.map((e) => ({ x: e.label, y: e.value }))}
              height={160}
            />
          ) : issue.graph_type === 'Heatmap' ? (
            <Heatmap data={graphData.entries} />
          ) : (
            /* Bar (default) - CSS horizontal bars */
            <div className="space-y-1.5">
              {graphData.entries.map((entry, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="w-20 shrink-0 truncate text-[10px] text-text-secondary">
                    {entry.label}
                  </span>
                  <div className="flex-1 h-3 rounded bg-bg-primary overflow-hidden">
                    <div
                      className="h-full rounded bg-accent-cyan"
                      style={{ width: `${(entry.value / maxValue) * 100}%` }}
                    />
                  </div>
                  <span className="w-8 shrink-0 text-right text-[10px] text-text-tertiary">
                    {entry.value}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {relatedQuotes.length > 0 && (
        <div>
          <h3 className="mb-2 text-[10px] font-medium uppercase tracking-wider text-text-tertiary">
            Related Quotes ({relatedQuotes.length})
          </h3>
          <div className="space-y-1.5">
            {relatedQuotes.map((q) => (
              <div
                key={q.id}
                className="rounded border border-border-primary bg-bg-tertiary p-2"
              >
                <p className="text-[11px] text-text-primary leading-relaxed">{q.quote_text}</p>
                <div className="mt-1 flex items-center gap-2">
                  <span className={cn('h-1.5 w-1.5 rounded-full', SENTIMENT_DOT[q.sentiment])} />
                  <span className="truncate text-[10px] text-text-secondary">{q.speaker}</span>
                  <span className={cn('ml-auto shrink-0 text-[10px] font-medium', QUOTE_TYPE_COLOR[q.quote_type])}>
                    {q.quote_type}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function PersonaDetailView({
  persona,
  relatedIssues,
  onSelectIssue,
}: {
  persona: Persona;
  relatedIssues: Issue[];
  onSelectIssue: (id: string) => void;
}) {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-sm font-medium text-text-primary">{persona.speaker_name}</h2>
        <p className="mt-0.5 text-[11px] text-text-tertiary">{persona.persona_type}</p>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {persona.primary_use_case && (
          <div className="rounded border border-border-primary bg-bg-tertiary p-2">
            <h4 className="text-[9px] font-medium uppercase tracking-wider text-text-tertiary">Use Case</h4>
            <p className="mt-0.5 text-[11px] text-text-secondary">{persona.primary_use_case}</p>
          </div>
        )}
        {persona.communication_style && (
          <div className="rounded border border-border-primary bg-bg-tertiary p-2">
            <h4 className="text-[9px] font-medium uppercase tracking-wider text-text-tertiary">Comm Style</h4>
            <p className="mt-0.5 text-[11px] text-text-secondary">{persona.communication_style}</p>
          </div>
        )}
        {persona.goals && (
          <div className="rounded border border-border-primary bg-bg-tertiary p-2">
            <h4 className="text-[9px] font-medium uppercase tracking-wider text-text-tertiary">Goals</h4>
            <p className="mt-0.5 text-[11px] text-text-secondary">{persona.goals}</p>
          </div>
        )}
        {persona.constraints && (
          <div className="rounded border border-border-primary bg-bg-tertiary p-2">
            <h4 className="text-[9px] font-medium uppercase tracking-wider text-text-tertiary">Constraints</h4>
            <p className="mt-0.5 text-[11px] text-text-secondary">{persona.constraints}</p>
          </div>
        )}
      </div>

      {persona.persona_summary && (
        <div className="rounded border border-border-primary bg-bg-tertiary p-2.5">
          <h3 className="mb-1 text-[10px] font-medium uppercase tracking-wider text-text-tertiary">
            Summary
          </h3>
          <p className="text-xs text-text-secondary leading-relaxed">{persona.persona_summary}</p>
        </div>
      )}

      {relatedIssues.length > 0 && (
        <div>
          <h3 className="mb-2 text-[10px] font-medium uppercase tracking-wider text-text-tertiary">
            Issues ({relatedIssues.length})
          </h3>
          <div className="space-y-1.5">
            {relatedIssues.map((issue) => (
              <button
                key={issue.id}
                onClick={() => onSelectIssue(issue.id)}
                className="w-full rounded border border-border-primary bg-bg-tertiary p-2 text-left transition-colors hover:bg-bg-hover"
              >
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span
                    className={cn(
                      'rounded px-1.5 py-0.5 text-[10px] font-medium',
                      SEVERITY_BADGE[issue.severity],
                    )}
                  >
                    {issue.severity}
                  </span>
                  <span className={cn('text-[10px] font-medium', TYPE_COLOR[issue.issue_type])}>
                    {issue.issue_type}
                  </span>
                </div>
                <p className="mt-1 text-xs text-text-primary">{issue.issue_title}</p>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function DefaultDashboard({
  analytics,
  issues,
  recentQuotes,
}: {
  analytics: AnalyticsData | null;
  issues: Issue[];
  recentQuotes: Quote[];
}) {
  const issuesByDate = useMemo(
    () => aggregateIssuesByDate(issues).map((d) => ({ x: d.date, y: d.count })),
    [issues],
  );

  return (
    <div className="space-y-4">
      {analytics && (
        <div className="grid grid-cols-2 gap-2">
          {[
            { label: 'Issues', value: analytics.total_issues },
            { label: 'Quotes', value: analytics.total_quotes },
            { label: 'Personas', value: analytics.total_personas },
            { label: 'Competitors', value: analytics.total_competitors },
          ].map((s) => (
            <div
              key={s.label}
              className="rounded border border-border-primary bg-bg-tertiary p-2.5 text-center"
            >
              <p className="text-lg font-semibold text-text-primary">{s.value}</p>
              <p className="text-[10px] text-text-tertiary">{s.label}</p>
            </div>
          ))}
        </div>
      )}

      {issuesByDate.length > 1 && (
        <div className="rounded border border-border-primary bg-bg-tertiary p-2.5">
          <h3 className="mb-2 text-[10px] font-medium uppercase tracking-wider text-text-tertiary">
            Issues Over Time
          </h3>
          <LineChart data={issuesByDate} height={150} />
        </div>
      )}

      <p className="text-xs text-text-tertiary">
        Select an issue or persona to view details
      </p>

      {recentQuotes.length > 0 && (
        <div>
          <h3 className="mb-2 text-[10px] font-medium uppercase tracking-wider text-text-tertiary">
            Recent Quotes
          </h3>
          <div className="space-y-1.5">
            {recentQuotes.map((q) => (
              <div
                key={q.id}
                className="rounded border border-border-primary bg-bg-tertiary p-2"
              >
                <p className="line-clamp-2 text-[11px] text-text-primary">{q.quote_text}</p>
                <div className="mt-1 flex items-center gap-2">
                  <span className={cn('h-1.5 w-1.5 rounded-full', SENTIMENT_DOT[q.sentiment])} />
                  <span className="truncate text-[10px] text-text-secondary">{q.speaker}</span>
                  <span className={cn('ml-auto shrink-0 text-[10px] font-medium', QUOTE_TYPE_COLOR[q.quote_type])}>
                    {q.quote_type}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function InsightsPanel() {
  const { data: issues } = useIssues();
  const { data: quotes } = useQuotes();
  const { data: personas } = usePersonas();
  const { data: analytics } = useAnalytics();
  const { selectedIssueId, selectedPersonaId, selectIssue } = useResearch();

  const selectedIssue = selectedIssueId
    ? (issues ?? []).find((i) => i.id === selectedIssueId) ?? null
    : null;

  const selectedPersona = selectedPersonaId
    ? (personas ?? []).find((p) => p.id === selectedPersonaId) ?? null
    : null;

  // Issue's parent persona (may differ from selectedPersonaId)
  const issuePersona = selectedIssue?.related_persona_id
    ? (personas ?? []).find((p) => p.id === selectedIssue.related_persona_id) ?? null
    : null;

  const relatedQuotes = selectedIssue
    ? (quotes ?? []).filter(
        (q) =>
          q.related_issue_id === selectedIssue.id ||
          selectedIssue.related_quote_ids.includes(q.id),
      )
    : [];

  const personaIssues = selectedPersona
    ? (issues ?? []).filter((i) => i.related_persona_id === selectedPersona.id)
    : [];

  const recentQuotes = (quotes ?? [])
    .slice()
    .sort((a, b) => new Date(b.created_time).getTime() - new Date(a.created_time).getTime())
    .slice(0, 5);

  let content: React.ReactNode;

  if (selectedIssue) {
    content = (
      <IssueDetailView
        issue={selectedIssue}
        persona={issuePersona}
        relatedQuotes={relatedQuotes}
        onBackToPersona={() => selectIssue(null)}
      />
    );
  } else if (selectedPersona) {
    content = (
      <PersonaDetailView
        persona={selectedPersona}
        relatedIssues={personaIssues}
        onSelectIssue={(id) => selectIssue(id)}
      />
    );
  } else {
    content = (
      <DefaultDashboard
        analytics={analytics}
        issues={issues ?? []}
        recentQuotes={recentQuotes}
      />
    );
  }

  return (
    <PanelContainer title="Insights" icon={Lightbulb} active={!!selectedIssue}>
      {content}
    </PanelContainer>
  );
}
