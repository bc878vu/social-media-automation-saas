# AI Production Engine

The production pipeline is now split into independently replaceable stages:

1. **Trend research** — `src/lib/production/trends.ts`
2. **Script planning** — `src/lib/production/script.ts`
3. **Voice** — `src/lib/production/voice.ts`
4. **Visual planning** — `src/lib/production/visuals.ts`
5. **Subtitles/SRT** — `src/lib/production/subtitles.ts`
6. **Thumbnail planning** — `src/lib/production/thumbnail.ts`
7. **SEO metadata** — `src/lib/production/seo.ts`
8. **FFmpeg rendering** — `src/lib/production/render.ts`
9. **Orchestration** — `src/lib/production/pipeline.ts`
10. **Queue persistence** — `src/app/api/production/queue/route.ts`

## Provider boundaries

The repository does not store AI-provider secrets or social passwords. Voice, visual generation and trend providers are adapters. Production credentials belong in environment variables/secrets and should be scoped to the minimum permissions required.

The current voice implementation is a safe mock adapter, while the render module calls the configured FFmpeg binary. This allows the worker architecture to be tested before connecting paid generation providers.

## Production rollout

- Connect a TTS provider adapter.
- Connect a licensed/owned visual generation or asset provider.
- Persist generated media in S3-compatible storage.
- Replace the placeholder FFmpeg input with the generated scene assets, voice track and SRT subtitles.
- Generate a real thumbnail asset and persist its URL.
- Add content safety/quality checks before auto-approval.
- Queue platform-specific publish jobs only after all required media exists.
