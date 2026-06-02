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

const TOP_SLIDES = 6;
const BENTO_COUNT = 9;

export function Wrapped({
  stats,
  onReset,
}: {
  stats: RepoStats;
  onReset: () => void;
}) {
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

  async function onShare() {
    return shareWrappedUrl(stats.handle);
  }

  return (
    <div className="min-h-svh bg-cream text-ink">
      <StickyNav handle={stats.handle} onReset={onReset} onShare={onShare} />
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
      {bluePlace && <FeaturedBluePlaceSection data={bluePlace} />}
      {spores && <FeaturedSporesSection data={spores} />}
      {smokesignal && <FeaturedSmokeSignalSection data={smokesignal} />}
      {youandme && <FeaturedYouAndMeSection data={youandme} />}
      {drydown && <FeaturedDrydownSection data={drydown} />}
      {frontpage && <FeaturedFrontpageSection data={frontpage} />}
      {flushing && <FeaturedFlushingSection data={flushing} />}
      {bento.length > 0 && <BentoSection items={bento} />}
      {tail.length > 0 && <TailSection items={tail} />}
      <FooterStrip stats={stats} />
    </div>
  );
}
