from fastapi import APIRouter

from models.extraction import ExtractionPayload
from models.quote import QuoteCreate
from models.issue import IssueCreate
from services.notion_writer import create_persona, create_quote, create_issue

router = APIRouter()


@router.post("/extraction")
async def post_extraction(payload: ExtractionPayload):
    # 1. Write all personas, collect page IDs
    persona_page_ids: list[str] = []
    for p in payload.personas:
        pid = await create_persona(p)
        persona_page_ids.append(pid)

    # 2. Write all quotes, resolving persona references
    quote_page_ids: list[str] = []
    for q in payload.quotes:
        related_persona_id = None
        if q.temp_persona_index is not None and q.temp_persona_index < len(persona_page_ids):
            related_persona_id = persona_page_ids[q.temp_persona_index]

        qc = QuoteCreate(
            quote_text=q.quote_text,
            speaker=q.speaker,
            sentiment=q.sentiment,
            quote_type=q.quote_type,
            related_persona_id=related_persona_id,
            competitor_mentioned_id=q.competitor_mentioned_id,
        )
        qid = await create_quote(qc)
        quote_page_ids.append(qid)

    # 3. Write all issues, resolving persona + quote references
    issue_page_ids: list[str] = []
    for i in payload.issues:
        related_persona_id = None
        if i.temp_persona_index is not None and i.temp_persona_index < len(persona_page_ids):
            related_persona_id = persona_page_ids[i.temp_persona_index]

        related_quote_ids = [
            quote_page_ids[idx]
            for idx in i.temp_quote_indices
            if idx < len(quote_page_ids)
        ]

        ic = IssueCreate(
            issue_title=i.issue_title,
            issue_type=i.issue_type,
            issue_details=i.issue_details,
            severity=i.severity,
            related_persona_id=related_persona_id,
            related_quote_ids=related_quote_ids,
        )
        iid = await create_issue(ic)
        issue_page_ids.append(iid)

    return {
        "personas_created": len(persona_page_ids),
        "quotes_created": len(quote_page_ids),
        "issues_created": len(issue_page_ids),
    }
