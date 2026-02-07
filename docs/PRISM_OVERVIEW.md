# Prism -- PM Research IDE

Hackathon: Cartesia x Anthropic Voice Agents -- Feb 7-8, 2026
Goal: Win Notion Bonus Track + Main Track placement

## What Is Prism

Prism is the application. Notion is the database.
A research IDE that wraps Notion databases in a purpose-built interface for PM research.
The voice agent interviews customers autonomously (without PM present).
The PM opens Prism and sees structured outputs: issues, personas, quotes, competitive intel, analytics.

## Product Flow

1. Customer receives email with interview link
2. Customer clicks link, joins voice call (LiveKit room)
3. Voice agent (LiveKit + Cartesia + Deepgram + Claude) conducts interview
4. Interview ends
5. Post-processing: Claude Agent extracts personas, quotes, issues from transcript
6. Data writes to Notion via FastAPI backend: personas -> quotes -> issues (4 databases)
7. Notion Agents fire: engineer matching, graph type suggestion, Exa trigger for competitive search
8. PM opens Prism IDE -> sees new issues, quotes, personas, competitive landscape

## Technical Stack

- Frontend: React + TypeScript + Vite IDE -- Jai's scope
- Backend: FastAPI Python server (port 8000) -- Jai's scope
- Voice: LiveKit + Deepgram + Claude Sonnet 4 + Cartesia Sonic -- teammates
- Persistence: Notion API (4 databases: Issues, Personas, Quotes, Competitive Landscape)
- Automation: Notion Agents (engineer matching, Exa triggers)
- Research: Exa API (competitive search triggered by issues)

## Notion Databases (4)

| Database              | Purpose                                            |
|-----------------------|----------------------------------------------------|
| Issues                | Core output: pain points, feature requests, gaps   |
| Personas              | User archetypes extracted from interviews           |
| Quotes                | Verbatim quotes with sentiment and type             |
| Competitive Landscape | Competitors found via Exa when issues are flagged   |

See docs/Notion_Databases.md for full schema and property details.

## Repo Structure

prism/
├── frontend/                # React + TypeScript IDE
│   ├── src/
│   │   ├── App.tsx
│   │   ├── layouts/
│   │   │   └── IDELayout.tsx
│   │   ├── components/
│   │   │   ├── Prism.tsx           # WebGL background
│   │   │   ├── HeroPage.tsx
│   │   │   ├── LiveKitSession.tsx
│   │   │   └── shared/
│   │   │       ├── Toolbar.tsx
│   │   │       └── PanelContainer.tsx
│   │   ├── types/
│   │   │   ├── issue.ts
│   │   │   ├── persona.ts
│   │   │   ├── quote.ts
│   │   │   ├── competitor.ts
│   │   │   ├── analytics.ts
│   │   │   └── index.ts
│   │   ├── hooks/
│   │   │   ├── useIssues.ts
│   │   │   ├── usePersonas.ts
│   │   │   ├── useQuotes.ts
│   │   │   ├── useCompetitors.ts
│   │   │   ├── useAnalytics.ts
│   │   │   └── useDemoSimulation.ts
│   │   ├── services/
│   │   │   └── api.ts
│   │   ├── mocks/
│   │   │   ├── data.ts
│   │   │   └── analytics.ts
│   │   └── lib/
│   │       ├── constants.ts
│   │       └── utils.ts
│   └── package.json
├── backend/
│   ├── main.py                  # FastAPI app, port 8000
│   ├── config.py                # DB IDs, env vars
│   ├── requirements.txt
│   ├── token_server.py          # LiveKit token server (port 8080)
│   ├── models/
│   │   ├── persona.py
│   │   ├── quote.py
│   │   ├── issue.py
│   │   ├── competitor.py
│   │   └── extraction.py
│   ├── services/
│   │   ├── notion_mapper.py
│   │   ├── notion_writer.py
│   │   └── notion_reader.py
│   ├── routes/
│   │   ├── extraction.py        # POST /api/extraction
│   │   └── project.py           # GET /api/project/context, /analytics
│   └── voice_livekit/           # LiveKit voice agent (teammates)
└── docs/
    ├── Notion_Databases.md      # Authoritative schema reference
    ├── FastAPI_Endpoints.md     # Endpoint spec
    ├── Notion_APi_Usage.md      # Notion SDK patterns
    └── PRISM_OVERVIEW.md        # This file

## Environment Variables

NOTION_TOKEN=              # Notion integration token
LIVEKIT_API_KEY=           # LiveKit credentials
LIVEKIT_API_SECRET=
LIVEKIT_URL=
ANTHROPIC_API_KEY=         # Claude API
CARTESIA_API_KEY=          # Cartesia TTS
DEEPGRAM_API_KEY=          # Deepgram STT
EXA_API_KEY=               # Exa competitive search
