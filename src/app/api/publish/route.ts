import { NextResponse } from "next/server";
import { z } from "zod";
import { publishTo } from "@/lib/platforms";

const schema = z.object({
  platform: z.enum(["YOUTUBE", "INSTAGRAM", "FACEBOOK"]),
  title: z.string().min(1),
  caption: z.string().min(1),
  videoUrl: z.string().url().optional(),
});

export async function POST(request: Request) {
  try {
    const input = schema.parse(await request.json());
    const result = await publishTo(input.platform, input);
    return NextResponse.json({ ok: true, result, mode: "mock" });
  } catch (error) {
    return NextResponse.json({ ok: false, error: error instanceof Error ? error.message : "Publish failed" }, { status: 400 });
  }
}
