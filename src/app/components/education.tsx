import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Section } from "@/components/ui/section";
import type { Dictionary } from "@/lib/i18n";
import type { EducationItem as EducationEntry } from "@/lib/types";
import { escapeDateDetection } from "@/lib/utils";

interface EducationPeriodProps {
  start: EducationEntry["start"];
  end: EducationEntry["end"];
  dict: Dictionary;
}

/**
 * Displays the education period in a consistent format
 */
function EducationPeriod({ start, end, dict }: EducationPeriodProps) {
  return (
    <div
      className="text-sm tabular-nums text-gray-500"
      title={`${dict.period}: ${start} - ${end}`}
    >
      {escapeDateDetection(`${start} - ${end}`)}
    </div>
  );
}

interface EducationItemProps {
  education: EducationEntry;
  dict: Dictionary;
}

/**
 * Individual education card component
 */
function EducationItem({ education, dict }: EducationItemProps) {
  const { school, start, end, degree } = education;
  const schoolId = `education-${school.toLowerCase().replace(/\s+/g, "-")}`;

  return (
    <Card className="border-none">
      <CardHeader>
        <div className="flex items-center justify-between gap-x-2 text-base">
          <h3 className="font-semibold leading-none" id={schoolId}>
            {school}
          </h3>
          <EducationPeriod start={start} end={end} dict={dict} />
        </div>
      </CardHeader>
      <CardContent
        className="mt-2 text-foreground/80 print:text-[12px]"
        aria-labelledby={schoolId}
      >
        {degree}
      </CardContent>
    </Card>
  );
}

interface EducationListProps {
  education: readonly EducationEntry[];
  dict: Dictionary;
}

/**
 * Main education section component
 * Renders a list of education experiences
 */
export function Education({ education, dict }: EducationListProps) {
  if (education.length === 0) return null;

  return (
    <Section>
      <h2 className="text-xl font-bold" id="education-section">
        {dict.education}
      </h2>
      <div
        className="space-y-4"
        role="feed"
        aria-labelledby="education-section"
      >
        {education.map((item) => (
          <article key={`${item.school}-${item.degree}`}>
            <EducationItem education={item} dict={dict} />
          </article>
        ))}
      </div>
    </Section>
  );
}
