from pydantic import BaseModel

from models.persona import PersonaCreate
from models.quote import Sentiment, QuoteType
from models.issue import IssueType, Severity


class QuoteInput(BaseModel):
    quote_text: str
    speaker: str
    sentiment: Sentiment
    quote_type: QuoteType
    temp_persona_index: int | None = None
    competitor_mentioned_id: str | None = None


class IssueInput(BaseModel):
    issue_title: str
    issue_type: IssueType
    issue_details: str
    severity: Severity
    temp_persona_index: int | None = None
    temp_quote_indices: list[int] = []


class ExtractionPayload(BaseModel):
    personas: list[PersonaCreate]
    quotes: list[QuoteInput]
    issues: list[IssueInput]
