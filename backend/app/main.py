from __future__ import annotations

import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI

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
app.include_router(router, prefix="/api", tags=["metrics"])
