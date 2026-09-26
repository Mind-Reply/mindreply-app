import type { MetadataRoute } from "next";
import { supportedLocales } from "./lib/locales";

const site = "https://mind-reply.com";
const urlFor = (locale: string) => locale === "en" ? `${site}/` : `${site}/${locale}/`;

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  const languages = Object.fromEntries([
    ["x-default", urlFor("en")],
    ...supportedLocales.map((locale) => [locale === "uk" ? "en-GB" : locale, urlFor(locale)]),
  ]);

  return supportedLocales.map((locale) => ({
    url: urlFor(locale),
    lastModified,
    changeFrequency: "monthly",
    priority: locale === "en" ? 1 : 0.8,
    alternates: { languages },
  }));
}
