import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const SUPPORTED_LOCALES = ["en", "uk", "bg", "de", "es", "pt-br", "tr"] as const;
const DEFAULT_LOCALE = "en";

function detectLocale(request: NextRequest) {
  const country = (request.headers.get("cf-ipcountry") || "").toLowerCase();
  const language = (request.headers.get("accept-language") || "").toLowerCase();

  if (country === "bg" || language.startsWith("bg")) return "bg";
  if (["de", "at", "ch"].includes(country) || language.startsWith("de")) return "de";
  if (country === "gb" || language.startsWith("en-gb") || language.startsWith("en-ie")) return "uk";
  if (["es", "mx", "ar", "co"].includes(country) || language.startsWith("es")) return "es";
  if (["br", "pt"].includes(country) || language.startsWith("pt")) return "pt-br";
  if (country === "tr" || language.startsWith("tr")) return "tr";
  return DEFAULT_LOCALE;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const response = NextResponse.next();

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/healthz") ||
    pathname.includes(".")
  ) return response;

  const localeMatch = SUPPORTED_LOCALES.find(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`)
  );
  const locale = localeMatch || (pathname === "/" ? detectLocale(request) : DEFAULT_LOCALE);

  response.headers.set("x-mindreply-locale", locale);

  // Keep / as the stable x-default URL. Localized variants use explicit subdirectories.
  // Human visitors may be redirected once from /; crawlers keep / indexable as x-default.
  if (pathname === "/" && locale !== DEFAULT_LOCALE) {
    const userAgent = request.headers.get("user-agent") || "";
    const isCrawler = /bot|crawler|spider|slurp|bingpreview/i.test(userAgent);
    if (!isCrawler) {
      const url = request.nextUrl.clone();
      url.pathname = `/${locale}/`;
      return NextResponse.redirect(url, 307);
    }
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
