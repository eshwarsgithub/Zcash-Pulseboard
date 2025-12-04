from __future__ import annotations

from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, Query
from fastapi.responses import JSONResponse, Response
from typing import Optional

from ..models.metrics import (
    AlertFeed,
    MetadataResponse,
    MetricsPayload,
    MetricsSummary,
    MomentumResponse,
    NetworkHealthDetailed,
    PoolMigrationResponse,
    PrivacyMetricsResponse,
)
from ..services.metrics_service import MetricsService

router = APIRouter()


def get_service() -> MetricsService:
    return MetricsService()


def validate_date_format(date_str: Optional[str], param_name: str) -> None:
    """Validate date string is in YYYY-MM-DD format.

    Args:
        date_str: Date string to validate
        param_name: Parameter name for error messages

    Raises:
        HTTPException: If date format is invalid
    """
    if date_str is not None:
        try:
            datetime.strptime(date_str, "%Y-%m-%d")
        except ValueError:
            raise HTTPException(
                status_code=400,
                detail=f"Invalid {param_name} format. Expected YYYY-MM-DD, got: {date_str}"
            )


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


@router.get("/metrics/momentum", response_model=MomentumResponse)
def fetch_momentum(service: MetricsService = Depends(get_service)) -> MomentumResponse:
    """Get Shielded Pool Momentum Index."""
    return service.get_momentum()


@router.get("/metrics/metadata", response_model=MetadataResponse)
def fetch_metadata(service: MetricsService = Depends(get_service)) -> MetadataResponse:
    """Get metadata about the dataset."""
    return service.get_metadata()


@router.get("/export/metrics/csv")
def export_metrics_csv(
    start_date: Optional[str] = Query(None, description="Start date (YYYY-MM-DD)"),
    end_date: Optional[str] = Query(None, description="End date (YYYY-MM-DD)"),
    service: MetricsService = Depends(get_service)
) -> Response:
    """Export metrics data as CSV file."""
    csv_data = service.export_metrics_csv(start_date, end_date)
    return Response(
        content=csv_data,
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=zcash_metrics.csv"}
    )


@router.get("/export/metrics/json")
def export_metrics_json(
    start_date: Optional[str] = Query(None, description="Start date (YYYY-MM-DD)"),
    end_date: Optional[str] = Query(None, description="End date (YYYY-MM-DD)"),
    service: MetricsService = Depends(get_service)
) -> JSONResponse:
    """Export metrics data as JSON."""
    validate_date_format(start_date, "start_date")
    validate_date_format(end_date, "end_date")
    return service.export_metrics_json(start_date, end_date)


@router.get("/export/alerts/csv")
def export_alerts_csv(
    start_date: Optional[str] = Query(None, description="Start date (YYYY-MM-DD)"),
    end_date: Optional[str] = Query(None, description="End date (YYYY-MM-DD)"),
    service: MetricsService = Depends(get_service)
) -> Response:
    """Export alerts data as CSV file."""
    csv_data = service.export_alerts_csv(start_date, end_date)
    return Response(
        content=csv_data,
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=zcash_alerts.csv"}
    )


@router.get("/export/alerts/json")
def export_alerts_json(
    start_date: Optional[str] = Query(None, description="Start date (YYYY-MM-DD)"),
    end_date: Optional[str] = Query(None, description="End date (YYYY-MM-DD)"),
    service: MetricsService = Depends(get_service)
) -> JSONResponse:
    """Export alerts data as JSON."""
    validate_date_format(start_date, "start_date")
    validate_date_format(end_date, "end_date")
    return service.export_alerts_json(start_date, end_date)


@router.get("/metrics/pool-migration", response_model=PoolMigrationResponse)
def fetch_pool_migration(
    days: int = Query(30, description="Number of days to analyze"),
    service: MetricsService = Depends(get_service)
) -> PoolMigrationResponse:
    """Get shielded pool adoption trends and migration velocity."""
    return service.get_pool_migration(days)
