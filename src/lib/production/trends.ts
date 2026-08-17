export type Trend = {
  topic: string;
  angle: string;
  score: number;
  keywords: string[];
  source: "seed" | "provider";
};

const seeds = [
  "AI productivity tools",
  "creator economy automation",
  "future of work with AI",
  "AI video creation",
  "small business automation",
];

export async function researchTrends(niche: string, limit = 5): Promise<Trend[]> {
  const base = niche.trim() || "AI & Technology";
  return Array.from({ length: limit }, (_, index) => ({
    topic: `${base}: ${seeds[index % seeds.length]}`,
    angle: index % 2 ? "3 practical changes creators can use this week" : "What changed and why it matters now",
    score: 92 - index * 7,
    keywords: [base, "AI", "automation", "creator", "2026"],
    source: "seed" as const,
  }));
}
