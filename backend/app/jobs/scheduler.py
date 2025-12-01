from __future__ import annotations

import logging

from apscheduler.schedulers.asyncio import AsyncIOScheduler

from .tasks import refresh_metrics_snapshot

logger = logging.getLogger(__name__)


def create_scheduler() -> AsyncIOScheduler:
    scheduler = AsyncIOScheduler()
    scheduler.add_job(
        refresh_metrics_snapshot,
        "interval",
        hours=1,
        id="refresh-metrics-snapshot",
        replace_existing=True,
        coalesce=True,
    )
    return scheduler
