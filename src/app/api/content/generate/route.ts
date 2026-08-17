import { NextResponse } from "next/server";
import { z } from "zod";
import { generateContent } from "../../../../lib/ai";

const schema = z.object({ topic: z.string().min(2).max(200) });

export async function POST(request: Request) {
  try {
    const { topic } = schema.parse(await request.json());
    return NextResponse.json({ ok: true, content: await generateContent(topic) });
  } catch (error) {
    return NextResponse.json({ ok: false, error: error instanceof Error ? error.message : "Invalid request" }, { status: 400 });
  }
}
