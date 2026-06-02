export type Theme =
  | "pink"
  | "violet"
  | "lime"
  | "orange"
  | "cyan"
  | "yellow"
  | "mint"
  | "red"
  | "cobalt"
  | "ink";

export type CollectionDescriptor = {
  service: string;
  /** Bold label used as the giant typographic word on slides (e.g. "posts"). */
  word: string;
  /** A sentence built around the count (e.g. "You posted 12 times to Bluesky"). */
  headline: (n: number) => string;
  theme: Theme;
};

const KNOWN: Record<string, CollectionDescriptor> = {
  "app.bsky.feed.post": {
    service: "Bluesky",
    word: "posts",
    headline: (n) => `You posted ${fmt(n)} time${plural(n)} to Bluesky.`,
    theme: "cobalt",
  },
  "app.bsky.feed.like": {
    service: "Bluesky",
    word: "likes",
    headline: (n) => `You handed out ${fmt(n)} like${plural(n)} like candy.`,
    theme: "pink",
  },
  "app.bsky.feed.repost": {
    service: "Bluesky",
    word: "reposts",
    headline: (n) => `You reposted ${fmt(n)} time${plural(n)}.`,
    theme: "lime",
  },
  "app.bsky.graph.follow": {
    service: "Bluesky",
    word: "follows",
    headline: (n) => `You're following ${fmt(n)} ${n === 1 ? "person" : "people"}.`,
    theme: "violet",
  },
  "app.bsky.graph.block": {
    service: "Bluesky",
    word: "blocks",
    headline: (n) => `You blocked ${fmt(n)} account${plural(n)}. Boundaries, queen.`,
    theme: "ink",
  },
  "app.bsky.graph.list": {
    service: "Bluesky",
    word: "lists",
    headline: (n) => `You curated ${fmt(n)} list${plural(n)}.`,
    theme: "yellow",
  },
  "app.bsky.graph.listitem": {
    service: "Bluesky",
    word: "list adds",
    headline: (n) =>
      `You added ${fmt(n)} ${n === 1 ? "person" : "people"} to lists.`,
    theme: "yellow",
  },
  "app.bsky.graph.listblock": {
    service: "Bluesky",
    word: "list blocks",
    headline: (n) => `You blocked ${fmt(n)} list${plural(n)}.`,
    theme: "ink",
  },
  "app.bsky.graph.starterpack": {
    service: "Bluesky",
    word: "starter packs",
    headline: (n) => `You made ${fmt(n)} starter pack${plural(n)}.`,
    theme: "mint",
  },
  "app.bsky.graph.verification": {
    service: "Bluesky",
    word: "verifications",
    headline: (n) => `You verified ${fmt(n)} account${plural(n)}.`,
    theme: "cyan",
  },
  "app.bsky.feed.generator": {
    service: "Bluesky",
    word: "custom feeds",
    headline: (n) => `You built ${fmt(n)} custom feed${plural(n)}.`,
    theme: "cyan",
  },
  "app.bsky.feed.threadgate": {
    service: "Bluesky",
    word: "thread gates",
    headline: (n) => `${fmt(n)} thread${plural(n)} locked down.`,
    theme: "ink",
  },
  "app.bsky.feed.postgate": {
    service: "Bluesky",
    word: "post gates",
    headline: (n) => `${fmt(n)} post${plural(n)} locked down.`,
    theme: "ink",
  },
  "app.bsky.actor.profile": {
    service: "Bluesky",
    word: "profile",
    headline: () => `You set up your Bluesky profile.`,
    theme: "cobalt",
  },
  "chat.bsky.actor.declaration": {
    service: "Bluesky Chat",
    word: "DM settings",
    headline: () => `You set up Bluesky DMs.`,
    theme: "violet",
  },
  "app.rocksky.scrobble": {
    service: "Rocksky",
    word: "scrobbles",
    headline: (n) => `You scrobbled ${fmt(n)} song${plural(n)} on Rocksky.`,
    theme: "orange",
  },
  "app.rocksky.song": {
    service: "Rocksky",
    word: "songs",
    headline: (n) => `You logged ${fmt(n)} song${plural(n)} on Rocksky.`,
    theme: "orange",
  },
  "app.rocksky.album": {
    service: "Rocksky",
    word: "albums",
    headline: (n) => `You logged ${fmt(n)} album${plural(n)} on Rocksky.`,
    theme: "red",
  },
  "app.rocksky.artist": {
    service: "Rocksky",
    word: "artists",
    headline: (n) => `You logged ${fmt(n)} artist${plural(n)} on Rocksky.`,
    theme: "red",
  },
  "fm.teal.alpha.feed.play": {
    service: "TealFM",
    word: "plays",
    headline: (n) => `You listened to ${fmt(n)} song${plural(n)} on TealFM.`,
    theme: "mint",
  },
  "fm.teal.alpha.actor.status": {
    service: "TealFM",
    word: "status",
    headline: () => `You set a TealFM status.`,
    theme: "mint",
  },
  "blue.linkat.board": {
    service: "Linkat",
    word: "link board",
    headline: () => `You built a Linkat link board.`,
    theme: "cobalt",
  },
  "events.smokesignal.calendar.event": {
    service: "Smoke Signal",
    word: "events",
    headline: (n) => `You hosted ${fmt(n)} event${plural(n)} on Smoke Signal.`,
    theme: "red",
  },
  "events.smokesignal.calendar.rsvp": {
    service: "Smoke Signal",
    word: "RSVPs",
    headline: (n) => `You RSVP'd to ${fmt(n)} event${plural(n)}.`,
    theme: "red",
  },
  "events.smokesignal.app.profile": {
    service: "Smoke Signal",
    word: "profile",
    headline: () => `You set up Smoke Signal.`,
    theme: "red",
  },
  "social.pinksea.oekaki": {
    service: "Pinksea",
    word: "drawings",
    headline: (n) => `You drew ${fmt(n)} oekaki on Pinksea.`,
    theme: "pink",
  },
  "com.whtwnd.blog.entry": {
    service: "WhiteWind",
    word: "blog posts",
    headline: (n) => `You wrote ${fmt(n)} blog post${plural(n)} on WhiteWind.`,
    theme: "ink",
  },
  "com.shinolabs.pinksky.post": {
    service: "Pinksky",
    word: "photos",
    headline: (n) => `You shared ${fmt(n)} photo${plural(n)} on Pinksky.`,
    theme: "pink",
  },
  "fyi.unravel.frontpage.post": {
    service: "Frontpage",
    word: "submissions",
    headline: (n) => `You submitted ${fmt(n)} link${plural(n)} to Frontpage.`,
    theme: "orange",
  },
  "fyi.unravel.frontpage.comment": {
    service: "Frontpage",
    word: "comments",
    headline: (n) => `You left ${fmt(n)} comment${plural(n)} on Frontpage.`,
    theme: "orange",
  },
  "sh.tangled.repo": {
    service: "Tangled",
    word: "repos",
    headline: (n) => `You set up ${fmt(n)} repo${plural(n)} on Tangled.`,
    theme: "violet",
  },
  "sh.tangled.feed.star": {
    service: "Tangled",
    word: "stars",
    headline: (n) => `You starred ${fmt(n)} repo${plural(n)} on Tangled.`,
    theme: "violet",
  },
  "social.popfeed.feed.review": {
    service: "Popfeed",
    word: "reviews",
    headline: (n) => `You reviewed ${fmt(n)} thing${plural(n)} on Popfeed.`,
    theme: "yellow",
  },
  "social.popfeed.feed.list": {
    service: "Popfeed",
    word: "lists",
    headline: (n) => `You made ${fmt(n)} list${plural(n)} on Popfeed.`,
    theme: "yellow",
  },
  "place.stream.chat.message": {
    service: "Streamplace",
    word: "chats",
    headline: (n) => `You chatted ${fmt(n)} time${plural(n)} on Streamplace.`,
    theme: "cyan",
  },
  "place.stream.livestream": {
    service: "Streamplace",
    word: "streams",
    headline: (n) => `You streamed ${fmt(n)} time${plural(n)} on Streamplace.`,
    theme: "cyan",
  },
};

