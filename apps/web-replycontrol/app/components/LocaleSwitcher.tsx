"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { localeNames, normalizeLocale, supportedLocales, type SupportedLocale } from "../lib/locales";

export function LocaleSwitcher({ locale }: { locale: SupportedLocale }) {
  const router = useRouter();
  const pathname = usePathname();
  const [suggested, setSuggested] = useState<SupportedLocale | null>(null);

  useEffect(() => {
    const detected = normalizeLocale(navigator.language);
    if (detected !== locale) setSuggested(detected);
  }, [locale]);

  function choose(next: SupportedLocale) {
    const cleanPath = pathname.replace(/^\/(en|bg|de|fr|es)(?=\/|$)/, "") || "/";
    router.push(next === "en" ? cleanPath : `/${next}${cleanPath === "/" ? "" : cleanPath}`);
  }

  return <div className="localeSwitcher" aria-label="Country and language">
    <label htmlFor="locale-select">{localeNames[locale]}</label>
    <select id="locale-select" value={locale} onChange={(event) => choose(event.target.value as SupportedLocale)}>
      {supportedLocales.map((option) => <option key={option} value={option}>{localeNames[option]}</option>)}
    </select>
    {suggested && <button type="button" onClick={() => choose(suggested)}>Use {localeNames[suggested]}</button>}
  </div>;
}
