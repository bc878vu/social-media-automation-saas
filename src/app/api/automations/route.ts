import { NextResponse } from "next/server";
import { z } from "zod";
import { generateContent } from "../../../../lib/ai";

const schema = z.object({
  niche: z.string().min(2).max(120),
  postsPerDay: z.number().int().min(1).max(10),
  frequency: z.string().min(2),
  platforms: z.array(z.enum(["YouTube", "Instagram", "Facebook"]).or(z.enum(["YOUTUBE", "INSTAGRAM", "FACEBOOK"]))).min(1),
  autoApprove: z.boolean().optional(),
});

export async function POST(request: Request) {
  try {
    const input = schema.parse(await request.json());
    const generated = await generateContent(input.niche);
    return NextResponse.json({ ok: true, automation: { ...input, status: "ACTIVE" }, sampleContent: generated });
  } catch (error) {
    return NextResponse.json({ ok: false, error: error instanceof Error ? error.message : "Invalid request" }, { status: 400 });
  }
}

export async function GET() {
  return NextResponse.json({ ok: true, automations: [], mode: "demo" });
}
