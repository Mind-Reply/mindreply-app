import type { Metadata } from "next";
import type { ReactNode } from "react";
import Script from "next/script";
import "../apps/web-replycontrol/app/globals.css";
import "../apps/web-replycontrol/app/mission-control.css";
import "../apps/web-replycontrol/app/frontend-polish.css";
import "../apps/web-replycontrol/app/flow-premium.css";

const site = "https://mind-reply.com";
const alternates = {
  "x-default": `${site}/`,
  en: `${site}/en/`,
  "en-GB": `${site}/uk/`,
  "bg-BG": `${site}/bg/`,
  "de-DE": `${site}/de/`,
  "es-ES": `${site}/es/`,
  "pt-BR": `${site}/pt-br/`,
  "tr-TR": `${site}/tr/`,
};

export const metadata: Metadata = {
  metadataBase: new URL(site),
  title: { default: "MindReply — Website & Workflow Improvement", template: "%s | MindReply" },
  description:
    "Identify website conversion gaps, improve enquiry handling, and deliver focused website and workflow improvements with clear ownership and reviewable outcomes.",
  applicationName: "MindReply",
  authors: [{ name: "MindReply" }],
  referrer: "strict-origin-when-cross-origin",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    type: "website",
    siteName: "MindReply",
    title: "MindReply — Website & Workflow Improvement",
    description: "Identify website conversion gaps, improve enquiry handling, and deliver focused website and workflow improvements with clear ownership.",
    url: "/",
    locale: "en_US",
  },
  twitter: {
    card: "summary",
    title: "MindReply — Website & Workflow Improvement",
    description: "Website and workflow improvements with clear scope, accountable delivery and reviewable outcomes.",
  },
  alternates: { canonical: "/", languages: alternates },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;600&family=IBM+Plex+Sans:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        {children}
        <Script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-MDMV5H2SFK"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`window.dataLayer = window.dataLayer || [];
function gtag(){window.dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'G-MDMV5H2SFK');`}
        </Script>
      </body>
    </html>
  );
}
