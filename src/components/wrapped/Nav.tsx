import { Link } from "@tanstack/react-router";
import { ShareButton } from "./ShareButton";

export function StickyNav({
  handle,
  onShare,
}: {
  handle: string;
  onShare: () => Promise<"shared" | "copied" | "failed">;
}) {
  return (
    <div className="sticky top-0 z-20 border-b-2 border-ink bg-cream/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3 sm:px-10">
        <div className="flex items-center gap-2">
          <span className="inline-block h-3 w-3 rounded-full bg-wrap-pink" />
          <span className="font-mono text-sm font-medium tracking-tight">
            ATPROTO·WRAPPED
          </span>
          <span className="ml-3 hidden font-mono text-sm text-ink/60 sm:inline">
            / @{handle}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <ShareButton onShare={onShare} variant="small" />
          <Link
            to="/"
            className="rounded-full border-2 border-ink bg-cream px-4 py-1.5 font-mono text-xs tracking-widest uppercase shadow-[3px_3px_0_0_var(--color-ink)] transition hover:bg-wrap-pink"
          >
            Try another →
          </Link>
        </div>
      </div>
    </div>
  );
}
