import { THEME_STYLES, type CollectionDescriptor } from "../../lib/labels";

export function BentoSection({
  items,
}: {
  items: Array<{
    nsid: string;
    count: number;
    descriptor: CollectionDescriptor;
  }>;
}) {
  return (
    <section className="relative border-b-2 border-ink bg-cream">
      <div className="grain absolute inset-0" />
      <div className="relative mx-auto max-w-7xl px-6 py-16 sm:px-10 sm:py-24">
        <div className="flex items-end justify-between">
          <h2 className="text-[clamp(2rem,5vw,3.5rem)] leading-[0.95] font-bold tracking-[-0.03em]">
            And in the
            <br />
            <span className="font-serif italic">supporting cast…</span>
          </h2>
          <div className="hidden font-mono text-xs tracking-widest text-ink/50 uppercase sm:block">
            Mid-shelf hits
          </div>
        </div>

        <div className="mt-10 grid auto-rows-fr grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {items.map((b, i) => (
            <BentoCard
              key={b.nsid}
              nsid={b.nsid}
              count={b.count}
              descriptor={b.descriptor}
              span={
                i === 0 ? "col-span-2 row-span-2" : i === 3 ? "row-span-2" : ""
              }
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function BentoCard({
  nsid,
  count,
  descriptor,
  span,
}: {
  nsid: string;
  count: number;
  descriptor: CollectionDescriptor;
  span: string;
}) {
  const t = THEME_STYLES[descriptor.theme];
  return (
    <div
      className={`relative flex flex-col justify-between overflow-hidden rounded-2xl border-2 border-ink p-5 ${t.bg} ${t.fg} ${span}`}
    >
      <div
        className={`font-mono text-[10px] tracking-widest uppercase ${t.muted}`}
      >
        {descriptor.service}
      </div>
      <div>
        <div className="text-[clamp(2.25rem,5vw,4.5rem)] leading-[0.9] font-bold tabular-nums">
          {count.toLocaleString()}
        </div>
        <div className="mt-1 font-serif text-lg italic sm:text-xl">
          {descriptor.word}
        </div>
        <div className={`mt-3 truncate font-mono text-[10px] ${t.muted}`}>
          {nsid}
        </div>
      </div>
    </div>
  );
}
