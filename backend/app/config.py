"""Application configuration and settings management."""

from __future__ import annotations

import logging
from pathlib import Path
from typing import Optional

from pydantic_settings import BaseSettings, SettingsConfigDict

logger = logging.getLogger(__name__)


class Settings(BaseSettings):
    """
    Application settings loaded from environment variables or .env file.

    All settings can be overridden via environment variables.
    Example: export ZCHAIN_API_URL="https://custom-api.com"
    """

    # API Endpoints
    zchain_api_url: str = "https://api.zcha.in/v2/mainnet"
    coingecko_api_url: str = "https://api.coingecko.com/api/v3"

    # API Keys (optional)
    coingecko_api_key: Optional[str] = None

    # Database
    db_path: Path = Path(__file__).resolve().parents[3] / "data" / "zcash_pulse.duckdb"

    # Scheduler Configuration
    refresh_interval_minutes: int = 5
    enable_live_data: bool = True  # Set to False to use sample data only

    # Alerting & Notifications
    discord_webhook_url: Optional[str] = None
    slack_webhook_url: Optional[str] = None
    alert_severity_threshold: str = "medium"  # "low", "medium", "high"

    # Anomaly Detection
    anomaly_zscore_threshold: float = 2.5  # Standard deviations for anomaly detection
    enable_anomaly_detection: bool = True

    # Logging
    log_level: str = "INFO"

    # Model configuration
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore"
    )

    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self._configure_logging()
        self._log_configuration()

    def _configure_logging(self):
        """Configure logging level from settings."""
        log_level = getattr(logging, self.log_level.upper(), logging.INFO)
        logging.basicConfig(
            level=log_level,
            format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
        )

    def _log_configuration(self):
        """Log current configuration (excluding sensitive data)."""
        logger.info("=" * 60)
        logger.info("Zcash Pulseboard Configuration")
        logger.info("=" * 60)
        logger.info(f"Zchain API: {self.zchain_api_url}")
        logger.info(f"CoinGecko API: {self.coingecko_api_url}")
        logger.info(f"Database: {self.db_path}")
        logger.info(f"Live Data: {'ENABLED' if self.enable_live_data else 'DISABLED (sample mode)'}")
        logger.info(f"Refresh Interval: {self.refresh_interval_minutes} minutes")
        logger.info(f"Discord Alerts: {'ENABLED' if self.discord_webhook_url else 'DISABLED'}")
        logger.info(f"Anomaly Detection: {'ENABLED' if self.enable_anomaly_detection else 'DISABLED'}")
        logger.info(f"Z-score Threshold: {self.anomaly_zscore_threshold}σ")
        logger.info("=" * 60)


# Global settings instance
settings = Settings()
