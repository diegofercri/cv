import enData from "@/data/en.json";
import esData from "@/data/es.json";
import type { ResumeData } from "@/lib/types";

export const LOCALES = ["es", "en"] as const;

export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "es";

/**
 * Base url of the deployment, used for metadata, sitemap and structured data.
 * Override it with NEXT_PUBLIC_SITE_URL in production.
 */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://diegofercri.dev";

const RESUME_BY_LOCALE = {
  es: esData,
  en: enData,
} satisfies Record<Locale, ResumeData>;

export function isLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value);
}

export function getResumeData(locale: Locale): ResumeData {
  return RESUME_BY_LOCALE[locale];
}

interface Dictionary {
  htmlLang: string;
  ogLocale: string;
  resume: string;
  about: string;
  workExperience: string;
  education: string;
  skills: string;
  projects: string;
  present: string;
  employmentPeriod: string;
  period: string;
  personalWebsite: string;
  email: string;
  phone: string;
  location: string;
  contactLinks: string;
  technologiesUsed: string;
  skillsList: string;
  quickNavigation: string;
  resumeContent: string;
  /** Contains the "{shortcut}" placeholder, replaced on the client */
  commandMenuHint: string;
  commandMenuTitle: string;
  commandMenuDescription: string;
  commandPlaceholder: string;
  noResults: string;
  actions: string;
  print: string;
  links: string;
  switchLanguage: string;
}

const DICTIONARIES: Record<Locale, Dictionary> = {
  es: {
    htmlLang: "es",
    ogLocale: "es_ES",
    resume: "Currículum",
    about: "Sobre mí",
    workExperience: "Experiencia laboral",
    education: "Formación",
    skills: "Habilidades",
    projects: "Proyectos",
    present: "Actualidad",
    employmentPeriod: "Periodo de empleo",
    period: "Periodo",
    personalWebsite: "Sitio web personal",
    email: "Correo electrónico",
    phone: "Teléfono",
    location: "Ubicación",
    contactLinks: "Enlaces de contacto",
    technologiesUsed: "Tecnologías utilizadas",
    skillsList: "Lista de habilidades",
    quickNavigation: "Navegación rápida",
    resumeContent: "Contenido del currículum",
    commandMenuHint: "Pulsa {shortcut} para abrir el menú de comandos",
    commandMenuTitle: "Menú de comandos",
    commandMenuDescription: "Busca una acción o un enlace y pulsa Intro",
    commandPlaceholder: "Escribe un comando o busca...",
    noResults: "Sin resultados.",
    actions: "Acciones",
    print: "Imprimir",
    links: "Enlaces",
    switchLanguage: "Cambiar idioma",
  },
  en: {
    htmlLang: "en",
    ogLocale: "en_US",
    resume: "Resume",
    about: "About",
    workExperience: "Work Experience",
    education: "Education",
    skills: "Skills",
    projects: "Projects",
    present: "Present",
    employmentPeriod: "Employment period",
    period: "Period",
    personalWebsite: "Personal website",
    email: "Email",
    phone: "Phone",
    location: "Location",
    contactLinks: "Contact links",
    technologiesUsed: "Technologies used",
    skillsList: "List of skills",
    quickNavigation: "Quick navigation",
    resumeContent: "Resume Content",
    commandMenuHint: "Press {shortcut} to open the command menu",
    commandMenuTitle: "Command Menu",
    commandMenuDescription: "Search for an action or a link and press Enter",
    commandPlaceholder: "Type a command or search...",
    noResults: "No results found.",
    actions: "Actions",
    print: "Print",
    links: "Links",
    switchLanguage: "Switch language",
  },
};

export function getDictionary(locale: Locale): Dictionary {
  return DICTIONARIES[locale];
}

export type { Dictionary };

/**
 * Resolves avatar paths coming from the JSON files.
 * Remote urls are kept as is, local ones are served from /public.
 */
export function resolveAvatarUrl(avatarUrl: string): string {
  if (!avatarUrl) return "";
  if (/^https?:\/\//.test(avatarUrl)) return avatarUrl;
  return `/${avatarUrl.replace(/^\//, "")}`;
}
