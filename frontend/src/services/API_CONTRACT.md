# Prism API Contract

Base URL: `http://localhost:8000`

## Endpoints

### POST `/api/extraction`
Receives Claude Agent extraction output. Writes personas, quotes, issues to Notion.
Request body: `ExtractionPayload` (see backend/models/extraction.py).
Returns: `{personas_created, quotes_created, issues_created}`

### GET `/api/project/context`
Returns all data from 4 Notion databases: `{issues: Issue[], personas: Persona[], quotes: Quote[], competitors: Competitor[]}`

### GET `/api/project/analytics`
Returns aggregated stats: `{total_issues, total_quotes, total_personas, total_competitors, issues_by_severity, issues_by_type, quotes_by_sentiment}`

### GET `/health`
Returns `{"status": "ok"}`

## Notes

- All property names use **snake_case** (matching Pydantic models).
- Timestamps are ISO 8601 strings.
- IDs are Notion page UUIDs.
- No project_id scoping -- all data is returned from the workspace databases.
- Frontend toggles mock/real via `VITE_USE_MOCK` env var (default: mock).
