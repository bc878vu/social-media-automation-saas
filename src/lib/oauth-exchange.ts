export async function exchangeYouTubeCode(code: string) {
  const body = new URLSearchParams({
    code,
    client_id: process.env.YOUTUBE_CLIENT_ID ?? "",
    client_secret: process.env.YOUTUBE_CLIENT_SECRET ?? "",
    redirect_uri: process.env.YOUTUBE_REDIRECT_URI ?? "",
    grant_type: "authorization_code",
  });
  const response = await fetch("https://oauth2.googleapis.com/token", { method: "POST", headers: { "content-type": "application/x-www-form-urlencoded" }, body });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error_description || data.error || "YouTube token exchange failed");
  return data as { access_token: string; refresh_token?: string; expires_in: number; scope: string; token_type: string };
}

export async function getYouTubeChannel(accessToken: string) {
  const response = await fetch("https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&mine=true", { headers: { authorization: `Bearer ${accessToken}` }, cache: "no-store" });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error?.message || "Unable to read YouTube channel");
  const channel = data.items?.[0];
  if (!channel) throw new Error("No YouTube channel found for this account");
  return { id: channel.id as string, name: channel.snippet?.title ?? "YouTube channel" };
}

export async function exchangeMetaCode(code: string) {
  const params = new URLSearchParams({
    client_id: process.env.META_APP_ID ?? "",
    client_secret: process.env.META_APP_SECRET ?? "",
    redirect_uri: process.env.META_REDIRECT_URI ?? "",
    code,
  });
  const response = await fetch(`https://graph.facebook.com/v23.0/oauth/access_token?${params}`, { cache: "no-store" });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error?.message || "Meta token exchange failed");
  return data as { access_token: string; token_type: string; expires_in?: number };
}

export async function getMetaPages(accessToken: string) {
  const response = await fetch("https://graph.facebook.com/v23.0/me/accounts?fields=id,name,access_token,instagram_business_account&limit=100", { headers: { authorization: `Bearer ${accessToken}` }, cache: "no-store" });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error?.message || "Unable to read Meta Pages");
  return (data.data ?? []) as Array<{ id: string; name: string; access_token: string; instagram_business_account?: { id: string } }>;
}
