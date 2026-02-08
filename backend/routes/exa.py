import sys
from pathlib import Path

from fastapi import APIRouter
from pydantic import BaseModel

# Ensure exa package is importable
sys.path.insert(0, str(Path(__file__).resolve().parent.parent / "exa"))

from exa_competitor_research import run_competitor_research

from models.competitor import CompetitorCreate
from services.notion_writer import create_competitor

router = APIRouter()


class ExaResearchRequest(BaseModel):
    company_context: str
    customer_issue: str
    num_results: int = 5


@router.post("/exa-research")
async def exa_research(req: ExaResearchRequest):
    report = run_competitor_research(
        company_context=req.company_context,
        customer_issue=req.customer_issue,
        num_results=req.num_results,
    )

    competitors_created = 0
    for cr in report.get("competitor_reports", []):
        if cr.get("supports_feature"):
            comp = CompetitorCreate(
                competitor_name=cr["competitor"],
                website=cr["evidence_urls"][0] if cr["evidence_urls"] else "",
                key_features=cr.get("solve_description", ""),
                pricing="",
                user_sentiment="Mixed",
            )
            await create_competitor(comp)
            competitors_created += 1

    return {
        "competitors_created": competitors_created,
        "reports": report.get("competitor_reports", []),
    }
