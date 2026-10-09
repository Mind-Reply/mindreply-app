"""3650-live WhatsApp metrics connector.

This service owns WhatsApp ingress/egress and pushes measured LLM usage to the
Cloudflare Worker. It never sends a Stripe charge per message. Stripe billing
must consume aggregated, verified usage separately.
"""

import functools
import logging
import os
import time
from typing import Any

import requests
from flask import Flask, request

logging.basicConfig(level=logging.INFO, format="%(asctime)s | %(levelname)s | %(message)s")
app = Flask(__name__)

INPUT_COST_PER_TOKEN = 1.25 / 1_000_000
OUTPUT_COST_PER_TOKEN = 5.00 / 1_000_000
HARD_COST_CEILING_USD = 0.30

CF_WORKER_URL = os.environ["CF_WORKER_URL"]
METRICS_SECRET = os.environ["METRICS_SECRET"]
WHATSAPP_TOKEN = os.environ["WHATSAPP_TOKEN"]
WHATSAPP_PHONE_ID = os.environ["WHATSAPP_PHONE_ID"]


def track_unit_economics(func):
    @functools.wraps(func)
    def wrapper(*args, **kwargs):
        start = time.perf_counter()
        response = func(*args, **kwargs)
        elapsed = round(time.perf_counter() - start, 3)

        usage = getattr(response, "usage", None)
        pt = getattr(usage, "prompt_tokens", 0) or getattr(usage, "input_tokens", 0) if usage else 0
        ct = getattr(usage, "completion_tokens", 0) or getattr(usage, "output_tokens", 0) if usage else 0
        cost = round(pt * INPUT_COST_PER_TOKEN + ct * OUTPUT_COST_PER_TOKEN, 6)

        telemetry = {
            "event_id": getattr(response, "event_id", None),
            "function": func.__name__,
            "prompt_tokens": pt,
            "completion_tokens": ct,
            "latency_sec": elapsed,
            "direct_cost_usd": cost,
            "status": "BREACH" if cost > HARD_COST_CEILING_USD else "PASS",
        }

        if telemetry["status"] == "BREACH":
            logging.error("[COST KILL] %s $%.6f > $%.2f", func.__name__, cost, HARD_COST_CEILING_USD)
        else:
            logging.info("[TELEMETRY] %.3fs | $%.6f | %s tok", elapsed, cost, pt + ct)

        try:
            requests.post(
                CF_WORKER_URL,
                json=telemetry,
                headers={"x-metrics-secret": METRICS_SECRET},
                timeout=2,
            ).raise_for_status()
        except Exception as exc:
            logging.warning("metrics push failed: %s", exc)

        return response, telemetry

    return wrapper


@track_unit_economics
def call_llm(prompt: str) -> Any:
    raise RuntimeError("Implement the real LLM provider call before enabling production WhatsApp traffic")


def send_whatsapp(to: str, text: str) -> None:
    url = f"https://graph.facebook.com/v20.0/{WHATSAPP_PHONE_ID}/messages"
    response = requests.post(
        url,
        headers={"Authorization": f"Bearer {WHATSAPP_TOKEN}"},
        json={
            "messaging_product": "whatsapp",
            "to": to,
            "text": {"body": text[:4000]},
        },
        timeout=5,
    )
    response.raise_for_status()


@app.route("/webhook", methods=["POST"])
def webhook():
    data = request.get_json(silent=True) or {}
    try:
        msg = data["entry"][0]["changes"][0]["value"]["messages"][0]
        from_number = msg["from"]
        text = msg["text"]["body"]
    except (KeyError, IndexError, TypeError):
        return {"ok": True}, 200

    try:
        response, telemetry = call_llm(text)
    except RuntimeError as exc:
        logging.error("%s", exc)
        return {"ok": False, "error": "LLM provider not configured"}, 503

    if telemetry["status"] == "BREACH":
        send_whatsapp(
            from_number,
            "This query is too heavy ($%.2f > $0.30 ceiling). Try shorter."
            % telemetry["direct_cost_usd"],
        )
        return {"blocked": True, "telemetry": telemetry}, 200

    send_whatsapp(from_number, getattr(response, "content", str(response)))
    return {"billable": True, "telemetry": telemetry}, 200


@app.get("/")
def home():
    return "wsapp whatsapp + 3650-live connected — protections configured"


if __name__ == "__main__":
    app.run(port=int(os.getenv("PORT", "5000")))
