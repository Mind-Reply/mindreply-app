import Link from "next/link";
import ContactBriefForm from "./ContactBriefForm";

export const metadata = {
  title: "Capability Brief | MindReply",
  description: "Create a scoped capability and regional delivery brief.",
};

export default function ContactPage() {
  return <main className="mc-page">
    <nav className="mc-nav"><Link className="mc-brand" href="/">MindReply<small>OPERATING SYSTEM</small></Link><Link href="/services">Services</Link><Link href="/regions">Regions</Link></nav>
    <section className="mc-hero"><div><p className="mc-kicker">CAPABILITY INTAKE</p><h1>Turn a requirement into a <em>delivery brief.</em></h1><p className="lead">Build a scoped brief without submitting contact details or confidential information.</p></div></section>
    <ContactBriefForm />
  </main>;
}
