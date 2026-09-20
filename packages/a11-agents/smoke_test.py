#!/usr/bin/env python3
"""
A11 agent hierarchy smoke test.
Runs without google-adk or network. Safe to execute anywhere.
"""

from __future__ import annotations

from hierarchy import AGENTS, root_agent, list_names, get


def main() -> int:
    names = list_names()
    assert root_agent.name == "a11_ceo_private", "Root must be a11_ceo_private"
    assert len(names) == 8, f"Expected 8 agents, got {len(names)}"
    assert set(root_agent.sub_agents) <= set(names), "Sub-agent names must exist"

    for name in names:
        agent = get(name)
        assert agent is not None
        assert agent.name == name
        assert agent.instruction.strip(), f"{name} missing instruction"
        assert agent.mutation_policy in {
            "approval_required",
            "owner_approval_token_required",
            "blocked",
        }, f"{name} has invalid mutation_policy"

    # Security and robotics stay plan-only / blocked by default
    assert get("a11_security_network_architect").mutation_policy == "blocked"
    assert get("a11_robotics_coordinator").mutation_policy == "blocked"

    print("VERIFIED")
    print(f"Root: {root_agent.name}")
    print("Hierarchy:")
    for name in sorted(names):
        a = AGENTS[name]
        print(f"  - {a.name}  [{a.default_mode} / {a.mutation_policy}]")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
