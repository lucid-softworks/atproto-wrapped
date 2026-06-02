import { useEffect, useState, type FormEvent } from "react";
import { Link } from "@tanstack/react-router";
import type { FetchProgress, RepoStats } from "../lib/atproto";

export type LoadState =
  | { kind: "idle" }
  | { kind: "loading"; progress: FetchProgress }
  | { kind: "error"; message: string }
  | { kind: "ready"; stats: RepoStats };

export const EXAMPLE_HANDLES = ["imlunahey.com", "bsky.app", "pfrazee.com"];

const ROTATING_WORDS = [
  "posts",
  "likes",
  "scrobbles",
  "follows",
  "blog posts",
  "drawings",
  "reposts",
  "lexicons",
];

export function Landing({
  handle,
  setHandle,
  onSubmit,
  onPickExample,
  state,
}: {
  handle: string;
  setHandle: (h: string) => void;
  onSubmit: (e: FormEvent) => void;
  onPickExample: (h: string) => void;
  state: Exclude<LoadState, { kind: "ready" }>;
}) {
  const [wordIdx, setWordIdx] = useState(0);
  useEffect(() => {
    const id = window.setInterval(
      () => setWordIdx((x) => (x + 1) % ROTATING_WORDS.length),
      1600,
    );
    return () => window.clearInterval(id);
  }, []);

  const loading = state.kind === "loading";

  return (
    <div className="relative min-h-svh overflow-hidden bg-cream text-ink">
      <FloatingTiles />
      <div className="grain absolute inset-0" />

      <div className="relative mx-auto flex min-h-svh max-w-7xl flex-col px-6 pt-8 sm:px-10">
        <Header />

        <main className="flex flex-1 flex-col justify-center py-12 sm:py-16">
          <div className="flex items-baseline gap-4 font-mono text-xs tracking-widest text-ink/60 uppercase">
            <span className="inline-block h-px w-8 bg-ink/60" />
            Issue 01 · The ATmosphere edition
          </div>

          <h1 className="mt-6 font-sans leading-[0.88] tracking-[-0.045em] text-ink">
            <span className="block font-serif text-[clamp(2rem,5vw,3.5rem)] italic">
              A year of
            </span>
            <span className="mt-1 block text-[clamp(3.5rem,12vw,10rem)] font-extrabold">
              EVERYTHING
            </span>
            <span className="mt-1 block text-[clamp(3.5rem,12vw,10rem)] font-extrabold">
              YOU MADE
            </span>
            <span className="mt-2 flex flex-wrap items-baseline gap-x-4 gap-y-2 text-[clamp(2rem,7vw,5.5rem)] font-bold">
              <span className="text-ink/60">in</span>
              <span
                key={wordIdx}
                className="fade-up relative inline-block bg-ink px-3 py-1 text-cream sm:px-5 sm:py-2"
              >
                {ROTATING_WORDS[wordIdx]}
              </span>
              <span className="font-serif italic">wrapped.</span>
            </span>
          </h1>

          <p className="mt-8 max-w-2xl text-lg text-ink/70 sm:text-xl">
            Drop a Bluesky handle and we'll pull the entire repo straight from
            your PDS, then turn every lexicon — posts, likes, scrobbles, oekaki,
            blog entries, the weird long-tail stuff — into a story.
          </p>

          <form
            onSubmit={onSubmit}
            className="mt-10 flex max-w-2xl flex-col gap-3 sm:flex-row"
          >
            <label className="flex flex-1 items-center rounded-full border-2 border-ink bg-cream px-5 py-3 shadow-[4px_4px_0_0_var(--color-ink)] focus-within:bg-white">
              <span className="mr-2 font-mono text-ink/40">@</span>
              <input
                value={handle}
                onChange={(e) => setHandle(e.target.value)}
                placeholder="imlunahey.com"
                disabled={loading}
                spellCheck={false}
                autoCapitalize="off"
                autoCorrect="off"
                className="w-full bg-transparent text-lg text-ink placeholder-ink/30 outline-none disabled:opacity-50"
              />
            </label>
            <button
              type="submit"
              disabled={loading}
              className="rounded-full bg-ink px-8 py-3 text-lg font-semibold text-cream shadow-[4px_4px_0_0_var(--color-wrap-pink)] transition hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[3px_3px_0_0_var(--color-wrap-pink)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0_0_var(--color-wrap-pink)] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Wrapping…" : "Wrap it →"}
            </button>
          </form>

          {!loading && (
            <div className="mt-5 flex flex-wrap items-center gap-2 text-sm">
              <span className="mr-1 font-mono text-xs tracking-widest text-ink/45 uppercase">
                Try →
              </span>
              {EXAMPLE_HANDLES.map((h) => (
                <button
                  key={h}
                  type="button"
                  onClick={() => onPickExample(h)}
                  className="rounded-full border-2 border-ink bg-cream px-3 py-1 font-mono text-xs hover:bg-wrap-lime"
                >
                  @{h}
                </button>
              ))}
            </div>
          )}

          {state.kind === "loading" && (
            <LoadingIndicator progress={state.progress} />
          )}

          {state.kind === "error" && (
            <div className="mt-8 max-w-2xl rounded-2xl border-2 border-wrap-red bg-wrap-red/10 px-6 py-4 text-ink">
              <div className="font-semibold text-wrap-red">
                Couldn't wrap that.
              </div>
              <div className="mt-1 text-sm text-ink/70">{state.message}</div>
            </div>
          )}

          <p className="mt-14 max-w-md font-mono text-[11px] tracking-wide text-ink/45">
            Everything happens in your browser. We fetch your repo's CAR file
            straight from your PDS, parse it locally, and forget it the moment
            you close the tab.
          </p>
        </main>

        <Marquee />
      </div>
    </div>
  );
}

