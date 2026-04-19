# Mobile App

## Purpose
- Flutter app for courier tracking.

## Architecture
- Runtime Dart code is primarily in `lib/`.
- Platform wrappers live in `android/`, `ios/`, and `web/`.
- Firebase is initialized at app startup and tracking UI is rooted from `TrackScreen`.

## Working Rules
- Prefer Dart changes under `lib/` and tests under `test/`.
- Avoid platform-specific edits unless the task explicitly requires Android, iOS, or web configuration changes.
- Do not modify generated platform artifacts unless necessary.

## Validation
- Use `flutter analyze` and `flutter test` from this folder when relevant.
