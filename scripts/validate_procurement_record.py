#!/usr/bin/env python3
"""Validate category-independent procurement records without external dependencies."""
from __future__ import annotations

import json
import sys
from pathlib import Path
from urllib.parse import urlparse

ROOT = Path(__file__).resolve().parents[1]
RECORD_DIR = ROOT / "evidence" / "procurement"
CATEGORIES = {
    "electronics_computing", "infrastructure_energy", "transport_fleet",
    "business_office", "property_facilities", "industrial_specialist", "other",
}
STATUSES = {"DRAFT", "VERIFIED", "BLOCKED", "REJECTED"}
STOCK_STATES = {"allocated", "in_stock_unallocated", "preorder", "out_of_stock", "unknown"}
APPROVAL_STATES = {"NOT_REQUESTED", "PENDING", "APPROVED", "REJECTED", "EXPIRED"}
REQUIRED = {
    "record_id", "created_at", "category", "item", "quantity", "currency",
    "offers", "approval_state", "purchase_execution_enabled",
}


def validate_record(record: object, label: str = "record") -> list[str]:
    errors: list[str] = []
    if not isinstance(record, dict):
        return [f"{label}: expected a JSON object"]

    missing = sorted(REQUIRED - record.keys())
    if missing:
        errors.append(f"{label}: missing required fields: {', '.join(missing)}")
        return errors

    if not isinstance(record["record_id"], str) or not record["record_id"].strip():
        errors.append(f"{label}: record_id must be non-empty text")
    if record["category"] not in CATEGORIES:
        errors.append(f"{label}: unsupported category {record['category']!r}")
    if not isinstance(record["item"], dict) or not isinstance(record["item"].get("name"), str) or not record["item"]["name"].strip():
        errors.append(f"{label}: item.name must be non-empty text")
    if not isinstance(record["quantity"], int) or isinstance(record["quantity"], bool) or record["quantity"] < 1:
        errors.append(f"{label}: quantity must be a positive integer")
    if not isinstance(record["currency"], str) or len(record["currency"]) != 3 or not record["currency"].isalpha():
        errors.append(f"{label}: currency must be a three-letter code")
    if record["approval_state"] not in APPROVAL_STATES:
        errors.append(f"{label}: invalid approval_state")
    if not isinstance(record["purchase_execution_enabled"], bool):
        errors.append(f"{label}: purchase_execution_enabled must be boolean")
    elif record["purchase_execution_enabled"]:
        errors.append(f"{label}: automated purchase execution is prohibited by this validator")

    if not isinstance(record["offers"], list):
        errors.append(f"{label}: offers must be a list")
        return errors

    seen = set()
    for index, offer in enumerate(record["offers"], start=1):
        prefix = f"{label}: offers[{index}]"
        if not isinstance(offer, dict):
            errors.append(f"{prefix} must be an object")
            continue
        offer_id = offer.get("offer_id")
        if not isinstance(offer_id, str) or not offer_id.strip():
            errors.append(f"{prefix}.offer_id must be non-empty text")
        elif offer_id in seen:
            errors.append(f"{prefix}: duplicate offer_id {offer_id!r}")
        else:
            seen.add(offer_id)
        if not isinstance(offer.get("supplier"), str) or not offer["supplier"].strip():
            errors.append(f"{prefix}.supplier must be non-empty text")
        source = offer.get("source_url")
        parsed = urlparse(source) if isinstance(source, str) else None
        if not parsed or parsed.scheme != "https" or not parsed.netloc:
            errors.append(f"{prefix}.source_url must be an absolute HTTPS URL")
        stock = offer.get("stock_state")
        if stock not in STOCK_STATES:
            errors.append(f"{prefix}.stock_state is invalid")
        price = offer.get("unit_price")
        if not isinstance(price, dict) or not isinstance(price.get("amount"), (int, float)) or isinstance(price.get("amount"), bool) or price.get("amount", -1) < 0:
            errors.append(f"{prefix}.unit_price requires a non-negative numeric amount")
        elif price.get("currency") != record["currency"]:
            errors.append(f"{prefix}.unit_price currency must match record currency")
        if offer.get("status") not in STATUSES:
            errors.append(f"{prefix}.status is invalid")
        if offer.get("status") == "VERIFIED" and (stock != "allocated" or not offer.get("evidence_timestamp")):
            errors.append(f"{prefix}: VERIFIED requires allocated stock and evidence_timestamp")
        if offer.get("final_payable_total") is not None:
            total = offer["final_payable_total"]
            if not isinstance(total, dict) or not isinstance(total.get("amount"), (int, float)) or isinstance(total.get("amount"), bool) or total.get("amount", -1) < 0:
                errors.append(f"{prefix}.final_payable_total requires a non-negative numeric amount")
            elif total.get("currency") != record["currency"]:
                errors.append(f"{prefix}.final_payable_total currency must match record currency")
        if offer.get("compatibility") == "required" and offer.get("compatibility_evidence") != "VERIFIED":
            errors.append(f"{prefix}: compatibility requirement lacks verified evidence")
        if offer.get("compliance") == "required" and offer.get("compliance_evidence") != "VERIFIED":
            errors.append(f"{prefix}: compliance requirement lacks verified evidence")

    if record["approval_state"] == "APPROVED":
        approval = record.get("approval")
        if not isinstance(approval, dict) or not all(approval.get(key) for key in ("offer_id", "approved_at", "terms_fingerprint")):
            errors.append(f"{label}: APPROVED requires offer_id, approved_at, and terms_fingerprint")
        elif approval["offer_id"] not in seen:
            errors.append(f"{label}: approval references an unknown offer_id")
    return errors


def main() -> int:
    files = sorted(RECORD_DIR.glob("*.json")) if RECORD_DIR.exists() else []
    errors: list[str] = []
    count = 0
    for path in files:
        try:
            payload = json.loads(path.read_text(encoding="utf-8"))
        except (OSError, json.JSONDecodeError) as exc:
            errors.append(f"{path.relative_to(ROOT)}: invalid JSON ({exc})")
            continue
        records = payload if isinstance(payload, list) else [payload]
        count += len(records)
        for index, record in enumerate(records, start=1):
            errors.extend(validate_record(record, f"{path.relative_to(ROOT)}[{index}]"))
    if errors:
        print("\n".join(f"ERROR: {error}" for error in errors))
        return 1
    print(f"PASS: {count} procurement record(s) across {len(files)} file(s) validated.")
    if not files:
        print("No procurement records exist; no supplier offer or purchase is asserted.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
