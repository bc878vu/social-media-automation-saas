import { NextResponse } from "next/server";
import { signOAuthState } from "../../../../lib/oauth-state";
import { youtubeAuthUrl } from "../../../../lib/oauth";
import { db } from "../../../../lib/db";

export async function GET(request: Request) {
  if (!process.env.YOUTUBE_CLIENT_ID || !process.env.YOUTUBE_REDIRECT_URI || !process.env.OAUTH_STATE_SECRET) {
    return NextResponse.json({ ok: false, error: "YouTube OAuth is not configured yet." }, { status: 503 });
  }
  const workspaceId = new URL(request.url).searchParams.get("workspaceId");
  if (!workspaceId) return NextResponse.json({ ok: false, error: "workspaceId is required" }, { status: 400 });
  const exists = await db.workspace.findUnique({ where: { id: workspaceId }, select: { id: true } });
  if (!exists) return NextResponse.json({ ok: false, error: "Workspace not found" }, { status: 404 });
  const state = signOAuthState("youtube", workspaceId);
  return NextResponse.redirect(youtubeAuthUrl(state));
}
