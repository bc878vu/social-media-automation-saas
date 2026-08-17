import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { encryptSecret } from "@/lib/crypto";
import { verifyOAuthState } from "@/lib/oauth-state";
import { exchangeMetaCode, getMetaPages } from "@/lib/oauth-exchange";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const error = searchParams.get("error");
  if (error) return NextResponse.json({ ok: false, error }, { status: 400 });
  if (!code || !state) return NextResponse.json({ ok: false, error: "Missing OAuth code or state" }, { status: 400 });

  try {
    const { workspaceId } = verifyOAuthState(state, "meta");
    const token = await exchangeMetaCode(code);
    const pages = await getMetaPages(token.access_token);
    if (!pages.length) throw new Error("No Facebook Pages were granted to this app");

    for (const page of pages) {
      await db.connection.upsert({
        where: { workspaceId_platform_accountId: { workspaceId, platform: "FACEBOOK", accountId: page.id } },
        create: { workspaceId, platform: "FACEBOOK", accountId: page.id, accountName: page.name, accessToken: encryptSecret(page.access_token), expiresAt: token.expires_in ? new Date(Date.now() + token.expires_in * 1000) : undefined, scopes: ["pages_manage_posts", "pages_read_engagement"] },
        update: { accountName: page.name, accessToken: encryptSecret(page.access_token), expiresAt: token.expires_in ? new Date(Date.now() + token.expires_in * 1000) : undefined },
      });

      if (page.instagram_business_account?.id) {
        await db.connection.upsert({
          where: { workspaceId_platform_accountId: { workspaceId, platform: "INSTAGRAM", accountId: page.instagram_business_account.id } },
          create: { workspaceId, platform: "INSTAGRAM", accountId: page.instagram_business_account.id, accountName: `${page.name} Instagram`, accessToken: encryptSecret(page.access_token), expiresAt: token.expires_in ? new Date(Date.now() + token.expires_in * 1000) : undefined, scopes: ["instagram_basic", "instagram_content_publish"] },
          update: { accountName: `${page.name} Instagram`, accessToken: encryptSecret(page.access_token), expiresAt: token.expires_in ? new Date(Date.now() + token.expires_in * 1000) : undefined },
        });
      }
    }

    return NextResponse.json({ ok: true, provider: "meta", connected: true, pages: pages.map(p => ({ id: p.id, name: p.name, instagram: Boolean(p.instagram_business_account?.id) })) });
  } catch (err) {
    return NextResponse.json({ ok: false, error: err instanceof Error ? err.message : "Meta connection failed" }, { status: 400 });
  }
}
