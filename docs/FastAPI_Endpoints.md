# FastAPI Backend -- Endpoint Spec

The backend serves two consumers:

1. React frontend (IDE) -- reads project context + analytics
2. Claude Agent pipeline -- POSTs extracted data after interview processing

Backend runs on port 8000. CORS allows localhost:5173.

---

## Endpoints

### GET /health

Health check.

Response:
{
    "status": "ok"
}

### POST /api/extraction

Receives Claude Agent's structured extraction output after processing an interview.
Writes to Notion in order: personas -> quotes -> issues (order matters for relation resolution).

Request (ExtractionPayload):
{
    "personas": [
        {
            "persona_type": "Growth PM at Series B SaaS",
            "primary_use_case": "Evaluating onboarding tools",
            "communication_style": "Analytical",
            "goals": "Reduce time-to-value below 10 minutes",
            "constraints": "Small team, limited engineering"
        }
    ],
    "quotes": [
        {
            "quote_text": "We stopped sending 30-page PDFs...",
            "speaker": "Sarah Chen, CS Lead at FinEdge",
            "sentiment": "Positive",
            "quote_type": "Insight",
            "temp_persona_index": 0,
            "competitor_mentioned_id": null
        }
    ],
    "issues": [
        {
            "issue_title": "Mid-market teams need progressive onboarding",
            "issue_type": "Pain Point",
            "issue_details": "Teams consistently reject documentation dumps...",
            "severity": "Critical",
            "temp_persona_index": 0,
            "temp_quote_indices": [0]
        }
    ]
}

Index-based referencing: quotes reference personas by array index (temp_persona_index),
issues reference personas and quotes by array index. The endpoint resolves these to
real Notion page IDs after creating entities in order.

Response:
{
    "personas_created": 1,
    "quotes_created": 1,
    "issues_created": 1
}

### GET /api/project/context

Returns all data from 4 Notion databases for the frontend panels.

Response:
{
    "issues": [
        {
            "id": "notion-page-id",
            "created_time": "2026-02-07T10:00:00Z",
            "issue_title": "Mid-market teams need progressive onboarding",
            "issue_type": "Pain Point",
            "issue_details": "...",
            "severity": "Critical",
            "related_persona_id": "notion-page-id-or-null",
            "related_quote_ids": ["notion-page-id", ...],
            "engineer_matching": "Frontend + UX",
            "graph_type": "Bar",
            "exa_trigger": true
        }
    ],
    "personas": [
        {
            "id": "notion-page-id",
            "created_time": "2026-02-07T10:00:00Z",
            "persona_type": "Growth PM at Series B SaaS",
            "primary_use_case": "...",
            "communication_style": "Analytical",
            "goals": "...",
            "constraints": "..."
        }
    ],
    "quotes": [
        {
            "id": "notion-page-id",
            "created_time": "2026-02-07T10:00:00Z",
            "quote_text": "...",
            "speaker": "Sarah Chen, CS Lead at FinEdge",
            "sentiment": "Positive",
            "quote_type": "Insight",
            "related_persona_id": "notion-page-id-or-null",
            "related_issue_id": "notion-page-id-or-null",
            "competitor_mentioned_id": "notion-page-id-or-null"
        }
    ],
    "competitors": [
        {
            "id": "notion-page-id",
            "created_time": "2026-02-07T10:00:00Z",
            "competitor_name": "Dovetail",
            "website": "https://dovetail.com",
            "key_features": "AI-powered tagging, video analysis...",
            "pricing": "Free, Team $29/user/mo, Enterprise custom",
            "user_sentiment": "Positive"
        }
    ]
}

### GET /api/project/analytics

Aggregated stats for the analytics panel.

Response:
{
    "total_issues": 5,
    "total_quotes": 8,
    "total_personas": 3,
    "total_competitors": 4,
    "issues_by_severity": {"Critical": 2, "High": 2, "Medium": 1},
    "issues_by_type": {"Pain Point": 1, "Feature Request": 1, "Unmet Need": 2, "Workflow Gap": 1},
    "quotes_by_sentiment": {"Positive": 4, "Neutral": 2, "Frustrated": 2}
}

---

## Notion Database IDs

From docs/Notion_Databases.md:

| Database              | Database ID                          |
|-----------------------|--------------------------------------|
| Issues                | 37a0541c-5a3b-4103-ac9c-2ab99ce66812 |
| Personas              | 8ae9dd9c-b488-4253-a8e2-1c49a14329bf |
| Quotes                | 036ee354-4005-4ccd-ad83-3b9a035eaa42 |
| Competitive Landscape | 38e7bdee-9467-4370-91b9-cbf800fb9bfe |

---

## Error Handling

| Failure                     | Behavior                                    |
|-----------------------------|---------------------------------------------|
| Notion API write fails      | Raises HTTP 500 with error details          |
| Notion rate limit (3 req/s) | 0.35s delay between writes                  |
| Invalid extraction payload  | Pydantic validation -> HTTP 422             |
| Missing NOTION_TOKEN        | App fails to start                          |
