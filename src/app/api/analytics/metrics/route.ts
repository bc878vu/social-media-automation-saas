import { NextResponse } from "next/server";
import { z } from "zod";
import { currentUser, ensureWorkspace } from "../../../../../lib/auth";
import { prisma } from "../../../../../lib/prisma";

const schema = z.object({ contentId: z.string().optional(), platform: z.enum(["YOUTUBE","INSTAGRAM","FACEBOOK"]), externalId: z.string().optional(), views: z.number().int().nonnegative().default(0), likes: z.number().int().nonnegative().default(0), comments: z.number().int().nonnegative().default(0), shares: z.number().int().nonnegative().default(0), watchTime: z.number().nonnegative().default(0) });
export async function POST(request: Request) {
  const user = await currentUser(); if (!user) return NextResponse.json({ok:false,error:"Authentication required"},{status:401});
  try { const input = schema.parse(await request.json()); const workspace = await ensureWorkspace(user.id); if (input.contentId) { const c = await prisma.content.findFirst({where:{id:input.contentId,workspaceId:workspace.id}}); if(!c) return NextResponse.json({ok:false,error:"Content not found"},{status:404}); } const metric = await prisma.metric.create({data:{...input,workspaceId:workspace.id}}); return NextResponse.json({ok:true,metric}); }
  catch(error){return NextResponse.json({ok:false,error:error instanceof Error?error.message:"Invalid metrics"},{status:400});}
}
