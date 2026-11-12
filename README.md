# Canadian Plans CRM

One backend and one admin for every Canadian Plans website. Each website lives
in its own repository and sends its leads and orders to the backend with its
own key; staff work all of them from one CRM.

**Start with [docs/CANADIAN_PLANS.md](docs/CANADIAN_PLANS.md).** It says where
this code came from, what was changed for Canadian Plans, what is not set up
yet and what comes next. [docs/PLAN.md](docs/PLAN.md) and
[docs/HANDOFF.md](docs/HANDOFF.md) are the inherited design record.

| Path           | What it is                                                                                            |
| -------------- | ----------------------------------------------------------------------------------------------------- |
| `apps/backend` | Express + strict TypeScript API. The only database client. Docker image on Railway.                   |
| `apps/admin`   | Next.js CRM for staff. Backend API client only. Vercel.                                               |
| `packages/*`   | Shared code: contracts (Zod + typed client), db (Drizzle + RLS), adapters, ui, config, observability. |
| `docs/`        | Plan, decisions, runbooks.                                                                            |

Websites live in their own repositories and never hold a database key.
