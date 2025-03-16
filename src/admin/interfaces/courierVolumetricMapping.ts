export interface CourierVolumetricMapping {
  id?: string | number; // Support both MongoDB ObjectId (as string) and number
  _id?: string; // MongoDB's native ID field
  courierId: number;
  courierName?: string;
  transportMode: number;
  formulaId: number;
  formulaName?: string;
  createdAt?: Date;
  updatedAt?: Date;
  createdBy?: string;
  updatedBy?: string;
}
