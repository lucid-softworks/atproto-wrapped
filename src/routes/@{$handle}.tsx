import { useEffect, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { createIsomorphicFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { useQuery } from "@tanstack/react-query";
import {
  fetchRepoStats,
  type FetchProgress,
  type RepoStats,
} from "../lib/atproto";
import { toDisplayHandle } from "../lib/handle";
import { Landing } from "../components/Landing";
import { Wrapped } from "../components/Wrapped";

// OG crawlers (Twitter, Facebook, etc.) require absolute URLs in og:image.
// Compute the page origin server-side from the request; on the client we
// can fall back to window.location.origin for client-side navigations.
const getOrigin = createIsomorphicFn()
  .server(() => {
    try {
      return new URL(getRequest().url).origin;
    } catch {
      return "";
    }
  })
  .client(() => window.location.origin);

export const Route = createFileRoute("/@{$handle}")({
  component: HandlePage,
  head: ({ params }) => {
    const handle = params.handle;
    const display = toDisplayHandle(handle);
    const title = `@${display}'s ATproto Wrapped`;
    const description = `A year of everything @${display} made across the ATmosphere — posts, likes, scrobbles, photos, the long-tail stuff.`;
    const origin = getOrigin();
    const ogImage = `${origin}/og/${encodeURIComponent(handle)}`;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:image", content: ogImage },
        { property: "og:image:width", content: "1200" },
        { property: "og:image:height", content: "630" },
        { property: "og:type", content: "profile" },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: title },
        { name: "twitter:description", content: description },
        { name: "twitter:image", content: ogImage },
      ],
    };
  },
});

function HandlePage() {
  const { handle } = Route.useParams();
  const navigate = useNavigate();
  const [progress, setProgress] = useState<FetchProgress | null>(null);

  const query = useQuery<RepoStats>({
    queryKey: ["repo", handle],
    queryFn: async () => {
      setProgress({ phase: "resolving", message: "Resolving handle…" });
      try {
        return await fetchRepoStats(handle, (p) => setProgress(p));
      } finally {
        setProgress(null);
      }
    },
  });

  useEffect(() => {
    if (query.data) window.scrollTo({ top: 0, behavior: "instant" });
  }, [query.data]);

  // Cache-warm the per-handle OG image as soon as someone visits their wrap
  // so the CF Cache entry is already hot if they share the link. Fire and
  // forget — the worker generates + stores the PNG and we don't need the
  // response here.
  useEffect(() => {
    if (typeof window === "undefined" || !handle) return;
    fetch(`/og/${encodeURIComponent(handle)}`, { method: "GET" }).catch(
      () => {},
    );
  }, [handle]);

  if (query.data) {
    return <Wrapped stats={query.data} />;
  }

  return (
    <Landing
      handle={handle}
      setHandle={() => {}}
      onSubmit={(e) => e.preventDefault()}
      onPickExample={(h) =>
        navigate({ to: "/@{$handle}", params: { handle: h } })
      }
      state={
        query.error
          ? {
              kind: "error",
              message:
                query.error instanceof Error
                  ? query.error.message
                  : String(query.error),
            }
          : {
              kind: "loading",
              progress: progress ?? {
                phase: "resolving",
                message: "Resolving handle…",
              },
            }
      }
    />
  );
}
