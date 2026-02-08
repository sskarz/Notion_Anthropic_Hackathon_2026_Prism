# Prism -- PM Research Intelligence IDE

**Hackathon:** Cartesia x Anthropic Voice Agents | Feb 7-8, 2026

Prism is an AI-powered research IDE that conducts autonomous customer interviews via voice and surfaces structured product intelligence -- no PM needs to be on the call.

A customer clicks a link, talks to an AI interviewer, and the PM opens Prism to find organized issues, personas, quotes, competitive intel, and analytics waiting for them.

## How It Works

```
Customer clicks link
        |
        v
  LiveKit Voice Room
  (Cartesia STT + Claude Sonnet + Cartesia TTS)
        |
        v
  Interview ends --> Claude extracts structured JSON
        |
        v
  FastAPI writes extraction to Notion Extractions DB
        |
        v
  Notion Agent 1: Extraction Processor
    - Fans out JSON into Personas, Quotes, Issues DBs
    - Enriches each issue (engineer matching, graph data, Exa trigger)
        |
        v
  Notion Agent 2: Persona Summarizer
    - Generates persona summary for each new persona
        |
        v
  Exa competitive search (for flagged issues)
    - Populates Competitive Landscape DB
        |
        v
  PM opens Prism IDE --> sees everything, organized
```

## Technical Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, TypeScript, Vite, Tailwind CSS v4 |
| IDE Layout | react-resizable-panels (4-panel resizable interface) |
| Graphics | OGL WebGL prismatic background |
| Voice Agent | LiveKit Agents + Cartesia Ink STT + Claude Sonnet + Cartesia Sonic TTS + Silero VAD |
| Backend | FastAPI (port 8000 -- data API, LiveKit tokens, transcript analysis) |
| Persistence | Notion API (5 relational databases) |
| Automation | Notion Custom Agents (alpha) -- extraction processing + persona summarization |
| Competitive Intel | Exa API (triggered by Notion Agent when issues are flagged) |
| Post-Interview Analysis | Claude Sonnet -- markdown report + structured JSON extraction |

## Product Flow

1. **Landing** -- Hero page with WebGL prismatic background
2. **Intake Form** -- User provides name, company, role, problem description, urgency
3. **Voice Interview** -- LiveKit room with AI interviewer (sub-1s latency, fully streaming)
4. **Post-Processing** -- Claude analyzes transcript twice: a markdown report for the PM, and a structured JSON extraction (personas, quotes, issues)
5. **Notion Persistence** -- Extraction JSON writes to the Extractions DB via FastAPI
6. **Notion Agent: Extraction Processor** -- Triggers on new extraction, fans out JSON into Personas/Quotes/Issues DBs with full relational linking, enriches each issue with engineer matching, graph data, and Exa trigger flags
7. **Notion Agent: Persona Summarizer** -- Triggers on new persona, generates a concise third-person summary
8. **Exa Competitive Search** -- Issues flagged with Exa Trigger get competitive landscape research populated automatically
9. **PM IDE View** -- 4-panel resizable interface with live data from Notion

## IDE Panels

| Panel | Position | Contents |
|-------|----------|----------|
| Context | Left | Personas (expandable speakers), related issues per speaker, competitors with sentiment |
| Interview | Center | LiveKit voice session, recent quotes feed |
| Analysis | Right | Issues sorted by severity, engineering matching, analytics summary bar |
| Research Log | Bottom | Tabbed: Quotes (filterable by sentiment), Competitive (grid), Analytics (bar charts) |

## Notion Databases

Five relational databases with cross-references:

- **Extractions** -- Raw structured JSON from Claude's post-interview analysis. Triggers the Extraction Processor agent.
- **Issues** -- Pain points, feature requests, workflow gaps. Enriched by Extraction Processor with engineer matching, graph type, graph data JSON, and Exa trigger flag.
- **Personas** -- User archetypes extracted from interviews (type, speaker name, use case, communication style, goals, constraints). Enriched with a generated persona summary.
- **Quotes** -- Verbatim quotes with sentiment, type, and relations to personas/issues/competitors.
- **Competitive Landscape** -- Competitors populated via Exa search when issues are flagged.

