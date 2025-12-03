from __future__ import annotations

from datetime import date, datetime
from typing import Dict, List, Literal, Optional

from pydantic import BaseModel, Field


class DailyMetric(BaseModel):
    date: date
    total_transactions: int
    shielded_transactions: int
    transparent_transactions: int
    shielded_volume_zec: float
    transparent_volume_zec: float
    avg_fee_zec: float
    median_fee_zec: float
    avg_block_time_seconds: float
    active_addresses: int
    shielded_tx_ratio: float = Field(..., ge=0, le=1)
    shielded_volume_ratio: float = Field(..., ge=0, le=1)


class KPICard(BaseModel):
    name: str
    value: float
    unit: str
    delta_percent: Optional[float] = None
    trend: Optional[str] = Field(None, pattern="^(up|down|flat)$")
    insight: Optional[str] = None
    status: Literal["good", "warning", "critical"] = "good"


class MetricsPayload(BaseModel):
    data: List[DailyMetric]


class MetricsSummary(BaseModel):
    latest_date: date
    total_transactions_7d_avg: float
    shielded_tx_ratio_7d_avg: float
    avg_fee_7d_avg: float
    active_addresses_7d_avg: float
    health: Dict[str, Literal["good", "warning", "critical"]]


class Alert(BaseModel):
    id: str
    timestamp: datetime
    type: str
    severity: str
    metric: str
    current_value: float
    baseline_value: float
    delta_percent: float
    summary: str
    explanation: str


class AlertFeed(BaseModel):
    alerts: List[Alert]


class PrivacyTrend(BaseModel):
    date: date
    shielded_tx_pct: float
    shielded_volume_pct: float
    privacy_score: float  # 0-100 weighted composite


class PrivacyMetricsResponse(BaseModel):
    trends: List[PrivacyTrend]
    latest_score: float
    avg_7d_score: float
    privacy_grade: str  # "Excellent", "Good", "Fair", "Poor"


class NetworkHealthDetailed(BaseModel):
    overall_score: int  # 0-100
    component_scores: Dict[str, int]  # throughput, privacy, cost, participation
    grade: str  # "A+", "A", "B", "C", "D", "F"
    trend: str  # "improving", "stable", "declining"
    issues: List[str]  # Human-readable issues
