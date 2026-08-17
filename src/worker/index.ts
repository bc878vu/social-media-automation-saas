/**
 * Background worker entrypoint.
 *
 * In production this process consumes PublishJob rows from PostgreSQL/Redis,
 * renders media with FFmpeg, and calls the official platform adapters.
 */

const intervalMs = Number(process.env.WORKER_INTERVAL_MS ?? 30_000);

async function tick() {
  console.log(`[worker] heartbeat ${new Date().toISOString()}`);
  // TODO: claim due PublishJob records atomically, process them, retry failures,
  // and write AuditLog entries. Keep this process separate from the web server.
}

console.log("[worker] AutoPilot Social worker started");
void tick();
setInterval(() => void tick(), intervalMs);
