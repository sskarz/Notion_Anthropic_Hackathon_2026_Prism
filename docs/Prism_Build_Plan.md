Prism Build Plan

Context

Teammate is building: voice interview -> Claude Agents SDK -> structured extraction output.
We are building: the extraction contract, Notion persistence (4 DBs), FastAPI backend, and frontend IDE panels.

Demo strategy: "Simulate Interview" button triggers the full pipeline (POST mock extraction to backend -> write to Notion ->
frontend reads back). This shows the real data flow to judges.

Notion schema: 4 databases (Issues, Personas, Quotes, Competitive Landscape). See docs/Notion_Databases.md for full schema.

---
COMPLETED -- Backend + Frontend Type Migration

Step 1: Pydantic models matching Notion schema [DONE]

Created: backend/models/

- persona.py: PersonaCreate + Persona (persona_type, primary_use_case, communication_style, goals, constraints)
- quote.py: QuoteCreate + Quote (quote_text, speaker, sentiment, quote_type, relations)
- issue.py: IssueCreate + Issue (issue_title, issue_type, issue_details, severity, relations, enrichments)
- competitor.py: CompetitorCreate + Competitor (competitor_name, website, key_features, pricing, user_sentiment)
- extraction.py: ExtractionPayload with index-based referencing (QuoteInput, IssueInput)

Step 2: Notion services [DONE]

Created: backend/services/

- notion_mapper.py: Property format helpers (map_title, map_rich_text, map_select, map_url, map_checkbox, map_relation)
- notion_writer.py: AsyncClient writes with 0.35s rate limiting. Methods: create_persona, create_quote, create_issue, create_competitor
- notion_reader.py: AsyncClient reads with pagination. Methods: get_all_personas, get_all_quotes, get_all_issues, get_all_competitors

Step 3: FastAPI backend scaffold [DONE]

Created: backend/main.py, backend/config.py, backend/requirements.txt

- FastAPI with CORS (localhost:5173)
- Health check at /health
- 4 database IDs from docs/Notion_Databases.md
- NOTION_TOKEN loaded from .env

Step 4: API routes [DONE]

Created: backend/routes/

- extraction.py: POST /api/extraction -- receives Claude Agent output, writes to Notion in order (personas -> quotes -> issues), resolves index-based references to real page IDs
- project.py: GET /api/project/context -- returns all data from 4 DBs. GET /api/project/analytics -- aggregated stats

Step 5: Frontend type migration [DONE]

New types (frontend/src/types/):
- issue.ts: Issue, IssueType, Severity, GraphType
- persona.ts: Persona, CommunicationStyle
- quote.ts: Quote, Sentiment, QuoteType (new fields)
- competitor.ts: Competitor, UserSentiment (simplified)
- analytics.ts: AnalyticsData (new shape: total_issues, total_quotes, total_personas, total_competitors, issues_by_severity, issues_by_type, quotes_by_sentiment)

Deleted old types: project.ts, transcript.ts, insight.ts, action.ts, market.ts

Step 6: Frontend hooks + API service migration [DONE]

New hooks: useIssues, usePersonas (no projectId param)
Updated hooks: useQuotes, useCompetitors, useAnalytics (removed projectId param)
Deleted hooks: useProject, useTranscripts, useInsights, useActionItems, useMarketIntel

API service (services/api.ts): mock/real toggle via VITE_USE_MOCK env var. fetchProjectContext(), fetchIssues(), fetchPersonas(), fetchQuotes(), fetchCompetitors(), fetchAnalytics(). Updated SimulationResult to use new types.

Mocks updated to match new types. DEMO_PROJECT_ID removed from constants.

---
COMPLETED -- Frontend Panels + Integration

Step 7: Build ResearchContext provider [DONE]

Created: frontend/src/context/ResearchContext.tsx

Shared state for cross-panel interactions:
- selectedIssueId, highlightedQuoteId, selectedPersonaId (all string | null)
- Toggle-on-reclick behavior (clicking same item deselects it)
- Standard createContext + useContext hook pattern (ResearchProvider, useResearch)

Step 8: Build Left Panel (ContextPanel) [DONE]

Created: frontend/src/panels/ContextPanel.tsx

Three collapsible sections (Section component with ChevronDown/ChevronRight toggle):
1. Personas (default open) -- persona_type title, communication_style badge, goals preview. Click sets selectedPersonaId, active persona gets cyan left border.
2. Issue Overview -- severity count badges (Critical=red, High=orange, Medium=yellow, Low=gray), total issue count.
3. Competitors -- compact list with sentiment colored dots (Positive=green, Mixed=yellow, Negative=red) + website link.

