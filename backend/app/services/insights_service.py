from __future__ import annotations

from typing import Optional


def _format_change(current: float, previous: Optional[dict], key: str, *, scale: float = 1.0) -> str:
    if previous is None or previous.get(key) is None:
        return ""
    baseline = previous[key]
    diff = (current - baseline) * scale
    if abs(diff) < 1e-6:
        return "flat"
    direction = "up" if diff > 0 else "down"
    return f"{direction} {abs(diff):.2f}"


class InsightBuilder:
    """Produce short, friendly explanations for KPI cards."""

    def describe_tx_change(self, current: dict, previous: Optional[dict]) -> Optional[str]:
        if previous is None:
            return "Tracking baseline transactions."
        diff = current["total_transactions"] - previous["total_transactions"]
        if abs(diff) < previous["total_transactions"] * 0.01:
            return "Transaction flow is steady compared to yesterday."
        if diff > 0:
            return "Network activity picked up with more transactions than yesterday."
        return "Transactions cooled slightly versus the previous day."

    def describe_shielded_share(self, current: dict, previous: Optional[dict]) -> Optional[str]:
        if previous is None:
            return "Establishing a privacy adoption baseline."
        diff = (current["shielded_tx_ratio"] - previous["shielded_tx_ratio"]) * 100
        if abs(diff) < 0.5:
            return "Shielded usage share is flat day-over-day."
        if diff > 0:
            return "More transactions opted for shielded addresses today."
        return "Shielded share dipped; monitor if the trend persists."

    def describe_fee_change(self, current: dict, previous: Optional[dict]) -> Optional[str]:
        if previous is None:
            return "Fee movement insight becomes available after one day of data."
        diff = current["avg_fee_zec"] - previous["avg_fee_zec"]
        if abs(diff) < previous["avg_fee_zec"] * 0.05:
            return "Fees are stable relative to the trailing day."
        if diff > 0:
            return "Fees are trending higher; mempool congestion may be rising."
        return "Fees eased, suggesting demand is normalizing."

    def describe_address_change(self, current: dict, previous: Optional[dict]) -> Optional[str]:
        if previous is None:
            return "Active address trend will appear after the first comparison day."
        diff = current["active_addresses"] - previous["active_addresses"]
        if abs(diff) < previous["active_addresses"] * 0.02:
            return "Active address count remains within the typical range."
        if diff > 0:
            return "More addresses interacted with the network today."
        return "Fewer active addresses than yesterday; likely a quiet period."
