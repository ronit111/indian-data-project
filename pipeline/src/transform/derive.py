"""
Derived metrics: % of total, YoY change, per-capita, human context strings.
"""

POPULATION = 1_450_000_000  # 2025 estimate


def percent_of_total(amount: float, total: float) -> float:
    """Compute percentage of total, rounded to 1 decimal."""
    if total == 0:
        return 0.0
    return round(amount / total * 100, 1)


def yoy_change(current: float, previous: float | None) -> float | None:
    """Compute year-over-year percentage change."""
    if previous is None or previous == 0:
        return None
    return round((current - previous) / previous * 100, 1)


def per_capita(amount_crore: float, population: int = POPULATION) -> float:
    """Convert Rs crore to per-capita Rs."""
    if population <= 0:
        return 0.0
    # 1 crore = 10,000,000
    total_rs = amount_crore * 1e7
    return round(total_rs / population, 0)


def per_capita_daily(amount_crore: float, population: int = POPULATION) -> float:
    """Convert Rs crore to per-capita-per-day Rs."""
    yearly = per_capita(amount_crore, population)
    return round(yearly / 365, 2)


# Human context generators for specific ministries
HUMAN_CONTEXTS: dict[str, callable] = {}


def _context_interest(amount: float) -> str:
    daily = per_capita_daily(amount)
    return f"Rs {daily:.0f} per citizen per day goes to paying interest on past debt"


def _context_defence(amount: float) -> str:
    # Tejas costs ~500 crore each
    jets = int(amount / 500)
    return f"Enough to buy {jets:,} Tejas fighter jets"


def _context_education(amount: float) -> str:
    daily = per_capita_daily(amount)
    return f"About Rs {daily:.1f} per citizen per day on education"


def _context_health(amount: float) -> str:
    daily = per_capita_daily(amount)
    return f"Rs {daily:.2f} per citizen per day on public healthcare"


def _context_rural(amount: float) -> str:
    return "Covers MGNREGA, rural housing, and road construction"


def _context_agriculture(amount: float) -> str:
    return "PM-KISAN alone puts Rs 6,000/year in 80 million farmer accounts"


def _context_railways(amount: float) -> str:
    return "India runs 13,500+ trains daily, carrying 24 million passengers"


def _context_home_affairs(amount: float) -> str:
    return "Covers police, border security, and disaster response"


def _context_road_transport(amount: float) -> str:
    return "Building 27 km of highway per day"


def _context_transfers(amount: float) -> str:
    return "Nearly 1 in 4 rupees goes directly to state governments"


def _context_subsidies(amount: float) -> str:
    return "Provides subsidized food to 80 crore people under NFSA"


HUMAN_CONTEXTS = {
    "interest-payments": _context_interest,
    "defence": _context_defence,
    "education": _context_education,
    "health": _context_health,
    "rural-development": _context_rural,
    "agriculture": _context_agriculture,
    "railways": _context_railways,
    "home-affairs": _context_home_affairs,
    "road-transport": _context_road_transport,
    "transfers-to-states": _context_transfers,
    "subsidies": _context_subsidies,
}


def human_context(ministry_id: str, amount: float) -> str:
    """Generate a human-readable context string for a ministry's budget."""
    fn = HUMAN_CONTEXTS.get(ministry_id)
    if fn:
        return fn(amount)
    daily = per_capita_daily(amount)
    return f"Rs {daily:.1f} per citizen per day"
