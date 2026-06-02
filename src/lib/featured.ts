import type { RepoRecord, RepoStats } from "./atproto";

/**
 * NSID prefixes that are entirely owned by a featured spotlight. Anything under
 * one of these prefixes is suppressed from the supporting-cast bento and the
 * long-tail list. We use prefixes (not just exact NSIDs) so that sub-records a
 * service adds later — `social.grain.gallery.item`, `app.rocksky.scrobble.v2`,
 * etc. — get filtered automatically.
 */
export const FEATURED_NSID_PREFIXES: string[] = [
  // bluesky (all app.bsky.* + chat.bsky.* go into the Bluesky spotlight)
  "app.bsky.",
  "chat.bsky.",
  // music
  "app.rocksky.",
  "fm.teal.",
  "fm.plyr.",
  // popfeed
  "social.popfeed.",
  // grain
  "social.grain.",
  // tangled
  "sh.tangled.",
  // streamplace
  "place.stream.",
  // rpg
  "actor.rpg.",
  "equipment.rpg.",
  // anisota
  "net.anisota.",
  // games
  "blue.2048.",
  "games.firehose.",
  "farm.smol.games.",
  "tools.atp.",
  "com.imlunahey.leaderboard.",
  // flashes
  "blue.flashes.",
  // reading
  "com.whtwnd.",
  "buzz.bookhive.",
  "pub.leaflet.",
  "at.margin.",
  "at.monomarks.",
  "my.skylights.",
  // flushing
  "im.flushing.",
  // frontpage
  "fyi.unravel.frontpage.",
  // drydown
  "social.drydown.",
  // status (is.dame.* + statusphere + istat + bsky actor status)
  "is.dame.",
  "xyz.statusphere.",
  "vg.nat.istat.",
  "social.kibun.",
  "io.zzstoatzz.status.",
  // atsumeat
  "com.suibari.atsumeat.",
  // psky chat
  "social.psky.",
  // blue place
  "blue.place.",
  // atbuddy
  "app.atbuddy.",
  // youandme
  "at.youandme.",
  // smoke signal
  "events.smokesignal.",
  // sifa identity/resume
  "id.sifa.",
  // hypha spores
  "coop.hypha.spores.",
  // — second-wave services (highlights/*) —
  // social graph
  "com.atprotofans.high-five.",
  "dev.atvouch.",
  "xyz.atpoke.",
  // narrative
  "tech.tokimeki.takibi.",
  "stream.thought.",
  "fyi.asq.",
  "com.skybemoreblue.",
  // visual
  "boo.sky.",
  "blue.badge.",
  "blue.registry.",
  "uk.madebydanny.",
  "dev.flo-bit.",
  "app.sonasky.",
  "org.simocracy.",
  // lists / productivity / groups
  "app.attodo.",
  "dev.skyboard.",
  "network.cosmik.",
  "dev.jakestout.atguilds.",
  "lol.linkring.",
  "net.asadaame5121.at-circle.",
  "net.rankthat.",
  // long-form / specials
  "app.sidetrail.",
  "blue.skytalk.",
  "tech.tokimeki.poll.",
  "site.standard.",
  "place.wisp.",
  "com.vibe-coded.",
  "fyi.atstore.",
  // — third-wave —
  // beverages (Arabica coffee + Oolong tea, combined into Brews)
  "social.arabica.",
  "social.oolong.",
  // calendar / events
  "community.lexicon.calendar.",
  // package registry likes
  "dev.npmx.",
  // domain registry + DNS
  "at.marque.",
  // location
  "city.atlas.",
  // pollen social
  "place.pollen.",
  // atmos email attestation
  "email.atmos.",
  // community lexicon AI prefs (calendar prefix above already covers calendar)
  "community.lexicon.preference.",
  // protoimsg chat / community
  "app.protoimsg.",
  // keytrace identity claims (orcid, tangled, etc.)
  "dev.keytrace.",
  // fund.at — endorsements + funding plans/channels (fund.at.actor.*
  // declarations are still filtered out via SKIP_NSID_PREFIXES below)
  "fund.at.",
  // blacksky community assembly
  "community.blacksky.",
  // nrempel fledglings (creature care)
  "com.nrempel.fledglings.",
  // atroom 3D virtual rooms
  "blue.atroom.",
  // blento bento card boards
  "app.blento.",
  // tech.waow slide decks
  "tech.waow.slides.",
];

/**
 * NSIDs that aren't user activity worth celebrating — protocol metadata,
 * declarations, key packages, raw schema records, etc. These are filtered
 * out of the supporting-cast bento and long-tail list entirely.
 */
export const SKIP_NSID_PREFIXES: string[] = [
  // MLS crypto declarations / key packages live under this prefix; they
  // are infrastructure, not activity.
  "com.germnetwork.",
  // Lexicon definitions stored as records
  "com.atproto.lexicon.",
  // Atmosphere test fixtures
  "social.atmo.test.",
  // Funding "declaration" — just announces that the actor is fundable
  "fund.at.actor.",
  // Generic service waitlists / declarations
  "network.slices.waitlist.",
  "org.signal.declaration",
];

/**
 * Suffixes (the final NSID segment) that indicate the record is metadata
 * about an account on a service, not activity on that service.
 */
const SKIP_SUFFIXES = new Set([
  "profile",
  "declaration",
  "preferences",
  "settings",
  "config",
]);

export function isSkippedNsid(nsid: string): boolean {
  for (const p of SKIP_NSID_PREFIXES) {
    if (nsid.startsWith(p)) return true;
  }
  const last = nsid.split(".").pop() ?? "";
  return SKIP_SUFFIXES.has(last);
}

/**
 * Exact NSIDs we want to claim that don't share a prefix with a service we own.
 */
export const FEATURED_NSIDS_EXACT = new Set<string>([
  // Both of these are covered by the app.bsky. prefix above, but kept here
  // for documentation purposes.
]);

export function isFeaturedNsid(nsid: string): boolean {
  if (FEATURED_NSIDS_EXACT.has(nsid)) return true;
  for (const p of FEATURED_NSID_PREFIXES) {
    if (nsid.startsWith(p)) return true;
  }
  return false;
}

/**
 * @deprecated Use isFeaturedNsid() — kept for legacy reference but no longer
 * authoritative. Always check via the prefix-aware helper.
 */
export const FEATURED_NSIDS = new Set<string>([
  // music
  "app.rocksky.scrobble",
  "app.rocksky.song",
  "app.rocksky.album",
  "app.rocksky.artist",
  "app.rocksky.actor.status",
  "fm.teal.alpha.feed.play",
  "fm.teal.alpha.actor.status",
  "fm.plyr.actor.profile",
  // popfeed
  "social.popfeed.feed.review",
  "social.popfeed.feed.listItem",
  "social.popfeed.feed.list",
  "social.popfeed.actor.profile",
  // grain
  "social.grain.photo",
  "social.grain.favorite",
  "social.grain.gallery",
  "social.grain.story",
  "social.grain.comment",
  "social.grain.graph.follow",
  "social.grain.actor.profile",
  // tangled
  "sh.tangled.repo",
  "sh.tangled.feed.star",
  "sh.tangled.actor.profile",
  "sh.tangled.feed.reaction",
  "sh.tangled.repo.issue",
  "sh.tangled.graph.follow",
  "sh.tangled.publicKey",
  // streamplace
  "place.stream.livestream",
  "place.stream.chat.message",
  "place.stream.chat.profile",
  "place.stream.chat.gate",
  "place.stream.key",
  "place.stream.profile",
  "place.stream.server.settings",
  // rpg
  "actor.rpg.stats",
  "actor.rpg.generator",
  "actor.rpg.sprite",
  "equipment.rpg.item",
  // anisota (combined chronicle + game + feed)
  "net.anisota.chronicle.collection",
  "net.anisota.chronicle.inventory",
  "net.anisota.chronicle.expedition",
  "net.anisota.chronicle.expedition.camp",
  "net.anisota.chronicle.achievement",
  "net.anisota.chronicle.level",
  "net.anisota.chronicle.progress",
  "net.anisota.chronicle.log.daily",
  "net.anisota.chronicle.log.weekly",
  "net.anisota.chronicle.log.monthly",
  "net.anisota.chronicle.log.yearly",
  "net.anisota.beta.game.session",
  "net.anisota.beta.game.log",
  "net.anisota.beta.game.inventory",
  "net.anisota.beta.game.achievement",
  "net.anisota.harvest.minigame",
  "net.anisota.feed.post",
  "net.anisota.feed.listItem",
  "net.anisota.feed.like",
  "net.anisota.feed.list",
  "net.anisota.feed.repost",
  "net.anisota.graph.mute",
  "net.anisota.observatory.element",
  "net.anisota.observatory.layout",
  "net.anisota.player.state",
  "net.anisota.settings",
  "net.anisota.spell.book",
  "net.anisota.spell.custom",
  // games (cross-app)
  "blue.2048.game",
  "blue.2048.player.profile",
  "blue.2048.player.stats",
  "games.firehose.tictactoe",
  "games.firehose.profile",
  "farm.smol.games.skyrdle.score",
  "farm.smol.games.eggsweeper.score",
  "tools.atp.typing.test",
  "tools.atp.borgle.play",
  "com.imlunahey.leaderboard.score",
  "com.imlunahey.leaderboard.marker",
  "app.mathr.score",
  "blue.checkmate.game",
  "blue.checkmate.challenge",
  "blue.atplay.score",
  // flashes
  "blue.flashes.feed.post",
  "blue.flashes.actor.portfolio",
  "blue.flashes.actor.profile",
  // reading
  "com.whtwnd.blog.entry",
  "buzz.bookhive.book",
  "pub.leaflet.document",
  "pub.leaflet.publication",
  "pub.leaflet.comment",
  "pub.leaflet.poll.vote",
  "at.margin.bookmark",
  "at.margin.annotation",
  "at.monomarks.bookmark",
  "my.skylights.rel",
  // flushing
  "im.flushing.right.now",
  // frontpage
  "fyi.unravel.frontpage.post",
  "fyi.unravel.frontpage.comment",
  "fyi.unravel.frontpage.vote",
  // drydown
  "social.drydown.house",
  "social.drydown.fragrance",
  "social.drydown.review",
]);

