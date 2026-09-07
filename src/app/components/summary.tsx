import type { Dictionary } from "@/lib/i18n";
import { Section } from "../../components/ui/section";

interface AboutProps {
  summary: string;
  dict: Dictionary;
  className?: string;
}

/**
 * Summary section component
 * Displays a summary of professional experience and goals
 */
export function Summary({ summary, dict, className }: AboutProps) {
  return (
    <Section className={className}>
      <h2 className="text-xl font-bold" id="about-section">
        {dict.about}
      </h2>
      <div className="text-pretty text-sm text-foreground/80">{summary}</div>
    </Section>
  );
}
