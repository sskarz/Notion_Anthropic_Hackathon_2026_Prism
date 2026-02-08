import json

from fastapi import APIRouter

from models.extraction import ExtractionPayload
from models.extraction_summary import ExtractionSummaryCreate
from services.notion_writer import create_extraction_summary

router = APIRouter()


@router.post("/extraction-summary")
async def post_extraction_summary(payload: ExtractionPayload):
    extraction_json = json.dumps(payload.model_dump(), default=str)
    summary = ExtractionSummaryCreate(extraction_data=extraction_json)
    extraction_id = await create_extraction_summary(summary)
    return {"extraction_id": extraction_id, "status": "pending"}
