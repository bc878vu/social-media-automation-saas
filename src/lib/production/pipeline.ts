import { buildVisualPlan } from "./visuals";
import { createScript } from "./script";
import { researchTrends } from "./trends";
import { synthesizeVoice } from "./voice";
import { createSubtitleCues, toSrt } from "./subtitles";
import { createThumbnailPlan } from "./thumbnail";
import { generateSeo } from "./seo";

export type ProductionBundle = {
  trend: Awaited<ReturnType<typeof researchTrends>>[number];
  script: ReturnType<typeof createScript>;
  visuals: ReturnType<typeof buildVisualPlan>;
  voice: Awaited<ReturnType<typeof synthesizeVoice>>;
  subtitles: string;
  thumbnail: ReturnType<typeof createThumbnailPlan>;
  seo: ReturnType<typeof generateSeo>;
  status: "READY_FOR_RENDER";
};

export async function buildProductionBundle(niche: string): Promise<ProductionBundle> {
  const [trend] = await researchTrends(niche, 1);
  const script = createScript(trend);
  const visuals = buildVisualPlan(script);
  const voice = await synthesizeVoice(script);
  const subtitles = toSrt(createSubtitleCues(script));
  const thumbnail = createThumbnailPlan(trend.topic);
  const seo = generateSeo(trend.topic, niche);
  return { trend, script, visuals, voice, subtitles, thumbnail, seo, status: "READY_FOR_RENDER" };
}
