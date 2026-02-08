export interface AnalyticsData {
  total_issues: number;
  total_quotes: number;
  total_personas: number;
  total_competitors: number;
  issues_by_severity: Record<string, number>;
  issues_by_type: Record<string, number>;
  quotes_by_sentiment: Record<string, number>;
}
