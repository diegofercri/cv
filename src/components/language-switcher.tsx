import Link from "next/link";
import type { Dictionary, Locale } from "@/lib/i18n";
import { LOCALES } from "@/lib/i18n";
import { cn } from "@/lib/utils";

interface LanguageSwitcherProps {
  currentLocale: Locale;
  dict: Dictionary;
  className?: string;
}

/**
 * Small en/es toggle. Hidden when printing.
 */
export function LanguageSwitcher({
  currentLocale,
  dict,
  className,
}: LanguageSwitcherProps) {
  return (
    <nav
      className={cn(
        "flex list-none items-center gap-x-1 text-xs print:hidden",
        className
      )}
      aria-label={dict.switchLanguage}
    >
      {LOCALES.map((locale) => {
        const isActive = locale === currentLocale;

        return (
          <Link
            key={locale}
            href={`/${locale}`}
            hrefLang={locale}
            aria-current={isActive ? "true" : undefined}
            className={cn(
              "rounded border px-1.5 py-0.5 uppercase transition-colors",
              isActive
                ? "border-foreground/20 bg-muted text-foreground"
                : "border-transparent text-foreground/60 hover:text-foreground"
            )}
          >
            {locale}
          </Link>
        );
      })}
    </nav>
  );
}
