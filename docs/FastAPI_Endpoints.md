# FastAPI Backend — Endpoint Spec

The backend serves two consumers:

1. React frontend (IDE) — reads project context + interview status
2. Voice pipeline (teammates) — triggers post-processing after interview

---

## Endpoints

### POST /interview/start

Creates Daily room, initializes voice agent, returns join URL.

Request:
{
    "project_id": "notion-page-id-of-research-project"
}

Response:
{
    "interview_id": "uuid",
    "join_url": "<https://yourapp.com/interview/{interview_id}>",
    "daily_room_url": "<https://your-domain.daily.co/room-{interview_id}>"
}

Steps:

1. Read Research Project context from Notion (hypothesis, key questions, competitive data)
2. Build dynamic system prompt with context injection
3. Create Daily room via Daily API
4. Spawn Pipecat pipeline configured with that room + prompt
5. Return join URL for participant

For demo: Pre-create the Daily room 5 minutes before going on stage.

### POST /interview/{interview_id}/end

Manually ends interview and triggers post-processing.

Response:
{
    "status": "ended",
    "transcript_notion_url": "<https://notion.so/>...",
    "processing_status": "running"
}

### GET /interview/{interview_id}/status

Poll for interview state. Frontend polls this.

Response:
{
    "status": "waiting | active | processing | complete",
    "duration_seconds": 342
}

### GET /project/{project_id}/context

Reads research project context from Notion for the IDE panels.
This is the main READ endpoint that hydrates the entire frontend.

Response:
{
    "project": {
        "id": "...",
        "name": "...",
        "hypothesis": "...",
        "target_persona": "...",
        "key_questions": ["...", "..."],
        "status": "Researching",
        "interview_style": "Exploratory",
        "target_interviews": 5
    },
    "competitive_intel": [
        {
            "id": "...",
            "name": "Dovetail",
            "website": "...",
            "pricing": "...",
            "key_features": ["Research Repository", "Insight Tagging"],
            "recent_changes": "...",
            "user_sentiment": "Positive",
            "review_count": 234
        }
    ],
    "market_research": [
        {
            "id": "...",
            "title": "...",
            "source_name": "...",
            "source_url": "...",
            "summary": "...",
            "relevance_score": 0.87,
            "topics": ["AI in PM Tools", "Voice AI"],
            "source_type": "Article"
        }
    ],
    "interviews": [
        {
            "id": "...",
            "title": "...",
            "participant_name": "...",
            "participant_role": "...",
            "duration": 25,
            "date": "2026-02-07",
            "status": "Completed",
            "summary": "...",
            "coverage_score": 78
        }
    ],
    "quotes": [
        {
            "id": "...",
            "text": "...",
            "source_type": "Interview",
            "speaker": "...",
            "sentiment": "Negative",
            "topics": ["Onboarding", "Pricing"]
        }
    ],
    "insights": [
        {
            "id": "...",
            "insight": "Users need guided onboarding, not documentation",
            "confidence": "High",
            "confidence_score": 0.82,
            "category": "Pain Point",
            "summary": "...",
            "implications": "...",
            "status": "Validated",
            "supporting_quote_count": 5,
            "source_diversity": 3
        }
    ],
    "action_items": [
        {
            "id": "...",
            "action": "Build interactive onboarding wizard",
            "type": "Feature",
            "priority": "P0",
            "status": "Proposed"
        }
    ]
}

Implementation: Query all 7 Notion databases filtered by project_id,
shape into the response above.

### GET /project/{project_id}/analytics

Aggregated stats for the analytics panel.

Response:
{
    "total_interviews": 4,
    "total_quotes": 47,
    "total_insights": 12,
    "issues_by_priority": {"P0": 2, "P1": 5, "P2": 3, "P3": 1},
    "quotes_by_sentiment": {"Positive": 12, "Negative": 20, "Neutral": 10, "Mixed": 5},
    "top_topics": [
        {"topic": "Onboarding", "count": 15},
        {"topic": "Pricing", "count": 11}
    ],
    "insights_by_category": {"Pain Point": 5, "Need": 3, "Opportunity": 2, "Risk": 1, "Validation": 1},
    "confidence_distribution": {"High": 4, "Medium": 5, "Low": 3}
}

---

## Post-Interview Processing Pipeline

This runs when the voice agent signals interview complete.
Can be triggered by POST /interview/{id}/end or by the voice pipeline directly.

async def process_interview(transcript: str, context: InterviewContext):

    # 1. Claude extracts structured data from transcript
    extraction = await claude_extract(
        transcript=transcript,
        project_context=context,  # hypothesis, key questions, competitive intel
        targets=["summary", "quotes", "themes", "sentiment", "coverage_score"]
    )

    # 2. Write transcript to Notion
    transcript_page = notion.pages.create(
        parent={"database_id": INTERVIEW_TRANSCRIPTS_DB},
        properties={...},
        children=[...transcript blocks...]
    )
    transcript_id = transcript_page["id"]

    # 3. Write each quote to Notion
    quote_ids = []
    for quote in extraction.quotes:
        q = notion.pages.create(
            parent={"database_id": QUOTES_DB},
            properties={
                "Quote Text": ...,
                "Source Type": {"select": {"name": "Interview"}},
                "Interview Transcript": {"relation": [{"id": transcript_id}]},
                "Research Project": {"relation": [{"id": context.project_id}]},
                ...
            }
        )
        quote_ids.append(q["id"])

    # 4. (Optional) Write insights directly if Custom Agents are unreliable
    for theme in extraction.themes:
        notion.pages.create(
            parent={"database_id": INSIGHTS_DB},
            properties={
                "Insight": ...,
                "Supporting Quotes": {"relation": [{"id": q} for q in relevant_quote_ids]},
                "Research Project": {"relation": [{"id": context.project_id}]},
                ...
            }
        )

    # 5. Notion Custom Agents fire automatically on new DB entries:
    #    - Task Routing: auto-tags quotes, routes to themes
    #    - Status Update: generates synthesis report

    return {"status": "complete", "transcript_id": transcript_id}

---

## Claude Extraction Prompt (for post-processing)

System: You are a research analyst extracting structured data from a user interview transcript.
You have context about the research project including the hypothesis, key questions, and competitive landscape.

Given the transcript, extract:

1. summary: 3-5 key takeaways (string)
2. quotes: Array of notable quotes with fields:
   - text: exact quote
   - speaker: who said it
   - sentiment: Positive/Negative/Neutral/Mixed
   - topics: array from [Onboarding, Pricing, AI Quality, Workflow, Integrations, Research Synthesis, Voice/Interview, Collaboration, Data Management]
3. themes: Array of insights with fields:
   - insight: one-sentence insight statement
   - category: Pain Point/Need/Opportunity/Risk/Validation
   - confidence: High/Medium/Low
   - confidence_score: 0.0-1.0
   - supporting_evidence: which quotes support this
4. coverage_score: 0-100, what % of the key research questions were addressed

Return as JSON.

---

## Error Handling / Fallbacks

| Failure                     | Fallback                                    |
|-----------------------------|---------------------------------------------|
| Daily room creation fails   | Pre-create room for demo                    |
| Pipecat crashes mid-interview| Backup video                               |
| Notion API write fails      | Retry 3x, then log for manual recovery      |
| Custom Agent doesn't fire   | Direct Claude API call for synthesis         |
| Claude extraction fails     | Return raw transcript, skip structured data  |
| Notion rate limit (3 req/s) | Add 0.5s delay between writes               |
