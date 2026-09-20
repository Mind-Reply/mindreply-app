import { describe,expect,it,vi } from "vitest";
vi.mock("@/lib/prisma",()=>({prisma:{idempotencyRecord:{create:vi.fn(),update:vi.fn()}}}));
import { claimIdempotency } from "@/db/idempotency";
import { prisma } from "@/lib/prisma";
describe("idempotency",()=>{it("claims a new key",async()=>{vi.mocked(prisma.idempotencyRecord.create).mockResolvedValue({} as never);await expect(claimIdempotency("evt_1")).resolves.toEqual({claimed:true})});it("rejects a duplicate key",async()=>{vi.mocked(prisma.idempotencyRecord.create).mockRejectedValue({code:"P2002"});await expect(claimIdempotency("evt_1")).resolves.toEqual({claimed:false})})});
