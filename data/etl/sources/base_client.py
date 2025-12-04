"""Base API client with retry logic, rate limiting, and error handling."""

from __future__ import annotations

import asyncio
import logging
from typing import Any, Dict, Optional
from datetime import datetime, timedelta

import httpx

logger = logging.getLogger(__name__)


class RateLimiter:
    """Simple rate limiter using token bucket algorithm."""

    def __init__(self, rate_per_second: float = 1.0):
        self.rate = rate_per_second
        self.min_interval = 1.0 / rate_per_second
        self.last_request_time: Optional[datetime] = None

    async def wait(self):
        """Wait if necessary to respect rate limit."""
        if self.last_request_time is not None:
            elapsed = (datetime.now() - self.last_request_time).total_seconds()
            wait_time = self.min_interval - elapsed
            if wait_time > 0:
                await asyncio.sleep(wait_time)

        self.last_request_time = datetime.now()


class BaseAPIClient:
    """
    Base HTTP client with:
    - Exponential backoff retry
    - Rate limiting
    - Connection pooling
    - Comprehensive error handling
    """

    def __init__(
        self,
        base_url: str,
        rate_limit_per_sec: float = 2.0,
        max_retries: int = 3,
        timeout: float = 30.0,
    ):
        self.base_url = base_url.rstrip("/")
        self.max_retries = max_retries
        self.rate_limiter = RateLimiter(rate_limit_per_sec)

        self.client = httpx.AsyncClient(
            timeout=httpx.Timeout(timeout),
            limits=httpx.Limits(max_connections=5, max_keepalive_connections=2),
            follow_redirects=True,
        )

    async def get(
        self,
        endpoint: str,
        params: Optional[Dict[str, Any]] = None,
        headers: Optional[Dict[str, str]] = None,
    ) -> Optional[Dict[str, Any]]:
        """
        GET request with exponential backoff retry.

        Args:
            endpoint: API endpoint (will be joined with base_url)
            params: Query parameters
            headers: Additional headers

        Returns:
            Parsed JSON response or None on failure
        """
        url = f"{self.base_url}/{endpoint.lstrip('/')}"

        for attempt in range(self.max_retries):
            try:
                # Respect rate limit
                await self.rate_limiter.wait()

                logger.debug(f"GET {url} (attempt {attempt + 1}/{self.max_retries})")

                response = await self.client.get(url, params=params, headers=headers)
                response.raise_for_status()

                return response.json()

            except httpx.HTTPStatusError as e:
                logger.warning(f"HTTP {e.response.status_code} for {url}: {e}")

                # Don't retry on client errors (4xx)
                if 400 <= e.response.status_code < 500:
                    return None

                # Retry on server errors (5xx)
                if attempt == self.max_retries - 1:
                    logger.error(f"Failed after {self.max_retries} attempts: {url}")
                    return None

                # Exponential backoff: 1s, 2s, 4s
                wait_time = 2 ** attempt
                logger.info(f"Retrying in {wait_time}s...")
                await asyncio.sleep(wait_time)

            except httpx.RequestError as e:
                logger.error(f"Request error for {url}: {e}")

                if attempt == self.max_retries - 1:
                    return None

                wait_time = 2 ** attempt
                await asyncio.sleep(wait_time)

            except Exception as e:
                logger.error(f"Unexpected error for {url}: {e}")
                return None

        return None

    async def close(self):
        """Close the HTTP client connection pool."""
        await self.client.aclose()

    async def __aenter__(self):
        return self

    async def __aexit__(self, exc_type, exc_val, exc_tb):
        await self.close()
