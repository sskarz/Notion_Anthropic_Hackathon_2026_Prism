export interface AnalyticsData {
  total_interviews: number;
  total_quotes: number;
  total_insights: number;
  total_action_items: number;
  avg_coverage_score: number;
  avg_confidence_score: number;
  issues_by_priority: Record<string, number>;
  sentiment_breakdown: Record<string, number>;
  category_breakdown: Record<string, number>;
  source_type_breakdown: Record<string, number>;
}
