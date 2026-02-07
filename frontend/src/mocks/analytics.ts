import type { AnalyticsData } from '../types/analytics.ts';
import {
  mockTranscripts,
  mockQuotes,
  mockInsights,
  mockActions,
} from './data.ts';

function computeAnalytics(): AnalyticsData {
  const avg_coverage_score =
    mockTranscripts.reduce((sum, t) => sum + t.coverage_score, 0) /
    mockTranscripts.length;

  const avg_confidence_score =
    mockInsights.reduce((sum, i) => sum + i.confidence_score, 0) /
    mockInsights.length;

  const issues_by_priority: Record<string, number> = {};
  for (const action of mockActions) {
    issues_by_priority[action.priority] =
      (issues_by_priority[action.priority] ?? 0) + 1;
  }

  const sentiment_breakdown: Record<string, number> = {};
  for (const quote of mockQuotes) {
    sentiment_breakdown[quote.sentiment] =
      (sentiment_breakdown[quote.sentiment] ?? 0) + 1;
  }

  const category_breakdown: Record<string, number> = {};
  for (const insight of mockInsights) {
    category_breakdown[insight.category] =
      (category_breakdown[insight.category] ?? 0) + 1;
  }

  const source_type_breakdown: Record<string, number> = {};
  for (const quote of mockQuotes) {
    source_type_breakdown[quote.source_type] =
      (source_type_breakdown[quote.source_type] ?? 0) + 1;
  }

  return {
    total_interviews: mockTranscripts.length,
    total_quotes: mockQuotes.length,
    total_insights: mockInsights.length,
    total_action_items: mockActions.length,
    avg_coverage_score,
    avg_confidence_score,
    issues_by_priority,
    sentiment_breakdown,
    category_breakdown,
    source_type_breakdown,
  };
}

export const mockAnalytics: AnalyticsData = computeAnalytics();
