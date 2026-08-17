export type SeoPackage = { title: string; description: string; hashtags: string[]; keywords: string[] };

export function generateSeo(topic: string, niche: string): SeoPackage {
  const clean = topic.trim();
  const tag = (value: string) => `#${value.replace(/[^a-z0-9]/gi, "")}`;
  return {
    title: `${clean} — 5 Things Creators Should Know`,
    description: `A concise, practical breakdown of ${clean}. Learn what changed, why it matters and what you can do next. Created for the ${niche} audience.`,
    hashtags: [tag(niche), "#AI", "#Automation", "#CreatorTips", "#Shorts", "#Reels"],
    keywords: [clean, niche, "AI", "automation", "creator tips", "productivity", "short video"],
  };
}
