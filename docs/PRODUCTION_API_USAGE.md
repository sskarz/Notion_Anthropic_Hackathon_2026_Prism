# Production API Usage Guide

This guide explains how to call the Prism API in production to read from and write to Notion databases.

## Server Setup

### Starting the Server

```bash
cd backend
uvicorn main:app --host 0.0.0.0 --port 8000
```

Or for production with multiple workers:
```bash
uvicorn main:app --host 0.0.0.0 --port 8000 --workers 4
```

### Environment Variables

Ensure your `.env` file in the `backend` directory contains:
```
NOTION_INTERNAL_INTEGRATION_SECRET=your_secret_here
```

---

## API Endpoints

Base URL: `http://your-server:8000` (or `https://your-domain.com` in production)

### 1. Health Check

**GET** `/health`

Check if the API is running.

**Example:**
```bash
curl http://localhost:8000/health
```

**Response:**
```json
{
  "status": "ok"
}
```

---

### 2. Write to Notion (Create Personas, Quotes, Issues)

**POST** `/api/extraction`

Writes extracted data to Notion databases. Creates personas first, then quotes (linked to personas), then issues (linked to personas and quotes).

**Request Body:**
```json
{
  "personas": [
    {
      "persona_type": "Growth PM at Series B SaaS",
      "primary_use_case": "Evaluating onboarding tools",
      "communication_style": "Analytical",
      "goals": "Reduce time-to-value below 10 minutes",
      "constraints": "Small team, limited engineering"
    }
  ],
  "quotes": [
    {
      "quote_text": "We stopped sending 30-page PDFs because no one reads them.",
      "speaker": "Sarah Chen, CS Lead at FinEdge",
      "sentiment": "Positive",
      "quote_type": "Insight",
      "temp_persona_index": 0,
      "competitor_mentioned_id": null
    }
  ],
  "issues": [
    {
      "issue_title": "Mid-market teams need progressive onboarding",
      "issue_type": "Pain Point",
      "issue_details": "Teams consistently reject documentation dumps in favor of interactive experiences.",
      "severity": "Critical",
      "temp_persona_index": 0,
      "temp_quote_indices": [0]
    }
  ]
}
```

**Field Validations:**
- `communication_style`: "Analytical" | "Narrative" | "Terse" | "Verbose"
- `sentiment`: "Positive" | "Negative" | "Neutral" | "Frustrated"
- `quote_type`: "Pain Point" | "Insight" | "Feature Request" | "Praise"
- `issue_type`: "Pain Point" | "Feature Request" | "Workflow Gap" | "Unmet Need"
- `severity`: "Critical" | "High" | "Medium" | "Low"

**Index References:**
- `temp_persona_index`: References a persona by its index in the `personas` array (0-based)
- `temp_quote_indices`: Array of indices referencing quotes in the `quotes` array
- These are resolved to actual Notion page IDs when creating the entries

**Example with cURL:**
```bash
curl -X POST http://localhost:8000/api/extraction \
  -H "Content-Type: application/json" \
  -d '{
    "personas": [
      {
        "persona_type": "Test Persona",
        "primary_use_case": "Testing API",
        "communication_style": "Analytical",
        "goals": "Test goals",
        "constraints": "Test constraints"
      }
    ],
    "quotes": [],
    "issues": []
  }'
```

**Example with Python:**
```python
import requests

url = "http://localhost:8000/api/extraction"
payload = {
    "personas": [
        {
            "persona_type": "Growth PM at Series B SaaS",
            "primary_use_case": "Evaluating onboarding tools",
            "communication_style": "Analytical",
            "goals": "Reduce time-to-value below 10 minutes",
            "constraints": "Small team, limited engineering"
        }
    ],
    "quotes": [
        {
            "quote_text": "We stopped sending 30-page PDFs...",
            "speaker": "Sarah Chen, CS Lead at FinEdge",
            "sentiment": "Positive",
            "quote_type": "Insight",
            "temp_persona_index": 0,
            "competitor_mentioned_id": None
        }
    ],
    "issues": [
        {
            "issue_title": "Mid-market teams need progressive onboarding",
            "issue_type": "Pain Point",
            "issue_details": "Teams consistently reject documentation dumps...",
            "severity": "Critical",
            "temp_persona_index": 0,
            "temp_quote_indices": [0]
        }
    ]
}

response = requests.post(url, json=payload)
print(response.json())
# Output: {"personas_created": 1, "quotes_created": 1, "issues_created": 1}
```

**Response:**
```json
{
  "personas_created": 1,
  "quotes_created": 1,
  "issues_created": 1
}
```

---

### 3. Read from Notion (Get All Data)

**GET** `/api/project/context`

Returns all data from all 4 Notion databases (Issues, Personas, Quotes, Competitors).

**Example with cURL:**
```bash
curl http://localhost:8000/api/project/context
```

**Example with Python:**
```python
import requests

response = requests.get("http://localhost:8000/api/project/context")
data = response.json()

print(f"Found {len(data['issues'])} issues")
print(f"Found {len(data['personas'])} personas")
print(f"Found {len(data['quotes'])} quotes")
print(f"Found {len(data['competitors'])} competitors")
```

