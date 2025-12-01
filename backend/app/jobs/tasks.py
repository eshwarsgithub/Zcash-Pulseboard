from __future__ import annotations

import asyncio
import logging
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[3]
if str(ROOT) not in sys.path:
    sys.path.append(str(ROOT))

from data.etl.pipeline import refresh_duckdb_from_samples  # noqa: E402

logger = logging.getLogger(__name__)


async def refresh_metrics_snapshot() -> Path:
    """Rebuild the local DuckDB snapshot using bundled sample data."""
    loop = asyncio.get_event_loop()
    db_path = await loop.run_in_executor(None, refresh_duckdb_from_samples)
    logger.info("Sample metrics snapshot refreshed at %s", db_path)
    return db_path
