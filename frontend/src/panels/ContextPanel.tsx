import { useState } from 'react';
import { BookOpen, ChevronDown, ChevronRight, Users, AlertTriangle, Crosshair } from 'lucide-react';
import { cn } from '../lib/utils';
import { usePersonas } from '../hooks/usePersonas';
import { useIssues } from '../hooks/useIssues';
import { useCompetitors } from '../hooks/useCompetitors';
import { useResearch } from '../context/ResearchContext';
import PanelContainer from '../components/shared/PanelContainer';
import type { Severity } from '../types/issue';
import type { UserSentiment } from '../types/competitor';

const SEVERITY_COLORS: Record<Severity, string> = {
  Critical: 'bg-error text-white',
  High: 'bg-orange-500 text-white',
  Medium: 'bg-warning text-black',
  Low: 'bg-text-tertiary text-white',
};

const SENTIMENT_DOT: Record<UserSentiment, string> = {
  Positive: 'bg-success',
  Mixed: 'bg-warning',
  Negative: 'bg-error',
};

function Section({
  title,
  icon: Icon,
  defaultOpen = false,
  children,
}: {
  title: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div>
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center gap-2 rounded px-2 py-1.5 text-xs font-medium text-text-secondary transition-colors hover:bg-bg-hover hover:text-text-primary"
      >
        {open ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
        <Icon size={12} />
        {title}
      </button>
      {open && <div className="mt-1 space-y-2 pl-1">{children}</div>}
    </div>
  );
}

export default function ContextPanel() {
  const { data: personas, loading: pLoading } = usePersonas();
  const { data: issues, loading: iLoading } = useIssues();
  const { data: competitors, loading: cLoading } = useCompetitors();
  const { selectedPersonaId, selectPersona } = useResearch();

  const severityCounts = (issues ?? []).reduce<Record<string, number>>((acc, issue) => {
    acc[issue.severity] = (acc[issue.severity] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <PanelContainer title="Context" icon={BookOpen}>
      <div className="space-y-4">
        <Section title="Personas" icon={Users} defaultOpen>
          {pLoading && <p className="px-2 text-xs text-text-tertiary">Loading...</p>}
          {personas?.map((p) => (
            <button
              key={p.id}
              onClick={() => selectPersona(p.id)}
              className={cn(
                'w-full rounded border border-border-primary bg-bg-tertiary p-2.5 text-left transition-colors hover:bg-bg-hover',
                selectedPersonaId === p.id && 'border-l-2 border-l-accent-cyan bg-bg-hover',
              )}
            >
              <div className="flex items-start justify-between gap-2">
                <span className="text-xs font-medium text-text-primary">{p.persona_type}</span>
                <span className="shrink-0 rounded bg-bg-secondary px-1.5 py-0.5 text-[10px] text-text-secondary">
                  {p.communication_style}
                </span>
              </div>
              <p className="mt-1 line-clamp-2 text-[11px] text-text-tertiary">{p.goals}</p>
            </button>
          ))}
        </Section>

        <Section title="Issue Overview" icon={AlertTriangle}>
          {iLoading && <p className="px-2 text-xs text-text-tertiary">Loading...</p>}
          {issues && (
            <div className="rounded border border-border-primary bg-bg-tertiary p-2.5">
              <div className="flex flex-wrap gap-1.5">
                {(['Critical', 'High', 'Medium', 'Low'] as Severity[]).map((sev) => (
                  <span
                    key={sev}
                    className={cn('rounded px-1.5 py-0.5 text-[10px] font-medium', SEVERITY_COLORS[sev])}
                  >
                    {sev}: {severityCounts[sev] ?? 0}
                  </span>
                ))}
              </div>
              <p className="mt-2 text-[11px] text-text-secondary">
                {issues.length} total issues identified
              </p>
            </div>
          )}
        </Section>

        <Section title="Competitors" icon={Crosshair}>
          {cLoading && <p className="px-2 text-xs text-text-tertiary">Loading...</p>}
          {competitors?.map((c) => (
            <div
              key={c.id}
              className="flex items-center gap-2 rounded border border-border-primary bg-bg-tertiary px-2.5 py-2"
            >
              <span className={cn('h-2 w-2 shrink-0 rounded-full', SENTIMENT_DOT[c.user_sentiment])} />
              <span className="flex-1 truncate text-xs text-text-primary">{c.competitor_name}</span>
              <a
                href={c.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[10px] text-accent-cyan-dim hover:text-accent-cyan"
              >
                site
              </a>
            </div>
          ))}
        </Section>
      </div>
    </PanelContainer>
  );
}
