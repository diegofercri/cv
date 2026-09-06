import { type NextRequest, NextResponse } from "next/server";
import { DEFAULT_LOCALE, type Locale, LOCALES } from "@/lib/i18n";

/**
 * Parses an Accept-Language header into language tags ordered by
 * preference (highest "q" first, "q=1" implied when omitted).
 */
function parseAcceptLanguage(header: string): string[] {
  return header
    .split(",")
    .map((part) => {
      const [tag, ...params] = part.trim().split(";");
      const qParam = params.find((p) => p.trim().startsWith("q="));
      const q = qParam ? Number.parseFloat(qParam.split("=")[1]) : 1;
      return { tag: tag.trim().toLowerCase(), q: Number.isNaN(q) ? 1 : q };
    })
    .filter(({ tag }) => tag.length > 0)
    .sort((a, b) => b.q - a.q)
    .map(({ tag }) => tag);
}

/**
 * Picks the first supported locale matching the tags' primary language
 * subtag (e.g. "en-GB" matches "en"), preserving preference order.
 */
function matchLocale(tags: string[]): Locale | undefined {
  for (const tag of tags) {
    const primary = tag.split("-")[0];
    const match = LOCALES.find((locale) => locale === primary);
    if (match) return match;
  }
  return undefined;
}

/**
 * Redirects locale-less urls (/, /sobre-mi, ...) to the preferred locale,
 * using the Accept-Language header when it matches a supported locale.
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const hasLocale = LOCALES.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`)
  );
  if (hasLocale) return NextResponse.next();

  const acceptLanguage = request.headers.get("accept-language") ?? "";
  const preferred =
    matchLocale(parseAcceptLanguage(acceptLanguage)) ?? DEFAULT_LOCALE;

  const url = request.nextUrl.clone();
  url.pathname = `/${preferred}${pathname === "/" ? "" : pathname}`;
  // 308 (permanent) instead of the default 307: this redirect is a
  // permanent architectural decision, not a temporary A/B test, so it
  // should consolidate SEO signals onto the locale URL.
  return NextResponse.redirect(url, 308);
}

export const config = {
  matcher: [
    /*
     * Skip next internals, static assets and metadata files.
     */
    "/((?!_next|api|favicon.ico|apple-icon.png|opengraph-image|sitemap.xml|robots.txt|.*\\..*).*)",
  ],
};
