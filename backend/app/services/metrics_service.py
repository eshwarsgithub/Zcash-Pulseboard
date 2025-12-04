from __future__ import annotations

from typing import List, Optional

from ..db.client import DataRepository, get_repository
from ..models.metrics import (
    Alert,
    AlertFeed,
    DailyMetric,
    ExportFormat,
    KPICard,
    MetadataResponse,
    MetricsPayload,
    MetricsSummary,
    MomentumResponse,
    NetworkHealthDetailed,
    PoolAdoptionTrend,
    PoolMigrationResponse,
    PrivacyMetricsResponse,
    PrivacyTrend,
)
from .insights_service import InsightBuilder


class MetricsService:
    def __init__(self, repository: Optional[DataRepository] = None) -> None:
        self._repository = repository or get_repository()
        self._insights = InsightBuilder()

    def get_daily_metrics(self, limit: int = 30) -> MetricsPayload:
        frame = self._repository.get_daily_metrics(limit)
        metrics = [DailyMetric.model_validate(row) for row in frame.to_dicts()]
        return MetricsPayload(data=metrics)

    def get_kpis(self) -> List[KPICard]:
        latest = self._repository.get_latest_row()
        previous = self._repository.get_previous_row()
        cards: List[KPICard] = []
        cards.append(
            KPICard(
                name="Total Transactions",
                value=latest["total_transactions"],
                unit="tx",
                delta_percent=self._pct_change(latest, previous, "total_transactions"),
                trend=self._trend(latest, previous, "total_transactions"),
                insight=self._insights.describe_tx_change(latest, previous),
                status=self._classify_total_tx(latest, previous),
            )
        )
        cards.append(
            KPICard(
                name="Shielded Share",
                value=round(latest["shielded_tx_ratio"] * 100, 2),
                unit="%",
                delta_percent=self._pct_change(
                    latest,
                    previous,
                    "shielded_tx_ratio",
                    scale=100,
                    mode="absolute",
                ),
                trend=self._trend(latest, previous, "shielded_tx_ratio"),
                insight=self._insights.describe_shielded_share(latest, previous),
                status=self._classify_shielded_share(latest),
            )
        )
        cards.append(
            KPICard(
                name="Average Fee",
                value=latest["avg_fee_zec"],
                unit="ZEC",
                delta_percent=self._pct_change(latest, previous, "avg_fee_zec"),
                trend=self._trend(latest, previous, "avg_fee_zec"),
                insight=self._insights.describe_fee_change(latest, previous),
                status=self._classify_fee(latest),
            )
        )
        cards.append(
            KPICard(
                name="Active Addresses",
                value=latest["active_addresses"],
                unit="addresses",
                delta_percent=self._pct_change(latest, previous, "active_addresses"),
                trend=self._trend(latest, previous, "active_addresses"),
                insight=self._insights.describe_address_change(latest, previous),
                status=self._classify_addresses(latest, previous),
            )
        )
        return cards

    def get_alerts(self, limit: int = 10) -> AlertFeed:
        alerts = [Alert.model_validate(alert) for alert in self._repository.get_alerts(limit)]
        return AlertFeed(alerts=alerts)

    def get_summary(self) -> MetricsSummary:
        frame = self._repository.get_daily_metrics(limit=30)
        ordered = frame.sort("date")
        latest_row = ordered.tail(1).row(0, named=True)
        window = ordered.tail(7)
        total_avg = float(window["total_transactions"].mean())
        shielded_avg = float(window["shielded_tx_ratio"].mean())
        fee_avg = float(window["avg_fee_zec"].mean())
        address_avg = float(window["active_addresses"].mean())

        throughput_health = self._compare_to_baseline(
            latest_row["total_transactions"], total_avg, higher_is_better=True
        )
        privacy_health = self._compare_to_baseline(
            latest_row["shielded_tx_ratio"], shielded_avg, higher_is_better=True, warning=0.05, critical=0.1
        )
        cost_health = self._compare_to_baseline(
            latest_row["avg_fee_zec"], fee_avg, higher_is_better=False, warning=0.15, critical=0.3
        )
        participation_health = self._compare_to_baseline(
            latest_row["active_addresses"], address_avg, higher_is_better=True
        )

        return MetricsSummary(
            latest_date=latest_row["date"],
            total_transactions_7d_avg=round(total_avg, 2),
            shielded_tx_ratio_7d_avg=round(shielded_avg, 4),
            avg_fee_7d_avg=round(fee_avg, 6),
            active_addresses_7d_avg=round(address_avg, 2),
            health={
                "throughput": throughput_health,
                "privacy": privacy_health,
                "cost": cost_health,
                "participation": participation_health,
            },
        )

    @staticmethod
    def _pct_change(
        current_row: dict,
        previous_row: Optional[dict],
        key: str,
        scale: float = 1.0,
        mode: str = "relative",
    ) -> Optional[float]:
        if previous_row is None:
            return None
        prev_value = previous_row.get(key)
        if prev_value in (None, 0):
            return None
        current_value = current_row.get(key)
        if current_value is None:
            return None
        if mode == "absolute":
            change = (current_value - prev_value) * scale
        else:
            change = ((current_value - prev_value) / prev_value) * 100
        return round(change, 2)

    @staticmethod
    def _trend(current_row: dict, previous_row: Optional[dict], key: str) -> Optional[str]:
        if previous_row is None:
            return None
        prev_value = previous_row.get(key)
        current_value = current_row.get(key)
        if prev_value is None or current_value is None:
            return None
        if current_value > prev_value:
            return "up"
        if current_value < prev_value:
            return "down"
        return "flat"

    @staticmethod
    def _classify_total_tx(current_row: dict, previous_row: Optional[dict]) -> str:
        change = MetricsService._pct_change(current_row, previous_row, "total_transactions")
        if change is None or change >= -5:
            return "good"
        if change <= -15:
            return "critical"
        return "warning"

    @staticmethod
    def _classify_shielded_share(current_row: dict) -> str:
        share = current_row.get("shielded_tx_ratio") or 0
        if share >= 0.35:
            return "good"
        if share <= 0.2:
            return "critical"
        return "warning"

    @staticmethod
    def _classify_fee(current_row: dict) -> str:
        fee = current_row.get("avg_fee_zec") or 0
        if fee <= 0.00025:
            return "good"
        if fee >= 0.0004:
            return "critical"
        return "warning"

    @staticmethod
    def _classify_addresses(current_row: dict, previous_row: Optional[dict]) -> str:
        change = MetricsService._pct_change(current_row, previous_row, "active_addresses")
        if change is None or change >= -5:
            return "good"
        if change <= -20:
            return "critical"
        return "warning"

    @staticmethod
    def _compare_to_baseline(
        value: float,
        baseline: float,
        *,
        higher_is_better: bool,
        warning: float = 0.1,
        critical: float = 0.2,
    ) -> str:
        if baseline == 0:
            return "good"
        delta = (value - baseline) / baseline
        if higher_is_better:
            if delta >= warning:
                return "good"
            if delta <= -critical:
                return "critical"
            if delta <= -warning:
                return "warning"
            return "good"
        # Lower is better (e.g., fees)
        if delta <= -warning:
            return "good"
        if delta >= critical:
            return "critical"
        if delta >= warning:
            return "warning"
        return "good"

    def get_privacy_metrics(self, days: int = 30) -> PrivacyMetricsResponse:
        """Calculate privacy-focused metrics from existing data."""
        frame = self._repository.get_daily_metrics(days)
        trends = []

        for row in frame.to_dicts():
            # Privacy score: weighted average (tx ratio 60%, volume ratio 40%)
            score = (row['shielded_tx_ratio'] * 0.6 +
                     row['shielded_volume_ratio'] * 0.4) * 100
            trends.append(PrivacyTrend(
                date=row['date'],
                shielded_tx_pct=round(row['shielded_tx_ratio'] * 100, 2),
                shielded_volume_pct=round(row['shielded_volume_ratio'] * 100, 2),
                privacy_score=round(score, 2)
            ))

        latest = trends[-1].privacy_score
        avg_7d = sum(t.privacy_score for t in trends[-7:]) / 7
        grade = self._calculate_privacy_grade(avg_7d)

        return PrivacyMetricsResponse(
            trends=trends,
            latest_score=latest,
            avg_7d_score=round(avg_7d, 2),
            privacy_grade=grade
        )

    @staticmethod
    def _calculate_privacy_grade(score: float) -> str:
        """Convert privacy score to letter grade."""
        if score >= 45:
            return "Excellent"
        if score >= 35:
            return "Good"
        if score >= 25:
            return "Fair"
        return "Poor"

    def get_network_health_detailed(self) -> NetworkHealthDetailed:
        """Enhanced health score with component breakdown."""
        summary = self.get_summary()

        # Convert health status to scores
        score_map = {"good": 100, "warning": 60, "critical": 20}
        scores = {k: score_map[v] for k, v in summary.health.items()}
        overall = sum(scores.values()) // len(scores)

        # Calculate grade
        if overall >= 95:
            grade = "A+"
        elif overall >= 85:
            grade = "A"
        elif overall >= 70:
            grade = "B"
        elif overall >= 50:
            grade = "C"
        elif overall >= 30:
            grade = "D"
        else:
            grade = "F"

        # Identify issues
        issues = [f"{k.title()} needs attention"
                  for k, v in summary.health.items() if v != "good"]

        # Calculate trend (simplified: stable for now)
        trend = "stable"

        return NetworkHealthDetailed(
            overall_score=overall,
            component_scores=scores,
            grade=grade,
            trend=trend,
            issues=issues
        )

    def get_momentum(self) -> MomentumResponse:
        """Calculate Shielded Pool Momentum Index."""
        frame = self._repository.get_daily_metrics(limit=30)

        # Calculate 7-day momentum
        recent_7d = frame.tail(7)
        momentum_7d = self._calculate_momentum_score(recent_7d)

        # Calculate 30-day momentum
        momentum_30d = self._calculate_momentum_score(frame)

        # Determine trend
        if momentum_7d > momentum_30d + 5:
            trend = "up"
        elif momentum_7d < momentum_30d - 5:
            trend = "down"
        else:
            trend = "stable"

        # Interpretation
        if momentum_7d > 20:
            interpretation = "Strong pro-privacy trend! Shielded usage is growing faster than transparent."
        elif momentum_7d > 0:
            interpretation = "Positive momentum. Shielded usage is growing relative to transparent."
        elif momentum_7d > -20:
            interpretation = "Declining momentum. Transparent usage is growing faster."
        else:
            interpretation = "Negative trend. Shielded pool usage needs attention."

        return MomentumResponse(
            momentum_7d=round(momentum_7d, 2),
            momentum_30d=round(momentum_30d, 2),
            trend=trend,
            interpretation=interpretation
        )

    @staticmethod
    def _calculate_momentum_score(frame) -> float:
        """
        Calculate momentum score: (Δ shielded_volume / Δ transparent_volume) * 100
        Positive = pro-privacy trend, Negative = pro-transparency trend
        """
        if len(frame) < 2:
            return 0.0

        # Get first and last values
        first = frame.head(1).row(0, named=True)
        last = frame.tail(1).row(0, named=True)

        # Calculate deltas
        delta_shielded = last['shielded_volume_zec'] - first['shielded_volume_zec']
        delta_transparent = last['transparent_volume_zec'] - first['transparent_volume_zec']

        # Avoid division by zero
        if delta_transparent == 0:
            return 100.0 if delta_shielded > 0 else -100.0

        # Calculate momentum
        momentum = (delta_shielded / delta_transparent) * 100

        # Cap at reasonable bounds
        return max(-100.0, min(100.0, momentum))

    def get_metadata(self) -> MetadataResponse:
        """Get metadata about the current dataset."""
        from datetime import datetime, timedelta
        from ..config import settings

        frame = self._repository.get_daily_metrics(limit=1)
        latest = frame.row(0, named=True)
        last_updated = datetime.combine(latest['date'], datetime.min.time())

        # Determine data source
        data_source = "live" if settings.enable_live_data else "sample"

        # Calculate next refresh
        next_refresh = None
        if settings.enable_live_data:
            next_refresh = datetime.now() + timedelta(minutes=settings.refresh_interval_minutes)

        # Get total record count
        all_data = self._repository.get_daily_metrics(limit=1000)
        total_records = len(all_data)

        return MetadataResponse(
            last_updated=last_updated,
            data_source=data_source,
            next_refresh=next_refresh,
            total_records=total_records
        )

    def export_metrics_csv(self, start_date: Optional[str] = None, end_date: Optional[str] = None) -> str:
        """Export metrics data as CSV string."""
        import polars as pl
        from datetime import date as dt_date, timedelta

        # Get data
        frame = self._repository.get_daily_metrics(limit=1000)

        # Filter by date range if provided
        if start_date or end_date:
            if start_date:
                frame = frame.filter(pl.col("date") >= start_date)
            if end_date:
                frame = frame.filter(pl.col("date") <= end_date)

        # Convert to CSV
        csv_str = frame.write_csv()
        return csv_str

    def export_alerts_csv(self, start_date: Optional[str] = None, end_date: Optional[str] = None) -> str:
        """Export alerts data as CSV string."""
        import polars as pl

        # Get alerts from database
        alerts_data = self._repository.get_alerts(limit=1000)

        # Convert to DataFrame
        df = pl.DataFrame(alerts_data)

        # Filter by date range if provided
        if start_date or end_date:
            if start_date:
                df = df.filter(pl.col("timestamp") >= start_date)
            if end_date:
                df = df.filter(pl.col("timestamp") <= end_date)

        # Convert to CSV
        csv_str = df.write_csv()
        return csv_str

    def export_metrics_json(self, start_date: Optional[str] = None, end_date: Optional[str] = None) -> List[dict]:
        """Export metrics data as JSON."""
        import polars as pl

        # Get data
        frame = self._repository.get_daily_metrics(limit=1000)

        # Filter by date range if provided
        if start_date or end_date:
            if start_date:
                frame = frame.filter(pl.col("date") >= start_date)
            if end_date:
                frame = frame.filter(pl.col("date") <= end_date)

        # Convert to list of dicts
        return frame.to_dicts()

    def export_alerts_json(self, start_date: Optional[str] = None, end_date: Optional[str] = None) -> List[dict]:
        """Export alerts data as JSON."""
        import polars as pl

        # Get alerts from database
        alerts_data = self._repository.get_alerts(limit=1000)

        # Convert to DataFrame
        df = pl.DataFrame(alerts_data)

        # Filter by date range if provided
        if start_date or end_date:
            if start_date:
                df = df.filter(pl.col("timestamp") >= start_date)
            if end_date:
                df = df.filter(pl.col("timestamp") <= end_date)

        # Convert to list of dicts
        return df.to_dicts()

    def get_pool_migration(self, days: int = 30) -> PoolMigrationResponse:
        """Calculate shielded pool adoption trends and migration velocity."""
        frame = self._repository.get_daily_metrics(limit=days)

        trends = []
        velocities = []

        rows = frame.to_dicts()

        for i, row in enumerate(rows):
            adoption_pct = row['shielded_tx_ratio'] * 100

            # Calculate velocity (rate of change)
            if i > 0:
                prev_adoption = rows[i-1]['shielded_tx_ratio'] * 100
                velocity = adoption_pct - prev_adoption
            else:
                velocity = 0.0

            velocities.append(velocity)

            trends.append(PoolAdoptionTrend(
                date=row['date'],
                shielded_adoption_pct=round(adoption_pct, 2),
                velocity=round(velocity, 3)
            ))

        # Current stats
        latest = rows[-1]
        current_adoption = latest['shielded_tx_ratio'] * 100

        # 7-day average
        recent_7d = rows[-7:] if len(rows) >= 7 else rows
        avg_7d = sum(r['shielded_tx_ratio'] for r in recent_7d) / len(recent_7d) * 100

        # Current velocity (avg of last 7 days)
        avg_velocity = sum(velocities[-7:]) / min(7, len(velocities)) if velocities else 0.0

        # Simple forecast: current + (velocity * 30)
        forecast_30d = current_adoption + (avg_velocity * 30)
        forecast_30d = max(0, min(100, forecast_30d))  # Cap at 0-100%

        return PoolMigrationResponse(
            trends=trends,
            current_adoption=round(current_adoption, 2),
            avg_7d_adoption=round(avg_7d, 2),
            adoption_velocity=round(avg_velocity, 3),
            forecast_30d=round(forecast_30d, 2)
        )