/* ---------------- Bluesky (everything app.bsky.* + chat.bsky.*) ---------------- */

export type BlueskyHero = {
  label: string;
  count: number;
  theme: "pink" | "lime" | "yellow" | "mint" | "cyan" | "violet" | "orange";
};

export type BlueskyHighlights = {
  total: number;
  posts: number;
  likes: number;
  follows: number;
  reposts: number;
  // Big numbers we'll feature as the 4 hero blocks. Mostly the four above
  // but we re-export them as a labeled list to keep the renderer flexible.
  hero: BlueskyHero[];
  // Secondary counts (zero values are filtered out before render).
  moderation: Array<[string, number]>;
  curation: Array<[string, number]>;
  curiosity: Array<[string, number]>;
  profileBits: Array<[string, string]>;
  // Verifications fold-in.
  verifications: number;
  verifiedRecent: VerifiedAccount[];
};

export function getBlueskyHighlights(
  byCollection: Map<string, RepoRecord[]>,
): BlueskyHighlights | null {
  const count = (nsid: string) => (byCollection.get(nsid) ?? []).length;

  const posts = count("app.bsky.feed.post");
  const likes = count("app.bsky.feed.like");
  const follows = count("app.bsky.graph.follow");
  const reposts = count("app.bsky.feed.repost");
  const blocks = count("app.bsky.graph.block");
  const listBlocks = count("app.bsky.graph.listblock");
  const cancellations = count("app.bsky.graph.cancellation");
  const lists = count("app.bsky.graph.list");
  const listItems = count("app.bsky.graph.listitem");
  const starterPacks = count("app.bsky.graph.starterpack");
  const customFeeds = count("app.bsky.feed.generator");
  const threadGates = count("app.bsky.feed.threadgate");
  const postGates = count("app.bsky.feed.postgate");
  const dislikes = count("app.bsky.feed.dislike");
  const postShit = count("app.bsky.feed.post.shit");
  const statusUpdates = count("app.bsky.actor.status");
  const hasProfile = count("app.bsky.actor.profile") > 0;
  const hasDms = count("chat.bsky.actor.declaration") > 0;
  const hasNotif = count("app.bsky.notification.declaration") > 0;

  // Total = sum of everything app.bsky.* + chat.bsky.* in the repo.
  let total = 0;
  for (const [nsid, records] of byCollection) {
    if (nsid.startsWith("app.bsky.") || nsid.startsWith("chat.bsky.")) {
      total += records.length;
    }
  }
  if (total === 0) return null;

  const verRecords = byCollection.get("app.bsky.graph.verification") ?? [];
  const verifiedRecent: VerifiedAccount[] = verRecords
    .map((r) => {
      const v = r.value;
      return {
        did: strOrNull(v.subject) ?? "",
        handle: strOrUndef(v.handle),
        displayName: strOrUndef(v.displayName),
        createdAt: r.createdAt,
      };
    })
    .sort(
      (a, b) =>
        (b.createdAt?.getTime() ?? 0) - (a.createdAt?.getTime() ?? 0),
    )
    .slice(0, 12);

  // Pick the 4 hero blocks dynamically. We always lead with whatever the user
  // does most of — for the typical Bluesky user that's likes > follows > posts
  // > reposts, but we let the data decide.
  const candidates: BlueskyHero[] = [
    { label: "posts", count: posts, theme: "lime" },
    { label: "likes", count: likes, theme: "pink" },
    { label: "follows", count: follows, theme: "yellow" },
    { label: "reposts", count: reposts, theme: "mint" },
  ];
  const hero = candidates
    .filter((c) => c.count > 0)
    .sort((a, b) => b.count - a.count)
    .slice(0, 4);

  const moderation = (
    [
      ["Blocks", blocks],
      ["List blocks", listBlocks],
      ["Cancellations", cancellations],
    ] as Array<[string, number]>
  ).filter(([, n]) => n > 0);

  const curation = (
    [
      ["Lists curated", lists],
      ["List adds", listItems],
      ["Starter packs", starterPacks],
      ["Custom feeds", customFeeds],
    ] as Array<[string, number]>
  ).filter(([, n]) => n > 0);

  const curiosity = (
    [
      ["Thread gates", threadGates],
      ["Post gates", postGates],
      ["Dislikes", dislikes],
      ["Shit posts", postShit],
      ["Status updates", statusUpdates],
    ] as Array<[string, number]>
  ).filter(([, n]) => n > 0);

  const profileBits = (
    [
      ["Profile", hasProfile ? "set up" : "—"],
      ["DMs", hasDms ? "configured" : "—"],
      ["Notifications", hasNotif ? "configured" : "—"],
    ] as Array<[string, string]>
  ).filter(([, v]) => v !== "—");

  return {
    total,
    posts,
    likes,
    follows,
    reposts,
    hero,
    moderation,
    curation,
    curiosity,
    profileBits,
    verifications: verRecords.length,
    verifiedRecent,
  };
}

/* ---------------- Music (Rocksky + TealFM) ---------------- */

export type Play = {
  trackName: string;
  artist: string;
  albumName?: string;
  artUrl?: string;
  spotifyLink?: string;
  releaseMbId?: string;
  recordingMbId?: string;
  time: Date | null;
  source: "rocksky" | "tealfm";
};

/**
 * Cover art via MusicBrainz Cover Art Archive. Browsers follow the 307 redirect
 * automatically in <img> tags. Used as a fallback when neither Rocksky nor an
 * upstream source provided album art directly.
 */
function coverArtUrl(releaseMbId: string): string {
  return `https://coverartarchive.org/release/${releaseMbId}/front-500`;
}

function stripMbidPrefix(s: unknown): string | undefined {
  if (typeof s !== "string" || !s) return undefined;
  return s.startsWith("mbid:") ? s.slice(5) : s;
}

export type MusicArtist = {
  name: string;
  pictureUrl?: string;
  plays: number;
};

export type MusicAlbum = {
  title: string;
  artist: string;
  artUrl?: string;
  plays: number;
};

export type MusicSong = {
  title: string;
  artist: string;
  album?: string;
  artUrl?: string;
  spotifyLink?: string;
  plays: number;
};

export type MusicHighlights = {
  totalPlays: number;
  rockskyCount: number;
  tealfmCount: number;
  dedupedDuplicates: number;
  topArtists: MusicArtist[];
  topAlbums: MusicAlbum[];
  topSongs: MusicSong[];
};

const DEDUP_WINDOW_MS = 60_000;

