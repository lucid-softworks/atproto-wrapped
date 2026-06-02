import { useState } from "react";
import type { CollectionDescriptor } from "../../lib/labels";

export function TailSection({
  items,
}: {
  items: Array<{
    nsid: string;
    count: number;
    descriptor: CollectionDescriptor;
  }>;
}) {
  const [open, setOpen] = useState(false);
  return (
    <section className="border-b-2 border-ink bg-ink text-cream">
      <div className="mx-auto max-w-7xl px-6 py-16 sm:px-10 sm:py-20">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <h2 className="text-[clamp(2rem,5vw,3.5rem)] leading-[0.95] font-bold tracking-[-0.03em]">
            Plus{" "}
            <span className="bg-wrap-yellow px-2 py-0.5 text-ink">
              {items.length}
            </span>{" "}
            more
            <br />
            <span className="font-serif text-cream/80 italic">
              long-tail lexicons.
            </span>
          </h2>
          <button
            onClick={() => setOpen((x) => !x)}
            className="self-start rounded-full border-2 border-cream bg-ink px-4 py-2 font-mono text-xs tracking-widest uppercase hover:bg-cream hover:text-ink"
          >
            {open ? "Hide list" : "Show list"}
          </button>
        </div>
        {open && (
          <ul className="fade-up mt-8 grid gap-x-6 gap-y-1 font-mono text-xs sm:grid-cols-2 lg:grid-cols-3">
            {items.map((b) => (
              <li
                key={b.nsid}
                className="flex items-baseline justify-between gap-3 border-b border-cream/15 py-1.5"
              >
                <span className="truncate text-cream/80">{b.nsid}</span>
                <span className="shrink-0 tabular-nums text-cream">
                  {b.count.toLocaleString()}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
