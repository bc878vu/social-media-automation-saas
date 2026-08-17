import { NextResponse } from "next/server";
import { z } from "zod";
import { buildProductionBundle } from "../../../../lib/production/pipeline";

const schema = z.object({ niche: z.string().min(2).max(120) });

export async function POST(request: Request) {
  try {
    const { niche } = schema.parse(await request.json());
    const bundle = await buildProductionBundle(niche);
    return NextResponse.json({ ok: true, bundle });
  } catch (error) {
    return NextResponse.json({ ok: false, error: error instanceof Error ? error.message : "Production pipeline failed" }, { status: 400 });
  }
}