export function getMusicHighlights(
  byCollection: Map<string, RepoRecord[]>,
): MusicHighlights | null {
  const rockskyScrobbles = byCollection.get("app.rocksky.scrobble") ?? [];
  const tealfmPlays = byCollection.get("fm.teal.alpha.feed.play") ?? [];
  if (rockskyScrobbles.length === 0 && tealfmPlays.length === 0) return null;

  // artist pictures sourced from rocksky.artist
  const artistPics = new Map<string, string>();
  for (const r of byCollection.get("app.rocksky.artist") ?? []) {
    const v = r.value;
    const name = strOrNull(v.name);
    const pic = strOrNull(v.pictureUrl);
    if (name && pic) artistPics.set(name, pic);
  }

  // album art sourced from rocksky.album as backup
  const albumArtBackup = new Map<string, string>();
  for (const r of byCollection.get("app.rocksky.album") ?? []) {
    const v = r.value;
    const title = strOrNull(v.title);
    const artist = strOrNull(v.artist);
    const art = strOrNull(v.albumArtUrl);
    if (title && artist && art)
      albumArtBackup.set(`${title}::${artist}`, art);
  }

  const plays: Play[] = [];

  for (const r of rockskyScrobbles) {
    const v = r.value;
    plays.push({
      trackName: strOrNull(v.title) ?? "",
      artist: strOrNull(v.artist) ?? "",
      albumName: strOrUndef(v.album),
      artUrl: strOrUndef(v.albumArtUrl),
      spotifyLink: strOrUndef(v.spotifyLink),
      recordingMbId: stripMbidPrefix(v.mbid),
      time: r.createdAt,
      source: "rocksky",
    });
  }

  for (const r of tealfmPlays) {
    const v = r.value;
    const artists = Array.isArray(v.artists) ? v.artists : [];
    const firstArtist = artists[0] as Record<string, unknown> | undefined;
    const artist = firstArtist
      ? strOrNull(firstArtist.artistName) ?? ""
      : "";
    plays.push({
      trackName: strOrNull(v.trackName) ?? "",
      artist,
      albumName: strOrUndef(v.releaseName),
      artUrl: undefined,
      spotifyLink: undefined,
      releaseMbId: stripMbidPrefix(v.releaseMbId),
      recordingMbId: stripMbidPrefix(v.recordingMbId),
      time: parseDate(v.playedTime) ?? r.createdAt,
      source: "tealfm",
    });
  }

  // Sort by time ascending so dedup is deterministic.
  plays.sort((a, b) => (a.time?.getTime() ?? 0) - (b.time?.getTime() ?? 0));

  // Dedup: same (track + artist) within DEDUP_WINDOW_MS = single play.
  const deduped: Play[] = [];
  const lastSeen = new Map<string, number>();
  let dedupedDuplicates = 0;

  for (const p of plays) {
    if (!p.trackName || !p.artist) continue;
    const key = normalize(p.trackName) + "|" + normalize(p.artist);
    const t = p.time?.getTime() ?? 0;
    const lastIdx = lastSeen.get(key);
    if (lastIdx !== undefined) {
      const prev = deduped[lastIdx];
      const prevT = prev.time?.getTime() ?? 0;
      if (Math.abs(prevT - t) < DEDUP_WINDOW_MS) {
        // Merge: keep richest art/links/mbids.
        if (!prev.artUrl && p.artUrl) prev.artUrl = p.artUrl;
        if (!prev.spotifyLink && p.spotifyLink)
          prev.spotifyLink = p.spotifyLink;
        if (!prev.albumName && p.albumName) prev.albumName = p.albumName;
        if (!prev.releaseMbId && p.releaseMbId)
          prev.releaseMbId = p.releaseMbId;
        if (!prev.recordingMbId && p.recordingMbId)
          prev.recordingMbId = p.recordingMbId;
        dedupedDuplicates += 1;
        continue;
      }
    }
    lastSeen.set(key, deduped.length);
    deduped.push({ ...p });
  }

  // Aggregate.
  const artistMap = new Map<string, MusicArtist>();
  const albumMap = new Map<string, MusicAlbum>();
  const songMap = new Map<string, MusicSong>();

  for (const p of deduped) {
    if (p.artist) {
      const a = artistMap.get(p.artist);
      if (a) a.plays += 1;
      else
        artistMap.set(p.artist, {
          name: p.artist,
          pictureUrl: artistPics.get(p.artist) ?? p.artUrl,
          plays: 1,
        });
    }

    if (p.albumName && p.artist) {
      const k = `${p.albumName}::${p.artist}`;
      const a = albumMap.get(k);
      const fallbackArt =
        albumArtBackup.get(k) ??
        (p.releaseMbId ? coverArtUrl(p.releaseMbId) : undefined);
      if (a) a.plays += 1;
      else
        albumMap.set(k, {
          title: p.albumName,
          artist: p.artist,
          artUrl: p.artUrl ?? fallbackArt,
          plays: 1,
        });
    }

    if (p.trackName && p.artist) {
      const k = `${p.trackName}::${p.artist}`;
      const a = songMap.get(k);
      const mbidArt = p.releaseMbId
        ? coverArtUrl(p.releaseMbId)
        : undefined;
      if (a) {
        a.plays += 1;
        if (!a.spotifyLink && p.spotifyLink) a.spotifyLink = p.spotifyLink;
        if (!a.artUrl && p.artUrl) a.artUrl = p.artUrl;
        if (!a.artUrl && mbidArt) a.artUrl = mbidArt;
      } else
        songMap.set(k, {
          title: p.trackName,
          artist: p.artist,
          album: p.albumName,
          artUrl: p.artUrl ?? mbidArt,
          spotifyLink: p.spotifyLink,
          plays: 1,
        });
    }
  }

  const sortDesc = <T extends { plays: number }>(m: Map<string, T>, n: number) =>
    Array.from(m.values())
      .sort((a, b) => b.plays - a.plays)
      .slice(0, n);

  return {
    totalPlays: deduped.length,
    rockskyCount: rockskyScrobbles.length,
    tealfmCount: tealfmPlays.length,
    dedupedDuplicates,
    topArtists: sortDesc(artistMap, 6),
    topAlbums: sortDesc(albumMap, 8),
    topSongs: sortDesc(songMap, 6),
  };
}

/* ---------------- Popfeed ---------------- */

export type PopfeedReview = {
  title: string;
  rating: number | null;
  text: string;
  posterUrl?: string;
  type: string;
  mainCredit?: string;
  rkey: string;
  createdAt: Date | null;
};

export type PopfeedHighlights = {
  reviews: PopfeedReview[];
  total: number;
  averageRating: number | null;
  byType: Map<string, number>;
};

export function getPopfeedHighlights(
  byCollection: Map<string, RepoRecord[]>,
): PopfeedHighlights | null {
  const reviews = byCollection.get("social.popfeed.feed.review") ?? [];
  if (reviews.length === 0) return null;

  const parsed: PopfeedReview[] = reviews.map((r) => {
    const v = r.value;
    const rating = typeof v.rating === "number" ? v.rating : null;
    return {
      title: stripHtml(strOrNull(v.title) ?? "Untitled"),
      rating,
      text: stripHtml(strOrNull(v.text) ?? ""),
      posterUrl: strOrUndef(v.posterUrl),
      type: strOrNull(v.creativeWorkType) ?? "",
      mainCredit: strOrUndef(v.mainCredit),
      rkey: r.rkey,
      createdAt: r.createdAt,
    };
  });

  parsed.sort(
    (a, b) =>
      (b.createdAt?.getTime() ?? 0) - (a.createdAt?.getTime() ?? 0),
  );

  const ratings = parsed
    .map((r) => r.rating)
    .filter((r): r is number => r !== null);
  const averageRating =
    ratings.length > 0
      ? ratings.reduce((s, n) => s + n, 0) / ratings.length
      : null;

  const byType = new Map<string, number>();
  for (const r of parsed) {
    if (!r.type) continue;
    byType.set(r.type, (byType.get(r.type) ?? 0) + 1);
  }

  return {
    reviews: parsed.slice(0, 12),
    total: parsed.length,
    averageRating,
    byType,
  };
}

/* ---------------- Grain (photos) ---------------- */

export type GrainPhoto = {
  imageUrl: string;
  caption?: string;
  alt?: string;
  createdAt: Date | null;
};

export type GrainHighlights = {
  total: number;
  photos: GrainPhoto[];
  favorites: number;
  galleries: number;
  stories: number;
  comments: number;
  follows: number;
};

export function getGrainHighlights(stats: RepoStats): GrainHighlights | null {
  const records = stats.byCollection.get("social.grain.photo") ?? [];
  const favorites = (stats.byCollection.get("social.grain.favorite") ?? [])
    .length;
  const galleries = (stats.byCollection.get("social.grain.gallery") ?? [])
    .length;
  const stories = (stats.byCollection.get("social.grain.story") ?? []).length;
  const comments = (stats.byCollection.get("social.grain.comment") ?? [])
    .length;
  const follows = (
    stats.byCollection.get("social.grain.graph.follow") ?? []
  ).length;

  if (
    records.length === 0 &&
    favorites === 0 &&
    galleries === 0 &&
    stories === 0 &&
    comments === 0 &&
    follows === 0
  )
    return null;

  const photos: GrainPhoto[] = [];
  for (const r of records) {
    const v = r.value;
    // Be tolerant of the shape — `photo`, `image`, `images[].image`, or any first blob.
    const blob =
      pickBlob(v.photo) ??
      pickBlob(v.image) ??
      pickFirstImageInList(v.images) ??
      findFirstBlob(v);
    if (!blob) continue;
    const imageUrl = blobUrl(stats.pds, stats.did, blob);
    if (!imageUrl) continue;
    photos.push({
      imageUrl,
      caption: strOrUndef(v.caption) ?? strOrUndef(v.description),
      alt: strOrUndef(v.alt) ?? strOrUndef(v.altText),
      createdAt: r.createdAt,
    });
  }
  photos.sort(
    (a, b) =>
      (b.createdAt?.getTime() ?? 0) - (a.createdAt?.getTime() ?? 0),
  );
  return {
    total: records.length,
    photos: photos.slice(0, 12),
    favorites,
    galleries,
    stories,
    comments,
    follows,
  };
}

/* ---------------- Tangled (code) ---------------- */

export type TangledRepo = {
  name: string;
  knot?: string;
  url?: string;
  createdAt: Date | null;
};

export type TangledHighlights = {
  totalRepos: number;
  starsGiven: number;
  reactions: number;
  issues: number;
  repos: TangledRepo[];
};

export function getTangledHighlights(
  byCollection: Map<string, RepoRecord[]>,
): TangledHighlights | null {
  const repos = byCollection.get("sh.tangled.repo") ?? [];
  const stars = byCollection.get("sh.tangled.feed.star") ?? [];
  const reactions = byCollection.get("sh.tangled.feed.reaction") ?? [];
  const issues = byCollection.get("sh.tangled.repo.issue") ?? [];
  if (
    repos.length === 0 &&
    stars.length === 0 &&
    reactions.length === 0 &&
    issues.length === 0
  ) {
    return null;
  }

  const list: TangledRepo[] = repos.map((r) => {
    const v = r.value;
    const name = strOrNull(v.name) ?? "untitled";
    const knot = strOrUndef(v.knot);
    const url = knot ? `https://tangled.sh/@/${knot}/${name}` : undefined;
    return { name, knot, url, createdAt: r.createdAt };
  });
  list.sort(
    (a, b) =>
      (b.createdAt?.getTime() ?? 0) - (a.createdAt?.getTime() ?? 0),
  );

  return {
    totalRepos: repos.length,
    starsGiven: stars.length,
    reactions: reactions.length,
    issues: issues.length,
    repos: list.slice(0, 12),
  };
}

