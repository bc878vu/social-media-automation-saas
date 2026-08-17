import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { metaAuthUrl } from "@/lib/oauth";

export async function GET() {
  if (!process.env.META_APP_ID || !process.env.META_REDIRECT_URI) {
    return NextResponse.json({ ok: false, error: "Meta OAuth is not configured yet." }, { status: 503 });
  }
  const state = randomUUID();
  // Production: persist this state against the authenticated workspace/session and verify it on callback.
  return NextResponse.redirect(metaAuthUrl(state));
}
