# Notion Database Reference — Real IDs and Schemas

All databases live under the Prism workspace page.
Parent page ID: 2fe77641-d6c8-815c-adab-e77f25e9c964

## Quick Reference — Database IDs

| Database              | Database ID                          | Data Source (Collection) ID              |
|-----------------------|--------------------------------------|------------------------------------------|
| Research Projects     | bf0bcc87-f6cd-434c-b8c4-200be9e5a2b1 | ff506189-99a9-4357-92d6-836d8462b1f4    |
| Interview Transcripts | e0fdc4c5-4b83-40c8-a6b9-13b84b2b8153 | e1314969-5ddd-40c1-953c-48f13fb5d536    |
| Quotes & Evidence     | 84d88589-65b2-4497-9835-72bf4ab9857b | 7eb00b51-1529-443b-805a-a7acdafcd007    |
| Market Intelligence   | e0c128cf-0e1c-4b79-99f4-c2866fcdfb07 | abed5ac9-efa1-4b2c-9f48-12814037f31f    |
| Competitive Landscape | 38e7bdee-9467-4370-91b9-cbf800fb9bfe | 0d8b7908-7d82-4c8c-b4e9-8090b650d0ad    |
| Insights & Themes     | 527a24c2-86c0-4c2e-8077-673c587e1dd3 | ed311949-2c1e-4382-a930-f50ce78ff322    |
| Action Items/PRD Seeds| 7cfe54f6-25f7-475a-9005-ff2030c924ad | 54ad032d-ee1c-493f-8d33-a7e53692d78b    |

## Hackathon Data Strategy

PRE-POPULATED (done tonight, already seeded):

- Research Projects — hypothesis, persona, key questions
- Market Intelligence — Exa search results, articles, reports
- Competitive Landscape — competitor features, pricing, reviews
- Quotes & Evidence — sample scraped reviews from G2/Capterra/Reddit

WRITTEN LIVE DURING DEMO:

- Interview Transcripts — voice agent writes after interview ends
- Quotes & Evidence — extracted interview quotes (added to existing reviews)
- Insights & Themes — Custom Agent (Task Routing + Status Update) writes
- Action Items / PRD Seeds — Custom Agent writes

---

## 1. Research Projects

The root entity. Everything relates back here.

Database ID: bf0bcc87-f6cd-434c-b8c4-200be9e5a2b1

| Property         | Type     | Values / Notes                                        |
|------------------|----------|-------------------------------------------------------|
| Project Name     | title    | e.g., "Onboarding experience for mid-market"          |
| Status           | select   | Planning / Researching / Synthesizing / Complete       |
| Hypothesis       | text     | What we believe to be true                             |
| Target Persona   | text     | Who we're researching                                  |
| Key Questions    | text     | 3-7 must-answer questions                              |
| Interview Style  | select   | Exploratory / Validation / Usability                   |
| Target Interviews| number   | How many interviews planned                            |
| Owner            | person   | PM responsible                                         |

Relations: Other DBs point TO this one. This is the hub.

---

## 2. Interview Transcripts

Written by voice agent post-interview via Notion API.

Database ID: e0fdc4c5-4b83-40c8-a6b9-13b84b2b8153

| Property          | Type     | Values / Notes                                       |
|-------------------|----------|------------------------------------------------------|
| Title             | title    | "Interview with [Participant] — [Date]"              |
| Research Project  | relation | → Research Projects DB (ff506189...)                 |
| Participant Name  | text     | Interviewee name                                     |
| Participant Role  | text     | Job title / context                                  |
| Duration          | number   | Minutes                                              |
| Date              | date     | Interview date                                       |
| Status            | select   | Scheduled / Completed / Processing                   |
| Summary           | text     | Claude-generated 3-5 takeaways                       |
| Coverage Score    | number   | % of key questions addressed (0-100)                 |
| Quotes            | relation | → Quotes & Evidence DB (7eb00b51...)                 |

Page content: Full transcript text as the page body.

---

## 3. Quotes & Evidence

CRITICAL: Interview quotes AND scraped review quotes share this DB.
This enables cross-source synthesis (interview quote + G2 review = validated theme).

Database ID: 84d88589-65b2-4497-9835-72bf4ab9857b

| Property             | Type         | Values / Notes                                    |
|----------------------|--------------|---------------------------------------------------|
| Quote Text           | title        | The actual quote/statement                        |
| Source Type          | select       | Interview / G2 Review / Capterra Review / Reddit / Product Hunt |
| Speaker/Author       | text         | Interviewee name or reviewer identifier           |
| Sentiment            | select       | Positive / Negative / Neutral / Mixed             |
| Topics               | multi_select | Onboarding / Pricing / AI Quality / Workflow / Integrations / Research Synthesis / Voice/Interview / Collaboration / Data Management |
| Interview Transcript | relation     | → Interview Transcripts DB (e1314969...)           |
| Competitor           | relation     | → Competitive Landscape DB (0d8b7908...)           |
| Research Project     | relation     | → Research Projects DB (ff506189...)               |
| Related Themes       | relation     | → Insights & Themes DB (ed311949...)               |
| Date                 | date         | When quote was captured                            |

