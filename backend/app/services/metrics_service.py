from __future__ import annotations

from typing import List, Optional

from ..db.client import DataRepository, get_repository
from ..models.metrics import (
    Alert,
    AlertFeed,
    DailyMetric,
    KPICard,
    MetricsPayload,
    MetricsSummary,
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
