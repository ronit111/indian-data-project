"""
Shared MOSPI eSankhyiki API client for all MOSPI data endpoints.

Supports 7 endpoints: CPI, NAS, PLFS, WPI, IIP, Energy, ASI.
All use the same response format and pagination scheme.

No authentication required (verified Feb 2026). All endpoints return
data with unauthenticated GET requests.

Response format (all endpoints):
{
    "data": [...],
    "meta_data": {"page": 1, "totalRecords": N, "totalPages": M, "recordPerPage": 10},
    "msg": "Data fetched successfully",
    "statusCode": true
}

Source: https://api.mospi.gov.in
Swagger specs: https://github.com/nso-india/esankhyiki-mcp/tree/main/swagger
"""

import logging
import time
from typing import Any

import requests

logger = logging.getLogger(__name__)

BASE_URL = "https://api.mospi.gov.in"
TIMEOUT = 30
MAX_RETRIES = 3
RETRY_DELAY_BASE = 2  # seconds; delay = base * attempt
DEFAULT_LIMIT = 50  # records per page (API default is 10; use 50 for efficiency)
RATE_LIMIT_DELAY = 0.5  # seconds between requests


# ── Endpoint paths ──────────────────────────────────────────────────
ENDPOINTS = {
    "cpi": "/api/cpi/getCPIIndex",
    "cpi_item": "/api/cpi/getItemIndex",
    "nas": "/api/nas/getNASData",
    "plfs": "/api/plfs/getData",
    "wpi": "/api/wpi/getWpiRecords",
    "iip": "/api/iip/getIIPAnnual",
    "energy": "/api/energy/getEnergyRecords",
    "asi": "/api/asi/getASIData",
}


def fetch(
    endpoint: str,
    params: dict[str, str],
    max_pages: int = 100,
    limit: int = DEFAULT_LIMIT,
) -> list[dict[str, Any]]:
    """
    Fetch all pages of data from a MOSPI endpoint.

    Args:
        endpoint: Key from ENDPOINTS dict (e.g., "nas", "plfs", "wpi").
        params: Query parameters (excluding page/limit/Format).
        max_pages: Safety limit on pagination (default 100).
        limit: Records per page (default 50).

    Returns:
        Complete list of data records across all pages.
        Empty list on error or if endpoint returns no data.
    """
    path = ENDPOINTS.get(endpoint)
    if not path:
        logger.error(f"Unknown MOSPI endpoint: {endpoint}")
        return []

    url = f"{BASE_URL}{path}"
    query = {**params, "Format": "JSON", "limit": str(limit)}

    all_records: list[dict[str, Any]] = []
    page = 1

    while page <= max_pages:
        query["page"] = str(page)
        data, meta = _fetch_page(url, query)

        if data is None:
            # Request failed entirely — return what we have so far
            break

        all_records.extend(data)

        total_pages = meta.get("totalPages", 1) if meta else 1
        if page >= total_pages:
            break

        page += 1
        time.sleep(RATE_LIMIT_DELAY)

    if all_records:
        logger.info(f"  MOSPI {endpoint}: {len(all_records)} records fetched")
    else:
        logger.warning(f"  MOSPI {endpoint}: no data returned")

    return all_records


def fetch_single_page(
    endpoint: str,
    params: dict[str, str],
    page: int = 1,
    limit: int = DEFAULT_LIMIT,
) -> tuple[list[dict[str, Any]], dict[str, Any] | None]:
    """
    Fetch a single page from a MOSPI endpoint.

    Returns:
        Tuple of (records, meta_data). meta_data is None on error.
    """
    path = ENDPOINTS.get(endpoint)
    if not path:
        logger.error(f"Unknown MOSPI endpoint: {endpoint}")
        return [], None

    url = f"{BASE_URL}{path}"
    query = {**params, "Format": "JSON", "limit": str(limit), "page": str(page)}
    return _fetch_page(url, query)


def _fetch_page(
    url: str,
    params: dict[str, str],
) -> tuple[list[dict[str, Any]] | None, dict[str, Any] | None]:
    """
    Fetch a single page with retry logic.

    Returns:
        Tuple of (data_list, meta_data). data_list is None on complete failure.
    """
    for attempt in range(1, MAX_RETRIES + 1):
        try:
            resp = requests.get(url, params=params, timeout=TIMEOUT)
            resp.raise_for_status()
            body = resp.json()

            if not body.get("statusCode"):
                msg = body.get("msg", "Unknown error")
                logger.warning(f"  MOSPI API returned statusCode=false: {msg}")
                return [], None

            data = body.get("data", [])
            meta = body.get("meta_data")
            return data, meta

        except requests.exceptions.HTTPError as e:
            # 4xx/5xx — don't retry (bad params, endpoint doesn't exist)
            logger.warning(f"  MOSPI HTTP error: {e} — returning empty")
            return None, None

        except (
            requests.exceptions.Timeout,
            requests.exceptions.ConnectionError,
        ) as e:
            if attempt == MAX_RETRIES:
                logger.warning(
                    f"  MOSPI request failed after {MAX_RETRIES} attempts: {e}"
                )
                return None, None
            logger.info(f"  MOSPI retry {attempt}/{MAX_RETRIES}...")
            time.sleep(RETRY_DELAY_BASE * attempt)

        except (ValueError, KeyError) as e:
            # JSON parse error or unexpected response structure
            logger.warning(f"  MOSPI response parse error: {e}")
            return None, None

    return None, None
