export interface PricingTier {
  name: string;
  price: string;
  features: string[];
}

export interface CompetitorEntry {
  id: string;
  project_id: string;
  name: string;
  website: string;
  description: string;
  key_features: string[];
  pricing_tiers: PricingTier[];
  user_sentiment: 'positive' | 'negative' | 'neutral' | 'mixed';
  strengths: string[];
  weaknesses: string[];
  updated_at: string;
}
