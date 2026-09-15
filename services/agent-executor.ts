import express, { Request, Response } from "express";
import { Anthropic } from "@anthropic-ai/sdk";
import Docker from "dockerode";
import os from "os";
import * as fs from "fs";

const router = express.Router();
const docker = new Docker();
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// ============================================================================
// AGENT TYPE DETECTION
// ============================================================================

function detectAgentType(code: string, explicit?: string): string {
  if (explicit) return explicit;

  const patterns: Record<string, RegExp[]> = {
    financial: [
      /yfinance|polygon|alpaca|coinbase|binance|stocks?|crypto|trading/i,
      /price|quote|earnings|dividend|dividend/i,
    ],
    cpu: [/psutil|docker.*stats|process|memory|cpu|disk|io/i],
    market: [
      /websocket|orderbook|liquidation|arbitrage|funding.*rate|spread/i,
    ],
    delivery: [/fedex|ups|dhl|tracking|gps|delivery|shipment|logistics/i],
    governance: [
      /audit|compliance|regulation|gdpr|sox|finra|mas|kyc|aml|sanction/i,
    ],
  };

  for (const [agent, regexes] of Object.entries(patterns)) {
    if (regexes.some((r) => r.test(code))) return agent;
  }

  return "general";
}

// ============================================================================
// AGENT SYSTEM PROMPTS
// ============================================================================

const AGENT_PROMPTS: Record<string, string> = {
  financial: `You are a real-time financial data agent. Execute Python code to fetch stock/crypto data.
Provide:
- Live price, volume, market cap
- 1h / 24h / 7d change percentage
- Technical indicators (RSI, MACD, Bollinger Bands)
- Buy/sell signals if applicable
- Confidence score (0-100)
Format output as structured JSON with complete data.
Be precise with numbers. Include source and timestamp.`,

  cpu: `You are a system monitoring agent. Execute code to report:
- CPU usage per core (percentage)
- Memory usage (used / total GB, percentage)
- Disk I/O throughput (read/write MB/s)
- Network throughput (inbound/outbound Mbps)
- Top 10 processes by CPU usage
- Top 10 processes by memory usage
- Docker container stats (if running)
- System uptime and load average
Provide real-time alerts if thresholds exceeded (>80% CPU, >90% memory).
Format as structured JSON.`,

  market: `You are a real-time market intelligence agent. Fetch and analyze:
- Live BTC/ETH price from 5+ exchanges
- Order book depth (bid/ask spread)
- Volume profile (buy/sell volume)
- Funding rates (perpetual futures)
- Liquidation cascades (if any large liquidations)
- Funding rate arbitrage opportunities
- Execution timing recommendations
Provide JSON output with actionable trading signals.
Include confidence scores and risk warnings.`,

  delivery: `You are a logistics and delivery agent. Execute:
- Order status lookup (tracking ID)
- Carrier integration (FedEx, UPS, DHL API lookups)
- Real-time GPS location and map link
- Estimated delivery window
- Exception handling (delays, address issues, stuck packages)
- Proof of delivery status (photo, signature)
Return structured JSON with:
- Current status
- Location
- Estimated delivery
- Next steps (customer action required)
- Escalation path if needed`,

  governance: `You are a compliance and governance agent. Execute code to:
- Audit transaction logs against regulations (MAS, GDPR, SOX, FINRA, PCI-DSS)
- Flag high-risk transactions (suspicious amounts, jurisdictions, patterns)
- Generate complete audit trail with timestamps and actors
- Suggest remediation steps
- Output legal-grade reports (PDF/CSV ready)
- Check AML/KYC status
- Verify sanctions list (OFAC, EU restrictions)
CRITICAL: Never execute code that violates compliance rules.
Always include disclaimers and audit trail.
Return structured JSON with violations, severity, and recommended actions.`,

  general: `You are a general-purpose AI agent. Execute the requested code or task.
Provide clear, structured output with:
- Result data
- Any errors or warnings
- Relevant metrics
- Next steps or recommendations
Be concise but thorough.`,
};

// ============================================================================
// MAIN ENDPOINT: ONE-CALL AGENT EXECUTION
// ============================================================================

