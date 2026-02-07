export type QuoteSourceType =
  | 'Interview'
  | 'G2 Review'
  | 'Capterra Review'
  | 'Reddit'
  | 'Product Hunt';

export type QuoteSentiment = 'positive' | 'negative' | 'neutral' | 'mixed';

export interface QuoteEvidence {
  id: string;
  project_id: string;
  text: string;
  source_type: QuoteSourceType;
  source_id: string;
  speaker_name: string;
  speaker_role: string;
  sentiment: QuoteSentiment;
  theme_ids: string[];
  created_at: string;
}
