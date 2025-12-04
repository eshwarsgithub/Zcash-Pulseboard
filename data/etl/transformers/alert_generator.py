"""Anomaly detection and alert generation using statistical methods."""

from __future__ import annotations

import logging
from datetime import datetime, timedelta
from typing import List, Tuple
from uuid import uuid4

import polars as pl

logger = logging.getLogger(__name__)


class AnomalyDetector:
    """
    Statistical anomaly detection using z-scores.

    Detects outliers by calculating how many standard deviations
    a value is from the mean.
    """

    def __init__(self, threshold: float = 2.5):
        """
        Initialize detector.

        Args:
            threshold: Z-score threshold (default 2.5σ = ~99% confidence)
        """
        self.threshold = threshold

    def detect_anomalies(
        self,
        series: pl.Series,
        metric_name: str
    ) -> List[Tuple[int, float, float]]:
        """
        Detect anomalies in a time series using z-scores.

        Args:
            series: Polars Series of metric values
            metric_name: Name of metric (for logging)

        Returns:
            List of (index, value, z_score) tuples for anomalies
        """
        if len(series) < 3:
            logger.warning(f"Not enough data to detect anomalies in {metric_name}")
            return []

        # Calculate mean and standard deviation
        mean = series.mean()
        std = series.std()

        if std == 0 or std is None:
            logger.warning(f"Zero std dev for {metric_name} - cannot detect anomalies")
            return []

        # Calculate z-scores
        z_scores = (series - mean) / std

        # Find values beyond threshold
        anomalies = []
        for idx, (value, z_score) in enumerate(zip(series, z_scores)):
            if abs(z_score) > self.threshold:
                anomalies.append((idx, value, z_score))
                logger.info(
                    f"Anomaly detected in {metric_name}: "
                    f"value={value:.2f}, z-score={z_score:.2f}σ"
                )

        return anomalies

    def generate_alerts(
        self,
        daily_metrics: pl.DataFrame,
        baseline_days: int = 30
    ) -> List[dict]:
        """
        Generate alert objects for detected anomalies.

        Checks latest day against baseline of previous days.

        Args:
            daily_metrics: DataFrame with daily metrics (sorted by date)
            baseline_days: Number of days to use as baseline

        Returns:
            List of alert dicts ready for insertion into alerts table
        """
        if len(daily_metrics) < 2:
            logger.warning("Not enough data to generate alerts")
            return []

        # Get latest row
        latest = daily_metrics.row(-1, named=True)
        latest_date = latest["date"]

        # Get baseline (all rows except latest)
        baseline = daily_metrics[:-1].tail(baseline_days)

        if len(baseline) == 0:
            logger.warning("No baseline data available")
            return []

        alerts = []

        # Check key metrics for anomalies
        metrics_to_check = [
            ("total_transactions", "transactions", True, 2.0, 2.5),
            ("shielded_volume_zec", "shielded_volume", True, 2.5, 3.0),
            ("avg_fee_zec", "fees", False, 2.0, 2.5),
            ("active_addresses", "addresses", True, 2.0, 2.5),
        ]

        for column, metric_type, higher_is_better, warning_threshold, critical_threshold in metrics_to_check:
            if column not in baseline.columns:
                continue

            baseline_series = baseline[column]
            current_value = latest[column]

            # Calculate baseline statistics
            baseline_mean = baseline_series.mean()
            baseline_std = baseline_series.std()

            if baseline_std == 0 or baseline_std is None:
                continue

            # Calculate z-score for current value
            z_score = (current_value - baseline_mean) / baseline_std

            # Determine severity based on thresholds and direction
            severity = None
            if abs(z_score) > critical_threshold:
                severity = "high"
            elif abs(z_score) > warning_threshold:
                severity = "medium"

            if severity is None:
                continue  # No anomaly

            # Determine if this is good or bad
            is_spike = z_score > 0
            is_problem = (is_spike and not higher_is_better) or (not is_spike and higher_is_better)

            # Adjust severity: only high severity for problems
            if not is_problem and severity == "high":
                severity = "medium"

            # Calculate percent change
            delta_percent = ((current_value - baseline_mean) / baseline_mean) * 100 if baseline_mean != 0 else 0

            # Generate alert summary and explanation
            direction = "spike" if is_spike else "drop"
            summary = self._generate_summary(metric_type, direction, abs(delta_percent), severity)
            explanation = self._generate_explanation(metric_type, direction, z_score, is_problem)

            alert = {
                "id": f"alert-{uuid4().hex[:12]}",
                "timestamp": datetime.now().isoformat(),
                "type": f"{metric_type}_{direction}",
                "severity": severity,
                "metric": column,
                "current_value": float(current_value),
                "baseline_value": float(baseline_mean),
                "delta_percent": float(delta_percent),
                "summary": summary,
                "explanation": explanation,
            }

            alerts.append(alert)
            logger.info(f"Generated {severity} alert: {summary}")

        return alerts

    def _generate_summary(self, metric_type: str, direction: str, pct_change: float, severity: str) -> str:
        """Generate human-readable alert summary."""
        icon = "🔴" if severity == "high" else "🟡" if severity == "medium" else "🟢"

        if direction == "spike":
            return f"{icon} {metric_type.title()} spiked {pct_change:.1f}% above normal"
        else:
            return f"{icon} {metric_type.title()} dropped {pct_change:.1f}% below normal"

    def _generate_explanation(self, metric_type: str, direction: str, z_score: float, is_problem: bool) -> str:
        """Generate technical explanation of the anomaly."""
        explanation = f"Statistical anomaly detected: {abs(z_score):.2f} standard deviations from baseline. "

        if metric_type == "transactions":
            if direction == "spike":
                explanation += "Unusual surge in network activity. Possible causes: exchange activity, airdrop, or network event."
            else:
                explanation += "Network activity below normal. Monitor for continued decline."
        elif metric_type == "shielded_volume":
            if direction == "spike":
                explanation += "Major increase in shielded transactions. Privacy adoption may be accelerating."
            else:
                explanation += "Shielded volume decreased. Transparent transactions dominating."
        elif metric_type == "fees":
            if direction == "spike":
                explanation += "Fee pressure increasing. Possible mempool congestion or block size constraints."
            else:
                explanation += "Fees unusually low. Network utilization may be decreasing."
        elif metric_type == "addresses":
            if direction == "spike":
                explanation += "Significant increase in unique active addresses. Growing network participation."
            else:
                explanation += "Fewer active addresses than normal. User engagement declining."

        if is_problem:
            explanation += " **Action recommended**: Monitor trend."

        return explanation


def persist_alerts(db_path, alerts: List[dict]):
    """
    Persist generated alerts to DuckDB.

    Args:
        db_path: Path to DuckDB file
        alerts: List of alert dictionaries
    """
    if not alerts:
        logger.info("No alerts to persist")
        return

    import duckdb

    conn = duckdb.connect(str(db_path))
    try:
        # Create alerts table if it doesn't exist
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

        # Insert alerts (skip duplicates)
        for alert in alerts:
            conn.execute("""
                INSERT OR IGNORE INTO alerts
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, [
                alert["id"],
                alert["timestamp"],
                alert["type"],
                alert["severity"],
                alert["metric"],
                alert["current_value"],
                alert["baseline_value"],
                alert["delta_percent"],
                alert["summary"],
                alert["explanation"],
            ])

        logger.info(f"Persisted {len(alerts)} alerts to database")
    finally:
        conn.close()
