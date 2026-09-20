"use client";
import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
export function Header(){return <header className="sticky top-0 z-10 border-b bg-white/90 backdrop-blur"><div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4"><Link href="/" className="font-bold">SaaS Starter</Link><nav className="flex items-center gap-3 text-sm"><Link href="/pricing">Pricing</Link><Link href="/dashboard">Dashboard</Link><Link href="/settings">Settings</Link><UserButton afterSignOutUrl="/"/></nav></div></header>}