Hooks: usePersonas, useIssues, useCompetitors

Step 9: Build Center Panel (InterviewPanel) [DONE]

Created: frontend/src/panels/InterviewPanel.tsx

Two sections stacked vertically:
1. LiveKit session area (renders existing LiveKitSession component, takes remaining space)
2. Recent Quotes feed (max-h-48, scrollable) -- sorted by created_time desc. Each card: quote_text (line-clamp-2), speaker, sentiment dot, quote_type badge. Click sets highlightedQuoteId (cyan border). Quotes matching selectedPersonaId get subtle cyan highlight.

Hooks: useQuotes

Step 10: Build Right Panel (AnalysisPanel) [DONE]

Created: frontend/src/panels/AnalysisPanel.tsx

1. Issues list sorted by severity (Critical > High > Medium > Low). Each card:
   - Severity badge (colored), issue type badge (colored text)
   - issue_title heading, issue_details (line-clamp-2)
   - Related quote count pill, engineer_matching text (dimmed)
   - Zap icon for exa_trigger=true
   - Click sets selectedIssueId (cyan border), persona-related issues get subtle highlight

2. Analytics summary bar below: stat pills (issues, quotes, personas, competitors) + CSS proportional severity bar

Hooks: useIssues, useAnalytics

Step 11: Build Bottom Panel (ResearchLogPanel) [DONE]

Created: frontend/src/panels/ResearchLogPanel.tsx

Tab-based layout (Quotes | Competitive | Analytics):

1. Quotes tab (default) -- sentiment filter buttons (All/Positive/Negative/Neutral/Frustrated, active=cyan). Full quote list with sentiment dot, speaker, sentiment badge, quote_type badge. Highlighted row when highlightedQuoteId matches.
2. Competitive tab -- 2-column grid of competitor cards: name, sentiment badge, key_features (line-clamp-2), pricing, website link.
3. Analytics tab -- stat cards row, horizontal bar charts (CSS-only) for issues by severity, issues by type, quotes by sentiment. HorizontalBars reusable component with color maps.

Hooks: useQuotes, useCompetitors, useAnalytics

Step 12: Wire up App.tsx + Toolbar [DONE]

App.tsx changes:
- Wrapped IDE view in ResearchProvider
- Replaced placeholder panels with ContextPanel, InterviewPanel, AnalysisPanel, ResearchLogPanel
- handleSimulate: calls simulateNewInterviewData(), pushes to mock arrays, increments refreshKey counter
- refreshKey used as key prop on all panels to force remount + re-fetch on simulate

Toolbar.tsx changes:
- Added onSimulate prop
- "Simulate Interview" button with Play icon, cyan accent styling

IDELayout.tsx changes:
- Added onSimulate prop passthrough to Toolbar

---
REMAINING -- Integration + Polish

Step 13: Connect frontend to real API

Set VITE_USE_MOCK=false in .env. All fetch functions already support real API calls.
Verify: backend running on port 8000, frontend on 5173, data flows end-to-end.
Update "Simulate Interview" to POST real ExtractionPayload to backend instead of mutating mock arrays.

Step 14: Demo polish

- Staggered animation for new data appearance
- Evidence threading: hovering an issue highlights supporting quotes in other panels
- StatusBar: Notion connection status, last sync timestamp
- Simulate button should show loading state while POST is in flight

---
Verification checklist

1. Backend starts: cd backend && python -m uvicorn main:app --reload --port 8000
2. Health check: curl http://localhost:8000/health -> {"status": "ok"}
3. GET context: curl http://localhost:8000/api/project/context -> returns data from 4 Notion DBs
4. GET analytics: curl http://localhost:8000/api/project/analytics -> aggregated stats
5. POST extraction: curl -X POST http://localhost:8000/api/extraction -H "Content-Type: application/json" -d '{"personas": [...], "quotes": [...], "issues": [...]}'
6. Check Notion: new personas, quotes, issues appear in databases with correct relations
7. Frontend starts: cd frontend && npm run dev
8. TypeScript compiles clean: npx tsc --noEmit
9. All 4 panels render with data
10. Click interactions work across panels
11. "Simulate Interview" -> full pipeline runs -> new data in all panels
12. Notion databases reflect all written data
