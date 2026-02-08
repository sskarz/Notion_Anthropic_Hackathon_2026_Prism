import { API_BASE_URL } from '../lib/constants.ts';
import type { Issue } from '../types/issue.ts';
import type { Persona } from '../types/persona.ts';
import type { Quote } from '../types/quote.ts';
import type { Competitor } from '../types/competitor.ts';
import type { AnalyticsData } from '../types/analytics.ts';

interface ProjectContext {
  issues: Issue[];
  personas: Persona[];
  quotes: Quote[];
  competitors: Competitor[];
}

export async function fetchProjectContext(): Promise<ProjectContext> {
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
  extraction_id: string;
  status: string;
}

export async function simulateInterview(): Promise<SimulationResult> {
  const payload = {
    personas: [
      {
        persona_type: 'Head of Product at EdTech Startup',
        primary_use_case: 'Template-driven onboarding for faster activation',
        communication_style: 'Analytical',
        goals: 'Reduce time-to-first-value from 3 days to 20 minutes',
        constraints: 'Small team, limited engineering resources',
      },
    ],
    quotes: [
      {
        quote_text:
          'Templates are not just shortcuts, they are the entire onboarding strategy. When someone picks a template, they have told you their intent.',
        speaker: 'Lisa Torres, Head of Product at EduScale',
        sentiment: 'Positive',
        quote_type: 'Insight',
        temp_persona_index: 0,
      },
      {
        quote_text:
          'Three days to first value is three days where the user is deciding to leave. We got it down to 20 minutes and churn dropped by half.',
        speaker: 'Lisa Torres, Head of Product at EduScale',
        sentiment: 'Positive',
        quote_type: 'Insight',
        temp_persona_index: 0,
      },
    ],
    issues: [
      {
        issue_title:
          'Template-driven onboarding captures user intent and accelerates activation',
        issue_type: 'Feature Request',
        issue_details:
          'When users select a template during onboarding, they implicitly declare their use case. Products that leverage this signal see dramatically faster time-to-value.',
        severity: 'High',
        temp_persona_index: 0,
        temp_quote_indices: [0, 1],
      },
    ],
  };

  const res = await fetch(`${API_BASE_URL}/api/extraction-summary`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(`Simulation failed: ${res.status}`);
  return res.json();
}

export interface ExaResearchResult {
  competitors_created: number;
  reports: Array<{
    competitor: string;
    supports_feature: boolean;
    solve_title: string;
    solve_description: string;
    confidence: string;
    evidence_urls: string[];
  }>;
}

export async function runExaResearch(
  companyContext: string,
  customerIssue: string,
  numResults = 5,
): Promise<ExaResearchResult> {
  const res = await fetch(`${API_BASE_URL}/api/exa-research`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      company_context: companyContext,
      customer_issue: customerIssue,
      num_results: numResults,
    }),
  });
  if (!res.ok) throw new Error(`Exa research failed: ${res.status}`);
  return res.json();
}
