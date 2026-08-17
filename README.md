# Social Media Automation SaaS

An automation-first SaaS for generating, reviewing, scheduling, publishing, and analyzing social content across YouTube, Instagram, and Facebook Pages through official APIs.

## Current build
- Next.js + TypeScript dashboard
- Automation setup and content queue UI
- Content pipeline state model
- API routes for automation generation and queue actions
- Platform adapter layer with mock publishing
- Prisma/PostgreSQL schema
- Redis/worker-ready architecture
- OAuth connection placeholders (no platform passwords)
- Audit-friendly job model

## Production integrations
Real publishing requires each platform's official OAuth credentials, app review/permissions, storage, AI provider, and production queue/worker configuration. The code is structured so those adapters can be enabled without changing the dashboard.

## Run
```bash
npm install
cp .env.example .env.local
npm run dev
```

Open http://localhost:3000.

## Environment
See `.env.example`.
