import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const allowed = ["name", "email", "company", "message", "source"];
  const payload = Object.fromEntries(Object.entries(body).filter(([k]) => allowed.includes(k)));
  return NextResponse.json({ ok: true, status: "queued", demo: true, next: "n8n webhook", payload: { ...payload, email: payload.email ? "[redacted in response]" : undefined } });
}

export async function GET() { return NextResponse.json({ ok: true, mode: "DEMO", message: "Connect n8n and Salesforce for live intake." }); }