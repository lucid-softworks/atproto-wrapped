import { Fragment, type ReactNode } from "react";
import type { RepoStats } from "../lib/atproto";
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
import { StickyNav } from "./wrapped/Nav";
import { IntroSlide } from "./wrapped/Intro";
import { BigSlide } from "./wrapped/BigSlide";
import { BentoSection } from "./wrapped/Bento";
import { TailSection } from "./wrapped/Tail";
import { FooterStrip } from "./wrapped/Footer";
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

const TOP_SLIDES = 6;
const BENTO_COUNT = 9;

type Bucket = { nsid: string; count: number };

function countForPrefixes(buckets: Bucket[], prefixes: string[]): number {
  let sum = 0;
  for (const b of buckets) {
    if (prefixes.some((p) => b.nsid.startsWith(p))) sum += b.count;
  }
  return sum;
}

export function Wrapped({ stats }: { stats: RepoStats }) {
  const allBuckets = Array.from(stats.byCollection.entries())
    .map(([nsid, records], idx) => {
      const descriptor = describeCollection(nsid, idx);
      return { nsid, records, count: records.length, descriptor };
    })
    .sort((a, b) => b.count - a.count);

  // Anything featured OR explicitly skipped (protocol/declaration noise like
  // com.germnetwork.keyPackage) is removed from the supporting-cast bento
  // and the long-tail list.
  const buckets = allBuckets.filter(
    (b) => !isFeaturedNsid(b.nsid) && !isSkippedNsid(b.nsid),
  );

  const topSlides = buckets.slice(0, TOP_SLIDES);
  const bento = buckets.slice(TOP_SLIDES, TOP_SLIDES + BENTO_COUNT);
  const tail = buckets.slice(TOP_SLIDES + BENTO_COUNT);

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
  const bluesky = getBlueskyHighlights(stats.byCollection);
  const music = getMusicHighlights(stats.byCollection);
  const popfeed = getPopfeedHighlights(stats.byCollection);
  const grain = getGrainHighlights(stats);
  const tangled = getTangledHighlights(stats.byCollection);
  const streamplace = getStreamplaceHighlights(stats.byCollection);
  const rpg = getRpgHighlights(stats);
  const anisota = getAnisotaHighlights(stats.byCollection);
  const games = getGamesHighlights(stats.byCollection);
  const flashes = getFlashesHighlights(stats);
  const reading = getReadingHighlights(stats.byCollection);
  const flushing = getFlushingHighlights(stats.byCollection);
  const frontpage = getFrontpageHighlights(stats.byCollection);
  const drydown = getDrydownHighlights(stats);
  const status = getStatusHighlights(stats.byCollection);
  const atsumeat = getAtsumeatHighlights(stats.byCollection);
  const atbuddy = getAtBuddyHighlights(stats.byCollection);
  const bluePlace = getBluePlaceHighlights(stats.byCollection);
  const psky = getPskyHighlights(stats.byCollection);
  const youandme = getYouAndMeHighlights(stats.byCollection);
  const smokesignal = getSmokeSignalHighlights(stats.byCollection);
  const sifa = getSifaHighlights(stats.byCollection);
  const spores = getSporesHighlights(stats.byCollection);
  const highFive = getHighFiveHighlights(stats.byCollection);
  const atvouch = getAtVouchHighlights(stats.byCollection);
  const atpoke = getAtPokeHighlights(stats.byCollection);
  const sparks = getSparksHighlights(stats.byCollection);
  const blips = getBlipsHighlights(stats.byCollection);
  const asq = getAsqHighlights(stats.byCollection);
  const intros = getIntrosHighlights(stats.byCollection);
  const stickers = getStickersHighlights(stats);
  const badges = getBadgesHighlights(stats);
  const wishlist = getWishlistHighlights(stats);
  const madebydannyCdn = getMadebydannyCdnHighlights(stats);
  const flobitImages = getFlobitImagesHighlights(stats);
  const sonasky = getSonaskyHighlights(stats);
  const simocracy = getSimocracyHighlights(stats);
  const attodo = getAtToDoHighlights(stats.byCollection);
  const skyboard = getSkyboardHighlights(stats.byCollection);
  const cosmik = getCosmikHighlights(stats.byCollection);
  const atguilds = getAtGuildsHighlights(stats.byCollection);
  const linkring = getLinkringHighlights(stats.byCollection);
  const atcircle = getAtCircleHighlights(stats.byCollection);
  const rankthat = getRankthatHighlights(stats.byCollection);
  const sidetrail = getSidetrailHighlights(stats.byCollection);
  const skytalk = getSkytalkHighlights(stats.byCollection);
  const tokimekiPolls = getTokimekiPollsHighlights(stats.byCollection);
  const standardDocs = getStandardDocsHighlights(stats.byCollection);
  const wisp = getWispHighlights(stats.byCollection);
  const vibeMeal = getVibeMealHighlights(stats.byCollection);
  const atstore = getAtStoreHighlights(stats.byCollection);
  const brews = getBrewsHighlights(stats.byCollection);
  const calendar = getCalendarHighlights(stats.byCollection);
  const npmx = getNpmxHighlights(stats.byCollection);
  const marque = getMarqueHighlights(stats.byCollection);
  const atlas = getAtlasHighlights(stats.byCollection);
  const pollen = getPollenHighlights(stats.byCollection);
  const atmos = getAtmosHighlights(stats.byCollection);
  const aiConsent = getAiConsentHighlights(stats.byCollection);
  const protoimsg = getProtoimsgHighlights(stats.byCollection);

  // Build the spotlight list — each entry is a featured section that only
  // appears when its highlight is non-null. We then sort by how many records
  // the user has under that service, so the spotlight order reflects what
  // each individual person actually does most (rather than always opening
  // with Bluesky).
  type Feature = { key: string; count: number; node: ReactNode };
  const candidates: Array<{
    key: string;
    show: boolean;
    prefixes: string[];
    node: ReactNode;
  }> = [
    { key: "bluesky", show: !!bluesky, prefixes: ["app.bsky.", "chat.bsky."], node: bluesky && <FeaturedBlueskySection data={bluesky} /> },
    { key: "music", show: !!music, prefixes: ["app.rocksky.", "fm.teal.", "fm.plyr."], node: music && <FeaturedMusicSection data={music} /> },
    { key: "popfeed", show: !!popfeed, prefixes: ["social.popfeed."], node: popfeed && <FeaturedPopfeedSection data={popfeed} did={stats.did} /> },
    { key: "flashes", show: !!flashes, prefixes: ["blue.flashes."], node: flashes && <FeaturedFlashesSection data={flashes} /> },
    { key: "grain", show: !!grain, prefixes: ["social.grain."], node: grain && <FeaturedGrainSection data={grain} /> },
    { key: "reading", show: !!reading, prefixes: ["com.whtwnd.", "buzz.bookhive.", "pub.leaflet.", "at.margin.", "at.monomarks.", "my.skylights."], node: reading && <FeaturedReadingSection data={reading} /> },
    { key: "standardDocs", show: !!standardDocs, prefixes: ["site.standard."], node: standardDocs && <FeaturedStandardDocsSection data={standardDocs} /> },
    { key: "sifa", show: !!sifa, prefixes: ["id.sifa."], node: sifa && <FeaturedSifaSection data={sifa} /> },
    { key: "status", show: !!status, prefixes: ["is.dame.", "xyz.statusphere.", "vg.nat.istat.", "social.kibun.", "io.zzstoatzz.status."], node: status && <FeaturedStatusSection data={status} /> },
    { key: "psky", show: !!psky, prefixes: ["social.psky."], node: psky && <FeaturedPskySection data={psky} /> },
    { key: "streamplace", show: !!streamplace, prefixes: ["place.stream."], node: streamplace && <FeaturedStreamplaceSection data={streamplace} /> },
    { key: "tangled", show: !!tangled, prefixes: ["sh.tangled."], node: tangled && <FeaturedTangledSection data={tangled} /> },
    { key: "anisota", show: !!anisota, prefixes: ["net.anisota."], node: anisota && <FeaturedAnisotaSection data={anisota} /> },
    { key: "games", show: !!games, prefixes: ["blue.2048.", "games.firehose.", "farm.smol.games.", "tools.atp.", "com.imlunahey.leaderboard."], node: games && <FeaturedGamesSection data={games} /> },
    { key: "rpg", show: !!rpg, prefixes: ["actor.rpg.", "equipment.rpg."], node: rpg && <FeaturedRpgSection data={rpg} /> },
    { key: "atbuddy", show: !!atbuddy, prefixes: ["app.atbuddy."], node: atbuddy && <FeaturedAtBuddySection data={atbuddy} /> },
    { key: "atsumeat", show: !!atsumeat, prefixes: ["com.suibari.atsumeat."], node: atsumeat && <FeaturedAtsumeatSection data={atsumeat} /> },
    { key: "stickers", show: !!stickers, prefixes: ["boo.sky."], node: stickers && <FeaturedStickersSection data={stickers} /> },
    { key: "badges", show: !!badges, prefixes: ["blue.badge."], node: badges && <FeaturedBadgesSection data={badges} /> },
    { key: "bluePlace", show: !!bluePlace, prefixes: ["blue.place."], node: bluePlace && <FeaturedBluePlaceSection data={bluePlace} /> },
    { key: "spores", show: !!spores, prefixes: ["coop.hypha.spores."], node: spores && <FeaturedSporesSection data={spores} /> },
    { key: "smokesignal", show: !!smokesignal, prefixes: ["events.smokesignal."], node: smokesignal && <FeaturedSmokeSignalSection data={smokesignal} /> },
    { key: "calendar", show: !!calendar, prefixes: ["community.lexicon.calendar."], node: calendar && <FeaturedCalendarSection data={calendar} /> },
    { key: "youandme", show: !!youandme, prefixes: ["at.youandme."], node: youandme && <FeaturedYouAndMeSection data={youandme} /> },
    { key: "highFive", show: !!highFive, prefixes: ["com.atprotofans.high-five."], node: highFive && <FeaturedHighFiveSection data={highFive} /> },
    { key: "atvouch", show: !!atvouch, prefixes: ["dev.atvouch."], node: atvouch && <FeaturedAtVouchSection data={atvouch} /> },
    { key: "atpoke", show: !!atpoke, prefixes: ["xyz.atpoke."], node: atpoke && <FeaturedAtPokeSection data={atpoke} /> },
    { key: "intros", show: !!intros, prefixes: ["com.skybemoreblue."], node: intros && <FeaturedIntrosSection data={intros} /> },
    { key: "sparks", show: !!sparks, prefixes: ["tech.tokimeki.takibi."], node: sparks && <FeaturedSparksSection data={sparks} /> },
    { key: "blips", show: !!blips, prefixes: ["stream.thought."], node: blips && <FeaturedBlipsSection data={blips} /> },
    { key: "asq", show: !!asq, prefixes: ["fyi.asq."], node: asq && <FeaturedAsqSection data={asq} /> },
    { key: "drydown", show: !!drydown, prefixes: ["social.drydown."], node: drydown && <FeaturedDrydownSection data={drydown} /> },
    { key: "frontpage", show: !!frontpage, prefixes: ["fyi.unravel.frontpage."], node: frontpage && <FeaturedFrontpageSection data={frontpage} /> },
    { key: "flushing", show: !!flushing, prefixes: ["im.flushing."], node: flushing && <FeaturedFlushingSection data={flushing} /> },
    { key: "sidetrail", show: !!sidetrail, prefixes: ["app.sidetrail."], node: sidetrail && <FeaturedSidetrailSection data={sidetrail} /> },
    { key: "tokimekiPolls", show: !!tokimekiPolls, prefixes: ["tech.tokimeki.poll."], node: tokimekiPolls && <FeaturedTokimekiPollsSection data={tokimekiPolls} /> },
    { key: "wishlist", show: !!wishlist, prefixes: ["blue.registry."], node: wishlist && <FeaturedWishlistSection data={wishlist} /> },
    { key: "atstore", show: !!atstore, prefixes: ["fyi.atstore."], node: atstore && <FeaturedAtStoreSection data={atstore} /> },
    { key: "atguilds", show: !!atguilds, prefixes: ["dev.jakestout.atguilds."], node: atguilds && <FeaturedAtGuildsSection data={atguilds} /> },
    { key: "linkring", show: !!linkring, prefixes: ["lol.linkring."], node: linkring && <FeaturedLinkringSection data={linkring} /> },
    { key: "atcircle", show: !!atcircle, prefixes: ["net.asadaame5121.at-circle."], node: atcircle && <FeaturedAtCircleSection data={atcircle} /> },
    { key: "rankthat", show: !!rankthat, prefixes: ["net.rankthat."], node: rankthat && <FeaturedRankthatSection data={rankthat} /> },
    { key: "cosmik", show: !!cosmik, prefixes: ["network.cosmik."], node: cosmik && <FeaturedCosmikSection data={cosmik} /> },
    { key: "attodo", show: !!attodo, prefixes: ["app.attodo."], node: attodo && <FeaturedAtToDoSection data={attodo} /> },
    { key: "skyboard", show: !!skyboard, prefixes: ["dev.skyboard."], node: skyboard && <FeaturedSkyboardSection data={skyboard} /> },
    { key: "skytalk", show: !!skytalk, prefixes: ["blue.skytalk."], node: skytalk && <FeaturedSkytalkSection data={skytalk} /> },
    { key: "madebydannyCdn", show: !!madebydannyCdn, prefixes: ["uk.madebydanny."], node: madebydannyCdn && <FeaturedMadebydannyCdnSection data={madebydannyCdn} /> },
    { key: "flobitImages", show: !!flobitImages, prefixes: ["dev.flo-bit."], node: flobitImages && <FeaturedFlobitImagesSection data={flobitImages} /> },
    { key: "sonasky", show: !!sonasky, prefixes: ["app.sonasky."], node: sonasky && <FeaturedSonaskySection data={sonasky} /> },
    { key: "simocracy", show: !!simocracy, prefixes: ["org.simocracy."], node: simocracy && <FeaturedSimocracySection data={simocracy} /> },
    { key: "wisp", show: !!wisp, prefixes: ["place.wisp."], node: wisp && <FeaturedWispSection data={wisp} /> },
    { key: "vibeMeal", show: !!vibeMeal, prefixes: ["com.vibe-coded."], node: vibeMeal && <FeaturedVibeMealSection data={vibeMeal} /> },
    { key: "brews", show: !!brews, prefixes: ["social.arabica.", "social.oolong."], node: brews && <FeaturedBrewsSection data={brews} /> },
    { key: "npmx", show: !!npmx, prefixes: ["dev.npmx."], node: npmx && <FeaturedNpmxSection data={npmx} /> },
    { key: "marque", show: !!marque, prefixes: ["at.marque."], node: marque && <FeaturedMarqueSection data={marque} /> },
    { key: "atlas", show: !!atlas, prefixes: ["city.atlas."], node: atlas && <FeaturedAtlasSection data={atlas} /> },
    { key: "pollen", show: !!pollen, prefixes: ["place.pollen."], node: pollen && <FeaturedPollenSection data={pollen} /> },
    { key: "atmos", show: !!atmos, prefixes: ["email.atmos."], node: atmos && <FeaturedAtmosSection data={atmos} /> },
    { key: "aiConsent", show: !!aiConsent, prefixes: ["community.lexicon.preference."], node: aiConsent && <FeaturedAiConsentSection data={aiConsent} /> },
    { key: "protoimsg", show: !!protoimsg, prefixes: ["app.protoimsg."], node: protoimsg && <FeaturedProtoimsgSection data={protoimsg} /> },
  ];
  const features: Feature[] = candidates
    .filter((c) => c.show && c.node)
    .map((c) => ({
      key: c.key,
      count: countForPrefixes(allBuckets, c.prefixes),
      node: c.node,
    }))
    .sort((a, b) => b.count - a.count);

  async function onShare() {
    return shareWrappedUrl(stats.handle);
  }

  return (
    <div className="min-h-svh bg-cream text-ink">
      <StickyNav handle={stats.handle} onShare={onShare} />
      <IntroSlide stats={stats} topServices={topServices} onShare={onShare} />
      {features.map((f) => (
        <Fragment key={f.key}>{f.node}</Fragment>
      ))}
      {topSlides.map((b, i) => (
        <BigSlide
          key={b.nsid}
          index={i + 1}
          total={topSlides.length}
          nsid={b.nsid}
          count={b.count}
          descriptor={b.descriptor}
        />
      ))}
      {bento.length > 0 && <BentoSection items={bento} />}
      {tail.length > 0 && <TailSection items={tail} />}
      <FooterStrip stats={stats} />
    </div>
  );
}
