import { NextResponse } from "next/server";
import { z } from "zod";
import { createSession, ensureWorkspace, verifyPassword } from "../../../../../lib/auth";
import { prisma } from "../../../../../lib/prisma";

const schema = z.object({ email: z.string().email(), password: z.string().min(1) });
export async function POST(request: Request) {
  try {
    const input = schema.parse(await request.json());
    const user = await prisma.user.findUnique({ where: { email: input.email.toLowerCase() } });
    if (!user || !(await verifyPassword(input.password, user.passwordHash))) return NextResponse.json({ ok: false, error: "Invalid email or password" }, { status: 401 });
    await ensureWorkspace(user.id); await createSession(user.id);
    return NextResponse.json({ ok: true, user: { id: user.id, email: user.email, name: user.name } });
  } catch (error) { return NextResponse.json({ ok: false, error: error instanceof Error ? error.message : "Login failed" }, { status: 400 }); }
}
