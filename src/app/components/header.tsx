import { GlobeIcon, MailIcon, MapPinIcon, PhoneIcon } from "lucide-react";
import type React from "react";
import { Avatar } from "@/components/avatar";
import { GitHubIcon, InstagramIcon, LinkedInIcon } from "@/components/icons";
import { LanguageSwitcher } from "@/components/language-switcher";
import { Button } from "@/components/ui/button";
import type { Dictionary, Locale } from "@/lib/i18n";
import { resolveAvatarUrl } from "@/lib/i18n";
import type { ResumeData } from "@/lib/types";
import { cn } from "@/lib/utils";

// Type-safe icon mapping
const ICON_MAP: Record<
  string,
  React.ComponentType<React.SVGProps<SVGSVGElement>>
> = {
  github: GitHubIcon,
  linkedin: LinkedInIcon,
  instagram: InstagramIcon,
  globe: GlobeIcon,
  mail: MailIcon,
  phone: PhoneIcon,
} as const;

interface LocationLinkProps {
  location: string;
  locationLink: string;
  dict: Dictionary;
}

function LocationLink({ location, locationLink, dict }: LocationLinkProps) {
  return (
    <p className="max-w-md items-center text-pretty text-xs text-foreground">
      <a
        className="inline-flex gap-x-1.5 align-baseline leading-none hover:underline"
        href={locationLink}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`${dict.location}: ${location}`}
      >
        <MapPinIcon className="size-3" aria-hidden="true" />
        {location}
      </a>
    </p>
  );
}

interface SocialButtonProps {
  href: string;
  iconType: string;
  label: string;
}

function SocialButton({ href, iconType, label }: SocialButtonProps) {
  const IconComponent = ICON_MAP[iconType] ?? GlobeIcon;

  return (
    <Button className="size-8" variant="outline" size="icon" asChild={true}>
      <a
        href={href}
        aria-label={label}
        target="_blank"
        rel="noopener noreferrer"
      >
        <IconComponent className="size-4" aria-hidden="true" />
      </a>
    </Button>
  );
}

interface ContactProps {
  contact: ResumeData["contact"];
  personalWebsiteUrl?: string;
  dict: Dictionary;
}

function ContactButtons({ contact, personalWebsiteUrl, dict }: ContactProps) {
  return (
    <ul
      className="flex list-none gap-x-1 pt-1 text-sm text-foreground/80 print:hidden"
      aria-label={dict.contactLinks}
    >
      {personalWebsiteUrl && (
        <li>
          <SocialButton
            href={personalWebsiteUrl}
            iconType="globe"
            label={dict.personalWebsite}
          />
        </li>
      )}
      {contact.email && (
        <li>
          <SocialButton
            href={`mailto:${contact.email}`}
            iconType="mail"
            label={dict.email}
          />
        </li>
      )}
      {contact.tel && (
        <li>
          <SocialButton
            href={`tel:${contact.tel}`}
            iconType="phone"
            label={dict.phone}
          />
        </li>
      )}
      {contact.social.map((social) => (
        <li key={social.name}>
          <SocialButton
            href={social.url}
            iconType={social.icon}
            label={social.name}
          />
        </li>
      ))}
    </ul>
  );
}

function PrintContact({
  contact,
  personalWebsiteUrl,
}: Omit<ContactProps, "dict">) {
  return (
    <div className="hidden gap-x-2 text-sm text-foreground/80 print:flex">
      {personalWebsiteUrl && (
        <>
          <a className="hover:text-foreground/70" href={personalWebsiteUrl}>
            {new URL(personalWebsiteUrl).hostname}
          </a>
          <span aria-hidden="true">/</span>
        </>
      )}
      {contact.email && (
        <>
          <a
            className="hover:text-foreground/70"
            href={`mailto:${contact.email}`}
          >
            {contact.email}
          </a>
          {contact.tel && <span aria-hidden="true">/</span>}
        </>
      )}
      {contact.tel && (
        <a className="hover:text-foreground/70" href={`tel:${contact.tel}`}>
          {contact.tel}
        </a>
      )}
    </div>
  );
}

interface HeaderProps {
  resume: ResumeData;
  dict: Dictionary;
  locale: Locale;
}

/**
 * Header component displaying personal information and contact details
 */
export function Header({ resume, dict, locale }: HeaderProps) {
  return (
    <header className="flex flex-col items-start gap-y-4 md:flex-row md:items-start md:justify-between md:gap-y-0 print:flex-row print:items-start print:justify-between print:gap-y-0">
      <div className="min-w-0 flex-1 space-y-1.5">
        <h1 className="text-3xl font-bold tracking-tight" id="resume-name">
          {resume.name}
        </h1>
        <p className="max-w-md text-pretty text-sm text-foreground/80">
          {resume.about}
        </p>

        <LocationLink
          location={resume.location}
          locationLink={resume.locationLink}
          dict={dict}
        />

        <p className="mb-2.5 max-w-md text-pretty text-sm italic text-foreground/60">
          &ldquo;{resume.phrase}&rdquo;
        </p>

        <ContactButtons
          contact={resume.contact}
          personalWebsiteUrl={resume.personalWebsiteUrl}
          dict={dict}
        />

        <PrintContact
          contact={resume.contact}
          personalWebsiteUrl={resume.personalWebsiteUrl}
        />
      </div>

      <div
        className={cn(
          "order-first flex w-full items-start justify-between",
          "md:order-none md:w-auto md:flex-col-reverse md:items-end md:gap-y-3",
          "print:order-none print:w-auto print:flex-col-reverse print:items-end print:gap-y-0"
        )}
      >
        <Avatar
          className="size-28 ring-1 ring-muted"
          src={resolveAvatarUrl(resume.avatarUrl)}
          alt={resume.name}
          fallback={resume.initials}
        />
        <LanguageSwitcher currentLocale={locale} dict={dict} />
      </div>
    </header>
  );
}
