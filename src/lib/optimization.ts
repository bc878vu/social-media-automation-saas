import { prisma } from "./prisma";

export async function recommendNextContent(workspaceId: string) {
  const metrics = await prisma.metric.findMany({ where: { workspaceId }, orderBy: { capturedAt: "desc" }, take: 200, include: { content: true } });
  const ranked = metrics.map(m => ({ title: m.content?.title || "Untitled", score: m.views * 1 + m.likes * 4 + m.comments * 6 + m.shares * 8 + m.watchTime * 0.1 })).sort((a,b)=>b.score-a.score).slice(0, 5);
  const top = ranked[0];
  return { recommendation: top ? `Create more content similar to “${top.title}” and preserve its hook/topic angle.` : "Publish a few test topics first so the optimizer has enough performance data.", topContent: ranked };
}
