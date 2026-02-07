import { API_BASE_URL, MOCK_DELAY_MS } from '../lib/constants.ts';
import type { ResearchProject } from '../types/project.ts';
import type { InterviewTranscript } from '../types/transcript.ts';
import type { QuoteEvidence } from '../types/quote.ts';
import type { MarketIntelligence } from '../types/market.ts';
import type { CompetitorEntry } from '../types/competitor.ts';
import type { InsightTheme } from '../types/insight.ts';
import type { ActionItem } from '../types/action.ts';
import type { AnalyticsData } from '../types/analytics.ts';
import {
  mockProject,
  mockTranscripts,
  mockQuotes,
  mockMarketIntel,
  mockCompetitors,
  mockInsights,
  mockActions,
} from '../mocks/data.ts';
import { mockAnalytics } from '../mocks/analytics.ts';

// @ts-expect-error -- will be used when real API calls replace mocks
const _API_BASE = API_BASE_URL;

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function fetchProject(projectId: string): Promise<ResearchProject> {
  // REAL: return fetch(`${_API_BASE}/project/${projectId}/context`).then(r => r.json());
  void projectId;
  await delay(MOCK_DELAY_MS);
  return mockProject;
}

export async function fetchTranscripts(projectId: string): Promise<InterviewTranscript[]> {
  // REAL: return fetch(`${_API_BASE}/project/${projectId}/transcripts`).then(r => r.json());
  void projectId;
  await delay(MOCK_DELAY_MS);
  return mockTranscripts;
}

export async function fetchQuotes(projectId: string): Promise<QuoteEvidence[]> {
  // REAL: return fetch(`${_API_BASE}/project/${projectId}/quotes`).then(r => r.json());
  void projectId;
  await delay(MOCK_DELAY_MS);
  return mockQuotes;
}

export async function fetchMarketIntel(projectId: string): Promise<MarketIntelligence[]> {
  // REAL: return fetch(`${_API_BASE}/project/${projectId}/market-intel`).then(r => r.json());
  void projectId;
  await delay(MOCK_DELAY_MS);
  return mockMarketIntel;
}

export async function fetchCompetitors(projectId: string): Promise<CompetitorEntry[]> {
  // REAL: return fetch(`${_API_BASE}/project/${projectId}/competitors`).then(r => r.json());
  void projectId;
  await delay(MOCK_DELAY_MS);
  return mockCompetitors;
}

export async function fetchInsights(projectId: string): Promise<InsightTheme[]> {
  // REAL: return fetch(`${_API_BASE}/project/${projectId}/insights`).then(r => r.json());
  void projectId;
  await delay(MOCK_DELAY_MS);
  return mockInsights;
}

export async function fetchActionItems(projectId: string): Promise<ActionItem[]> {
  // REAL: return fetch(`${_API_BASE}/project/${projectId}/actions`).then(r => r.json());
  void projectId;
  await delay(MOCK_DELAY_MS);
  return mockActions;
}

export async function fetchAnalytics(projectId: string): Promise<AnalyticsData> {
  // REAL: return fetch(`${_API_BASE}/project/${projectId}/analytics`).then(r => r.json());
  void projectId;
  await delay(MOCK_DELAY_MS);
  return mockAnalytics;
}

export interface TranscriptEntryPayload {
  speaker: 'user' | 'agent';
  text: string;
  timestamp: number;
}

export async function analyzeTranscript(transcript: TranscriptEntryPayload[]): Promise<string> {
  const resp = await fetch('/api/analyze-transcript', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ transcript }),
  });
  if (!resp.ok) throw new Error('Failed to analyze transcript');
  const data = await resp.json();
  return data.analysis;
}

export interface SimulationResult {
  transcript: InterviewTranscript;
  quotes: QuoteEvidence[];
  insight: InsightTheme;
  action: ActionItem;
}

export function simulateNewInterviewData(): SimulationResult {
  const transcript: InterviewTranscript = {
    id: 'tx-005',
    project_id: 'proj-onboarding-001',
    participant: {
      name: 'Lisa Torres',
      role: 'Head of Product',
      company: 'EduScale',
      industry: 'EdTech',
    },
    duration_minutes: 22,
    coverage_score: 0.81,
    key_topics: [
      'self-serve onboarding',
      'template-driven activation',
      'team collaboration',
      'onboarding analytics',
    ],
    summary:
      'Lisa shared how EduScale redesigned their onboarding around templates. New users pick a use-case template and see real-looking data immediately. She emphasized that tracking onboarding funnel drop-off per step was the key to iterating effectively. Her team reduced time-to-first-value from 3 days to 20 minutes.',
    conducted_at: '2026-02-07T10:00:00Z',
    created_at: '2026-02-07T11:00:00Z',
  };

  const quotes: QuoteEvidence[] = [
    {
      id: 'q-014',
      project_id: 'proj-onboarding-001',
      text: 'Templates are not just shortcuts, they are the entire onboarding strategy. When someone picks a template, they have told you their intent. Use that.',
      source_type: 'Interview',
      source_id: 'tx-005',
      speaker_name: 'Lisa Torres',
      speaker_role: 'Head of Product, EduScale',
      sentiment: 'positive',
      theme_ids: ['ins-003', 'ins-007'],
      created_at: '2026-02-07T11:00:00Z',
    },
    {
      id: 'q-015',
      project_id: 'proj-onboarding-001',
      text: 'We track drop-off at every onboarding step. Step 3 was killing us until we made it optional. Completion went from 34% to 78% overnight.',
      source_type: 'Interview',
      source_id: 'tx-005',
      speaker_name: 'Lisa Torres',
      speaker_role: 'Head of Product, EduScale',
      sentiment: 'positive',
      theme_ids: ['ins-003', 'ins-007'],
      created_at: '2026-02-07T11:01:00Z',
    },
    {
      id: 'q-016',
      project_id: 'proj-onboarding-001',
      text: 'Three days to first value is three days where the user is deciding to leave. We got it down to 20 minutes and churn dropped by half.',
      source_type: 'Interview',
      source_id: 'tx-005',
      speaker_name: 'Lisa Torres',
      speaker_role: 'Head of Product, EduScale',
      sentiment: 'positive',
      theme_ids: ['ins-003'],
      created_at: '2026-02-07T11:02:00Z',
    },
  ];

  const insight: InsightTheme = {
    id: 'ins-007',
    project_id: 'proj-onboarding-001',
    title: 'Template-driven onboarding captures user intent and accelerates activation',
    description:
      'When users select a template during onboarding, they implicitly declare their use case. Products that leverage this signal to pre-configure the experience see dramatically faster time-to-value and higher completion rates. Step-level analytics are critical for iterating on the flow.',
    category: 'Opportunity',
    confidence_score: 0.79,
    supporting_quote_ids: ['q-014', 'q-015', 'q-016'],
    created_at: '2026-02-07T12:00:00Z',
    updated_at: '2026-02-07T12:00:00Z',
  };

  const action: ActionItem = {
    id: 'act-005',
    project_id: 'proj-onboarding-001',
    title: 'Implement template-first onboarding with step-level analytics',
    description:
      'Create onboarding flow where users select a use-case template as their first action. Pre-populate the workspace with template-appropriate sample data. Instrument every step with analytics to track drop-off and iterate. Target: time-to-first-value under 10 minutes.',
    priority: 'P1',
    type: 'Feature',
    status: 'Proposed',
    supporting_insight_ids: ['ins-003', 'ins-007'],
    created_at: '2026-02-07T12:05:00Z',
    updated_at: '2026-02-07T12:05:00Z',
  };

  return { transcript, quotes, insight, action };
}
