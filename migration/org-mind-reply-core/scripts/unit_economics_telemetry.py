"""Unit-economics telemetry for model pipeline calls.

Measures token usage, latency, and estimated direct model cost without
logging prompts, completions, credentials, or response contents.

The ceiling is an observation/kill signal for the caller: this module does
not silently terminate an in-flight provider request.
"""

import functools
import logging
import time
from typing import Any, Callable, TypeVar, cast

INPUT_COST_PER_TOKEN = 1.25 / 1_000_000
OUTPUT_COST_PER_TOKEN = 5.00 / 1_000_000
HARD_COST_CEILING_USD = 0.30

F = TypeVar("F", bound=Callable[..., Any])

logger = logging.getLogger(__name__)


def _read_usage(response: Any) -> tuple[int, int]:
    usage = getattr(response, "usage", None)
    if usage is None and isinstance(response, dict):
        usage = response.get("usage")

    if usage is None:
        return 0, 0

    def read(name: str) -> Any:
        if isinstance(usage, dict):
            return usage.get(name)
        return getattr(usage, name, None)

    prompt_tokens = read("prompt_tokens") or read("input_tokens") or 0
    completion_tokens = read("completion_tokens") or read("output_tokens") or 0
    return int(prompt_tokens), int(completion_tokens)


def track_unit_economics(func: F) -> F:
    """Decorate a model call with token, latency, and direct-cost telemetry."""

    @functools.wraps(func)
    def wrapper(*args: Any, **kwargs: Any) -> Any:
        start_time = time.perf_counter()

        response = func(*args, **kwargs)

        elapsed_seconds = round(time.perf_counter() - start_time, 3)
        prompt_tokens, completion_tokens = _read_usage(response)

        direct_cost = round(
            (prompt_tokens * INPUT_COST_PER_TOKEN)
            + (completion_tokens * OUTPUT_COST_PER_TOKEN),
            4,
        )

        telemetry = {
            "function": func.__name__,
            "prompt_tokens": prompt_tokens,
            "completion_tokens": completion_tokens,
            "latency_sec": elapsed_seconds,
            "direct_cost_usd": direct_cost,
            "status": (
                "PASS"
                if direct_cost <= HARD_COST_CEILING_USD
                else "BREACH"
            ),
        }

        if telemetry["status"] == "BREACH":
            logger.error(
                "[COST KILL TRIGGERED] %s cost $%.4f > $%.2f",
                func.__name__,
                direct_cost,
                HARD_COST_CEILING_USD,
            )
        else:
            logger.info(
                "[TELEMETRY] Latency: %.3fs | Cost: $%.4f | Tokens: %d",
                elapsed_seconds,
                direct_cost,
                prompt_tokens + completion_tokens,
            )

        return response, telemetry

    return cast(F, wrapper)


if __name__ == "__main__":
    logging.basicConfig(
        level=logging.INFO,
        format="%(asctime)s | %(levelname)s | %(message)s",
    )

    class Usage:
        prompt_tokens = 1000
        completion_tokens = 500

    class Response:
        usage = Usage()

    @track_unit_economics
    def smoke_test() -> Response:
        return Response()

    result, telemetry = smoke_test()
    assert telemetry["prompt_tokens"] == 1000
    assert telemetry["completion_tokens"] == 500
    assert telemetry["status"] == "PASS"
    assert result is not None
    print("unit-economics telemetry smoke test: PASS")
