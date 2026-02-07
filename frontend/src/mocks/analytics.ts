import type { AnalyticsData } from '../types/analytics.ts';
import { mockIssues, mockQuotes, mockPersonas, mockCompetitors } from './data.ts';

function computeAnalytics(): AnalyticsData {
  const issues_by_severity: Record<string, number> = {};
  for (const issue of mockIssues) {
    issues_by_severity[issue.severity] =
      (issues_by_severity[issue.severity] ?? 0) + 1;
  }

  const issues_by_type: Record<string, number> = {};
  for (const issue of mockIssues) {
    issues_by_type[issue.issue_type] =
      (issues_by_type[issue.issue_type] ?? 0) + 1;
  }

  const quotes_by_sentiment: Record<string, number> = {};
  for (const quote of mockQuotes) {
    quotes_by_sentiment[quote.sentiment] =
      (quotes_by_sentiment[quote.sentiment] ?? 0) + 1;
  }

  return {
    total_issues: mockIssues.length,
    total_quotes: mockQuotes.length,
    total_personas: mockPersonas.length,
    total_competitors: mockCompetitors.length,
    issues_by_severity,
    issues_by_type,
    quotes_by_sentiment,
  };
}

export const mockAnalytics: AnalyticsData = computeAnalytics();