---

## 4. Market Intelligence

Pre-populated from Exa API searches.

Database ID: e0c128cf-0e1c-4b79-99f4-c2866fcdfb07

| Property         | Type         | Values / Notes                                     |
|------------------|--------------|----------------------------------------------------|
| Title            | title        | Article/report title                               |
| Source URL       | url          | Link to original                                   |
| Source Name      | text         | Publication name                                   |
| Summary          | text         | Claude-generated 2-3 sentence summary              |
| Relevance Score  | number       | 0-1, how relevant to research project              |
| Topics           | multi_select | AI in PM Tools / User Research Automation / Voice AI / Market Trends / Competitive Analysis / Product-Led Growth / Research Ops / Enterprise PM |
| Source Type      | select       | Article / Report / Discussion / Review / Launch    |
| Date Published   | date         | Original publication date                          |
| Research Project | relation     | → Research Projects DB (ff506189...)               |
| Related Themes   | relation     | → Insights & Themes DB (ed311949...)               |

---

## 5. Competitive Landscape

Pre-populated from BrowserBase scraping.

Database ID: 38e7bdee-9467-4370-91b9-cbf800fb9bfe

| Property         | Type         | Values / Notes                                     |
|------------------|--------------|----------------------------------------------------|
| Competitor Name  | title        | Company/product name                               |
| Website          | url          | Main product URL                                   |
| Pricing Tiers    | text         | Extracted pricing structure                        |
| Key Features     | multi_select | AI PRD Generation / User Interviews / Survey Builder / Research Repository / Insight Tagging / Video Recording / Usability Testing / Collaboration / Integrations / Analytics Dashboard / Template Library / Feedback Management |
| Recent Changes   | text         | Latest changelog entries                           |
| Last Scraped     | date         | When data was last updated                         |
| User Sentiment   | select       | Positive / Mixed / Negative                       |
| Review Count     | number       | Total reviews found                                |
| Research Project | relation     | → Research Projects DB (ff506189...)               |
| Relevant Quotes  | relation     | → Quotes & Evidence DB (7eb00b51...)               |

---

## 6. Insights & Themes

The synthesis layer. Written by Custom Agents or post-processing.

Database ID: 527a24c2-86c0-4c2e-8077-673c587e1dd3

| Property            | Type     | Values / Notes                                      |
|---------------------|----------|-----------------------------------------------------|
| Insight             | title    | e.g., "Users need guided onboarding, not docs"      |
| Research Project    | relation | → Research Projects DB (ff506189...)                |
| Confidence          | select   | High / Medium / Low                                 |
| Confidence Score    | number   | 0-1 based on evidence density + source diversity    |
| Category            | select   | Pain Point / Need / Opportunity / Risk / Validation |
| Supporting Quotes   | relation | → Quotes & Evidence DB (7eb00b51...)                |
| Supporting Articles | relation | → Market Intelligence DB (abed5ac9...)              |
| Competitor Evidence | relation | → Competitive Landscape DB (0d8b7908...)            |
| Summary             | text     | Claude-generated synthesis paragraph                |
| Implications        | text     | What this means for product decisions               |
| Status              | select   | Emerging / Validated / Actionable / Archived        |

---

## 7. Action Items / PRD Seeds

Research-grounded recommendations. Written by Custom Agent.

Database ID: 7cfe54f6-25f7-475a-9005-ff2030c924ad

| Property             | Type     | Values / Notes                                     |
|----------------------|----------|----------------------------------------------------|
| Action               | title    | What to do / build                                 |
| Research Project     | relation | → Research Projects DB (ff506189...)               |
| Type                 | select   | Feature / Improvement / Investigation / Pivot      |
| Priority             | select   | P0 / P1 / P2 / P3                                 |
| Supporting Insights  | relation | → Insights & Themes DB (ed311949...)               |
| Status               | select   | Proposed / Accepted / In Progress / Done           |
| Owner                | person   | Assigned PM/engineer                               |

---

## Relation Map (how DBs connect)

Research Projects (hub)
  ├── Interview Transcripts (→ Research Project)
  │     └── Quotes & Evidence (→ Interview Transcript)
  ├── Quotes & Evidence (→ Research Project, → Competitor, → Related Themes)
  ├── Market Intelligence (→ Research Project, → Related Themes)
  ├── Competitive Landscape (→ Research Project, → Relevant Quotes)
  ├── Insights & Themes (→ Research Project, → Supporting Quotes, → Supporting Articles, → Competitor Evidence)
  └── Action Items (→ Research Project, → Supporting Insights)
