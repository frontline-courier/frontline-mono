# Admin Next

## Purpose
- SvelteKit-based admin rewrite or experiment.
- Uses Vite, Svelte 5, Tailwind, Vitest, and Drizzle/Postgres tooling.

## Architecture
- Application code is under `src/`, mainly `src/routes` and `src/lib`.
- Database configuration is centered around Drizzle config and server-side code under `src/lib/server`.
- Current repo state suggests this app is less mature than `src/admin`.

## Working Rules
- Prefer small, modern SvelteKit changes. Keep server-only code out of client routes.
- Preserve the existing formatting/lint setup with Prettier and ESLint.
- Do not edit `.svelte-kit/` or `node_modules/`.
- If a task could apply to both admin apps, confirm the target behavior from the existing `src/admin` implementation before diverging.

## Validation
- Use `npm run check`, `npm run lint`, `npm run test`, and `npm run build` from this folder as appropriate.
