import type { RepoStats } from "../../lib/atproto";
import { toDisplayHandle } from "../../lib/handle";
import { ShareButton } from "./ShareButton";

export function IntroSlide({
  stats,
  topServices,
  onShare,
  year,
}: {
  stats: RepoStats;
  topServices: Array<[string, number]>;
  onShare: () => Promise<"shared" | "copied" | "failed">;
  year: number | "all";
}) {
  const carMb = (stats.carBytes / (1024 * 1024)).toFixed(1);
  const scopeSuffix = year === "all" ? " since you joined" : ` in ${year}`;
  const span = year === "all" ? "life" : "year";
  return (
    <section className="relative overflow-hidden border-b-2 border-ink bg-cream">
      <div className="grain absolute inset-0" />
      <div className="relative mx-auto max-w-7xl px-6 py-20 sm:px-10 sm:py-28">
        <div className="font-mono text-xs tracking-widest text-ink/60 uppercase">
          A wrapped for
        </div>
        <h1 className="fade-up mt-3 text-[clamp(2.25rem,9vw,7rem)] leading-[0.95] font-bold tracking-[-0.04em] text-ink break-words [overflow-wrap:anywhere]">
          @{toDisplayHandle(stats.handle)}
        </h1>
        <p
          className="fade-up mt-8 max-w-3xl font-serif text-2xl text-ink/80 italic sm:text-4xl"
          style={{ animationDelay: "0.15s" }}
        >
          You wrote{" "}
          <span className="bg-wrap-lime px-2 py-0.5 text-ink not-italic">
            {stats.totalRecords.toLocaleString()}
          </span>{" "}
          records across{" "}
          <span className="bg-wrap-pink px-2 py-0.5 text-ink not-italic">
            {stats.byCollection.size}
          </span>{" "}
          lexicons{scopeSuffix}.
          <span className="mt-3 block">
            That's a {carMb} MB {span} on the open web.
          </span>
        </p>

        {topServices.length > 0 && (
          <div
            className="fade-up mt-10 flex flex-wrap gap-2"
            style={{ animationDelay: "0.3s" }}
          >
            {topServices.slice(0, 10).map(([service, count]) => (
              <span
                key={service}
                className="rounded-full border-2 border-ink bg-cream px-4 py-1.5 font-mono text-xs tracking-wider uppercase"
              >
                <span className="font-semibold">{service}</span>
                <span className="ml-2 text-ink/60">
                  {count.toLocaleString()}
                </span>
              </span>
            ))}
          </div>
        )}

        <div
          className="fade-up mt-10 flex flex-wrap items-center gap-4"
          style={{ animationDelay: "0.45s" }}
        >
          <ShareButton onShare={onShare} variant="big" />
          <span className="font-mono text-xs tracking-wide text-ink/55">
            Sharing copies the link · cards unfurl with your poster.
          </span>
        </div>
      </div>
    </section>
  );
}
