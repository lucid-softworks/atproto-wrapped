import { useQuery } from "@tanstack/react-query";
import type { StandardDocsHighlights } from "../../lib/highlights/standardDocs";
import { fetchRecordByUri, parseAtUri } from "../../lib/highlights/_atUri";
import { resolveHandlesForDids } from "../../lib/bskyProfiles";
import { toDisplayHandle } from "../../lib/handle";
import { FeaturedRow } from "./_shared";
import { sectionTheme, type SectionTheme } from "./_theme";

type RemoteDoc = {
  uri: string;
  did: string;
  rkey: string;
  title: string;
  description?: string;
  tags: string[];
  publishedAt: Date | null;
  /** at:// URI of the parent publication record */
  siteUri?: string;
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
      const siteUri = typeof v.site === "string" ? v.site : undefined;
      out.push({
        uri,
        did: parsed.did,
        rkey: parsed.rkey,
        title,
        description,
        tags,
        publishedAt,
        siteUri,
      });
    }),
  );
  return out;
}

async function fetchPublicationUrls(
  uris: string[],
): Promise<Map<string, string>> {
  const out = new Map<string, string>();
  await Promise.all(
    uris.map(async (uri) => {
      const v = await fetchRecordByUri<Record<string, unknown>>(uri);
      if (!v) return;
      if (typeof v.url === "string" && v.url.length > 0) {
        out.set(uri, v.url.replace(/\/$/, ""));
      }
    }),
  );
  return out;
}

export function FeaturedStandardDocsSection({
  data,
  theme,
}: {
  data: StandardDocsHighlights;
  theme?: SectionTheme;
}) {
  const t = sectionTheme(theme ?? "cyan");
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

  const pubUris = Array.from(
    new Set(recs.map((r) => r.siteUri).filter((u): u is string => !!u)),
  );
  const pubUrlsQuery = useQuery({
    queryKey: ["standard-rec-pubs", pubUris],
    queryFn: () => fetchPublicationUrls(pubUris),
    enabled: pubUris.length > 0,
    staleTime: 1000 * 60 * 60,
  });
  const pubUrls = pubUrlsQuery.data ?? new Map<string, string>();

  function recUrl(d: RemoteDoc): string {
    const base = d.siteUri ? pubUrls.get(d.siteUri) : undefined;
    if (base) return `${base}/${d.rkey}`;
    return `https://pdsls.dev/${d.uri}`;
  }

  return (
    <section className={`relative overflow-hidden border-b-2 border-ink ${t.bg} ${t.text}`}>
      <div className="relative mx-auto max-w-7xl px-6 py-20 sm:px-10 sm:py-24">
        <div className="flex items-center justify-between">
          <div className="font-mono text-xs tracking-widest text-ink/65 uppercase">
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
                className="rounded-2xl border-2 border-ink bg-cream px-4 py-2"
              >
                <div className="font-mono text-[10px] tracking-widest text-ink/65 uppercase">
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
                  className="rounded-2xl border-2 border-ink bg-cream p-4"
                >
                  {d.url ? (
                    <a
                      href={d.url}
                      target="_blank"
                      rel="noreferrer"
                      className="font-semibold leading-tight hover:underline"
                    >
                      {d.title}
                    </a>
                  ) : (
                    <div className="font-semibold leading-tight">
                      {d.title}
                    </div>
                  )}
                  {d.tags.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {d.tags.map((t) => (
                        <span
                          key={t}
                          className="rounded-full border border-ink/40 px-2 py-0.5 font-mono text-[10px] tracking-widest text-ink/70 uppercase"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
                  {d.description && (
                    <p className="mt-2 line-clamp-3 text-sm text-ink/95">
                      {d.description}
                    </p>
                  )}
                  <div className="mt-2 flex items-center justify-between font-mono text-[10px] text-ink/55">
                    {(d.publishedAt ?? d.createdAt) && (
                      <span>
                        {(d.publishedAt ?? d.createdAt)?.toLocaleDateString(
                          undefined,
                          {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          },
                        )}
                      </span>
                    )}
                    {d.url && (
                      <a
                        href={d.url}
                        target="_blank"
                        rel="noreferrer"
                        className="rounded-full border border-ink/60 px-2 py-0.5 tracking-widest uppercase hover:bg-cream hover:text-ink"
                      >
                        Read ↗
                      </a>
                    )}
                  </div>
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
              <div className="mt-4 font-mono text-xs text-ink/55">
                Loading…
              </div>
            ) : null}
            {recs.length > 0 && (
              <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                {recs.map((d, i) => {
                  const url = recUrl(d);
                  const author = authorHandles.get(d.did);
                  return (
                    <li
                      key={`${d.uri}-${i}`}
                      className="rounded-2xl border-2 border-ink bg-cream p-4"
                    >
                      <a
                        href={url}
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
                              className="rounded-full border border-ink/40 px-2 py-0.5 font-mono text-[10px] tracking-widest text-ink/70 uppercase"
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      )}
                      {d.description && (
                        <p className="mt-2 line-clamp-3 text-sm text-ink/95">
                          {d.description}
                        </p>
                      )}
                      <div className="mt-2 flex items-center justify-between font-mono text-[10px] text-ink/55">
                        {author ? (
                          <a
                            href={`https://bsky.app/profile/${author}`}
                            target="_blank"
                            rel="noreferrer"
                            className="truncate hover:underline"
                          >
                            by @{toDisplayHandle(author)}
                          </a>
                        ) : (
                          <span className="truncate">by {d.did}</span>
                        )}
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
                          href={url}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-block rounded-full border-2 border-cream bg-cream px-3 py-1 font-mono text-[10px] tracking-widest text-ink uppercase hover:bg-ink hover:text-cream"
                        >
                          Read ↗
                        </a>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
