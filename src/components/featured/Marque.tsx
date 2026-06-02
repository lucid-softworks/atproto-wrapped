import type {
  MarqueDnsRecord,
  MarqueHighlights,
} from "../../lib/highlights/marque";
import { toDisplayHandle } from "../../lib/handle";
import { FeaturedRow } from "./_shared";

function formatDate(d: Date | null): string | null {
  if (!d) return null;
  return d.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function relativeFromNow(d: Date | null): string | null {
  if (!d) return null;
  const diffMs = d.getTime() - Date.now();
  const absMs = Math.abs(diffMs);
  const dayMs = 1000 * 60 * 60 * 24;
  const days = Math.round(absMs / dayMs);
  const future = diffMs >= 0;
  if (days < 31) {
    return future ? `in ${days} days` : `${days} days ago`;
  }
  const months = Math.round(days / 30);
  if (months < 24) {
    return future ? `in ${months} months` : `${months} months ago`;
  }
  const years = Math.round(months / 12);
  return future ? `in ${years} years` : `${years} years ago`;
}

function truncate(s: string, max: number): string {
  if (s.length <= max) return s;
  return s.slice(0, max - 1) + "…";
}

function groupByType(
  records: MarqueDnsRecord[],
): Array<[string, MarqueDnsRecord[]]> {
  const m = new Map<string, MarqueDnsRecord[]>();
  for (const r of records) {
    const list = m.get(r.recordType);
    if (list) list.push(r);
    else m.set(r.recordType, [r]);
  }
  // Stable order: common types first, then others alphabetical.
  const preferred = ["A", "AAAA", "CNAME", "MX", "TXT", "NS", "SRV"];
  const entries = Array.from(m.entries());
  entries.sort(([a], [b]) => {
    const ai = preferred.indexOf(a);
    const bi = preferred.indexOf(b);
    if (ai !== -1 && bi !== -1) return ai - bi;
    if (ai !== -1) return -1;
    if (bi !== -1) return 1;
    return a.localeCompare(b);
  });
  return entries;
}

export function FeaturedMarqueSection({ data }: { data: MarqueHighlights }) {
  return (
    <section className="relative overflow-hidden border-b-2 border-ink bg-wrap-cobalt text-ink">
      <div className="grain absolute inset-0" />
      <div className="relative mx-auto max-w-7xl px-6 py-20 sm:px-10 sm:py-24">
        <div className="flex items-center justify-between">
          <div className="font-mono text-xs tracking-widest uppercase opacity-70">
            Spotlight · Marque
          </div>
          <span className="rounded-full bg-ink px-3 py-1 font-mono text-xs tracking-widest text-wrap-cobalt uppercase">
            {data.totalDomains.toLocaleString()}{" "}
            {data.totalDomains === 1 ? "domain" : "domains"}
          </span>
        </div>

        <h2 className="mt-6 text-[clamp(2.5rem,7vw,5rem)] leading-[0.9] font-bold tracking-[-0.03em]">
          Your <span className="font-serif italic">domain</span> registry.
        </h2>

        <ul className="mt-10 space-y-8">
          {data.domains.map((d) => {
            const display = toDisplayHandle(d.domain);
            const showPuny = display !== d.domain;
            const chips: Array<{ label: string; tone?: "good" | "muted" }> = [];
            if (d.status)
              chips.push({
                label: d.status,
                tone: d.status === "active" ? "good" : "muted",
              });
            if (d.dnssec) chips.push({ label: "DNSSEC", tone: "good" });
            if (d.whoisPrivacy && d.whoisPrivacy !== "off")
              chips.push({ label: "WHOIS private", tone: "good" });
            if (d.atprotoVerified)
              chips.push({ label: "atproto verified", tone: "good" });
            const grouped = groupByType(d.dnsRecords);

            return (
              <li
                key={d.domain}
                className="rounded-3xl border-2 border-ink bg-cream p-6"
              >
                <div className="flex flex-wrap items-baseline justify-between gap-3">
                  <div className="min-w-0">
                    <div className="font-mono text-[10px] tracking-widest opacity-55 uppercase">
                      Domain
                    </div>
                    <div className="mt-1 truncate font-mono text-2xl font-bold sm:text-3xl">
                      {display}
                    </div>
                    {showPuny && (
                      <div className="mt-0.5 font-mono text-[10px] opacity-55">
                        {d.domain}
                      </div>
                    )}
                  </div>
                  {chips.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {chips.map((c) => (
                        <span
                          key={c.label}
                          className={
                            "rounded-full border-2 border-ink px-2.5 py-1 font-mono text-[10px] tracking-widest uppercase " +
                            (c.tone === "good"
                              ? "bg-wrap-lime"
                              : "bg-cream opacity-70")
                          }
                        >
                          {c.label}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {d.nameServers.length > 0 && (
                  <div className="mt-5">
                    <div className="font-mono text-[10px] tracking-widest opacity-55 uppercase">
                      Name servers
                    </div>
                    <ul className="mt-2 grid gap-1 font-mono text-xs sm:grid-cols-2">
                      {d.nameServers.map((ns) => (
                        <li
                          key={ns}
                          className="truncate rounded-lg border border-ink/30 bg-wrap-cobalt/15 px-2 py-1"
                        >
                          {ns}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2 font-mono text-xs">
                  {d.registeredAt && (
                    <div>
                      <span className="opacity-55">Registered </span>
                      <span className="font-bold">
                        {formatDate(d.registeredAt)}
                      </span>
                    </div>
                  )}
                  {d.expiresAt && (
                    <div>
                      <span className="opacity-55">Expires </span>
                      <span className="font-bold">
                        {formatDate(d.expiresAt)}
                      </span>
                      <span className="ml-1 opacity-55">
                        ({relativeFromNow(d.expiresAt)})
                      </span>
                    </div>
                  )}
                </div>

                {grouped.length > 0 && (
                  <div className="mt-6">
                    <FeaturedRow label="DNS records" />
                    <div className="mt-3 space-y-3">
                      {grouped.map(([type, records]) => (
                        <div key={type}>
                          <div className="mb-1 flex items-center gap-2">
                            <span className="rounded-full border-2 border-ink bg-ink px-2 py-0.5 font-mono text-[10px] tracking-widest text-cream uppercase">
                              {type}
                            </span>
                            <span className="font-mono text-[10px] opacity-55">
                              {records.length}
                              {records.length === 1 ? " record" : " records"}
                            </span>
                          </div>
                          <ul className="divide-y divide-ink/10 overflow-hidden rounded-xl border border-ink/30">
                            {records.map((r, i) => (
                              <li
                                key={`${type}-${i}`}
                                className="grid grid-cols-12 items-center gap-2 bg-cream px-3 py-2 font-mono text-xs"
                              >
                                <span className="col-span-3 truncate font-bold">
                                  {r.name}
                                </span>
                                <span
                                  className="col-span-7 truncate opacity-85"
                                  title={r.value}
                                >
                                  {truncate(r.value, 60)}
                                </span>
                                <span className="col-span-2 justify-self-end rounded-full border border-ink/30 px-1.5 py-0.5 text-[9px] tracking-widest opacity-70">
                                  ttl {r.ttl}
                                </span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
