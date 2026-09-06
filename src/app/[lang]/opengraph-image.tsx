import { ImageResponse } from "next/og";
import {
  DEFAULT_LOCALE,
  getResumeData,
  isLocale,
  resolveAvatarUrl,
  SITE_URL,
} from "@/lib/i18n";

export const alt = "Resume";
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

/**
 * Satori only renders png/jpeg/gif, and throws when the image is missing,
 * so unusable avatars fall back to the initials.
 */
async function isRenderableAvatar(src: string): Promise<boolean> {
  try {
    const response = await fetch(src);
    if (!response.ok) return false;
    const type = response.headers.get("content-type") ?? "";
    return ["image/png", "image/jpeg", "image/gif"].includes(type);
  } catch {
    return false;
  }
}

export default async function Image({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const locale = isLocale(lang) ? lang : DEFAULT_LOCALE;
  const resume = getResumeData(locale);

  const avatar = resolveAvatarUrl(resume.avatarUrl);
  const avatarSrc = avatar.startsWith("http") ? avatar : `${SITE_URL}${avatar}`;
  const showAvatar = await isRenderableAvatar(avatarSrc);

  return new ImageResponse(
    <div
      style={{
        background: "white",
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: '"Inter"',
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
        }}
      >
        {showAvatar ? (
          // biome-ignore lint/performance/noImgElement: ImageResponse context requires img element
          <img
            src={avatarSrc}
            alt={resume.name}
            style={{
              width: "150px",
              height: "150px",
              borderRadius: "10%",
              marginBottom: "2rem",
            }}
          />
        ) : (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "150px",
              height: "150px",
              borderRadius: "10%",
              marginBottom: "2rem",
              background: "#f1f1f1",
              color: "#333",
              fontSize: "3rem",
              fontWeight: "bold",
            }}
          >
            {resume.initials}
          </div>
        )}
        <div
          style={{
            fontSize: "3rem",
            fontWeight: "bold",
            color: "#333",
            marginBottom: "1rem",
          }}
        >
          {resume.name}
        </div>
        <div
          style={{
            fontSize: "1.5rem",
            color: "#666",
            maxWidth: "600px",
            lineHeight: "1.4",
          }}
        >
          {resume.about}
        </div>
        {resume.personalWebsiteUrl && (
          <div
            style={{
              display: "flex",
              marginTop: "2rem",
              fontSize: "1rem",
              color: "#666",
            }}
          >
            {resume.personalWebsiteUrl}
          </div>
        )}
      </div>
    </div>,
    {
      ...size,
    }
  );
}
