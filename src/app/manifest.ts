import type { MetadataRoute } from "next";
import { DEFAULT_LOCALE, getResumeData } from "@/lib/i18n";

export default function manifest(): MetadataRoute.Manifest {
  const resume = getResumeData(DEFAULT_LOCALE);

  return {
    name: `${resume.name} - ${resume.about}`,
    short_name: resume.name,
    description: resume.about,
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#ffffff",
    icons: [
      {
        src: "/android-chrome-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/android-chrome-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
