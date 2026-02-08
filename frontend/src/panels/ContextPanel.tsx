import { useState, useMemo } from 'react';
import { BookOpen, ChevronDown, ChevronRight, User, Crosshair } from 'lucide-react';
import { cn } from '../lib/utils';
import { usePersonas } from '../hooks/usePersonas';
import { useIssues } from '../hooks/useIssues';
import { useCompetitors } from '../hooks/useCompetitors';
import { useResearch } from '../context/ResearchContext';
import PanelContainer from '../components/shared/PanelContainer';
import type { Persona } from '../types/persona';
import type { Issue, Severity } from '../types/issue';
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

const SEVERITY_ORDER: Record<Severity, number> = {
  Critical: 0,
  High: 1,
  Medium: 2,
  Low: 3,
};

interface SpeakerGroup {
  speakerName: string;
  persona: Persona;
  issues: Issue[];
  latestIssueTime: string;
}

function groupBySpeaker(personas: Persona[], issues: Issue[]): SpeakerGroup[] {
  const issuesByPersona = new Map<string, Issue[]>();
  for (const issue of issues) {
    if (issue.related_persona_id) {
      const list = issuesByPersona.get(issue.related_persona_id) ?? [];
      list.push(issue);
      issuesByPersona.set(issue.related_persona_id, list);
    }
  }

  const groups: SpeakerGroup[] = personas.map((persona) => {
    const personaIssues = issuesByPersona.get(persona.id) ?? [];
    personaIssues.sort((a, b) => {
      const sevDiff = SEVERITY_ORDER[a.severity] - SEVERITY_ORDER[b.severity];
      if (sevDiff !== 0) return sevDiff;
      return b.created_time.localeCompare(a.created_time);
    });

    const latestIssueTime = personaIssues.length > 0
      ? personaIssues.reduce((latest, i) =>
          i.created_time > latest ? i.created_time : latest,
          personaIssues[0].created_time,
        )
      : persona.created_time;

    return {
      speakerName: persona.speaker_name || persona.persona_type,
      persona,
      issues: personaIssues,
      latestIssueTime,
    };
  });

  groups.sort((a, b) => b.latestIssueTime.localeCompare(a.latestIssueTime));
  return groups;
}

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
  const { selectedPersonaId, selectPersona, selectIssue } = useResearch();

  const [expandedSpeaker, setExpandedSpeaker] = useState<string | null>(null);

  const speakerGroups = useMemo(() => {
    if (!personas || !issues) return [];
    return groupBySpeaker(personas, issues);
  }, [personas, issues]);

  const handleSpeakerClick = (group: SpeakerGroup) => {
    const isExpanding = expandedSpeaker !== group.persona.id;
    setExpandedSpeaker(isExpanding ? group.persona.id : null);
    selectPersona(group.persona.id);
    if (isExpanding && group.issues.length > 0) {
      selectIssue(group.issues[0].id);
    }
  };

  return (
    <PanelContainer title="Context" icon={BookOpen}>
      <div className="space-y-4">
        <Section title="Speakers" icon={User} defaultOpen>
          {(pLoading || iLoading) && (
            <p className="px-2 text-xs text-text-tertiary">Loading...</p>
          )}
          {speakerGroups.map((group) => {
            const isExpanded = expandedSpeaker === group.persona.id;
            const isSelected = selectedPersonaId === group.persona.id;

            return (
              <div key={group.persona.id}>
                <button
                  onClick={() => handleSpeakerClick(group)}
                  className={cn(
                    'w-full rounded border border-border-primary bg-bg-tertiary p-2.5 text-left transition-colors hover:bg-bg-hover',
                    isSelected && 'border-l-2 border-l-accent-cyan bg-bg-hover',
                  )}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <User size={12} className="shrink-0 text-accent-cyan" />
                      <span className="text-xs font-medium text-text-primary truncate">
                        {group.speakerName}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      {group.issues.length > 0 && (
                        <span className="rounded bg-bg-secondary px-1.5 py-0.5 text-[10px] text-text-secondary">
                          {group.issues.length} issue{group.issues.length !== 1 ? 's' : ''}
                        </span>
                      )}
                      {isExpanded ? <ChevronDown size={12} className="text-text-tertiary" /> : <ChevronRight size={12} className="text-text-tertiary" />}
                    </div>
                  </div>
                  <p className="mt-0.5 text-[11px] text-text-tertiary truncate">
                    {group.persona.persona_type}
                  </p>
                </button>

                {isExpanded && (
                  <div className="mt-1 ml-2 space-y-1.5">
                    {group.persona.persona_summary && (
                      <div className="rounded bg-bg-tertiary px-2.5 py-2 text-[11px] text-text-secondary leading-relaxed">
                        {group.persona.persona_summary}
                      </div>
                    )}
                    {group.issues.map((issue) => (
                      <button
                        key={issue.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          selectIssue(issue.id);
                        }}
                        className="flex w-full items-start gap-2 rounded border border-border-primary bg-bg-secondary px-2.5 py-1.5 text-left transition-colors hover:bg-bg-hover"
                      >
                        <span
                          className={cn(
                            'mt-0.5 shrink-0 rounded px-1 py-0.5 text-[9px] font-medium leading-none',
                            SEVERITY_COLORS[issue.severity],
                          )}
                        >
                          {issue.severity}
                        </span>
                        <span className="text-[11px] text-text-primary line-clamp-2">
                          {issue.issue_title}
                        </span>
                      </button>
                    ))}
                    {group.issues.length === 0 && (
                      <p className="px-2 text-[11px] text-text-tertiary">No issues</p>
                    )}
                  </div>
                )}
              </div>
            );
          })}
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
