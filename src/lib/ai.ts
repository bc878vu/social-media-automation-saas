import type { GeneratedContent } from "./types";

const hash = (value: string) => value.split("").reduce((a, c) => (a * 31 + c.charCodeAt(0)) >>> 0, 7);

export async function generateContent(topic: string): Promise<GeneratedContent> {
  const seed = hash(topic);
  return {
    title: `${topic}: 5 things creators should know`,
    topic,
    script: `Hook: Most creators are overlooking ${topic}.\n\nPoint 1: Start with one clear audience problem.\nPoint 2: Turn the problem into a short, useful story.\nPoint 3: Use a strong visual every few seconds.\nPoint 4: End with one practical action.\nPoint 5: Review performance and improve the next post.\n\nCTA: Follow for more practical creator insights.`,
    caption: `A practical breakdown of ${topic}. Save this for your next content session.`,
    hashtags: [`#${topic.replace(/[^a-z0-9]/gi, "") || "content"}`, "#CreatorTips", "#AITools", `#${seed % 2 ? "Shorts" : "Reels"}`],
  };
}
