import { NextResponse } from "next/server";
import { z } from "zod";
import { currentUser, ensureWorkspace } from "../../../../lib/auth";
import { researchTrends } from "../../../../lib/providers/trends";

export async function GET(request: Request) {
  const user = await currentUser(); if (!user) return NextResponse.json({ ok: false, error: "Authentication required" }, { status: 401 });
  const niche = z.string().min(2).parse(new URL(request.url).searchParams.get("niche") || "AI technology");
  const workspace = await ensureWorkspace(user.id); const trends = await researchTrends(niche);
  if (trends.length) await Promise.all(trends.slice(0, 10).map(t => prismaTrend(workspace.id, t)));
  return NextResponse.json({ ok: true, trends });
}
async function prismaTrend(workspaceId: string, t: any) { const { prisma } = await import("../../../../lib/prisma"); return prisma.trend.create({ data: { workspaceId, source: t.source, title: t.title, url: t.url, score: t.score, keywords: t.keywords } }); }
