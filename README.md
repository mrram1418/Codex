# PromptForge

PromptForge is a production-oriented SaaS application that converts plain-English app requests into deployable starter projects using a robust template-driven generation engine. It includes authentication, quotas, billing wiring, admin operations, generation history, artifact preview/export, and analytics events.

## Implementation plan and progress

- [x] Phase 1: architecture + scaffolding
- [x] Phase 2: Prisma schema, auth wiring, marketing + app shell
- [x] Phase 3: generation engine, artifacts, project detail/export
- [x] Phase 4: Stripe checkout/portal/webhook wiring + plan gating
- [x] Phase 5: admin panel + audit/usage events
- [x] Phase 6: tests, CI, Docker, docs

## Architecture decisions

- **Stack:** Next.js App Router + TypeScript + Tailwind + Prisma + NextAuth + Stripe.
- **Auth:** NextAuth credentials provider with role-aware JWT/session callbacks.
- **Generation engine:** `GenerationService` orchestrates validation, quota checks, template rendering, artifact assembly, audit logging, and usage metering.
- **Billing model:** plan-based limits with Stripe checkout and customer portal endpoints; webhook sync updates subscriptions.
- **Security:** Zod input validation, role-protected admin route, webhook signature verification, no secret exposure to client by design.

## Key features shipped

- Premium marketing page (hero/features/pricing/FAQ)
- Login/register flow + protected dashboard
- Project generation flow with template selection and brand options
- Artifact preview and export endpoint
- Usage limits by plan (Free/Pro/Team)
- Stripe billing endpoints and webhook sync
- Admin console with users, generations, template status, system logs
- Audit log and usage event tracking

## Data model

Prisma schema includes:

- User
- Account
- Session
- VerificationToken
- Subscription
- Template
- Project
- Generation
- Artifact
- UsageEvent
- AuditLog
- AdminNote

Enums:

- Role
- ProjectType
- GenerationStatus
- Plan
- ArtifactType

## Local setup

1. Copy env file:
   ```bash
   cp .env.example .env
   ```
2. Start Postgres:
   ```bash
   docker compose up -d db
   ```
3. Install deps:
   ```bash
   npm install
   ```
4. Prisma setup:
   ```bash
   npm run prisma:generate
   npm run prisma:migrate -- --name init
   npm run prisma:seed
   ```
5. Run app:
   ```bash
   npm run dev
   ```

## Demo credentials

- Admin: `admin@promptforge.dev` / `PromptForge123!`
- User: `demo@promptforge.dev` / `PromptForge123!`

## Stripe setup

1. Create products/prices for Pro and Team.
2. Add IDs to `.env`:
   - `STRIPE_PRICE_PRO`
   - `STRIPE_PRICE_TEAM`
3. Run Stripe CLI webhook forwarding:
   ```bash
   stripe listen --forward-to localhost:3000/api/stripe/webhook
   ```
4. Put the webhook secret into `STRIPE_WEBHOOK_SECRET`.

## Auth setup

- Set `NEXTAUTH_SECRET` to a random 32+ byte string.
- For production, use HTTPS and secure cookie defaults in your deployment environment.

## Deployment (Vercel + managed Postgres)

1. Provision Postgres (Neon/Supabase/RDS).
2. Add env vars from `.env.example` in Vercel Project Settings.
3. Deploy app.
4. Run Prisma migrations on deployed DB.
5. Configure Stripe webhook endpoint to `/api/stripe/webhook`.

## Commands

- `npm run dev` – local development
- `npm run build` – production build
- `npm run lint` – linting
- `npm run typecheck` – strict TypeScript checks
- `npm run test` – unit/integration tests
- `npm run test:e2e` – Playwright e2e

## Admin bootstrap instructions

- Seed script provisions an admin account automatically.
- Promote an existing user manually in DB by setting `role = ADMIN`.

## Notes

This MVP uses extensible interfaces for generation logic so an LLM-backed renderer can replace template renderers later without changing the project/generation lifecycle.
