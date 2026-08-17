import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { encryptSecret } from "@/lib/crypto";
import { verifyOAuthState } from "@/lib/oauth-state";
import { exchangeYouTubeCode, getYouTubeChannel } from "@/lib/oauth-exchange";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const error = searchParams.get("error");
  if (error) return NextResponse.json({ ok: false, error }, { status: 400 });
  if (!code || !state) return NextResponse.json({ ok: false, error: "Missing OAuth code or state" }, { status: 400 });

  try {
    const { workspaceId } = verifyOAuthState(state, "youtube");
    const token = await exchangeYouTubeCode(code);
    const channel = await getYouTubeChannel(token.access_token);
    const expiresAt = new Date(Date.now() + token.expires_in * 1000);
    await db.connection.upsert({
      where: { workspaceId_platform_accountId: { workspaceId, platform: "YOUTUBE", accountId: channel.id } },
      create: { workspaceId, platform: "YOUTUBE", accountId: channel.id, accountName: channel.name, accessToken: encryptSecret(token.access_token), refreshToken: token.refresh_token ? encryptSecret(token.refresh_token) : undefined, expiresAt, scopes: token.scope.split(" ") },
      update: { accountName: channel.name, accessToken: encryptSecret(token.access_token), ...(token.refresh_token ? { refreshToken: encryptSecret(token.refresh_token) } : {}), expiresAt, scopes: token.scope.split(" ") },
    });
    return NextResponse.json({ ok: true, provider: "youtube", connected: true, account: channel.name });
  } catch (err) {
    return NextResponse.json({ ok: false, error: err instanceof Error ? err.message : "YouTube connection failed" }, { status: 400 });
  }
}
