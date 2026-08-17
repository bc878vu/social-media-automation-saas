import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const error = searchParams.get("error");
  if (error) return NextResponse.json({ ok: false, error }, { status: 400 });
  if (!code) return NextResponse.json({ ok: false, error: "Missing OAuth code" }, { status: 400 });
  // Next phase: exchange code server-side, obtain Page/Instagram identities, encrypt tokens, persist Connection.
  return NextResponse.json({ ok: true, provider: "meta", connected: false, next: "token_exchange", codeReceived: true });
}
