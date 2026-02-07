# Notion API — Write & Read Patterns

Use the official Notion Python SDK: notion-client
pip install notion-client

## Setup

from notion_client import Client

notion = Client(auth=os.environ["NOTION_API_TOKEN"])

## DATABASE IDS (copy-paste ready)

RESEARCH_PROJECTS_DB = "bf0bcc87f6cd434cb8c4200be9e5a2b1"
INTERVIEW_TRANSCRIPTS_DB = "e0fdc4c54b8340c8a6b913b84b2b8153"
QUOTES_DB = "84d8858965b24497983572bf4ab9857b"
MARKET_INTEL_DB = "e0c128cf0e1c4b7999f4c2866fcdfb07"
COMPETITIVE_DB = "38e7bdee9467437091b9cbf800fb9bfe"
INSIGHTS_DB = "527a24c286c04c2e8077673c587e1dd3"
ACTION_ITEMS_DB = "7cfe54f625f7475a9005ff2030c924ad"

---

## WRITE PATTERNS

### Write Interview Transcript

notion.pages.create(
    parent={"database_id": INTERVIEW_TRANSCRIPTS_DB},
    properties={
        "Title": {"title": [{"text": {"content": f"Interview with {participant} — {date}"}}]},
        "Research Project": {"relation": [{"id": project_page_id}]},
        "Participant Name": {"rich_text": [{"text": {"content": participant}}]},
        "Participant Role": {"rich_text": [{"text": {"content": role}}]},
        "Duration": {"number": duration_minutes},
        "Date": {"date": {"start": date_iso}},
        "Status": {"select": {"name": "Completed"}},
        "Summary": {"rich_text": [{"text": {"content": summary}}]},
        "Coverage Score": {"number": coverage_pct},
    },
    children=[
        {
            "object": "block",
            "type": "paragraph",
            "paragraph": {
                "rich_text": [{"type": "text", "text": {"content": transcript_chunk}}]
            }
        }
        # NOTE: rich_text content max 2000 chars per block.
        # Split transcript into chunks of 2000 chars, one paragraph block each.
    ]
)

### Write Quote

notion.pages.create(
    parent={"database_id": QUOTES_DB},
    properties={
        "Quote Text": {"title": [{"text": {"content": quote_text}}]},
        "Source Type": {"select": {"name": "Interview"}},
        "Speaker/Author": {"rich_text": [{"text": {"content": speaker}}]},
        "Sentiment": {"select": {"name": sentiment}},  # Positive/Negative/Neutral/Mixed
        "Topics": {"multi_select": [{"name": t} for t in topics]},
        "Interview Transcript": {"relation": [{"id": transcript_page_id}]},
        "Research Project": {"relation": [{"id": project_page_id}]},
        "Date": {"date": {"start": date_iso}},
    }
)

# Valid Topics: Onboarding, Pricing, AI Quality, Workflow, Integrations

# Research Synthesis, Voice/Interview, Collaboration, Data Management

### Write Insight

notion.pages.create(
    parent={"database_id": INSIGHTS_DB},
    properties={
        "Insight": {"title": [{"text": {"content": insight_statement}}]},
        "Research Project": {"relation": [{"id": project_page_id}]},
        "Confidence": {"select": {"name": "High"}},  # High/Medium/Low
        "Confidence Score": {"number": 0.82},
        "Category": {"select": {"name": "Pain Point"}},  # Pain Point/Need/Opportunity/Risk/Validation
        "Supporting Quotes": {"relation": [{"id": q} for q in quote_page_ids]},
        "Supporting Articles": {"relation": [{"id": a} for a in article_page_ids]},
        "Competitor Evidence": {"relation": [{"id": c} for c in competitor_page_ids]},
        "Summary": {"rich_text": [{"text": {"content": synthesis_paragraph}}]},
        "Implications": {"rich_text": [{"text": {"content": implications_text}}]},
        "Status": {"select": {"name": "Validated"}},  # Emerging/Validated/Actionable/Archived
    }
)

### Write Action Item

notion.pages.create(
    parent={"database_id": ACTION_ITEMS_DB},
    properties={
        "Action": {"title": [{"text": {"content": action_text}}]},
        "Research Project": {"relation": [{"id": project_page_id}]},
        "Type": {"select": {"name": "Feature"}},  # Feature/Improvement/Investigation/Pivot
        "Priority": {"select": {"name": "P0"}},  # P0/P1/P2/P3
        "Supporting Insights": {"relation": [{"id": i} for i in insight_page_ids]},
        "Status": {"select": {"name": "Proposed"}},  # Proposed/Accepted/In Progress/Done
    }
)

---

## READ PATTERNS

### Query a database (all entries)

results = notion.databases.query(database_id=QUOTES_DB)
pages = results["results"]
for page in pages:
    props = page["properties"]
    quote = props["Quote Text"]["title"][0]["text"]["content"]
    sentiment = props["Sentiment"]["select"]["name"] if props["Sentiment"]["select"] else None
    # etc.

### Query with filter

results = notion.databases.query(
    database_id=QUOTES_DB,
    filter={
        "property": "Source Type",
        "select": {"equals": "Interview"}
    }
)

### Query with compound filter

results = notion.databases.query(
    database_id=INSIGHTS_DB,
    filter={
        "and": [
            {"property": "Category", "select": {"equals": "Pain Point"}},
            {"property": "Confidence", "select": {"equals": "High"}},
        ]
    }
)

### Read a page's content (e.g., transcript body)

blocks = notion.blocks.children.list(block_id=page_id)
full_text = ""
for block in blocks["results"]:
    if block["type"] == "paragraph":
        for rt in block["paragraph"]["rich_text"]:
            full_text += rt["text"]["content"]

### Get related pages (follow a relation)

# Given a quote page, get its interview transcript

transcript_relations = page["properties"]["Interview Transcript"]["relation"]
for rel in transcript_relations:
    transcript_page = notion.pages.retrieve(page_id=rel["id"])

---

## IMPORTANT NOTES

1. Rich text content blocks max 2000 characters each. Split long transcripts.
2. Relations use page IDs (not database IDs). You need the page ID of the
   related entry (e.g., the Research Project page ID, not the DB ID).
3. Multi-select values must match existing options exactly (case-sensitive).
4. Date format: ISO-8601 string, e.g., "2026-02-07"
5. When creating pages, the response includes the new page's ID — save it
   to use in subsequent relation writes.
6. Notion API rate limit: 3 requests/second average. Use batching for bulk writes.
