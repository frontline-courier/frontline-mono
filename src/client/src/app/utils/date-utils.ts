// Lightweight date utils to replace moment.js usage in the client app
export function formatDate(date: string | number | Date, format: string): string {
  const d = new Date(date);
  if (isNaN(d.getTime())) return '';

  // Helper values
  const weekdayShort = d.toLocaleString('en-US', { weekday: 'short' });
  const monthShort = d.toLocaleString('en-US', { month: 'short' });
  const day = d.getDate().toString().padStart(2, '0');
  const year = d.getFullYear();
  let hour = d.getHours();
  const minute = d.getMinutes().toString().padStart(2, '0');
  const second = d.getSeconds().toString().padStart(2, '0');
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const ampmLower = ampm.toLowerCase();
  const hour12 = (() => {
    const h = hour % 12;
    return h === 0 ? 12 : h;
  })();

  switch (format) {
    case 'MMM DD, YYYY':
      return `${monthShort} ${day}, ${year}`;
    case 'ddd, h:mm:ss a':
      return `${weekdayShort}, ${hour12}:${minute}:${second} ${ampmLower}`;
    case 'DD MMM YYYY h:mm A (ddd)':
      return `${day} ${monthShort} ${year} ${hour12}:${minute} ${ampm} (${weekdayShort})`;
    default:
      return d.toISOString();
  }
}

export function toUnix(date: string | number | Date): number {
  const d = new Date(date);
  return isNaN(d.getTime()) ? 0 : Math.floor(d.getTime() / 1000);
}

export function nowUtc(): string {
  return new Date().toISOString();
}