**Response:**
```json
{
  "issues": [
    {
      "id": "notion-page-id",
      "created_time": "2026-02-07T10:00:00Z",
      "issue_title": "Mid-market teams need progressive onboarding",
      "issue_type": "Pain Point",
      "issue_details": "...",
      "severity": "Critical",
      "related_persona_id": "notion-page-id-or-null",
      "related_quote_ids": ["notion-page-id"],
      "engineer_matching": "Frontend + UX",
      "graph_type": "Bar",
      "exa_trigger": true
    }
  ],
  "personas": [...],
  "quotes": [...],
  "competitors": [...]
}
```

---

### 4. Get Analytics

**GET** `/api/project/analytics`

Returns aggregated statistics about the data in Notion.

**Example:**
```bash
curl http://localhost:8000/api/project/analytics
```

**Response:**
```json
{
  "total_issues": 5,
  "total_quotes": 8,
  "total_personas": 3,
  "total_competitors": 4,
  "issues_by_severity": {"Critical": 2, "High": 2, "Medium": 1},
  "issues_by_type": {"Pain Point": 1, "Feature Request": 1, "Unmet Need": 2, "Workflow Gap": 1},
  "quotes_by_sentiment": {"Positive": 4, "Neutral": 2, "Frustrated": 2}
}
```

---

## Production Considerations

### 1. CORS Configuration

Currently, CORS is configured for `localhost:5173` (frontend). For production:

Update `backend/config.py`:
```python
CORS_ORIGINS = [
    "http://localhost:5173",  # Development
    "https://your-production-domain.com",  # Production
]
```

### 2. Authentication

Currently, the API has no authentication. For production, consider adding:
- API keys
- JWT tokens
- OAuth2

Example with API key middleware:
```python
from fastapi import Header, HTTPException

API_KEY = "your-secret-api-key"

@app.middleware("http")
async def verify_api_key(request: Request, call_next):
    if request.url.path.startswith("/api/"):
        api_key = request.headers.get("X-API-Key")
        if api_key != API_KEY:
            raise HTTPException(status_code=401, detail="Invalid API key")
    return await call_next(request)
```

### 3. Rate Limiting

Notion API has a rate limit of 3 requests/second. The backend already includes a 0.35s delay between writes. For production, consider:
- Adding rate limiting middleware
- Using a queue system for high-volume writes
- Implementing retry logic with exponential backoff

### 4. Error Handling

The API returns:
- `200`: Success
- `422`: Validation error (invalid payload)
- `500`: Server error (Notion API failure, etc.)

Always check the response status:
```python
response = requests.post(url, json=payload)
if response.status_code == 200:
    print("Success:", response.json())
else:
    print("Error:", response.status_code, response.text)
```

### 5. Deployment

**Docker Example:**
```dockerfile
FROM python:3.12-slim
WORKDIR /app
COPY backend/requirements.txt .
RUN pip install -r requirements.txt
COPY backend/ .
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

**Environment Variables in Production:**
- Use environment variables or secrets management (AWS Secrets Manager, etc.)
- Never commit `.env` files to version control
- Rotate `NOTION_INTERNAL_INTEGRATION_SECRET` regularly

---

## Complete Example: Full Workflow

```python
import requests

BASE_URL = "http://localhost:8000"  # or your production URL

# 1. Check health
health = requests.get(f"{BASE_URL}/health")
print("Health:", health.json())

# 2. Write data to Notion
extraction_payload = {
    "personas": [
        {
            "persona_type": "Product Manager",
            "primary_use_case": "User research",
            "communication_style": "Analytical",
            "goals": "Understand user needs",
            "constraints": "Limited time"
        }
    ],
    "quotes": [
        {
            "quote_text": "This tool saves me hours every week",
            "speaker": "John Doe",
            "sentiment": "Positive",
            "quote_type": "Praise",
            "temp_persona_index": 0,
            "competitor_mentioned_id": None
        }
    ],
    "issues": [
        {
            "issue_title": "Need better search functionality",
            "issue_type": "Feature Request",
            "issue_details": "Users struggle to find relevant data",
            "severity": "High",
            "temp_persona_index": 0,
            "temp_quote_indices": [0]
        }
    ]
}

write_response = requests.post(
    f"{BASE_URL}/api/extraction",
    json=extraction_payload
)
print("Write result:", write_response.json())

# 3. Read data back
context = requests.get(f"{BASE_URL}/api/project/context")
data = context.json()
print(f"Total issues: {len(data['issues'])}")

# 4. Get analytics
analytics = requests.get(f"{BASE_URL}/api/project/analytics")
print("Analytics:", analytics.json())
```

---

## Troubleshooting

### 404 Errors
- Check that databases are shared with your Notion integration
- Verify database IDs in `backend/config.py`

### 401/403 Errors
- Verify `NOTION_INTERNAL_INTEGRATION_SECRET` is correct
- Ensure integration has proper permissions in Notion

### 500 Errors
- Check server logs
- Verify Notion API is accessible
- Check rate limiting (3 req/sec)

### Validation Errors (422)
- Ensure all required fields are present
- Check that enum values match exactly (case-sensitive)
- Verify data types match the schema

