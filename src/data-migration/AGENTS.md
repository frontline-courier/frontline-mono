# Data Migration

## Purpose
- One-off scripts for backups, exports, and migration fixes.

## Critical Safety Notes
- This folder currently contains hardcoded database credentials in source files. Treat it as sensitive operational code.
- Do not commit additional secrets, connection strings, or exported customer data.
- Be extremely cautious with scripts that write, delete, back up, or transform production data.

## Working Rules
- Prefer making scripts explicit and one-purpose rather than abstracting them into shared infrastructure.
- Default to read-only inspection unless the task explicitly requires a write operation.
- When editing a script, make the target database/collection and intended execution flow obvious.
- Keep generated CSV backups and raw exports out of normal product changes.

## Validation
- Validate with targeted script execution only when the task requires it and the environment is safe.
