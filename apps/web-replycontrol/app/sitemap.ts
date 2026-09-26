import type { MetadataRoute } from "next";
import { supportedLocales } from "./lib/locales";

const site = "https://mind-reply.com";
const urlFor = (locale: string) => locale === "en" ? `${site}/` : `${site}/${locale}/`;

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  const languages = Object.fromEntries([
    ["x-default", urlFor("en")],
    ["en", urlFor("en")], ["en-GB", urlFor("uk")], ["bg-BG", urlFor("bg")], ["de-DE", urlFor("de")], ["es-ES", urlFor("es")], ["pt-BR", urlFor("pt-br")], ["tr-TR", urlFor("tr")],
  ]);

  return supportedLocales.map((locale) => ({
    url: urlFor(locale),
    lastModified,
    changeFrequency: "monthly",
    priority: locale === "en" ? 1 : 0.8,
    alternates: { languages },
  }));
}
