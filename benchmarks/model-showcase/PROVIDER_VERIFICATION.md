# Official provider identity verification

Checked 1 November 2026 against official provider documentation. This is public documentation verification only; it does not confirm API entitlement, account access, quota, pricing approval, deployment or region availability in MindReply.

| Submitted candidate | Official identity result | Exact serving identifier | State |
|---|---|---|---|
| GPT-6.1 Terra | Confirmed in OpenAI API model directory | `gpt-6.1-terra` | API ID verified; account access untested |
| GPT-6.1 Terra Pro | No official exact product/ID match found in the checked directory | — | Unverified; do not configure |
| GPT-6 Astra | Confirmed in OpenAI API model directory | `gpt-6-astra` | API ID verified; account access untested |
| Claude Opus 5.5 | Confirmed in Anthropic model overview | `claude-opus-5-5` | API ID verified; account access untested |
| Claude Sonnet 5.5 | Confirmed in Anthropic model overview | `claude-sonnet-5-5` | API ID verified; account access untested |
| Claude Haiku 5.5 | Confirmed in Anthropic model overview | `claude-haiku-5-5` | API ID verified; account access untested |
| Gemini 4 Argon | Confirmed in Google Gemini API model docs | `gemini-4-argon` | API ID verified; account access untested |
| EmbeddingGemma 2 | Confirmed; Google model repository ID documented | `google/embeddinggemma-2` (downloadable model ID, not a hosted API endpoint) | Model ID verified; self-hosted runtime route pending |
| Qwen 3.8 Max | Confirmed in Alibaba Cloud Model Studio catalogue | `qwen3.8-max` | API model ID verified; account access untested |
| DeepSeek V4.1 Flash | Confirmed; current API alias resolves to V4.1 Flash 1017 | `deepseek-flash` | API alias verified; pin release in run record |
| Kimi K3.1 Pro | Exact submitted name not confirmed; Alibaba's official catalogue lists `kimi-k3` | No exact ID for the submitted K3.1 Pro tier | Candidate-name mismatch; do not map to `kimi-k3` without owner confirmation |
| Muse Wonder | Confirmed in Meta Model API docs | `muse-wonder-1.0` | API ID verified; account access untested |
| Muse Spark Open | Confirmed Meta open-weight release; self-host or hosted inference partner | No direct Meta Model API ID; serving route must be selected | Weights verified; hosted route pending |
| Llama 4 Maverick | Confirmed in Meta model catalogue | Exact serving ID depends on runtime/provider | Model verified; serving ID pending |
| Llama 4 Scout | Confirmed in Meta model catalogue | Exact serving ID depends on runtime/provider | Model verified; serving ID pending |
| Nemotron 3.5 Super VL | Confirmed in NVIDIA NIM model card | `nvidia/nemotron-3.5-super-vl-120b-a12b` | Hosted model ID verified; account access untested |
| Beam 1.0 (501B MoE) | Reflection confirms Beam 501B total / 23B active | Hosted serving ID not established | Model verified; serving route pending |
| Mistral Large 4 | Confirmed in Mistral model/API docs | `mistral-large-4` | API ID verified; account access untested |
| Microsoft-Decision-1 | Confirmed in Microsoft Foundry docs | `Microsoft-Decision-1` (Foundry model name; deployment-specific endpoint required) | Model name verified; deployment/access pending |
| Moondream 3.1 | Confirmed in Moondream API docs | `moondream3.1-9B-A2B` | API ID verified; account access untested |

## Official sources

- OpenAI model directory: https://developers.openai.com/api/docs/models
- Anthropic model overview: https://platform.claude.com/docs/en/models/overview
- Google Gemini 4 Argon: https://ai.google.dev/gemini-api/docs/models/gemini-4-argon
- Google EmbeddingGemma 2 model card and repository ID: https://ai.google.dev/gemma/docs/embeddinggemma/model_card_2
- Alibaba Qwen / third-party model catalogue: https://www.alibabacloud.com/help/en/model-studio/text-generation-model
- DeepSeek API updates: https://api-docs.deepseek.com/updates/
- Meta Muse models and API identifier: https://dev.meta.ai/docs/models
- Microsoft Decision-1 Foundry guide: https://learn.microsoft.com/en-us/azure/foundry/foundry-models/how-to/use-foundry-models-microsoft-decision
- Meta Muse Spark Open: https://dev.meta.ai/docs/muse-spark-open
- Meta Llama catalogue: https://ai.meta.com/resources/models-and-libraries/llama-downloads/
- NVIDIA Nemotron 3.5 Super VL: https://build.nvidia.com/nvidia/nemotron-3.5-super-vl-120b-a12b/modelcard
- Reflection Beam model card: https://reflection.ai/beam-model-card
- Mistral Large 4 API: https://docs.mistral.ai/api/endpoint/responses
- Moondream API: https://docs.moondream.ai/api/

## Additional route notes

- Qwen Model Studio supports OpenAI-compatible requests; endpoint base URL varies by selected region and workspace. Confirm the correct workspace and region before configuring an adapter.
- EmbeddingGemma 2 is an open model repository ID intended for local or self-managed inference in the checked model card; do not treat it as a hosted Gemini API model ID.
- Alibaba's current official catalogue lists `kimi-k3`, not the submitted `Kimi K3.1 Pro` label. This is a near-name, not proof of equivalent version, tier, or serving endpoint.

## Activation rule

Only entries with exact identifiers and a supported route may be configured. Before any live request, confirm the linked provider account, approved secret-store reference, privacy/data terms, rate limits, region and owner-approved spend cap. Never infer access from public documentation. Keep unverified candidates out of live routing.
