export type UserSentiment = 'Positive' | 'Mixed' | 'Negative';

export interface Competitor {
  id: string;
  created_time: string;
  competitor_name: string;
  website: string;
  key_features: string;
  pricing: string;
  user_sentiment: UserSentiment;
}
