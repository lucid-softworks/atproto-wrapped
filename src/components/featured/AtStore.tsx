import { useQuery } from "@tanstack/react-query";
import type { AtStoreHighlights } from "../../lib/highlights/atstore";
import {
  fetchRecordByUri,
  parseAtUri,
  resolveDidToPds,
} from "../../lib/highlights/_atUri";
import { Cover } from "../Cover";
import { initial } from "../../lib/format";
import { FeaturedRow } from "./_shared";
import { sectionTheme, type SectionTheme } from "./_theme";

type RemoteListing = {
  uri: string;
  name?: string;
  slug?: string;
  tagline?: string;
  description?: string;
  externalUrl?: string;
  iconUrl?: string;
};

async function fetchListings(
  uris: string[],
): Promise<Map<string, RemoteListing>> {
  const out = new Map<string, RemoteListing>();
  await Promise.all(
    uris.map(async (uri) => {
      const parsed = parseAtUri(uri);
      if (!parsed) return;
      const v = await fetchRecordByUri<Record<string, unknown>>(uri);
      if (!v) return;
      const name =
        typeof v.name === "string" && v.name.length > 0 ? v.name : undefined;
      const slug =
        typeof v.slug === "string" && v.slug.length > 0 ? v.slug : undefined;
      const tagline =
        typeof v.tagline === "string" && v.tagline.length > 0
          ? v.tagline
          : undefined;
      const description =
        typeof v.description === "string" && v.description.length > 0
          ? v.description
          : undefined;
      const externalUrl =
        typeof v.externalUrl === "string" && v.externalUrl.length > 0
          ? v.externalUrl
          : undefined;

      let iconUrl: string | undefined;
      const icon = v.icon as Record<string, unknown> | undefined;
      const iconRef = icon?.ref as Record<string, unknown> | undefined;
      const iconCid =
        typeof iconRef?.$link === "string" ? iconRef.$link : undefined;
      if (iconCid) {
        const pds = await resolveDidToPds(parsed.did);
        if (pds) {
          iconUrl = `${pds}/xrpc/com.atproto.sync.getBlob?did=${encodeURIComponent(parsed.did)}&cid=${encodeURIComponent(iconCid)}`;
        }
      }

      out.set(uri, {
        uri,
        name,
        slug,
        tagline,
        description,
        externalUrl,
        iconUrl,
      });
    }),
  );
  return out;
}

export function FeaturedAtStoreSection({
  data,
  theme,
}: {
  data: AtStoreHighlights;
  theme?: SectionTheme;
}) {
  const t = sectionTheme(theme ?? "pink");
  const stats: Array<[string, string]> = [];
  if (data.favoritesCount > 0)
    stats.push(["Favorites", data.favoritesCount.toLocaleString()]);
  if (data.reviewsCount > 0)
    stats.push(["Reviews", data.reviewsCount.toLocaleString()]);
  if (data.averageRating !== null)
    stats.push(["Avg rating", `${data.averageRating.toFixed(1)} / 5`]);

  const uris = Array.from(
    new Set([
      ...data.favorites.map((f) => f.subject).filter((u) => !!u),
      ...data.reviews.map((r) => r.subject ?? "").filter((u) => !!u),
    ]),
  );
  const listingsQuery = useQuery({
    queryKey: ["atstore-listings", uris],
    queryFn: () => fetchListings(uris),
    enabled: uris.length > 0,
    staleTime: 1000 * 60 * 60,
  });
  const listings = listingsQuery.data ?? new Map<string, RemoteListing>();

  return (
    <section
      className={`relative overflow-hidden border-b-2 border-ink ${t.bg} ${t.text}`}
    >
      <div className="grain absolute inset-0" />
      <div className="relative mx-auto max-w-7xl px-6 py-20 sm:px-10 sm:py-24">
        <div className="flex items-center justify-between">
          <div className="font-mono text-xs tracking-widest uppercase opacity-70">
            Spotlight · atstore
          </div>
        </div>

        <h2 className="mt-6 text-[clamp(2.5rem,7vw,5rem)] leading-[0.9] font-bold tracking-[-0.03em]">
          Apps you <span className="font-serif italic">fancied</span>.
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

        {data.reviews.length > 0 && (
          <div className="mt-12">
            <FeaturedRow label="Reviews you wrote" />
            <ul className="mt-4 grid gap-3 sm:grid-cols-2">
              {data.reviews.map((r, i) => {
                const listing = r.subject ? listings.get(r.subject) : null;
                const stars = Math.max(0, Math.min(5, Math.round(r.rating ?? 0)));
                return (
                  <li
                    key={i}
                    className="rounded-2xl border-2 border-ink bg-cream p-4"
                  >
                    <ListingHeader
                      listing={listing}
                      uri={r.subject}
                      loading={listingsQuery.isLoading}
                    />
                    <div className="mt-3 flex items-baseline justify-between gap-3">
                      {r.rating !== null ? (
                        <div className="font-mono text-sm font-bold tabular-nums">
                          {"★".repeat(stars)}
                          <span className="opacity-30">
                            {"★".repeat(5 - stars)}
                          </span>
                        </div>
                      ) : (
                        <div />
                      )}
                      {r.createdAt && (
                        <div className="font-mono text-[10px] opacity-55">
                          {r.createdAt.toLocaleDateString(undefined, {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </div>
                      )}
                    </div>
                    {r.text && (
                      <p className="mt-2 line-clamp-4 font-serif text-sm italic opacity-85">
                        {r.text}
                      </p>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        )}

        {data.favorites.length > 0 && (
          <div className="mt-12">
            <FeaturedRow label="Favorited apps" />
            <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {data.favorites.map((f, i) => {
                const listing = f.subject ? listings.get(f.subject) : null;
                return (
                  <li
                    key={`${f.subject}-${i}`}
                    className="rounded-2xl border-2 border-ink bg-cream p-3"
                  >
                    <ListingHeader
                      listing={listing}
                      uri={f.subject}
                      loading={listingsQuery.isLoading}
                    />
                    {f.createdAt && (
                      <div className="mt-2 font-mono text-[10px] text-ink/55">
                        favorited{" "}
                        {f.createdAt.toLocaleDateString(undefined, {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
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

function ListingHeader({
  listing,
  uri,
  loading,
}: {
  listing: RemoteListing | null | undefined;
  uri: string | undefined;
  loading: boolean;
}) {
  const name = listing?.name ?? (loading ? "Loading…" : "Unknown app");
  const href = listing?.externalUrl;
  return (
    <div className="flex items-center gap-3">
      <div className="h-10 w-10 shrink-0 overflow-hidden rounded-lg border-2 border-ink">
        <Cover
          src={listing?.iconUrl}
          alt={listing?.name ?? "app"}
          fallback={initial(listing?.name ?? "?")}
          className="h-full w-full object-cover"
        />
      </div>
      <div className="min-w-0 flex-1">
        {href ? (
          <a
            href={href}
            target="_blank"
            rel="noreferrer"
            className="line-clamp-1 font-semibold leading-tight hover:underline"
          >
            {name}
          </a>
        ) : (
          <div className="line-clamp-1 font-semibold leading-tight">
            {name}
          </div>
        )}
        {listing?.tagline && (
          <div className="line-clamp-1 text-xs opacity-70">
            {listing.tagline}
          </div>
        )}
      </div>
      {uri && !listing && !loading && (
        <span
          className="truncate font-mono text-[10px] opacity-45"
          title={uri}
        >
          {uri.split("/").pop()}
        </span>
      )}
    </div>
  );
}
