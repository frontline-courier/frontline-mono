export interface CourierZoneRateInputs {
  courier: number;
  zone: string;
  transportMode: number;
  weightSlabs: {
    minWeight: number;
    maxWeight: number;
    rate: number;
  }[];
}

export interface WeightSlab {
  minWeight: number;
  maxWeight: number;
  rate: number;
}

// Predefined weight slabs in grams
export const WEIGHT_SLABS: WeightSlab[] = [
  { minWeight: 0, maxWeight: 100, rate: 0 },
  { minWeight: 101, maxWeight: 250, rate: 0 },
  { minWeight: 251, maxWeight: 500, rate: 0 },
  { minWeight: 501, maxWeight: 1000, rate: 0 },
  { minWeight: 1001, maxWeight: 1500, rate: 0 },
  { minWeight: 1501, maxWeight: 2000, rate: 0 },
  { minWeight: 2001, maxWeight: 2500, rate: 0 },
  { minWeight: 2501, maxWeight: 3000, rate: 0 },
  { minWeight: 3001, maxWeight: 3500, rate: 0 },
  { minWeight: 3501, maxWeight: 4000, rate: 0 },
  { minWeight: 4001, maxWeight: 4500, rate: 0 },
  { minWeight: 4501, maxWeight: 5000, rate: 0 },
  { minWeight: 5001, maxWeight: 10000, rate: 0 },
  { minWeight: 10001, maxWeight: 15000, rate: 0 },
  { minWeight: 15001, maxWeight: 25000, rate: 0 },
  { minWeight: 25001, maxWeight: 50000, rate: 0 },
  { minWeight: 50001, maxWeight: 100000, rate: 0 }
]; 