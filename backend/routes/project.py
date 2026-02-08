import asyncio
import logging
import time
from collections import Counter

from fastapi import APIRouter

from services.notion_reader import (
    get_all_issues,
    get_all_personas,
    get_all_quotes,
    get_all_competitors,
)

logger = logging.getLogger("prism.routes.project")

router = APIRouter()


@router.get("/project/context")
async def project_context():
    t0 = time.monotonic()
    logger.info("[/project/context] START")
    issues, personas, quotes, competitors = await asyncio.gather(
        get_all_issues(),
        get_all_personas(),
        get_all_quotes(),
        get_all_competitors(),
    )
    ms = (time.monotonic() - t0) * 1000
    logger.info("[/project/context] DONE (%.0fms) i=%d p=%d q=%d c=%d",
                ms, len(issues), len(personas), len(quotes), len(competitors))
    return {
        "issues": [i.model_dump() for i in issues],
        "personas": [p.model_dump() for p in personas],
        "quotes": [q.model_dump() for q in quotes],
        "competitors": [c.model_dump() for c in competitors],
    }


@router.get("/project/analytics")
async def project_analytics():
    t0 = time.monotonic()
    logger.info("[/project/analytics] START")
    issues, personas, quotes, competitors = await asyncio.gather(
        get_all_issues(),
        get_all_personas(),
        get_all_quotes(),
        get_all_competitors(),
    )

    issues_by_severity = dict(Counter(i.severity for i in issues))
    issues_by_type = dict(Counter(i.issue_type for i in issues))
    quotes_by_sentiment = dict(Counter(q.sentiment for q in quotes))

    ms = (time.monotonic() - t0) * 1000
    logger.info("[/project/analytics] DONE (%.0fms)", ms)

    return {
        "total_issues": len(issues),
        "total_quotes": len(quotes),
        "total_personas": len(personas),
        "total_competitors": len(competitors),
        "issues_by_severity": issues_by_severity,
        "issues_by_type": issues_by_type,
        "quotes_by_sentiment": quotes_by_sentiment,
    }
