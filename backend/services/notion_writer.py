import asyncio
from typing import Any

from notion_client import AsyncClient

from config import NOTION_TOKEN, DATABASE_IDS
from models.persona import PersonaCreate
from models.quote import QuoteCreate
from models.issue import IssueCreate
from models.competitor import CompetitorCreate
from services.notion_mapper import (
    map_title,
    map_rich_text,
    map_select,
    map_url,
    map_relation,
)

_client = AsyncClient(auth=NOTION_TOKEN)

RATE_LIMIT_DELAY = 0.35


async def _create_page(database_id: str, properties: dict[str, Any]) -> str:
    await asyncio.sleep(RATE_LIMIT_DELAY)
    response = await _client.pages.create(
        parent={"database_id": database_id},
        properties=properties,
    )
    return response["id"]


async def create_persona(p: PersonaCreate) -> str:
    props = {
        "Persona Type": map_title(p.persona_type),
        "Primary Use Case": map_rich_text(p.primary_use_case),
        "Communication Style": map_select(p.communication_style),
        "Goals": map_rich_text(p.goals),
        "Constraints": map_rich_text(p.constraints),
    }
    return await _create_page(DATABASE_IDS["personas"], props)


async def create_quote(q: QuoteCreate) -> str:
    props: dict[str, Any] = {
        "Quote Text": map_title(q.quote_text),
        "Speaker": map_rich_text(q.speaker),
        "Sentiment": map_select(q.sentiment),
        "Quote Type": map_select(q.quote_type),
    }
    if q.related_persona_id:
        props["Related Persona"] = map_relation([q.related_persona_id])
    if q.related_issue_id:
        props["Related Issue"] = map_relation([q.related_issue_id])
    if q.competitor_mentioned_id:
        props["Competitor Mentioned"] = map_relation([q.competitor_mentioned_id])
    return await _create_page(DATABASE_IDS["quotes"], props)


async def create_issue(i: IssueCreate) -> str:
    props: dict[str, Any] = {
        "Issue Title": map_title(i.issue_title),
        "Issue Type": map_select(i.issue_type),
        "Issue Details": map_rich_text(i.issue_details),
        "Severity": map_select(i.severity),
    }
    if i.related_persona_id:
        props["Related Persona"] = map_relation([i.related_persona_id])
    if i.related_quote_ids:
        props["Related Quotes"] = map_relation(i.related_quote_ids)
    return await _create_page(DATABASE_IDS["issues"], props)


async def create_competitor(c: CompetitorCreate) -> str:
    props = {
        "Competitor Name": map_title(c.competitor_name),
        "Website": map_url(c.website),
        "Key Features": map_rich_text(c.key_features),
        "Pricing": map_rich_text(c.pricing),
        "User Sentiment": map_select(c.user_sentiment),
    }
    return await _create_page(DATABASE_IDS["competitors"], props)
