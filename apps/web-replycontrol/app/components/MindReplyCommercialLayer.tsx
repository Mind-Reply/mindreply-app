import type { SupportedLocale } from "../lib/locales";

const copy: Record<SupportedLocale, {
  eyebrow: string;
  title: string;
  intro: string;
  packageTitle: string;
  packagePrice: string;
  packageBody: string;
  rows: [string, string, string][];
  agent: string;
  audit: string;
  owner: string;
  proof: string;
}> = {
  en: {
    eyebrow: "MINDREPLY · LAST-MILE RESCUE",
    title: "Turn pressure, website friction and follow-up gaps into one clear move.",
    intro: "The current MindReply experience starts with the fastest useful output: an action queue or send-ready response. From there, the same controlled path can move into assessment, delivery and evidence.",
    packageTitle: "Operator setup + Website Leak Audit",
    packagePrice: "Start with the audit",
    packageBody: "The current public MindReply path: identify the highest-value leak, match the right operator, then move through a focused setup sprint.",
    rows: [
      ["01", "Leak Audit", "Find unanswered questions, slow response, weak qualification and broken handoffs."],
      ["02", "Operator Match", "Choose QuoteCapture, Patient Intake or Proposal Rescue for the highest-value gap."],
      ["03", "Setup Sprint", "Move through Audit → Map → Build → Launch → Improve with a clear handoff."],
    ],
    agent: "Try MRagent",
    audit: "Request an assessment",
    owner: "Owner control",
    proof: "Evidence",
  },
  bg: {
    eyebrow: "MINDREPLY · ПОСЛЕДНА МИЛЯ",
    title: "Превърнете натиска, неяснотата по сайта и пропуснатите follow-up-и в една ясна следваща стъпка.",
    intro: "MindReply започва с най-бързия полезен резултат: action queue или готов отговор. След това същият контролиран път преминава към оценка, изпълнение и доказателства.",
    packageTitle: "Одит + настройка на оператор",
    packagePrice: "Започнете с одита",
    packageBody: "Текущият публичен път на MindReply: открийте най-ценния пропуск, изберете оператор и преминете към фокусиран setup sprint.",
    rows: [
      ["01", "Leak Audit", "Открийте липсващи отговори, бавна реакция, слаба квалификация и счупено предаване."],
      ["02", "Operator Match", "Изберете QuoteCapture, Patient Intake или Proposal Rescue."],
      ["03", "Setup Sprint", "Audit → Map → Build → Launch → Improve с ясен handoff."],
    ],
    agent: "Опитайте MRagent",
    audit: "Заявете оценка",
    owner: "Контрол от собственика",
    proof: "Доказателства",
  },
};

export function MindReplyCommercialLayer({ locale }: { locale: SupportedLocale }) {
  const t = copy[locale] ?? copy.en;

  return (
    <section className="mc-section" aria-labelledby="commercial-layer-title">
      <div className="mc-section-head">
        <span>{t.eyebrow}</span>
        <h2 id="commercial-layer-title">{t.title}</h2>
        <p className="lead">{t.intro}</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.4fr_.8fr]">
        <article className="mc-module">
          <div className="flex flex-wrap items-baseline justify-between gap-4">
            <span>{t.packageTitle}</span>
            <strong>{t.packagePrice}</strong>
          </div>
          <p>{t.packageBody}</p>
          <div className="mt-8 space-y-4">
            {t.rows.map(([number, title, body]) => (
              <div key={number} className="grid grid-cols-[2rem_1fr] gap-4 border-t border-white/10 pt-4">
                <span>{number}</span>
                <div>
                  <b>{title}</b>
                  <p>{body}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            <a className="mc-primary" href="/audit">{t.audit} ↗</a>
            <a className="mc-secondary" href="/contact">Request invoice</a>
          </div>
          <small>Public-site alignment only: commercial and deployment claims remain subject to independent evidence.</small>
        </article>

        <div className="grid gap-4">
          <a className="mc-link-card" href="/operations">
            <span>01 · ENTRY</span>
            <b>{t.agent} ↗</b>
            <p>Start with the pressure, identify the next move, then hand off into the appropriate delivery path.</p>
          </a>
          <a className="mc-link-card" href="/operations">
            <span>02 · CONTROL</span>
            <b>{t.owner} ↗</b>
            <p>Keep consequential work reviewable with explicit ownership, bounded actions and clear handoffs.</p>
          </a>
          <a className="mc-link-card" href="/evidence">
            <span>03 · PROOF</span>
            <b>{t.proof} ↗</b>
            <p>Keep delivery, deployment and outcome claims tied to evidence rather than optimistic wording.</p>
          </a>
        </div>
      </div>
    </section>
  );
}
