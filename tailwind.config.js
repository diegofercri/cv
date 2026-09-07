/**
 * Golden-ratio type scale.
 *
 * The body copy was reading too small. Rather than reconstruct a new scale
 * from scratch (which would distort Tailwind's original proportions —
 * its steps aren't uniform, so a plain geometric progression ends up
 * shrinking the top end back down), every default size/line-height is
 * scaled up by the same golden-ratio-derived factor: sqrt(phi) ≈ 1.272.
 * That keeps the original scale's shape intact while making every step
 * ~27% bigger, all "calculated from the golden ratio" as requested.
 *
 * Sizes stay in rem (so they still respect the user's root font-size/zoom,
 * unlike a hardcoded px value), but sqrt(phi) is irrational, so scaling
 * Tailwind's px values by it lands on sub-pixel results (e.g. 15.264px).
 * Browsers render those with sub-pixel anti-aliasing, which is what reads
 * as blurry — so each scaled value is snapped to the nearest whole pixel
 * at the 16px default root size before being expressed back in rem.
 */
const PHI = (1 + Math.sqrt(5)) / 2;
const SCALE = Math.sqrt(PHI);
const ROOT_PX = 16;

/** Scales one of Tailwind's own default [fontSize, lineHeight] px pairs by SCALE, rounded to whole pixels, and expressed in rem. */
function scaleUp(fontSizePx, lineHeightPx) {
  const fontSize = Math.round(fontSizePx * SCALE);
  const lineHeight = Math.round(lineHeightPx * SCALE);
  return [`${fontSize / ROOT_PX}rem`, { lineHeight: `${lineHeight / ROOT_PX}rem` }];
}

// Tailwind's default scale (px), scaled up by the same factor.
const fontSize = {
  xs: scaleUp(12, 16), // -> 15px/20px
  sm: scaleUp(14, 20), // -> 18px/25px
  base: scaleUp(16, 24), // -> 20px/31px
  lg: scaleUp(18, 28), // -> 23px/36px
  xl: scaleUp(20, 28), // -> 25px/36px
  "2xl": scaleUp(24, 32), // -> 31px/41px
  "3xl": scaleUp(30, 36), // -> 38px/46px
  "4xl": scaleUp(36, 40), // -> 46px/51px
};

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        sans: ["var(--font-gabarito)", "system-ui", "sans-serif"],
      },
      fontSize,
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}