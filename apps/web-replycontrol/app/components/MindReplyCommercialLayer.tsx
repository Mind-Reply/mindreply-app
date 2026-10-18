import type { SupportedLocale } from "../lib/locales";

const copy: Partial<Record<SupportedLocale, {
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
}>> = {
  en: {
    eyebrow: "MINDREPLY · WEBSITE COMPLETION",
    title: "A clearer route from website friction to completed work.",
    intro: "Start by identifying what is blocking enquiries or preventing your website from doing its job. Agree the scope before implementation, keep decisions under your control, and track the work through a reviewable handoff.",
    packageTitle: "Website Completion Package",
    packagePrice: "£600 · one-time",
    packageBody: "A focused website completion engagement. Confirm the required changes and acceptance criteria before work begins. Secure online checkout is not exposed until its live configuration and webhook path are verified.",
    rows: [
      ["01", "Assess", "Identify the highest-value website, enquiry or conversion gap."],
      ["02", "Agree scope", "Confirm priorities, deliverables and acceptance criteria before implementation."],
      ["03", "Complete & review", "Implement the agreed work and review the result before handoff."],
    ],
    agent: "Explore services",
    audit: "Request this package",
    owner: "Owner control",
    proof: "Evidence",
  },
  bg: {
    eyebrow: "MINDREPLY · ЗАВЪРШВАНЕ НА УЕБСАЙТ",
    title: "Ясен път от проблемите на сайта до завършена работа.",
    intro: "Започнете с откриване на пречките пред запитванията и работата на сайта. Уточнете обхвата предварително, запазете контрола върху решенията и проследявайте изпълнението с ясен handoff.",
    packageTitle: "Пакет за завършване на уебсайт",
    packagePrice: "£600 · еднократно",
    packageBody: "Фокусирана работа по завършване на уебсайт. Промените и критериите за приемане се уточняват предварително. Онлайн плащането няма да се показва, докато конфигурацията и webhook пътят не бъдат проверени.",
    rows: [
      ["01", "Оценка", "Определете най-важния пропуск в сайта, запитванията или конверсията."],
      ["02", "Уточняване на обхвата", "Потвърдете приоритетите, резултатите и критериите за приемане."],
      ["03", "Изпълнение и преглед", "Изпълнете договорената работа и прегледайте резултата преди предаване."],
    ],
    agent: "Разгледайте услугите",
    audit: "Заявете пакета",
    owner: "Контрол от собственика",
    proof: "Доказателства",
  },
};

export function MindReplyCommercialLayer({ locale }: { locale: SupportedLocale }) {
  const t = copy[locale] ?? copy.en;
  if (!t) throw new Error("MindReply commercial copy requires an English fallback.");

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
