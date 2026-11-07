export const transportModeOptions = [
  { value: 1, label: 'Air' },
  { value: 2, label: 'Cargo' },
  { value: 3, label: 'Air Cargo' },
  { value: 4, label: 'Sea Cargo' },
  { value: 5, label: 'Surface Cargo' },
  { value: 6, label: 'Surface' },
  { value: 7, label: 'TrainSurface' },
  { value: 8, label: 'RoadSurface' },
  { value: 9, label: 'NA' },
] as const;

export type TransportModeValue = (typeof transportModeOptions)[number]['value'];

const transportModeLabelByValue = new Map<number, string>(
  transportModeOptions.map((option) => [option.value, option.label]),
);

export function getTransportModeOptionLabel(value: number | string | null | undefined): string {
  const numericValue = Number(value);
  return transportModeLabelByValue.get(numericValue) ?? 'NA';
}
