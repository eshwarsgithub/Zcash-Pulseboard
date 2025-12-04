from __future__ import annotations

import asyncio
import logging
from datetime import date, timedelta
from pathlib import Path
from typing import List, Optional

import duckdb

logger = logging.getLogger(__name__)


def refresh_duckdb_from_samples(
    *,
    sample_dir: Path | None = None,
    db_path: Path | None = None,
) -> Path:
    """Load sample JSON snapshots into a DuckDB file for local experimentation."""
    root_dir = Path(__file__).resolve().parents[2]
    sample_dir = sample_dir or root_dir / "data" / "sample"
    db_path = db_path or root_dir / "data" / "zcash_pulse.duckdb"

    daily_metrics_path = sample_dir / "daily_metrics_sample.json"
    alerts_path = sample_dir / "alerts_sample.json"

    logger.info("Persisting sample data to DuckDB at %s", db_path)
    db_path.parent.mkdir(parents=True, exist_ok=True)
    with duckdb.connect(str(db_path)) as connection:
        connection.execute(
            "CREATE OR REPLACE TABLE daily_metrics AS SELECT * FROM read_json_auto(?)",
            [str(daily_metrics_path)],
        )
        connection.execute(
            "CREATE OR REPLACE TABLE alerts AS SELECT * FROM read_json_auto(?)",
            [str(alerts_path)],
        )
    return db_path


async def refresh_from_live_sources(
    *,
    dates: Optional[List[date]] = None,
    db_path: Path | None = None,
    backfill_days: int = 7,
) -> Path:
    """
    Fetch live data from Zchain + CoinGecko APIs and persist to DuckDB.

    Args:
        dates: Specific dates to fetch (defaults to today)
        db_path: Path to DuckDB file
        backfill_days: Number of historical days to backfill if database is empty

    Returns:
        Path to updated DuckDB file
    """
    # Import here to avoid circular dependencies
    import sys
    sys.path.insert(0, str(Path(__file__).resolve().parents[2] / "backend"))
    from app.config import settings

    # Import API clients
    from .sources.zchain_client import ZchainClient
    from .sources.coingecko_client import CoinGeckoClient

    root_dir = Path(__file__).resolve().parents[2]
    db_path = db_path or settings.db_path
    db_path.parent.mkdir(parents=True, exist_ok=True)

    logger.info(f"Starting live data refresh to {db_path}")

    # Initialize API clients
    async with ZchainClient(base_url=settings.zchain_api_url) as zchain, \
               CoinGeckoClient(base_url=settings.coingecko_api_url, api_key=settings.coingecko_api_key) as coingecko:

        # Test connections
        zchain_ok = await zchain.test_connection()
        coingecko_ok = await coingecko.test_connection()

        if not zchain_ok:
            logger.error("Zchain API connection failed!")
            logger.warning("Falling back to sample data...")
            return refresh_duckdb_from_samples(db_path=db_path)

        if not coingecko_ok:
            logger.warning("CoinGecko API connection failed - price data unavailable")

        # Determine which dates to fetch
        if dates is None:
            # Check if database is empty
            conn = duckdb.connect(str(db_path))
            try:
                result = conn.execute(
                    "SELECT MAX(date) as max_date, COUNT(*) as count FROM daily_metrics"
                ).fetchone()
                max_date_str, count = result if result else (None, 0)

                if count == 0:
                    # Empty database - backfill last N days
                    logger.info(f"Empty database detected. Backfilling {backfill_days} days...")
                    dates = [(date.today() - timedelta(days=i)) for i in range(backfill_days, -1, -1)]
                else:
                    # Update today only
                    dates = [date.today()]
                    logger.info(f"Updating metrics for today: {dates[0]}")
            finally:
                conn.close()

        # Ensure daily_metrics table exists
        _ensure_tables_exist(db_path)

        # Fetch data for each date
        success_count = 0
        for target_date in dates:
            try:
                logger.info(f"Fetching data for {target_date}...")

                # Fetch blockchain metrics
                metrics_data = await zchain.calculate_daily_metrics(target_date)

                # Fetch price data
                if coingecko_ok:
                    price_data = await coingecko.fetch_price_for_date(target_date)
                    metrics_data.update({
                        "zec_price_usd": price_data.get("price_usd", None),
                        "market_cap_usd": price_data.get("market_cap_usd", None),
                        "trading_volume_usd": price_data.get("trading_volume_usd", None),
                    })

                # Insert/update in DuckDB
                _upsert_daily_metric(db_path, metrics_data)
                success_count += 1
                logger.info(f"✓ Successfully updated metrics for {target_date}")

            except Exception as e:
                logger.error(f"Failed to fetch data for {target_date}: {e}", exc_info=True)

        logger.info(f"Live data refresh complete. {success_count}/{len(dates)} dates updated successfully.")

        # Generate anomaly-based alerts
        if settings.enable_anomaly_detection:
            logger.info("Running anomaly detection...")
            try:
                from .transformers.alert_generator import AnomalyDetector, persist_alerts
                from app.services.notification_service import send_alerts_if_configured
                import polars as pl

                # Load all metrics from database
                conn = duckdb.connect(str(db_path))
                metrics_df = conn.execute("SELECT * FROM daily_metrics ORDER BY date").pl()
                conn.close()

                # Detect anomalies and generate alerts
                detector = AnomalyDetector(threshold=settings.anomaly_zscore_threshold)
                alerts = detector.generate_alerts(metrics_df)

                if alerts:
                    # Persist to database
                    persist_alerts(db_path, alerts)

                    # Send notifications
                    await send_alerts_if_configured(alerts)

                    logger.info(f"✓ Generated and persisted {len(alerts)} alerts")
                else:
                    logger.info("No anomalies detected")

            except Exception as e:
                logger.error(f"Anomaly detection failed: {e}", exc_info=True)

    return db_path


