# Admin App

## Purpose
- Next.js 12 admin interface for bookings, couriers, shipment rates, volumetric mappings, credit, and stock workflows.
- Uses page routes under `pages/` and API routes under `pages/api/`.

## Architecture
- UI lives mainly in `components/`, `pages/`, and `styles/`.
- API handlers use `next-connect` and MongoDB helpers.
- Auth is handled with Auth0; many pages use `withPageAuthRequired` and some APIs check session state.
- Shared domain pieces live in folders like `constants/`, `helpers/`, `interfaces/`, `models/`, and `lib/`.

## Working Rules
- Keep page-level behavior in `pages/` unless logic is reused across screens.
- For API changes, preserve DB connection lifecycle and existing response shapes unless the task requires an API contract change.
- Do not edit `.next/`, `node_modules/`, or `.env` files as part of normal feature work.
- There are user changes in this app's courier files; read carefully before touching those areas.

## Validation
- Use `yarn dev`, `yarn build`, or `yarn lint` from this folder as needed.
