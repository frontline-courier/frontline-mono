# Source Apps

## Layout
- `admin/`: Next.js admin app, Auth0-protected, MongoDB-backed.
- `admin-next/`: SvelteKit admin rewrite with Drizzle and Postgres.
- `client/`: Angular public site.
- `mobile-app/`: Flutter tracking app.
- `data-migration/`: ad hoc migration/backup scripts.
- `legacy/admin/`: older Angular admin app.

## Guidance
- Assume `admin` is the current operational admin unless the task explicitly references `admin-next` or `legacy/admin`.
- Avoid copying logic blindly across apps; several folders implement overlapping courier/tracking concepts with different stacks and data sources.
- If a change impacts courier lists, tracking statuses, booking data, or rates, inspect both the API source and at least one consuming UI before editing.
- Keep scripts and app changes separate. `data-migration` is operational code and should not become a shared utility layer.
