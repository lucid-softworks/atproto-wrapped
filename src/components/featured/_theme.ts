/**
 * Section-color theming.
 *
 * Each featured spotlight component accepts a `theme` prop that overrides
 * its hardcoded section background/text colors. `Wrapped.tsx` assigns
 * themes by position (cycling through CYCLE_THEMES) so the page colors
 * rotate predictably regardless of which sections happen to render for a
 * given user.
 *
 * Internal chips/cards inside each section are NOT remapped — they keep
 * their original styling. That means a section originally designed for a
 * dark bg (cream text on violet) might look slightly off when cycled
 * onto a light bg, but it's a pragmatic tradeoff over refactoring every
 * inner element.
 */

export type SectionTheme =
  | "pink"
  | "violet"
  | "lime"
  | "orange"
  | "cyan"
  | "yellow"
  | "mint"
  | "red"
  | "cobalt";

export type ThemeClasses = {
  /** Tailwind class for the outer `<section>` background. */
  bg: string;
  /** Tailwind class for the outer `<section>` text color. */
  text: string;
  /** Whether the section reads as "dark" (light text on dark bg). */
  dark: boolean;
};

export const SECTION_THEMES: Record<SectionTheme, ThemeClasses> = {
  pink: { bg: "bg-wrap-pink", text: "text-ink", dark: false },
  violet: { bg: "bg-wrap-violet", text: "text-cream", dark: true },
  lime: { bg: "bg-wrap-lime", text: "text-ink", dark: false },
  orange: { bg: "bg-wrap-orange", text: "text-ink", dark: false },
  cyan: { bg: "bg-wrap-cyan", text: "text-ink", dark: false },
  yellow: { bg: "bg-wrap-yellow", text: "text-ink", dark: false },
  mint: { bg: "bg-wrap-mint", text: "text-ink", dark: false },
  red: { bg: "bg-wrap-red", text: "text-cream", dark: true },
  cobalt: { bg: "bg-wrap-cobalt", text: "text-cream", dark: true },
};

/** Cycle order used by Wrapped.tsx to assign themes by position. */
export const CYCLE_THEMES: SectionTheme[] = [
  "pink",
  "violet",
  "lime",
  "orange",
  "cyan",
  "yellow",
  "mint",
  "red",
  "cobalt",
];

export function sectionTheme(theme?: SectionTheme): ThemeClasses {
  return SECTION_THEMES[theme ?? "pink"];
}
