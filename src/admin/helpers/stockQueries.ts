type StockDuplicateEntry = {
  awb: string;
  courier: string;
};

/**
 * Build an `$or` query that checks every AWB/courier pair independently.
 * The previous implementation only checked the first entry's courier, which
 * let mixed-courier batches bypass the duplicate check.
 */
export function buildStockDuplicateQuery(entries: StockDuplicateEntry[]) {
  return {
    $or: entries.map((entry) => ({
      awb: entry.awb,
      courier: entry.courier,
    })),
  };
}
