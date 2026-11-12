# Canadian Plans CRM: state of this repository

Written 2026-11-12, when the repository was created. Keep it current.

## Where this came from

This is a copy of the GT Sales CRM (`GT-Sales/crm`, `main` at `fadda10`, PR 52),
made on 2026-11-12 at the owner's request, with a fresh git history. The GT
Sales CRM was itself copied from the Canadian Plans platform
(`Canadian-Plans/canadianplans-web-app`) on 2026-10-25 and then grew the CRM
features: leads inbox and board, properties, saved views, plans, order tools,
customer email, order tracking, automations, reports, the AI assistant and
backups.

The two repositories are now separate. A fix made in one does not reach the
other unless someone carries it across.

## What was changed in the copy

| Change                                                                                                 | Where                                                                                           |
| ------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------- |
| Package scope `@gt-sales/*` became `@canadian-plans/*`; the root package is `canadian-plans-crm`.      | Every `package.json`, import and the lockfile                                                   |
| The product name "GT Sales CRM" became "Canadian Plans CRM".                                           | Admin title, sidebar, sign-in pages, owner alert subjects, the OpenAPI title                    |
| Site keys start with `cpsk_` and draft grants with `cpdg_` (were `gtsk_`, `gtdg_`).                    | `apps/backend/src/website/credential.ts`, `apps/backend/src/leads/token.ts`                     |
| Internal labels that carried `gt-sales` (key-derivation labels, the theme's storage key, temp folders) | `apps/backend/src/crypto/cipher.ts`, `src/tracking/secrets.ts`, `src/ai/`, `jobs/`, the admin   |
| Test database names are `canadian_plans_crm_*`.                                                        | `.github/workflows/ci.yml`, `apps/admin/playwright.leads.config.ts`, the backup rehearsal test  |
| The backup workflows' deployment is `canadian-plans`.                                                  | `.github/workflows/backup*.yml`                                                                 |
| The SIM order's delivery letter link (it opened a page on getcanadasim.com) was removed.               | `packages/contracts/src/lead-types.ts`; the admin button hides itself when a type has no letter |

The key-derivation labels changed, so nothing sealed or signed by a GT Sales
deployment can be read here. That is intended: this deployment starts with an
empty database.

## What was removed

GT Sales' own data moves, which have no use on an empty database:

- `packages/db/sql/` (the CanadaWide and Get Canada Sim import scripts) and
  their three integration tests;
- `docs/RUNBOOKS/legacy-import.md`, `docs/RUNBOOKS/intake-fallback.md`, and the
  paste files `gcs-switch-day.sql`, `gcs-nightly-sync.sql`,
  `canadawide-intake-fallback.sql` and `close-canadawide-lead-inserts.sql`;
- `docs/GCS_ADMIN_INVENTORY.md`.

Inherited documents still link to some of these; those links are dead.

## What was kept as it is

- **Every migration** (`packages/db/drizzle/0000` to `0033`), unedited. The
  steps written for GT Sales check for its site slugs or legacy tables and do
  nothing on a fresh database. Apply them all with the migrator
  (`pnpm --filter @canadian-plans/db db:migrate`).
- **The lead types** (`sim_order`, `internet`, `mobility`,
  `partner_application`, `contact_message`) with their fields and stages,
  first modelled on Get Canada Sim's and CanadaWide's forms.
- **The synthetic seed** (`packages/db/src/seed.ts`) and test fixtures, which
  still use the made-up sites `getcanadasim` and `canadawide`. They are test
  data only; the seed refuses hosted databases.
- **docs/HANDOFF.md, docs/PLAN.md, docs/superpowers/, docs/briefs/,
  docs/review/**: the design record. Their live systems, ids, owner steps and
  dates are GT Sales'.

## What is not set up yet

Nothing is deployed. This deployment needs, each created by the owner:

1. A Supabase project (database, Auth, Storage): migrations applied, the
   `app_runtime` and `backup_reader` passwords set, Auth email sign-in, a
   Storage bucket with S3 keys. See `docs/RUNBOOKS/database.md`.
2. A Railway service for `apps/backend` (`railway.json`,
   `apps/backend/Dockerfile`), in the region nearest the database.
3. A Vercel project for `apps/admin` (root `apps/admin`, Node 22).
4. A Resend sending domain.
5. Backups: a Backblaze B2 bucket and key, an `age` recovery key pair, and the
   GitHub Environment `backup-canadian-plans` with its secrets
   (`docs/RUNBOOKS/backup.md`). **Until then the three scheduled backup
   workflows fail every run**; disable them in the Actions tab if the failure
   mails are unwanted.
6. The first site ("Add a site" in `docs/RUNBOOKS/database.md`), the owner's
   invitation and a site key for the storefront.

Every variable is listed in `docs/ENV.md`. No secret goes in this repository
or in a chat.

## What comes next

1. Stand up the deployment (the list above).
2. Connect the storefront. It stays in `Canadian-Plans/canadianplans-web-app`,
   which becomes a website-only repository. Its forms must be mapped onto this
   product's website API (`docs/HANDOFF.md` §2.6): `POST /website/leads` with a
   lead type, `GET /website/plans`, orders as `order: { planId, quantity }`,
   document uploads and the tracking routes. This product has **no quotes and
   no offer versions**: the storefront sends a plan id and a quantity, never a
   price, and the plan is frozen on the lead at submission.
3. Enter the plans in the admin (Settings → Plans): one plan per offer and
   province, since a plan has one price.
4. Decide whether the lead types fit Canadian Plans' forms as they are or need
   their own fields (`packages/contracts/src/lead-types.ts`,
   `lead-properties.ts`, `apps/backend/src/leads/types.ts`).
5. Send a test order through the storefront and work it in the admin.

`docs/superpowers/phases/phase-7-canadian-plans-cutover.md` was written for the
same move when it was planned as a second deployment of the GT Sales
repository; its decisions list and task breakdown still apply, read with this
page.
