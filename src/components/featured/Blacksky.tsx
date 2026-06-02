import { useQuery } from "@tanstack/react-query";
import type { BlackskyHighlights } from "../../lib/highlights/blacksky";
import { fetchRecordByUri, parseAtUri } from "../../lib/highlights/_atUri";
import { resolveHandlesForDids } from "../../lib/bskyProfiles";
import { toDisplayHandle } from "../../lib/handle";
import { sectionTheme, type SectionTheme } from "./_theme";

type RemoteStatement = {
  text: string;
  did: string;
};

function strOrNull(v: unknown): string | null {
  return typeof v === "string" && v.length > 0 ? v : null;
}

async function fetchStatements(
  uris: string[],
): Promise<Map<string, RemoteStatement>> {
  const out = new Map<string, RemoteStatement>();
  await Promise.all(
    uris.map(async (uri) => {
      const parsed = parseAtUri(uri);
      if (!parsed) return;
      const v = await fetchRecordByUri<Record<string, unknown>>(uri);
      if (!v) return;
      // Statements may surface their body under any of these field names —
      // try them in priority order.
      const text =
        strOrNull(v.statement) ??
        strOrNull(v.body) ??
        strOrNull(v.text) ??
        strOrNull(v.title) ??
        "";
      out.set(uri, { text, did: parsed.did });
    }),
  );
  return out;
}

function formatDate(d: Date): string {
  return d.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function FeaturedBlackskySection({
  data,
  theme,
}: {
  data: BlackskyHighlights;
  theme?: SectionTheme;
}) {
  const t = sectionTheme(theme ?? "cobalt");
  const subjectUris = Array.from(
    new Set(data.recentVotes.map((v) => v.subjectUri).filter(Boolean)),
  );

  const statementsQuery = useQuery({
    queryKey: ["blacksky-vote-statements", subjectUris],
    queryFn: () => fetchStatements(subjectUris),
    enabled: subjectUris.length > 0,
    staleTime: 1000 * 60 * 60,
  });
  const statements = statementsQuery.data ?? new Map<string, RemoteStatement>();

  const authorDids = Array.from(
    new Set(Array.from(statements.values()).map((s) => s.did)),
  );
  const authorsQuery = useQuery({
    queryKey: ["blacksky-statement-authors", authorDids],
    queryFn: () => resolveHandlesForDids(authorDids),
    enabled: authorDids.length > 0,
    staleTime: 1000 * 60 * 60,
  });
  const handles = authorsQuery.data ?? new Map<string, string>();

  return (
    <section
      className={`relative overflow-hidden border-b-2 border-ink ${t.bg} ${t.text}`}
    >
      <div className="grain absolute inset-0 opacity-[0.04]" />
      <div className="relative mx-auto max-w-7xl px-6 py-20 sm:px-10 sm:py-24">
        <div className="flex items-center justify-between gap-3">
          <div className="font-mono text-xs tracking-widest text-cream/70 uppercase">
            Spotlight · Blacksky Assembly
          </div>
          <span className="rounded-full bg-cream px-3 py-1 font-mono text-xs tracking-widest text-wrap-cobalt uppercase">
            {data.totalVotes.toLocaleString()}{" "}
            {data.totalVotes === 1 ? "vote" : "votes"}
          </span>
        </div>

        <h2 className="mt-6 text-[clamp(2.5rem,7vw,5rem)] leading-[0.9] font-bold tracking-[-0.03em]">
          Votes you've cast on the{" "}
          <span className="font-serif italic">assembly</span>.
        </h2>

        <div className="mt-8 flex flex-wrap gap-3">
          <div className="rounded-2xl border-2 border-cream bg-wrap-cobalt px-4 py-2">
            <div className="font-mono text-[10px] tracking-widest text-cream/70 uppercase">
              Total votes
            </div>
            <div className="text-xl font-bold tabular-nums">
              {data.totalVotes.toLocaleString()}
            </div>
          </div>
          {data.yea > 0 && (
            <div className="rounded-2xl border-2 border-cream bg-wrap-cobalt px-4 py-2">
              <div className="font-mono text-[10px] tracking-widest text-cream/70 uppercase">
                Yea
              </div>
              <div className="text-xl font-bold tabular-nums text-wrap-lime">
                {data.yea.toLocaleString()}
              </div>
            </div>
          )}
          {data.nay > 0 && (
            <div className="rounded-2xl border-2 border-cream bg-wrap-cobalt px-4 py-2">
              <div className="font-mono text-[10px] tracking-widest text-cream/70 uppercase">
                Nay
              </div>
              <div className="text-xl font-bold tabular-nums text-wrap-pink">
                {data.nay.toLocaleString()}
              </div>
            </div>
          )}
        </div>

        {data.recentVotes.length > 0 && (
          <div className="mt-12">
            <div className="font-mono text-xs tracking-widest text-cream/65 uppercase">
              Recent votes
            </div>
            <ul className="mt-4 grid gap-3 sm:grid-cols-2">
              {data.recentVotes.map((vote, i) => {
                const statement = statements.get(vote.subjectUri);
                const handle = statement
                  ? handles.get(statement.did)
                  : undefined;
                const author = handle
                  ? `@${toDisplayHandle(handle)}`
                  : statement?.did;
                const isYea = vote.value > 0;
                const isNay = vote.value < 0;
                return (
                  <li
                    key={`${vote.subjectUri}-${i}`}
                    className="flex flex-col gap-2 rounded-xl border-2 border-cream bg-wrap-cobalt p-4"
                  >
                    <div className="flex items-baseline justify-between gap-2">
                      <span
                        className={
                          "shrink-0 rounded-full px-2 py-0.5 font-mono text-[10px] font-bold tracking-widest uppercase " +
                          (isYea
                            ? "bg-wrap-lime text-ink"
                            : isNay
                              ? "bg-wrap-pink text-ink"
                              : "bg-cream text-wrap-cobalt")
                        }
                      >
                        {isYea
                          ? `Yea +${vote.value}`
                          : isNay
                            ? `Nay ${vote.value}`
                            : `Vote ${vote.value}`}
                      </span>
                      {author && (
                        <span className="truncate font-mono text-[11px] text-cream/70">
                          {author}
                        </span>
                      )}
                    </div>
                    <p className="line-clamp-4 text-sm leading-snug text-cream/95">
                      {statement?.text ||
                        (statementsQuery.isLoading
                          ? "Loading…"
                          : "Statement unavailable")}
                    </p>
                    {vote.createdAt && (
                      <div className="font-mono text-[10px] tracking-wide text-cream/55">
                        voted {formatDate(vote.createdAt)}
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
}
