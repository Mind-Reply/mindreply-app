# MindReply Model Intelligence Registry v1.0

**Status:** DRAFT / CANDIDATE INVENTORY  
**Prepared:** 2026-11-01  
**Canonical repository:** `Mind-Reply/mindreply-app`  
**Purpose:** Establish a provider-neutral catalogue for model evaluation and routing. This document does not claim that any listed model is available, integrated, licensed for a particular deployment, benchmarked, or running in MindReply.

## 1. Registry rules

Every candidate must be independently checked against the provider's official model documentation, release notes and terms before integration. Third-party model trackers and user-supplied lists are discovery leads only.

Do not infer an API identifier from a marketing name. Record the exact provider model ID returned by official documentation or the provider account. Record release state, regional availability, context limits, modalities, tool/function support, rate limits, pricing, data retention, training policy, licence/weights, hosting options and deprecation date where applicable.

A candidate may enter production routing only after:
1. Official release and access are confirmed.
2. Provider terms, privacy, data residency and security are reviewed.
3. Representative benchmark tasks are run against a fixed evaluation set.
4. Quality, latency, availability and total cost are measured.
5. Failure modes, fallback and human escalation are tested.
6. An owner-approved change is reviewed and released through the canonical repository.

## 2. Candidate inventory

All entries below are **UNVERIFIED CANDIDATES** as of the preparation date. Names are preserved from the supplied research list; spelling, version, release state and provider association may need correction.

| # | Supplied model name | Supplied provider | Candidate evaluation domain | Verification state |
|---:|---|---|---|---|
| 1 | GPT-6.1 Terra | OpenAI | General reasoning, tool use, orchestration | UNVERIFIED |
| 2 | GPT-6.1 Terra Pro | OpenAI | Complex engineering and reasoning | UNVERIFIED |
| 3 | GPT-6 Astra | OpenAI | Reasoning and independent review | UNVERIFIED |
| 4 | Claude Opus 5.5 | Anthropic | Complex research, architecture and coding | UNVERIFIED |
| 5 | Claude Sonnet 5.5 | Anthropic | Coding, specialist workflows and tool use | UNVERIFIED |
| 6 | Claude Haiku 5.5 | Anthropic | Lightweight classification and high-volume tasks | UNVERIFIED |
| 7 | Gemini 4 Argon | Google DeepMind | Multimodal reasoning and long-context evaluation | UNVERIFIED |
| 8 | EmbeddingGemma 2 | Google DeepMind | Embeddings and retrieval | UNVERIFIED |
| 9 | Qwen 3.8 Max | Alibaba | Reasoning, coding and deployment evaluation | UNVERIFIED |
| 10 | DeepSeek V4.1 Flash | DeepSeek | Efficient reasoning and agent workloads | UNVERIFIED |
| 11 | Kimi K3.1 Pro | Moonshot AI | Research and long-context evaluation | UNVERIFIED |
| 12 | Muse Wonder | Meta | Multimodal and agentic workflow evaluation | UNVERIFIED |
| 13 | Muse Spark Open | Meta | Open-weight / self-hosting eligibility review | UNVERIFIED |
| 14 | Llama 4 Maverick | Meta | Open-weight deployment and coding evaluation | UNVERIFIED |
| 15 | Llama 4 Scout | Meta | Efficient deployment and long-context evaluation | UNVERIFIED |
| 16 | Nemotron 3.5 Super VL | NVIDIA | Vision-language and technical document analysis | UNVERIFIED |
| 17 | Beam 1.0 (501B MoE) | Reflection AI | Coding and agentic workflow evaluation | UNVERIFIED |
| 18 | Mistral Large 4 | Mistral AI | Coding, reasoning and European hosting review | UNVERIFIED |
| 19 | Microsoft-Decision-1 | Microsoft | Classification, prioritisation and decision support | UNVERIFIED |
| 20 | Moondream 3.1 | Moondream | Vision and edge inference evaluation | UNVERIFIED |

## 3. Specialist routing domains

These are evaluation tracks, not fixed model assignments:

- **Reasoning and decision support:** multi-step analysis, calibrated uncertainty, structured decisions and source-grounded synthesis.
- **Software engineering:** repository understanding, code changes, tests, debugging and secure review.
- **Research and retrieval:** source discovery, citation integrity, synthesis and contradiction handling.
- **Vision and document intelligence:** image understanding, OCR, diagrams, technical documents and visual inspection.
- **Embeddings and retrieval:** retrieval quality, multilingual performance, indexing cost and recall.
- **Efficient execution:** latency, throughput, token cost, rate limits and graceful fallback.
- **Local and sovereign compute:** licence rights, weight availability, hardware requirements, quantisation quality, data control and operating cost.
- **Robotics research:** perception, simulation and supervised planning only. No direct physical actuation is enabled by this registry; robotics safety and control require a separate reviewed architecture.

## 4. Required per-model record

Before a model can be marked READY for evaluation, populate:

| Field | Required evidence |
|---|---|
| Canonical provider | Official provider documentation |
| Display name and exact API ID | Official model catalogue or authenticated provider metadata |
| Release status and date | Official release note |
| Access and regions | Provider account/API availability |
| Modalities and capabilities | Official model documentation |
| Context and output limits | Official technical documentation |
| Tool/function support | Official API documentation and test |
| Pricing and rate limits | Current provider pricing/limits |
| Data handling | Provider privacy and retention terms |
| Licence and weights | Official licence and distribution source |
| Hosting requirements | Provider deployment guide and hardware test |
| Evaluation results | Reproducible benchmark run with dataset/version |
| Operational metrics | Timestamped latency, error and cost measurements |
| Fallback | Tested alternate route and failure policy |
| Approval | Named owner decision and linked review record |

## 5. Evaluation protocol

Use a versioned, redacted task set covering:
- factual accuracy and source fidelity
- coding correctness and test completion
- instruction adherence and structured output validity
- tool-call accuracy and safe failure
- multilingual performance
- multimodal accuracy where relevant
- prompt-injection resistance and data-boundary handling
- latency percentiles, throughput and error rate
- cost per accepted task, not merely cost per token

Report scores by task family. Do not collapse all results into a single unsupported leaderboard. Keep test prompts, scoring rubric, model/API version, run timestamp and raw result references so comparisons can be reproduced.

## 6. Routing policy

The routing layer should select only among models that are verified, accessible and approved for the task's data classification. Routing decisions should consider:
1. task capability and evaluation score
2. data classification, residency and provider terms
3. reliability and current provider health
4. latency and throughput requirements
5. measured total cost
6. fallback availability

A provider outage or rate limit must fail safely. Do not silently route sensitive data to a different provider. Require explicit policy approval for any change in data destination.

## 7. Initial implementation sequence

1. Verify the 20 candidate names against official provider catalogues; correct or remove unsupported names.
2. Select a small evaluation cohort across at least three providers and two deployment modes (hosted and locally deployable, where legally and technically supported).
3. Define the shared evaluation dataset, scoring rubric and telemetry schema.
4. Build a read-only registry view before enabling automatic routing.
5. Run benchmark and failure-injection tests.
6. Propose routing rules with measured evidence.
7. Obtain owner approval before provider credentials, production routing, spending or customer-data processing are changed.

## 8. Current state and boundaries

- This is a documentation-only draft on a feature branch.
- No provider credentials or API keys are stored here.
- No model has been connected, benchmarked or enabled for routing by this document.
- No production configuration, database schema, deployment or billing setting has been changed.
- The supplied third-party links are research leads, not validation evidence.

**Next acceptance gate:** official-source verification of each candidate, followed by a versioned benchmark plan.