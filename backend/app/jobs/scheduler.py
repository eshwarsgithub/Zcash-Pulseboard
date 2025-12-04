from __future__ import annotations

import logging

from apscheduler.schedulers.asyncio import AsyncIOScheduler

from app.config import settings
from .tasks import refresh_metrics_snapshot

logger = logging.getLogger(__name__)


def create_scheduler() -> AsyncIOScheduler:
    """
    Create and configure the background job scheduler.

    Jobs:
    - refresh_metrics_snapshot: Fetch fresh data from APIs or samples
      Interval: Configurable via settings.refresh_interval_minutes
    """
    scheduler = AsyncIOScheduler()

    # Add metrics refresh job with configurable interval
    scheduler.add_job(
        refresh_metrics_snapshot,
        "interval",
        minutes=settings.refresh_interval_minutes,
        id="refresh-metrics-snapshot",
        replace_existing=True,
        coalesce=True,  # Skip duplicate runs if previous job is still running
    )

    logger.info(
        f"Scheduled metrics refresh every {settings.refresh_interval_minutes} minutes "
        f"(mode: {'LIVE' if settings.enable_live_data else 'SAMPLE'})"
    )

    return scheduler