const DOMAIN_FALLBACK: Array<{
  prefix: string;
  service: string;
  theme: Theme;
}> = [
  { prefix: "app.bsky.", service: "Bluesky", theme: "cobalt" },
  { prefix: "chat.bsky.", service: "Bluesky Chat", theme: "violet" },
  { prefix: "app.rocksky.", service: "Rocksky", theme: "orange" },
  { prefix: "fm.teal.", service: "TealFM", theme: "mint" },
  { prefix: "social.pinksea.", service: "Pinksea", theme: "pink" },
  { prefix: "blue.linkat.", service: "Linkat", theme: "cobalt" },
  { prefix: "events.smokesignal.", service: "Smoke Signal", theme: "red" },
  { prefix: "com.whtwnd.", service: "WhiteWind", theme: "ink" },
  { prefix: "fyi.unravel.frontpage.", service: "Frontpage", theme: "orange" },
  { prefix: "com.shinolabs.pinksky.", service: "Pinksky", theme: "pink" },
  { prefix: "sh.tangled.", service: "Tangled", theme: "violet" },
  { prefix: "social.popfeed.", service: "Popfeed", theme: "yellow" },
  { prefix: "place.stream.", service: "Streamplace", theme: "cyan" },
  { prefix: "community.lexicon.", service: "Community", theme: "mint" },
  { prefix: "net.anisota.", service: "Anisota", theme: "lime" },
  { prefix: "id.sifa.", service: "Sifa", theme: "yellow" },
  { prefix: "fyi.asq.", service: "ASQ", theme: "cyan" },
  { prefix: "blue.badge.", service: "Blue Badge", theme: "cobalt" },
  { prefix: "dev.npmx.", service: "NPMX", theme: "red" },
  { prefix: "dev.keytrace.", service: "Keytrace", theme: "ink" },
  { prefix: "uk.skyblur.", service: "Skyblur", theme: "violet" },
  { prefix: "social.psky.", service: "Psky", theme: "pink" },
  { prefix: "site.standard.", service: "Standard", theme: "lime" },
  { prefix: "social.grain.", service: "Grain", theme: "mint" },
  { prefix: "cloud.tumbling.", service: "Tumbling", theme: "cyan" },
  { prefix: "blue.flashes.", service: "Flashes", theme: "yellow" },
  { prefix: "app.protoimsg.", service: "ProtoIMSG", theme: "violet" },
  { prefix: "fm.plyr.", service: "Plyr", theme: "mint" },
  { prefix: "space.roomy.", service: "Roomy", theme: "lime" },
  { prefix: "app.atbuddy.", service: "ATBuddy", theme: "pink" },
  { prefix: "com.imlunahey.", service: "imlunahey", theme: "violet" },
  { prefix: "com.germnetwork.", service: "Germ", theme: "red" },
  { prefix: "actor.rpg.", service: "RPG", theme: "yellow" },
  { prefix: "equipment.rpg.", service: "RPG", theme: "yellow" },
];

