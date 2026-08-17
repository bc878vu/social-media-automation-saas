import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const client = process.env.S3_ENDPOINT ? new S3Client({ region: process.env.S3_REGION || "auto", endpoint: process.env.S3_ENDPOINT, forcePathStyle: true, credentials: { accessKeyId: process.env.S3_ACCESS_KEY || "", secretAccessKey: process.env.S3_SECRET_KEY || "" } }) : null;

export async function createUploadUrl(key: string, contentType: string) {
  if (!client || !process.env.S3_BUCKET) return null;
  return getSignedUrl(client, new PutObjectCommand({ Bucket: process.env.S3_BUCKET, Key: key, ContentType: contentType }), { expiresIn: 900 });
}

export async function uploadBuffer(key: string, buffer: Buffer, contentType: string) {
  if (!client || !process.env.S3_BUCKET) throw new Error("S3 storage is not configured");
  await client.send(new PutObjectCommand({ Bucket: process.env.S3_BUCKET, Key: key, Body: buffer, ContentType: contentType }));
  return process.env.S3_PUBLIC_BASE_URL ? `${process.env.S3_PUBLIC_BASE_URL.replace(/\/$/, "")}/${key}` : key;
}
