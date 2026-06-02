import { Fragment, useMemo, useState, type ReactNode } from "react";
import type { RepoRecord, RepoStats } from "../lib/atproto";
import { describeCollection } from "../lib/labels";
import { shareWrappedUrl } from "../lib/shareUrl";
import {
  getAnisotaHighlights,
  getAtBuddyHighlights,
  getAtsumeatHighlights,
  getBluePlaceHighlights,
  getBlueskyHighlights,
  getDrydownHighlights,
  getFlashesHighlights,
  getFlushingHighlights,
  getFrontpageHighlights,
  getGamesHighlights,
  getGrainHighlights,
  getMusicHighlights,
  getPopfeedHighlights,
  getPskyHighlights,
  getReadingHighlights,
  getRpgHighlights,
  getSifaHighlights,
  getSmokeSignalHighlights,
  getSporesHighlights,
  getStatusHighlights,
  getStreamplaceHighlights,
  getTangledHighlights,
  getYouAndMeHighlights,
  isFeaturedNsid,
  isSkippedNsid,
} from "../lib/featured";
import { getHighFiveHighlights } from "../lib/highlights/highFive";
import { getAtVouchHighlights } from "../lib/highlights/atvouch";
import { getAtPokeHighlights } from "../lib/highlights/atpoke";
import { getSparksHighlights } from "../lib/highlights/sparks";
import { getBlipsHighlights } from "../lib/highlights/blips";
import { getAsqHighlights } from "../lib/highlights/asq";
import { getIntrosHighlights } from "../lib/highlights/intros";
import { getStickersHighlights } from "../lib/highlights/stickers";
import { getBadgesHighlights } from "../lib/highlights/badges";
import { getWishlistHighlights } from "../lib/highlights/registry";
import { getMadebydannyCdnHighlights } from "../lib/highlights/madebydannyCdn";
import { getFlobitImagesHighlights } from "../lib/highlights/flobitImages";
import { getSonaskyHighlights } from "../lib/highlights/sonasky";
import { getSimocracyHighlights } from "../lib/highlights/simocracy";
import { getAtToDoHighlights } from "../lib/highlights/attodo";
import { getSkyboardHighlights } from "../lib/highlights/skyboard";
import { getCosmikHighlights } from "../lib/highlights/cosmik";
import { getAtGuildsHighlights } from "../lib/highlights/atguilds";
import { getLinkringHighlights } from "../lib/highlights/linkring";
import { getAtCircleHighlights } from "../lib/highlights/atcircle";
import { getRankthatHighlights } from "../lib/highlights/rankthat";
import { getSidetrailHighlights } from "../lib/highlights/sidetrail";
import { getSkytalkHighlights } from "../lib/highlights/skytalk";
import { getTokimekiPollsHighlights } from "../lib/highlights/tokimekiPolls";
import { getStandardDocsHighlights } from "../lib/highlights/standardDocs";
import { getWispHighlights } from "../lib/highlights/wisp";
import { getVibeMealHighlights } from "../lib/highlights/vibeMeal";
import { getAtStoreHighlights } from "../lib/highlights/atstore";
import { getBrewsHighlights } from "../lib/highlights/brews";
import { getCalendarHighlights } from "../lib/highlights/calendar";
import { getNpmxHighlights } from "../lib/highlights/npmx";
import { getMarqueHighlights } from "../lib/highlights/marque";
import { getAtlasHighlights } from "../lib/highlights/atlas";
import { getPollenHighlights } from "../lib/highlights/pollen";
import { getAtmosHighlights } from "../lib/highlights/atmos";
import { getAiConsentHighlights } from "../lib/highlights/aiConsent";
import { getProtoimsgHighlights } from "../lib/highlights/protoimsg";
import { getKeytraceHighlights } from "../lib/highlights/keytrace";
import { getEndorseHighlights } from "../lib/highlights/endorse";
import { getFundingHighlights } from "../lib/highlights/funding";
import { getBlackskyHighlights } from "../lib/highlights/blacksky";
import { getFledglingsHighlights } from "../lib/highlights/fledglings";
import { getAtRoomHighlights } from "../lib/highlights/atroom";
import { getBlentoHighlights } from "../lib/highlights/blento";
import { getSlidesHighlights } from "../lib/highlights/slides";
import { StickyNav } from "./wrapped/Nav";
import { IntroSlide } from "./wrapped/Intro";
import { TailSection } from "./wrapped/Tail";
import { FooterStrip } from "./wrapped/Footer";
import type { SectionTheme } from "./featured/_theme";
import { FeaturedBlueskySection } from "./featured/Bluesky";
import { FeaturedMusicSection } from "./featured/Music";
import { FeaturedPopfeedSection } from "./featured/Popfeed";
import { FeaturedFlashesSection } from "./featured/Flashes";
import { FeaturedGrainSection } from "./featured/Grain";
import { FeaturedReadingSection } from "./featured/Reading";
import { FeaturedSifaSection } from "./featured/Sifa";
import { FeaturedStatusSection } from "./featured/Status";
import { FeaturedPskySection } from "./featured/Psky";
import { FeaturedStreamplaceSection } from "./featured/Streamplace";
import { FeaturedTangledSection } from "./featured/Tangled";
import { FeaturedAnisotaSection } from "./featured/Anisota";
import { FeaturedGamesSection } from "./featured/Games";
import { FeaturedRpgSection } from "./featured/Rpg";
import { FeaturedAtBuddySection } from "./featured/AtBuddy";
import { FeaturedAtsumeatSection } from "./featured/Atsumeat";
import { FeaturedBluePlaceSection } from "./featured/BluePlace";
import { FeaturedSporesSection } from "./featured/Spores";
import { FeaturedSmokeSignalSection } from "./featured/SmokeSignal";
import { FeaturedYouAndMeSection } from "./featured/YouAndMe";
import { FeaturedDrydownSection } from "./featured/Drydown";
import { FeaturedFrontpageSection } from "./featured/Frontpage";
import { FeaturedFlushingSection } from "./featured/Flushing";
import { FeaturedHighFiveSection } from "./featured/HighFive";
import { FeaturedAtVouchSection } from "./featured/AtVouch";
import { FeaturedAtPokeSection } from "./featured/AtPoke";
import { FeaturedSparksSection } from "./featured/Sparks";
import { FeaturedBlipsSection } from "./featured/Blips";
import { FeaturedAsqSection } from "./featured/Asq";
import { FeaturedIntrosSection } from "./featured/Intros";
import { FeaturedStickersSection } from "./featured/Stickers";
import { FeaturedBadgesSection } from "./featured/Badges";
import { FeaturedWishlistSection } from "./featured/Wishlist";
import { FeaturedMadebydannyCdnSection } from "./featured/MadebydannyCdn";
import { FeaturedFlobitImagesSection } from "./featured/FlobitImages";
import { FeaturedSonaskySection } from "./featured/Sonasky";
import { FeaturedSimocracySection } from "./featured/Simocracy";
import { FeaturedAtToDoSection } from "./featured/AtToDo";
import { FeaturedSkyboardSection } from "./featured/Skyboard";
import { FeaturedCosmikSection } from "./featured/Cosmik";
import { FeaturedAtGuildsSection } from "./featured/AtGuilds";
import { FeaturedLinkringSection } from "./featured/Linkring";
import { FeaturedAtCircleSection } from "./featured/AtCircle";
import { FeaturedRankthatSection } from "./featured/Rankthat";
import { FeaturedSidetrailSection } from "./featured/Sidetrail";
import { FeaturedSkytalkSection } from "./featured/Skytalk";
import { FeaturedTokimekiPollsSection } from "./featured/TokimekiPolls";
import { FeaturedStandardDocsSection } from "./featured/StandardDocs";
import { FeaturedWispSection } from "./featured/Wisp";
import { FeaturedVibeMealSection } from "./featured/VibeMeal";
import { FeaturedAtStoreSection } from "./featured/AtStore";
import { FeaturedBrewsSection } from "./featured/Brews";
import { FeaturedCalendarSection } from "./featured/Calendar";
import { FeaturedNpmxSection } from "./featured/Npmx";
import { FeaturedMarqueSection } from "./featured/Marque";
import { FeaturedAtlasSection } from "./featured/Atlas";
import { FeaturedPollenSection } from "./featured/Pollen";
import { FeaturedAtmosSection } from "./featured/Atmos";
import { FeaturedAiConsentSection } from "./featured/AiConsent";
import { FeaturedProtoimsgSection } from "./featured/Protoimsg";
import { FeaturedKeytraceSection } from "./featured/Keytrace";
import { FeaturedEndorseSection } from "./featured/Endorse";
import { FeaturedFundingSection } from "./featured/Funding";
import { FeaturedBlackskySection } from "./featured/Blacksky";
import { FeaturedFledglingsSection } from "./featured/Fledglings";
import { FeaturedAtRoomSection } from "./featured/AtRoom";
import { FeaturedBlentoSection } from "./featured/Blento";
import { FeaturedSlidesSection } from "./featured/Slides";

