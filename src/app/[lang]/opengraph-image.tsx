import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { ImageResponse } from "next/og";
import {
  DEFAULT_LOCALE,
  getResumeData,
  isLocale,
  LOCALES,
  resolveAvatarUrl,
} from "@/lib/i18n";

export const alt = "Resume";
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang }));
}

/** Image formats Satori (the ImageResponse renderer) can actually paint. */
const RENDERABLE_MIME_BY_EXTENSION: Record<string, string> = {
  png: "image/png",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  gif: "image/gif",
};

/**
 * Reads a local /public avatar straight from disk and inlines it as a data
 * URI, so rendering this image never makes a network round-trip back to
 * the site itself. Returns null when the file is missing or in a format
 * Satori can't render (e.g. webp), so the caller falls back to the
 * initials.
 */
function loadLocalAvatar(avatarPath: string): string | null {
  const extension = avatarPath.split(".").pop()?.toLowerCase() ?? "";
  const mime = RENDERABLE_MIME_BY_EXTENSION[extension];
  if (!mime) return null;

  const filePath = path.join(process.cwd(), "public", avatarPath);
  if (!existsSync(filePath)) return null;

  return `data:${mime};base64,${readFileSync(filePath).toString("base64")}`;
}

/**
 * Remote avatars can't be read from disk, so this is the only case that
 * still needs a live request to confirm Satori can render it.
 */
async function isRenderableRemoteAvatar(src: string): Promise<boolean> {
  try {
    const response = await fetch(src);
    if (!response.ok) return false;
    const type = response.headers.get("content-type") ?? "";
    return Object.values(RENDERABLE_MIME_BY_EXTENSION).includes(type);
  } catch {
    return false;
  }
}

/**
 * Satori (the ImageResponse renderer) can't consume next/font objects, and
 * it can't parse variable fonts either (the app's variable Gabarito file
 * crashes it), so these static Regular/Bold instances — pre-generated from
 * that same variable font via fonttools varLib.instancer — are read
 * straight off disk and registered as raw font data instead.
 */
const gabaritoRegular = readFileSync(
  path.join(process.cwd(), "src/fonts/gabarito/static/Gabarito-Regular.ttf")
);
const gabaritoBold = readFileSync(
  path.join(process.cwd(), "src/fonts/gabarito/static/Gabarito-Bold.ttf")
);

export default async function Image({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const locale = isLocale(lang) ? lang : DEFAULT_LOCALE;
  const resume = getResumeData(locale);

  const avatar = resolveAvatarUrl(resume.avatarUrl);
  const isRemote = avatar.startsWith("http");
  const localAvatar = isRemote ? null : loadLocalAvatar(avatar);
  const showAvatar = isRemote
    ? await isRenderableRemoteAvatar(avatar)
    : localAvatar !== null;
  const avatarSrc = localAvatar ?? avatar;

  return new ImageResponse(
    <div
      style={{
        background: "white",
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: '"Gabarito"',
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
      fonts: [
        {
          name: "Gabarito",
          data: gabaritoRegular,
          style: "normal",
          weight: 400,
        },
        { name: "Gabarito", data: gabaritoBold, style: "normal", weight: 700 },
      ],
    }
  );
}
