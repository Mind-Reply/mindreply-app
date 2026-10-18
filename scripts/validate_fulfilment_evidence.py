#!/usr/bin/env python3
"""Validate append-only fulfilment evidence records without external dependencies."""
from __future__ import annotations

import json
import sys
from datetime import datetime
from pathlib import Path
from urllib.parse import urlparse

ROOT = Path(__file__).resolve().parents[1]
EVIDENCE_DIR = ROOT / "evidence" / "fulfilment"
STATUSES = {"VERIFIED", "BLOCKED", "FAILED", "UNVERIFIED"}
STOCK_STATES = {"allocated", "in_stock_unallocated", "preorder", "out_of_stock", "unknown"}
OBSERVATION_TYPES = {
    "seller_listing", "price_stock", "delivery", "terms", "order",
    "dispatch", "carrier_event", "delivery_proof", "setup",
}
REQUIRED = {
    "observed_at", "status", "observation_type", "configuration",
    "source_url", "observed_value", "missing_evidence", "next_action", "stock_state",
}
CONFIG_REQUIRED = {"model", "storage_gb", "finish"}


def validate_record(record: object, label: str = "record") -> list[str]:
    errors: list[str] = []
    if not isinstance(record, dict):
        return [f"{label}: expected a JSON object"]
    missing = sorted(REQUIRED - record.keys())
    if missing:
        errors.append(f"{label}: missing required fields: {', '.join(missing)}")

    status = record.get("status")
    if status is not None and status not in STATUSES:
        errors.append(f"{label}: invalid status {status!r}")
    kind = record.get("observation_type")
    if kind is not None and kind not in OBSERVATION_TYPES:
        errors.append(f"{label}: invalid observation_type {kind!r}")
    stock = record.get("stock_state")
    if stock is not None and stock not in STOCK_STATES:
        errors.append(f"{label}: invalid stock_state {stock!r}")

    timestamp = record.get("observed_at")
    if timestamp is not None:
        try:
            parsed = datetime.fromisoformat(timestamp.replace("Z", "+00:00"))
            if parsed.tzinfo is None:
                errors.append(f"{label}: observed_at must include a timezone")
        except (AttributeError, TypeError, ValueError):
            errors.append(f"{label}: observed_at must be ISO 8601 with timezone")

    source = record.get("source_url")
    if source is not None:
        parsed_url = urlparse(source) if isinstance(source, str) else None
        if not parsed_url or parsed_url.scheme != "https" or not parsed_url.netloc:
            errors.append(f"{label}: source_url must be an absolute HTTPS URL")

    config = record.get("configuration")
    if not isinstance(config, dict):
        errors.append(f"{label}: configuration must be an object")
    else:
        missing_config = sorted(CONFIG_REQUIRED - config.keys())
        if missing_config:
            errors.append(f"{label}: configuration missing: {', '.join(missing_config)}")
        if "storage_gb" in config and (not isinstance(config["storage_gb"], int) or config["storage_gb"] <= 0):
            errors.append(f"{label}: configuration.storage_gb must be a positive integer")

    if not isinstance(record.get("missing_evidence"), list):
        errors.append(f"{label}: missing_evidence must be a list")
    for field in ("observed_value", "next_action"):
        if field in record and not isinstance(record[field], (str, dict, list)):
            errors.append(f"{label}: {field} must be text, object, or list")

    for field in ("displayed_price", "final_payable_total"):
        value = record.get(field)
        if value is not None:
            if not isinstance(value, dict) or not isinstance(value.get("amount"), (int, float)) or not isinstance(value.get("currency"), str):
                errors.append(f"{label}: {field} must be an object with numeric amount and currency")
            elif value["amount"] < 0 or not value["currency"].strip():
                errors.append(f"{label}: {field} amount must be non-negative and currency non-empty")

    if record.get("stock_state") == "allocated" and status != "VERIFIED":
        errors.append(f"{label}: allocated stock requires status VERIFIED")
    if kind == "delivery" and record.get("destination_eligibility") not in {"verified", "unknown"}:
        errors.append(f"{label}: delivery records must explicitly set destination_eligibility to verified or unknown")
    if kind == "delivery" and record.get("destination_eligibility") == "unknown" and status == "VERIFIED":
        errors.append(f"{label}: unknown destination eligibility cannot be marked VERIFIED")
    if kind in {"order", "dispatch", "carrier_event", "delivery_proof", "setup"} and not record.get("event_reference"):
        errors.append(f"{label}: {kind} requires a direct event_reference")
    return errors


def main() -> int:
    files = sorted(EVIDENCE_DIR.glob("*.json")) if EVIDENCE_DIR.exists() else []
    errors: list[str] = []
    for path in files:
        try:
            payload = json.loads(path.read_text(encoding="utf-8"))
        except (OSError, json.JSONDecodeError) as exc:
            errors.append(f"{path.relative_to(ROOT)}: cannot read valid JSON ({exc})")
            continue
        records = payload if isinstance(payload, list) else [payload]
        for index, record in enumerate(records, start=1):
            errors.extend(validate_record(record, f"{path.relative_to(ROOT)}[{index}]"))

    if errors:
        print("\n".join(f"ERROR: {error}" for error in errors))
        return 1
    print(f"PASS: {len(files)} fulfilment evidence file(s) validated.")
    if not files:
        print("No evidence records exist yet; no offer or fulfilment milestone is asserted.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