function FloatingTiles() {
  const tiles: Array<{
    label: string;
    word: string;
    bg: string;
    fg: string;
    pos: string;
    rotate: string;
  }> = [
    {
      label: "BLUESKY",
      word: "26,230",
      bg: "bg-wrap-cobalt",
      fg: "text-cream",
      pos: "top-[14%] right-[6%] sm:right-[8%]",
      rotate: "rotate-[6deg]",
    },
    {
      label: "ROCKSKY",
      word: "386",
      bg: "bg-wrap-orange",
      fg: "text-ink",
      pos: "top-[58%] right-[4%] sm:right-[14%]",
      rotate: "-rotate-[5deg]",
    },
    {
      label: "TEALFM",
      word: "319",
      bg: "bg-wrap-mint",
      fg: "text-ink",
      pos: "top-[36%] right-[22%]",
      rotate: "rotate-[2deg]",
    },
  ];
  return (
    <div className="pointer-events-none absolute inset-0 hidden lg:block">
      {tiles.map((t, i) => (
        <div
          key={i}
          className={`blob absolute ${t.pos} ${t.rotate} w-44 rounded-2xl border-2 border-ink ${t.bg} ${t.fg} p-4 shadow-[6px_6px_0_0_var(--color-ink)]`}
          style={{ animationDelay: `${-i * 3}s` }}
        >
          <div className="font-mono text-[10px] tracking-widest uppercase opacity-70">
            {t.label}
          </div>
          <div className="mt-1 text-4xl font-bold tabular-nums">{t.word}</div>
          <div className="mt-1 font-serif text-sm italic opacity-80">
            {i === 0 ? "posts" : i === 1 ? "scrobbles" : "plays"}
          </div>
        </div>
      ))}
    </div>
  );
}

function Header() {
  return (
    <header className="flex items-center justify-between">
      <Link
        to="/"
        className="flex items-center gap-2 rounded-full px-1 -mx-1 hover:bg-ink/5"
      >
        <span className="inline-block h-3 w-3 rounded-full bg-wrap-pink" />
        <span className="font-mono text-sm font-medium tracking-tight text-ink">
          ATPROTO·WRAPPED
        </span>
      </Link>
      <a
        href="https://atproto.com"
        target="_blank"
        rel="noreferrer"
        className="hidden font-mono text-xs text-ink/60 underline-offset-4 hover:underline sm:inline"
      >
        what's atproto?
      </a>
    </header>
  );
}

function Marquee() {
  const services = [
    "bluesky",
    "rocksky",
    "tealfm",
    "whitewind",
    "pinksea",
    "frontpage",
    "tangled",
    "smoke signal",
    "linkat",
    "streamplace",
    "popfeed",
    "pinksky",
  ];
  const doubled = [...services, ...services];
  return (
    <div className="-mx-6 mt-12 overflow-hidden border-y-2 border-ink bg-ink py-3 sm:-mx-10">
      <div className="marquee-track flex w-max gap-12 font-mono text-sm tracking-widest text-cream uppercase">
        {doubled.map((s, i) => (
          <span key={i} className="flex items-center gap-12">
            <span className="text-wrap-lime">★</span>
            {s}
          </span>
        ))}
      </div>
    </div>
  );
}

function LoadingIndicator({ progress }: { progress: FetchProgress }) {
  let percent: number | null = null;
  let bytes = "";
  let label = "Working…";

  switch (progress.phase) {
    case "cache":
      label = "Loading from cache…";
      percent = 100;
      break;
    case "resolving":
      label = "Resolving your handle…";
      break;
    case "discovering":
      label = "Finding your PDS…";
      break;
    case "downloading": {
      label = "Downloading your repo…";
      const recvMb = (progress.received / (1024 * 1024)).toFixed(1);
      if (progress.total) {
        const totalMb = (progress.total / (1024 * 1024)).toFixed(1);
        percent = Math.min(
          100,
          Math.round((progress.received / progress.total) * 100),
        );
        bytes = `${recvMb} / ${totalMb} MB`;
      } else {
        bytes = `${recvMb} MB`;
      }
      break;
    }
    case "parsing":
      label = "Decoding every lexicon…";
      percent = 100;
      break;
  }

  return (
    <div className="mt-8 max-w-2xl">
      <div className="flex items-center justify-between font-mono text-xs tracking-widest text-ink/70 uppercase">
        <span>{label}</span>
        <span>
          {percent !== null ? `${percent}%` : ""}
          {bytes ? ` · ${bytes}` : ""}
        </span>
      </div>
      <div className="mt-3 h-2 overflow-hidden rounded-full border-2 border-ink bg-cream-dark">
        <div
          className="h-full bg-ink transition-[width] duration-300 ease-out"
          style={{
            width: `${percent ?? 4}%`,
            transition: percent === null ? "none" : undefined,
          }}
        />
      </div>
    </div>
  );
}
