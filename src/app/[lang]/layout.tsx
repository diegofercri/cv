import { Analytics } from "@vercel/analytics/react";
import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";
import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";

import "../globals.css";
import type React from "react";
import { ErrorBoundary } from "@/components/error-boundary";
import {
  getDictionary,
  getResumeData,
  isLocale,
  LOCALES,
  SITE_URL,
} from "@/lib/i18n";

interface LangParams {
  params: Promise<{ lang: string }>;
}

export function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang }));
}

export async function generateMetadata({
  params,
}: LangParams): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  const resume = getResumeData(lang);
  const dict = getDictionary(lang);
  const title = `${resume.name} - ${resume.about}`;

  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: title,
      template: `%s | ${resume.name}`,
    },
    description: resume.about,
    keywords: [dict.resume, "cv", "portfolio", resume.name, ...resume.skills],
    authors: [{ name: resume.name }],
    creator: resume.name,
    publisher: resume.name,
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    openGraph: {
      type: "profile",
      locale: dict.ogLocale,
      url: `${SITE_URL}/${lang}`,
      siteName: `${resume.name} - ${dict.resume}`,
      title,
      description: resume.about,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: resume.about,
    },
    alternates: {
      canonical: `${SITE_URL}/${lang}`,
      languages: Object.fromEntries(
        LOCALES.map((locale) => [locale, `${SITE_URL}/${locale}`])
      ),
    },
  };
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  return (
    <html
      lang={getDictionary(lang).htmlLang}
      className={`${GeistSans.variable} ${GeistMono.variable}`}
    >
      <body>
        <ErrorBoundary>{children}</ErrorBoundary>
        <Analytics />
      </body>
    </html>
  );
}
