# Shree Tirupati Courier Tracking Integration

## Summary

Shree Tirupati Courier (`shreetirupaticourier.net`) does not accept a direct
tracking URL. The public site validates an AWB in `TopHeader.aspx` and then
redirects to `Frm_DocList.aspx?docnos=<encrypted-token>`. The `docnos` value is
an ASP.NET-encrypted token that contains the AWB, so it cannot be built from the
AWB in the browser.

The integration replays the site's own form POST on the admin server and sends
the browser to the resulting tracking page.

## Chosen approach: server-side form replay + redirect proxy

**Flow**

1. The tracking UI renders a link to
   `/api/tracking/shree-tirupati?awb=<AWB>` on the admin API.
2. The Next.js route performs a `GET` on `TopHeader.aspx` and reads the
   `__VIEWSTATE`, `__VIEWSTATEGENERATOR`, and `__EVENTVALIDATION` hidden fields.
3. It performs a `POST` to `TopHeader.aspx` with those fields, `trackingno=<AWB>`,
   and `btnTrack=Go`.
4. The route reads the `Location` header
   (`Frm_DocList.aspx?docnos=<token>`) and returns a `302` redirect to the
   browser. The courier then renders the AWB list and the detailed tracking
   iframe.

No encryption key, brute force, or direct database access is involved. The token
is always produced by the courier's own server.

**Verified behavior**

- `Frm_DocTrack.aspx?docno=<AWB>` and `Frm_DocList.aspx?docnos=<AWB>` return
  `404` or a redirect to an error page, which is why the old direct link failed.
- Replaying the form returns a working `Frm_DocList.aspx?docnos=<token>` URL.
- The returned token was accepted from a fresh cookie jar (no session cookies
  from the resolving request), so a redirect is sufficient. If the courier later
  binds tokens to a session, replace the redirect with a reverse proxy of the
  final page.

### Pros and cons

| Approach | Pros | Cons |
| --- | --- | --- |
| **Server-side form replay (chosen)** | Uses the courier's supported flow; no key discovery; one small endpoint; works with the existing external-link UI | Depends on the site's form field names; one extra HTTP round trip |
| Client-side form POST | No server code | Blocked by CORS; cannot read the redirect reliably; exposes the flow to browser quirks |
| Direct token generation | Fastest | Requires the ASP.NET machine key; explicitly out of scope and unsafe |
| Direct database lookup | Fast | No schema/access; bypasses the courier's authorization |
| Headless browser | Handles any page flow | Slow, heavy, fragile, and expensive to run per lookup |

## Endpoint

Canonical: `GET /api/tracking/shree-tirupati?awb=<digits>`

Alias: `GET /api/couriers/shree-tirupati/track?awb=<digits>` (same handler)

- Public (no Auth0 session), matching the public tracking page.
- `awb` (or `trackingno`) must contain digits only and be at most 20 characters.
- Success: `302` to the courier's `Frm_DocList.aspx` URL.
- Add `format=json` to receive `{ "awb": "...", "trackingUrl": "..." }` instead of
  the redirect. This is useful for validation scripts and server-to-server calls.
- Invalid AWB: `400` with `{ "error": "..." }`.
- Upstream failure: `502` (or `504` on timeout) with `{ "error": "..." }`.
- Resolved URLs are cached in memory for 10 minutes per AWB.

The resolver only contacts `shreetirupaticourier.net` and only accepts redirects
back to that host, which prevents the endpoint from being used as an open proxy.

## Data model and UI integration

The public booking response (`/api/bookings/find`) now normalizes this courier:

- `courierTrack`: `/api/tracking/shree-tirupati?awb=<AWB>`
- `courierMode`: `resolver`

`resolver` mode behaves like an external link in the Angular tracking page:
the "View Detailed Tracking" button is shown, and the internal timeline is
hidden. The client prepends `environment.adminApiUrl` to the relative resolver
path, so no environment-specific host is stored in MongoDB.

The courier is detected by `CourierId: 62`, by a `SHREE TIRUPATHI` name, or by a
legacy `shreetirupaticourier.net` tracking URL. This keeps existing database rows
working without a migration. New rows can also set `Mode: 4` and
`Track: /api/tracking/shree-tirupati?awb=<AWB>` directly.

## Testing

```bash
# Admin resolver, public booking normalization
cd src/admin && ./node_modules/.bin/tsx --test tests/*.test.ts

# Client URL builder (after installing the client dependencies)
cd src/client && ./node_modules/.bin/tsx --test src/app/utils/*.test.ts
```

The admin tests mock `fetch` and cover hidden-field parsing, form body replay,
relative and absolute redirects, host allowlisting, network failures, and cache
expiry. The client tests cover resolver URL construction with the AWB, missing
admin origin, and absolute resolver templates.
