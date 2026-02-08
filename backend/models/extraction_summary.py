from pydantic import BaseModel


class ExtractionSummaryCreate(BaseModel):
    extraction_data: str
    interview_context: str = ""
