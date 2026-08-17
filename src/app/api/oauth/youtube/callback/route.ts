import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const error = searchParams.get("error");
  if (error) return NextResponse.json({ ok: false, error }, { status: 400 });
  if (!code) return NextResponse.json({ ok: false, error: "Missing OAuth code" }, { status: 400 });
  // Next phase: exchange the one-time code server-side, encrypt tokens, fetch channel identity, and persist Connection.
  return NextResponse.json({ ok: true, provider: "youtube", connected: false, next: "token_exchange", codeReceived: true });
}
