import type {
  AtRoomHighlights,
  AtRoomObject,
} from "../../lib/highlights/atroom";

const LANG_LABELS: Record<string, string> = {
  en: "EN",
  ja: "JA",
  zh: "ZH",
  ko: "KO",
  es: "ES",
  fr: "FR",
  de: "DE",
  pt: "PT",
  it: "IT",
  ru: "RU",
};

function langLabel(lang: string): string {
  return LANG_LABELS[lang] ?? lang.toUpperCase();
}

export function FeaturedAtRoomSection({
  data,
}: {
  data: AtRoomHighlights;
}) {
  const total = data.totalObjects + data.totalLayouts;

  return (
    <section className="relative overflow-hidden border-b-2 border-ink bg-wrap-mint text-ink">
      <div className="grain absolute inset-0" />
      <div className="relative mx-auto max-w-7xl px-6 py-20 sm:px-10 sm:py-24">
        <div className="flex items-center justify-between">
          <div className="font-mono text-xs tracking-widest uppercase opacity-70">
            Spotlight · AtRoom
          </div>
          <span className="rounded-full bg-ink px-3 py-1 font-mono text-xs tracking-widest text-wrap-mint uppercase">
            {total.toLocaleString()} object
            {total === 1 ? "" : "s"}
          </span>
        </div>

        <h2 className="mt-6 text-[clamp(2.5rem,7vw,5rem)] leading-[0.9] font-bold tracking-[-0.03em]">
          Your <span className="font-serif italic">3D room</span>.
        </h2>

        <div className="mt-4 font-mono text-xs tracking-widest uppercase opacity-60">
          {data.totalObjects.toLocaleString()} object
          {data.totalObjects === 1 ? "" : "s"} ·{" "}
          {data.totalLayouts.toLocaleString()} layout
          {data.totalLayouts === 1 ? "" : "s"}
        </div>

        {data.layout && (
          <div className="mt-8 flex flex-wrap items-stretch gap-3">
            {data.layout.floorColor && (
              <div className="flex items-center gap-3 rounded-2xl border-2 border-ink bg-cream px-4 py-3">
                <span
                  className="inline-block h-10 w-10 rounded border-2 border-ink"
                  style={{ backgroundColor: data.layout.floorColor }}
                />
                <div>
                  <div className="font-mono text-[10px] tracking-widest text-ink/55 uppercase">
                    Floor
                  </div>
                  <div className="font-mono text-sm font-semibold tabular-nums">
                    {data.layout.floorColor.toUpperCase()}
                  </div>
                </div>
              </div>
            )}
            {data.layout.wallColor && (
              <div className="flex items-center gap-3 rounded-2xl border-2 border-ink bg-cream px-4 py-3">
                <span
                  className="inline-block h-10 w-10 rounded border-2 border-ink"
                  style={{ backgroundColor: data.layout.wallColor }}
                />
                <div>
                  <div className="font-mono text-[10px] tracking-widest text-ink/55 uppercase">
                    Walls
                  </div>
                  <div className="font-mono text-sm font-semibold tabular-nums">
                    {data.layout.wallColor.toUpperCase()}
                  </div>
                </div>
              </div>
            )}
            {data.layout.size !== null && (
              <div className="rounded-2xl border-2 border-ink bg-cream px-4 py-3">
                <div className="font-mono text-[10px] tracking-widest text-ink/55 uppercase">
                  Room size
                </div>
                <div className="font-mono text-sm font-semibold tabular-nums">
                  {data.layout.size.toLocaleString()}
                </div>
              </div>
            )}
            {data.layout.wallHeight !== null && (
              <div className="rounded-2xl border-2 border-ink bg-cream px-4 py-3">
                <div className="font-mono text-[10px] tracking-widest text-ink/55 uppercase">
                  Wall height
                </div>
                <div className="font-mono text-sm font-semibold tabular-nums">
                  {data.layout.wallHeight.toLocaleString()}
                </div>
              </div>
            )}
            {data.layout.furnishingsCount > 0 && (
              <div className="rounded-2xl border-2 border-ink bg-cream px-4 py-3">
                <div className="font-mono text-[10px] tracking-widest text-ink/55 uppercase">
                  Placed
                </div>
                <div className="font-mono text-sm font-semibold tabular-nums">
                  {data.layout.furnishingsCount}
                </div>
              </div>
            )}
          </div>
        )}

        {data.objects.length > 0 && (
          <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {data.objects.map((o, i) => (
              <ObjectCard key={i} object={o} index={i} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function ObjectCard({
  object,
  index,
}: {
  object: AtRoomObject;
  index: number;
}) {
  // Rotate through the available alternate languages so the grid feels
  // lively instead of always showing the same translation.
  const altPick =
    object.altNames.length > 0
      ? object.altNames[index % object.altNames.length]
      : undefined;

  const kb =
    object.modelSize !== undefined
      ? `${(object.modelSize / 1024).toFixed(1)} KB`
      : undefined;
  return (
    <figure className="flex flex-col gap-2 rounded-2xl border-2 border-ink bg-cream p-4">
      <div className="flex items-baseline justify-between gap-2 font-mono text-[10px] tracking-widest text-ink/55 uppercase">
        <span>Object</span>
        {kb && <span className="opacity-65 tabular-nums">{kb}</span>}
      </div>
      <figcaption className="space-y-1">
        <div className="line-clamp-2 text-2xl font-bold leading-tight tracking-[-0.02em]">
          {object.name}
        </div>
        {altPick && (
          <div className="inline-flex items-center gap-1 rounded-full border border-ink/40 bg-ink/5 px-2 py-0.5 font-mono text-[10px]">
            <span className="font-semibold tracking-widest text-ink/55 uppercase">
              {langLabel(altPick.lang)}
            </span>
            <span className="line-clamp-1">{altPick.value}</span>
          </div>
        )}
      </figcaption>
      {object.modelUrl && (
        <a
          href={object.modelUrl}
          target="_blank"
          rel="noreferrer"
          className="mt-1 inline-flex w-fit items-center rounded-full border-2 border-ink bg-ink px-3 py-1 font-mono text-[10px] tracking-widest text-cream uppercase hover:bg-cream hover:text-ink"
        >
          ⌘ glTF ↗
        </a>
      )}
    </figure>
  );
}
