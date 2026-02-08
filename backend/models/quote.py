from typing import Literal

from pydantic import BaseModel


Sentiment = Literal["Positive", "Negative", "Neutral", "Frustrated"]
QuoteType = Literal["Pain Point", "Insight", "Feature Request", "Praise"]


class QuoteCreate(BaseModel):
    quote_text: str
    speaker: str
    sentiment: Sentiment
    quote_type: QuoteType
    related_persona_id: str | None = None
    related_issue_id: str | None = None
    competitor_mentioned_id: str | None = None


class Quote(QuoteCreate):
    id: str
    created_time: str
