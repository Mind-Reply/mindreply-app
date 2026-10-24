"use client";

import { useMemo, useState } from "react";
import styles from "./supply-chain.module.css";

type FinanceOption = {
  name: string;
  mechanism: string;
  benefit: string;
  watch: string;
};

const financeOptions: FinanceOption[] = [
  {
    name: "Reverse factoring",
    mechanism: "A financier offers early payment against buyer-approved invoices.",
    benefit: "Can improve supplier liquidity while preserving agreed buyer terms.",
    watch: "Fees, buyer credit exposure, recourse terms and accounting treatment.",
  },
  {
    name: "Dynamic discounting",
    mechanism: "The buyer pays early in exchange for a negotiated discount.",
    benefit: "Can turn available cash into a measurable discount return.",
    watch: "Cash availability, discount economics and supplier participation.",
  },
  {
    name: "Traditional factoring",
    mechanism: "A supplier sells eligible receivables to a finance provider.",
    benefit: "Can accelerate supplier cash without waiting for invoice maturity.",
    watch: "Advance rate, fees, recourse, debtor notification and eligibility.",
  },
];

const riskRows = [
  { risk: "Single-source dependency", trigger: "Critical item has no qualified alternative", action: "Qualify a backup supplier and document switching lead time", owner: "Procurement" },
  { risk: "Supplier liquidity pressure", trigger: "Repeated payment requests or credible distress signals", action: "Validate facts, review exposure and assess approved finance options", owner: "Finance" },
  { risk: "Long or unstable lead time", trigger: "Lead time exceeds plan or delivery reliability declines", action: "Recalculate safety stock against demand and recovery time", owner: "Operations" },
  { risk: "Invoice or delivery mismatch", trigger: "Purchase order, receipt and invoice do not reconcile", action: "Hold approval, record discrepancy and assign an owner", owner: "Accounts payable" },
];

function money(value: number) {
  return new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP", maximumFractionDigits: 0 }).format(value);
}

function numberInput(value: number, setValue: (value: number) => void, label: string, suffix = "days") {
  return (
    <label className={styles.inputField}>
      <span>{label}</span>
      <div className={styles.inputWrap}>
        <input type="number" min="0" step="1" value={value} onChange={(event) => setValue(Math.max(0, Number(event.target.value) || 0))} aria-label={label} />
        <small>{suffix}</small>
      </div>
    </label>
  );
}

