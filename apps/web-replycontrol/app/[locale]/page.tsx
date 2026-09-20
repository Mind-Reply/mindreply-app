import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { PublicHome } from "../components/PublicHome";
import { copy, normalizeLocale, supportedLocales } from "../lib/locales";

export const dynamicParams = false;
export function generateStaticParams() {
  return supportedLocales.filter((locale) => locale !== "en").map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const locale = normalizeLocale((await params).locale);
  const t = copy[locale];
  return { title: `MindReply — ${t.title}`, description: t.lead, alternates: { canonical: locale === "en" ? "/" : `/${locale}`, languages: Object.fromEntries(supportedLocales.map((code) => [code, code === "en" ? "/" : `/${code}`])) } };
}

export default async function LocalizedHome({ params }: { params: Promise<{ locale: string }> }) {
  const requested = (await params).locale;
  if (!supportedLocales.includes(requested as (typeof supportedLocales)[number])) notFound();
  return <PublicHome locale={normalizeLocale(requested)} />;
}
