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

## The deployment (set up 2026-11-12)

| Part     | Where                                                                                                                                                                                                                                                       |
| -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Database | Supabase project `canadianplans` (`ixbhodlvfyxjctpsjibj`, `us-west-2`, org "Canadian Plan", free plan). The old platform's `app` and `drizzle` schemas were dropped first.                                                                                  |
| Backend  | Railway project `canadian-plans-backend`, service `backend` (`39140e07-670e-4529-945d-37764ccfd0c8`), region `sfo`, built from this repository's `main`. Health: `/api/v1/health` on `backend-production-ebbb6.up.railway.app`.                             |
| Admin    | Vercel team `canadian-plans`, project `canadianplans-web-app-admin` (the old admin's project, reconnected to this repository on 2026-11-12; root `apps/admin`, region `sfo1`), at `apex.canadianplans.com`. Its variables were already right and were kept. |
| Email    | Resend domain `canadianplans.com` (verified). The service keeps the Resend variables it already had.                                                                                                                                                        |
| Site     | `canadianplans` (`60942550-3167-41dd-9256-c712cd8a7bc5`), with the seven roles, six permissions and a pending owner invitation.                                                                                                                             |

How it was done, for the next time:

- **Migrations** `0000` to `0033` were applied on 2026-11-12, each file in one
  transaction as `postgres`, with its Drizzle tracker row (`sha256` of the file
  and the journal's `when`), so `db:migrate` continues from here. The session
  could not reach the database port and Supabase does not let `postgres`
  change its own password over SQL, so the files were posted to a temporary,
  key-checked Edge Function (`crm-migrate-once`) that ran them through
  `SUPABASE_DB_URL`. That function now answers 410; delete it in the dashboard.
- **The Railway service was reused**, so the secrets it already held stayed in
  place and were never read: `DATABASE_URL` (the `app_runtime` role, which
  survived the wipe with its password), `CRON_SECRET`, the Resend, storage
  (`R2_*`, still Cloudflare R2), tracking, Turnstile and Sentry variables. Set
  new: `MACHINE_REGISTRY_JSON` (one scheduler, `railway-scheduler`, for the
  site above, its secret a reference to `CRON_SECRET`; no webhooks),
  `JOB_RUNNER_SELECTOR`, `SENSITIVE_FIELDS_KEY`, `SUPABASE_URL`,
  `SUPABASE_ANON_KEY` (the publishable key), `DEPLOYMENT_ENV`.
- Variables of the old platform that this backend does not read are still on
  the service (`SANITY_*`, `CATALOGUE_SYNC_SELECTOR`, `SYNTHETIC_*`,
  `QUOTE_WITHDRAWAL_POLICY`, `ORDER_OPERATIONAL_TRANSITIONS`,
  `SITE_1_STATIC_CATALOGUE_WORKSPACE_ID`, `UMAMI_*`); remove them when
  convenient.

## Plans (loaded 2026-11-12)

The 23 launch plans of the old platform's repository catalogue
(`docs/LAUNCH_PLANS.md` there, confirmed by the owner on 20 October 2026) were
inserted into `app.plans` for the site: 14 internet (one per offer and
province, the province in the name), 3 mobility and 6 `sim_order`, all active,
no payment required, no required documents. Internet and mobile plans that had
no billing period there are `month` here. Review them under Settings → Plans.

Six custom plan properties were added with "Show on website" on, because the
storefront reads them (`canadianplans-web-app`, `apps/site-1/src/lib/offers.ts`):
`custom_product_key`, `custom_regions`, `custom_product_title`,
`custom_best_for`, `custom_features` and `custom_promotion`. Keep the keys;
labels and values can change.

The `sim_order` form also takes `currentCountry` (optional), which the
storefront's pre-arrival form sends.

## Not done yet

1. **Owner's first sign-in**, to confirm the invitation is claimed.
2. **Auth settings** in Supabase (Site URL and redirect URL = the admin's
   address; custom SMTP through Resend for invitations).
3. **The Resend webhook** entry in `MACHINE_REGISTRY_JSON` (none now, so
   delivery and bounce events are not ingested).
4. **Backups**: a Backblaze B2 bucket and key, an `age` recovery key pair, the
   `backup_reader` password and the GitHub Environment `backup-canadian-plans`
   (`docs/RUNBOOKS/backup.md`). **Until then the three scheduled backup
   workflows fail every run**; disable them in the Actions tab if the failure
   mails are unwanted.
5. **A site key** for the storefront (Settings in the admin; scopes
   `leads:write`, `uploads:customer`, `tracking`) and the email settings
   (Settings → Email).
6. **The intake check** (`INTAKE_CHECK_WORKSPACE_ID`) and the AI assistant are
   off.

## What comes next

1. Finish the list above.
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
