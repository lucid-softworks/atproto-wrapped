import { useEffect, useState, type FormEvent } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { createIsomorphicFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { Landing } from "../components/Landing";

const getOrigin = createIsomorphicFn()
  .server(() => {
    try {
      return new URL(getRequest().url).origin;
    } catch {
      return "";
    }
  })
  .client(() => window.location.origin);

export const Route = createFileRoute("/")({
  component: Home,
  head: () => {
    const title = "ATproto Wrapped — your year on the ATmosphere";
    const description =
      "Drop a Bluesky handle and we'll pull the entire repo from your PDS and turn every lexicon — posts, likes, scrobbles, the long-tail stuff — into a magazine-style spread.";
    const origin = getOrigin();
    const ogImage = `${origin}/og`;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:image", content: ogImage },
        { property: "og:image:width", content: "1200" },
        { property: "og:image:height", content: "630" },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: title },
        { name: "twitter:description", content: description },
        { name: "twitter:image", content: ogImage },
      ],
    };
  },
});

function Home() {
  const navigate = useNavigate();
  const [handle, setHandle] = useState("");

  // Warm the home OG cache so the CF Cache entry is hot before anyone
  // shares the bare site URL.
  useEffect(() => {
    if (typeof window === "undefined") return;
    fetch("/og", { method: "GET" }).catch(() => {});
  }, []);

  function submit(e: FormEvent) {
    e.preventDefault();
    const cleaned = handle.replace(/^@/, "").trim();
    if (!cleaned) return;
    navigate({ to: "/@{$handle}", params: { handle: cleaned } });
  }

  return (
    <Landing
      handle={handle}
      setHandle={setHandle}
      onSubmit={submit}
      onPickExample={(h) =>
        navigate({ to: "/@{$handle}", params: { handle: h } })
      }
      state={{ kind: "idle" }}
    />
  );
}
