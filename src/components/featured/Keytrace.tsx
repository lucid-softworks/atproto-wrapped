import type {
  KeytraceClaim,
  KeytraceHighlights,
} from "../../lib/highlights/keytrace";
import { sectionTheme, type SectionTheme } from "./_theme";

const TYPE_LABELS: Record<string, string> = {
  orcid: "ORCID",
  tangled: "Tangled",
  github: "GitHub",
  gitlab: "GitLab",
  twitter: "Twitter / X",
  mastodon: "Mastodon",
  email: "Email",
};

function prettyType(type: string): string {
  return TYPE_LABELS[type] ?? type.replace(/[_-]+/g, " ").toUpperCase();
}

export function FeaturedKeytraceSection({
  data,
  theme,
}: {
  data: KeytraceHighlights;
  theme?: SectionTheme;
}) {
  const t = sectionTheme(theme ?? "mint");
  const types = Array.from(data.byType.entries()).sort(
    (a, b) => b[1] - a[1],
  );

  return (
    <section className={`relative overflow-hidden border-b-2 border-ink ${t.bg} ${t.text}`}>
      <div className="grain absolute inset-0" />
      <div className="relative mx-auto max-w-7xl px-6 py-20 sm:px-10 sm:py-24">
        <div className="flex items-center justify-between">
          <div className="font-mono text-xs tracking-widest uppercase opacity-70">
            Spotlight · Keytrace
          </div>
          <span className="rounded-full bg-ink px-3 py-1 font-mono text-xs tracking-widest text-wrap-mint uppercase">
            {data.verified.toLocaleString()} / {data.claims.length} verified
          </span>
        </div>

        <h2 className="mt-6 text-[clamp(2.5rem,7vw,5rem)] leading-[0.9] font-bold tracking-[-0.03em]">
          Identities you've <span className="font-serif italic">claimed</span>.
        </h2>

        {types.length > 0 && (
          <div className="mt-8 flex flex-wrap gap-2">
            {types.map(([t, n]) => (
              <span
                key={t}
                className="rounded-full border-2 border-ink bg-cream px-3 py-1 font-mono text-xs tracking-wide uppercase"
              >
                <span className="font-semibold">{prettyType(t)}</span>
                <span className="ml-2 text-ink/55 tabular-nums">{n}</span>
              </span>
            ))}
          </div>
        )}

        <ul className="mt-10 grid gap-3 sm:grid-cols-2">
          {data.claims.map((c, i) => (
            <ClaimCard key={`${c.claimUri}-${i}`} claim={c} />
          ))}
        </ul>
      </div>
    </section>
  );
}

function ClaimCard({ claim }: { claim: KeytraceClaim }) {
  const href = claim.profileUrl ?? claim.claimUri;
  return (
    <li className="rounded-2xl border-2 border-ink bg-cream p-4">
      <div className="flex items-baseline justify-between gap-3">
        <div className="font-mono text-[10px] tracking-widest uppercase opacity-55">
          {prettyType(claim.type)}
        </div>
        <span
          className={`rounded-full px-2 py-0.5 font-mono text-[10px] tracking-widest uppercase ${
            claim.status === "verified"
              ? "bg-wrap-lime text-ink"
              : "bg-wrap-pink text-ink"
          }`}
        >
          {claim.status}
        </span>
      </div>
      {claim.displayName && (
        <div className="mt-2 text-lg font-semibold leading-tight">
          {claim.displayName}
        </div>
      )}
      {claim.subject && (
        <div className="mt-1 truncate font-mono text-xs opacity-65">
          {claim.subject}
        </div>
      )}
      <div className="mt-3">
        <a
          href={href}
          target="_blank"
          rel="noreferrer"
          className="inline-block rounded-full border-2 border-ink bg-ink px-3 py-1 font-mono text-[10px] tracking-widest text-cream uppercase hover:bg-cream hover:text-ink"
        >
          Open ↗
        </a>
        {claim.lastVerifiedAt && (
          <span className="ml-3 font-mono text-[10px] opacity-55">
            verified{" "}
            {claim.lastVerifiedAt.toLocaleDateString(undefined, {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </span>
        )}
      </div>
    </li>
  );
}
