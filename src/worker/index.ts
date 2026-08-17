import { processDueJobs } from "./process-jobs";
import { startRedisWorker } from "./redis-worker";

const intervalMs = Number(process.env.WORKER_INTERVAL_MS ?? 30_000);
const redisWorker = startRedisWorker();

async function tick() {
  if (redisWorker) return;
  try { const count = await processDueJobs(); console.log(`[worker] processed=${count} at ${new Date().toISOString()}`); }
  catch (error) { console.error("[worker] tick failed", error); }
}

console.log(`[worker] AutoPilot Social started mode=${redisWorker ? "redis" : "database"}`);
void tick();
setInterval(() => void tick(), intervalMs);
