import type { StaticImageData } from "next/image";

export type ResumeIcon =
  | React.ComponentType<React.SVGProps<SVGSVGElement>>
  | StaticImageData;

export type IconType =
  | "github"
  | "linkedin"
  | "x"
  | "instagram"
  | "globe"
  | "mail"
  | "phone";

export interface SocialLink {
  name: string;
  url: string;
  /** Key of ICON_MAP, unknown values fall back to a globe icon */
  icon: string;
}

export interface EducationItem {
  school: string;
  degree: string;
  start: string;
  end: string;
}

export interface WorkItem {
  company: string;
  link: string;
  badges: string[];
  title: string;
  start: string;
  end: string | null;
  description: string;
  highlights?: readonly string[];
}

export interface ProjectItem {
  title: string;
  techStack: string[];
  description: string;
  link?: {
    label: string;
    href: string;
  };
}

export interface ResumeData {
  name: string;
  initials: string;
  location: string;
  locationLink: string;
  about: string;
  summary: string;
  phrase: string;
  avatarUrl: string;
  personalWebsiteUrl: string;
  contact: {
    email: string;
    tel: string;
    social: SocialLink[];
  };
  education: EducationItem[];
  work: WorkItem[];
  skills: string[];
  projects: ProjectItem[];
}
