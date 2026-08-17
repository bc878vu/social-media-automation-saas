import { decryptSecret } from "./crypto";
import { db } from "./db";
import type { Platform } from "./types";

export type LivePublishInput = { workspaceId: string; platform: Platform; title: string; caption: string; videoUrl: string; scheduledAt?: Date };

async function getConnection(workspaceId: string, platform: Platform) {
  const connection = await db.connection.findFirst({ where: { workspaceId, platform }, orderBy: { updatedAt: "desc" } });
  if (!connection?.accessToken) throw new Error(`No connected ${platform} account`);
  return { ...connection, token: decryptSecret(connection.accessToken) };
}

async function publishYouTube(input: LivePublishInput) {
  const connection = await getConnection(input.workspaceId, "YOUTUBE");
  const start = await fetch("https://www.googleapis.com/upload/youtube/v3/videos?uploadType=resumable&part=snippet,status", {
    method: "POST",
    headers: { authorization: `Bearer ${connection.token}`, "content-type": "application/json; charset=UTF-8", "x-upload-content-type": "video/mp4" },
    body: JSON.stringify({ snippet: { title: input.title.slice(0, 100), description: input.caption.slice(0, 5000) }, status: { privacyStatus: input.scheduledAt ? "private" : "public" } }),
  });
  const uploadUrl = start.headers.get("location");
  if (!start.ok || !uploadUrl) { const text = await start.text(); throw new Error(`YouTube upload init failed: ${text}`); }
  const video = await fetch(input.videoUrl);
  if (!video.ok) throw new Error("Unable to download generated video");
  const bytes = await video.arrayBuffer();
  const uploaded = await fetch(uploadUrl, { method: "PUT", headers: { "content-type": "video/mp4", "content-length": String(bytes.byteLength) }, body: bytes });
  const data = await uploaded.json();
  if (!uploaded.ok) throw new Error(data.error?.message || "YouTube upload failed");
  return { externalId: data.id as string, url: `https://www.youtube.com/watch?v=${data.id}` };
}

async function publishFacebook(input: LivePublishInput) {
  const connection = await getConnection(input.workspaceId, "FACEBOOK");
  const params = new URLSearchParams({ file_url: input.videoUrl, description: input.caption, access_token: connection.token });
  const response = await fetch(`https://graph.facebook.com/v23.0/${connection.accountId}/videos`, { method: "POST", headers: { "content-type": "application/x-www-form-urlencoded" }, body: params });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error?.message || "Facebook video publish failed");
  return { externalId: data.id as string, url: `https://www.facebook.com/${data.id}` };
}

async function publishInstagram(input: LivePublishInput) {
  const connection = await getConnection(input.workspaceId, "INSTAGRAM");
  const createParams = new URLSearchParams({ media_type: "REELS", video_url: input.videoUrl, caption: input.caption, access_token: connection.token });
  const created = await fetch(`https://graph.facebook.com/v23.0/${connection.accountId}/media`, { method: "POST", headers: { "content-type": "application/x-www-form-urlencoded" }, body: createParams });
  const container = await created.json();
  if (!created.ok || !container.id) throw new Error(container.error?.message || "Instagram media container failed");

  for (let i = 0; i < 12; i++) {
    const statusResponse = await fetch(`https://graph.facebook.com/v23.0/${container.id}?fields=status_code&access_token=${encodeURIComponent(connection.token)}`);
    const status = await statusResponse.json();
    if (status.status_code === "FINISHED") break;
    if (status.status_code === "ERROR" || status.status_code === "EXPIRED") throw new Error("Instagram media processing failed");
    await new Promise(resolve => setTimeout(resolve, 5000));
  }

  const publishParams = new URLSearchParams({ creation_id: container.id, access_token: connection.token });
  const published = await fetch(`https://graph.facebook.com/v23.0/${connection.accountId}/media_publish`, { method: "POST", headers: { "content-type": "application/x-www-form-urlencoded" }, body: publishParams });
  const data = await published.json();
  if (!published.ok) throw new Error(data.error?.message || "Instagram publish failed");
  return { externalId: data.id as string, url: `https://www.instagram.com/` };
}

export async function livePublish(input: LivePublishInput) {
  if (input.platform === "YOUTUBE") return publishYouTube(input);
  if (input.platform === "FACEBOOK") return publishFacebook(input);
  return publishInstagram(input);
}
