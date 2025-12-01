from __future__ import annotations

import logging
from pathlib import Path

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
