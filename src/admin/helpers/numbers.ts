/**
 * Returns true only when the value can be interpreted as a finite number.
 * Blank strings must be rejected explicitly because `Number('')` is 0.
 */
export function isNumericInput(value: unknown): boolean {
  if (value === null || value === undefined) {
    return false;
  }

  if (typeof value === 'string' && value.trim() === '') {
    return false;
  }

  return Number.isFinite(Number(value));
}
