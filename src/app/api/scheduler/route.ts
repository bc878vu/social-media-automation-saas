import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";

const schema = z.object({ contentId: z.string().min(1), runAt: z.coerce.date(), platform: z.enum(["YOUTUBE","INSTAGRAM","FACEBOOK"]) });

export async function POST(request: Request) {
  try {
    const input = schema.parse(await request.json());
    const content = await db.content.findUnique({ where: { id: input.contentId } });
    if (!content) return NextResponse.json({ ok: false, error: "Content not found" }, { status: 404 });
    const job = await db.publishJob.create({ data: { contentId: input.contentId, platform: input.platform, runAt: input.runAt } });
    await db.content.update({ where: { id: input.contentId }, data: { status: "SCHEDULED", scheduledAt: input.runAt } });
    return NextResponse.json({ ok: true, job });
  } catch (error) {
    return NextResponse.json({ ok: false, error: error instanceof Error ? error.message : "Invalid schedule" }, { status: 400 });
  }
}

export async function GET() {
  const jobs = await db.publishJob.findMany({ where: { status: "queued" }, orderBy: { runAt: "asc" }, take: 100, include: { content: true } });
  return NextResponse.json({ ok: true, jobs });
}
