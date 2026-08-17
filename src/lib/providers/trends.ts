export type TrendItem = { title: string; url?: string; source: string; score: number; keywords: string[] };

export async function researchTrends(niche: string): Promise<TrendItem[]> {
  const results: TrendItem[] = [];
  if (process.env.NEWS_API_KEY) {
    const url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(niche)}&language=en&sortBy=publishedAt&pageSize=10&apiKey=${process.env.NEWS_API_KEY}`;
    const response = await fetch(url, { cache: "no-store" });
    if (response.ok) {
      const data = await response.json();
      for (const [index, article] of (data.articles || []).entries()) results.push({ title: article.title, url: article.url, source: "newsapi", score: Math.max(1, 10 - index), keywords: niche.split(/\s+/).filter(Boolean) });
    }
  }
  if (process.env.YOUTUBE_API_KEY) {
    const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&order=date&maxResults=10&q=${encodeURIComponent(niche)}&key=${process.env.YOUTUBE_API_KEY}`;
    const response = await fetch(url, { cache: "no-store" });
    if (response.ok) {
      const data = await response.json();
      for (const [index, item] of (data.items || []).entries()) results.push({ title: item.snippet?.title || niche, url: item.id?.videoId ? `https://youtube.com/watch?v=${item.id.videoId}` : undefined, source: "youtube", score: Math.max(1, 9 - index), keywords: niche.split(/\s+/).filter(Boolean) });
    }
  }
  return results.sort((a, b) => b.score - a.score).slice(0, 20);
}
