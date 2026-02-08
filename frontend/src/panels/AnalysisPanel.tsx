import { useState } from 'react';
import { ListFilter, Zap } from 'lucide-react';
import { cn } from '../lib/utils';
import { useIssues } from '../hooks/useIssues';
import { useAnalytics } from '../hooks/useAnalytics';
import { useResearch } from '../context/ResearchContext';
import PanelContainer from '../components/shared/PanelContainer';
import type { Severity, IssueType } from '../types/issue';

type SortMode = 'severity' | 'chronological';

const SEVERITY_ORDER: Severity[] = ['Critical', 'High', 'Medium', 'Low'];

const SEVERITY_BADGE: Record<Severity, string> = {
  Critical: 'bg-error text-white',
  High: 'bg-orange-500 text-white',
  Medium: 'bg-warning text-black',
  Low: 'bg-text-tertiary text-white',
};

const SEVERITY_BAR: Record<Severity, string> = {
  Critical: 'bg-error',
  High: 'bg-orange-500',
  Medium: 'bg-warning',
  Low: 'bg-text-tertiary',
};

const TYPE_COLOR: Record<IssueType, string> = {
  'Pain Point': 'text-error',
  'Feature Request': 'text-warning',
  'Workflow Gap': 'text-accent-cyan',
  'Unmet Need': 'text-text-secondary',
};

export default function AnalysisPanel() {
  const [sortMode, setSortMode] = useState<SortMode>('severity');
  const { data: issues, loading: iLoading } = useIssues();
  const { data: analytics, loading: aLoading } = useAnalytics();
  const { selectedIssueId, selectIssue, selectedPersonaId } = useResearch();

  const sorted = (issues ?? []).slice().sort((a, b) => {
    if (sortMode === 'severity') {
      return SEVERITY_ORDER.indexOf(a.severity) - SEVERITY_ORDER.indexOf(b.severity);
    }
    return new Date(b.created_time).getTime() - new Date(a.created_time).getTime();
  });

  const totalSeverity = analytics
    ? Object.values(analytics.issues_by_severity).reduce((a, b) => a + b, 0)
    : 0;

  return (
    <PanelContainer
      title="All Issues"
      icon={ListFilter}
      headerExtra={
        <div className="ml-auto flex items-center gap-0.5 rounded bg-bg-tertiary p-0.5">
          {(['severity', 'chronological'] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => setSortMode(mode)}
              className={cn(
                'rounded px-1.5 py-0.5 text-[10px] capitalize transition-colors',
                sortMode === mode
                  ? 'bg-bg-hover text-text-primary'
                  : 'text-text-tertiary hover:text-text-secondary',
              )}
            >
              {mode}
            </button>
          ))}
        </div>
      }
    >
      <div className="flex h-full flex-col">
        <div className="flex-1 min-h-0 space-y-2 overflow-y-auto">
          {iLoading && <p className="text-xs text-text-tertiary">Loading...</p>}
          {sorted.map((issue) => (
            <button
              key={issue.id}
              onClick={() => selectIssue(issue.id)}
              className={cn(
                'w-full rounded border border-border-primary bg-bg-tertiary p-2.5 text-left transition-colors hover:bg-bg-hover',
                selectedIssueId === issue.id && 'border-accent-cyan bg-bg-hover',
                selectedPersonaId &&
                  issue.related_persona_id === selectedPersonaId &&
                  selectedIssueId !== issue.id &&
                  'border-accent-cyan/30 bg-accent-cyan-glow',
              )}
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
                {issue.exa_trigger && (
                  <Zap size={10} className="ml-auto text-warning" />
                )}
              </div>
              <p className="mt-1.5 text-xs font-medium text-text-primary">{issue.issue_title}</p>
              <p className="mt-1 line-clamp-2 text-[11px] text-text-tertiary">{issue.issue_details}</p>
              <div className="mt-1.5 flex items-center gap-2">
                {issue.related_quote_ids.length > 0 && (
                  <span className="rounded-full bg-bg-secondary px-1.5 py-0.5 text-[10px] text-text-secondary">
                    {issue.related_quote_ids.length} quotes
                  </span>
                )}
                {issue.engineer_matching && (
                  <span className="truncate text-[10px] text-text-tertiary">
                    {issue.engineer_matching}
                  </span>
                )}
              </div>
            </button>
          ))}
        </div>

        {analytics && !aLoading && (
          <div className="mt-3 border-t border-border-primary pt-3">
            <div className="flex flex-wrap gap-1.5">
              {[
                { label: 'Issues', value: analytics.total_issues },
                { label: 'Quotes', value: analytics.total_quotes },
                { label: 'Personas', value: analytics.total_personas },
                { label: 'Competitors', value: analytics.total_competitors },
              ].map((s) => (
                <span
                  key={s.label}
                  className="rounded bg-bg-secondary px-1.5 py-0.5 text-[10px] text-text-secondary"
                >
                  {s.value} {s.label}
                </span>
              ))}
            </div>
            {totalSeverity > 0 && (
              <div className="mt-2 flex h-2 overflow-hidden rounded">
                {SEVERITY_ORDER.map((sev) => {
                  const count = analytics.issues_by_severity[sev] ?? 0;
                  if (!count) return null;
                  return (
                    <div
                      key={sev}
                      className={cn('h-full', SEVERITY_BAR[sev])}
                      style={{ width: `${(count / totalSeverity) * 100}%` }}
                      title={`${sev}: ${count}`}
                    />
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </PanelContainer>
  );
}