type Bucket = { nsid: string; count: number };

function countForPrefixes(buckets: Bucket[], prefixes: string[]): number {
  let sum = 0;
  for (const b of buckets) {
    if (prefixes.some((p) => b.nsid.startsWith(p))) sum += b.count;
  }
  return sum;
}

export function Wrapped({ stats }: { stats: RepoStats }) {
  const availableYears = useMemo(() => {
    const years = new Set<number>();
    for (const records of stats.byCollection.values()) {
      for (const r of records) {
        if (r.createdAt) years.add(r.createdAt.getFullYear());
      }
    }
    return Array.from(years).sort((a, b) => b - a);
  }, [stats]);

  const [year, setYear] = useState<number | "all">("all");

  const filteredStats: RepoStats = useMemo(() => {
    if (year === "all") return stats;
    const filtered = new Map<string, RepoRecord[]>();
    let totalRecords = 0;
    let firstRecordAt: Date | null = null;
    let latestRecordAt: Date | null = null;
    for (const [nsid, recs] of stats.byCollection) {
      const inYear = recs.filter(
        (r) => r.createdAt && r.createdAt.getFullYear() === year,
      );
      if (inYear.length === 0) continue;
      filtered.set(nsid, inYear);
      totalRecords += inYear.length;
      for (const r of inYear) {
        if (!r.createdAt) continue;
        if (!firstRecordAt || r.createdAt < firstRecordAt)
          firstRecordAt = r.createdAt;
        if (!latestRecordAt || r.createdAt > latestRecordAt)
          latestRecordAt = r.createdAt;
      }
    }
    // Approximate the year's slice of the CAR by ratio. The CAR file
    // isn't a per-record breakdown, so we can't compute it exactly, but
    // records × bytes-per-record is close enough for the "MB life on
    // the open web" headline.
    const carBytes =
      stats.totalRecords > 0
        ? Math.round((stats.carBytes * totalRecords) / stats.totalRecords)
        : 0;
    return {
      ...stats,
      byCollection: filtered,
      totalRecords,
      firstRecordAt,
      latestRecordAt,
      carBytes,
    };
  }, [stats, year]);

  const allBuckets = Array.from(filteredStats.byCollection.entries())
    .map(([nsid, records], idx) => {
      const descriptor = describeCollection(nsid, idx);
      return { nsid, records, count: records.length, descriptor };
    })
    .sort((a, b) => b.count - a.count);

  // Anything featured OR explicitly skipped (protocol/declaration noise
  // like com.germnetwork.keyPackage) is removed from the long-tail list.
  // Everything else lands in the long-tail — we don't render the auto-
  // generated "You created N Xs on Y" big slides or bento cards anymore
  // because the auto-pluralization ("statuss", "ais", "communitys") looks
  // bad and the data isn't rich enough to warrant a hero treatment.
  const tail = allBuckets.filter(
    (b) => !isFeaturedNsid(b.nsid) && !isSkippedNsid(b.nsid),
  );

  const services = new Map<string, number>();
  for (const b of allBuckets) {
    services.set(
      b.descriptor.service,
      (services.get(b.descriptor.service) ?? 0) + b.count,
    );
  }
  const topServices = Array.from(services.entries()).sort(
    (a, b) => b[1] - a[1],
  );

  // Build feature highlights
  const bluesky = getBlueskyHighlights(filteredStats.byCollection);
  const music = getMusicHighlights(filteredStats.byCollection);
  const popfeed = getPopfeedHighlights(filteredStats.byCollection);
  const grain = getGrainHighlights(filteredStats);
  const tangled = getTangledHighlights(filteredStats.byCollection);
  const streamplace = getStreamplaceHighlights(filteredStats.byCollection);
  const rpg = getRpgHighlights(filteredStats);
  const anisota = getAnisotaHighlights(filteredStats.byCollection);
  const games = getGamesHighlights(filteredStats.byCollection);
  const flashes = getFlashesHighlights(filteredStats);
  const reading = getReadingHighlights(filteredStats.byCollection);
  const flushing = getFlushingHighlights(filteredStats.byCollection);
  const frontpage = getFrontpageHighlights(filteredStats.byCollection);
  const drydown = getDrydownHighlights(filteredStats);
  const status = getStatusHighlights(filteredStats.byCollection);
  const atsumeat = getAtsumeatHighlights(filteredStats.byCollection);
  const atbuddy = getAtBuddyHighlights(filteredStats.byCollection);
  const bluePlace = getBluePlaceHighlights(filteredStats.byCollection);
  const psky = getPskyHighlights(filteredStats.byCollection);
  const youandme = getYouAndMeHighlights(filteredStats.byCollection);
  const smokesignal = getSmokeSignalHighlights(filteredStats.byCollection);
  const sifa = getSifaHighlights(filteredStats.byCollection);
  const spores = getSporesHighlights(filteredStats.byCollection);
  const highFive = getHighFiveHighlights(filteredStats.byCollection);
  const atvouch = getAtVouchHighlights(filteredStats.byCollection);
  const atpoke = getAtPokeHighlights(filteredStats.byCollection);
  const sparks = getSparksHighlights(filteredStats.byCollection);
  const blips = getBlipsHighlights(filteredStats.byCollection);
  const asq = getAsqHighlights(filteredStats.byCollection);
  const intros = getIntrosHighlights(filteredStats.byCollection);
  const stickers = getStickersHighlights(filteredStats);
  const badges = getBadgesHighlights(filteredStats);
  const wishlist = getWishlistHighlights(filteredStats);
  const madebydannyCdn = getMadebydannyCdnHighlights(filteredStats);
  const flobitImages = getFlobitImagesHighlights(filteredStats);
  const sonasky = getSonaskyHighlights(filteredStats);
  const simocracy = getSimocracyHighlights(filteredStats);
  const attodo = getAtToDoHighlights(filteredStats.byCollection);
  const skyboard = getSkyboardHighlights(filteredStats.byCollection);
  const cosmik = getCosmikHighlights(filteredStats.byCollection);
  const atguilds = getAtGuildsHighlights(filteredStats.byCollection);
  const linkring = getLinkringHighlights(filteredStats.byCollection);
  const atcircle = getAtCircleHighlights(filteredStats.byCollection);
  const rankthat = getRankthatHighlights(filteredStats.byCollection);
  const sidetrail = getSidetrailHighlights(filteredStats.byCollection);
  const skytalk = getSkytalkHighlights(filteredStats.byCollection);
  const tokimekiPolls = getTokimekiPollsHighlights(filteredStats.byCollection);
  const standardDocs = getStandardDocsHighlights(filteredStats.byCollection);
  const wisp = getWispHighlights(filteredStats.byCollection);
  const vibeMeal = getVibeMealHighlights(filteredStats.byCollection);
  const atstore = getAtStoreHighlights(filteredStats.byCollection);
  const brews = getBrewsHighlights(filteredStats.byCollection);
  const calendar = getCalendarHighlights(filteredStats.byCollection);
  const npmx = getNpmxHighlights(filteredStats.byCollection);
  const marque = getMarqueHighlights(filteredStats.byCollection);
  const atlas = getAtlasHighlights(filteredStats.byCollection);
  const pollen = getPollenHighlights(filteredStats.byCollection);
  const atmos = getAtmosHighlights(filteredStats.byCollection);
  const aiConsent = getAiConsentHighlights(filteredStats.byCollection);
  const protoimsg = getProtoimsgHighlights(filteredStats.byCollection);
  const keytrace = getKeytraceHighlights(filteredStats.byCollection);
  const endorse = getEndorseHighlights(filteredStats.byCollection);
  const funding = getFundingHighlights(filteredStats.byCollection);
  const blacksky = getBlackskyHighlights(filteredStats.byCollection);
  const fledglings = getFledglingsHighlights(filteredStats.byCollection);
  const atroom = getAtRoomHighlights(filteredStats);
  const blento = getBlentoHighlights(filteredStats.byCollection);
  const slides = getSlidesHighlights(filteredStats.byCollection);

  // Build the spotlight list — each entry is a featured section that only
  // appears when its highlight is non-null. We then sort by how many records
  // the user has under that service, so the spotlight order reflects what
  // each individual person actually does most (rather than always opening
  // with Bluesky).
  type Feature = {
    key: string;
    count: number;
    theme: SectionTheme;
    render: (theme?: SectionTheme) => ReactNode;
  };
  const candidates: Array<{
    key: string;
    show: boolean;
    prefixes: string[];
    theme: SectionTheme;
    render: (theme?: SectionTheme) => ReactNode;
  }> = [
    { key: "bluesky", show: !!bluesky, prefixes: ["app.bsky.", "chat.bsky."], theme: "cobalt", render: (theme?: SectionTheme) => bluesky ? <FeaturedBlueskySection theme={theme} data={bluesky} /> : null },
    { key: "music", show: !!music, prefixes: ["app.rocksky.", "fm.teal.", "fm.plyr."], theme: "orange", render: (theme?: SectionTheme) => music ? <FeaturedMusicSection theme={theme} data={music} /> : null },
    { key: "popfeed", show: !!popfeed, prefixes: ["social.popfeed."], theme: "yellow", render: (theme?: SectionTheme) => popfeed ? <FeaturedPopfeedSection theme={theme} data={popfeed} did={stats.did} /> : null },
    { key: "flashes", show: !!flashes, prefixes: ["blue.flashes."], theme: "pink", render: (theme?: SectionTheme) => flashes ? <FeaturedFlashesSection theme={theme} data={flashes} /> : null },
    { key: "grain", show: !!grain, prefixes: ["social.grain."], theme: "mint", render: (theme?: SectionTheme) => grain ? <FeaturedGrainSection theme={theme} data={grain} /> : null },
    { key: "reading", show: !!reading, prefixes: ["com.whtwnd.", "buzz.bookhive.", "pub.leaflet.", "at.margin.", "at.monomarks.", "my.skylights.", "app.greengale.publication", "app.offprint.publication", "blog.pckt."], theme: "violet", render: (theme?: SectionTheme) => reading ? <FeaturedReadingSection theme={theme} data={reading} /> : null },
    { key: "standardDocs", show: !!standardDocs, prefixes: ["site.standard."], theme: "cyan", render: (theme?: SectionTheme) => standardDocs ? <FeaturedStandardDocsSection theme={theme} data={standardDocs} /> : null },
    { key: "sifa", show: !!sifa, prefixes: ["id.sifa."], theme: "pink", render: (theme?: SectionTheme) => sifa ? <FeaturedSifaSection theme={theme} data={sifa} /> : null },
    { key: "status", show: !!status, prefixes: ["is.dame.", "xyz.statusphere.", "vg.nat.istat.", "social.kibun.", "io.zzstoatzz.status."], theme: "violet", render: (theme?: SectionTheme) => status ? <FeaturedStatusSection theme={theme} data={status} /> : null },
    { key: "psky", show: !!psky, prefixes: ["social.psky."], theme: "cyan", render: (theme?: SectionTheme) => psky ? <FeaturedPskySection theme={theme} data={psky} /> : null },
    { key: "streamplace", show: !!streamplace, prefixes: ["place.stream."], theme: "cyan", render: (theme?: SectionTheme) => streamplace ? <FeaturedStreamplaceSection theme={theme} data={streamplace} /> : null },
    { key: "tangled", show: !!tangled, prefixes: ["sh.tangled."], theme: "violet", render: (theme?: SectionTheme) => tangled ? <FeaturedTangledSection theme={theme} data={tangled} /> : null },
    { key: "anisota", show: !!anisota, prefixes: ["net.anisota."], theme: "lime", render: (theme?: SectionTheme) => anisota ? <FeaturedAnisotaSection theme={theme} data={anisota} /> : null },
    { key: "games", show: !!games, prefixes: ["blue.2048.", "games.firehose.", "farm.smol.games.", "tools.atp.", "com.imlunahey.leaderboard.", "app.mathr.", "blue.checkmate.", "blue.atplay."], theme: "red", render: (theme?: SectionTheme) => games ? <FeaturedGamesSection theme={theme} data={games} /> : null },
    { key: "rpg", show: !!rpg, prefixes: ["actor.rpg.", "equipment.rpg."], theme: "lime", render: (theme?: SectionTheme) => rpg ? <FeaturedRpgSection theme={theme} data={rpg} /> : null },
    { key: "atbuddy", show: !!atbuddy, prefixes: ["app.atbuddy."], theme: "pink", render: (theme?: SectionTheme) => atbuddy ? <FeaturedAtBuddySection theme={theme} data={atbuddy} /> : null },
    { key: "atsumeat", show: !!atsumeat, prefixes: ["com.suibari.atsumeat."], theme: "yellow", render: (theme?: SectionTheme) => atsumeat ? <FeaturedAtsumeatSection theme={theme} data={atsumeat} /> : null },
    { key: "stickers", show: !!stickers, prefixes: ["boo.sky."], theme: "pink", render: (theme?: SectionTheme) => stickers ? <FeaturedStickersSection theme={theme} data={stickers} /> : null },
    { key: "badges", show: !!badges, prefixes: ["blue.badge.", "community.lexicon.badge."], theme: "cobalt", render: (theme?: SectionTheme) => badges ? <FeaturedBadgesSection theme={theme} data={badges} /> : null },
    { key: "bluePlace", show: !!bluePlace, prefixes: ["blue.place."], theme: "cobalt", render: (theme?: SectionTheme) => bluePlace ? <FeaturedBluePlaceSection theme={theme} data={bluePlace} /> : null },
    { key: "spores", show: !!spores, prefixes: ["coop.hypha.spores."], theme: "mint", render: (theme?: SectionTheme) => spores ? <FeaturedSporesSection theme={theme} data={spores} /> : null },
    { key: "smokesignal", show: !!smokesignal, prefixes: ["events.smokesignal."], theme: "red", render: (theme?: SectionTheme) => smokesignal ? <FeaturedSmokeSignalSection theme={theme} data={smokesignal} /> : null },
    { key: "calendar", show: !!calendar, prefixes: ["community.lexicon.calendar."], theme: "violet", render: (theme?: SectionTheme) => calendar ? <FeaturedCalendarSection theme={theme} data={calendar} /> : null },
    { key: "youandme", show: !!youandme, prefixes: ["at.youandme."], theme: "pink", render: (theme?: SectionTheme) => youandme ? <FeaturedYouAndMeSection theme={theme} data={youandme} /> : null },
    { key: "highFive", show: !!highFive, prefixes: ["com.atprotofans.high-five."], theme: "lime", render: (theme?: SectionTheme) => highFive ? <FeaturedHighFiveSection theme={theme} data={highFive} /> : null },
    { key: "atvouch", show: !!atvouch, prefixes: ["dev.atvouch."], theme: "violet", render: (theme?: SectionTheme) => atvouch ? <FeaturedAtVouchSection theme={theme} data={atvouch} /> : null },
    { key: "atpoke", show: !!atpoke, prefixes: ["xyz.atpoke."], theme: "pink", render: (theme?: SectionTheme) => atpoke ? <FeaturedAtPokeSection theme={theme} data={atpoke} /> : null },
    { key: "intros", show: !!intros, prefixes: ["com.skybemoreblue."], theme: "pink", render: (theme?: SectionTheme) => intros ? <FeaturedIntrosSection theme={theme} data={intros} /> : null },
    { key: "sparks", show: !!sparks, prefixes: ["tech.tokimeki.takibi."], theme: "orange", render: (theme?: SectionTheme) => sparks ? <FeaturedSparksSection theme={theme} data={sparks} /> : null },
    { key: "blips", show: !!blips, prefixes: ["stream.thought."], theme: "cyan", render: (theme?: SectionTheme) => blips ? <FeaturedBlipsSection theme={theme} data={blips} /> : null },
    { key: "asq", show: !!asq, prefixes: ["fyi.asq."], theme: "mint", render: (theme?: SectionTheme) => asq ? <FeaturedAsqSection theme={theme} data={asq} /> : null },
    { key: "drydown", show: !!drydown, prefixes: ["social.drydown."], theme: "pink", render: (theme?: SectionTheme) => drydown ? <FeaturedDrydownSection theme={theme} data={drydown} /> : null },
    { key: "frontpage", show: !!frontpage, prefixes: ["fyi.unravel.frontpage."], theme: "orange", render: (theme?: SectionTheme) => frontpage ? <FeaturedFrontpageSection theme={theme} data={frontpage} /> : null },
    { key: "flushing", show: !!flushing, prefixes: ["im.flushing."], theme: "yellow", render: (theme?: SectionTheme) => flushing ? <FeaturedFlushingSection theme={theme} data={flushing} /> : null },
    { key: "sidetrail", show: !!sidetrail, prefixes: ["app.sidetrail."], theme: "lime", render: (theme?: SectionTheme) => sidetrail ? <FeaturedSidetrailSection theme={theme} data={sidetrail} /> : null },
    { key: "tokimekiPolls", show: !!tokimekiPolls, prefixes: ["tech.tokimeki.poll.", "app.reddwarf.embed.poll"], theme: "orange", render: (theme?: SectionTheme) => tokimekiPolls ? <FeaturedTokimekiPollsSection theme={theme} data={tokimekiPolls} /> : null },
    { key: "wishlist", show: !!wishlist, prefixes: ["blue.registry."], theme: "yellow", render: (theme?: SectionTheme) => wishlist ? <FeaturedWishlistSection theme={theme} data={wishlist} /> : null },
    { key: "atstore", show: !!atstore, prefixes: ["fyi.atstore."], theme: "pink", render: (theme?: SectionTheme) => atstore ? <FeaturedAtStoreSection theme={theme} data={atstore} /> : null },
    { key: "atguilds", show: !!atguilds, prefixes: ["dev.jakestout.atguilds."], theme: "yellow", render: (theme?: SectionTheme) => atguilds ? <FeaturedAtGuildsSection theme={theme} data={atguilds} /> : null },
    { key: "linkring", show: !!linkring, prefixes: ["lol.linkring.", "me.linkna.", "link.woosh."], theme: "pink", render: (theme?: SectionTheme) => linkring ? <FeaturedLinkringSection theme={theme} data={linkring} /> : null },
    { key: "atcircle", show: !!atcircle, prefixes: ["net.asadaame5121.at-circle."], theme: "mint", render: (theme?: SectionTheme) => atcircle ? <FeaturedAtCircleSection theme={theme} data={atcircle} /> : null },
    { key: "rankthat", show: !!rankthat, prefixes: ["net.rankthat."], theme: "orange", render: (theme?: SectionTheme) => rankthat ? <FeaturedRankthatSection theme={theme} data={rankthat} /> : null },
    { key: "cosmik", show: !!cosmik, prefixes: ["network.cosmik."], theme: "lime", render: (theme?: SectionTheme) => cosmik ? <FeaturedCosmikSection theme={theme} data={cosmik} /> : null },
    { key: "attodo", show: !!attodo, prefixes: ["app.attodo."], theme: "cyan", render: (theme?: SectionTheme) => attodo ? <FeaturedAtToDoSection theme={theme} data={attodo} /> : null },
    { key: "skyboard", show: !!skyboard, prefixes: ["dev.skyboard."], theme: "violet", render: (theme?: SectionTheme) => skyboard ? <FeaturedSkyboardSection theme={theme} data={skyboard} /> : null },
    { key: "skytalk", show: !!skytalk, prefixes: ["blue.skytalk."], theme: "cobalt", render: (theme?: SectionTheme) => skytalk ? <FeaturedSkytalkSection theme={theme} data={skytalk} /> : null },
    { key: "madebydannyCdn", show: !!madebydannyCdn, prefixes: ["uk.madebydanny."], theme: "mint", render: (theme?: SectionTheme) => madebydannyCdn ? <FeaturedMadebydannyCdnSection theme={theme} data={madebydannyCdn} /> : null },
    { key: "flobitImages", show: !!flobitImages, prefixes: ["dev.flo-bit."], theme: "cyan", render: (theme?: SectionTheme) => flobitImages ? <FeaturedFlobitImagesSection theme={theme} data={flobitImages} /> : null },
    { key: "sonasky", show: !!sonasky, prefixes: ["app.sonasky."], theme: "violet", render: (theme?: SectionTheme) => sonasky ? <FeaturedSonaskySection theme={theme} data={sonasky} /> : null },
    { key: "simocracy", show: !!simocracy, prefixes: ["org.simocracy."], theme: "red", render: (theme?: SectionTheme) => simocracy ? <FeaturedSimocracySection theme={theme} data={simocracy} /> : null },
    { key: "wisp", show: !!wisp, prefixes: ["place.wisp."], theme: "yellow", render: (theme?: SectionTheme) => wisp ? <FeaturedWispSection theme={theme} data={wisp} /> : null },
    { key: "vibeMeal", show: !!vibeMeal, prefixes: ["com.vibe-coded."], theme: "red", render: (theme?: SectionTheme) => vibeMeal ? <FeaturedVibeMealSection theme={theme} data={vibeMeal} /> : null },
    { key: "brews", show: !!brews, prefixes: ["social.arabica.", "social.oolong."], theme: "orange", render: (theme?: SectionTheme) => brews ? <FeaturedBrewsSection theme={theme} data={brews} /> : null },
    { key: "npmx", show: !!npmx, prefixes: ["dev.npmx."], theme: "red", render: (theme?: SectionTheme) => npmx ? <FeaturedNpmxSection theme={theme} data={npmx} /> : null },
    { key: "marque", show: !!marque, prefixes: ["at.marque."], theme: "cobalt", render: (theme?: SectionTheme) => marque ? <FeaturedMarqueSection theme={theme} data={marque} /> : null },
    { key: "atlas", show: !!atlas, prefixes: ["city.atlas."], theme: "mint", render: (theme?: SectionTheme) => atlas ? <FeaturedAtlasSection theme={theme} data={atlas} /> : null },
    { key: "pollen", show: !!pollen, prefixes: ["place.pollen."], theme: "lime", render: (theme?: SectionTheme) => pollen ? <FeaturedPollenSection theme={theme} data={pollen} /> : null },
    { key: "atmos", show: !!atmos, prefixes: ["email.atmos."], theme: "cobalt", render: (theme?: SectionTheme) => atmos ? <FeaturedAtmosSection theme={theme} data={atmos} /> : null },
    { key: "aiConsent", show: !!aiConsent, prefixes: ["community.lexicon.preference."], theme: "red", render: (theme?: SectionTheme) => aiConsent ? <FeaturedAiConsentSection theme={theme} data={aiConsent} /> : null },
    { key: "protoimsg", show: !!protoimsg, prefixes: ["app.protoimsg."], theme: "violet", render: (theme?: SectionTheme) => protoimsg ? <FeaturedProtoimsgSection theme={theme} data={protoimsg} /> : null },
    { key: "keytrace", show: !!keytrace, prefixes: ["dev.keytrace."], theme: "mint", render: (theme?: SectionTheme) => keytrace ? <FeaturedKeytraceSection theme={theme} data={keytrace} /> : null },
    { key: "endorse", show: !!endorse, prefixes: ["fund.at.graph."], theme: "lime", render: (theme?: SectionTheme) => endorse ? <FeaturedEndorseSection theme={theme} data={endorse} /> : null },
    { key: "funding", show: !!funding, prefixes: ["fund.at.funding."], theme: "yellow", render: (theme?: SectionTheme) => funding ? <FeaturedFundingSection theme={theme} data={funding} /> : null },
    { key: "blacksky", show: !!blacksky, prefixes: ["community.blacksky."], theme: "cobalt", render: (theme?: SectionTheme) => blacksky ? <FeaturedBlackskySection theme={theme} data={blacksky} /> : null },
    { key: "fledglings", show: !!fledglings, prefixes: ["com.nrempel.fledglings."], theme: "lime", render: (theme?: SectionTheme) => fledglings ? <FeaturedFledglingsSection theme={theme} data={fledglings} /> : null },
    { key: "atroom", show: !!atroom, prefixes: ["blue.atroom."], theme: "mint", render: (theme?: SectionTheme) => atroom ? <FeaturedAtRoomSection theme={theme} data={atroom} /> : null },
    { key: "blento", show: !!blento, prefixes: ["app.blento."], theme: "pink", render: (theme?: SectionTheme) => blento ? <FeaturedBlentoSection theme={theme} data={blento} /> : null },
    { key: "slides", show: !!slides, prefixes: ["tech.waow.slides."], theme: "orange", render: (theme?: SectionTheme) => slides ? <FeaturedSlidesSection theme={theme} data={slides} /> : null },
  ];
  const features: Feature[] = candidates
    .filter((c) => c.show)
    .map((c) => ({
      key: c.key,
      count: countForPrefixes(allBuckets, c.prefixes),
      theme: c.theme,
      render: c.render,
    }))
    .sort((a, b) => b.count - a.count);

  // Order so adjacent sections never share a theme.
  //
  // Bluesky is locked to position #1 when present (per user preference —
  // "bsky at the top instead of ordering by count"). After that we
  // greedily interleave the remaining sections: at each step pick from
  // the theme-bucket with the most items remaining, but never the
  // bucket whose color we just placed. Within a bucket we still pop
  // highest-count first, so the most-active section per color floats up.
  //
  // The only time two same-colored sections end up adjacent is when one
  // color has so many items that they exceed half of all remaining
  // (unavoidable by pigeonhole).
  const ordered: Feature[] = [];
  const bsky = features.find((f) => f.key === "bluesky");
  if (bsky) ordered.push(bsky);

  const buckets = new Map<SectionTheme, Feature[]>();
  for (const f of features) {
    if (f.key === "bluesky") continue;
    if (!buckets.has(f.theme)) buckets.set(f.theme, []);
    buckets.get(f.theme)!.push(f);
  }
  for (const arr of buckets.values()) arr.sort((a, b) => b.count - a.count);

  let lastTheme: SectionTheme | undefined = bsky?.theme;
  while (true) {
    let pickTheme: SectionTheme | null = null;
    let pickSize = -1;
    let fallbackTheme: SectionTheme | null = null;
    let fallbackSize = -1;
    for (const [theme, arr] of buckets) {
      if (arr.length === 0) continue;
      if (theme !== lastTheme && arr.length > pickSize) {
        pickTheme = theme;
        pickSize = arr.length;
      }
      if (arr.length > fallbackSize) {
        fallbackTheme = theme;
        fallbackSize = arr.length;
      }
    }
    const chosen = pickTheme ?? fallbackTheme;
    if (!chosen) break;
    const arr = buckets.get(chosen)!;
    ordered.push(arr.shift()!);
    lastTheme = chosen;
    if (arr.length === 0) buckets.delete(chosen);
  }

  async function onShare() {
    return shareWrappedUrl(stats.handle);
  }

  return (
    <div className="min-h-svh bg-cream text-ink">
      <StickyNav
        handle={stats.handle}
        onShare={onShare}
        years={availableYears}
        year={year}
        onYearChange={setYear}
      />
      <IntroSlide
        stats={filteredStats}
        topServices={topServices}
        onShare={onShare}
        year={year}
      />
      {ordered.map((f) => (
        <Fragment key={f.key}>{f.render(undefined)}</Fragment>
      ))}
      {tail.length > 0 && <TailSection items={tail} />}
      <FooterStrip stats={stats} />
    </div>
  );
}
