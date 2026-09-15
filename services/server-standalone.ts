/**
 * EU-AI-Hub: Standalone Agent Executor
 * No Docker required. Pure Node.js + Vite
 * 
 * Usage:
 *   npm install
 *   npm run dev
 * 
 * Then open: http://127.0.0.1:5173
 */

import express from "express";
import { Anthropic } from "@anthropic-ai/sdk";
import cors from "cors";
import * as fs from "fs";
import * as path from "path";
import os from "os";

// ============================================================================
// EXPRESS SERVER SETUP
// ============================================================================

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json({ limit: "50mb" }));
app.use(cors());

// Verify API keys on startup
const apiKeys = {
  anthropic: process.env.ANTHROPIC_API_KEY,
  openai: process.env.OPENAI_API_KEY,
  xai: process.env.XAI_API_KEY,
};

console.log("🔑 API Keys Status:");
console.log(`   Anthropic: ${apiKeys.anthropic ? "✅" : "❌"}`);
console.log(`   OpenAI: ${apiKeys.openai ? "✅" : "❌"}`);
console.log(`   xAI: ${apiKeys.xai ? "✅" : "❌"}`);

// ============================================================================
// AGENT TYPE DETECTION
// ============================================================================

function detectAgentType(code: string, explicit?: string): string {
  if (explicit) return explicit;

  const patterns: Record<string, RegExp[]> = {
    financial: [
      /yfinance|polygon|alpaca|coinbase|binance|stocks?|crypto|trading/i,
      /price|quote|earnings|dividend/i,
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
// SYSTEM PROMPTS
// ============================================================================

const AGENT_PROMPTS: Record<string, string> = {
  financial: `You are a real-time financial data agent.
Analyze financial code and provide:
- Stock/crypto prices
- Technical indicators (RSI, MACD, BB)
- Buy/sell signals with confidence scores
- Market trends and forecasts
Format output as structured data.`,

  cpu: `You are a system monitoring agent.
Report on:
- CPU usage by core
- Memory (used/total)
- System uptime
- Process information
- Alerts if thresholds exceeded
Use clear formatting for all metrics.`,

  market: `You are a real-time market intelligence agent.
Analyze market data for:
- Arbitrage opportunities
- Price disparities
- Order book analysis
- Liquidation risk
- Trading signals
Provide actionable insights with confidence scores.`,

  delivery: `You are a logistics agent.
Handle:
- Shipping tracking
- Carrier integration
- Delivery scheduling
- Exception handling
Provide clear status updates and next steps.`,

  governance: `You are a compliance agent.
Check for:
- Regulatory violations (GDPR, MAS, FINRA, SOX)
- High-risk transactions
- Audit compliance
- Data protection issues
Flag violations with severity levels.`,

  general: `You are a general-purpose AI assistant.
Execute the requested task and provide clear, structured output with explanations.`,
};

// ============================================================================
// ONE-CALL AGENT EXECUTION ENDPOINT
// ============================================================================

app.post("/api/agent/execute", async (req, res) => {
  const {
    code,
    agentType: explicitType,
    model = "claude-opus-5",
    jurisdiction = "EU",
  } = req.body;

  if (!code) {
    return res.status(400).json({ error: "Code is required" });
  }

  if (!apiKeys.anthropic) {
    return res
      .status(500)
      .json({ error: "ANTHROPIC_API_KEY not set in environment" });
  }

  const agentType = detectAgentType(code, explicitType);
  const systemPrompt = AGENT_PROMPTS[agentType] || AGENT_PROMPTS.general;

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  try {
    const client = new Anthropic({
      apiKey: apiKeys.anthropic,
    });

    const stream = await client.messages.stream({
      model,
      max_tokens: 4096,
      system: systemPrompt,
      messages: [
        {
          role: "user",
          content: `Execute this code and provide analysis:\n\nAgent Type: ${agentType}\nJurisdiction: ${jurisdiction}\n\nCode:\n\`\`\`python\n${code}\n\`\`\``,
        },
      ],
    });

    for await (const chunk of stream) {
      if (
        chunk.type === "content_block_delta" &&
        chunk.delta.type === "text_delta"
      ) {
        res.write(
          `data: ${JSON.stringify({
            type: "token",
            token: chunk.delta.text,
          })}\n\n`
        );
      }
    }

    res.write(`data: ${JSON.stringify({ type: "complete" })}\n\n`);
  } catch (error: any) {
    res.write(
      `data: ${JSON.stringify({
        type: "error",
        error: error.message || String(error),
      })}\n\n`
    );
  } finally {
    res.end();
  }
});

// ============================================================================
// CPU MONITORING ENDPOINT
// ============================================================================

app.get("/api/monitor/cpu", (req, res) => {
  const cpus = os.cpus();
  const totalMem = os.totalmem();
  const freeMem = os.freemem();
  const usedMem = totalMem - freeMem;

  res.json({
    timestamp: new Date().toISOString(),
    cpu: {
      cores: cpus.length,
      model: cpus[0]?.model || "Unknown",
    },
    memory: {
      total_gb: (totalMem / 1e9).toFixed(2),
      used_gb: (usedMem / 1e9).toFixed(2),
      free_gb: (freeMem / 1e9).toFixed(2),
      percent_used: ((usedMem / totalMem) * 100).toFixed(2),
    },
    uptime_hours: (os.uptime() / 3600).toFixed(2),
    load_average: os.loadavg(),
  });
});

// ============================================================================
// GOVERNANCE GATE
// ============================================================================

class GovernanceGate {
  async validateOutput(
    output: string,
    context: { jurisdiction: string; trustLevel: string }
  ): Promise<{ approved: boolean; reason?: string; masked?: string }> {
    const violations: string[] = [];

    // GDPR: Personal data
    if (/\d{3}-\d{2}-\d{4}/.test(output)) {
      violations.push("GDPR: SSN detected");
    }

    // MAS: Financial advice
    if (
      context.jurisdiction === "SG" &&
      context.trustLevel === "PUBLIC" &&
      /\b(buy|sell|invest|hold)\b/i.test(output)
    ) {
      violations.push("MAS: Unauthorized financial advice");
    }

    // FINRA: Market manipulation
    if (/\b(pump|dump|rug pull)\b/i.test(output)) {
      violations.push("FINRA: Market manipulation language");
    }

    if (violations.length > 0) {
      return {
        approved: false,
        reason: violations.join("; "),
        masked: this.maskData(output),
      };
    }

    return { approved: true };
  }

  private maskData(text: string): string {
    return text
      .replace(/\d{3}-\d{2}-\d{4}/g, "XXX-XX-XXXX")
      .replace(/[a-z]+@[a-z]+\.[a-z]+/gi, "[EMAIL]");
  }
}

// ============================================================================
// GOVERNANCE AUDIT ENDPOINT
// ============================================================================

app.post("/api/governance/audit", async (req, res) => {
  const { output, jurisdiction = "EU", trustLevel = "PUBLIC" } = req.body;

  const gate = new GovernanceGate();
  const result = await gate.validateOutput(output, {
    jurisdiction,
    trustLevel,
  });

  res.json({
    approved: result.approved,
    reason: result.reason,
    masked: result.masked,
  });
});

// ============================================================================
// DELIVERY TRACKING MOCK ENDPOINT
// ============================================================================

app.get("/api/delivery/track/:trackingId", (req, res) => {
  res.json({
    tracking_id: req.params.trackingId,
    carrier: "fedex",
    status: "IN_TRANSIT",
    location: {
      city: "Singapore",
      latitude: 1.3521,
      longitude: 103.8198,
    },
    estimated_delivery: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
    events: [
      {
        timestamp: new Date(),
        status: "IN_TRANSIT",
        description: "Package in transit",
      },
    ],
  });
});

// ============================================================================
// HEALTH CHECK
// ============================================================================

app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    apiKeys: {
      anthropic: !!apiKeys.anthropic,
      openai: !!apiKeys.openai,
      xai: !!apiKeys.xai,
    },
  });
});

// ============================================================================
// SERVE STATIC FILES (Frontend will be built separately)
// ============================================================================

app.get("/", (req, res) => {
  res.json({
    message: "EU-AI-Hub Agent Executor",
    status: "running",
    endpoints: {
      execute: "POST /api/agent/execute",
      cpu: "GET /api/monitor/cpu",
      delivery: "GET /api/delivery/track/:id",
      governance: "POST /api/governance/audit",
      health: "GET /health",
    },
    frontend: "http://127.0.0.1:5173 (started separately with npm run dev:client)",
  });
});

// ============================================================================
// START SERVER
// ============================================================================

app.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════════════════════════╗
║          🚀 EU-AI-Hub Agent Executor Running                  ║
╠═══════════════════════════════════════════════════════════════╣
║  Backend:  http://127.0.0.1:${PORT}                          
║  Frontend: http://127.0.0.1:5173 (separate terminal)         
║  Status:   ✅ Ready for agent execution                      
╚═══════════════════════════════════════════════════════════════╝
  
  To start the frontend:
  $ npm run dev:client

  Test endpoint:
  $ curl http://127.0.0.1:${PORT}/health
  `);
});
