import crypto from "crypto";

const TTL_MS = 10 * 60 * 1000;

export function signOAuthState(provider: string, workspaceId: string) {
  const payload = Buffer.from(JSON.stringify({ provider, workspaceId, exp: Date.now() + TTL_MS })).toString("base64url");
  const secret = process.env.OAUTH_STATE_SECRET;
  if (!secret) throw new Error("OAUTH_STATE_SECRET is not configured");
  const signature = crypto.createHmac("sha256", secret).update(payload).digest("base64url");
  return `${payload}.${signature}`;
}

export function verifyOAuthState(state: string, expectedProvider: string) {
  const [payload, signature] = state.split(".");
  const secret = process.env.OAUTH_STATE_SECRET;
  if (!payload || !signature || !secret) throw new Error("Invalid OAuth state");
  const expected = crypto.createHmac("sha256", secret).update(payload).digest("base64url");
  if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) throw new Error("Invalid OAuth state signature");
  const parsed = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as { provider: string; workspaceId: string; exp: number };
  if (parsed.provider !== expectedProvider || parsed.exp < Date.now()) throw new Error("Expired or mismatched OAuth state");
  return parsed;
}
