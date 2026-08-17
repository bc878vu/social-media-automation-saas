import { Queue } from "bullmq";
import IORedis from "ioredis";

let connection: IORedis | null = null;
let publishQueue: Queue | null = null;

function getQueue() {
  if (!process.env.REDIS_URL) return null;
  if (!connection) connection = new IORedis(process.env.REDIS_URL, { maxRetriesPerRequest: null });
  if (!publishQueue) publishQueue = new Queue("publish", { connection });
  return publishQueue;
}

export async function enqueuePublish(jobId: string, delayMs = 0) {
  const queue = getQueue();
  if (!queue) return { queued: false, mode: "database-worker" };
  await queue.add("publish", { jobId }, { jobId, delay: Math.max(0, delayMs), attempts: 4, backoff: { type: "exponential", delay: 5000 }, removeOnComplete: 1000, removeOnFail: 2000 });
  return { queued: true, mode: "redis" };
}
