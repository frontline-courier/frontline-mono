export const paymentModes = ['BharatPe', 'BHIM', 'Cash', 'Cheque', 'Credit', 'GPay', 'Navi', 'NEFT', 'PayTM', 'PhonePe'] as const;

export const creditStatusOptions = ['Pending - Full', 'Pending - Partial', 'Settled'] as const;

export type CreditStatusOption = typeof creditStatusOptions[number];
