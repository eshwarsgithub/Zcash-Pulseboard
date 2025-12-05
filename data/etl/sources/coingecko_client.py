"""CoinGecko API client for fetching ZEC price and market data."""

from __future__ import annotations

import logging
from datetime import date, datetime
from typing import Optional, Dict, Any

from .base_client import BaseAPIClient

logger = logging.getLogger(__name__)


class CoinGeckoClient(BaseAPIClient):
    """
    Client for CoinGecko API (https://api.coingecko.com/api/v3)

    Provides methods to fetch:
    - Current ZEC price
    - Historical prices
    - Market data (volume, market cap)
    """

    def __init__(
        self,
        base_url: str = "https://api.coingecko.com/api/v3",
        api_key: Optional[str] = None
    ):
        # CoinGecko free tier: ~30 requests/minute = 0.5 req/sec
        super().__init__(base_url=base_url, rate_limit_per_sec=0.5)
        self.api_key = api_key

    def _get_headers(self) -> Optional[Dict[str, str]]:
        """Add API key header if available."""
        if self.api_key:
            return {"x-cg-pro-api-key": self.api_key}
        return None

    async def fetch_current_price(
        self,
        vs_currency: str = "usd"
    ) -> Optional[Dict[str, Any]]:
        """
        Fetch current ZEC price.

        Args:
            vs_currency: Currency to price against (default: usd)

        Returns:
            Dict with keys: usd, usd_24h_change, usd_market_cap, etc.
        """
        result = await self.get(
            "simple/price",
            params={
                "ids": "zcash",
                "vs_currencies": vs_currency,
                "include_24hr_change": "true",
                "include_market_cap": "true",
                "include_24hr_vol": "true"
            },
            headers=self._get_headers()
        )

        if result and "zcash" in result:
            price_data = result["zcash"]
            logger.info(f"Fetched ZEC price: ${price_data.get('usd', 'N/A')}")
            return price_data

        logger.warning("No price data available from CoinGecko")
        return None

    async def fetch_historical_price(
        self,
        target_date: date,
        vs_currency: str = "usd"
    ) -> Optional[float]:
        """
        Fetch historical ZEC price for a specific date.

        Args:
            target_date: Date to fetch price for
            vs_currency: Currency to price against

        Returns:
            Price as float, or None if unavailable
        """
        # CoinGecko format: DD-MM-YYYY
        date_str = target_date.strftime("%d-%m-%Y")

        result = await self.get(
            "coins/zcash/history",
            params={"date": date_str},
            headers=self._get_headers()
        )

        if result and "market_data" in result:
            price = result["market_data"]["current_price"].get(vs_currency)
            if price:
                logger.info(f"Fetched historical ZEC price for {target_date}: ${price}")
                return float(price)

        logger.warning(f"No historical price data for {target_date}")
        return None

    async def fetch_market_chart(
        self,
        days: int = 30,
        vs_currency: str = "usd"
    ) -> Optional[Dict[str, Any]]:
        """
        Fetch price chart data for last N days.

        Args:
            days: Number of days of data (1-365)
            vs_currency: Currency to price against

        Returns:
            Dict with keys: prices, market_caps, total_volumes
            Each contains list of [timestamp, value] pairs
        """
        result = await self.get(
            "coins/zcash/market_chart",
            params={
                "vs_currency": vs_currency,
                "days": days
            },
            headers=self._get_headers()
        )

        if result:
            logger.info(f"Fetched {days}-day market chart")
            return result

        return None

    async def fetch_price_for_date(
        self,
        target_date: date
    ) -> Dict[str, Any]:
        """
        Comprehensive price data for a specific date.

        Returns:
            Dict with keys: price_usd, market_cap_usd, trading_volume_usd, price_change_pct
        """
        # Try historical endpoint first
        price = await self.fetch_historical_price(target_date)

        if price is None:
            # Fallback to current price if date is today
            if target_date == date.today():
                current = await self.fetch_current_price()
                if current:
                    return {
                        "price_usd": current.get("usd", 0.0),
                        "market_cap_usd": int(current.get("usd_market_cap", 0)),
                        "trading_volume_usd": int(current.get("usd_24h_vol", 0)),
                        "price_change_pct": current.get("usd_24h_change", 0.0)
                    }

            # Return zeros if no data available
            return {
                "price_usd": 0.0,
                "market_cap_usd": 0,
                "trading_volume_usd": 0,
                "price_change_pct": 0.0
            }

        # Build full response from historical data
        return {
            "price_usd": price,
            "market_cap_usd": 0,  # Not available in historical endpoint
            "trading_volume_usd": 0,
            "price_change_pct": 0.0
        }

    async def test_connection(self) -> bool:
        """Test if CoinGecko API is accessible."""
        try:
            price_data = await self.fetch_current_price()
            return price_data is not None and "usd" in price_data
        except Exception as e:
            logger.error(f"CoinGecko connection test failed: {e}")
            return False
