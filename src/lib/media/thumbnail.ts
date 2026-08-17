import { createHash } from "node:crypto";

export type ThumbnailSpec = { width: 1280; height: 720; title: string; subtitle?: string; backgroundPrompt: string; assetKey: string };

/** Returns a deterministic thumbnail specification. An image provider can consume this spec later. */
export function buildThumbnailSpec(title: string, topic: string): ThumbnailSpec {
  const id = createHash("sha1").update(`${title}:${topic}`).digest("hex").slice(0, 12);
  return { width: 1280, height: 720, title: title.slice(0, 70), subtitle: topic.slice(0, 50), backgroundPrompt: `high contrast editorial background for ${topic}`, assetKey: `thumbnails/${id}.jpg` };
}
