import { NextResponse } from "next/server";
import { z } from "zod";
import { createSession, ensureWorkspace, hashPassword } from "../../../../../lib/auth";
import { prisma } from "../../../../../lib/prisma";

const schema = z.object({ email: z.string().email(), password: z.string().min(8).max(100), name: z.string().min(1).max(80).optional() });
export async function POST(request: Request) {
  try {
    const input = schema.parse(await request.json());
    if (await prisma.user.findUnique({ where: { email: input.email.toLowerCase() } })) return NextResponse.json({ ok: false, error: "Email already registered" }, { status: 409 });
    const user = await prisma.user.create({ data: { email: input.email.toLowerCase(), name: input.name, passwordHash: await hashPassword(input.password) } });
    await ensureWorkspace(user.id);
    await createSession(user.id);
    return NextResponse.json({ ok: true, user: { id: user.id, email: user.email, name: user.name } });
  } catch (error) { return NextResponse.json({ ok: false, error: error instanceof Error ? error.message : "Registration failed" }, { status: 400 }); }
}
