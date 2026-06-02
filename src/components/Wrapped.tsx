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
} from "../lib/featured";
// New highlight extractors (one per service, in src/lib/highlights/)
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

const TOP_SLIDES = 6;
const BENTO_COUNT = 9;

export function Wrapped({ stats }: { stats: RepoStats }) {
  const allBuckets = Array.from(stats.byCollection.entries())
    .map(([nsid, records], idx) => {
      const descriptor = describeCollection(nsid, idx);
      return { nsid, records, count: records.length, descriptor };
    })
    .sort((a, b) => b.count - a.count);

  const buckets = allBuckets.filter((b) => !isFeaturedNsid(b.nsid));

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
  const bluesky = getBlueskyHighlights(stats.byCollection);
  const atsumeat = getAtsumeatHighlights(stats.byCollection);
  const atbuddy = getAtBuddyHighlights(stats.byCollection);
  const bluePlace = getBluePlaceHighlights(stats.byCollection);
  const psky = getPskyHighlights(stats.byCollection);
  const youandme = getYouAndMeHighlights(stats.byCollection);
  const smokesignal = getSmokeSignalHighlights(stats.byCollection);
  const sifa = getSifaHighlights(stats.byCollection);
  const spores = getSporesHighlights(stats.byCollection);

  // New batch of featured services (live in src/lib/highlights/)
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

  async function onShare() {
    return shareWrappedUrl(stats.handle);
  }

  return (
    <div className="min-h-svh bg-cream text-ink">
      <StickyNav handle={stats.handle} onShare={onShare} />
      <IntroSlide stats={stats} topServices={topServices} onShare={onShare} />
      {bluesky && <FeaturedBlueskySection data={bluesky} />}
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
      {music && <FeaturedMusicSection data={music} />}
      {popfeed && <FeaturedPopfeedSection data={popfeed} />}
      {flashes && <FeaturedFlashesSection data={flashes} />}
      {grain && <FeaturedGrainSection data={grain} />}
      {reading && <FeaturedReadingSection data={reading} />}
      {standardDocs && <FeaturedStandardDocsSection data={standardDocs} />}
      {sifa && <FeaturedSifaSection data={sifa} />}
      {status && <FeaturedStatusSection data={status} />}
      {psky && <FeaturedPskySection data={psky} />}
      {streamplace && <FeaturedStreamplaceSection data={streamplace} />}
      {tangled && <FeaturedTangledSection data={tangled} />}
      {anisota && <FeaturedAnisotaSection data={anisota} />}
      {games && <FeaturedGamesSection data={games} />}
      {rpg && <FeaturedRpgSection data={rpg} />}
      {atbuddy && <FeaturedAtBuddySection data={atbuddy} />}
      {atsumeat && <FeaturedAtsumeatSection data={atsumeat} />}
      {stickers && <FeaturedStickersSection data={stickers} />}
      {badges && <FeaturedBadgesSection data={badges} />}
      {bluePlace && <FeaturedBluePlaceSection data={bluePlace} />}
      {spores && <FeaturedSporesSection data={spores} />}
      {smokesignal && <FeaturedSmokeSignalSection data={smokesignal} />}
      {youandme && <FeaturedYouAndMeSection data={youandme} />}
      {highFive && <FeaturedHighFiveSection data={highFive} />}
      {atvouch && <FeaturedAtVouchSection data={atvouch} />}
      {atpoke && <FeaturedAtPokeSection data={atpoke} />}
      {intros && <FeaturedIntrosSection data={intros} />}
      {sparks && <FeaturedSparksSection data={sparks} />}
      {blips && <FeaturedBlipsSection data={blips} />}
      {asq && <FeaturedAsqSection data={asq} />}
      {drydown && <FeaturedDrydownSection data={drydown} />}
      {frontpage && <FeaturedFrontpageSection data={frontpage} />}
      {flushing && <FeaturedFlushingSection data={flushing} />}
      {sidetrail && <FeaturedSidetrailSection data={sidetrail} />}
      {tokimekiPolls && <FeaturedTokimekiPollsSection data={tokimekiPolls} />}
      {wishlist && <FeaturedWishlistSection data={wishlist} />}
      {atstore && <FeaturedAtStoreSection data={atstore} />}
      {atguilds && <FeaturedAtGuildsSection data={atguilds} />}
      {linkring && <FeaturedLinkringSection data={linkring} />}
      {atcircle && <FeaturedAtCircleSection data={atcircle} />}
      {rankthat && <FeaturedRankthatSection data={rankthat} />}
      {cosmik && <FeaturedCosmikSection data={cosmik} />}
      {attodo && <FeaturedAtToDoSection data={attodo} />}
      {skyboard && <FeaturedSkyboardSection data={skyboard} />}
      {skytalk && <FeaturedSkytalkSection data={skytalk} />}
      {madebydannyCdn && <FeaturedMadebydannyCdnSection data={madebydannyCdn} />}
      {flobitImages && <FeaturedFlobitImagesSection data={flobitImages} />}
      {sonasky && <FeaturedSonaskySection data={sonasky} />}
      {simocracy && <FeaturedSimocracySection data={simocracy} />}
      {wisp && <FeaturedWispSection data={wisp} />}
      {vibeMeal && <FeaturedVibeMealSection data={vibeMeal} />}
      {bento.length > 0 && <BentoSection items={bento} />}
      {tail.length > 0 && <TailSection items={tail} />}
      <FooterStrip stats={stats} />
    </div>
  );
}
