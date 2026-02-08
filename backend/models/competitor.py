from typing import Literal

from pydantic import BaseModel


UserSentiment = Literal["Positive", "Mixed", "Negative"]


class CompetitorCreate(BaseModel):
    competitor_name: str
    website: str
    key_features: str
    pricing: str
    user_sentiment: UserSentiment


class Competitor(CompetitorCreate):
    id: str
    created_time: str
