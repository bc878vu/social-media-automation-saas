# AI Production Engine

The production pipeline is now separated into provider-neutral stages:

1. **Content** — topic → script/caption/hashtags.
2. **Voice** — `VoiceProvider` interface. Development uses a deterministic mock; production providers can return stored audio assets.
3. **Visuals** — `DEFAULT_VISUAL_PATH` is the development asset boundary. A production visual provider should create licensed/owned images or clips and return their storage keys.
4. **Subtitles** — script sentences become SRT cues.
5. **Render** — FFmpeg worker produces vertical 1080×1920 MP4 with H.264 and faststart.
6. **Subtitle burn-in** — SRT is burned into the final video.
7. **Thumbnail** — deterministic `ThumbnailSpec` is generated for a real image provider.
8. **Queue** — the resulting media asset can be attached to a `PublishJob` for the existing scheduler.

## Production requirements

- Run media jobs on the FFmpeg-enabled worker, not the Vercel web runtime.
- Replace local storage with S3/R2/GCS before multi-instance production.
- Use a real TTS provider and persist its audio output.
- Use only licensed/owned visual assets or a provider with the necessary commercial rights.
- Add moderation/copyright/brand-safety checks before auto-publishing.
- Keep platform credentials in encrypted server-side storage.
