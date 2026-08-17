import { db } from "@/lib/db";
import { livePublish } from "@/lib/live-publish";

export async function processDueJobs(limit = 5) {
  const jobs = await db.publishJob.findMany({ where: { status: "queued", runAt: { lte: new Date() } }, orderBy: { runAt: "asc" }, take: limit, include: { content: true } });
  let processed = 0;

  for (const job of jobs) {
    const claimed = await db.publishJob.updateMany({ where: { id: job.id, status: "queued" }, data: { status: "processing", attempts: { increment: 1 } } });
    if (!claimed.count) continue;
    try {
      if (!job.content.videoUrl) throw new Error("Content has no rendered video URL");
      const result = await livePublish({ workspaceId: job.content.workspaceId, platform: job.platform, title: job.content.title, caption: job.content.caption ?? "", videoUrl: job.content.videoUrl, scheduledAt: job.content.scheduledAt ?? undefined });
      await db.$transaction([
        db.publishJob.update({ where: { id: job.id }, data: { status: "published", externalId: result.externalId, lastError: null } }),
        db.content.update({ where: { id: job.contentId }, data: { status: "PUBLISHED", publishedAt: new Date(), platformIds: { [job.platform]: result.externalId } } }),
        db.auditLog.create({ data: { workspaceId: job.content.workspaceId, action: "publish.success", entityType: "PublishJob", entityId: job.id, metadata: result } }),
      ]);
      processed++;
    } catch (error) {
      const message = error instanceof Error ? error.message : "Publish failed";
      const retry = job.attempts < 3;
      await db.publishJob.update({ where: { id: job.id }, data: { status: retry ? "queued" : "failed", lastError: message, ...(retry ? { runAt: new Date(Date.now() + job.attempts * 60_000) } : {}) } });
      await db.auditLog.create({ data: { workspaceId: job.content.workspaceId, action: "publish.failure", entityType: "PublishJob", entityId: job.id, metadata: { message, retry } } });
    }
  }
  return processed;
}
