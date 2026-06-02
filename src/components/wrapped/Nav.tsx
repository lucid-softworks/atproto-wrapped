import { Link } from "@tanstack/react-router";
import { toDisplayHandle } from "../../lib/handle";
import { ShareButton } from "./ShareButton";
import { YearDropdown } from "./YearDropdown";

export function StickyNav({
  handle,
  onShare,
  years,
  year,
  onYearChange,
}: {
  handle: string;
  onShare: () => Promise<"shared" | "copied" | "failed">;
  years: number[];
  year: number | "all";
  onYearChange: (y: number | "all") => void;
}) {
  return (
    <div className="sticky top-0 z-20 border-b-2 border-ink bg-cream/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-2 px-6 py-3 sm:px-10">
        <div className="flex min-w-0 items-center gap-2">
          <Link
            to="/"
            className="flex items-center gap-2 rounded-full px-1 -mx-1 hover:bg-ink/5"
          >
            <span className="inline-block h-3 w-3 rounded-full bg-wrap-pink" />
            <span className="font-mono text-sm font-medium tracking-tight">
              ATPROTO·WRAPPED
            </span>
          </Link>
          <span className="ml-3 hidden truncate font-mono text-sm text-ink/60 sm:inline">
            / @{toDisplayHandle(handle)}
          </span>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          {years.length > 0 && (
            <YearDropdown
              years={years}
              year={year}
              onChange={onYearChange}
            />
          )}
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
