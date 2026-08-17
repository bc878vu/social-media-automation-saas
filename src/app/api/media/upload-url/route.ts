import { NextResponse } from "next/server";
import { z } from "zod";
import { currentUser, ensureWorkspace } from "../../../../../lib/auth";
import { createUploadUrl } from "../../../../../lib/storage/s3";

const schema = z.object({ contentId: z.string().min(1), filename: z.string().min(1).max(180), contentType: z.string().min(3) });
export async function POST(request: Request) {
  const user = await currentUser(); if (!user) return NextResponse.json({ ok: false, error: "Authentication required" }, { status: 401 });
  try { const input = schema.parse(await request.json()); const workspace = await ensureWorkspace(user.id); const content = await (await import("../../../../../lib/prisma")).prisma.content.findFirst({ where: { id: input.contentId, workspaceId: workspace.id } }); if (!content) return NextResponse.json({ ok: false, error: "Content not found" }, { status: 404 }); const key = `workspaces/${workspace.id}/content/${content.id}/${Date.now()}-${input.filename.replace(/[^a-z0-9._-]/gi, "_")}`; const uploadUrl = await createUploadUrl(key, input.contentType); if (!uploadUrl) return NextResponse.json({ ok: false, error: "S3 storage is not configured" }, { status: 503 }); return NextResponse.json({ ok: true, key, uploadUrl }); }
  catch (error) { return NextResponse.json({ ok: false, error: error instanceof Error ? error.message : "Upload URL failed" }, { status: 400 }); }
}
