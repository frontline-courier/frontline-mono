# SQL Assets

## Purpose
- Stores SQL scripts and backups used for operational or migration support.

## Working Rules
- Treat files here as operational assets, not app runtime code.
- Prefer additive scripts or clearly named migrations over silently modifying historical backup files.
- If a script is environment-specific or destructive, state that explicitly in comments or filenames.