```
                    Interview ends
                         |
                         v
              Claude extracts JSON
                         |
                         v
                  Extractions DB
                         |
                         v
         Notion Agent: Extraction Processor
         (fans out into Personas, Quotes, Issues)
                    /    |    \
                   v     v     v
            Personas  Quotes  Issues
               |                 |
               v                 v
       Notion Agent:     Enrichment (engineer
       Persona Summary   matching, graph data,
                         Exa trigger)
                              |
                              v
                    Competitive Landscape
                    (populated via Exa)
```

### Cross-references

```
Quotes --> Issues (Related Issue)
Quotes --> Personas (Related Persona)
Quotes --> Competitive Landscape (Competitor Mentioned)
Issues --> Personas (Related Persona)
Issues --> Quotes (Related Quotes)
Issues --[Exa Trigger]--> Competitive Landscape
```

## Notion Custom Agents

We use Notion Custom Agents (alpha) to automate the pipeline from raw extraction to enriched, linked data -- no backend orchestration needed after the initial write.

### Agent 1: Extraction Processor

**Trigger:** New page added to Extractions DB.

Parses the `Extraction Data` JSON field and fans it out into three databases in strict order:

1. **Personas** -- creates a page per persona, tracks page IDs
2. **Quotes** -- creates a page per quote, links to persona via `temp_persona_index`
3. **Issues** -- creates a page per issue, links to persona and quotes via index references

After creating each issue, the agent enriches it inline:

| Property | What the agent generates |
|----------|------------------------|
| Engineer Matching | 1-2 sentence description of ideal engineer owner |
| Graph Type | Best visualization (Bar / Trend / Heatmap / None) |
| Graph Data | JSON string with `labels`, `values`, `label` for chart rendering |
| Exa Trigger | `true` if the issue mentions competitors or would benefit from competitive research |

Finally marks the Extraction page status as **Processed** (or **Error** on failure).

### Agent 2: Persona Summarizer

**Trigger:** New page added to Personas DB.

Reads the persona's properties (type, speaker name, use case, communication style, goals, constraints) and writes a 2-3 sentence `Persona Summary` in third person -- capturing who they are, what they care about, and their key constraints.

## Repo Structure

```
prism/
  frontend/               # React + TypeScript IDE
    src/
      App.tsx              # View routing (hero -> form -> interview -> ide)
      components/
        Prism.tsx          # WebGL prismatic background (OGL)
        HeroPage.tsx       # Landing page
        UserForm.tsx       # User intake form
        LiveKitSession.tsx # Voice interview component
        shared/            # Toolbar, StatusBar, PanelContainer
        charts/            # Heatmap, LineChart, PieChart
      panels/              # ContextPanel, InterviewPanel, AnalysisPanel, ResearchLogPanel
      layouts/IDELayout.tsx  # Resizable 4-panel layout
      context/             # ResearchContext (cross-panel state)
      hooks/               # useIssues, usePersonas, useQuotes, useCompetitors, useAnalytics, useExaTrigger
      services/api.ts      # API client
      types/               # TypeScript types matching Notion schema
  backend/
    main.py                # FastAPI app (port 8000)
    config.py              # Notion DB IDs, env config
    models/                # Pydantic models (issue, persona, quote, competitor, extraction)
    routes/                # extraction, project, exa, interview (token, intake, transcript analysis)
    services/              # notion_reader, notion_writer, notion_mapper
    exa/                   # Exa search integration
    voice_livekit/         # LiveKit voice agent (agent.py)
```

## Running

**Frontend:**

```bash
cd frontend
npm install
npm run dev          # http://localhost:5173
```

**Backend:**

```bash
cd backend
pip install -r requirements.txt
python -m uvicorn main:app --reload --port 8000
```

**Voice agent:**

```bash
cd backend/voice_livekit
pip install -r requirements.txt
# Run with LiveKit CLI dev command
```

## Environment Variables

```
NOTION_INTERNAL_INTEGRATION_SECRET=  # Notion integration token
LIVEKIT_API_KEY=
LIVEKIT_API_SECRET=
LIVEKIT_URL=                         # wss://your-project.livekit.cloud
ANTHROPIC_API_KEY=
CARTESIA_API_KEY=
EXA_API_KEY=
```
