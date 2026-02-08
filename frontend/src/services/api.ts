import { API_BASE_URL, MOCK_DELAY_MS } from '../lib/constants.ts';
import type { Issue } from '../types/issue.ts';
import type { Persona } from '../types/persona.ts';
import type { Quote } from '../types/quote.ts';
import type { Competitor } from '../types/competitor.ts';
import type { AnalyticsData } from '../types/analytics.ts';
import { mockIssues, mockPersonas, mockQuotes, mockCompetitors } from '../mocks/data.ts';
import { mockAnalytics } from '../mocks/analytics.ts';

const USE_MOCK = import.meta.env.VITE_USE_MOCK !== 'false';

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

interface ProjectContext {
  issues: Issue[];
  personas: Persona[];
  quotes: Quote[];
  competitors: Competitor[];
}

export async function fetchProjectContext(): Promise<ProjectContext> {
  if (USE_MOCK) {
    await delay(MOCK_DELAY_MS);
    return {
      issues: mockIssues,
      personas: mockPersonas,
      quotes: mockQuotes,
      competitors: mockCompetitors,
    };
  }
  const res = await fetch(`${API_BASE_URL}/api/project/context`);
  if (!res.ok) throw new Error(`Failed to fetch project context: ${res.status}`);
  return res.json();
}

export async function fetchIssues(): Promise<Issue[]> {
  const ctx = await fetchProjectContext();
  return ctx.issues;
}

export async function fetchPersonas(): Promise<Persona[]> {
  const ctx = await fetchProjectContext();
  return ctx.personas;
}

export async function fetchQuotes(): Promise<Quote[]> {
  const ctx = await fetchProjectContext();
  return ctx.quotes;
}

export async function fetchCompetitors(): Promise<Competitor[]> {
  const ctx = await fetchProjectContext();
  return ctx.competitors;
}

export async function fetchAnalytics(): Promise<AnalyticsData> {
  if (USE_MOCK) {
    await delay(MOCK_DELAY_MS);
    return mockAnalytics;
  }
  const res = await fetch(`${API_BASE_URL}/api/project/analytics`);
  if (!res.ok) throw new Error(`Failed to fetch analytics: ${res.status}`);
  return res.json();
}

export interface TranscriptEntryPayload {
  speaker: 'user' | 'agent';
  text: string;
  timestamp: number;
}

export async function analyzeTranscript(
  transcript: TranscriptEntryPayload[],
  userContext?: Record<string, string>,
): Promise<string> {
  const resp = await fetch('/api/analyze-transcript', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ transcript, user_context: userContext ?? null }),
  });
  if (!resp.ok) throw new Error('Failed to analyze transcript');
  const data = await resp.json();
  return data.analysis;
}

export interface AnalysisEntry {
  analysis: string;
  user_context: {
    name: string;
    company: string;
    problem_description: string;
    urgency: string;
  };
  timestamp: string;
}

export async function fetchAnalyses(): Promise<AnalysisEntry[]> {
  const resp = await fetch('/api/analyses');
  if (!resp.ok) throw new Error('Failed to fetch analyses');
  return resp.json();
}

export interface SimulationResult {
  personas: Persona[];
  quotes: Quote[];
  issues: Issue[];
}

export function simulateNewInterviewData(): SimulationResult {
  const persona: Persona = {
    id: 'persona-sim-001',
    created_time: new Date().toISOString(),
    persona_type: 'Head of Product at EdTech Startup',
    primary_use_case: 'Template-driven onboarding for faster activation',
    communication_style: 'Analytical',
    goals: 'Reduce time-to-first-value from 3 days to 20 minutes',
    constraints: 'Small team, limited engineering resources',
  };

  const quotes: Quote[] = [
    {
      id: 'q-sim-001',
      created_time: new Date().toISOString(),
      quote_text: 'Templates are not just shortcuts, they are the entire onboarding strategy. When someone picks a template, they have told you their intent.',
      speaker: 'Lisa Torres, Head of Product at EduScale',
      sentiment: 'Positive',
      quote_type: 'Insight',
      related_persona_id: 'persona-sim-001',
      related_issue_id: null,
      competitor_mentioned_id: null,
    },
    {
      id: 'q-sim-002',
      created_time: new Date().toISOString(),
      quote_text: 'Three days to first value is three days where the user is deciding to leave. We got it down to 20 minutes and churn dropped by half.',
      speaker: 'Lisa Torres, Head of Product at EduScale',
      sentiment: 'Positive',
      quote_type: 'Insight',
      related_persona_id: 'persona-sim-001',
      related_issue_id: null,
      competitor_mentioned_id: null,
    },
  ];

  const issue: Issue = {
    id: 'issue-sim-001',
    created_time: new Date().toISOString(),
    issue_title: 'Template-driven onboarding captures user intent and accelerates activation',
    issue_type: 'Feature Request',
    issue_details: 'When users select a template during onboarding, they implicitly declare their use case. Products that leverage this signal see dramatically faster time-to-value.',
    severity: 'High',
    related_persona_id: 'persona-sim-001',
    related_quote_ids: ['q-sim-001', 'q-sim-002'],
    engineer_matching: '',
    graph_type: null,
    exa_trigger: false,
  };

  return { personas: [persona], quotes, issues: [issue] };
}
