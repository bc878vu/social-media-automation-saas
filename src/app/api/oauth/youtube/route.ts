import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { youtubeAuthUrl } from "@/lib/oauth";

export async function GET() {
  if (!process.env.YOUTUBE_CLIENT_ID || !process.env.YOUTUBE_REDIRECT_URI) {
    return NextResponse.json({ ok: false, error: "YouTube OAuth is not configured yet." }, { status: 503 });
  }
  const state = randomUUID();
  // Production: persist this state against the authenticated workspace/session and verify it on callback.
  return NextResponse.redirect(youtubeAuthUrl(state));
}
