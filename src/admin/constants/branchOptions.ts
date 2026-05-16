export const branchOptions = [
  'FCC1',
  'FCC2',
] as const;

export type BranchOption = typeof branchOptions[number];
