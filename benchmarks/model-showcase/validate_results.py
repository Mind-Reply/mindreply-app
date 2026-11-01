import json
import sys
from pathlib import Path

REQUIRED = {
    "run_id", "case_id", "candidate_id", "provider", "exact_model_id",
    "model_version", "prompt_version", "fixture_version", "run_timestamp",
    "environment", "status", "correctness_score", "reviewer_score",
    "reviewer_notes", "latency_ms", "input_tokens", "output_tokens",
    "measured_cost", "cost_currency", "tool_call_outcome", "retry_count",
    "artifact_uri", "evidence_uri", "reviewer_id", "verification_status",
}
ENVIRONMENTS = {"offline_mock", "isolated_test", "approved_provider_test"}
STATUSES = {"pass", "fail", "error", "unsupported", "not_run"}

def validate(path):
    errors = []
    seen = set()
    for number, line in enumerate(Path(path).read_text(encoding="utf-8").splitlines(), 1):
        try:
            item = json.loads(line)
        except json.JSONDecodeError as exc:
            errors.append(f"line {number}: invalid JSON: {exc}")
            continue
        if not isinstance(item, dict):
            errors.append(f"line {number}: expected an object")
            continue
        missing = REQUIRED - item.keys()
        if missing:
            errors.append(f"line {number}: missing {', '.join(sorted(missing))}")
            continue
        key = (item["run_id"], item["case_id"], item["candidate_id"])
        if key in seen:
            errors.append(f"line {number}: duplicate run/case/candidate")
        seen.add(key)
        if item["environment"] not in ENVIRONMENTS:
            errors.append(f"line {number}: invalid environment")
        if item["status"] not in STATUSES:
            errors.append(f"line {number}: invalid status")
        for field in ("correctness_score", "reviewer_score"):
            value = item[field]
            if value is not None and (not isinstance(value, (int, float)) or not 0 <= value <= 100):
                errors.append(f"line {number}: invalid {field}")
        for field in ("latency_ms", "input_tokens", "output_tokens", "measured_cost", "retry_count"):
            value = item[field]
            if value is not None and (not isinstance(value, (int, float)) or value < 0):
                errors.append(f"line {number}: invalid {field}")
    return errors

if __name__ == "__main__":
    if len(sys.argv) != 2:
        raise SystemExit("Usage: python validate_results.py results.jsonl")
    issues = validate(sys.argv[1])
    if issues:
        print("\n".join(issues))
        raise SystemExit(1)
    print("PASS: result file structure is valid. Evidence truth requires independent review.")
