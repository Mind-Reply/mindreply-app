import importlib.util
import unittest
from pathlib import Path

MODULE_PATH = Path(__file__).resolve().parents[1] / "scripts" / "validate_fulfilment_evidence.py"
SPEC = importlib.util.spec_from_file_location("fulfilment_validator", MODULE_PATH)
validator = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(validator)


def base_record():
    return {
        "observed_at": "2026-10-18T13:14:00+03:00",
        "status": "VERIFIED",
        "observation_type": "seller_listing",
        "configuration": {"model": "iPhone 18 Pro Max", "storage_gb": 512, "finish": "Black"},
        "source_url": "https://example.com/product",
        "observed_value": "Listing page says preorder",
        "missing_evidence": ["allocated stock", "final payable total"],
        "next_action": "Recheck seller-owned stock evidence",
        "stock_state": "preorder",
    }


class FulfilmentEvidenceTests(unittest.TestCase):
    def test_valid_public_listing_record(self):
        self.assertEqual(validator.validate_record(base_record()), [])

    def test_rejects_timestamp_without_timezone(self):
        record = base_record()
        record["observed_at"] = "2026-10-18T13:14:00"
        self.assertTrue(any("timezone" in e for e in validator.validate_record(record)))

    def test_rejects_non_https_source(self):
        record = base_record()
        record["source_url"] = "http://example.com/product"
        self.assertTrue(any("HTTPS" in e for e in validator.validate_record(record)))

    def test_unknown_delivery_cannot_be_verified(self):
        record = base_record()
        record["observation_type"] = "delivery"
        record["destination_eligibility"] = "unknown"
        self.assertTrue(any("cannot be marked VERIFIED" in e for e in validator.validate_record(record)))

    def test_allocated_stock_requires_verified_status(self):
        record = base_record()
        record["stock_state"] = "allocated"
        record["status"] = "UNVERIFIED"
        self.assertTrue(any("allocated stock requires status VERIFIED" in e for e in validator.validate_record(record)))

    def test_order_event_requires_direct_reference(self):
        record = base_record()
        record["observation_type"] = "order"
        self.assertTrue(any("requires a direct event_reference" in e for e in validator.validate_record(record)))


if __name__ == "__main__":
    unittest.main()
