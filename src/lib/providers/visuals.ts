export type VisualAsset = { url: string; source: string; attribution?: string };

export async function searchVisuals(query: string): Promise<VisualAsset[]> {
  if (process.env.PEXELS_API_KEY) {
    const response = await fetch(`https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=8`, { headers: { Authorization: process.env.PEXELS_API_KEY } });
    if (!response.ok) throw new Error(`Pexels failed: ${response.status}`);
    const data = await response.json();
    return (data.photos || []).map((p: any) => ({ url: p.src?.portrait || p.src?.large2x || p.src?.large, source: "pexels", attribution: p.photographer })).filter((x: VisualAsset) => x.url);
  }
  return [];
}
