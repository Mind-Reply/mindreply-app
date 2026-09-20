import { describe,expect,it,vi } from "vitest";
vi.mock("@/lib/prisma",()=>({prisma:{user:{findUnique:vi.fn()}}}));
import { requireAdmin } from "@/server/middleware/rbac";
import { prisma } from "@/lib/prisma";
describe("RBAC",()=>{it("rejects a non-admin",async()=>{vi.mocked(prisma.user.findUnique).mockResolvedValue({role:"USER"} as never);await expect(requireAdmin("user_1")).rejects.toThrow("FORBIDDEN")})});