/* ---------------- Streamplace ---------------- */

export type StreamSummary = {
  title: string;
  url?: string;
  createdAt: Date | null;
};

export type StreamChat = {
  text: string;
  streamer: string;
  createdAt: Date | null;
};

export type StreamplaceHighlights = {
  totalStreams: number;
  totalChats: number;
  uniqueStreamersChatted: number;
  streams: StreamSummary[];
  topStreamersChatted: Array<{ streamer: string; count: number }>;
  recentChats: StreamChat[];
};

export function getStreamplaceHighlights(
  byCollection: Map<string, RepoRecord[]>,
): StreamplaceHighlights | null {
  const streamRecords = byCollection.get("place.stream.livestream") ?? [];
  const chatRecords = byCollection.get("place.stream.chat.message") ?? [];
  if (streamRecords.length === 0 && chatRecords.length === 0) return null;

  const streams: StreamSummary[] = streamRecords.map((r) => {
    const v = r.value;
    return {
      title: strOrNull(v.title) ?? "Untitled stream",
      url: strOrUndef(v.url),
      createdAt: r.createdAt,
    };
  });
  streams.sort(
    (a, b) =>
      (b.createdAt?.getTime() ?? 0) - (a.createdAt?.getTime() ?? 0),
  );

  const chatsByStreamer = new Map<string, number>();
  const chats: StreamChat[] = chatRecords.map((r) => {
    const v = r.value;
    const streamer = strOrNull(v.streamer) ?? "unknown";
    chatsByStreamer.set(streamer, (chatsByStreamer.get(streamer) ?? 0) + 1);
    return {
      text: strOrNull(v.text) ?? "",
      streamer,
      createdAt: r.createdAt,
    };
  });
  chats.sort(
    (a, b) =>
      (b.createdAt?.getTime() ?? 0) - (a.createdAt?.getTime() ?? 0),
  );

  const topStreamersChatted = Array.from(chatsByStreamer.entries())
    .map(([streamer, count]) => ({ streamer, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  return {
    totalStreams: streamRecords.length,
    totalChats: chatRecords.length,
    uniqueStreamersChatted: chatsByStreamer.size,
    streams: streams.slice(0, 8),
    topStreamersChatted,
    recentChats: chats.filter((c) => c.text).slice(0, 6),
  };
}

/* ---------------- RPG ---------------- */

export type RpgItem = {
  title: string;
  description?: string;
  iconUrl?: string;
  context?: string;
  category?: string;
};

export type RpgStats = {
  octant?: string;
  attributes: Array<{ name: string; value: number }>;
  games: Array<{ name: string; best: number; tries: number; worst: number }>;
};

export type RpgHighlights = {
  spriteUrl?: string;
  spriteFrameWidth?: number;
  spriteFrameHeight?: number;
  spriteSheetWidth?: number;
  spriteSheetHeight?: number;
  items: RpgItem[];
  stats: RpgStats | null;
};

export function getRpgHighlights(stats: RepoStats): RpgHighlights | null {
  const spriteRec = (stats.byCollection.get("actor.rpg.sprite") ?? [])[0];
  const statsRec = (stats.byCollection.get("actor.rpg.stats") ?? [])[0];
  const itemRecords = stats.byCollection.get("equipment.rpg.item") ?? [];

  if (!spriteRec && !statsRec && itemRecords.length === 0) return null;

  let spriteUrl: string | undefined;
  let spriteFrameWidth: number | undefined;
  let spriteFrameHeight: number | undefined;
  let spriteSheetWidth: number | undefined;
  let spriteSheetHeight: number | undefined;
  if (spriteRec) {
    const v = spriteRec.value;
    const blob = pickBlob(v.spriteSheet) ?? findFirstBlob(v);
    spriteUrl = blob ? blobUrl(stats.pds, stats.did, blob) : undefined;
    if (typeof v.frameWidth === "number") spriteFrameWidth = v.frameWidth;
    if (typeof v.frameHeight === "number") spriteFrameHeight = v.frameHeight;
    if (typeof v.width === "number") spriteSheetWidth = v.width;
    if (typeof v.height === "number") spriteSheetHeight = v.height;
  }

  const items: RpgItem[] = [];
  for (const r of itemRecords) {
    const v = r.value;
    const iconBlob = pickBlob(v.icon) ?? pickBlob(v.asset);
    items.push({
      title: strOrNull(v.title) ?? strOrNull(v.item) ?? "Item",
      description: strOrUndef(v.description),
      iconUrl: iconBlob
        ? blobUrl(stats.pds, stats.did, iconBlob)
        : undefined,
      context: strOrUndef(v.context),
      category: strOrUndef(v.category),
    });
  }

  let parsedStats: RpgStats | null = null;
  if (statsRec) {
    const v = statsRec.value;
    const attributes: Array<{ name: string; value: number }> = [];
    let octant: string | undefined;
    const reverie = v.reverie as Record<string, unknown> | undefined;
    if (reverie && typeof reverie === "object") {
      for (const [name, val] of Object.entries(reverie)) {
        if (name === "octant" && typeof val === "string") {
          octant = val;
        } else if (typeof val === "number") {
          attributes.push({ name, value: val });
        }
      }
    }
    const games: RpgStats["games"] = [];
    for (const [key, val] of Object.entries(v)) {
      if (
        val &&
        typeof val === "object" &&
        !Array.isArray(val) &&
        "best" in (val as object) &&
        "tries" in (val as object)
      ) {
        const g = val as Record<string, unknown>;
        const meta = g._meta as Record<string, unknown> | undefined;
        const name =
          (meta && typeof meta.name === "string" && meta.name) ||
          prettyKey(key);
        games.push({
          name,
          best: typeof g.best === "number" ? g.best : 0,
          tries: typeof g.tries === "number" ? g.tries : 0,
          worst: typeof g.worst === "number" ? g.worst : 0,
        });
      }
    }
    parsedStats = { octant, attributes, games };
  }

  return {
    spriteUrl,
    spriteFrameWidth,
    spriteFrameHeight,
    spriteSheetWidth,
    spriteSheetHeight,
    items,
    stats: parsedStats,
  };
}

/* ---------------- Anisota ---------------- */

export type AnisotaItem = {
  itemId: string;
  name: string;
  type?: string;
  rarity?: string;
  source?: string;
  quantity: number;
};

export type AnisotaHighlights = {
  level: number | null;
  totalXP: number | null;
  xpToNextLevel: number | null;
  daysLogged: number;
  postsCreated: number;
  likesSent: number;
  itemsAcquired: number;
  specimensDocumented: number;
  sessions: number;
  expeditions: number;
  achievements: number;
  feedPosts: number;
  inventoryTotal: number;
  items: AnisotaItem[];
};

export function getAnisotaHighlights(
  byCollection: Map<string, RepoRecord[]>,
): AnisotaHighlights | null {
  const hasAny = Array.from(byCollection.keys()).some((nsid) =>
    nsid.startsWith("net.anisota."),
  );
  if (!hasAny) return null;

  const progress = (byCollection.get("net.anisota.chronicle.progress") ?? [])[0];
  let level: number | null = null;
  let totalXP: number | null = null;
  let xpToNextLevel: number | null = null;
  if (progress) {
    const v = progress.value;
    if (typeof v.level === "number") level = v.level;
    if (typeof v.totalXP === "number") totalXP = v.totalXP;
    if (typeof v.xpToNextLevel === "number") xpToNextLevel = v.xpToNextLevel;
  }

  const dailyLogs = byCollection.get("net.anisota.chronicle.log.daily") ?? [];
  let postsCreated = 0;
  let likesSent = 0;
  let itemsAcquired = 0;
  let specimensDocumented = 0;
  for (const r of dailyLogs) {
    const v = r.value;
    const player = v.player as Record<string, unknown> | undefined;
    const activity = v.activity as Record<string, unknown> | undefined;
    if (player) {
      if (typeof player.itemsAcquiredToday === "number")
        itemsAcquired += player.itemsAcquiredToday;
      if (typeof player.specimensDocumented === "number")
        specimensDocumented = Math.max(
          specimensDocumented,
          player.specimensDocumented,
        );
    }
    if (activity) {
      if (typeof activity.postsCreated === "number")
        postsCreated += activity.postsCreated;
      if (typeof activity.likesSent === "number")
        likesSent += activity.likesSent;
    }
  }

  const inventory =
    (byCollection.get("net.anisota.chronicle.inventory") ?? []).concat(
      byCollection.get("net.anisota.beta.game.inventory") ?? [],
    );
  const items: AnisotaItem[] = inventory.map((r) => {
    const v = r.value;
    return {
      itemId: strOrNull(v.itemId) ?? strOrNull(v.id) ?? "item",
      name:
        strOrNull(v.itemName) ?? strOrNull(v.name) ?? strOrNull(v.title) ?? "Item",
      type: strOrUndef(v.itemType) ?? strOrUndef(v.type),
      rarity: strOrUndef(v.rarity),
      source: strOrUndef(v.source),
      quantity: typeof v.quantity === "number" ? v.quantity : 1,
    };
  });
  // Sort by rarity ranking then name
  const rarityRank: Record<string, number> = {
    legendary: 0,
    epic: 1,
    rare: 2,
    uncommon: 3,
    common: 4,
  };
  items.sort((a, b) => {
    const ra = rarityRank[a.rarity ?? ""] ?? 99;
    const rb = rarityRank[b.rarity ?? ""] ?? 99;
    if (ra !== rb) return ra - rb;
    return a.name.localeCompare(b.name);
  });

  const inventoryTotal = items.reduce((s, i) => s + i.quantity, 0);
  const sessions = (byCollection.get("net.anisota.beta.game.session") ?? [])
    .length;
  const expeditions =
    (byCollection.get("net.anisota.chronicle.expedition") ?? []).length +
    (byCollection.get("net.anisota.chronicle.expedition.camp") ?? []).length;
  const achievements =
    (byCollection.get("net.anisota.chronicle.achievement") ?? []).length +
    (byCollection.get("net.anisota.beta.game.achievement") ?? []).length;
  const feedPosts = (byCollection.get("net.anisota.feed.post") ?? []).length;

  return {
    level,
    totalXP,
    xpToNextLevel,
    daysLogged: dailyLogs.length,
    postsCreated,
    likesSent,
    itemsAcquired,
    specimensDocumented,
    sessions,
    expeditions,
    achievements,
    feedPosts,
    inventoryTotal,
    items: items.slice(0, 16),
  };
}

/* ---------------- Games (cross-app) ---------------- */

export type GameStat = {
  name: string;
  nsid: string;
  total: number;
  bestScore?: number;
  metric?: string;
};

export type GamesHighlights = {
  totalGames: number;
  games: GameStat[];
};

const GAME_LEXICONS: Array<{
  nsid: string;
  name: string;
  scoreField?: string;
  metric?: string;
  higherIsBetter?: boolean;
}> = [
  { nsid: "blue.2048.game", name: "2048", scoreField: "score", metric: "best score" },
  { nsid: "games.firehose.tictactoe", name: "Tic-tac-toe" },
  {
    nsid: "farm.smol.games.skyrdle.score",
    name: "Skyrdle",
    scoreField: "score",
    metric: "best score",
  },
  {
    nsid: "farm.smol.games.eggsweeper.score",
    name: "Eggsweeper",
    scoreField: "score",
    metric: "best score",
  },
  {
    nsid: "tools.atp.typing.test",
    name: "Typing test",
    scoreField: "wpm",
    metric: "wpm",
  },
  {
    nsid: "tools.atp.borgle.play",
    name: "Borgle",
    scoreField: "score",
    metric: "best score",
  },
  {
    nsid: "com.imlunahey.leaderboard.score",
    name: "Wordle",
    scoreField: "score",
    metric: "best score",
    higherIsBetter: false,
  },
  {
    nsid: "net.anisota.harvest.minigame",
    name: "Anisota harvest",
    scoreField: "score",
    metric: "best score",
  },
  {
    nsid: "app.mathr.score",
    name: "Mathr",
    scoreField: "score",
    metric: "best score",
  },
  { nsid: "blue.checkmate.game", name: "Checkmate" },
  { nsid: "blue.checkmate.challenge", name: "Checkmate challenges" },
  {
    nsid: "blue.atplay.score",
    name: "AtPlay",
    scoreField: "score",
    metric: "best score",
  },
];

export function getGamesHighlights(
  byCollection: Map<string, RepoRecord[]>,
): GamesHighlights | null {
  const games: GameStat[] = [];
  let total = 0;
  for (const g of GAME_LEXICONS) {
    const records = byCollection.get(g.nsid) ?? [];
    if (records.length === 0) continue;
    let bestScore: number | undefined;
    if (g.scoreField) {
      for (const r of records) {
        const v = r.value as Record<string, unknown>;
        const n = v[g.scoreField];
        if (typeof n !== "number") continue;
        if (bestScore === undefined) bestScore = n;
        else if (g.higherIsBetter === false) {
          if (n < bestScore) bestScore = n;
        } else if (n > bestScore) bestScore = n;
      }
    }
    games.push({
      name: g.name,
      nsid: g.nsid,
      total: records.length,
      bestScore,
      metric: g.metric,
    });
    total += records.length;
  }
  if (games.length === 0) return null;
  games.sort((a, b) => b.total - a.total);
  return { totalGames: total, games };
}

/* ---------------- Flashes ---------------- */

export type FlashesPost = {
  imageUrl?: string;
  text?: string;
  createdAt: Date | null;
};

export type FlashesHighlights = {
  total: number;
  posts: FlashesPost[];
};

export function getFlashesHighlights(
  stats: RepoStats,
): FlashesHighlights | null {
  const posts = stats.byCollection.get("blue.flashes.feed.post") ?? [];
  const portfolioPosts =
    stats.byCollection.get("blue.flashes.actor.portfolio") ?? [];
  if (posts.length === 0 && portfolioPosts.length === 0) return null;

  const allPosts = [...posts, ...portfolioPosts];
  const collected: FlashesPost[] = [];
  for (const r of allPosts) {
    const v = r.value;
    const blob = findFirstBlob(v);
    const imageUrl = blob ? blobUrl(stats.pds, stats.did, blob) : undefined;
    collected.push({
      imageUrl,
      text: strOrUndef(v.text) ?? strOrUndef(v.caption),
      createdAt: r.createdAt,
    });
  }
  collected.sort(
    (a, b) =>
      (b.createdAt?.getTime() ?? 0) - (a.createdAt?.getTime() ?? 0),
  );
  return {
    total: allPosts.length,
    posts: collected.filter((p) => p.imageUrl).slice(0, 12),
  };
}

/* ---------------- Reading ---------------- */

export type ReadingItem = {
  kind: "blog" | "book" | "leaflet" | "bookmark" | "annotation" | "skylight";
  title: string;
  excerpt?: string;
  author?: string;
  createdAt: Date | null;
  url?: string;
};

export type ReadingHighlights = {
  blogsWritten: number;
  booksLogged: number;
  leafletDocs: number;
  bookmarks: number;
  annotations: number;
  skylights: number;
  items: ReadingItem[];
};

export function getReadingHighlights(
  byCollection: Map<string, RepoRecord[]>,
): ReadingHighlights | null {
  const blogs = byCollection.get("com.whtwnd.blog.entry") ?? [];
  const books = byCollection.get("buzz.bookhive.book") ?? [];
  const leaflets = byCollection.get("pub.leaflet.document") ?? [];
  const marginBookmarks = byCollection.get("at.margin.bookmark") ?? [];
  const annotations = byCollection.get("at.margin.annotation") ?? [];
  const monomarks = byCollection.get("at.monomarks.bookmark") ?? [];
  const skylights = byCollection.get("my.skylights.rel") ?? [];

  const total =
    blogs.length +
    books.length +
    leaflets.length +
    marginBookmarks.length +
    annotations.length +
    monomarks.length +
    skylights.length;
  if (total === 0) return null;

  const items: ReadingItem[] = [];

  for (const r of blogs) {
    const v = r.value;
    const content = strOrNull(v.content) ?? "";
    items.push({
      kind: "blog",
      title: strOrNull(v.title) ?? "Untitled",
      excerpt: stripMarkdown(content).slice(0, 180),
      createdAt: r.createdAt,
    });
  }

  for (const r of books) {
    const v = r.value;
    items.push({
      kind: "book",
      title:
        strOrNull(v.title) ?? strOrNull(v.bookTitle) ?? "Book",
      author: strOrUndef(v.author) ?? strOrUndef(v.bookAuthor),
      excerpt: strOrUndef(v.review),
      createdAt: r.createdAt,
    });
  }

  for (const r of leaflets) {
    const v = r.value;
    items.push({
      kind: "leaflet",
      title: strOrNull(v.title) ?? "Leaflet document",
      excerpt: strOrUndef(v.description) ?? strOrUndef(v.subtitle),
      createdAt: r.createdAt,
    });
  }

  for (const r of [...marginBookmarks, ...monomarks]) {
    const v = r.value;
    items.push({
      kind: "bookmark",
      title: strOrNull(v.title) ?? strOrNull(v.url) ?? "Bookmark",
      url: strOrUndef(v.url),
      excerpt: strOrUndef(v.description) ?? strOrUndef(v.note),
      createdAt: r.createdAt,
    });
  }

  for (const r of annotations) {
    const v = r.value;
    items.push({
      kind: "annotation",
      title:
        stripMarkdown(strOrNull(v.body) ?? strOrNull(v.text) ?? "")
          .slice(0, 80)
          .trim() || "Highlight",
      excerpt: strOrUndef(v.context),
      createdAt: r.createdAt,
    });
  }

  for (const r of skylights) {
    const v = r.value;
    items.push({
      kind: "skylight",
      title:
        strOrNull(v.title) ??
        strOrNull(v.name) ??
        strOrNull(v.subject) ??
        "Rated thing",
      excerpt: strOrUndef(v.note),
      createdAt: r.createdAt,
    });
  }

  items.sort(
    (a, b) =>
      (b.createdAt?.getTime() ?? 0) - (a.createdAt?.getTime() ?? 0),
  );

  return {
    blogsWritten: blogs.length,
    booksLogged: books.length,
    leafletDocs: leaflets.length,
    bookmarks: marginBookmarks.length + monomarks.length,
    annotations: annotations.length,
    skylights: skylights.length,
    items: items.slice(0, 12),
  };
}

/* ---------------- Flushing right now ---------------- */

export type Flush = {
  text?: string;
  emoji?: string;
  createdAt: Date | null;
};

export type FlushingHighlights = {
  total: number;
  recent: Flush[];
};

export function getFlushingHighlights(
  byCollection: Map<string, RepoRecord[]>,
): FlushingHighlights | null {
  const records = byCollection.get("im.flushing.right.now") ?? [];
  if (records.length === 0) return null;

  const flushes: Flush[] = records.map((r) => {
    const v = r.value;
    return {
      text: strOrUndef(v.text),
      emoji: strOrUndef(v.emoji),
      createdAt: r.createdAt,
    };
  });
  flushes.sort(
    (a, b) =>
      (b.createdAt?.getTime() ?? 0) - (a.createdAt?.getTime() ?? 0),
  );
  return { total: records.length, recent: flushes.slice(0, 6) };
}

/* ---------------- Frontpage ---------------- */

export type FrontpageHighlights = {
  posts: number;
  comments: number;
  votes: number;
  recent: Array<{ title?: string; url?: string; createdAt: Date | null }>;
  recentVotes: Array<{ subjectUri?: string; createdAt: Date | null }>;
  recentComments: Array<{
    content?: string;
    postUri?: string;
    createdAt: Date | null;
  }>;
};

export function getFrontpageHighlights(
  byCollection: Map<string, RepoRecord[]>,
): FrontpageHighlights | null {
  const posts = byCollection.get("fyi.unravel.frontpage.post") ?? [];
  const comments = byCollection.get("fyi.unravel.frontpage.comment") ?? [];
  const votes = byCollection.get("fyi.unravel.frontpage.vote") ?? [];
  if (posts.length === 0 && comments.length === 0 && votes.length === 0)
    return null;

  const recent = posts
    .map((r) => {
      const v = r.value;
      return {
        title: strOrUndef(v.title),
        url: strOrUndef(v.url),
        createdAt: r.createdAt,
      };
    })
    .sort(
      (a, b) =>
        (b.createdAt?.getTime() ?? 0) - (a.createdAt?.getTime() ?? 0),
    )
    .slice(0, 6);

  const recentVotes = votes
    .map((r) => {
      const v = r.value;
      const subject = v.subject as Record<string, unknown> | undefined;
      return {
        subjectUri: strOrUndef(subject?.uri),
        createdAt: r.createdAt,
      };
    })
    .filter((v) => !!v.subjectUri)
    .sort(
      (a, b) =>
        (b.createdAt?.getTime() ?? 0) - (a.createdAt?.getTime() ?? 0),
    )
    .slice(0, 8);

  const recentComments = comments
    .map((r) => {
      const v = r.value;
      const post = v.post as Record<string, unknown> | undefined;
      return {
        content: strOrUndef(v.content),
        postUri: strOrUndef(post?.uri),
        createdAt: r.createdAt,
      };
    })
    .filter((c) => !!c.content || !!c.postUri)
    .sort(
      (a, b) =>
        (b.createdAt?.getTime() ?? 0) - (a.createdAt?.getTime() ?? 0),
    )
    .slice(0, 6);

  return {
    posts: posts.length,
    comments: comments.length,
    votes: votes.length,
    recent,
    recentVotes,
    recentComments,
  };
}

/* ---------------- Drydown ---------------- */

export type DrydownReview = {
  fragrance?: string;
  house?: string;
  rating: number | null;
  scale: number;
  text?: string;
  imageUrl?: string;
  createdAt: Date | null;
};

export type DrydownHighlights = {
  reviews: DrydownReview[];
  total: number;
  fragrances: number;
  houses: number;
};

export function getDrydownHighlights(
  stats: RepoStats,
): DrydownHighlights | null {
  const reviews = stats.byCollection.get("social.drydown.review") ?? [];
  const fragrances = stats.byCollection.get("social.drydown.fragrance") ?? [];
  const houses = stats.byCollection.get("social.drydown.house") ?? [];
  if (
    reviews.length === 0 &&
    fragrances.length === 0 &&
    houses.length === 0
  )
    return null;

  // Reviews reference fragrances by at:// URI; fragrances reference houses
  // the same way. Build URI lookups so we can dereference both hops.
  const fragranceByUri = new Map<string, Record<string, unknown>>();
  for (const r of fragrances) fragranceByUri.set(r.uri, r.value);
  const houseByUri = new Map<string, Record<string, unknown>>();
  for (const r of houses) houseByUri.set(r.uri, r.value);

  const parsed: DrydownReview[] = reviews.map((r) => {
    const v = r.value;
    const blob = findFirstBlob(v);
    const fragranceRefUri = strOrUndef(v.fragrance);
    const frag = fragranceRefUri
      ? fragranceByUri.get(fragranceRefUri)
      : undefined;
    const fragranceName =
      (frag ? strOrUndef(frag.name) : undefined) ??
      strOrUndef(v.fragranceName);
    const houseRefUri = frag ? strOrUndef(frag.house) : undefined;
    const house = houseRefUri ? houseByUri.get(houseRefUri) : undefined;
    const houseName =
      (house ? strOrUndef(house.name) : undefined) ?? strOrUndef(v.houseName);

    const rating =
      typeof v.openingRating === "number"
        ? v.openingRating
        : typeof v.rating === "number"
          ? v.rating
          : null;
    // openingRating tops out at 5 in the schema we've observed.
    const scale = typeof v.openingRating === "number" ? 5 : 10;

    return {
      fragrance: fragranceName,
      house: houseName,
      rating,
      scale,
      text: stripHtml(strOrNull(v.text) ?? strOrNull(v.body) ?? "")
        .slice(0, 240) || undefined,
      imageUrl: blob ? blobUrl(stats.pds, stats.did, blob) : undefined,
      createdAt: r.createdAt,
    };
  });
  parsed.sort(
    (a, b) =>
      (b.createdAt?.getTime() ?? 0) - (a.createdAt?.getTime() ?? 0),
  );

  return {
    reviews: parsed.slice(0, 8),
    total: reviews.length,
    fragrances: fragrances.length,
    houses: houses.length,
  };
}

/* ---------------- Status updates ---------------- */

export type StatusItem = {
  text: string;
  emoji?: string;
  service: string;
  createdAt: Date | null;
};

export type StatusHighlights = {
  total: number;
  byService: Map<string, number>;
  recent: StatusItem[];
};

const STATUS_LEXICONS: Array<{
  nsid: string;
  service: string;
  textField?: string;
}> = [
  // Note: app.bsky.actor.status is intentionally NOT here — it's part of the
  // Bluesky spotlight now.
  { nsid: "is.dame.now", service: "dame.is/now", textField: "text" },
  { nsid: "is.dame.counting.turtles", service: "dame.is/turtles" },
  { nsid: "is.dame.creating.work", service: "dame.is/work" },
  {
    nsid: "xyz.statusphere.status",
    service: "Statusphere",
    textField: "status",
  },
  {
    nsid: "vg.nat.istat.status.record",
    service: "iStat",
    textField: "status",
  },
  { nsid: "social.kibun.status", service: "Kibun", textField: "status" },
  {
    nsid: "io.zzstoatzz.status.record",
    service: "zzstoatzz",
    textField: "status",
  },
];

export function getStatusHighlights(
  byCollection: Map<string, RepoRecord[]>,
): StatusHighlights | null {
  const recent: StatusItem[] = [];
  const byService = new Map<string, number>();
  for (const lex of STATUS_LEXICONS) {
    const records = byCollection.get(lex.nsid) ?? [];
    if (records.length === 0) continue;
    byService.set(lex.service, records.length);
    for (const r of records) {
      const v = r.value;
      const text =
        (lex.textField && strOrUndef(v[lex.textField])) ??
        strOrUndef(v.text) ??
        strOrUndef(v.status) ??
        strOrUndef(v.message) ??
        strOrUndef(v.content) ??
        "";
      const emoji = strOrUndef(v.emoji);
      // Skip entries with literally nothing to show.
      if (!text && !emoji) continue;
      recent.push({
        text: text || "(no text)",
        emoji,
        service: lex.service,
        createdAt: r.createdAt,
      });
    }
  }
  if (recent.length === 0 && byService.size === 0) return null;
  recent.sort(
    (a, b) =>
      (b.createdAt?.getTime() ?? 0) - (a.createdAt?.getTime() ?? 0),
  );
  const total = Array.from(byService.values()).reduce((s, n) => s + n, 0);
  return { total, byService, recent: recent.slice(0, 8) };
}

/* ---------------- Verifications ---------------- */

export type VerifiedAccount = {
  did: string;
  handle?: string;
  displayName?: string;
  createdAt: Date | null;
};

export type VerificationsHighlights = {
  total: number;
  recent: VerifiedAccount[];
};

export function getVerificationsHighlights(
  byCollection: Map<string, RepoRecord[]>,
): VerificationsHighlights | null {
  const records = byCollection.get("app.bsky.graph.verification") ?? [];
  if (records.length === 0) return null;
  const recent: VerifiedAccount[] = records.map((r) => {
    const v = r.value;
    return {
      did: strOrNull(v.subject) ?? "",
      handle: strOrUndef(v.handle),
      displayName: strOrUndef(v.displayName),
      createdAt: r.createdAt,
    };
  });
  recent.sort(
    (a, b) =>
      (b.createdAt?.getTime() ?? 0) - (a.createdAt?.getTime() ?? 0),
  );
  return { total: records.length, recent: recent.slice(0, 12) };
}

/* ---------------- Atsumeat (sticker trading) ---------------- */

export type AtsumeatSticker = {
  imageUrl?: string;
  imageType?: string;
  obtainedAt: Date | null;
  obtainedFrom?: string;
};

export type AtsumeatHighlights = {
  totalStickers: number;
  totalTransactions: number;
  uniquePartners: number;
  stickers: AtsumeatSticker[];
};

export function getAtsumeatHighlights(
  byCollection: Map<string, RepoRecord[]>,
): AtsumeatHighlights | null {
  const stickers = byCollection.get("com.suibari.atsumeat.sticker") ?? [];
  const transactions =
    byCollection.get("com.suibari.atsumeat.transaction") ?? [];
  if (stickers.length === 0 && transactions.length === 0) return null;

  const partners = new Set<string>();
  for (const r of transactions) {
    const partner = strOrUndef(r.value.partner);
    if (partner) partners.add(partner);
  }

  const parsed: AtsumeatSticker[] = stickers.map((r) => {
    const v = r.value;
    return {
      imageUrl: strOrUndef(v.image),
      imageType: strOrUndef(v.imageType),
      obtainedAt: parseDate(v.obtainedAt) ?? r.createdAt,
      obtainedFrom: strOrUndef(v.obtainedFrom),
    };
  });
  parsed.sort(
    (a, b) =>
      (b.obtainedAt?.getTime() ?? 0) - (a.obtainedAt?.getTime() ?? 0),
  );

  return {
    totalStickers: stickers.length,
    totalTransactions: transactions.length,
    uniquePartners: partners.size,
    stickers: parsed.slice(0, 16),
  };
}

/* ---------------- AtBuddy (virtual pet) ---------------- */

export type AtBuddyHighlights = {
  creature: {
    name?: string;
    species?: string;
    rarity?: string;
    isShiny?: boolean;
  } | null;
  stats: {
    xp?: number;
    level?: number;
    mood?: number;
    energy?: number;
    lastFedAt?: Date | null;
    lastPettedAt?: Date | null;
  } | null;
  interactionsByType: Map<string, number>;
  totalInteractions: number;
};

export function getAtBuddyHighlights(
  byCollection: Map<string, RepoRecord[]>,
): AtBuddyHighlights | null {
  const creatureRec = (byCollection.get("app.atbuddy.creature") ?? [])[0];
  const statsRec = (byCollection.get("app.atbuddy.stats") ?? [])[0];
  const interactions =
    byCollection.get("app.atbuddy.interaction") ?? [];
  if (!creatureRec && !statsRec && interactions.length === 0) return null;

  const interactionsByType = new Map<string, number>();
  for (const r of interactions) {
    const t = strOrNull(r.value.type) ?? "other";
    interactionsByType.set(t, (interactionsByType.get(t) ?? 0) + 1);
  }

  const creature = creatureRec
    ? {
        name: strOrUndef(creatureRec.value.name),
        species: strOrUndef(creatureRec.value.species),
        rarity: strOrUndef(creatureRec.value.rarity),
        isShiny:
          typeof creatureRec.value.isShiny === "boolean"
            ? (creatureRec.value.isShiny as boolean)
            : false,
      }
    : null;

  const stats = statsRec
    ? {
        xp: typeof statsRec.value.xp === "number" ? statsRec.value.xp : undefined,
        level:
          typeof statsRec.value.level === "number"
            ? statsRec.value.level
            : undefined,
        mood:
          typeof statsRec.value.mood === "number"
            ? statsRec.value.mood
            : undefined,
        energy:
          typeof statsRec.value.energy === "number"
            ? statsRec.value.energy
            : undefined,
        lastFedAt: parseDate(statsRec.value.lastFedAt),
        lastPettedAt: parseDate(statsRec.value.lastPettedAt),
      }
    : null;

  return {
    creature,
    stats,
    interactionsByType,
    totalInteractions: interactions.length,
  };
}

/* ---------------- Blue Place (pixel art) ---------------- */

export type Pixel = {
  x: number;
  y: number;
  color: number;
  note?: string;
  createdAt: Date | null;
};

export type BluePlaceHighlights = {
  total: number;
  uniqueColors: number;
  colorCounts: Map<number, number>;
  pixels: Pixel[];
  boundingBox?: { minX: number; minY: number; maxX: number; maxY: number };
};

export function getBluePlaceHighlights(
  byCollection: Map<string, RepoRecord[]>,
): BluePlaceHighlights | null {
  const records = byCollection.get("blue.place.pixel") ?? [];
  if (records.length === 0) return null;

  const pixels: Pixel[] = [];
  const colorCounts = new Map<number, number>();
  let minX = Infinity,
    minY = Infinity,
    maxX = -Infinity,
    maxY = -Infinity;
  for (const r of records) {
    const v = r.value;
    if (
      typeof v.x !== "number" ||
      typeof v.y !== "number" ||
      typeof v.color !== "number"
    ) {
      continue;
    }
    pixels.push({
      x: v.x,
      y: v.y,
      color: v.color,
      note: strOrUndef(v.note),
      createdAt: r.createdAt,
    });
    colorCounts.set(v.color, (colorCounts.get(v.color) ?? 0) + 1);
    if (v.x < minX) minX = v.x;
    if (v.x > maxX) maxX = v.x;
    if (v.y < minY) minY = v.y;
    if (v.y > maxY) maxY = v.y;
  }
  if (pixels.length === 0) return null;
  pixels.sort(
    (a, b) =>
      (b.createdAt?.getTime() ?? 0) - (a.createdAt?.getTime() ?? 0),
  );
  return {
    total: pixels.length,
    uniqueColors: colorCounts.size,
    colorCounts,
    pixels,
    boundingBox: { minX, minY, maxX, maxY },
  };
}

/**
 * Approximate blue.place palette (r/place-style 16 color index). Used to render
 * the color usage strip. Probably not perfectly accurate to the upstream app
 * but it's a recognizable rainbow.
 */
export const BLUE_PLACE_PALETTE: string[] = [
  "#ffffff",
  "#d4d4d4",
  "#888888",
  "#222222",
  "#ffa7d1",
  "#e50000",
  "#e59500",
  "#a06a42",
  "#e5d900",
  "#94e044",
  "#02be01",
  "#00d3dd",
  "#0083c7",
  "#0000ea",
  "#cf6ee4",
  "#820080",
];

export function bluePlaceColorHex(idx: number): string {
  return BLUE_PLACE_PALETTE[idx] ?? "#999999";
}

/* ---------------- Psky (chat) ---------------- */

export type PskyMessage = {
  content: string;
  room?: string;
  createdAt: Date | null;
};

export type PskyHighlights = {
  total: number;
  rooms: number;
  recent: PskyMessage[];
};

export function getPskyHighlights(
  byCollection: Map<string, RepoRecord[]>,
): PskyHighlights | null {
  const messages = byCollection.get("social.psky.chat.message") ?? [];
  if (messages.length === 0) return null;

  const rooms = new Set<string>();
  const parsed: PskyMessage[] = messages.map((r) => {
    const room = strOrUndef(r.value.room);
    if (room) rooms.add(room);
    return {
      content: strOrNull(r.value.content) ?? "",
      room,
      createdAt: r.createdAt,
    };
  });
  parsed.sort(
    (a, b) =>
      (b.createdAt?.getTime() ?? 0) - (a.createdAt?.getTime() ?? 0),
  );
  return {
    total: messages.length,
    rooms: rooms.size,
    recent: parsed.filter((m) => m.content).slice(0, 8),
  };
}

/* ---------------- YouAndMe (connections) ---------------- */

export type Connection = {
  subject: string;
  createdAt: Date | null;
};

export type YouAndMeHighlights = {
  total: number;
  connections: Connection[];
};

export function getYouAndMeHighlights(
  byCollection: Map<string, RepoRecord[]>,
): YouAndMeHighlights | null {
  const records = byCollection.get("at.youandme.connection") ?? [];
  if (records.length === 0) return null;
  const conns: Connection[] = records.map((r) => ({
    subject: strOrNull(r.value.subject) ?? "",
    createdAt: r.createdAt,
  }));
  conns.sort(
    (a, b) =>
      (b.createdAt?.getTime() ?? 0) - (a.createdAt?.getTime() ?? 0),
  );
  return { total: records.length, connections: conns.slice(0, 12) };
}

/* ---------------- Smoke Signal (events) ---------------- */

export type SmokeSignalEvent = {
  name: string;
  description?: string;
  createdAt: Date | null;
};

export type SmokeSignalRsvp = {
  status: string; // raw lex URI fragment, e.g. "#interested"
  eventUri?: string;
  createdAt: Date | null;
};

export type SmokeSignalHighlights = {
  eventsCreated: number;
  rsvps: number;
  rsvpsByStatus: Map<string, number>;
  hasProfile: boolean;
  events: SmokeSignalEvent[];
  recentRsvps: SmokeSignalRsvp[];
};

export function getSmokeSignalHighlights(
  byCollection: Map<string, RepoRecord[]>,
): SmokeSignalHighlights | null {
  const events =
    byCollection.get("events.smokesignal.calendar.event") ?? [];
  const rsvps =
    byCollection.get("events.smokesignal.calendar.rsvp") ?? [];
  const profiles =
    byCollection.get("events.smokesignal.app.profile") ?? [];
  // A profile by itself is just "I created an account" — don't render the
  // section unless there's actual activity (an event or an RSVP).
  if (events.length === 0 && rsvps.length === 0) return null;

  const rsvpsByStatus = new Map<string, number>();
  const parsedRsvps: SmokeSignalRsvp[] = rsvps.map((r) => {
    const status =
      strOrNull(r.value.status) ?? "events.smokesignal.calendar.rsvp#unknown";
    const short = status.split("#")[1] ?? "unknown";
    rsvpsByStatus.set(short, (rsvpsByStatus.get(short) ?? 0) + 1);
    const subject = r.value.subject as Record<string, unknown> | undefined;
    const eventUri = subject ? strOrUndef(subject.uri) : undefined;
    return { status: short, eventUri, createdAt: r.createdAt };
  });
  parsedRsvps.sort(
    (a, b) =>
      (b.createdAt?.getTime() ?? 0) - (a.createdAt?.getTime() ?? 0),
  );

  const parsedEvents: SmokeSignalEvent[] = events.map((r) => {
    const v = r.value;
    return {
      name:
        strOrNull(v.name) ??
        strOrNull(v.title) ??
        strOrNull(v.text) ??
        "Untitled event",
      description: strOrUndef(v.description),
      createdAt: r.createdAt,
    };
  });
  parsedEvents.sort(
    (a, b) =>
      (b.createdAt?.getTime() ?? 0) - (a.createdAt?.getTime() ?? 0),
  );

  return {
    eventsCreated: events.length,
    rsvps: rsvps.length,
    rsvpsByStatus,
    hasProfile: profiles.length > 0,
    events: parsedEvents.slice(0, 6),
    recentRsvps: parsedRsvps.slice(0, 6),
  };
}

/* ---------------- Sifa (identity/resume) ---------------- */

export type SifaSection = {
  kind: string;
  title: string;
  subtitle?: string;
  detail?: string;
  createdAt: Date | null;
};

export type SifaHighlights = {
  skills: number;
  certifications: number;
  positions: number;
  projects: number;
  education: number;
  honors: number;
  languages: number;
  courses: number;
  volunteering: number;
  sections: SifaSection[];
};

const SIFA_LEXICONS: Array<{ nsid: string; kind: string }> = [
  { nsid: "id.sifa.profile.skill", kind: "skill" },
  { nsid: "id.sifa.profile.certification", kind: "certification" },
  { nsid: "id.sifa.profile.position", kind: "position" },
  { nsid: "id.sifa.profile.project", kind: "project" },
  { nsid: "id.sifa.profile.education", kind: "education" },
  { nsid: "id.sifa.profile.honor", kind: "honor" },
  { nsid: "id.sifa.profile.language", kind: "language" },
  { nsid: "id.sifa.profile.course", kind: "course" },
  { nsid: "id.sifa.profile.volunteering", kind: "volunteering" },
];

export function getSifaHighlights(
  byCollection: Map<string, RepoRecord[]>,
): SifaHighlights | null {
  const counts: Record<string, number> = {};
  const sections: SifaSection[] = [];
  let any = false;
  for (const lex of SIFA_LEXICONS) {
    const records = byCollection.get(lex.nsid) ?? [];
    counts[lex.kind] = records.length;
    if (records.length > 0) any = true;
    for (const r of records) {
      const v = r.value;
      sections.push({
        kind: lex.kind,
        title:
          strOrNull(v.title) ??
          strOrNull(v.name) ??
          strOrNull(v.skill) ??
          strOrNull(v.language) ??
          "(untitled)",
        subtitle:
          strOrUndef(v.organization) ??
          strOrUndef(v.school) ??
          strOrUndef(v.institution) ??
          strOrUndef(v.company) ??
          strOrUndef(v.issuer),
        detail:
          strOrUndef(v.description) ??
          strOrUndef(v.summary) ??
          strOrUndef(v.role) ??
          strOrUndef(v.level) ??
          strOrUndef(v.proficiency),
        createdAt: r.createdAt,
      });
    }
  }
  if (!any) return null;
  sections.sort((a, b) => {
    if (a.kind !== b.kind) {
      const order = [
        "position",
        "education",
        "project",
        "certification",
        "skill",
        "honor",
        "course",
        "language",
        "volunteering",
      ];
      return order.indexOf(a.kind) - order.indexOf(b.kind);
    }
    return (b.createdAt?.getTime() ?? 0) - (a.createdAt?.getTime() ?? 0);
  });
  return {
    skills: counts.skill ?? 0,
    certifications: counts.certification ?? 0,
    positions: counts.position ?? 0,
    projects: counts.project ?? 0,
    education: counts.education ?? 0,
    honors: counts.honor ?? 0,
    languages: counts.language ?? 0,
    courses: counts.course ?? 0,
    volunteering: counts.volunteering ?? 0,
    sections: sections.slice(0, 14),
  };
}

/* ---------------- Hypha Spores ---------------- */

export type SporesHighlights = {
  takenFlowers: number;
  specialSpores: number;
  siteSections: number;
  hasSite: boolean;
};

export function getSporesHighlights(
  byCollection: Map<string, RepoRecord[]>,
): SporesHighlights | null {
  const taken =
    byCollection.get("coop.hypha.spores.social.takenFlower") ?? [];
  const special =
    byCollection.get("coop.hypha.spores.item.specialSpore") ?? [];
  const sections =
    byCollection.get("coop.hypha.spores.site.section") ?? [];
  const siteProfile =
    byCollection.get("coop.hypha.spores.site.profile") ?? [];
  if (
    taken.length === 0 &&
    special.length === 0 &&
    sections.length === 0 &&
    siteProfile.length === 0
  )
    return null;
  return {
    takenFlowers: taken.length,
    specialSpores: special.length,
    siteSections: sections.length,
    hasSite: siteProfile.length > 0,
  };
}

/* ---------------- helpers ---------------- */

function strOrNull(v: unknown): string | null {
  return typeof v === "string" && v.length > 0 ? v : null;
}

function strOrUndef(v: unknown): string | undefined {
  return typeof v === "string" && v.length > 0 ? v : undefined;
}

function parseDate(v: unknown): Date | null {
  if (typeof v !== "string") return null;
  const t = Date.parse(v);
  return Number.isNaN(t) ? null : new Date(t);
}

function normalize(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFKC")
    .replace(/[^a-z0-9]+/g, "");
}

type BlobRef = { ref: { $link: string }; mimeType?: string };

function pickBlob(v: unknown): BlobRef | undefined {
  if (!v || typeof v !== "object") return undefined;
  const candidate = v as Record<string, unknown>;
  const ref = candidate.ref as Record<string, unknown> | undefined;
  const link = ref?.["$link"];
  if (typeof link === "string") {
    return {
      ref: { $link: link },
      mimeType:
        typeof candidate.mimeType === "string"
          ? candidate.mimeType
          : undefined,
    };
  }
  return undefined;
}

function pickFirstImageInList(v: unknown): BlobRef | undefined {
  if (!Array.isArray(v)) return undefined;
  for (const item of v) {
    if (item && typeof item === "object") {
      const blob = pickBlob((item as Record<string, unknown>).image) ?? pickBlob(item);
      if (blob) return blob;
    }
  }
  return undefined;
}

function findFirstBlob(v: unknown): BlobRef | undefined {
  if (!v || typeof v !== "object" || Array.isArray(v)) return undefined;
  const direct = pickBlob(v);
  if (direct) return direct;
  for (const value of Object.values(v as Record<string, unknown>)) {
    if (Array.isArray(value)) {
      const inList = pickFirstImageInList(value);
      if (inList) return inList;
    } else if (value && typeof value === "object") {
      const nested = pickBlob(value) ?? findFirstBlob(value);
      if (nested) return nested;
    }
  }
  return undefined;
}

function blobUrl(
  pds: string,
  did: string,
  blob: BlobRef,
): string | undefined {
  const cid = blob.ref.$link;
  if (!cid) return undefined;
  return `${pds.replace(/\/$/, "")}/xrpc/com.atproto.sync.getBlob?did=${encodeURIComponent(did)}&cid=${encodeURIComponent(cid)}`;
}

function prettyKey(key: string): string {
  return key
    .replace(/[_-]+/g, " ")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/\s+/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .trim();
}

/** Strip Markdown formatting characters for short excerpts. Not perfect. */
function stripMarkdown(input: string): string {
  return input
    .replace(/!\[[^\]]*\]\([^)]*\)/g, "") // images
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1") // links → text
    .replace(/^#+\s+/gm, "") // headings
    .replace(/[`*_~>]/g, "") // bold/italic/strike markers
    .replace(/\s+/g, " ")
    .trim();
}

function stripHtml(input: string): string {
  if (!input.includes("<") && !input.includes("&")) return input.trim();
  if (typeof DOMParser === "undefined") {
    return input.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
  }
  const doc = new DOMParser().parseFromString(input, "text/html");
  const text = doc.body?.textContent ?? "";
  return text.replace(/\s+/g, " ").trim();
}
