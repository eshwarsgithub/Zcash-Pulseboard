"""Zchain API client for fetching live Zcash blockchain metrics."""

from __future__ import annotations

import logging
from datetime import date, datetime, timedelta
from typing import Optional, Dict, Any, List

from .base_client import BaseAPIClient

logger = logging.getLogger(__name__)


class ZchainClient(BaseAPIClient):
    """
    Client for Zchain API (https://api.zcha.in)

    Provides methods to fetch live Zcash blockchain data including:
    - Network statistics
    - Block data
    - Transaction metrics
    - Shielded pool information
    """

    def __init__(self, base_url: str = "https://api.zcha.in/v2/mainnet"):
        # Zchain allows ~10 req/sec, use conservative 2 req/sec
        super().__init__(base_url=base_url, rate_limit_per_sec=2.0)

    async def fetch_network_stats(self) -> Optional[Dict[str, Any]]:
        """
        Fetch current network statistics.

        Returns dict with keys:
        - blocks: Total blocks
        - transactions: Total transactions
        - shielded_transactions: Shielded tx count
        - transparent_transactions: Transparent tx count
        - etc.
        """
        result = await self.get("statistics")
        if result:
            logger.info(f"Fetched network stats: {result.get('blocks', 'N/A')} blocks")
        return result

    async def fetch_blocks(self, limit: int = 100) -> Optional[List[Dict[str, Any]]]:
        """
        Fetch recent blocks.

        Args:
            limit: Number of blocks to fetch (default 100)

        Returns:
            List of block objects with timestamp, tx count, etc.
        """
        result = await self.get("blocks", params={"limit": limit, "sort": "height", "direction": "descending"})
        if result and isinstance(result, list):
            logger.info(f"Fetched {len(result)} blocks")
            return result
        return None

    async def fetch_transactions_stats(self, date_str: Optional[str] = None) -> Optional[Dict[str, Any]]:
        """
        Fetch transaction statistics for a specific date.

        Args:
            date_str: Date in YYYY-MM-DD format (defaults to today)

        Returns:
            Dict with transaction counts and volumes
        """
        params = {}
        if date_str:
            params["date"] = date_str

        result = await self.get("transactions/statistics", params=params)
        if result:
            logger.info(f"Fetched transaction stats for {date_str or 'today'}")
        return result

    async def calculate_daily_metrics(
        self,
        target_date: date = None,
        lookback_blocks: int = 150
    ) -> Dict[str, Any]:
        """
        Calculate aggregated metrics for a specific date.

        This method:
        1. Fetches recent blocks
        2. Filters blocks for target date
        3. Aggregates transactions, volumes, fees, block times

        Args:
            target_date: Date to calculate metrics for (defaults to today)
            lookback_blocks: Number of recent blocks to analyze

        Returns:
            Dict with daily metrics suitable for DailyMetric model
        """
        if target_date is None:
            target_date = date.today()

        logger.info(f"Calculating daily metrics for {target_date}")

        # Fetch recent blocks
        blocks = await self.fetch_blocks(limit=lookback_blocks)
        if not blocks:
            logger.warning("No block data available")
            return self._empty_metrics(target_date)

        # Filter blocks for target date
        target_blocks = []
        for block in blocks:
            block_timestamp = block.get("timestamp")
            if block_timestamp:
                # Parse timestamp (format: ISO 8601)
                try:
                    block_date = datetime.fromisoformat(block_timestamp.replace("Z", "+00:00")).date()
                    if block_date == target_date:
                        target_blocks.append(block)
                except (ValueError, AttributeError) as e:
                    logger.debug(f"Failed to parse timestamp {block_timestamp}: {e}")
                    continue

        if not target_blocks:
            logger.warning(f"No blocks found for {target_date}")
            return self._empty_metrics(target_date)

        # Aggregate metrics
        total_transactions = sum(b.get("transactions", 0) for b in target_blocks)
        shielded_transactions = sum(b.get("shielded_transactions", 0) for b in target_blocks)
        transparent_transactions = total_transactions - shielded_transactions

        shielded_volume = sum(float(b.get("shielded_volume", 0)) for b in target_blocks)
        transparent_volume = sum(float(b.get("transparent_volume", 0)) for b in target_blocks)

        fees = [float(b.get("total_fees", 0)) for b in target_blocks if b.get("total_fees")]
        avg_fee = sum(fees) / len(fees) if fees else 0.0

        block_times = []
        for i in range(len(target_blocks) - 1):
            try:
                t1 = datetime.fromisoformat(target_blocks[i]["timestamp"].replace("Z", "+00:00"))
                t2 = datetime.fromisoformat(target_blocks[i + 1]["timestamp"].replace("Z", "+00:00"))
                block_times.append(abs((t1 - t2).total_seconds()))
            except (KeyError, ValueError, AttributeError):
                continue

        avg_block_time = sum(block_times) / len(block_times) if block_times else 75.0

        # Estimate active addresses (approximation from tx data)
        # In real implementation, would need address-level API
        active_addresses = int(total_transactions * 1.5)  # Rough estimate

        return {
            "date": target_date.isoformat(),
            "total_transactions": total_transactions,
            "shielded_transactions": shielded_transactions,
            "transparent_transactions": transparent_transactions,
            "shielded_volume_zec": shielded_volume,
            "transparent_volume_zec": transparent_volume,
            "avg_fee_zec": avg_fee,
            "median_fee_zec": avg_fee * 0.8,  # Approximation
            "avg_block_time_seconds": avg_block_time,
            "active_addresses": active_addresses,
        }

    def _empty_metrics(self, target_date: date) -> Dict[str, Any]:
        """Return empty metrics structure for a date with no data."""
        return {
            "date": target_date.isoformat(),
            "total_transactions": 0,
            "shielded_transactions": 0,
            "transparent_transactions": 0,
            "shielded_volume_zec": 0.0,
            "transparent_volume_zec": 0.0,
            "avg_fee_zec": 0.0,
            "median_fee_zec": 0.0,
            "avg_block_time_seconds": 75.0,
            "active_addresses": 0,
        }

    async def test_connection(self) -> bool:
        """Test if Zchain API is accessible."""
        try:
            stats = await self.fetch_network_stats()
            return stats is not None
        except Exception as e:
            logger.error(f"Zchain connection test failed: {e}")
            return False
