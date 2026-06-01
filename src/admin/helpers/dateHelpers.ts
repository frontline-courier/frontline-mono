/**
 * Format a Date (or ISO string) as a local "YYYY-MM-DDTHH:mm" string suitable
 * for <input type="datetime-local"> default values.
 *
 * IMPORTANT: do NOT use toISOString().slice(0,16) here — that gives UTC time
 * and would pre-fill the input with the wrong local time for the user.
 */
export function toDatetimeLocalString(date: Date | string = new Date()): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
}

/**
 * Format a Date (or ISO string) as a local "YYYY-MM-DD" string suitable
 * for <input type="date"> default values.
 */
export function toDateInputString(date: Date | string = new Date()): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
}

/**
 * Format a date for display: "1 Jun 2026, 10:30 am (Mon)"
 * Replacement for moment(date).format('Do MMM YYYY - hh:mm a (ddd)').
 * Uses the browser/server locale for ordinal suffix.
 */
export function formatDisplayDatetime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;

  const datePart = d.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
  const timePart = d.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
  const weekday = d.toLocaleDateString('en-IN', { weekday: 'short' });

  return `${datePart} - ${timePart} (${weekday})`;
}

/**
 * Format a date for display: "23-05-2026 10:30"
 * Replacement for moment(date).format('DD-MM-YYYY HH:mm').
 */
export function formatDisplayDatetimeShort(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;

  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const yyyy = d.getFullYear();
  const hh = String(d.getHours()).padStart(2, '0');
  const min = String(d.getMinutes()).padStart(2, '0');

  return `${dd}-${mm}-${yyyy} ${hh}:${min}`;
}

/**
 * Format a date for display: "23-05-2026"
 * Replacement for moment(date).format('DD-MM-YYYY').
 */
export function formatDisplayDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;

  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const yyyy = d.getFullYear();

  return `${dd}-${mm}-${yyyy}`;
}
