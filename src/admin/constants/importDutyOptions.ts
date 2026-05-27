export const importDutyOptions = [
  'Delivered at Place (DAP)',
  'Duty FREE (DP)',
] as const;

export type ImportDutyOption = typeof importDutyOptions[number];
