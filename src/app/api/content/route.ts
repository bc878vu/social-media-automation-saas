import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "../../../lib/db";

const schema = z.object({
  workspaceId: z.string().min(1),
  automationId: z.string().optional(),
  title: z.string().min(1),
  topic: z.string().min(1),
  script: z.string().optional(),
  caption: z.string().optional(),
  hashtags: z.array(z.string()).default([]),
  status: z.enum(["IDEA","SCRIPTED","PRODUCING","READY","SCHEDULED","PUBLISHED","FAILED"]).default("IDEA"),
  scheduledAt: z.coerce.date().optional(),
});

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const workspaceId = searchParams.get("workspaceId");
  const contents = await db.content.findMany({ where: workspaceId ? { workspaceId } : undefined, orderBy: { createdAt: "desc" }, take: 100 });
  return NextResponse.json({ ok: true, contents });
}

export async function POST(request: Request) {
  try {
    const input = schema.parse(await request.json());
    const content = await db.content.create({ data: input });
    return NextResponse.json({ ok: true, content }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ ok: false, error: error instanceof Error ? error.message : "Invalid content" }, { status: 400 });
  }
}
