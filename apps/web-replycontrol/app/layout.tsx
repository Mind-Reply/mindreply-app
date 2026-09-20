import type { Metadata } from "next";
import type { ReactNode } from "react";
import Script from "next/script";
import "./globals.css";
import "./mission-control.css";
import "./frontend-polish.css";
import "./flow-premium.css";
import "../../app/dashboard/dashboard.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://mind-reply.com"),
  title: { default: "MindReply — Answerable systems", template: "%s | MindReply" },
  description: "Evidence-led operating systems for owner-led teams. Human judgment remains the final authority; important work stays reviewable and reversible.",
  applicationName: "MindReply",
  authors: [{ name: "MindReply" }],
  referrer: "strict-origin-when-cross-origin",
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 } },
  openGraph: { type: "website", siteName: "MindReply", title: "MindReply — Answerable systems", description: "Evidence-led operating systems where people retain the last word.", url: "/", locale: "en_GB" },
  twitter: { card: "summary", title: "MindReply — Answerable systems", description: "Evidence-led operating systems where people retain the last word." },
  alternates: { canonical: "/", languages: { en: "/", bg: "/bg", de: "/de", fr: "/fr", es: "/es", "x-default": "/" } },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return <html lang="en"><head><link rel="preconnect" href="https://fonts.googleapis.com" /><link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" /><link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;600&family=IBM+Plex+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" /></head><body>{children}<Script async src="https://www.googletagmanager.com/gtag/js?id=G-MDMV5H2SFK" strategy="afterInteractive" /><Script id="google-analytics" strategy="afterInteractive">{`window.dataLayer = window.dataLayer || [];
function gtag(){window.dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'G-MDMV5H2SFK');`}</Script></body></html>;
}
