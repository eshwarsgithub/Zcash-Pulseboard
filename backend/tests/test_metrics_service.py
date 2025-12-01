from __future__ import annotations

from backend.app.services.metrics_service import MetricsService


def test_daily_metrics_length():
    service = MetricsService()
    payload = service.get_daily_metrics(limit=5)
    assert len(payload.data) == 5


def test_kpis_return_four_cards():
    service = MetricsService()
    cards = service.get_kpis()
    assert len(cards) == 4
    names = {card.name for card in cards}
    assert {"Total Transactions", "Shielded Share", "Average Fee", "Active Addresses"} == names
    assert {card.status for card in cards}.issubset({"good", "warning", "critical"})


def test_alert_feed_not_empty():
    service = MetricsService()
    feed = service.get_alerts(limit=2)
    assert len(feed.alerts) == 2


def test_summary_contains_health_scores():
    service = MetricsService()
    summary = service.get_summary()
    assert summary.health.keys() == {"throughput", "privacy", "cost", "participation"}
