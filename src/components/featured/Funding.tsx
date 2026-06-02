import type {
  FundingChannel,
  FundingHighlights,
  FundingPlan,
} from "../../lib/highlights/funding";
import { FeaturedRow } from "./_shared";
import { sectionTheme, type SectionTheme } from "./_theme";

function formatAmount(
  cents: number | null,
  currency: string | null,
): string | null {
  if (cents === null) return null;
  const value = cents / 100;
  const code = currency ?? "USD";
  try {
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency: code,
    }).format(value);
  } catch {
    return `${value.toFixed(2)} ${code}`;
  }
}

function formatFrequency(frequency: string | null): string {
  if (!frequency) return "";
  switch (frequency.toLowerCase()) {
    case "one-time":
    case "onetime":
    case "once":
      return "one-time";
    case "monthly":
      return "/mo";
    case "yearly":
    case "annually":
    case "annual":
      return "/yr";
    case "weekly":
      return "/wk";
    case "daily":
      return "/day";
    case "quarterly":
      return "/qtr";
    case "biweekly":
    case "bi-weekly":
      return "/2wk";
    default:
      return ` · ${frequency}`;
  }
}

function isHttpUrl(s: string | null): s is string {
  return !!s && (s.startsWith("https://") || s.startsWith("http://"));
}

function PlanCard({ plan }: { plan: FundingPlan }) {
  const amount = formatAmount(plan.amountCents, plan.currency);
  const freqSuffix = formatFrequency(plan.frequency);
  const isOneTime =
    plan.frequency?.toLowerCase() === "one-time" ||
    plan.frequency?.toLowerCase() === "onetime" ||
    plan.frequency?.toLowerCase() === "once";

  return (
    <li className="rounded-2xl border-2 border-ink bg-cream p-4">
      <div className="flex items-baseline justify-between gap-3">
        <div className="min-w-0">
          <div className="line-clamp-2 font-semibold leading-tight">
            {plan.name}
          </div>
          {plan.frequency && (
            <div className="mt-1 font-mono text-[10px] tracking-widest text-ink/55 uppercase">
              {plan.frequency}
            </div>
          )}
        </div>
        {amount && (
          <span className="shrink-0 rounded-full bg-ink px-2 py-0.5 font-mono text-[11px] tracking-wide text-wrap-yellow tabular-nums">
            {amount}
            {!isOneTime && freqSuffix}
          </span>
        )}
      </div>
      {plan.channels.length > 0 && (
        <ul className="mt-3 space-y-1">
          {plan.channels.map((c) => (
            <li
              key={c.uri}
              className="flex items-center justify-between gap-3 rounded-lg border border-ink/20 bg-wrap-yellow/30 px-2 py-1"
            >
              <div className="min-w-0 flex-1 truncate font-mono text-[10px] text-ink/70">
                {c.channelUri ?? c.uri}
              </div>
              {isHttpUrl(c.channelUri) && (
                <a
                  href={c.channelUri}
                  target="_blank"
                  rel="noreferrer"
                  className="shrink-0 rounded-full border border-ink bg-ink px-2 py-0.5 font-mono text-[9px] tracking-widest text-cream uppercase"
                >
                  Open ↗
                </a>
              )}
            </li>
          ))}
        </ul>
      )}
      {plan.channels.length === 0 && plan.channelRefs.length > 0 && (
        <div className="mt-3 font-mono text-[10px] text-ink/45">
          {plan.channelRefs.length}{" "}
          {plan.channelRefs.length === 1 ? "channel" : "channels"} (unresolved)
        </div>
      )}
    </li>
  );
}

function ChannelCard({ channel }: { channel: FundingChannel }) {
  return (
    <li className="flex items-center justify-between gap-3 rounded-xl border-2 border-ink bg-cream p-3">
      <div className="min-w-0 flex-1">
        {channel.channelType && (
          <span className="inline-block rounded-full bg-ink px-2 py-0.5 font-mono text-[9px] tracking-widest text-wrap-yellow uppercase">
            {channel.channelType}
          </span>
        )}
        <div className="mt-1 truncate font-mono text-[11px] text-ink/70">
          {channel.channelUri ?? channel.uri}
        </div>
      </div>
      {isHttpUrl(channel.channelUri) && (
        <a
          href={channel.channelUri}
          target="_blank"
          rel="noreferrer"
          className="shrink-0 rounded-full border border-ink bg-ink px-3 py-1 font-mono text-[10px] tracking-widest text-cream uppercase"
        >
          Open ↗
        </a>
      )}
    </li>
  );
}

export function FeaturedFundingSection({
  data,
  theme,
}: {
  data: FundingHighlights;
  theme?: SectionTheme;
}) {
  const t = sectionTheme(theme ?? "yellow");
  const stats: Array<[string, string]> = [];
  if (data.totalPlans > 0)
    stats.push(["Plans", data.totalPlans.toLocaleString()]);
  if (data.totalChannels > 0)
    stats.push(["Channels", data.totalChannels.toLocaleString()]);
  const annualLabel = formatAmount(data.annualizedCents, data.primaryCurrency);
  if (data.annualizedCents > 0 && annualLabel)
    stats.push(["Annualized", `${annualLabel}/yr`]);

  return (
    <section
      className={`relative overflow-hidden border-b-2 border-ink ${t.bg} ${t.text}`}
    >
      <div className="grain absolute inset-0" />
      <div className="relative mx-auto max-w-7xl px-6 py-20 sm:px-10 sm:py-24">
        <div className="flex items-center justify-between">
          <div className="font-mono text-xs tracking-widest uppercase opacity-70">
            Spotlight · Funding
          </div>
          <span className="rounded-full bg-ink px-3 py-1 font-mono text-xs tracking-widest text-wrap-yellow uppercase">
            {data.totalPlans.toLocaleString()}{" "}
            {data.totalPlans === 1 ? "plan" : "plans"}
          </span>
        </div>

        <h2 className="mt-6 text-[clamp(2.5rem,7vw,5rem)] leading-[0.9] font-bold tracking-[-0.03em]">
          Your <span className="font-serif italic">funding</span> stack.
        </h2>

        {stats.length > 0 && (
          <div className="mt-8 flex flex-wrap gap-3">
            {stats.map(([k, v]) => (
              <div
                key={k}
                className="rounded-2xl border-2 border-ink bg-cream px-4 py-2"
              >
                <div className="font-mono text-[10px] tracking-widest text-ink/55 uppercase">
                  {k}
                </div>
                <div className="text-xl font-bold tabular-nums">{v}</div>
              </div>
            ))}
          </div>
        )}

        {data.plans.length > 0 && (
          <div className="mt-12">
            <FeaturedRow label="Plans" />
            <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {data.plans.map((p) => (
                <PlanCard key={p.uri} plan={p} />
              ))}
            </ul>
          </div>
        )}

        {data.orphanChannels.length > 0 && (
          <div className="mt-12">
            <FeaturedRow label="Other channels" />
            <ul className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {data.orphanChannels.map((c) => (
                <ChannelCard key={c.uri} channel={c} />
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
}
