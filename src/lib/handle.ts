import punycode from "punycode";

/**
 * Convert a handle's domain labels from their punycode (`xn--…`) form to
 * the human-readable unicode form. The original handle stays canonical for
 * URLs and API calls — this is purely for display.
 *
 *   toDisplayHandle("koehn.xn--q9jyb4c") → "koehn.ねこ"
 *   toDisplayHandle("imlunahey.com")     → "imlunahey.com"
 */
export function toDisplayHandle(handle: string): string {
  if (!handle) return handle;
  try {
    return handle
      .split(".")
      .map((label) =>
        label.startsWith("xn--") ? punycode.decode(label.slice(4)) : label,
      )
      .join(".");
  } catch {
    return handle;
  }
}
