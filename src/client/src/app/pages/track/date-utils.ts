// Lightweight date utils to replace moment.js
export function formatDate(date: string | number | Date, format: string): string {
  const d = new Date(date);
  if (isNaN(d.getTime())) return '';
  if (format === 'MMM DD, YYYY') {
    return d.toLocaleString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
  }
  if (format === 'ddd, h:mm:ss a') {
    // e.g. Wed, 3:45:12 pm
    const weekday = d.toLocaleString('en-US', { weekday: 'short' });
    let hour = d.getHours();
    const min = d.getMinutes().toString().padStart(2, '0');
    const sec = d.getSeconds().toString().padStart(2, '0');
    const ampm = hour >= 12 ? 'pm' : 'am';
    hour = hour % 12;
    if (hour === 0) hour = 12;
    return `${weekday}, ${hour}:${min}:${sec} ${ampm}`;
  }
  return d.toISOString();
}

export function toUnix(date: string | number | Date): number {
  const d = new Date(date);
  return isNaN(d.getTime()) ? 0 : Math.floor(d.getTime() / 1000);
}
