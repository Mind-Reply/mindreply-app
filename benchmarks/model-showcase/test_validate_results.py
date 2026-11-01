import json
import tempfile
import unittest
from pathlib import Path

from validate_results import REQUIRED, validate

ROOT = Path(__file__).parent


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

    def test_cohort_has_twenty_unique_candidates_and_no_unverified_ids(self):
        cohort = json.loads((ROOT / "cohort.json").read_text(encoding="utf-8"))
        candidates = cohort["candidates"]
        self.assertEqual(len(candidates), 20)
        ids = [item["candidate_id"] for item in candidates]
        self.assertEqual(len(ids), len(set(ids)))
        for item in candidates:
            if item["identity_status"] == "unverified":
                self.assertIsNone(item["provider_model_id"])
            if item["provider_model_id"]:
                self.assertTrue(item["official_source_url"])

    def test_case_set_has_unique_ids_and_fixture_version(self):
        rows = [
            json.loads(line)
            for line in (ROOT / "cases.jsonl").read_text(encoding="utf-8").splitlines()
            if line.strip()
        ]
        self.assertGreaterEqual(len(rows), 4)
        ids = [row["case_id"] for row in rows]
        self.assertEqual(len(ids), len(set(ids)))
        self.assertTrue(all(row["fixture_version"] for row in rows))


if __name__ == "__main__":
    unittest.main()
