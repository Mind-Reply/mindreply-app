"use client";
import { createCheckout } from "@/server/actions/subscription";
import { Button } from "@/components/ui/Button";
import { useState } from "react";
export default function Pricing(){const [busy,setBusy]=useState(false);async function buy(){setBusy(true);try{const r=await createCheckout();if(r.ok&&r.url)window.location.assign(r.url);else alert("Sign in and configure Stripe test mode first.");}finally{setBusy(false)}}return <section className="mx-auto max-w-md space-y-6"><h1 className="text-3xl font-bold">Simple prototype pricing</h1><div className="rounded-2xl border bg-white p-6"><p className="text-sm text-slate-500">Test subscription</p><p className="mt-2 text-4xl font-black">Stripe test mode</p><p className="mt-3 text-slate-600">Use your configured test price ID. No live billing is enabled.</p><Button className="mt-6 w-full" onClick={buy} disabled={busy}>{busy?"Opening…":"Start test checkout"}</Button></div></section>}
