import logging

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s %(name)s %(levelname)s %(message)s",
)

from config import CORS_ORIGINS
from routes.extraction import router as extraction_router
from routes.project import router as project_router
from routes.exa import router as exa_router
from routes.interview import router as interview_router

app = FastAPI(title="Prism API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(extraction_router, prefix="/api")
app.include_router(project_router, prefix="/api")
app.include_router(exa_router, prefix="/api")
app.include_router(interview_router, prefix="/api")


@app.get("/health")
async def health():
    return {"status": "ok"}


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)
