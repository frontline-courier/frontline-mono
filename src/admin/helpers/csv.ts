function escapeCsvValue(value: unknown): string {
  if (value === null || value === undefined) {
    return '';
  }

  const stringValue = String(value);

  if (/[",\r\n]/.test(stringValue)) {
    return `"${stringValue.replace(/"/g, '""')}"`;
  }

  return stringValue;
}

/**
 * Convert an array of objects to CSV. Returns an empty string for an empty
 * array instead of throwing. Values containing commas, quotes, or newlines are
 * quoted/escaped so a single value cannot corrupt the file.
 */
export function convertArrayOfObjectsToCSV(
  array: Record<string, unknown>[],
  keys?: string[],
): string {
  if (!Array.isArray(array) || array.length === 0) {
    return '';
  }

  const columns = keys && keys.length > 0 ? keys : Object.keys(array[0] ?? {});

  if (columns.length === 0) {
    return '';
  }

  const header = columns.map(escapeCsvValue).join(',');
  const rows = array.map((item) => columns.map((key) => escapeCsvValue(item[key])).join(','));

  return [header, ...rows].join('\n');
}

export function downloadCSV(
  array: Record<string, unknown>[],
  keys?: string[],
  filename = `export${Date.now()}.csv`,
) {
  const csv = convertArrayOfObjectsToCSV(array, keys);

  if (!csv) {
    return;
  }

  const link = document.createElement('a');
  link.setAttribute('href', `data:text/csv;charset=utf-8,${encodeURIComponent(csv)}`);
  link.setAttribute('download', filename);
  link.click();
}
