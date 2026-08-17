import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "../../../lib/db";

const schema = z.object({ name: z.string().min(2).max(80), niche: z.string().min(2).max(120), timezone: z.string().default("Asia/Karachi"), autoApprove: z.boolean().default(false) });

export async function GET() {
  const workspaces = await db.workspace.findMany({ orderBy: { createdAt: "desc" }, include: { automations: true, connections: true } });
  return NextResponse.json({ ok: true, workspaces });
}

export async function POST(request: Request) {
  try {
    const input = schema.parse(await request.json());
    const workspace = await db.workspace.create({ data: input });
    return NextResponse.json({ ok: true, workspace }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ ok: false, error: error instanceof Error ? error.message : "Invalid workspace" }, { status: 400 });
  }
}
