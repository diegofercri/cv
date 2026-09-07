import { Badge } from "@/components/ui/badge";
import { Section } from "@/components/ui/section";
import type { Dictionary } from "@/lib/i18n";
import { cn } from "@/lib/utils";

type Skills = readonly string[];

interface SkillsListProps {
  skills: Skills;
  dict: Dictionary;
  className?: string;
}

/**
 * Renders a list of skills as badges
 */
function SkillsList({ skills, dict, className }: SkillsListProps) {
  return (
    <ul
      className={cn("flex list-none flex-wrap gap-1 p-0", className)}
      aria-label={dict.skillsList}
    >
      {skills.map((skill) => (
        <li key={skill}>
          <Badge
            variant="secondary"
            className="print:text-[10px]"
            aria-label={skill}
          >
            {skill}
          </Badge>
        </li>
      ))}
    </ul>
  );
}

interface SkillsProps {
  skills: Skills;
  dict: Dictionary;
  className?: string;
}

/**
 * Skills section component
 * Displays a list of professional skills as badges
 */
export function Skills({ skills, dict, className }: SkillsProps) {
  if (skills.length === 0) return null;

  return (
    <Section className={className}>
      <h2 className="text-xl font-bold" id="skills-section">
        {dict.skills}
      </h2>
      <SkillsList skills={skills} dict={dict} />
    </Section>
  );
}
