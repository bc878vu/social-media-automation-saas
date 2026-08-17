import { NextResponse } from "next/server";
import { z } from "zod";
import { publishTo } from "@/lib/platforms";
import { livePublish } from "@/lib/live-publish";

const schema = z.object({
  workspaceId: z.string().optional(),
  platform: z.enum(["YOUTUBE", "INSTAGRAM", "FACEBOOK"]),
  title: z.string().min(1).max(200),
  caption: z.string().min(1).max(10000),
  videoUrl: z.string().url(),
  scheduledAt: z.string().datetime().optional(),
  mode: z.enum(["live", "mock"]).default("live"),
});

export async function POST(request: Request) {
  try {
    const input = schema.parse(await request.json());
    if (input.mode === "mock" || !input.workspaceId) {
      const result = await publishTo(input.platform, input);
      return NextResponse.json({ ok: true, result, mode: "mock" });
    }
    const result = await livePublish({ ...input, workspaceId: input.workspaceId, scheduledAt: input.scheduledAt ? new Date(input.scheduledAt) : undefined });
    return NextResponse.json({ ok: true, result, mode: "live" });
  } catch (error) {
    return NextResponse.json({ ok: false, error: error instanceof Error ? error.message : "Publish failed" }, { status: 400 });
  }
}
