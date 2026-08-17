import { aiGenerate } from "../providers/ai";
import { synthesizeVoice } from "../providers/tts";
import { searchVisuals } from "../providers/visuals";
import { researchTrends } from "../providers/trends";
import { uploadBuffer } from "../storage/s3";
import { prisma } from "../prisma";

export async function runFullProduction(workspaceId: string, niche: string) {
  const trends = await researchTrends(niche);
  const trend = trends[0] || { title: `${niche} latest insights`, score: 1, source: "fallback", keywords: [niche] };
  const prompt = `Create a short-form social video for the niche: ${niche}. Topic: ${trend.title}. Return a compelling hook, 5 concise points, CTA, caption and hashtags. Avoid unsupported factual claims, copyrighted text, and misleading engagement bait.`;
  const ai = await aiGenerate(prompt);
  const text = ai.text || `Hook: Here is what is changing in ${niche}.\n\n1. Focus on the audience problem.\n2. Explain the useful change.\n3. Give one practical example.\n4. Share one mistake to avoid.\n5. End with a simple action.\n\nCTA: Follow for more practical insights.`;
  const voice = await synthesizeVoice(text);
  const visuals = await searchVisuals(trend.title);
  const title = trend.title.slice(0, 95);
  const hashtags = [...new Set(["#shorts", "#reels", ...trend.keywords.map(k => `#${k.replace(/[^a-z0-9]/gi, "")}`).filter(Boolean)])].slice(0, 12);
  const content = await prisma.content.create({ data: { workspaceId, title, topic: trend.title, script: text, caption: `${title}\n\nFollow for more.`, hashtags, status: "PRODUCING" } });
  await prisma.trend.create({ data: { workspaceId, source: trend.source, title: trend.title, url: trend.url, score: trend.score, keywords: trend.keywords } });
  if (voice.buffer.length) {
    const url = await uploadBuffer(`content/${content.id}/voice.mp3`, voice.buffer, voice.mimeType);
    await prisma.mediaAsset.create({ data: { contentId: content.id, kind: "VOICE", url, mimeType: voice.mimeType } });
  }
  for (const visual of visuals.slice(0, 8)) await prisma.mediaAsset.create({ data: { contentId: content.id, kind: "VISUAL", url: visual.url, mimeType: "image/jpeg" } });
  await prisma.content.update({ where: { id: content.id }, data: { status: "READY" } });
  return { contentId: content.id, title, trend, aiProvider: ai.provider, voiceProvider: voice.provider, visualCount: visuals.length };
}
