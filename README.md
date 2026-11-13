# 4U'S TIPS — backend starter

This is a starter backend project, not a deployed or production-ready service.
It provides the initial API structure for the first account (`bm_updates`),
tips, and results. It is designed to allow additional tipsters later.

## Requirements
- Node.js 20+
- PostgreSQL database

## Local setup
1. Install dependencies: `npm install`
2. Copy `.env.example` to `.env` and fill in the database URL, a long random JWT secret, and CORS origin.
3. Generate Prisma client: `npm run db:generate`
4. Create the database tables: `npm run db:migrate`
5. Set `ADMIN_USERNAME=bm_updates`, `ADMIN_EMAIL=your-real-email`, and a strong `ADMIN_PASSWORD` in your local shell environment.
6. Create the first Super Admin: `npm run admin:create`
7. Start the API: `npm run dev`

Never send your password or `.env` file in chat. Do not commit `.env` to source control.

## Initial API routes
- `GET /health` — service health
- `POST /api/auth/login` — login with username and password
- `GET /api/auth/me` — current signed-in account (Bearer token)
- `GET /api/tips` — list tips (login required)
- `POST /api/tips` — publish a tip (login required)
- `PATCH /api/tips/:id/result` — set result (Super Admin only)

## Important before launch
This starter still needs production hardening: HTTPS, refresh-token/session strategy,
password reset, email verification, audit logs, stricter ownership/edit rules,
payment-provider integration, backups, monitoring, tests, and deployment configuration.
The current result endpoint is intentionally restricted to Super Admin.
