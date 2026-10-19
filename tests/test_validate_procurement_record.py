import importlib.util
import unittest
from pathlib import Path

MODULE_PATH = Path(__file__).resolve().parents[1] / "scripts" / "validate_procurement_record.py"
SPEC = importlib.util.spec_from_file_location("procurement_validator", MODULE_PATH)
validator = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(validator)


def base_record():
    return {
        "record_id": "proc-demo-001",
        "created_at": "2026-10-19T08:00:00+03:00",
        "category": "electronics_computing",
        "item": {"name": "Workstation GPU", "manufacturer": "Example", "sku": "GPU-001"},
        "quantity": 1,
        "currency": "EUR",
        "approval_state": "NOT_REQUESTED",
        "purchase_execution_enabled": False,
        "offers": [{
            "offer_id": "offer-001",
            "supplier": "Example Supplier",
            "source_url": "https://example.com/gpu",
            "status": "UNVERIFIED",
            "stock_state": "unknown",
            "unit_price": {"amount": 1000, "currency": "EUR"},
            "final_payable_total": None,
            "compatibility": "optional",
            "compatibility_evidence": "UNKNOWN",
            "compliance": "optional",
            "compliance_evidence": "UNKNOWN",
        }],
    }


class ProcurementRecordTests(unittest.TestCase):
    def test_valid_unverified_offer_is_allowed(self):
        self.assertEqual(validator.validate_record(base_record()), [])

    def test_rejects_automatic_purchase_execution(self):
        record = base_record()
        record["purchase_execution_enabled"] = True
        self.assertTrue(any("prohibited" in e for e in validator.validate_record(record)))

    def test_verified_offer_requires_allocated_stock_and_timestamp(self):
        record = base_record()
        record["offers"][0]["status"] = "VERIFIED"
        self.assertTrue(any("VERIFIED requires allocated stock" in e for e in validator.validate_record(record)))

    def test_rejects_duplicate_offer_ids(self):
        record = base_record()
        record["offers"].append(dict(record["offers"][0]))
        self.assertTrue(any("duplicate offer_id" in e for e in validator.validate_record(record)))

    def test_approval_must_bind_to_exact_offer_and_terms(self):
        record = base_record()
        record["approval_state"] = "APPROVED"
        record["approval"] = {"offer_id": "offer-001", "approved_at": "2026-10-19T08:00:00+03:00"}
        self.assertTrue(any("terms_fingerprint" in e for e in validator.validate_record(record)))

    def test_category_is_not_phone_specific(self):
        record = base_record()
        record["category"] = "infrastructure_energy"
        record["item"] = {"name": "Battery storage cabinet"}
        self.assertEqual(validator.validate_record(record), [])

    def test_required_compatibility_must_be_verified(self):
        record = base_record()
        record["offers"][0]["compatibility"] = "required"
        record["offers"][0]["compatibility_evidence"] = "UNKNOWN"
        self.assertTrue(any("compatibility requirement" in e for e in validator.validate_record(record)))


if __name__ == "__main__":
    unittest.main()
