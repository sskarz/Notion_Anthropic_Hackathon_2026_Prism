"""Minimal token server for LiveKit frontend connection."""

import os
from datetime import datetime, timezone
from pathlib import Path
from typing import Optional

from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from livekit import api
from pydantic import BaseModel

load_dotenv(os.path.join(os.path.dirname(__file__), "voice_livekit", ".env"))

SIGNUPS_DIR = Path(__file__).parent / "signups"


class SignUpRequest(BaseModel):
    name: str
    email: str
    company: str
    product_description: str
    product_link: Optional[str] = None


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.post("/api/signup")
async def signup(req: SignUpRequest):
    SIGNUPS_DIR.mkdir(exist_ok=True)
    now = datetime.now(timezone.utc)
    timestamp = now.strftime("%Y%m%d_%H%M%S")
    safe_company = req.company.replace(" ", "-").lower()
    safe_name = req.name.replace(" ", "-").lower()
    filename = f"{safe_company}_{safe_name}_{timestamp}.md"

    product_link_line = req.product_link if req.product_link else "N/A"
    content = f"""# Product Research Sign-Up

## Participant Information
- **Name:** {req.name}
- **Email:** {req.email}
- **Company:** {req.company}

## Product Details

### Product Description
{req.product_description}

### Product Link
{product_link_line}

## Metadata
- **Signed up at:** {now.isoformat()}
"""
    (SIGNUPS_DIR / filename).write_text(content)
    return {"status": "ok"}


@app.get("/api/token")
async def get_token(room: str = "prism-interview", identity: str = "user"):
    token = (
        api.AccessToken(
            os.getenv("LIVEKIT_API_KEY"),
            os.getenv("LIVEKIT_API_SECRET"),
        )
        .with_identity(identity)
        .with_name(identity)
        .with_grants(api.VideoGrants(room_join=True, room=room))
    )
    jwt = token.to_jwt()
    return {"token": jwt, "url": os.getenv("LIVEKIT_URL")}


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8080)
