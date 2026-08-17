# Architecture

## Product pipeline

`Workspace → Research → Ideas → Script → Voice → Visuals → Video → Thumbnail/SEO → Review/Policy → Scheduler → Publish → Analytics → Optimization`

## Services

- **Web**: Next.js dashboard and API routes.
- **Database**: PostgreSQL + Prisma for workspaces, automations, content, connections, jobs and audit logs.
- **Worker**: long-running process for generation, rendering, publishing and retries.
- **Queue**: Redis-compatible queue for durable asynchronous work.
- **Media**: S3-compatible storage for generated video, audio, images and thumbnails.
- **AI**: provider adapter. The repository starts with a deterministic mock generator so the UI works without credentials.
- **Platforms**: official OAuth/API adapters only. Password collection is intentionally unsupported.

## Automation rules

Each automation owns a niche, cadence, post count, target platforms and approval policy. A production scheduler creates jobs ahead of the requested publish time and claims each job exactly once. Failed jobs use bounded retries with exponential backoff and every state transition is auditable.

## Live platform rollout

1. Create official YouTube and Meta developer apps.
2. Configure OAuth redirect URLs and required permissions.
3. Store tokens encrypted at rest and rotate refresh tokens where supported.
4. Implement each adapter against current official APIs and validate quotas.
5. Add media upload/publish flows and platform-specific constraints.
6. Add webhook/insights ingestion where available.
7. Enable production publishing only after app review and policy checks.

The mock adapters are deliberately separated from the dashboard so production credentials can be added without redesigning the product.
