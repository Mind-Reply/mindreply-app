import "server-only";

import { createCipheriv, createDecipheriv, createHash, randomBytes } from "node:crypto";
import { z } from "zod";

const TOKEN_TTL_MS = 15 * 60 * 1000;

const intakeSchema = z.object({
  pressure_text: z.string().trim().min(1).max(4000),
});

const receiptPayloadSchema = z.object({
  pressure_text: z.string().min(1).max(4000),
  issued_at: z.number().int(),
  expires_at: z.number().int(),
});

export const pressureIntakeSchema = intakeSchema;

export type PressureAgentResponse = {
  synthesis: string;
  mindset_protection: string;
  calmer_move: string;
  one_action: {
    id: string;
    instruction: string;
    reversible: boolean;
  };
  risk_gate: {
    status: "clear" | "hold" | "block";
    reason: string;
  };
  receipt: {
    id: string;
    issued_at: string;
    expires_at: string;
  };
};

function getSecret() {
  const secret = process.env.PRESSURE_AGENT_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error("PRESSURE_AGENT_SECRET must be configured with at least 32 characters");
  }
  return createHash("sha256").update(secret).digest();
}

export function issuePressureReceipt(pressure_text: string) {
  const now = Date.now();
  const payload = Buffer.from(
    JSON.stringify({
      pressure_text,
      issued_at: now,
      expires_at: now + TOKEN_TTL_MS,
    }),
    "utf8"
  );

  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", getSecret(), iv);
  const ciphertext = Buffer.concat([cipher.update(payload), cipher.final()]);
  const tag = cipher.getAuthTag();

  return {
    id: Buffer.concat([iv, tag, ciphertext]).toString("base64url"),
    issued_at: now,
    expires_at: now + TOKEN_TTL_MS,
  };
}

export function readPressureReceipt(id: string) {
  try {
    const raw = Buffer.from(id, "base64url");
    if (raw.length < 29) return null;

    const iv = raw.subarray(0, 12);
    const tag = raw.subarray(12, 28);
    const ciphertext = raw.subarray(28);

    const decipher = createDecipheriv("aes-256-gcm", getSecret(), iv);
    decipher.setAuthTag(tag);

    const plaintext = Buffer.concat([
      decipher.update(ciphertext),
      decipher.final(),
    ]).toString("utf8");

    const parsed = receiptPayloadSchema.parse(JSON.parse(plaintext));
    if (parsed.expires_at <= Date.now()) return null;

    return parsed;
  } catch {
    return null;
  }
}

function classifyRisk(text: string): PressureAgentResponse["risk_gate"] {
  const consequential = /send|publish|post|delete|transfer|pay|payment|purchase|contract|legal|password|credential|production|deploy|refund/i;

  if (consequential.test(text)) {
    return {
      status: "hold",
      reason: "The pressure mentions a consequential external action; verify the target, scope and authorization before execution.",
    };
  }

  return {
    status: "clear",
    reason: "The proposed move is reversible and does not directly commit an external transaction.",
  };
}

function chooseAction(text: string): PressureAgentResponse["one_action"] {
  if (/email|reply|message|whatsapp|customer|client/i.test(text)) {
    return {
      id: "draft-response",
      instruction: "Draft the shortest factual response; do not send it yet.",
      reversible: true,
    };
  }

  if (/deadline|due|urgent|today|tomorrow/i.test(text)) {
    return {
      id: "name-next-deliverable",
      instruction: "Name the single deliverable that must be completed first, then work only on that.",
      reversible: true,
    };
  }

  if (/payment|pay|transfer|purchase|invoice/i.test(text)) {
    return {
      id: "verify-transaction",
      instruction: "Verify the amount, recipient and authorization before any transaction is executed.",
      reversible: true,
    };
  }

  if (/delete|remove|destroy/i.test(text)) {
    return {
      id: "preserve-before-delete",
      instruction: "Make or verify a recoverable copy before deleting anything.",
      reversible: true,
    };
  }

  return {
    id: "define-next-step",
    instruction: "Write the smallest concrete next step that can be completed without creating an irreversible commitment.",
    reversible: true,
  };
}

export function synthesizePressure(pressure_text: string, receipt: {
  id: string;
  issued_at: number;
  expires_at: number;
}): PressureAgentResponse {
  const clean = pressure_text.replace(/\s+/g, " ").trim();
  const risk_gate = classifyRisk(clean);
  const one_action = chooseAction(clean);

  return {
    synthesis:
      clean.length <= 240
        ? clean
        : `${clean.slice(0, 237).trimEnd()}…`,
    mindset_protection:
      "Pressure is a signal, not an instruction. Separate what feels urgent from what actually requires action.",
    calmer_move:
      "Reduce the situation to one reversible move; defer everything else until that move produces new information.",
    one_action,
    risk_gate,
    receipt: {
      id: receipt.id,
      issued_at: new Date(receipt.issued_at).toISOString(),
      expires_at: new Date(receipt.expires_at).toISOString(),
    },
  };
}
