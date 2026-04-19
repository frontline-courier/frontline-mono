# Frontline Mono

## Repo Shape
- This repository is a polyglot monorepo without a single shared workspace tool.
- `src/admin` is the active Next.js admin app for operations workflows and MongoDB-backed APIs.
- `src/admin-next` is a newer SvelteKit admin app with Drizzle/Postgres setup and appears early-stage.
- `src/client` is the public Angular website and tracking frontend.
- `src/mobile-app` is a Flutter courier tracking app.
- `src/data-migration` contains one-off migration and backup scripts.
- `src/legacy/admin` is an older Angular admin app.
- `sql` and `images` are support folders, not application runtimes.

## Working Rules
- Treat each app as independently managed. Run commands from that app's folder, not repo root.
- Prefer the active app for product changes. Do not update `src/legacy/admin` unless the task clearly targets legacy code.
- Do not edit generated or vendored directories such as `node_modules`, `.next`, `.svelte-kit`, `dist`, `.angular`, Android build output, or iOS build output.
- Keep changes localized to the app you are working in; there is little shared infrastructure here.

## Cross-Cutting Risks
- Watch for committed secrets and environment-specific config. This repo already contains `.env` files and hardcoded credentials in migration scripts.
- Preserve existing external integrations: Auth0 in `src/admin`, Firebase usage in `src/client` and `src/mobile-app`, MongoDB in `src/admin` and `src/data-migration`, Postgres/Drizzle in `src/admin-next`.
- When changing tracking, courier, booking, or rate logic, check whether the same domain concept exists in another app before assuming behavior is isolated.

## Validation
- Validate changes inside the specific app you touched using that app's own scripts.
- Prefer targeted validation over repo-wide commands because this repo is not wired as a single build/test unit.
