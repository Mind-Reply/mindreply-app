import type { Metadata } from "next";
import type { ReactNode } from "react";
import Script from "next/script";
import "../apps/web-replycontrol/app/globals.css";
import "../apps/web-replycontrol/app/mission-control.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://a11-k.space"),
  title: { default: "A11–K — Evidence-led operating foundation", template: "%s | A11–K" },
  description: "An evidence-led operating foundation for complex work, consequential choices, and systems that remain humanly reviewable.",
  applicationName: "A11–K",
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    siteName: "A11–K",
    title: "A11–K — Evidence-led operating foundation",
    description: "Systems that remain reviewable, answerable, and humanly governed.",
    url: "/",
  },
  alternates: { canonical: "/" },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;600&family=IBM+Plex+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body>
        {children}
        <Script async src="https://www.googletagmanager.com/gtag/js?id=G-MDMV5H2SFK" strategy="afterInteractive" />
        <Script id="google-analytics" strategy="afterInteractive">
          {`window.dataLayer = window.dataLayer || []; function gtag(){window.dataLayer.push(arguments);} gtag('js', new Date()); gtag('config', 'G-MDMV5H2SFK');`}
        </Script>
      </body>
    </html>
  );
}