def _ensure_tables_exist(db_path: Path):
    """Create database tables if they don't exist."""
    conn = duckdb.connect(str(db_path))
    try:
        # Create daily_metrics table
        conn.execute("""
            CREATE TABLE IF NOT EXISTS daily_metrics (
                date DATE PRIMARY KEY,
                total_transactions INTEGER,
                shielded_transactions INTEGER,
                transparent_transactions INTEGER,
                shielded_volume_zec DOUBLE,
                transparent_volume_zec DOUBLE,
                avg_fee_zec DOUBLE,
                median_fee_zec DOUBLE,
                avg_block_time_seconds DOUBLE,
                active_addresses INTEGER,
                zec_price_usd DOUBLE,
                market_cap_usd BIGINT,
                trading_volume_usd BIGINT
            )
        """)

        # Create alerts table
        conn.execute("""
            CREATE TABLE IF NOT EXISTS alerts (
                id VARCHAR PRIMARY KEY,
                timestamp TIMESTAMP,
                type VARCHAR,
                severity VARCHAR,
                metric VARCHAR,
                current_value DOUBLE,
                baseline_value DOUBLE,
                delta_percent DOUBLE,
                summary VARCHAR,
                explanation VARCHAR
            )
        """)

        logger.debug("Database tables ensured")
    finally:
        conn.close()


def _upsert_daily_metric(db_path: Path, metrics_data: dict):
    """Insert or update a single day's metrics in DuckDB."""
    conn = duckdb.connect(str(db_path))
    try:
        # Use INSERT OR REPLACE (upsert)
        conn.execute("""
            INSERT OR REPLACE INTO daily_metrics (
                date, total_transactions, shielded_transactions, transparent_transactions,
                shielded_volume_zec, transparent_volume_zec, avg_fee_zec, median_fee_zec,
                avg_block_time_seconds, active_addresses, zec_price_usd, market_cap_usd, trading_volume_usd
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, [
            metrics_data.get("date"),
            metrics_data.get("total_transactions", 0),
            metrics_data.get("shielded_transactions", 0),
            metrics_data.get("transparent_transactions", 0),
            metrics_data.get("shielded_volume_zec", 0.0),
            metrics_data.get("transparent_volume_zec", 0.0),
            metrics_data.get("avg_fee_zec", 0.0),
            metrics_data.get("median_fee_zec", 0.0),
            metrics_data.get("avg_block_time_seconds", 75.0),
            metrics_data.get("active_addresses", 0),
            metrics_data.get("zec_price_usd"),
            metrics_data.get("market_cap_usd"),
            metrics_data.get("trading_volume_usd"),
        ])
    finally:
        conn.close()
