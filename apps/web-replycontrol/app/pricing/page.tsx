import Link from "next/link";
import { MindReplyCommercialLayer } from "../components/MindReplyCommercialLayer";

export const metadata = {
  title: "Pricing | MindReply",
  description: "MindReply service pricing and the Website Completion Package.",
};

export default function PricingPage() {
  return (
    <main className="mc-page">
      <nav className="mc-nav" aria-label="Primary navigation">
        <Link className="mc-brand" href="/">MindReply<small>OPERATING SYSTEM</small></Link>
        <div className="mc-nav-center">
          <Link href="/platform">Platform</Link>
          <Link href="/services">Services</Link>
          <Link href="/regions">Regions</Link>
          <Link href="/pricing">Pricing</Link>
          <Link href="/contact">Contact</Link>
        </div>
        <div className="mc-nav-right">
          <span className="mc-state"><i className="mc-dot" />OWNER CONTROL</span>
        </div>
      </nav>

      <section className="mc-hero" aria-labelledby="pricing-title">
        <div>
          <p className="mc-kicker"><i />COMMERCIAL MODEL / PRICING</p>
          <h1 id="pricing-title">Clear scope. Agreed price. Reviewable delivery.</h1>
          <p className="lead">
            Published pricing is limited to the offer currently defined on this site.
            Bespoke services are scoped before any commercial commitment.
          </p>
          <div className="mc-actions">
            <Link className="mc-primary" href="/audit">Request an assessment ↗</Link>
            <Link className="mc-secondary" href="/services">Explore services</Link>
          </div>
        </div>
        <aside className="mc-console" aria-label="Pricing and delivery controls">
          <div className="mc-console-top"><span>COMMERCIAL CONTROL</span><b>OWNER AGREED</b></div>
          <div className="mc-console-main">
            <span className="mc-console-label">Before work begins</span>
            <div className="mc-verdict"><strong>Scope → Price → Acceptance.</strong><span>EXPLICIT</span></div>
            <p>Any additional implementation or managed-service work is quoted after assessment. No unverified checkout or payment path is represented as available.</p>
          </div>
        </aside>
      </section>

      <MindReplyCommercialLayer locale="en" />

      <footer className="mc-footer">
        <span>MindReply</span>
        <span>INTELLIGENCE · TECHNOLOGY · OPERATIONS</span>
        <div className="mc-footer-links">
          <Link href="/evidence">Evidence ↗</Link>
          <Link href="/contact">Contact ↗</Link>
        </div>
      </footer>
    </main>
  );
}
