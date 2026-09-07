import type React from "react";
import { cn } from "@/lib/utils";

export interface SectionProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Section({ className, ...props }: SectionProps) {
  return (
    <section
      className={cn("flex min-h-0 flex-col gap-y-2", className)}
      {...props}
    />
  );
}
