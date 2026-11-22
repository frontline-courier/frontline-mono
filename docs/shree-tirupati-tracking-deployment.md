# Shree Tirupati Tracking Proxy — Deployment Runbook

Operational companion to [`shree-tirupati-tracking.md`](./shree-tirupati-tracking.md).
Covers hosting, health checks, monitoring/alerting, deploy and rollback.

## Where it runs

The resolver is a Next.js API route inside the admin app (`src/admin`), not a
separate container. It deploys with the admin app that Vercel already builds
from this repository.

| Item | Value |
| --- | --- |
| Hosting | Vercel (project `frontline-mono`, production alias) |
| Production base URL | `https://next.frontlinecourier.com` |
| Tracking endpoint | `GET https://next.frontlinecourier.com/api/tracking/shree-tirupati?awb=<digits>` |
| JSON variant | `GET .../api/tracking/shree-tirupati?awb=<digits>&format=json` |
| Health check | `GET https://next.frontlinecourier.com/api/health` |
| Preview | Every pushed branch gets a Vercel preview deployment |
| Production | Merge to `main` triggers a Vercel production deployment |

This is the "Cloud Run or equivalent" target: Vercel already hosts the admin
API, so no new container registry, Docker image, or GCP project is introduced.
The route is stateless and only needs outbound HTTPS.

## Deploy

```bash
git fetch origin
git switch -c feat/<change> origin/main
# ... changes ...
npm --prefix src/admin test        # NOTE: use the explicit glob below if the script misses tests
./src/admin/node_modules/.bin/tsx --test src/admin/tests/*.test.ts
( cd src/admin && npm run build )  # must list /api/tracking/shree-tirupati
git push -u origin HEAD
gh pr create --fill
# wait for the Vercel preview, smoke-test it, then merge
gh pr merge --squash --delete-branch
```

The build output must include the function:

```
ƒ /api/tracking/shree-tirupati
```

## Smoke tests

Run against the preview URL first, then production.

```bash
BASE=https://next.frontlinecourier.com

# 1. Liveness
curl -sS -o /dev/null -w '%{http_code}\n' "$BASE/api/health"            # 200

# 2. Invalid AWB rejected without calling upstream
curl -sS -o /dev/null -w '%{http_code}\n' "$BASE/api/tracking/shree-tirupati?awb=12AB"   # 400

# 3. Valid AWB resolves to a docnos URL
curl -sS "$BASE/api/tracking/shree-tirupati?awb=12&format=json"         # {"awb":"12","trackingUrl":"...docnos=..."}

# 4. Browser path redirects
curl -sS -o /dev/null -w '%{http_code} %{redirect_url}\n' \
  "$BASE/api/tracking/shree-tirupati?awb=12"                            # 302 .../Frm_DocList.aspx?docnos=...
```

Known-good test AWBs used during EXA-97 validation: `12`, `123456`,
`123456789012`, `000000000001`, `999999999999`.

## Health checks

- **Liveness:** `GET /api/health` → `200` with `{ status: "ok", service,
  version, timestamp }`. It does not touch MongoDB, Auth0, or the courier site.
- **Contract probe:** invalid AWB must return `400`; a known AWB must return a
  `docnos` URL. This detects route removal, validation regressions, and upstream
  breakage.
- These probes do **not** restart or gate the deployment; a courier-site outage
  should page a human, not churn production instances.

## Monitoring and alerting

- **Automated probe + alert:** `.github/workflows/tracking-health.yml` runs
  every 15 minutes (and on demand) against production. A failed run notifies the
  workflow maintainers and appears in the Actions tab; this is the alert
  channel.
- **Metrics dashboard:** Vercel project → *Observability / Logs* for
  `next.frontlinecourier.com`. Filter on `/api/tracking/shree-tirupati` and
  `/api/health` for request rate, 4xx/5xx, and duration.
- **Log signals to watch:** `upstream` timeouts (504), upstream failures (502),
  and a spike in 400s (bad client input or abuse).
- A dedicated dashboard/alert rule inside Vercel requires Vercel account access,
  which this agent does not currently hold. Add it once the Vercel connection is
  available; the workflow above is the interim alerting path.

Suggested thresholds:

| Signal | Threshold |
| --- | --- |
| `/api/health` non-200 | 2 consecutive scheduled runs |
| Known-AWB probe failing | 1 scheduled run |
| Resolver 5xx rate | > 5% over 15 min |
| Resolver p95 latency | > 12 s over 15 min |

## Rollback

The resolver is additive: no schema migration and no change to existing data.
To roll back, revert the merge commit on `main` (Vercel redeploys production).
The old `Frm_DocTrack.aspx` deep link is already broken upstream, so leaving the
resolver deployed is safer than reverting unless the route itself is faulty.

## Limits and follow-ups

- In-memory cache is per-instance and resets on deploy/cold start; acceptable for
  a 10-minute TTL.
- If the courier starts binding `docnos` tokens to a session cookie, switch the
  `302` redirect to a reverse proxy of the final page (see the integration doc).
- Public endpoint is unauthenticated by design (matches public tracking). Add
  rate limiting at the edge if abuse appears.
