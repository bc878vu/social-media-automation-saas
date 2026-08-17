import { processDueJobs } from "./process-jobs";

const intervalMs = Number(process.env.WORKER_INTERVAL_MS ?? 30_000);

async function tick() {
  try {
    const count = await processDueJobs();
    console.log(`[worker] processed=${count} at ${new Date().toISOString()}`);
  } catch (error) {
    console.error("[worker] tick failed", error);
  }
}

console.log("[worker] AutoPilot Social worker started");
void tick();
setInterval(() => void tick(), intervalMs);
