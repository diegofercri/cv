import { notFound } from "next/navigation";
import { CommandMenu } from "@/components/command-menu";
import { getDictionary, getResumeData, isLocale } from "@/lib/i18n";
import { generateResumeStructuredData } from "@/lib/structured-data";
import type { ResumeData } from "@/lib/types";
import { Education } from "../components/education";
import { Header } from "../components/header";
import { Projects } from "../components/projects";
import { Skills } from "../components/skills";
import { Summary } from "../components/summary";
import { WorkExperience } from "../components/work-experience";

/**
 * Transform social links for command menu
 */
function getCommandMenuLinks(resume: ResumeData, personalWebsiteLabel: string) {
  const links = [];

  if (resume.personalWebsiteUrl) {
    links.push({
      url: resume.personalWebsiteUrl,
      title: personalWebsiteLabel,
    });
  }

  return [
    ...links,
    ...resume.contact.social.map((socialMediaLink) => ({
      url: socialMediaLink.url,
      title: socialMediaLink.name,
    })),
  ];
}

export default async function ResumePage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  const resume = getResumeData(lang);
  const dict = getDictionary(lang);
  const structuredData = generateResumeStructuredData(resume, lang);

  return (
    <>
      <script
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: Safe for JSON-LD structured data
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />
      <main
        className="container relative mx-auto scroll-my-12 overflow-auto p-4 print:p-11 md:p-16"
        id="main-content"
      >
        <section
          className="mx-auto w-full max-w-2xl space-y-8 bg-white print:space-y-4 dark:bg-background"
          aria-label={dict.resumeContent}
        >
          <div className="animate-fade-in" style={{ animationDelay: "0ms" }}>
            <Header resume={resume} dict={dict} locale={lang} />
          </div>

          <div className="space-y-8 print:space-y-4">
            <div className="animate-fade-in" style={{ animationDelay: "75ms" }}>
              <Summary summary={resume.summary} dict={dict} />
            </div>
            <div
              className="animate-fade-in"
              style={{ animationDelay: "150ms" }}
            >
              <WorkExperience work={resume.work} dict={dict} />
            </div>
            <div
              className="animate-fade-in"
              style={{ animationDelay: "225ms" }}
            >
              <Education education={resume.education} dict={dict} />
            </div>
            <div
              className="animate-fade-in"
              style={{ animationDelay: "300ms" }}
            >
              <Skills skills={resume.skills} dict={dict} />
            </div>
            <div
              className="animate-fade-in"
              style={{ animationDelay: "375ms" }}
            >
              <Projects projects={resume.projects} dict={dict} />
            </div>
          </div>
        </section>

        <nav className="print:hidden" aria-label={dict.quickNavigation}>
          <CommandMenu
            links={getCommandMenuLinks(resume, dict.personalWebsite)}
            dict={dict}
          />
        </nav>
      </main>
    </>
  );
}
