# LLM Gateway

Drop-in multi-provider router with tiered model selection for Mind-Reply engines.

## Quick use

```js
import { pickTier, routeToTier } from "./gateway.js";

const tier = pickTier({ task: "architecture_review" });
const { text, model, provider } = await routeToTier(tier, "Review this deploy plan...");
```

## Env vars
- ANTHROPIC_API_KEY
- OPENAI_API_KEY
- GOOGLE_API_KEY (optional)
- LOCAL_MODEL_BASE_URL (optional)

Never hardcode keys.
