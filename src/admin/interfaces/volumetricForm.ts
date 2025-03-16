export interface Courier {
  CourierId: number;
  Courier: string;
  VolumetricDivisor: number;
  Formula?: string;
}

export interface VolumetricFormInputs {
  length: number;
  width: number;
  height: number;
  weight: number;
  unit: string;
  courier: number;
  transportMode: number;
  volumetricWeight?: number;
  actualWeight?: number;
  chargeableWeight?: number;
  formula?: string;
}