router.post("/api/agent/execute", async (req: Request, res: Response) => {
  const {
    code,
    agentType: explicitType,
    model = "claude-opus-5",
    stream = true,
    jurisdiction = "EU",
  } = req.body;

  const agentType = detectAgentType(code, explicitType);
  const systemPrompt = AGENT_PROMPTS[agentType] || AGENT_PROMPTS.general;

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  try {
    const messageStream = await anthropic.messages.stream({
      model,
      max_tokens: 4096,
      system: systemPrompt,
      messages: [
        {
          role: "user",
          content: `Execute this code and provide live monitoring:\n\nAgent Type: ${agentType}\nJurisdiction: ${jurisdiction}\n\nCode:\n\`\`\`python\n${code}\n\`\`\``,
        },
      ],
    });

    for await (const chunk of messageStream) {
      if (
        chunk.type === "content_block_delta" &&
        chunk.delta.type === "text_delta"
      ) {
        res.write(
          `data: ${JSON.stringify({
            type: "token",
            token: chunk.delta.text,
            timestamp: new Date().toISOString(),
          })}\n\n`
        );
      }
    }

    res.write(
      `data: ${JSON.stringify({
        type: "complete",
        timestamp: new Date().toISOString(),
      })}\n\n`
    );
  } catch (error: any) {
    res.write(
      `data: ${JSON.stringify({
        type: "error",
        error: error.message,
        timestamp: new Date().toISOString(),
      })}\n\n`
    );
  } finally {
    res.end();
  }
});

// ============================================================================
// FINANCIAL AGENT ENDPOINT
// ============================================================================

router.post("/api/financial/quote", async (req: Request, res: Response) => {
  const { symbol } = req.body;

  const response = await anthropic.messages.create({
    model: "grok-4.5",
    max_tokens: 1024,
    messages: [
      {
        role: "user",
        content: `Fetch real-time data for ${symbol}. Provide: current price, 24h change %, volume, market cap, RSI, MACD. Format as JSON.`,
      },
    ],
  });

  res.json({
    symbol,
    response: response.content[0].type === "text" ? response.content[0].text : "",
    timestamp: new Date().toISOString(),
  });
});

// ============================================================================
// CPU MONITORING ENDPOINT
// ============================================================================

router.get("/api/monitor/cpu", async (req: Request, res: Response) => {
  const cpus = os.cpus();
  const totalMemory = os.totalmem();
  const freeMemory = os.freemem();
  const usedMemory = totalMemory - freeMemory;

  try {
    const containers = await docker.listContainers({ all: true });
    const containerCount = containers.length;

    res.json({
      timestamp: new Date().toISOString(),
      cpu: {
        cores: cpus.length,
        model: cpus[0].model,
        speed_ghz: (cpus[0].speed / 1000).toFixed(2),
      },
      memory: {
        total_gb: (totalMemory / 1e9).toFixed(2),
        used_gb: (usedMemory / 1e9).toFixed(2),
        free_gb: (freeMemory / 1e9).toFixed(2),
        percent_used: ((usedMemory / totalMemory) * 100).toFixed(2),
      },
      uptime_hours: (os.uptime() / 3600).toFixed(2),
      load_average: os.loadavg(),
      docker: {
        containers: containerCount,
        running: containers.filter((c) => c.State === "running").length,
      },
    });
  } catch (error) {
    res.status(500).json({
      error: "Failed to gather metrics",
      details: error instanceof Error ? error.message : String(error),
    });
  }
});

// ============================================================================
// GOVERNANCE GATE
// ============================================================================

interface GovernanceContext {
  jurisdiction: "EU" | "US" | "APAC" | "GLOBAL";
  regulations: string[];
  trustLevel: "PUBLIC" | "ACCREDITED" | "INSTITUTIONAL";
}

class GovernanceGate {
  async validateAgentOutput(
    output: string,
    context: GovernanceContext
  ): Promise<{ approved: boolean; reason?: string; masked?: string }> {
    const violations = await this.checkCompliance(output, context);

    if (violations.length > 0) {
      return {
        approved: false,
        reason: `Violations detected: ${violations.join(", ")}`,
        masked: this.maskSensitiveContent(output),
      };
    }

    return { approved: true };
  }

