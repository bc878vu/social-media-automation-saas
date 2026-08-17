export function youtubeAuthUrl(state: string) {
  const params = new URLSearchParams({
    client_id: process.env.YOUTUBE_CLIENT_ID ?? "",
    redirect_uri: process.env.YOUTUBE_REDIRECT_URI ?? "",
    response_type: "code",
    access_type: "offline",
    prompt: "consent",
    scope: "https://www.googleapis.com/auth/youtube.upload https://www.googleapis.com/auth/youtube.readonly",
    state,
  });
  return `https://accounts.google.com/o/oauth2/v2/auth?${params}`;
}

export function metaAuthUrl(state: string) {
  const params = new URLSearchParams({
    client_id: process.env.META_APP_ID ?? "",
    redirect_uri: process.env.META_REDIRECT_URI ?? "",
    response_type: "code",
    scope: "pages_manage_posts,pages_read_engagement,instagram_basic,instagram_content_publish",
    state,
  });
  return `https://www.facebook.com/v23.0/dialog/oauth?${params}`;
}
