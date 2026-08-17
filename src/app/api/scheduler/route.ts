import { NextResponse } from "next/server";
import { z } from "zod";
import { currentUser, ensureWorkspace } from "../../../../lib/auth";
import { prisma } from "../../../../lib/prisma";
import { enqueuePublish } from "../../../../lib/queue";

const schema = z.object({ contentId: z.string().min(1), runAt: z.coerce.date(), platform: z.enum(["YOUTUBE","INSTAGRAM","FACEBOOK"]) });

export async function POST(request: Request) {
  const user = await currentUser(); if (!user) return NextResponse.json({ ok: false, error: "Authentication required" }, { status: 401 });
  try {
    const input = schema.parse(await request.json()); const workspace = await ensureWorkspace(user.id);
    const content = await prisma.content.findFirst({ where: { id: input.contentId, workspaceId: workspace.id } });
    if (!content) return NextResponse.json({ ok: false, error: "Content not found" }, { status: 404 });
    const job = await prisma.publishJob.create({ data: { contentId: input.contentId, platform: input.platform, runAt: input.runAt } });
    await prisma.content.update({ where: { id: input.contentId }, data: { status: "SCHEDULED", scheduledAt: input.runAt } });
    const queue = await enqueuePublish(job.id, Math.max(0, input.runAt.getTime() - Date.now()));
    return NextResponse.json({ ok: true, job, queue });
  } catch (error) { return NextResponse.json({ ok: false, error: error instanceof Error ? error.message : "Invalid schedule" }, { status: 400 }); }
}

export async function GET() {
  const user = await currentUser(); if (!user) return NextResponse.json({ ok: false, error: "Authentication required" }, { status: 401 });
  const workspace = await ensureWorkspace(user.id); const jobs = await prisma.publishJob.findMany({ where: { status: "QUEUED", content: { workspaceId: workspace.id } }, orderBy: { runAt: "asc" }, take: 100, include: { content: true } });
  return NextResponse.json({ ok: true, jobs });
}
