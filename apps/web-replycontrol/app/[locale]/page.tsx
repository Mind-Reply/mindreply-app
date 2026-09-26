import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { PublicHome } from "../components/PublicHome";
import { copy, normalizeLocale, supportedLocales } from "../lib/locales";

const site = "https://mind-reply.com";
const urlFor = (locale: string) => locale === "en" ? `${site}/` : `${site}/${locale}/`;
const hreflang = Object.fromEntries([
  ["x-default", urlFor("en")],
  ["en", urlFor("en")], ["en-GB", urlFor("uk")], ["bg-BG", urlFor("bg")], ["de-DE", urlFor("de")], ["es-ES", urlFor("es")], ["pt-BR", urlFor("pt-br")], ["tr-TR", urlFor("tr")],
]);

export const dynamicParams = false;
export function generateStaticParams() {
  return supportedLocales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const locale = normalizeLocale((await params).locale);
  const t = copy[locale];
  return { title: `MindReply — ${t.title}`, description: t.lead, alternates: { canonical: urlFor(locale), languages: hreflang }, openGraph: { locale: locale === "uk" ? "en_GB" : locale.replace("-", "_"), url: urlFor(locale), type: "website" } };
}

export default async function LocalizedHome({ params }: { params: Promise<{ locale: string }> }) {
  const requested = (await params).locale;
  if (!supportedLocales.includes(requested as (typeof supportedLocales)[number])) notFound();
  return <PublicHome locale={normalizeLocale(requested)} />;
}
