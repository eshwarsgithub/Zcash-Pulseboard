from __future__ import annotations

import json
from pathlib import Path
from typing import Any, Dict, List, Optional

import polars as pl


class DataRepository:
    """Lightweight data access layer backed by sample JSON or DuckDB."""

    def __init__(
        self,
        db_path: Optional[Path] = None,
        sample_dir: Optional[Path] = None,
    ) -> None:
        root_dir = Path(__file__).resolve().parents[3]
        self._db_path = db_path or root_dir / "data" / "zcash_pulse.duckdb"
        self._sample_dir = sample_dir or root_dir / "data" / "sample"
        self._daily_metrics = self._load_daily_metrics()
        self._alerts = self._load_alerts()

    def _load_daily_metrics(self) -> pl.DataFrame:
        sample_file = self._sample_dir / "daily_metrics_sample.json"
        if not sample_file.exists():
            raise FileNotFoundError(
                f"Sample metrics file not found at {sample_file}. Add real data to continue."
            )
        with sample_file.open("r", encoding="utf-8") as handle:
            raw_data = json.load(handle)
        frame = pl.DataFrame(raw_data)
        return frame.with_columns(
            pl.col("date").str.strptime(pl.Date, format="%Y-%m-%d"),
            (pl.col("shielded_transactions") / pl.col("total_transactions")).alias(
                "shielded_tx_ratio"
            ),
            (pl.col("shielded_volume_zec")
             / (pl.col("shielded_volume_zec") + pl.col("transparent_volume_zec"))).alias(
                "shielded_volume_ratio"
            ),
        ).sort("date")

    def _load_alerts(self) -> List[Dict[str, Any]]:
        sample_file = self._sample_dir / "alerts_sample.json"
        if not sample_file.exists():
            raise FileNotFoundError(
                f"Sample alerts file not found at {sample_file}. Add real data to continue."
            )
        with sample_file.open("r", encoding="utf-8") as handle:
            return json.load(handle)

    def get_daily_metrics(self, limit: int = 30) -> pl.DataFrame:
        return self._daily_metrics.sort("date", descending=True).head(limit).sort("date")

    def get_latest_row(self) -> Dict[str, Any]:
        last_row = self._daily_metrics.sort("date", descending=True).row(0, named=True)
        return dict(last_row)

    def get_previous_row(self) -> Optional[Dict[str, Any]]:
        if self._daily_metrics.height < 2:
            return None
        row = self._daily_metrics.sort("date", descending=True).row(1, named=True)
        return dict(row)

    def get_alerts(self, limit: int = 10) -> List[Dict[str, Any]]:
        return sorted(self._alerts, key=lambda row: row["timestamp"], reverse=True)[:limit]


def get_repository() -> DataRepository:
    return DataRepository()
