import { createHash } from "node:crypto";
import { promises as fs } from "node:fs";
import path from "node:path";

export type StoredMedia = { key: string; path: string; url: string; sha256: string; size: number };

/** Local storage adapter for development. Replace with S3/R2/GCS adapter in production. */
export async function storeLocal(buffer: Buffer, key: string): Promise<StoredMedia> {
  const root = process.env.MEDIA_ROOT ?? path.join(process.cwd(), "storage");
  const safeKey = key.replace(/[^a-zA-Z0-9._/-]/g, "_");
  const filePath = path.join(root, safeKey);
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, buffer);
  const sha256 = createHash("sha256").update(buffer).digest("hex");
  return { key: safeKey, path: filePath, url: `/media/${safeKey}`, sha256, size: buffer.byteLength };
}
