from typing import Any

import httpx
from notion_client import AsyncClient

from config import NOTION_TOKEN, DATABASE_IDS
from models.persona import Persona
from models.quote import Quote
from models.issue import Issue
from models.competitor import Competitor

_client = AsyncClient(auth=NOTION_TOKEN)


def _extract_title(props: dict[str, Any], key: str) -> str:
    arr = props.get(key, {}).get("title", [])
    return arr[0]["plain_text"] if arr else ""


def _extract_rich_text(props: dict[str, Any], key: str) -> str:
    arr = props.get(key, {}).get("rich_text", [])
    return arr[0]["plain_text"] if arr else ""


def _extract_select(props: dict[str, Any], key: str) -> str | None:
    sel = props.get(key, {}).get("select")
    return sel["name"] if sel else None


def _extract_relation(props: dict[str, Any], key: str) -> list[str]:
    arr = props.get(key, {}).get("relation", [])
    return [r["id"] for r in arr]


def _extract_checkbox(props: dict[str, Any], key: str) -> bool:
    return props.get(key, {}).get("checkbox", False)


def _extract_url(props: dict[str, Any], key: str) -> str:
    return props.get(key, {}).get("url") or ""


async def _query_database(database_id: str) -> list[dict[str, Any]]:
    import asyncio

    pages: list[dict[str, Any]] = []
    cursor = None
    retries = 0

    # Use httpx directly since the notion-client API structure varies
    async with httpx.AsyncClient(timeout=10.0) as http_client:
        while True:
            # Build query body
            body: dict[str, Any] = {}
            if cursor:
                body["start_cursor"] = cursor

            # Make the API call directly
            resp = await http_client.post(
                f"https://api.notion.com/v1/databases/{database_id}/query",
                headers={
                    "Authorization": f"Bearer {NOTION_TOKEN}",
                    "Notion-Version": "2022-06-28",
                    "Content-Type": "application/json",
                },
                json=body,
            )

            # Retry on rate limit with backoff (max 3 attempts)
            if resp.status_code == 429 and retries < 3:
                retries += 1
                retry_after = float(resp.headers.get("Retry-After", "1"))
                await asyncio.sleep(retry_after)
                continue
            retries = 0

            # Provide helpful error messages
            if resp.status_code == 404:
                raise ValueError(
                    f"Database {database_id} not found or integration doesn't have access. "
                    f"Please ensure:\n"
                    f"1. The database ID is correct\n"
                    f"2. The integration is shared with the database in Notion\n"
                    f"3. The integration has the correct permissions"
                )
            elif resp.status_code == 401:
                raise ValueError(
                    "Authentication failed. Please check your NOTION_INTERNAL_INTEGRATION_SECRET."
                )
            elif resp.status_code == 403:
                raise ValueError(
                    f"Access forbidden for database {database_id}. "
                    f"The integration doesn't have permission to access this database."
                )
            
            resp.raise_for_status()
            response = resp.json()
            
            pages.extend(response["results"])
            if not response.get("has_more"):
                break
            cursor = response.get("next_cursor")
    
    return pages


async def get_all_personas() -> list[Persona]:
    pages = await _query_database(DATABASE_IDS["personas"])
    result: list[Persona] = []
    for page in pages:
        props = page["properties"]
        result.append(
            Persona(
                id=page["id"],
                created_time=page["created_time"],
                persona_type=_extract_title(props, "Persona Type"),
                primary_use_case=_extract_rich_text(props, "Primary Use Case"),
                communication_style=_extract_select(props, "Communication Style") or "Analytical",
                goals=_extract_rich_text(props, "Goals"),
                constraints=_extract_rich_text(props, "Constraints"),
                speaker_name=_extract_rich_text(props, "Speaker Name"),
                persona_summary=_extract_rich_text(props, "Persona Summary"),
            )
        )
    return result


async def get_all_quotes() -> list[Quote]:
    pages = await _query_database(DATABASE_IDS["quotes"])
    result: list[Quote] = []
    for page in pages:
        props = page["properties"]
        persona_ids = _extract_relation(props, "Related Persona")
        issue_ids = _extract_relation(props, "Related Issue")
        competitor_ids = _extract_relation(props, "Competitor Mentioned")
        result.append(
            Quote(
                id=page["id"],
                created_time=page["created_time"],
                quote_text=_extract_title(props, "Quote Text"),
                speaker=_extract_rich_text(props, "Speaker"),
                sentiment=_extract_select(props, "Sentiment") or "Neutral",
                quote_type=_extract_select(props, "Quote Type") or "Insight",
                related_persona_id=persona_ids[0] if persona_ids else None,
                related_issue_id=issue_ids[0] if issue_ids else None,
                competitor_mentioned_id=competitor_ids[0] if competitor_ids else None,
            )
        )
    return result


async def get_all_issues() -> list[Issue]:
    pages = await _query_database(DATABASE_IDS["issues"])
    result: list[Issue] = []
    for page in pages:
        props = page["properties"]
        persona_ids = _extract_relation(props, "Related Persona")
        quote_ids = _extract_relation(props, "Related Quotes")
        result.append(
            Issue(
                id=page["id"],
                created_time=page["created_time"],
                issue_title=_extract_title(props, "Issue Title"),
                issue_type=_extract_select(props, "Issue Type") or "Pain Point",
                issue_details=_extract_rich_text(props, "Issue Details"),
                severity=_extract_select(props, "Severity") or "Medium",
                time=_extract_rich_text(props, "Time"),
                related_persona_id=persona_ids[0] if persona_ids else None,
                related_quote_ids=quote_ids,
                engineer_matching=_extract_rich_text(props, "Engineer Matching"),
                graph_type=_extract_select(props, "Graph Type"),
                exa_trigger=_extract_checkbox(props, "Exa Trigger"),
                graph_data=_extract_rich_text(props, "Graph Data"),
            )
        )
    return result


async def get_all_competitors() -> list[Competitor]:
    pages = await _query_database(DATABASE_IDS["competitors"])
    result: list[Competitor] = []
    for page in pages:
        props = page["properties"]
        result.append(
            Competitor(
                id=page["id"],
                created_time=page["created_time"],
                competitor_name=_extract_title(props, "Competitor Name"),
                website=_extract_url(props, "Website"),
                key_features=_extract_rich_text(props, "Key Features"),
                pricing=_extract_rich_text(props, "Pricing"),
                user_sentiment=_extract_select(props, "User Sentiment") or "Mixed",
            )
        )
    return result
