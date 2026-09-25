export type ProfitSurface =
  | "a11k"
  | "chat"
  | "nexus"
  | "forge"
  | "studio"
  | "registrar"
  | "replycontrol"
  | "ios";

export type CommercialRole =
  | "demand"
  | "qualification"
  | "delivery"
  | "expansion"
  | "retention"
  | "transaction";

export interface ProfitSurfaceDefinition {
  surface: ProfitSurface;
  name: string;
  role: CommercialRole;
  buyerAction: string;
  monetizationPath: string;
  requiredProof: string[];
  blockedUntil: string[];
}

export const REVERSE_PROFIT_SURFACES: ProfitSurfaceDefinition[] = [
  {
    surface: "a11k",
    name: "A11-K",
    role: "demand",
    buyerAction: "enter the estate and select a commercial problem",
    monetizationPath: "qualified demand -> ReplyControl or paid audit",
    requiredProof: ["clear capability", "working surface", "defensible claims"],
    blockedUntil: ["no fabricated metrics", "no unverified live-state claims"],
  },
  {
    surface: "chat",
    name: "A11-K Chat",
    role: "qualification",
    buyerAction: "write an accountable objective and proof standard",
    monetizationPath: "qualified brief -> paid diagnostic or implementation",
    requiredProof: ["local-first boundary", "exportable brief"],
    blockedUntil: ["no silent transmission", "no implied autonomous execution"],
  },
  {
    surface: "nexus",
    name: "A11-K Nexus",
    role: "qualification",
    buyerAction: "compose a decision route with a governing lens",
    monetizationPath: "decision complexity -> audit, architecture, or implementation",
    requiredProof: ["visible route", "evidence gates", "named human clearance"],
    blockedUntil: ["no dispatch claim", "no fake agent activity"],
  },
  {
    surface: "forge",
    name: "A11-K Forge",
    role: "delivery",
    buyerAction: "build a reversible release manifest",
    monetizationPath: "release-risk problem -> engineering/release engagement",
    requiredProof: ["six release gates", "rollback path", "owner approval"],
    blockedUntil: ["no deployment claim without runtime evidence"],
  },
  {
    surface: "studio",
    name: "A11-K Studio",
    role: "expansion",
    buyerAction: "turn verified proof into defensible commercial language",
    monetizationPath: "validated proof -> campaign/site/content work",
    requiredProof: ["proof inputs", "explicit boundaries", "single next action"],
    blockedUntil: ["no unsupported claims", "no publishing claim"],
  },
  {
    surface: "registrar",
    name: "OWN Registrar",
    role: "transaction",
    buyerAction: "register a client or reseller workspace",
    monetizationPath: "client registration -> paid workspace/service -> reseller expansion",
    requiredProof: ["pricing/plan definition", "handoff/export path", "transaction boundary"],
    blockedUntil: ["no real-money action without explicit payment integration and approval"],
  },
  {
    surface: "replycontrol",
    name: "MindReply ReplyControl",
    role: "transaction",
    buyerAction: "select and purchase a commercial service",
    monetizationPath: "qualified visitor -> paid audit/service -> delivery -> expansion",
    requiredProof: ["offer", "price", "checkout path", "delivery contract"],
    blockedUntil: ["payment and delivery must be verifiably wired", "no fake conversion metrics"],
  },
  {
    surface: "ios",
    name: "MindReply Local",
    role: "retention",
    buyerAction: "use the local client repeatedly",
    monetizationPath: "retention -> future paid service/product expansion",
    requiredProof: ["local runtime", "privacy boundary", "device test evidence"],
    blockedUntil: ["no offline/zero-telemetry claim without physical-device evidence"],
  },
];

export function processProfitSurface(
  surface: ProfitSurface,
  observed: Partial<Pick<ProfitSurfaceDefinition, "requiredProof" | "blockedUntil">> = {},
) {
  const definition = REVERSE_PROFIT_SURFACES.find((item) => item.surface === surface);
  if (!definition) throw new Error(`Unknown profit surface: ${surface}`);

  const missingProof = definition.requiredProof.filter(
    (item) => !observed.requiredProof?.includes(item),
  );
  const activeBlocks = definition.blockedUntil.filter(
    (item) => observed.blockedUntil?.includes(item),
  );

  return {
    surface: definition.surface,
    name: definition.name,
    role: definition.role,
    buyerAction: definition.buyerAction,
    monetizationPath: definition.monetizationPath,
    status: missingProof.length === 0 && activeBlocks.length === 0 ? "READY_FOR_VERIFICATION" : "EVIDENCE_REQUIRED",
    missingProof,
    activeBlocks,
  } as const;
}