export default function SupplyChainPage() {
  const [dio, setDio] = useState(42);
  const [dso, setDso] = useState(35);
  const [dpo, setDpo] = useState(30);
  const [annualCost, setAnnualCost] = useState(720000);
  const [annualCreditSales, setAnnualCreditSales] = useState(960000);
  const [annualCreditPurchases, setAnnualCreditPurchases] = useState(600000);
  const [selected, setSelected] = useState("Reverse factoring");
  const [invoiceChecks, setInvoiceChecks] = useState([false, false, false, false, false]);
  const [activeTab, setActiveTab] = useState<"overview" | "finance" | "risk" | "controls">("overview");

  const metrics = useMemo(() => {
    const ccc = dio + dso - dpo;
    const dailyCost = annualCost / 365;
    const dailySales = annualCreditSales / 365;
    const dailyPurchases = annualCreditPurchases / 365;
    const inventoryValue = dio * dailyCost;
    const receivablesValue = dso * dailySales;
    const payablesValue = dpo * dailyPurchases;
    return {
      ccc,
      inventoryValue,
      receivablesValue,
      payablesValue,
      workingCapitalCycle: inventoryValue + receivablesValue - payablesValue,
      dayValue: dailyCost,
    };
  }, [dio, dso, dpo, annualCost, annualCreditSales, annualCreditPurchases]);

  const checkLabels = [
    "Purchase order and agreed terms match",
    "Goods receipt or service evidence is present",
    "Invoice supplier, amount, tax and currency are checked",
    "Duplicate invoice and dispute checks are complete",
    "Authorized approver has approved the invoice",
  ];
  const checkedCount = invoiceChecks.filter(Boolean).length;

  return (
    <main className={styles.shell}>
      <aside className={styles.sidebar}>
        <a className={styles.brand} href="/dashboard" aria-label="MindReply owner cockpit">
          <span className={styles.brandMark}>MR</span>
          <span><strong>MindReply</strong><small>OPERATIONS DESK</small></span>
        </a>
                <nav className={styles.nav} aria-label="Supply chain sections">
          {([
            ["overview", "Overview", "01"],
            ["finance", "Financing options", "02"],
            ["risk", "Supply risk", "03"],
            ["controls", "Invoice controls", "04"],
          ] as const).map(([id, label, number]) => (
            <button key={id} className={activeTab === id ? styles.navActive : ""} onClick={() => setActiveTab(id)}>
              <span>{number}</span>{label}
            </button>
          ))}
        </nav>
        <div className={styles.sidebarFoot}>
          <span className={styles.dot} />
          <div><strong>Local calculation mode</strong><small>No external systems connected</small></div>
        </div>
      </aside>

      <section className={styles.main}>
        <header className={styles.header}>
          <div><h1>Cash clarity. Supply resilience.</h1><p className={styles.subtitle}>One working view across working capital, supplier financing, risk and invoice approvals.</p></div>
          
        </header>

        <section className={styles.notice} role="note">
          <strong>Decision support only</strong>
          <span>Figures begin as illustrative GBP inputs. No bank, ERP, supplier, invoice or payment system is connected. Validate data and obtain authorized approval before acting.</span>
        </section>

        {activeTab === "overview" && (
          <>
            <section className={styles.metricGrid} aria-label="Working capital metrics">
              <article className={styles.metricCard}><span>Cash conversion cycle</span><strong>{metrics.ccc} <small>days</small></strong><p>DIO + DSO − DPO</p></article>
              <article className={styles.metricCard}><span>Inventory estimate</span><strong>{money(metrics.inventoryValue)}</strong><p>Based on annual cost ÷ 365 × DIO</p></article>
              <article className={styles.metricCard}><span>Receivables estimate</span><strong>{money(metrics.receivablesValue)}</strong><p>Based on credit sales ÷ 365 × DSO</p></article>
              <article className={styles.metricCard}><span>Payables estimate</span><strong>{money(metrics.payablesValue)}</strong><p>Based on credit purchases ÷ 365 × DPO</p></article>
            </section>
            <section className={styles.panel}>
              <div className={styles.panelHeading}><div><h2>Adjust the operating assumptions</h2></div></div>
              <div className={styles.inputGrid}>
                {numberInput(dio, setDio, "Days inventory outstanding")}
                {numberInput(dso, setDso, "Days sales outstanding")}
                {numberInput(dpo, setDpo, "Days payable outstanding")}
                <label className={styles.inputField}><span>Annual cost of goods sold</span><div className={styles.inputWrap}><small>GBP</small><input type="number" min="0" step="1000" value={annualCost} onChange={(e) => setAnnualCost(Math.max(0, Number(e.target.value) || 0))} /></div></label>
                <label className={styles.inputField}><span>Annual credit sales</span><div className={styles.inputWrap}><small>GBP</small><input type="number" min="0" step="1000" value={annualCreditSales} onChange={(e) => setAnnualCreditSales(Math.max(0, Number(e.target.value) || 0))} /></div></label>
                <label className={styles.inputField}><span>Annual credit purchases</span><div className={styles.inputWrap}><small>GBP</small><input type="number" min="0" step="1000" value={annualCreditPurchases} onChange={(e) => setAnnualCreditPurchases(Math.max(0, Number(e.target.value) || 0))} /></div></label>
              </div>
              <div className={styles.formulaRow}><div><span>Estimated operating working capital tied to cycle</span><strong>{money(metrics.workingCapitalCycle)}</strong></div><p>Directional estimate only. Use consistent accounting definitions and verified ledger data before relying on it for decisions.</p></div>
            </section>
            <section className={styles.twoColumn}>
              <article className={styles.panel}>
                <div className={styles.panelHeading}><div><h2>Compare the route</h2></div><button className={styles.textButton} onClick={() => setActiveTab("finance")}>Review options →</button></div>
                <div className={styles.optionList}>{financeOptions.map((option) => <button key={option.name} onClick={() => { setSelected(option.name); setActiveTab("finance"); }} className={styles.optionRow}><span>{option.name}</span><small>View trade-offs</small><b>→</b></button>)}</div>
              </article>
              <article className={styles.panel}>
                <div className={styles.panelHeading}><div><h2>Control the exposure</h2></div><button className={styles.textButton} onClick={() => setActiveTab("risk")}>Open risk register →</button></div>
                <p className={styles.bodyCopy}>Track supplier concentration, delivery volatility, financial distress and invoice mismatches with a named owner and an actionable trigger.</p>
                <div className={styles.controlSummary}><strong>4</strong><span>risk patterns to assess</span><strong>5</strong><span>invoice approval checks</span></div>
              </article>
            </section>
          </>
        )}

        {activeTab === "finance" && (
          <section className={styles.panel}>
            <div className={styles.panelHeading}><div><h2>Compare mechanisms before selecting one</h2></div></div>
            <div className={styles.financeGrid}>{financeOptions.map((option) => <button key={option.name} className={selected === option.name ? styles.financeCardActive : styles.financeCard} onClick={() => setSelected(option.name)}><span className={styles.selection}>{selected === option.name ? "SELECTED FOR REVIEW" : "COMPARE OPTION"}</span><h3>{option.name}</h3><p>{option.mechanism}</p><div><small>Potential benefit</small><p>{option.benefit}</p></div><div><small>Check before proceeding</small><p>{option.watch}</p></div></button>)}</div>
            <div className={styles.notice}><strong>Before commitment</strong><span>Obtain the provider's written terms, calculate total effective cost, check recourse and accounting implications, and confirm supplier consent and delegated approval. Selecting an option here does not initiate financing.</span></div>
          </section>
        )}

        {activeTab === "risk" && (
          <section className={styles.panel}>
            <div className={styles.panelHeading}><div><p className={styles.eyebrow}>SUPPLY CHAIN RISK</p><h2>Trigger → owner → response</h2></div></div>
            <div className={styles.riskList}>{riskRows.map((row) => <article className={styles.riskRow} key={row.risk}><div><span>RISK</span><h3>{row.risk}</h3><p>{row.trigger}</p></div><div><span>RESPONSE</span><p>{row.action}</p></div><div><span>PROPOSED OWNER</span><strong>{row.owner}</strong></div></article>)}</div>
            <p className={styles.footnote}>Starter controls only. Add supplier-specific evidence, likelihood, impact, review date and escalation route before using this as a live risk register.</p>
          </section>
        )}

        {activeTab === "controls" && (
          <section className={styles.panel}>
            <div className={styles.panelHeading}><div><h2>Confirm before approval</h2><p className={styles.bodyCopy}>Use this checklist to structure review. Checking a box is local to this page and does not approve an invoice or update a finance system.</p></div><div className={styles.progress}><strong>{checkedCount}/5</strong><small>checks marked</small></div></div>
            <div className={styles.checkList}>{checkLabels.map((label, index) => <label key={label} className={styles.checkRow}><input type="checkbox" checked={invoiceChecks[index]} onChange={(event) => setInvoiceChecks((current) => current.map((checked, i) => i === index ? event.target.checked : checked))} /><span><strong>{label}</strong><small>Checklist item {String(index + 1).padStart(2, "0")}</small></span><i>{invoiceChecks[index] ? "MARKED" : "PENDING"}</i></label>)}</div>
            <div className={styles.notice}><strong>Approval boundary</strong><span>Only an authorized approver in the official workflow can approve the invoice. Payment confirmation must distinguish instructed, processed, settled and reconciled states.</span></div>
          </section>
        )}

        <footer className={styles.footer}><span>MindReply · Supply Chain Finance & Operations</span><span>Local prototype · No external writes · No payment initiation</span></footer>
      </section>
    </main>
  );
}
