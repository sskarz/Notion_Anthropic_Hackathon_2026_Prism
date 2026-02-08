# Notion Database Reference — Real IDs and Schemas

All databases live under the Prism workspace page.
Parent page ID: 2fe77641-d6c8-815c-adab-e77f25e9c964

## Quick Reference — Database IDs

| Database              | Database ID                          | Data Source (Collection) ID              |
|-----------------------|--------------------------------------|------------------------------------------|
| Issues                | 37a0541c-5a3b-4103-ac9c-2ab99ce66812 | 578ede18-7e6d-4548-a5a0-9d7ec6da13f0    |
| Personas              | 8ae9dd9c-b488-4253-a8e2-1c49a14329bf | 05336641-2386-44d6-adb0-45c4e11116b7    |
| Quotes                | 036ee354-4005-4ccd-ad83-3b9a035eaa42 | 5084a27c-ae6a-406d-a1d1-85cd3de78111    |
| Competitive Landscape | 38e7bdee-9467-4370-91b9-cbf800fb9bfe | 0d8b7908-7d82-4c8c-b4e9-8090b650d0ad    |

## Agent Pipeline

Interview → **Claude Agent** (extracts personas, quotes, issues from transcript)
→ **Notion Agent** (populates DBs, adds engineer matching, graph type, triggers Exa)
→ **Exa** (competitive search → creates Competitive Landscape entries)

No full transcripts stored. Claude Agent extracts only the signal: personas, quotes, issues.

---

## 1. Issues

The core output table. Claude Agent extracts issues from interviews, Notion Agent enriches with engineer matching, graph suggestions, and Exa triggers.

Data Source ID: `578ede18-7e6d-4548-a5a0-9d7ec6da13f0`

| Property         | Type     | Values / Notes                                        |
|------------------|----------|-------------------------------------------------------|
| Issue Title      | title    | e.g., "Research data is siloed across 5+ tools"       |
| Issue Type       | select   | Pain Point / Feature Request / Workflow Gap / Unmet Need |
| Issue Details    | text     | Claude agent's extracted description                  |
| Severity         | select   | Critical / High / Medium / Low                        |
| Attachments      | files    | Screenshots, diagrams, etc.                           |
| Related Quotes   | relation | → Quotes DB (5084a27c...)                             |
| Related Persona  | relation | → Personas DB (05336641...)                           |
| Engineer Matching| text     | Notion agent enrichment — suggested eng skills/team   |
| Graph Type       | select   | Bar / Trend / Heatmap / None                          |
| Exa Trigger      | checkbox | Notion agent flags issues that should trigger competitive search |

---

## 2. Personas

User archetypes extracted from interviews by the Claude Agent.

Data Source ID: `05336641-2386-44d6-adb0-45c4e11116b7`

| Property            | Type   | Values / Notes                                     |
|---------------------|--------|----------------------------------------------------|
| Persona Type        | title  | e.g., "Growth PM at Series B SaaS"                |
| Primary Use Case    | text   | What they're trying to accomplish                  |
| Communication Style | select | Analytical / Narrative / Terse / Verbose           |
| Goals               | text   | What success looks like for them                   |
| Constraints         | text   | Budget, team size, tool lock-in, org politics      |

---

## 3. Quotes

Verbatim quotes extracted from interviews. No full transcript stored — just the signal.

Data Source ID: `5084a27c-ae6a-406d-a1d1-85cd3de78111`

| Property           | Type     | Values / Notes                                    |
|--------------------|----------|---------------------------------------------------|
| Quote Text         | title    | The verbatim quote                                |
| Speaker            | text     | Participant name or anonymized ID                 |
| Sentiment          | select   | Positive / Negative / Neutral / Frustrated        |
| Quote Type         | select   | Pain Point / Insight / Feature Request / Praise   |
| Related Issue      | relation | → Issues DB (578ede18...)                         |
| Related Persona    | relation | → Personas DB (05336641...)                       |
| Competitor Mentioned | relation | → Competitive Landscape DB (0d8b7908...)        |

---

## 4. Competitive Landscape

Populated by the Notion Agent when Issues are flagged with Exa Trigger. Empty until Exa searches fire.

Data Source ID: `0d8b7908-7d82-4c8c-b4e9-8090b650d0ad`

| Property         | Type   | Values / Notes                                      |
|------------------|--------|-----------------------------------------------------|
| Competitor Name  | title  | Company/product name                                |
| Website          | url    | Main product URL                                    |
| Key Features     | text   | What they offer                                     |
| Pricing          | text   | Pricing structure                                   |
| User Sentiment   | select | Positive / Mixed / Negative                         |

---

## Relation Map

```
Quotes ──→ Issues (Related Issue)
Quotes ──→ Personas (Related Persona)
Quotes ──→ Competitive Landscape (Competitor Mentioned)
Issues ──→ Personas (Related Persona)
Issues ──→ Quotes (Related Quotes)
Issues ──[Exa Trigger]──→ Competitive Landscape (created by Notion Agent)
```

## Agent Write Examples

### Claude Agent → Write Quote

```python
notion.create_page(
    data_source_id="5084a27c-ae6a-406d-a1d1-85cd3de78111",
    properties={
        "Quote Text": quote_text,
        "Speaker": speaker_name,
        "Sentiment": "Frustrated",
        "Quote Type": "Pain Point",
    }
)
```

### Claude Agent → Write Issue

```python
notion.create_page(
    data_source_id="578ede18-7e6d-4548-a5a0-9d7ec6da13f0",
    properties={
        "Issue Title": issue_title,
        "Issue Type": "Pain Point",
        "Issue Details": details,
        "Severity": "High",
    }
)
```

### Claude Agent → Write Persona

```python
notion.create_page(
    data_source_id="05336641-2386-44d6-adb0-45c4e11116b7",
    properties={
        "Persona Type": persona_label,
        "Primary Use Case": use_case,
        "Communication Style": "Analytical",
        "Goals": goals_text,
        "Constraints": constraints_text,
    }
)
```

### Notion Agent → Enrich Issue

```python
notion.update_page(
    page_id=issue_page_id,
    properties={
        "Engineer Matching": "Backend + ML — needs data pipeline expertise",
        "Graph Type": "Bar",
        "Exa Trigger": "__YES__",
    }
)
```

### Notion Agent → Create Competitor (from Exa)

```python
notion.create_page(
    data_source_id="0d8b7908-7d82-4c8c-b4e9-8090b650d0ad",
    properties={
        "Competitor Name": competitor_name,
        "Website": url,
        "Key Features": features_summary,
        "Pricing": pricing_info,
        "User Sentiment": "Mixed",
    }
)
```
