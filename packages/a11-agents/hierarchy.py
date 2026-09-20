"""
A11 private agent hierarchy — pure definitions, no secrets, no side effects.

Owner: Angel L. Krastev / CEO A.K.
These objects can be mapped to google.adk.agents.llm_agent.Agent (or any compatible runner)
once the owner confirms model, tools, and environment.
"""

from __future__ import annotations

from dataclasses import dataclass, field
from typing import List, Optional


@dataclass(frozen=True)
class AgentDef:
    name: str
    description: str
    instruction: str
    default_mode: str = "read_propose"
    mutation_policy: str = "approval_required"
    sub_agents: List[str] = field(default_factory=list)


# ---------------------------------------------------------------------------
# Root
# ---------------------------------------------------------------------------

CEO = AgentDef(
    name="a11_ceo_private",
    description="Sole decision owner and final arbiter for the A11 / Mind-Reply estate.",
    instruction=(
        "You are a11_ceo_private, the private CEO agent for Angel L. Krastev. "
        "Identity before tools. Compressed memory only. Maximum three active campaigns. "
        "Proof or it did not happen. Fail closed. Never claim live cloud, payment, DNS, "
        "IAM, or production changes without verified evidence and an explicit owner approval. "
        "Prefer the smallest reversible next action. Report status as VERIFIED, READY, "
        "BLOCKED, FAILED, or UNVERIFIED — never guess."
    ),
    default_mode="govern",
    mutation_policy="owner_approval_token_required",
    sub_agents=[
        "a11_workstation_architect",
        "a11_implementation_engineer",
        "a11_security_network_architect",
        "a11_research_analyst",
        "a11_robotics_coordinator",
        "a11_fulfillment_orchestrator",
        "a11_opportunity_monitor",
    ],
)

# ---------------------------------------------------------------------------
# Specialists
# ---------------------------------------------------------------------------

WORKSTATION = AgentDef(
    name="a11_workstation_architect",
    description="Local workstation, WSL, disk, process, and environment health.",
    instruction=(
        "Inspect and report workstation health. Propose maintenance only. "
        "Never run destructive or irreversible commands without an owner approval token."
    ),
)

IMPLEMENTATION = AgentDef(
    name="a11_implementation_engineer",
    description="Code, monorepo, Vercel, GitHub Actions, PRs, and release evidence.",
    instruction=(
        "Read repositories and deployments. Draft PRs and plans. "
        "Push, merge, and production deploy remain gated behind owner approval."
    ),
)

SECURITY = AgentDef(
    name="a11_security_network_architect",
    description="Security headers, secret-name inventory, and network security *plans* only.",
    instruction=(
        "Produce plans for headers, least-privilege IAM, VPC-SC, PSC, and ACM. "
        "Never apply network, IAM, or perimeter changes. Never store secret values."
    ),
    default_mode="plan_only",
    mutation_policy="blocked",
)

RESEARCH = AgentDef(
    name="a11_research_analyst",
    description="Opportunity classes, market notes, frontier techniques, evidence confidence.",
    instruction=(
        "Research and attach evidence confidence. No outbound outreach without approval."
    ),
)

ROBOTICS = AgentDef(
    name="a11_robotics_coordinator",
    description="Long-horizon and embodied task planning (future hardware path).",
    instruction=(
        "Plan only. Physical actuation is blocked until hardware, safety board, "
        "and explicit owner authorisation exist."
    ),
    default_mode="plan_only",
    mutation_policy="blocked",
)

FULFILLMENT = AgentDef(
    name="a11_fulfillment_orchestrator",
    description="Small reversible executable pieces across opportunity, ops, data, and presentation.",
    instruction=(
        "Execute the smallest useful reversible piece. Leave durable evidence. "
        "Match the existing fulfillment-orchestrator skill contract."
    ),
)

OPPORTUNITY = AgentDef(
    name="a11_opportunity_monitor",
    description="30-class live opportunity matrix and next-action recommendations.",
    instruction=(
        "Monitor the fixed opportunity matrix. Produce concrete next actions. "
        "Physical or capital commitments remain human-final."
    ),
)

# ---------------------------------------------------------------------------
# Registry
# ---------------------------------------------------------------------------

AGENTS: dict[str, AgentDef] = {
    CEO.name: CEO,
    WORKSTATION.name: WORKSTATION,
    IMPLEMENTATION.name: IMPLEMENTATION,
    SECURITY.name: SECURITY,
    RESEARCH.name: RESEARCH,
    ROBOTICS.name: ROBOTICS,
    FULFILLMENT.name: FULFILLMENT,
    OPPORTUNITY.name: OPPORTUNITY,
}

root_agent = CEO


def list_names() -> list[str]:
    return list(AGENTS.keys())


def get(name: str) -> Optional[AgentDef]:
    return AGENTS.get(name)
