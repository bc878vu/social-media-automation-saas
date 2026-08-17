import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "../../../../lib/db";
import { buildProductionBundle } from "../../../../lib/production/pipeline";

const schema = z.object({
  workspaceId: z.string().min(1),
  automationId: z.string().optional(),
  niche: z.string().min(2).max(120),
  platforms: z.array(z.enum(["YOUTUBE", "INSTAGRAM", "FACEBOOK"])).min(1),
  scheduledAt: z.string().datetime().optional(),
});

export async function POST(request: Request) {
  try {
    const input = schema.parse(await request.json());
    const bundle = await buildProductionBundle(input.niche);
    const scheduledAt = input.scheduledAt ? new Date(input.scheduledAt) : new Date(Date.now() + 60 * 60 * 1000);

    const content = await db.content.create({
      data: {
        workspaceId: input.workspaceId,
        automationId: input.automationId,
        title: bundle.seo.title,
        topic: bundle.trend.topic,
        script: JSON.stringify(bundle.script),
        caption: bundle.seo.description,
        hashtags: bundle.seo.hashtags,
        status: "READY",
        scheduledAt,
      },
    });

    await db.publishJob.createMany({
      data: input.platforms.map(platform => ({ contentId: content.id, platform, runAt: scheduledAt })),
    });

    await db.content.update({ where: { id: content.id }, data: { status: "SCHEDULED" } });
    return NextResponse.json({ ok: true, contentId: content.id, scheduledAt, jobs: input.platforms.length, production: bundle });
  } catch (error) {
    return NextResponse.json({ ok: false, error: error instanceof Error ? error.message : "Unable to queue production" }, { status: 400 });
  }
}
