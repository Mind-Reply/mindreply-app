import json
import tempfile
import unittest
from pathlib import Path

from validate_results import REQUIRED, validate


def valid_record():
    record = {field: None for field in REQUIRED}
    record.update({
        "run_id": "run-1",
        "case_id": "ENG-001",
        "candidate_id": "mock-only",
        "provider": "offline",
        "exact_model_id": None,
        "environment": "offline_mock",
        "status": "not_run",
        "retry_count": 0,
    })
    return record


class ValidateResultsTests(unittest.TestCase):
    def validate_records(self, records):
        with tempfile.TemporaryDirectory() as directory:
            path = Path(directory) / "results.jsonl"
            path.write_text("\n".join(json.dumps(item) for item in records) + "\n", encoding="utf-8")
            return validate(path)

    def test_accepts_unknown_measurements_as_null(self):
        self.assertEqual(self.validate_records([valid_record()]), [])

    def test_rejects_missing_fields(self):
        record = valid_record()
        record.pop("reviewer_id")
        self.assertTrue(any("missing" in issue for issue in self.validate_records([record])))

    def test_rejects_out_of_range_score(self):
        record = valid_record()
        record["correctness_score"] = 101
        self.assertTrue(any("correctness_score" in issue for issue in self.validate_records([record])))

    def test_rejects_duplicate_run_case_candidate(self):
        record = valid_record()
        self.assertTrue(any("duplicate" in issue for issue in self.validate_records([record, record])))


if __name__ == "__main__":
    unittest.main()