  private async checkCompliance(
    output: string,
    context: GovernanceContext
  ): Promise<string[]> {
    const violations: string[] = [];

    // GDPR: Personal data exposure
    if (this.containsPersonalData(output)) {
      violations.push("GDPR: Potential personal data exposure");
    }

    // MAS: Financial advice to non-accredited
    if (
      context.regulations.includes("MAS") &&
      context.trustLevel === "PUBLIC" &&
      this.isFinancialAdvice(output)
    ) {
      violations.push("MAS: Unauthorized financial advice");
    }

    // FINRA: Market manipulation
    if (this.isMarketManipulation(output)) {
      violations.push("FINRA: Market manipulation language detected");
    }

    // SOX: Misleading statements
    if (this.isMisleadingStatement(output)) {
      violations.push("SOX: Potentially misleading statement");
    }

    return violations;
  }

  private containsPersonalData(output: string): boolean {
    // SSN, credit card, email patterns
    const patterns = [/\d{3}-\d{2}-\d{4}/, /[a-z]+@[a-z]+\.[a-z]+/i];
    return patterns.some((p) => p.test(output));
  }

  private isFinancialAdvice(output: string): boolean {
    const keywords = /\b(buy|sell|invest|hold|short|long|allocate|diversify)\b/i;
    return keywords.test(output);
  }

  private isMarketManipulation(output: string): boolean {
    const keywords =
      /\b(pump|dump|get in now|sell everything|spread fud|rug pull)\b/i;
    return keywords.test(output);
  }

  private isMisleadingStatement(output: string): boolean {
    const keywords = /\b(guaranteed|no risk|can't fail|100% return|guaranteed profit)\b/i;
    return keywords.test(output);
  }

  private maskSensitiveContent(output: string): string {
    return output
      .replace(/\d{3}-\d{2}-\d{4}/g, "XXX-XX-XXXX")
      .replace(/[a-z]+@[a-z]+\.[a-z]+/gi, "[REDACTED_EMAIL]")
      .replace(/\d{16}/g, "XXXX-XXXX-XXXX-XXXX");
  }
}

// ============================================================================
// GOVERNANCE AUDIT ENDPOINT
// ============================================================================

router.post("/api/governance/audit", async (req: Request, res: Response) => {
  const { output, jurisdiction = "EU", trustLevel = "PUBLIC" } = req.body;

  const context: GovernanceContext = {
    jurisdiction: jurisdiction as GovernanceContext["jurisdiction"],
    regulations:
      jurisdiction === "EU"
        ? ["GDPR", "MiFID2", "PSD2"]
        : ["FINRA", "SEC", "SOX", "Dodd-Frank"],
    trustLevel: trustLevel as GovernanceContext["trustLevel"],
  };

  const gate = new GovernanceGate();
  const validation = await gate.validateAgentOutput(output, context);

  res.json({
    approved: validation.approved,
    reason: validation.reason,
    masked_output: validation.masked,
    context,
    timestamp: new Date().toISOString(),
  });
});

// ============================================================================
// DELIVERY TRACKING ENDPOINT
// ============================================================================

router.get(
  "/api/delivery/track/:trackingId",
  async (req: Request, res: Response) => {
    const { trackingId } = req.params;

    // Placeholder implementation
    // In production, integrate with FedEx, UPS, DHL APIs
    const mockDelivery = {
      tracking_id: trackingId,
      carrier: "fedex",
      status: "IN_TRANSIT",
      last_update: new Date().toISOString(),
      current_location: {
        city: "Singapore",
        country: "SG",
        latitude: 1.3521,
        longitude: 103.8198,
      },
      estimated_delivery: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      events: [
        {
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
          location: "Singapore",
          status: "PICKED_UP",
          description: "Package picked up",
        },
        {
          timestamp: new Date(Date.now() - 60 * 60 * 1000),
          location: "Singapore Terminal",
          status: "IN_TRANSIT",
          description: "In transit",
        },
      ],
    };

    res.json(mockDelivery);
  }
);

// ============================================================================
// HEALTH CHECK
// ============================================================================

router.get("/health", (req: Request, res: Response) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

export default router;
