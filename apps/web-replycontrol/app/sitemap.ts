import type { MetadataRoute } from "next";
import { supportedLocales } from "./lib/locales";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return supportedLocales.map((locale) => ({
    url: `https://mind-reply.com${locale === "en" ? "" : `/${locale}`}`,
    lastModified,
    changeFrequency: "monthly",
    priority: locale === "en" ? 1 : 0.8,
    alternates: { languages: Object.fromEntries(supportedLocales.map((code) => [code, `https://mind-reply.com${code === "en" ? "" : `/${code}`}`])) },
  }));
}
