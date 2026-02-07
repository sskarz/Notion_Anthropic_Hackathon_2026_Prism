# Prism — PM Research IDE

Hackathon: Cartesia x Anthropic Voice Agents — Feb 7-8, 2026
Goal: Win Notion Bonus Track + Main Track placement

## What Is Prism

Prism is the application. Notion is the database.
A research IDE that wraps Notion databases in a purpose-built interface for PM research.
The voice agent interviews customers autonomously (without PM present).
The PM opens Prism and sees structured outputs: issues, insights, competitive intel, analytics.

## Product Flow

1. Customer receives email with interview link
2. Customer clicks link, joins voice call (Google Meet / Daily room)
3. Voice agent (Pipecat + Cartesia + Deepgram + Claude) conducts interview
4. Interview ends
5. Post-processing: Claude extracts summary, quotes, themes, sentiment
6. Data writes to Notion via API: transcript, quotes, insights, action items
7. Notion Custom Agents fire: Task Routing auto-tags, Status Update synthesizes
8. PM opens Prism IDE → sees new issues, insights, analytics already populated

## Technical Stack

- Frontend: React IDE (Figma → Claude Code) — Jai's scope
- Backend: FastAPI Python server — Jai's scope
- Voice: Pipecat + Deepgram + Claude Sonnet 4 + Cartesia Sonic-3 + Daily WebRTC — teammates
- Persistence: Notion API (7 databases)
- Automation: Notion Custom Agents (Task Routing, Status Update, Q&A)
- Research: Exa API + BrowserBase API (pre-interview)

## Repo Structure

prism/
├── frontend/                # React IDE
│   ├── src/
│   │   ├── App.jsx
│   │   ├── layouts/
│   │   │   └── IDELayout.jsx
│   │   ├── panels/
│   │   │   ├── InterviewPanel.jsx
│   │   │   ├── ContextPanel.jsx
│   │   │   ├── InsightsPanel.jsx
│   │   │   └── ResearchPanel.jsx
│   │   ├── components/
│   │   │   ├── Toolbar.jsx
│   │   │   ├── StatusBar.jsx
│   │   │   └── PanelHeader.jsx
│   │   └── hooks/
│   │       ├── useInterview.js
│   │       └── useNotionData.js
│   └── package.json
├── server/                  # FastAPI backend
│   ├── main.py
│   ├── routes/
│   │   ├── interview.py
│   │   └── project.py
│   └── services/
│       ├── notion_client.py
│       ├── daily.py
│       └── pipecat_runner.py
├── voice/                   # Pipecat voice pipeline (teammates)
│   ├── pipeline.py
│   ├── interview_agent.py
│   ├── emotion_control.py
│   └── post_processing.py
├── research/                # Pre-interview research scripts
│   ├── exa_search.py
│   ├── browserbase_scrape.py
│   └── synthesis.py
├── notion/                  # Notion integration
│   ├── mcp_client.py
│   └── context_reader.py
└── scripts/
    └── prepopulate_dbs.py

## Environment Variables

CARTESIA_API_KEY=
ANTHROPIC_API_KEY=
DEEPGRAM_API_KEY=
DAILY_API_KEY=
NOTION_API_TOKEN=
EXA_API_KEY=
BROWSERBASE_API_KEY=
