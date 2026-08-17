import { NextResponse } from "next/server";
import { currentUser, ensureWorkspace } from "../../../../../lib/auth";
export async function GET() { const user = await currentUser(); if (!user) return NextResponse.json({ ok: false, user: null }, { status: 401 }); const workspace = await ensureWorkspace(user.id); return NextResponse.json({ ok: true, user: { id: user.id, email: user.email, name: user.name }, workspace }); }
