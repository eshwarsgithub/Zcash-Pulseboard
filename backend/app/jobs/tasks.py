from __future__ import annotations

import asyncio
import logging
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[3]
if str(ROOT) not in sys.path:
    sys.path.append(str(ROOT))

from data.etl.pipeline import refresh_duckdb_from_samples, refresh_from_live_sources  # noqa: E402
from app.config import settings  # noqa: E402

logger = logging.getLogger(__name__)


async def refresh_metrics_snapshot() -> Path:
    """
    Refresh the local DuckDB snapshot with latest data.

    Behavior depends on settings.enable_live_data:
    - True: Fetch from live APIs (Zchain + CoinGecko)
    - False: Load from sample JSON files (dev/testing mode)
    """
    if settings.enable_live_data:
        logger.info("Refreshing metrics from live APIs...")
        try:
            db_path = await refresh_from_live_sources()
            logger.info(f"✓ Live metrics snapshot refreshed at {db_path}")
            return db_path
        except Exception as e:
            logger.error(f"Live data refresh failed: {e}", exc_info=True)
            logger.warning("Falling back to sample data...")
            # Fall through to sample data
    else:
        logger.info("Live data disabled. Using sample data.")

    # Fallback: use sample data
    loop = asyncio.get_event_loop()
    db_path = await loop.run_in_executor(None, refresh_duckdb_from_samples)
    logger.info(f"Sample metrics snapshot refreshed at {db_path}")
    return db_path
