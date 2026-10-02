import { NextResponse } from "next/server";
import { issuePressureReceipt, pressureIntakeSchema } from "@/lib/pressure-agent";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = pressureIntakeSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, error: "pressure_text is required and must be 1–4000 characters." },
        { status: 400 }
      );
    }

    const receipt = issuePressureReceipt(parsed.data.pressure_text);

    return NextResponse.json(
      {
        ok: true,
        receipt_id: receipt.id,
        expires_at: new Date(receipt.expires_at).toISOString(),
        next: "/api/agent?receipt_id=<receipt_id>",
      },
      { status: 201, headers: { "Cache-Control": "no-store" } }
    );
  } catch (error) {
    console.error("pressure intake failed", error);
    return NextResponse.json(
      { ok: false, error: "Pressure intake is not configured." },
      { status: 503 }
    );
  }
}
