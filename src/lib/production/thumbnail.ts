export type ThumbnailPlan = { headline: string; subline: string; aspectRatio: "16:9" | "9:16"; prompt: string };

export function createThumbnailPlan(topic: string): ThumbnailPlan {
  return {
    headline: topic.length > 38 ? `${topic.slice(0, 35)}…` : topic,
    subline: "What creators need to know",
    aspectRatio: "9:16",
    prompt: `High-contrast vertical social thumbnail about ${topic}, bold readable headline, clean modern creator aesthetic, no logos or copyrighted characters`,
  };
}
