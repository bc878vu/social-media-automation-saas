import { NextResponse } from "next/server";
import { z } from "zod";
import { currentUser, ensureWorkspace } from "../../../../../lib/auth";
import { runFullProduction } from "../../../../../lib/production/full-pipeline";

const schema = z.object({ niche: z.string().min(2).max(120) });
export async function POST(request: Request) {
  const user = await currentUser();
  if (!user) return NextResponse.json({ ok: false, error: "Authentication required" }, { status: 401 });
  try { const { niche } = schema.parse(await request.json()); const workspace = await ensureWorkspace(user.id); return NextResponse.json({ ok: true, result: await runFullProduction(workspace.id, niche) }); }
  catch (error) { return NextResponse.json({ ok: false, error: error instanceof Error ? error.message : "Production failed" }, { status: 500 }); }
}
