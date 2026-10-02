import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/clerk";
import { createSupabaseAdmin } from "@/lib/supabaseAdmin";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    await requireAuth();

    const body = (await request.json().catch(() => ({}))) as { intent?: unknown };
    const intent = typeof body.intent === "string" ? body.intent.trim() : "";

    if (!intent || intent.length > 4000) {
      return NextResponse.json(
        { error: "Intent must be a non-empty string of 4000 characters or fewer." },
        { status: 400 },
      );
    }

    const supabase = createSupabaseAdmin();
    const { data, error } = await supabase
      .from("agent_executions")
      .insert({
        intent,
        status: "queued",
        environment: process.env.NODE_ENV === "production" ? "production" : "development",
        source: "mindreply_workspace",
      })
      .select("id")
      .single();

    if (error) throw error;

    return NextResponse.json({
      status: "execution_queued",
      evidence_id: data.id,
    });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    console.error("Agent execution enqueue error", error);
    return NextResponse.json(
      { error: "Unable to queue execution." },
      { status: 500 },
    );
  }
}
