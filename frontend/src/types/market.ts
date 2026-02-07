export type MarketSourceType =
  | 'Article'
  | 'Report'
  | 'Discussion'
  | 'Review'
  | 'Launch';

export interface MarketIntelligence {
  id: string;
  project_id: string;
  title: string;
  source_type: MarketSourceType;
  source_name: string;
  source_url: string;
  summary: string;
  relevance_score: number;
  published_at: string;
  created_at: string;
}
