# AutoPilot Social — Social Media Automation SaaS

Automation-first SaaS for researching topics, generating content, producing media, scheduling and publishing to YouTube, Instagram and Facebook Pages through official APIs.

## Production stack
- Next.js + React + TypeScript
- PostgreSQL + Prisma
- Redis + BullMQ with database-worker fallback
- S3/Cloudflare R2-compatible media storage
- FFmpeg rendering worker
- Secure cookie sessions + bcrypt password hashing
- OAuth state/CSRF protection + encrypted platform tokens
- OpenAI-compatible content generation adapter
- ElevenLabs TTS adapter
- Pexels licensed visual search adapter
- NewsAPI + YouTube trend research adapters
- Official YouTube / Meta publishing adapters
- Scheduled cron fallback and durable publish queue
- Analytics + trends data model

## End-to-end pipeline
`Trend research → topic selection → script → voice → visuals → subtitles → FFmpeg render → thumbnail/SEO → content database → scheduler → official API publish → analytics → optimization`

## What is real vs configurable
The application contains real provider integrations and production boundaries, but third-party services require your own API credentials, approved OAuth apps, quotas and storage. Without credentials the system deliberately falls back to safe mock/deterministic generation instead of pretending that a post was published.

No social-media passwords are collected. Publishing uses official OAuth/API connections only.

## Local setup
```bash
npm install
cp .env.example .env.local
npm run db:generate
docker compose up -d
npm run db:push
npm run dev
```

Open `http://localhost:3000/login` to create an account, then configure the workspace and platform connections.

For the rendering worker, use the included `Dockerfile.worker` and run `npm run worker` in a persistent worker environment. Vercel can host the Next.js web/API layer; FFmpeg and long-running Redis workers should run separately.

## Production environment
Configure all required values in `.env.example`, especially:
- `DATABASE_URL`, `REDIS_URL`
- `TOKEN_ENCRYPTION_KEY`, `OAUTH_STATE_SECRET`, `CRON_SECRET`
- AI/TTS/trend/visual provider keys
- S3-compatible storage credentials
- YouTube and Meta OAuth credentials

Use exact production redirect URLs and HTTPS. Complete platform app review and verify current API permissions, quotas and publishing requirements before enabling public production publishing.

## Security
- Passwords are hashed with bcrypt.
- Sessions use HTTP-only secure cookies.
- OAuth state is signed and short-lived.
- Platform tokens are encrypted at rest.
- Workspace ownership is checked server-side for authenticated endpoints.
- Scheduled jobs are idempotent and retried with bounded backoff.
- Cron endpoint can be protected with `CRON_SECRET`.
- No platform passwords are stored.
