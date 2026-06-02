import { useQuery } from "@tanstack/react-query";
import type { StandardDocsHighlights } from "../../lib/highlights/standardDocs";
import { fetchRecordByUri, parseAtUri } from "../../lib/highlights/_atUri";
import { resolveHandlesForDids } from "../../lib/bskyProfiles";
import { toDisplayHandle } from "../../lib/handle";
import { FeaturedRow } from "./_shared";

type RemoteDoc = {
  uri: string;
  did: string;
  title: string;
  description?: string;
  tags: string[];
  publishedAt: Date | null;
};

async function fetchRemoteDocs(uris: string[]): Promise<RemoteDoc[]> {
  const out: RemoteDoc[] = [];
  await Promise.all(
    uris.map(async (uri) => {
      const parsed = parseAtUri(uri);
      if (!parsed) return;
      const v = await fetchRecordByUri<Record<string, unknown>>(uri);
      if (!v) return;
      const title =
        (typeof v.title === "string" && v.title) || "Untitled";
      const description =
        typeof v.description === "string" ? v.description : undefined;
      const rawTags = Array.isArray(v.tags) ? (v.tags as unknown[]) : [];
      const tags = rawTags.filter((t): t is string => typeof t === "string");
      const publishedAt =
        typeof v.publishedAt === "string"
          ? new Date(Date.parse(v.publishedAt))
          : null;
      out.push({
        uri,
        did: parsed.did,
        title,
        description,
        tags,
        publishedAt,
      });
    }),
  );
  return out;
}

export function FeaturedStandardDocsSection({
  data,
}: {
  data: StandardDocsHighlights;
}) {
  const stats: Array<[string, number]> = [
    ["Documents", data.totalDocs],
    ["Recommends", data.totalRecommends],
    ["Unique tags", data.uniqueTags],
  ].filter(([, n]) => (n as number) > 0) as Array<[string, number]>;

  const recsQuery = useQuery({
    queryKey: ["standard-recommends", data.recommendedUris],
    queryFn: () => fetchRemoteDocs(data.recommendedUris),
    enabled: data.recommendedUris.length > 0,
    staleTime: 1000 * 60 * 60,
  });
  const recs = recsQuery.data ?? [];

  const authorDids = Array.from(new Set(recs.map((r) => r.did)));
  const authorsQuery = useQuery({
    queryKey: ["standard-rec-authors", authorDids],
    queryFn: () => resolveHandlesForDids(authorDids),
    enabled: authorDids.length > 0,
    staleTime: 1000 * 60 * 60,
  });
  const authorHandles = authorsQuery.data ?? new Map<string, string>();

  return (
    <section className="relative overflow-hidden border-b-2 border-ink bg-ink text-cream">
      <div className="relative mx-auto max-w-7xl px-6 py-20 sm:px-10 sm:py-24">
        <div className="flex items-center justify-between">
          <div className="font-mono text-xs tracking-widest text-cream/65 uppercase">
            Spotlight · Standard
          </div>
        </div>

        <h2 className="mt-6 text-[clamp(2.5rem,7vw,5rem)] leading-[0.9] font-bold tracking-[-0.03em]">
          Long-form on the{" "}
          <span className="font-serif italic">Standard</span>.
        </h2>

        {stats.length > 0 && (
          <div className="mt-8 flex flex-wrap gap-3">
            {stats.map(([k, n]) => (
              <div
                key={k}
                className="rounded-2xl border-2 border-cream bg-ink px-4 py-2"
              >
                <div className="font-mono text-[10px] tracking-widest text-cream/65 uppercase">
                  {k}
                </div>
                <div className="text-xl font-bold tabular-nums">
                  {n.toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        )}

        {data.docs.length > 0 && (
          <div className="mt-12">
            <FeaturedRow label="Documents you wrote" />
            <ul className="mt-4 grid gap-3 sm:grid-cols-2">
              {data.docs.map((d, i) => (
                <li
                  key={`${d.title}-${i}`}
                  className="rounded-2xl border-2 border-cream bg-ink p-4"
                >
                  <div className="font-semibold leading-tight">{d.title}</div>
                  {d.tags.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {d.tags.map((t) => (
                        <span
                          key={t}
                          className="rounded-full border border-cream/40 px-2 py-0.5 font-mono text-[10px] tracking-widest text-cream/70 uppercase"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
                  {d.description && (
                    <p className="mt-2 line-clamp-3 text-sm text-cream/95">
                      {d.description}
                    </p>
                  )}
                  {(d.publishedAt ?? d.createdAt) && (
                    <div className="mt-2 font-mono text-[10px] text-cream/45">
                      {(d.publishedAt ?? d.createdAt)?.toLocaleDateString(
                        undefined,
                        {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        },
                      )}
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}

        {data.recommendedUris.length > 0 && (
          <div className="mt-12">
            <FeaturedRow
              label={`Documents you recommended · ${data.recommendedUris.length}`}
            />
            {recsQuery.isLoading && recs.length === 0 ? (
              <div className="mt-4 font-mono text-xs text-cream/55">
                Loading…
              </div>
            ) : null}
            {recs.length > 0 && (
              <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                {recs.map((d, i) => (
                  <li
                    key={`${d.uri}-${i}`}
                    className="rounded-2xl border-2 border-cream bg-ink p-4"
                  >
                    <a
                      href={`https://pdsls.dev/${d.uri}`}
                      target="_blank"
                      rel="noreferrer"
                      className="font-semibold leading-tight hover:underline"
                    >
                      {d.title}
                    </a>
                    {d.tags.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {d.tags.map((t) => (
                          <span
                            key={t}
                            className="rounded-full border border-cream/40 px-2 py-0.5 font-mono text-[10px] tracking-widest text-cream/70 uppercase"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    )}
                    {d.description && (
                      <p className="mt-2 line-clamp-3 text-sm text-cream/95">
                        {d.description}
                      </p>
                    )}
                    <div className="mt-2 flex items-center justify-between font-mono text-[10px] text-cream/55">
                      {(() => {
                        const h = authorHandles.get(d.did);
                        return h ? (
                          <a
                            href={`https://bsky.app/profile/${h}`}
                            target="_blank"
                            rel="noreferrer"
                            className="truncate hover:underline"
                          >
                            by @{toDisplayHandle(h)}
                          </a>
                        ) : (
                          <span className="truncate">by {d.did}</span>
                        );
                      })()}
                      {d.publishedAt && (
                        <span>
                          {d.publishedAt.toLocaleDateString(undefined, {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </span>
                      )}
                    </div>
                    <div className="mt-2">
                      <a
                        href={`https://pdsls.dev/${d.uri}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-block rounded-full border-2 border-cream bg-cream px-3 py-1 font-mono text-[10px] tracking-widest text-ink uppercase hover:bg-ink hover:text-cream"
                      >
                        Read ↗
                      </a>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
