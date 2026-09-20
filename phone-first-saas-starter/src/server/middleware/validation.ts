import { z } from "zod";
export const projectSchema = z.object({ name: z.string().trim().min(1).max(80), description: z.string().trim().max(500).optional() });
export const checkoutSchema = z.object({ priceId: z.string().startsWith("price_") });
export function parse<T>(schema: z.ZodSchema<T>, input: unknown) { const result = schema.safeParse(input); if (!result.success) return { ok: false as const, error: result.error.flatten() }; return { ok: true as const, data: result.data }; }
