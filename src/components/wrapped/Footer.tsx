import type { RepoStats } from "../../lib/atproto";
import { toDisplayHandle } from "../../lib/handle";

export function FooterStrip({ stats }: { stats: RepoStats }) {
  const monthsActive = stats.firstRecordAt
    ? Math.max(
        1,
        Math.round(
          (Date.now() - stats.firstRecordAt.getTime()) /
            (1000 * 60 * 60 * 24 * 30),
        ),
      )
    : null;

  const rows: Array<[string, string]> = [
    ["DID", stats.did],
    ["PDS", stats.pds],
    ["Handle", `@${toDisplayHandle(stats.handle)}`],
    ["Repo size", `${(stats.carBytes / (1024 * 1024)).toFixed(2)} MB`],
    [
      "First record",
      stats.firstRecordAt
        ? stats.firstRecordAt.toLocaleDateString(undefined, {
            year: "numeric",
            month: "short",
            day: "numeric",
          })
        : "—",
    ],
    [
      "Latest record",
      stats.latestRecordAt
        ? stats.latestRecordAt.toLocaleDateString(undefined, {
            year: "numeric",
            month: "short",
            day: "numeric",
          })
        : "—",
    ],
    ["Active for", monthsActive ? `~${monthsActive} months` : "—"],
  ];

  return (
    <section className="bg-cream">
      <div className="mx-auto max-w-7xl px-6 py-16 sm:px-10 sm:py-20">
        <div className="font-mono text-xs tracking-widest text-ink/50 uppercase">
          The receipts
        </div>
        <div className="mt-6 grid gap-x-10 gap-y-4 sm:grid-cols-2 lg:grid-cols-3">
          {rows.map(([k, v]) => (
            <div key={k}>
              <div className="font-mono text-[10px] tracking-widest text-ink/40 uppercase">
                {k}
              </div>
              <div className="mt-1 font-mono text-sm break-all">{v}</div>
            </div>
          ))}
        </div>
        <div className="mt-12 border-t-2 border-ink pt-6 font-mono text-xs text-ink/50">
          Built on the open ATmosphere · Your data, your PDS · No tracking, no
          storage
        </div>
      </div>
    </section>
  );
}
