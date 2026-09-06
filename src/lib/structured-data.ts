import { type Locale, resolveAvatarUrl, SITE_URL } from "@/lib/i18n";
import type { ResumeData } from "@/lib/types";

function absoluteUrl(path: string): string {
  if (/^https?:\/\//.test(path)) return path;
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

export function generatePersonStructuredData(resume: ResumeData) {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: resume.name,
    alternateName: resume.initials,
    description: resume.about,
    url: resume.personalWebsiteUrl,
    image: absoluteUrl(resolveAvatarUrl(resume.avatarUrl)),
    sameAs: resume.contact.social.map((social) => social.url),
    address: {
      "@type": "Place",
      name: resume.location,
    },
    contactPoint: {
      "@type": "ContactPoint",
      email: resume.contact.email,
      telephone: resume.contact.tel,
      contactType: "personal",
    },
    jobTitle: resume.about,
    worksFor:
      resume.work.length > 0
        ? {
            "@type": "Organization",
            name: resume.work[0].company,
            url: resume.work[0].link,
          }
        : undefined,
    alumniOf: resume.education.map((edu) => ({
      "@type": "EducationalOrganization",
      name: edu.school,
    })),
    hasOccupation: resume.work.map((job) => ({
      "@type": "Occupation",
      name: job.title,
      occupationLocation: {
        "@type": "Place",
        name: resume.location,
      },
      occupationalCategory: "Software Engineering",
    })),
    knowsAbout: resume.skills,
  };
}

export function generateResumeStructuredData(
  resume: ResumeData,
  locale: Locale
) {
  const person = generatePersonStructuredData(resume);
  const url = `${SITE_URL}/${locale}`;

  return {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    inLanguage: locale,
    mainEntity: person,
    about: person,
    name: `${resume.name} - ${resume.about}`,
    description: resume.summary,
    url,
  };
}
