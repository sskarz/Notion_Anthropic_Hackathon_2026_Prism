export type InsightCategory =
  | 'Pain Point'
  | 'Need'
  | 'Opportunity'
  | 'Risk'
  | 'Validation';

export interface InsightTheme {
  id: string;
  project_id: string;
  title: string;
  description: string;
  category: InsightCategory;
  confidence_score: number;
  supporting_quote_ids: string[];
  created_at: string;
  updated_at: string;
}
