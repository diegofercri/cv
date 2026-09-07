import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Section } from "@/components/ui/section";
import type { Dictionary } from "@/lib/i18n";
import type { WorkItem } from "@/lib/types";
import { cn, escapeDateDetection } from "@/lib/utils";

type WorkBadges = readonly string[];

interface BadgeListProps {
  className?: string;
  badges: WorkBadges;
  dict: Dictionary;
}

/**
 * Renders a list of badges for work experience
 * Handles both mobile and desktop layouts through className prop
 */
function BadgeList({ className, badges, dict }: BadgeListProps) {
  if (badges.length === 0) return null;

  return (
    <ul
      className={cn("inline-flex list-none gap-x-1 p-0", className)}
      aria-label={dict.technologiesUsed}
    >
      {badges.map((badge) => (
        <li key={badge}>
          <Badge
            variant="secondary"
            className="align-middle text-xs print:px-1 print:py-0.5 print:text-[8px] print:leading-tight"
          >
            {badge}
          </Badge>
        </li>
      ))}
    </ul>
  );
}

interface WorkPeriodProps {
  start: WorkItem["start"];
  end?: WorkItem["end"];
  dict: Dictionary;
}

/**
 * Displays the work period in a consistent format
 */
function WorkPeriod({ start, end, dict }: WorkPeriodProps) {
  return (
    <div
      className="text-sm tabular-nums text-gray-500"
      title={`${dict.employmentPeriod}: ${start} - ${end ?? dict.present}`}
    >
      {escapeDateDetection(`${start} - ${end ?? dict.present}`)}
    </div>
  );
}

interface CompanyLinkProps {
  company: WorkItem["company"];
  link: WorkItem["link"];
}

/**
 * Renders company name with optional link
 */
function CompanyLink({ company, link }: CompanyLinkProps) {
  if (!link) {
    return <span>{company}</span>;
  }

  return (
    <a
      className="hover:underline"
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={company}
    >
      {company}
    </a>
  );
}

interface WorkExperienceItemProps {
  work: WorkItem;
  dict: Dictionary;
}

/**
 * Individual work experience card component
 * Badges are rendered on their own line below the company name
 */
function WorkExperienceItem({ work, dict }: WorkExperienceItemProps) {
  const { company, link, badges, title, start, end, description, highlights } =
    work;

  return (
    <Card className="border-none py-1 print:py-0">
      <CardHeader className="space-y-0">
        <div>
          <div className="flex items-center justify-between gap-x-2 text-base">
            <h3 className="font-semibold leading-none print:text-sm">
              <CompanyLink company={company} link={link} />
            </h3>
            <WorkPeriod start={start} end={end} dict={dict} />
          </div>

          <BadgeList
            className="mt-1 flex-wrap gap-1 print:mt-0.5"
            badges={badges}
            dict={dict}
          />

          <h4 className="mt-4 text-sm font-semibold leading-none print:mt-2 print:text-[12px]">
            {title}
          </h4>
        </div>
      </CardHeader>

      <CardContent>
        <div className="mt-3 text-xs text-foreground/80 print:mt-1.5 print:text-[10px] text-pretty">
          {description}
          {highlights && highlights.length > 0 && (
            <ul className="mt-1.5 list-inside list-disc print:mt-1">
              {highlights.map((highlight) => (
                <li key={highlight}>{highlight}</li>
              ))}
            </ul>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

interface WorkExperienceProps {
  work: readonly WorkItem[];
  dict: Dictionary;
}

/**
 * Main work experience section component
 * Renders a list of work experiences in chronological order
 */
export function WorkExperience({ work, dict }: WorkExperienceProps) {
  if (work.length === 0) return null;

  return (
    <Section>
      <h2 className="text-xl font-bold" id="work-experience">
        {dict.workExperience}
      </h2>
      <div
        className="space-y-4 print:space-y-0"
        role="feed"
        aria-labelledby="work-experience"
      >
        {work.map((item) => (
          <article key={`${item.company}-${item.start}`}>
            <WorkExperienceItem work={item} dict={dict} />
          </article>
        ))}
      </div>
    </Section>
  );
}
