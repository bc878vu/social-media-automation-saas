import { cookies } from "next/headers";
import crypto from "node:crypto";
import bcrypt from "bcryptjs";
import { prisma } from "./prisma";

const SESSION_COOKIE = "aps_session";
const days = 30;

function hashToken(token: string) { return crypto.createHash("sha256").update(token).digest("hex"); }

export async function createSession(userId: string) {
  const token = crypto.randomBytes(32).toString("hex");
  await prisma.session.create({ data: { userId, tokenHash: hashToken(token), expiresAt: new Date(Date.now() + days * 86400000) } });
  const store = await cookies();
  store.set(SESSION_COOKIE, token, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: days * 86400 });
  return token;
}

export async function currentUser() {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!token) return null;
  const session = await prisma.session.findUnique({ where: { tokenHash: hashToken(token) }, include: { user: true } });
  if (!session || session.expiresAt < new Date()) return null;
  return session.user;
}

export async function destroySession() {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (token) await prisma.session.deleteMany({ where: { tokenHash: hashToken(token) } });
  store.delete(SESSION_COOKIE);
}

export async function hashPassword(password: string) { return bcrypt.hash(password, 12); }
export async function verifyPassword(password: string, hash: string) { return bcrypt.compare(password, hash); }

export async function ensureWorkspace(userId: string) {
  const membership = await prisma.workspaceMember.findFirst({ where: { userId }, include: { workspace: true } });
  if (membership) return membership.workspace;
  return prisma.$transaction(async tx => {
    const workspace = await tx.workspace.create({ data: { name: "Creator Studio", niche: "AI & Technology" } });
    await tx.workspaceMember.create({ data: { userId, workspaceId: workspace.id, role: "OWNER" } });
    return workspace;
  });
}
