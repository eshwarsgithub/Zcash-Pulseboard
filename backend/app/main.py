from __future__ import annotations

import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .api.routes import router
from .jobs.scheduler import create_scheduler

logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):  # noqa: U100
    scheduler = create_scheduler()
    logger.info("Starting APScheduler for metrics refresh")
    scheduler.start()
    try:
        yield
    finally:
        logger.info("Stopping APScheduler")
        scheduler.shutdown(wait=False)


app = FastAPI(
    title="Zcash Pulse API",
    version="0.1.0",
    docs_url="/docs",
    openapi_url="/openapi.json",
    lifespan=lifespan,
)

# Add CORS middleware for frontend
# Allow all origins for development and production flexibility
# In production, consider restricting to specific domains for security
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins - restrict in production if needed
    allow_credentials=False,  # Set to False when using allow_origins=["*"]
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router, prefix="/api", tags=["metrics"])
