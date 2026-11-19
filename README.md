# Canadian Plans CRM

One backend and one admin for every Canadian Plans website. Each website lives
in its own repository and sends its leads and orders to the backend with its
own key; staff work all of them from one CRM.

**Start with [AGENTS.md](AGENTS.md)** (rules, commands, where things live),
then [docs/CANADIAN_PLANS.md](docs/CANADIAN_PLANS.md) (where this code came
from, what was changed for Canadian Plans, what is not set up yet and what
comes next) and [docs/ENV.md](docs/ENV.md) (every variable).
[docs/PLAN.md](docs/PLAN.md) and [docs/HANDOFF.md](docs/HANDOFF.md) are the
inherited design record.

| Path           | What it is                                                                                                   |
| -------------- | ------------------------------------------------------------------------------------------------------------ |
| `apps/backend` | Express + strict TypeScript API. The only database client. Docker image on Railway.                          |
| `apps/admin`   | Next.js CRM for staff. Backend API client only. Vercel.                                                      |
| `packages/*`   | Shared code: contracts (Zod + typed client), db (Drizzle + RLS), types, adapters, ui, config, observability. |
| `jobs`         | Outbox job handlers; the backup, monitor, retention and restore CLIs.                                        |
| `docs/`        | Handoff, plan, environment variables, runbooks, the generated OpenAPI document.                              |

Websites live in their own repositories and never hold a database key.
