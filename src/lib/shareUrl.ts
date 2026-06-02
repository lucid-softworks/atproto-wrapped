export type ShareResult = "shared" | "copied" | "failed";

export async function shareWrappedUrl(handle: string): Promise<ShareResult> {
  if (typeof window === "undefined") return "failed";
  const url = `${window.location.origin}/@${handle}`;
  const title = `@${handle}'s ATproto Wrapped`;
  const text = `A year of @${handle} across the ATmosphere.`;

  if (typeof navigator !== "undefined" && typeof navigator.share === "function") {
    try {
      await navigator.share({ url, title, text });
      return "shared";
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") {
        throw err;
      }
      // fall through to clipboard
    }
  }

  if (
    typeof navigator !== "undefined" &&
    navigator.clipboard &&
    typeof navigator.clipboard.writeText === "function"
  ) {
    try {
      await navigator.clipboard.writeText(url);
      return "copied";
    } catch {
      return "failed";
    }
  }
  return "failed";
}
