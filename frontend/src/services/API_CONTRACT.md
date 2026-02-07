# Prism API Contract

Base URL: `http://localhost:8000`

All endpoints return JSON. The frontend is **read-only** — all writes come from the voice agent pipeline.

## Endpoints

### GET `/project/{project_id}/context`
Returns the full `ResearchProject` object.

### GET `/project/{project_id}/transcripts`
Returns `InterviewTranscript[]` for the project.

### GET `/project/{project_id}/quotes`
Returns `QuoteEvidence[]` for the project.

### GET `/project/{project_id}/market-intel`
Returns `MarketIntelligence[]` for the project.

### GET `/project/{project_id}/competitors`
Returns `CompetitorEntry[]` for the project.

### GET `/project/{project_id}/insights`
Returns `InsightTheme[]` for the project.

### GET `/project/{project_id}/actions`
Returns `ActionItem[]` for the project.

### GET `/project/{project_id}/analytics`
Returns `AnalyticsData` with aggregated stats for the project.

## Notes

- All property names use **snake_case** (matching Pydantic models).
- Timestamps are ISO 8601 strings.
- IDs follow the pattern: `proj-*`, `tx-*`, `q-*`, `mi-*`, `comp-*`, `ins-*`, `act-*`.
- Confidence/coverage scores are floats 0.0 - 1.0.
- Relevance scores are floats 0.0 - 1.0.
