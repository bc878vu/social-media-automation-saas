import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "../../../lib/db";

const schema = z.object({ workspaceId: z.string().min(1), platform: z.enum(["YOUTUBE","INSTAGRAM","FACEBOOK"]), accountName: z.string().min(1), accountId: z.string().min(1), accessToken: z.string().optional(), refreshToken: z.string().optional(), expiresAt: z.coerce.date().optional(), scopes: z.array(z.string()).default([]) });

export async function GET(request: Request) {
  const workspaceId = new URL(request.url).searchParams.get("workspaceId");
  const connections = await db.connection.findMany({ where: workspaceId ? { workspaceId } : undefined, select: { id: true, workspaceId: true, platform: true, accountName: true, accountId: true, expiresAt: true, scopes: true, createdAt: true } });
  return NextResponse.json({ ok: true, connections });
}

export async function POST(request: Request) {
  try {
    const input = schema.parse(await request.json());
    const connection = await db.connection.upsert({ where: { workspaceId_platform_accountId: { workspaceId: input.workspaceId, platform: input.platform, accountId: input.accountId } }, create: input, update: input });
    return NextResponse.json({ ok: true, connection: { id: connection.id, platform: connection.platform, accountName: connection.accountName } }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ ok: false, error: error instanceof Error ? error.message : "Invalid connection" }, { status: 400 });
  }
}
