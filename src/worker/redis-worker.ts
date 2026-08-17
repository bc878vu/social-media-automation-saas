import { Worker } from "bullmq";
import IORedis from "ioredis";
import { prisma } from "../lib/prisma";
import { livePublish } from "../lib/live-publish";

export function startRedisWorker() {
  if (!process.env.REDIS_URL) return null;
  const connection = new IORedis(process.env.REDIS_URL, { maxRetriesPerRequest: null });
  const worker = new Worker("publish", async job => {
    const publishJob = await prisma.publishJob.findUnique({ where: { id: job.data.jobId }, include: { content: true } });
    if (!publishJob || publishJob.status === "PUBLISHED") return;
    await prisma.publishJob.update({ where: { id: publishJob.id }, data: { status: "PROCESSING", attempts: { increment: 1 } } });
    try {
      const result = await livePublish({ workspaceId: publishJob.content.workspaceId, platform: publishJob.platform, title: publishJob.content.title, caption: publishJob.content.caption || "", videoUrl: publishJob.content.videoUrl || "" });
      await prisma.$transaction([prisma.publishJob.update({ where: { id: publishJob.id }, data: { status: "PUBLISHED", externalId: result.externalId } }), prisma.content.update({ where: { id: publishJob.contentId }, data: { status: "PUBLISHED", publishedAt: new Date() } })]);
    } catch (error) {
      await prisma.publishJob.update({ where: { id: publishJob.id }, data: { status: "FAILED", lastError: error instanceof Error ? error.message : "Publish failed" } });
      throw error;
    }
  }, { connection, concurrency: Number(process.env.WORKER_CONCURRENCY || 2) });
  worker.on("completed", job => console.log(`[redis-worker] completed ${job.id}`));
  worker.on("failed", (job, err) => console.error(`[redis-worker] failed ${job?.id}`, err));
  return worker;
}
