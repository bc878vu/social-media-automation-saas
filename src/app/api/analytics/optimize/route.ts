import { NextResponse } from "next/server";
import { currentUser, ensureWorkspace } from "../../../../../lib/auth";
import { recommendNextContent } from "../../../../../lib/optimization";
export async function GET() { const user = await currentUser(); if (!user) return NextResponse.json({ ok:false,error:"Authentication required"},{status:401}); const workspace = await ensureWorkspace(user.id); return NextResponse.json({ ok:true, ...(await recommendNextContent(workspace.id)) }); }
