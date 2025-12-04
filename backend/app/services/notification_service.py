"""Discord and Slack webhook notification service."""

from __future__ import annotations

import logging
from typing import Optional, Dict, Any

import httpx

logger = logging.getLogger(__name__)


class NotificationService:
    """
    Send alerts to Discord/Slack webhooks.

    Formats alerts as rich embeds with color-coding and metadata.
    """

    # Color codes for Discord embeds
    SEVERITY_COLORS = {
        "high": 0xFF0000,      # Red
        "medium": 0xFFAA00,    # Orange
        "low": 0x00FF00,       # Green
    }

    def __init__(self, webhook_url: str, service_type: str = "discord"):
        """
        Initialize notification service.

        Args:
            webhook_url: Discord or Slack webhook URL
            service_type: "discord" or "slack"
        """
        self.webhook_url = webhook_url
        self.service_type = service_type.lower()
        self.client = httpx.AsyncClient(timeout=30.0)

    async def send_alert(self, alert: Dict[str, Any]) -> bool:
        """
        Send alert notification.

        Args:
            alert: Alert dictionary with keys:
                - summary: Alert title
                - explanation: Detailed description
                - severity: "high", "medium", or "low"
                - metric: Metric name
                - current_value: Current value
                - baseline_value: Baseline value
                - delta_percent: Percentage change
                - timestamp: ISO timestamp

        Returns:
            True if sent successfully, False otherwise
        """
        try:
            if self.service_type == "discord":
                payload = self._format_discord_embed(alert)
            elif self.service_type == "slack":
                payload = self._format_slack_message(alert)
            else:
                logger.error(f"Unknown service type: {self.service_type}")
                return False

            response = await self.client.post(self.webhook_url, json=payload)
            response.raise_for_status()

            logger.info(f"✓ Sent {alert['severity']} alert via {self.service_type}: {alert['summary']}")
            return True

        except httpx.HTTPStatusError as e:
            logger.error(f"Failed to send {self.service_type} notification: HTTP {e.response.status_code}")
            return False
        except Exception as e:
            logger.error(f"Failed to send {self.service_type} notification: {e}")
            return False

    def _format_discord_embed(self, alert: Dict[str, Any]) -> Dict[str, Any]:
        """Format alert as Discord embed."""
        severity = alert.get("severity", "low")
        color = self.SEVERITY_COLORS.get(severity, 0x808080)

        # Format values
        current = alert.get("current_value", 0)
        baseline = alert.get("baseline_value", 0)
        delta = alert.get("delta_percent", 0)

        # Create embed
        embed = {
            "embeds": [{
                "title": f"🔔 {alert.get('summary', 'Alert')}",
                "description": alert.get("explanation", ""),
                "color": color,
                "fields": [
                    {
                        "name": "Metric",
                        "value": alert.get("metric", "N/A"),
                        "inline": True
                    },
                    {
                        "name": "Current Value",
                        "value": f"{current:,.2f}",
                        "inline": True
                    },
                    {
                        "name": "Baseline",
                        "value": f"{baseline:,.2f}",
                        "inline": True
                    },
                    {
                        "name": "Change",
                        "value": f"{delta:+.1f}%",
                        "inline": True
                    },
                    {
                        "name": "Severity",
                        "value": severity.upper(),
                        "inline": True
                    },
                ],
                "timestamp": alert.get("timestamp"),
                "footer": {
                    "text": "Zcash Pulseboard"
                }
            }]
        }

        return embed

    def _format_slack_message(self, alert: Dict[str, Any]) -> Dict[str, Any]:
        """Format alert as Slack message."""
        severity = alert.get("severity", "low")
        emoji = "🔴" if severity == "high" else "🟡" if severity == "medium" else "🟢"

        current = alert.get("current_value", 0)
        baseline = alert.get("baseline_value", 0)
        delta = alert.get("delta_percent", 0)

        message = {
            "text": f"{emoji} *{alert.get('summary')}*",
            "blocks": [
                {
                    "type": "header",
                    "text": {
                        "type": "plain_text",
                        "text": f"{emoji} {alert.get('summary')}"
                    }
                },
                {
                    "type": "section",
                    "text": {
                        "type": "mrkdwn",
                        "text": alert.get("explanation", "")
                    }
                },
                {
                    "type": "section",
                    "fields": [
                        {
                            "type": "mrkdwn",
                            "text": f"*Metric:*\n{alert.get('metric')}"
                        },
                        {
                            "type": "mrkdwn",
                            "text": f"*Severity:*\n{severity.upper()}"
                        },
                        {
                            "type": "mrkdwn",
                            "text": f"*Current:*\n{current:,.2f}"
                        },
                        {
                            "type": "mrkdwn",
                            "text": f"*Change:*\n{delta:+.1f}%"
                        }
                    ]
                }
            ]
        }

        return message

    async def close(self):
        """Close the HTTP client."""
        await self.client.aclose()

    async def __aenter__(self):
        return self

    async def __aexit__(self, exc_type, exc_val, exc_tb):
        await self.close()


async def send_alerts_if_configured(alerts: list):
    """
    Send alerts to configured webhooks (Discord/Slack).

    Only sends high and medium severity alerts.

    Args:
        alerts: List of alert dictionaries
    """
    from app.config import settings

    if not alerts:
        return

    # Filter by severity threshold
    severity_order = {"low": 0, "medium": 1, "high": 2}
    threshold_level = severity_order.get(settings.alert_severity_threshold, 1)

    filtered_alerts = [
        alert for alert in alerts
        if severity_order.get(alert.get("severity", "low"), 0) >= threshold_level
    ]

    if not filtered_alerts:
        logger.info(f"No alerts meet severity threshold ({settings.alert_severity_threshold})")
        return

    # Send to Discord
    if settings.discord_webhook_url:
        async with NotificationService(settings.discord_webhook_url, "discord") as notifier:
            for alert in filtered_alerts:
                await notifier.send_alert(alert)

    # Send to Slack
    if settings.slack_webhook_url:
        async with NotificationService(settings.slack_webhook_url, "slack") as notifier:
            for alert in filtered_alerts:
                await notifier.send_alert(alert)

    logger.info(f"Sent {len(filtered_alerts)} alerts to configured webhooks")
