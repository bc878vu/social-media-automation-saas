import { NextResponse } from "next/server";
import { processDueJobs } from "../../../../../worker/process-jobs";

export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  const auth = request.headers.get("authorization");
  if (secret && auth !== `Bearer ${secret}`) return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  try { const processed = await processDueJobs(20); return NextResponse.json({ ok: true, processed, at: new Date().toISOString() }); }
  catch (error) { return NextResponse.json({ ok: false, error: error instanceof Error ? error.message : "Cron failed" }, { status: 500 }); }
}
