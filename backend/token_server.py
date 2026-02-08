"""Minimal token server for LiveKit frontend connection."""

import json
import os
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

import anthropic
from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from livekit import api
from pydantic import BaseModel

load_dotenv(os.path.join(os.path.dirname(__file__), ".env"))
load_dotenv(os.path.join(os.path.dirname(__file__), "voice_livekit", ".env"))

SIGNUPS_DIR = Path(__file__).parent / "signups"

analyses_store: list[dict[str, Any]] = []


class UserIntakeRequest(BaseModel):
    name: str
    company: str
    role: str  # "engineer" | "product_manager" | "designer" | "customer" | "sales" | "support" | "executive" | "other"
    problem_description: str
    steps_to_reproduce: str = ""
    urgency: str  # "high" | "medium" | "low"


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.post("/api/user-intake")
async def user_intake(req: UserIntakeRequest):
    SIGNUPS_DIR.mkdir(exist_ok=True)
    now = datetime.now(timezone.utc)
    timestamp = now.strftime("%Y%m%d_%H%M%S")
    safe_company = req.company.replace(" ", "-").lower()
    safe_name = req.name.replace(" ", "-").lower()
    filename = f"user_{safe_company}_{safe_name}_{timestamp}.md"

    steps_section = req.steps_to_reproduce if req.steps_to_reproduce else "N/A"
    content = f"""# User Feedback Intake

## Participant Information
- **Name:** {req.name}
- **Company:** {req.company}
- **Role:** {req.role}

## Issue Details

### Problem Description
{req.problem_description}

### Steps to Reproduce
{steps_section}

### Urgency Level
{req.urgency.upper()}

## Metadata
- **Submitted at:** {now.isoformat()}
"""
    (SIGNUPS_DIR / filename).write_text(content)
    return {"status": "ok"}


@app.get("/api/token")
async def get_token(
    room: str = "prism-interview",
    identity: str = "user",
    metadata: str = "",
):
    token = (
        api.AccessToken(
            os.getenv("LIVEKIT_API_KEY"),
            os.getenv("LIVEKIT_API_SECRET"),
        )
        .with_identity(identity)
        .with_name(identity)
        .with_metadata(metadata)
        .with_grants(api.VideoGrants(room_join=True, room=room))
    )
    jwt = token.to_jwt()
    return {"token": jwt, "url": os.getenv("LIVEKIT_URL")}


class TranscriptEntry(BaseModel):
    speaker: str
    text: str
    timestamp: float


class AnalyzeRequest(BaseModel):
    transcript: list[TranscriptEntry]
    user_context: dict[str, Any] | None = None


ANALYSIS_PROMPT = """\
You are a product research analyst. Analyze the following interview transcript between an interviewer (Prism AI agent) and a user.

Produce a structured markdown report with these sections:

## User Persona
A brief description of who this user is based on what they shared — their goals, pain points, and context.

## User Role
Identify the user's role within their company (e.g. Engineer, Product Manager, Designer, Customer, Sales, Support, Executive). Describe how their role influences the feedback they provided — what lens are they viewing the product through? How does their role shape the issues they raised and what they care about most?

## Product Issues
A table of product issues or feedback themes identified in the interview, prioritized by severity:

| Priority | Issue | Description | Evidence |
|----------|-------|-------------|----------|
| P0 | ... | ... | ... |
| P1 | ... | ... | ... |
| P2 | ... | ... | ... |

Use P0 for critical/blocking issues, P1 for significant pain points, P2 for minor improvements or nice-to-haves.

## Direct Quotes
Extract 3-6 notable direct quotes from the user (not the interviewer). For each quote include:
- The exact quote in quotation marks
- A sentiment label (positive / negative / neutral / mixed)
- Brief context for why this quote matters

## Summary
A 2-3 sentence executive summary of the most important findings from this interview.

---

Here is the transcript:

{transcript}
{user_context_section}"""

STRUCTURED_EXTRACTION_PROMPT = """\
You are a product research data extractor. Given the following interview transcript, extract structured data as JSON.

Output ONLY valid JSON matching this exact schema (no markdown fencing, no commentary):

{{
  "personas": [
    {{
      "persona_type": "string (e.g. 'Senior PM at SaaS Startup')",
      "primary_use_case": "string",
      "communication_style": "Analytical" | "Narrative" | "Terse" | "Verbose",
      "goals": "string",
      "constraints": "string"
    }}
  ],
  "quotes": [
    {{
      "quote_text": "string (exact quote from user)",
      "speaker": "string (name and role if available)",
      "sentiment": "Positive" | "Negative" | "Neutral" | "Frustrated",
      "quote_type": "Pain Point" | "Insight" | "Feature Request" | "Praise",
      "temp_persona_index": 0
    }}
  ],
  "issues": [
    {{
      "issue_title": "string",
      "issue_type": "Pain Point" | "Feature Request" | "Workflow Gap" | "Unmet Need",
      "issue_details": "string",
      "severity": "Critical" | "High" | "Medium" | "Low",
      "temp_persona_index": 0,
      "temp_quote_indices": [0, 1]
    }}
  ]
}}

Rules:
- temp_persona_index references the index in the personas array (0-based)
- temp_quote_indices references indices in the quotes array (0-based)
- Extract 1-3 personas, 3-6 quotes, and 2-5 issues
- communication_style MUST be exactly one of: Analytical, Narrative, Terse, Verbose

Transcript:

{transcript}
"""


@app.post("/api/analyze-transcript")
async def analyze_transcript(req: AnalyzeRequest):
    lines = []
    for entry in req.transcript:
        speaker = "Interviewer (Prism)" if entry.speaker == "agent" else "User"
        lines.append(f"{speaker}: {entry.text}")
    transcript_text = "\n".join(lines)

    user_context_section = ""
    if req.user_context:
        ctx_lines = ["\n\nAdditional context about the user (from intake form):"]
        for key, value in req.user_context.items():
            ctx_lines.append(f"- {key}: {value}")
        user_context_section = "\n".join(ctx_lines)

    client = anthropic.Anthropic()

    # Two Claude calls: markdown analysis + structured JSON extraction
    markdown_msg = client.messages.create(
        model="claude-sonnet-4-20250514",
        max_tokens=2048,
        messages=[
            {
                "role": "user",
                "content": ANALYSIS_PROMPT.format(
                    transcript=transcript_text,
                    user_context_section=user_context_section,
                ),
            }
        ],
    )
    analysis = markdown_msg.content[0].text

    extraction_msg = client.messages.create(
        model="claude-sonnet-4-20250514",
        max_tokens=4096,
        messages=[
            {
                "role": "user",
                "content": STRUCTURED_EXTRACTION_PROMPT.format(
                    transcript=transcript_text
                ),
            }
        ],
    )
    extraction_json_str = extraction_msg.content[0].text

    # Validate it parses as JSON
    json.loads(extraction_json_str)

    # Write to Extractions DB
    from models.extraction_summary import ExtractionSummaryCreate
    from services.notion_writer import create_extraction_summary

    context_str = json.dumps(req.user_context) if req.user_context else ""
    summary = ExtractionSummaryCreate(
        extraction_data=extraction_json_str,
        interview_context=context_str,
    )
    extraction_id = await create_extraction_summary(summary)

    if req.user_context is not None:
        analyses_store.append(
            {
                "analysis": analysis,
                "user_context": req.user_context,
                "timestamp": datetime.now(timezone.utc).isoformat(),
            }
        )

    return {"analysis": analysis, "extraction_id": extraction_id}


@app.get("/api/analyses")
async def get_analyses():
    return analyses_store


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8080)
