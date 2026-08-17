# AutoPilot Social — Social Media Automation SaaS

An automation-first SaaS for generating, producing, scheduling, publishing, and analyzing content across YouTube, Instagram, and Facebook Pages using official APIs.

## Built so far
- Next.js + TypeScript dashboard
- Automation setup and content queue UI
- PostgreSQL + Prisma data model
- Workspace, automation, content, connection, publish-job and audit-log APIs
- Signed OAuth state with CSRF protection
- YouTube OAuth code exchange + channel discovery
- Meta OAuth code exchange + Facebook Page / Instagram account discovery
- AES-256-GCM encrypted OAuth token storage
- Live YouTube upload adapter
- Live Facebook Page video adapter
- Live Instagram Reels adapter
- Durable scheduled publish worker with retries and audit logs
- Mock adapters for development without credentials
- PostgreSQL + Redis Docker stack
- CI workflow

## Production flow
`Research → AI script → voice → visuals → video render → thumbnail/SEO → policy check → schedule → official API publish → analytics → optimization`

## Important production requirements
1. Configure official developer applications and OAuth credentials for each platform.
2. Set `OAUTH_STATE_SECRET` and `TOKEN_ENCRYPTION_KEY` to long random server-side secrets.
3. Use HTTPS and exact production OAuth redirect URIs.
4. Configure durable object/media storage and a production PostgreSQL instance.
5. Run the worker as a separate always-on process.
6. Complete platform app review/permissions and verify current API versions/quotas before enabling public production publishing.
7. Add an authenticated user/session layer before opening the SaaS to multiple customers. The current workspace API is intentionally a development-stage control plane.

YouTube's current web-server OAuth guidance recommends the server-side OAuth flow, secure token storage, state validation, and the `youtube.upload` scope for video management. cite_placeholder

## Run locally
```bash
npm install
cp .env.example .env.local
npm run dev
```

For local infrastructure:
```bash
docker compose up -d
npx prisma generate
npx prisma db push
```

Open `http://localhost:3000` and `/connections` for platform setup.

## Environment
See `.env.example`.
