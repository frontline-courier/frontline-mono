export const branchOptions = [
  'FCC1',
  'FCC2',
  'CC PUDUR',
  'CC CHOLAMBEDU',
  'CO COURIER',
] as const;

export type BranchOption = typeof branchOptions[number];
