from __future__ import annotations

from fastapi import APIRouter, Depends

from ..models.metrics import (
    AlertFeed,
    MetricsPayload,
    MetricsSummary,
    NetworkHealthDetailed,
    PrivacyMetricsResponse,
)
from ..services.metrics_service import MetricsService

router = APIRouter()


def get_service() -> MetricsService:
    return MetricsService()


@router.get("/health")
def healthcheck() -> dict[str, str]:
    return {"status": "ok"}


@router.get("/metrics/daily", response_model=MetricsPayload)
def fetch_daily_metrics(service: MetricsService = Depends(get_service)) -> MetricsPayload:
    return service.get_daily_metrics(limit=30)


@router.get("/metrics/kpis")
def fetch_kpis(service: MetricsService = Depends(get_service)) -> dict[str, list]:
    cards = service.get_kpis()
    return {"cards": [card.model_dump() for card in cards]}


@router.get("/metrics/summary", response_model=MetricsSummary)
def fetch_summary(service: MetricsService = Depends(get_service)) -> MetricsSummary:
    return service.get_summary()


@router.get("/alerts", response_model=AlertFeed)
def fetch_alerts(service: MetricsService = Depends(get_service)) -> AlertFeed:
    return service.get_alerts(limit=10)


@router.get("/metrics/privacy", response_model=PrivacyMetricsResponse)
def fetch_privacy_metrics(service: MetricsService = Depends(get_service)) -> PrivacyMetricsResponse:
    """Get privacy-focused analytics."""
    return service.get_privacy_metrics(days=30)


@router.get("/metrics/health", response_model=NetworkHealthDetailed)
def fetch_network_health(service: MetricsService = Depends(get_service)) -> NetworkHealthDetailed:
    """Get detailed network health score."""
    return service.get_network_health_detailed()
