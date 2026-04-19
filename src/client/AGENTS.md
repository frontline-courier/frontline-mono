# Client App

## Purpose
- Angular public website for services, contact flows, volumetric calculator, and shipment tracking.

## Architecture
- Main application code is under `src/app` with `pages/`, `services/`, `models/`, and `constants/`.
- The app consumes remote APIs for tracking and email flows.
- This codebase mixes Angular patterns with some older direct DOM and jQuery-style interactions.

## Working Rules
- Prefer existing Angular structure over introducing a new architectural layer.
- Keep compatibility with the current Angular app layout and build setup.
- Do not edit `dist/`, `.angular/`, or `node_modules/`.
- Environment files may contain deployment-specific values; avoid changing them unless the task is explicitly config-related.

## Validation
- Use `npm start`, `npm run build`, `npm test`, or `npm run lint` from this folder as needed.
