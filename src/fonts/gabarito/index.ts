import localFont from "next/font/local";

/**
 * Gabarito variable font, self-hosted via next/font/local.
 * Font file + SIL Open Font License 1.1 live alongside this module.
 * https://github.com/naipefoundry/gabarito
 */
export const gabarito = localFont({
  src: "./Gabarito-VariableFont_wght.ttf",
  variable: "--font-gabarito",
  weight: "100 900",
  display: "swap",
});
