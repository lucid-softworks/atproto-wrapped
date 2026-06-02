import { useQuery } from "@tanstack/react-query";
import type { FrontpageHighlights } from "../../lib/featured";
import { fetchRecordByUri, parseAtUri } from "../../lib/highlights/_atUri";
import { sectionTheme, type SectionTheme } from "./_theme";

type RemotePost = {
  title?: string;
  url?: string;
};

function frontpagePostUrl(uri: string): string | null {
  const parsed = parseAtUri(uri);
  if (!parsed) return null;
  return `https://frontpage.fyi/post/${parsed.did}/${parsed.rkey}`;
}

async function fetchPosts(uris: string[]): Promise<Map<string, RemotePost>> {
  const out = new Map<string, RemotePost>();
  await Promise.all(
    uris.map(async (uri) => {
      const v = await fetchRecordByUri<Record<string, unknown>>(uri);
      if (!v) return;
      out.set(uri, {
        title: typeof v.title === "string" ? v.title : undefined,
        url: typeof v.url === "string" ? v.url : undefined,
      });
    }),
  );
  return out;
}

export function FeaturedFrontpageSection({
  data,
  theme,
}: {
  data: FrontpageHighlights;
  theme?: SectionTheme;
}) {
  const t = sectionTheme(theme ?? "orange");
  const stats: Array<[string, number]> = [
    ["Submissions", data.posts],
    ["Comments", data.comments],
    ["Votes", data.votes],
  ].filter(([, n]) => (n as number) > 0) as Array<[string, number]>;

  const referencedUris = Array.from(
    new Set(
      [
        ...data.recentVotes.map((v) => v.subjectUri),
        ...data.recentComments.map((c) => c.postUri),
      ].filter((u): u is string => !!u),
    ),
  );

  const postsQuery = useQuery({
    queryKey: ["frontpage-posts", referencedUris],
    queryFn: () => fetchPosts(referencedUris),
    enabled: referencedUris.length > 0,
    staleTime: 1000 * 60 * 60,
  });
  const posts = postsQuery.data ?? new Map<string, RemotePost>();

  return (
    <section
      className={`relative overflow-hidden border-b-2 border-ink ${t.bg} ${t.text}`}
    >
      <div className="grain absolute inset-0" />
      <div className="relative mx-auto max-w-7xl px-5 py-16 sm:px-10 sm:py-24">
        <div className="flex items-center justify-between">
          <div className="font-mono text-xs tracking-widest uppercase opacity-70">
            Spotlight · Frontpage
          </div>
        </div>

        <h2 className="mt-6 text-[clamp(2.25rem,7vw,5rem)] leading-[0.95] font-bold tracking-[-0.03em] break-words">
          On <span className="font-serif italic">Frontpage</span>.
        </h2>

        {stats.length > 0 && (
          <div className="mt-8 flex flex-wrap gap-3">
            {stats.map(([k, n]) => (
              <div
                key={k}
                className="rounded-2xl border-2 border-ink bg-cream px-4 py-2"
              >
                <div className="font-mono text-[10px] tracking-widest text-ink/55 uppercase">
                  {k}
                </div>
                <div className="text-xl font-bold tabular-nums">
                  {n.toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        )}

        {data.recent.length > 0 && (
          <div className="mt-10">
            <div className="font-mono text-xs tracking-widest uppercase opacity-65">
              Your submissions
            </div>
            <ul className="mt-4 grid gap-2">
              {data.recent.map((p, i) => (
                <li
                  key={`${p.title}-${i}`}
                  className="flex items-baseline justify-between gap-3 rounded-xl border-2 border-ink bg-cream p-3"
                >
                  <div className="min-w-0 flex-1">
                    <div className="truncate font-semibold">
                      {p.title ?? p.url ?? "Submission"}
                    </div>
                    {p.url && (
                      <div className="truncate font-mono text-[11px] text-ink/55">
                        {p.url}
                      </div>
                    )}
                  </div>
                  {p.url && (
                    <a
                      href={p.url}
                      target="_blank"
                      rel="noreferrer"
                      className="shrink-0 rounded-full border border-ink bg-ink px-3 py-1 font-mono text-[10px] tracking-widest text-cream uppercase"
                    >
                      Open ↗
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}

        {data.recentVotes.length > 0 && (
          <div className="mt-10">
            <div className="font-mono text-xs tracking-widest uppercase opacity-65">
              You upvoted
            </div>
            <ul className="mt-4 grid gap-2 sm:grid-cols-2">
              {data.recentVotes.map((v, i) => {
                const remote = v.subjectUri ? posts.get(v.subjectUri) : null;
                const fpUrl = v.subjectUri
                  ? frontpagePostUrl(v.subjectUri)
                  : null;
                const title =
                  remote?.title ??
                  remote?.url ??
                  (postsQuery.isLoading ? "Loading…" : "Submission");
                return (
                  <li
                    key={`${v.subjectUri}-${i}`}
                    className="flex items-baseline justify-between gap-3 overflow-hidden rounded-xl border-2 border-ink bg-cream p-3"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="line-clamp-2 font-semibold leading-tight [overflow-wrap:anywhere]">
                        {title}
                      </div>
                      {remote?.url && (
                        <div className="truncate font-mono text-[11px] text-ink/55">
                          {remote.url}
                        </div>
                      )}
                      {v.createdAt && (
                        <div className="mt-1 font-mono text-[10px] text-ink/45">
                          {v.createdAt.toLocaleDateString(undefined, {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </div>
                      )}
                    </div>
                    {fpUrl && (
                      <a
                        href={fpUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="shrink-0 rounded-full border border-ink bg-ink px-3 py-1 font-mono text-[10px] tracking-widest text-cream uppercase"
                      >
                        Open ↗
                      </a>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        )}

        {data.recentComments.length > 0 && (
          <div className="mt-10">
            <div className="font-mono text-xs tracking-widest uppercase opacity-65">
              Your comments
            </div>
            <ul className="mt-4 grid gap-3">
              {data.recentComments.map((c, i) => {
                const remote = c.postUri ? posts.get(c.postUri) : null;
                const fpUrl = c.postUri ? frontpagePostUrl(c.postUri) : null;
                return (
                  <li
                    key={`${c.postUri}-${i}`}
                    className="rounded-xl border-2 border-ink bg-cream p-3"
                  >
                    {c.content && (
                      <p className="line-clamp-3 text-sm">{c.content}</p>
                    )}
                    {remote && (
                      <div className="mt-2 flex items-baseline justify-between gap-3 border-t border-ink/15 pt-2">
                        <div className="min-w-0 flex-1 truncate font-mono text-[11px] text-ink/55">
                          on{" "}
                          <span className="font-semibold text-ink/85">
                            {remote.title ?? remote.url ?? "submission"}
                          </span>
                        </div>
                        {fpUrl && (
                          <a
                            href={fpUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="shrink-0 rounded-full border border-ink bg-ink px-2 py-0.5 font-mono text-[10px] tracking-widest text-cream uppercase"
                          >
                            Open ↗
                          </a>
                        )}
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
