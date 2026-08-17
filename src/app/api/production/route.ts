import { NextResponse } from "next/server";
import { z } from "zod";
import { produceShort } from "../../../lib/media/production";

const schema = z.object({ topic: z.string().min(2).max(200) });

export async function POST(request: Request) {
  try {
    const { topic } = schema.parse(await request.json());
    const result = await produceShort(topic);
    return NextResponse.json({ ok: true, result });
  } catch (error) {
    return NextResponse.json({ ok: false, error: error instanceof Error ? error.message : "Production failed" }, { status: 400 });
  }
}
