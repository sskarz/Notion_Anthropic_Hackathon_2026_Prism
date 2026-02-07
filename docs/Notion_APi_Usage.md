# Notion API -- Write & Read Patterns

Use the official Notion Python SDK: notion-client (AsyncClient)
pip install notion-client

## Setup

from notion_client import AsyncClient

notion = AsyncClient(auth=os.environ.get("NOTION_INTERNAL_INTEGRATION_SECRET") or os.environ["NOTION_TOKEN"])

## DATABASE IDS (copy-paste ready)

ISSUES_DB = "37a0541c-5a3b-4103-ac9c-2ab99ce66812"
PERSONAS_DB = "8ae9dd9c-b488-4253-a8e2-1c49a14329bf"
QUOTES_DB = "036ee354-4005-4ccd-ad83-3b9a035eaa42"
COMPETITORS_DB = "38e7bdee-9467-4370-91b9-cbf800fb9bfe"

---

## WRITE PATTERNS

### Write Persona

await notion.pages.create(
    parent={"database_id": PERSONAS_DB},
    properties={
        "Persona Type": {"title": [{"text": {"content": persona_type}}]},
        "Primary Use Case": {"rich_text": [{"text": {"content": use_case}}]},
        "Communication Style": {"select": {"name": "Analytical"}},
        "Goals": {"rich_text": [{"text": {"content": goals}}]},
        "Constraints": {"rich_text": [{"text": {"content": constraints}}]},
    }
)

### Write Quote

await notion.pages.create(
    parent={"database_id": QUOTES_DB},
    properties={
        "Quote Text": {"title": [{"text": {"content": quote_text}}]},
        "Speaker": {"rich_text": [{"text": {"content": speaker}}]},
        "Sentiment": {"select": {"name": "Frustrated"}},
        "Quote Type": {"select": {"name": "Pain Point"}},
        "Related Persona": {"relation": [{"id": persona_page_id}]},
        "Related Issue": {"relation": [{"id": issue_page_id}]},
        "Competitor Mentioned": {"relation": [{"id": competitor_page_id}]},
    }
)

# Valid Sentiment: Positive, Negative, Neutral, Frustrated
# Valid Quote Type: Pain Point, Insight, Feature Request, Praise

### Write Issue

await notion.pages.create(
    parent={"database_id": ISSUES_DB},
    properties={
        "Issue Title": {"title": [{"text": {"content": issue_title}}]},
        "Issue Type": {"select": {"name": "Pain Point"}},
        "Issue Details": {"rich_text": [{"text": {"content": details}}]},
        "Severity": {"select": {"name": "High"}},
        "Related Persona": {"relation": [{"id": persona_page_id}]},
        "Related Quotes": {"relation": [{"id": q} for q in quote_page_ids]},
    }
)

# Valid Issue Type: Pain Point, Feature Request, Workflow Gap, Unmet Need
# Valid Severity: Critical, High, Medium, Low

### Enrich Issue (Notion Agent)

await notion.pages.update(
    page_id=issue_page_id,
    properties={
        "Engineer Matching": {"rich_text": [{"text": {"content": "Backend + ML"}}]},
        "Graph Type": {"select": {"name": "Bar"}},
        "Exa Trigger": {"checkbox": True},
    }
)

### Write Competitor (from Exa)

await notion.pages.create(
    parent={"database_id": COMPETITORS_DB},
    properties={
        "Competitor Name": {"title": [{"text": {"content": name}}]},
        "Website": {"url": url},
        "Key Features": {"rich_text": [{"text": {"content": features}}]},
        "Pricing": {"rich_text": [{"text": {"content": pricing}}]},
        "User Sentiment": {"select": {"name": "Mixed"}},
    }
)

# Valid User Sentiment: Positive, Mixed, Negative

---

## READ PATTERNS

### Query a database (all entries with pagination)

pages = []
cursor = None
while True:
    kwargs = {"database_id": QUOTES_DB}
    if cursor:
        kwargs["start_cursor"] = cursor
    response = await notion.databases.query(**kwargs)
    pages.extend(response["results"])
    if not response.get("has_more"):
        break
    cursor = response.get("next_cursor")

### Extract properties

for page in pages:
    props = page["properties"]

    # Title
    title = props["Quote Text"]["title"][0]["plain_text"] if props["Quote Text"]["title"] else ""

    # Rich text
    text = props["Speaker"]["rich_text"][0]["plain_text"] if props["Speaker"]["rich_text"] else ""

    # Select
    sentiment = props["Sentiment"]["select"]["name"] if props["Sentiment"]["select"] else None

    # Relation
    persona_ids = [r["id"] for r in props["Related Persona"]["relation"]]

    # Checkbox
    exa_trigger = props["Exa Trigger"]["checkbox"]

    # URL
    website = props["Website"]["url"] or ""

---

## IMPORTANT NOTES

1. Relations use page IDs (not database IDs). Save the page ID from create responses.
2. Select values must match existing options exactly (case-sensitive).
3. Notion API rate limit: 3 requests/second average. Backend uses 0.35s delay between writes.
4. Write order matters: personas first, then quotes (need persona IDs), then issues (need quote IDs).
5. All reads use AsyncClient for non-blocking I/O.
