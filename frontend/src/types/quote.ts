export type Sentiment = 'Positive' | 'Negative' | 'Neutral' | 'Frustrated';
export type QuoteType = 'Pain Point' | 'Insight' | 'Feature Request' | 'Praise';

export interface Quote {
  id: string;
  created_time: string;
  quote_text: string;
  speaker: string;
  sentiment: Sentiment;
  quote_type: QuoteType;
  related_persona_id: string | null;
  related_issue_id: string | null;
  competitor_mentioned_id: string | null;
}