const ROTATION: Theme[] = [
  "pink",
  "violet",
  "lime",
  "orange",
  "cyan",
  "yellow",
  "mint",
  "red",
  "cobalt",
];

export function describeCollection(
  nsid: string,
  fallbackIndex = 0,
): CollectionDescriptor {
  const known = KNOWN[nsid];
  if (known) return known;

  const domain = DOMAIN_FALLBACK.find((d) => nsid.startsWith(d.prefix));
  const service = domain?.service ?? prettyDomain(nsid);
  const theme = domain?.theme ?? ROTATION[fallbackIndex % ROTATION.length];
  const action = (nsid.split(".").slice(-1)[0] ?? "record").replace(/[_-]/g, " ");

  return {
    service,
    word: action + (action.endsWith("s") ? "" : "s"),
    theme,
    headline: (n) =>
      `You created ${fmt(n)} ${action}${plural(n)} on ${service}.`,
  };
}

function prettyDomain(nsid: string): string {
  const parts = nsid.split(".");
  if (parts.length < 2) return nsid;
  return parts.slice(0, 2).reverse().join(".");
}

function fmt(n: number) {
  return n.toLocaleString();
}

function plural(n: number) {
  return n === 1 ? "" : "s";
}

export type ThemeStyle = {
  bg: string;
  fg: string;
  muted: string;
  chip: string;
  chipFg: string;
};

export const THEME_STYLES: Record<Theme, ThemeStyle> = {
  pink: {
    bg: "bg-wrap-pink",
    fg: "text-ink",
    muted: "text-ink/65",
    chip: "bg-ink",
    chipFg: "text-wrap-pink",
  },
  violet: {
    bg: "bg-wrap-violet",
    fg: "text-cream",
    muted: "text-cream/70",
    chip: "bg-cream",
    chipFg: "text-wrap-violet",
  },
  lime: {
    bg: "bg-wrap-lime",
    fg: "text-ink",
    muted: "text-ink/65",
    chip: "bg-ink",
    chipFg: "text-wrap-lime",
  },
  orange: {
    bg: "bg-wrap-orange",
    fg: "text-ink",
    muted: "text-ink/65",
    chip: "bg-ink",
    chipFg: "text-wrap-orange",
  },
  cyan: {
    bg: "bg-wrap-cyan",
    fg: "text-ink",
    muted: "text-ink/65",
    chip: "bg-ink",
    chipFg: "text-wrap-cyan",
  },
  yellow: {
    bg: "bg-wrap-yellow",
    fg: "text-ink",
    muted: "text-ink/65",
    chip: "bg-ink",
    chipFg: "text-wrap-yellow",
  },
  mint: {
    bg: "bg-wrap-mint",
    fg: "text-ink",
    muted: "text-ink/65",
    chip: "bg-ink",
    chipFg: "text-wrap-mint",
  },
  red: {
    bg: "bg-wrap-red",
    fg: "text-cream",
    muted: "text-cream/70",
    chip: "bg-cream",
    chipFg: "text-wrap-red",
  },
  cobalt: {
    bg: "bg-wrap-cobalt",
    fg: "text-cream",
    muted: "text-cream/70",
    chip: "bg-cream",
    chipFg: "text-wrap-cobalt",
  },
  ink: {
    bg: "bg-ink",
    fg: "text-cream",
    muted: "text-cream/60",
    chip: "bg-cream",
    chipFg: "text-ink",
  },
};
