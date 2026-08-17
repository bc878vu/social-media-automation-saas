import { NextResponse } from "next/server";
import { currentUser, ensureWorkspace } from "../../../../lib/auth";
import { prisma } from "../../../../lib/prisma";

export async function GET() {
  const user = await currentUser(); if (!user) return NextResponse.json({ ok: false, error: "Authentication required" }, { status: 401 });
  const workspace = await ensureWorkspace(user.id);
  const [metrics, content, jobs, trends] = await Promise.all([
    prisma.metric.findMany({ where: { workspaceId: workspace.id }, orderBy: { capturedAt: "desc" }, take: 500 }),
    prisma.content.count({ where: { workspaceId: workspace.id } }),
    prisma.publishJob.count({ where: { content: { workspaceId: workspace.id }, status: "PUBLISHED" } }),
    prisma.trend.findMany({ where: { workspaceId: workspace.id }, orderBy: { score: "desc" }, take: 10 }),
  ]);
  const totals = metrics.reduce((a, m) => ({ views: a.views + m.views, likes: a.likes + m.likes, comments: a.comments + m.comments, shares: a.shares + m.shares, watchTime: a.watchTime + m.watchTime }), { views: 0, likes: 0, comments: 0, shares: 0, watchTime: 0 });
  const engagement = totals.views ? ((totals.likes + totals.comments + totals.shares) / totals.views) * 100 : 0;
  return NextResponse.json({ ok: true, totals, engagement: Number(engagement.toFixed(2)), content, publishedJobs: jobs, topTrends: trends });
}
