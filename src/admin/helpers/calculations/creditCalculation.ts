function roundCurrency(value: number) {
  return Math.round((Number.isFinite(value) ? value : 0) * 100) / 100;
}

function toFiniteNumber(value: unknown) {
  const parsedValue = Number(value);
  return Number.isFinite(parsedValue) ? parsedValue : 0;
}

export function calculateCarrierInsurance(amount: unknown) {
  return roundCurrency(toFiniteNumber(amount) * (2.5 / 100));
}

export function calculateFovRisk(amount: unknown) {
  return roundCurrency(toFiniteNumber(amount) * (0.25 / 100));
}

export function calculateCreditTotal(input: {
  amount?: unknown;
  odaEdl?: unknown;
  carrierInsurance?: unknown;
  fovRisk?: unknown;
}) {
  return roundCurrency(
    toFiniteNumber(input.amount)
    + toFiniteNumber(input.odaEdl)
    + toFiniteNumber(input.carrierInsurance)
    + toFiniteNumber(input.fovRisk),
  );
}
