import os

from dotenv import load_dotenv

load_dotenv(os.path.join(os.path.dirname(__file__), ".env"))
load_dotenv(os.path.join(os.path.dirname(__file__), "voice_livekit", ".env"))

# Support both new and old env var names for backward compatibility
NOTION_TOKEN: str = os.environ.get(
    "NOTION_INTERNAL_INTEGRATION_SECRET"
) or os.environ.get("NOTION_TOKEN", "")

if not NOTION_TOKEN:
    raise ValueError(
        "NOTION_INTERNAL_INTEGRATION_SECRET or NOTION_TOKEN must be set"
    )

DATABASE_IDS = {
    "issues": "37a0541c-5a3b-4103-ac9c-2ab99ce66812",
    "personas": "8ae9dd9c-b488-4253-a8e2-1c49a14329bf",
    "quotes": "036ee354-4005-4ccd-ad83-3b9a035eaa42",
    "competitors": "38e7bdee-9467-4370-91b9-cbf800fb9bfe",
    "extractions": "30177641d6c88068968ce6e77f06bb84",
}

CORS_ORIGINS = ["http://localhost:5173"]
