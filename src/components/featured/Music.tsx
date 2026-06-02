import type { MusicHighlights } from "../../lib/featured";
import { Cover } from "../Cover";
import { initial } from "../../lib/format";
import { FeaturedRow } from "./_shared";

export function FeaturedMusicSection({ data }: { data: MusicHighlights }) {
  const sourceParts: string[] = [];
  if (data.rockskyCount > 0)
    sourceParts.push(`${data.rockskyCount.toLocaleString()} from Rocksky`);
  if (data.tealfmCount > 0)
    sourceParts.push(`${data.tealfmCount.toLocaleString()} from TealFM`);
  if (data.dedupedDuplicates > 0)
    sourceParts.push(
      `${data.dedupedDuplicates.toLocaleString()} duplicate${
        data.dedupedDuplicates === 1 ? "" : "s"
      } merged`,
    );
  const sourceCopy = sourceParts.join("  ·  ");

  return (
    <section className="relative overflow-hidden border-b-2 border-ink bg-wrap-orange text-ink">
      <div className="grain absolute inset-0" />
      <div className="relative mx-auto max-w-7xl px-6 py-20 sm:px-10 sm:py-24">
        <div className="flex items-center justify-between">
          <div className="font-mono text-xs tracking-widest uppercase opacity-70">
            Spotlight · Music
          </div>
          <span className="rounded-full bg-ink px-3 py-1 font-mono text-xs tracking-widest text-wrap-orange uppercase">
            {data.totalPlays.toLocaleString()} plays
          </span>
        </div>

        <h2 className="mt-6 text-[clamp(2.5rem,7vw,5rem)] leading-[0.9] font-bold tracking-[-0.03em]">
          Your <span className="font-serif italic">music</span> year.
        </h2>

        {sourceCopy && (
          <p className="mt-3 font-mono text-sm tracking-wide opacity-65">
            {sourceCopy}
          </p>
        )}

        {data.topArtists.length > 0 && (
          <div className="mt-12">
            <FeaturedRow label="Top artists" />
            <div className="mt-4 grid grid-cols-3 gap-4 sm:grid-cols-6">
              {data.topArtists.map((a, i) => (
                <ArtistChip key={a.name} artist={a} rank={i + 1} />
              ))}
            </div>
          </div>
        )}

        {data.topAlbums.length > 0 && (
          <div className="mt-12">
            <FeaturedRow label="Top albums" />
            <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
              {data.topAlbums.map((a, i) => (
                <AlbumTile
                  key={`${a.title}__${a.artist}`}
                  album={a}
                  rank={i + 1}
                />
              ))}
            </div>
          </div>
        )}

        {data.topSongs.length > 0 && (
          <div className="mt-12">
            <FeaturedRow label="Top tracks" />
            <ul className="mt-4 grid gap-2 sm:grid-cols-2">
              {data.topSongs.map((s, i) => (
                <SongRow
                  key={`${s.title}__${s.artist}`}
                  song={s}
                  rank={i + 1}
                />
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
}

function ArtistChip({
  artist,
  rank,
}: {
  artist: { name: string; pictureUrl?: string; plays: number };
  rank: number;
}) {
  return (
    <div className="flex flex-col items-center text-center">
      <div className="relative h-24 w-24 sm:h-32 sm:w-32">
        <Cover
          src={artist.pictureUrl}
          alt={artist.name}
          fallback={initial(artist.name)}
          className="absolute inset-0 h-full w-full rounded-full border-2 border-ink object-cover"
        />
        <span className="absolute -top-1 -right-1 rounded-full bg-ink px-2 py-0.5 font-mono text-[10px] tracking-widest text-cream">
          #{rank}
        </span>
      </div>
      <div className="mt-3 line-clamp-2 font-semibold leading-tight">
        {artist.name}
      </div>
      <div className="font-mono text-[10px] opacity-70">
        {artist.plays.toLocaleString()} play{artist.plays === 1 ? "" : "s"}
      </div>
    </div>
  );
}

function AlbumTile({
  album,
  rank,
}: {
  album: { title: string; artist: string; artUrl?: string; plays: number };
  rank: number;
}) {
  return (
    <div className="flex flex-col">
      <div className="relative aspect-square overflow-hidden rounded-xl border-2 border-ink">
        <Cover
          src={album.artUrl}
          alt={album.title}
          fallback={initial(album.title)}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <span className="absolute top-2 left-2 rounded-full bg-ink px-2 py-0.5 font-mono text-[10px] tracking-widest text-cream">
          #{rank}
        </span>
        <span className="absolute right-2 bottom-2 rounded-full bg-cream/95 px-2 py-0.5 font-mono text-[10px] font-semibold tabular-nums text-ink">
          {album.plays.toLocaleString()}
        </span>
      </div>
      <div className="mt-2 line-clamp-1 font-semibold">{album.title}</div>
      <div className="line-clamp-1 text-sm opacity-70">{album.artist}</div>
    </div>
  );
}

function SongRow({
  song,
  rank,
}: {
  song: {
    title: string;
    artist: string;
    artUrl?: string;
    plays: number;
    spotifyLink?: string;
  };
  rank: number;
}) {
  const content = (
    <div className="flex items-center gap-3 rounded-xl border-2 border-ink bg-cream p-2 transition group-hover:bg-wrap-yellow">
      <Cover
        src={song.artUrl}
        alt={song.title}
        fallback={initial(song.title)}
        className="h-14 w-14 shrink-0 rounded-md border border-ink/30 object-cover"
      />
      <div className="min-w-0 flex-1">
        <div className="truncate font-semibold">{song.title}</div>
        <div className="truncate text-sm opacity-70">{song.artist}</div>
      </div>
      <div className="text-right">
        <div className="font-mono text-[10px] opacity-50">#{rank}</div>
        <div className="font-mono text-sm font-bold tabular-nums">
          {song.plays}
        </div>
      </div>
    </div>
  );
  if (song.spotifyLink) {
    return (
      <li>
        <a
          href={song.spotifyLink}
          target="_blank"
          rel="noreferrer"
          className="group block"
        >
          {content}
        </a>
      </li>
    );
  }
  return <li>{content}</li>;
}
