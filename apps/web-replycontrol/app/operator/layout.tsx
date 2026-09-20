import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Operator Match",
  description: "Private, review-led compile, gate, and delivery-pack workspace.",
  robots: { index: false, follow: false, nocache: true },
};

export default function OperatorLayout({ children }: { children: ReactNode }) { return children; }
