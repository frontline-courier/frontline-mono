import { useUser } from '@auth0/nextjs-auth0/client';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { DoxType } from '../../models/DoxType';
import { TransportMode } from '../../models/transportMode';
import { ShipmentMode } from '../../models/shipmentMode';

interface ShipmentFormInputs {
  doxType: number;
  pincode: string;
  transportMode: number;
  shipmentMode: number;
  courier: number;
  numberOfBoxes: number;
  boxDimensions: {
    length: number;
    width: number;
    height: number;
  }[];
  totalVolWeight: number;
  actualWeight: number;
  chargeableWeight: number;
  discount: number;
  shippingCost: number;
  goodsValue?: number;
  isUsedProduct?: boolean;
  insurance?: number;
  totalValue: number;
}

export default function ShipmentForm() {
  const { user } = useUser();
  const [courierList, setCourierList] = useState<any[]>([]);
  const [loadingCouriers, setLoadingCouriers] = useState(true);
  const [errorCouriers, setErrorCouriers] = useState<string | null>(null);

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<ShipmentFormInputs>({
    defaultValues: {
      doxType: 0,
      transportMode: 0,
      shipmentMode: 0,
      courier: 0,
      numberOfBoxes: 1,
      boxDimensions: [{ length: 0, width: 0, height: 0 }],
      totalVolWeight: 0,
      actualWeight: 0,
      chargeableWeight: 0,
      discount: 0,
      shippingCost: 0,
      goodsValue: 0,
      isUsedProduct: false,
      insurance: 0,
      totalValue: 0
    }
  });

  // Watch values for calculations
  const numberOfBoxes = watch('numberOfBoxes');
  const boxDimensions = watch('boxDimensions');
  const goodsValue = watch('goodsValue');
  const isUsedProduct = watch('isUsedProduct');
  const discount = watch('discount');
  const shippingCost = watch('shippingCost');
  const insurance = watch('insurance');

  // Fetch couriers on component mount
  useEffect(() => {
    const fetchCouriers = async () => {
      try {
        const response = await axios.get('/api/couriers');
        setCourierList(response.data.couriers);
      } catch (error) {
        setErrorCouriers('Failed to load couriers');
      } finally {
        setLoadingCouriers(false);
      }
    };

    fetchCouriers();
  }, []);

  // Calculate total volumetric weight when box dimensions change
  useEffect(() => {
    if (boxDimensions && boxDimensions.length > 0) {
      const totalVol = boxDimensions.reduce((acc, box) => {
        const length = Number(box.length) || 0;
        const width = Number(box.width) || 0;
        const height = Number(box.height) || 0;
        const boxVol = (length * width * height) / 5000; // Standard volumetric divisor
        return acc + boxVol;
      }, 0);
      setValue('totalVolWeight', Number(totalVol.toFixed(2)));
    }
  }, [boxDimensions, setValue]);

  // Calculate chargeable weight based on max of volumetric and actual weight
  useEffect(() => {
    const volWeight = Number(watch('totalVolWeight')) || 0;
    const actWeight = Number(watch('actualWeight')) || 0;
    const chargeableWeight = Math.max(volWeight, actWeight);
    setValue('chargeableWeight', Number(chargeableWeight.toFixed(2)));
  }, [watch('totalVolWeight'), watch('actualWeight'), setValue]);

  // Calculate insurance based on goods value and product type
  useEffect(() => {
    const goodsValueNum = Number(goodsValue) || 0;
    if (goodsValueNum > 0) {
      const insuranceRate = isUsedProduct ? 0.03 : 0.025; // 3% for used products, 2.5% for new products
      const insuranceAmount = goodsValueNum * insuranceRate;
      setValue('insurance', Number(insuranceAmount.toFixed(2)));
    } else {
      setValue('insurance', 0);
    }
  }, [goodsValue, isUsedProduct, setValue]);

  // Calculate total value
  useEffect(() => {
    const goodsValueNum = Number(goodsValue) || 0;
    const insuranceNum = Number(insurance) || 0;
    const discountNum = Number(discount) || 0;
    const shippingCostNum = Number(shippingCost) || 0;
    
    const total = goodsValueNum + insuranceNum - discountNum + shippingCostNum;
    setValue('totalValue', Number(total.toFixed(2)));
  }, [goodsValue, insurance, discount, shippingCost, setValue]);

  // Handle number of boxes change
  const handleBoxesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const count = Math.max(1, parseInt(e.target.value) || 1);
    const currentDimensions = watch('boxDimensions');
    const newDimensions = Array(count).fill(null).map((_, index) => 
      currentDimensions[index] || { length: 0, width: 0, height: 0 }
    );
    setValue('numberOfBoxes', count);
    setValue('boxDimensions', newDimensions);
  };

  // Handle box dimension changes
  const handleBoxDimensionChange = (index: number, field: 'length' | 'width' | 'height', value: string) => {
    const numValue = Number(value) || 0;
    const currentDimensions = [...(watch('boxDimensions') || [])];
    currentDimensions[index] = {
      ...currentDimensions[index],
      [field]: numValue
    };
    setValue('boxDimensions', currentDimensions);
  };

  const onSubmit = async (data: ShipmentFormInputs) => {
    try {
      // Handle form submission
      console.log(data);
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  if (loadingCouriers) return <div>Loading...</div>;
  if (errorCouriers) return <div>Error: {errorCouriers}</div>;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="m-4 p-4 w-full lg:w-2/3">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Dox Type */}
        <div className="form-control">
          <label className="label">
            <span className="label-text font-medium">Document Type</span>
          </label>
          <div className="flex gap-4">
            <label className="label cursor-pointer">
              <input
                type="radio"
                value={1}
                className="radio radio-primary"
                {...register('doxType', { required: true })}
              />
              <span className="label-text ml-2">Dox</span>
            </label>
            <label className="label cursor-pointer">
              <input
                type="radio"
                value={2}
                className="radio radio-primary"
                {...register('doxType', { required: true })}
              />
              <span className="label-text ml-2">Non Dox</span>
            </label>
          </div>
          {errors.doxType && <span className="text-error text-sm">Please select a document type</span>}
        </div>

        {/* Pincode */}
        <div className="form-control">
          <label className="label">
            <span className="label-text font-medium">Pincode</span>
          </label>
          <input
            type="text"
            placeholder="Enter pincode"
            className={`input input-bordered w-full ${errors.pincode ? 'input-error' : ''}`}
            {...register('pincode', { required: true, pattern: /^\d{6}$/ })}
          />
          {errors.pincode && <span className="text-error text-sm">Please enter a valid 6-digit pincode</span>}
        </div>

        {/* Transport Mode */}
        <div className="form-control">
          <label className="label">
            <span className="label-text font-medium">Transport Mode</span>
          </label>
          <select
            className={`select select-bordered w-full ${errors.transportMode ? 'select-error' : ''}`}
            {...register('transportMode', { required: true })}
          >
            <option value={0}>Select Transport Mode</option>
            {Object.entries(TransportMode).map(([key, value]) => (
              <option key={key} value={key}>{value}</option>
            ))}
          </select>
          {errors.transportMode && <span className="text-error text-sm">Please select a transport mode</span>}
        </div>

        {/* Shipment Mode */}
        <div className="form-control">
          <label className="label">
            <span className="label-text font-medium">Shipment Mode</span>
          </label>
          <select
            className={`select select-bordered w-full ${errors.shipmentMode ? 'select-error' : ''}`}
            {...register('shipmentMode', { required: true })}
          >
            <option value={0}>Select Shipment Mode</option>
            {Object.entries(ShipmentMode).map(([key, value]) => (
              <option key={key} value={key}>{value}</option>
            ))}
          </select>
          {errors.shipmentMode && <span className="text-error text-sm">Please select a shipment mode</span>}
        </div>

        {/* Courier */}
        <div className="form-control">
          <label className="label">
            <span className="label-text font-medium">Courier</span>
          </label>
          <select
            className={`select select-bordered w-full ${errors.courier ? 'select-error' : ''}`}
            {...register('courier', { required: true })}
          >
            <option value={0}>Select Courier</option>
            {courierList.map((courier) => (
              <option key={courier.CourierId} value={courier.CourierId}>
                {courier.Courier}
              </option>
            ))}
          </select>
          {errors.courier && <span className="text-error text-sm">Please select a courier</span>}
        </div>

        {/* Number of Boxes and Box Dimensions Section */}
        <div className="col-span-full bg-base-200 p-4 rounded-lg">
          <div className="form-control mb-4">
            <label className="label">
              <span className="label-text font-medium">Number of Boxes</span>
            </label>
            <div className="flex items-center gap-4">
              <input
                type="number"
                min="1"
                className={`input input-bordered w-32 ${errors.numberOfBoxes ? 'input-error' : ''}`}
                {...register('numberOfBoxes', { required: true, min: 1 })}
                onChange={handleBoxesChange}
              />
              <span className="text-sm text-base-content/70">Enter the number of boxes in your shipment</span>
            </div>
            {errors.numberOfBoxes && <span className="text-error text-sm">Please enter number of boxes</span>}
          </div>

          {/* Box Dimensions */}
          <div className="space-y-4">
            {Array.from({ length: numberOfBoxes }).map((_, index) => (
              <div key={index} className="bg-base-100 p-4 rounded-lg shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-medium">Box {index + 1} Dimensions</h3>
                  <div className="badge badge-primary">Box {index + 1}</div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-medium">Length (cm)</span>
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        step="0.1"
                        min="0"
                        className="input input-bordered w-full"
                        {...register(`boxDimensions.${index}.length`, { 
                          required: true, 
                          min: 0,
                          onChange: (e) => handleBoxDimensionChange(index, 'length', e.target.value)
                        })}
                      />
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <span className="text-base-content/50">cm</span>
                      </div>
                    </div>
                  </div>
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-medium">Width (cm)</span>
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        step="0.1"
                        min="0"
                        className="input input-bordered w-full"
                        {...register(`boxDimensions.${index}.width`, { 
                          required: true, 
                          min: 0,
                          onChange: (e) => handleBoxDimensionChange(index, 'width', e.target.value)
                        })}
                      />
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <span className="text-base-content/50">cm</span>
                      </div>
                    </div>
                  </div>
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-medium">Height (cm)</span>
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        step="0.1"
                        min="0"
                        className="input input-bordered w-full"
                        {...register(`boxDimensions.${index}.height`, { 
                          required: true, 
                          min: 0,
                          onChange: (e) => handleBoxDimensionChange(index, 'height', e.target.value)
                        })}
                      />
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <span className="text-base-content/50">cm</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-2 text-sm text-base-content/70">
                  Volume: {((Number(boxDimensions[index]?.length) || 0) * 
                           (Number(boxDimensions[index]?.width) || 0) * 
                           (Number(boxDimensions[index]?.height) || 0)).toFixed(2)} cm³
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Weight Section */}
        <div className="col-span-full bg-base-200 p-4 rounded-lg">
          <h3 className="font-medium mb-4">Weight Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Total Volumetric Weight */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Total Volumetric Weight</span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="0.01"
                  readOnly
                  className="input input-bordered w-full bg-base-100"
                  {...register('totalVolWeight')}
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <span className="text-base-content/50">kg</span>
                </div>
              </div>
              <span className="text-sm text-base-content/70 mt-1">Sum of all boxes&apos; volumetric weight</span>
            </div>

            {/* Actual Weight */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Actual Weight</span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="0.01"
                  className={`input input-bordered w-full ${errors.actualWeight ? 'input-error' : ''}`}
                  {...register('actualWeight', { required: true, min: 0 })}
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <span className="text-base-content/50">kg</span>
                </div>
              </div>
              {errors.actualWeight && <span className="text-error text-sm">Please enter actual weight</span>}
            </div>

            {/* Chargeable Weight */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Chargeable Weight</span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="0.01"
                  readOnly
                  className="input input-bordered w-full bg-base-100"
                  {...register('chargeableWeight')}
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <span className="text-base-content/50">kg</span>
                </div>
              </div>
              <span className="text-sm text-base-content/70 mt-1">Maximum of volumetric and actual weight</span>
            </div>
          </div>
        </div>

        {/* Cost Section */}
        <div className="col-span-full bg-base-200 p-4 rounded-lg">
          <h3 className="font-medium mb-4">Cost Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Discount */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Discount</span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="0.01"
                  className={`input input-bordered w-full ${errors.discount ? 'input-error' : ''}`}
                  {...register('discount', { min: 0 })}
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <span className="text-base-content/50">₹</span>
                </div>
              </div>
            </div>

            {/* Shipping Cost */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Shipping Cost</span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="0.01"
                  className={`input input-bordered w-full ${errors.shippingCost ? 'input-error' : ''}`}
                  {...register('shippingCost', { required: true, min: 0 })}
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <span className="text-base-content/50">₹</span>
                </div>
              </div>
              {errors.shippingCost && <span className="text-error text-sm">Please enter shipping cost</span>}
            </div>

            {/* Goods Value */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Goods Value</span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  className="input input-bordered w-full"
                  {...register('goodsValue', { min: 0 })}
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <span className="text-base-content/50">₹</span>
                </div>
              </div>
            </div>

            {/* Product Type */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Product Type</span>
              </label>
              <div className="flex gap-4">
                <label className="label cursor-pointer">
                  <input
                    type="radio"
                    value="false"
                    className="radio radio-primary"
                    {...register('isUsedProduct')}
                  />
                  <span className="label-text ml-2">New (2.5%)</span>
                </label>
                <label className="label cursor-pointer">
                  <input
                    type="radio"
                    value="true"
                    className="radio radio-primary"
                    {...register('isUsedProduct')}
                  />
                  <span className="label-text ml-2">Used (3%)</span>
                </label>
              </div>
            </div>

            {/* Insurance */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Insurance</span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="0.01"
                  readOnly
                  className="input input-bordered w-full bg-base-100"
                  {...register('insurance')}
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <span className="text-base-content/50">₹</span>
                </div>
              </div>
              <span className="text-sm text-base-content/70 mt-1">
                {isUsedProduct ? '3% of goods value' : '2.5% of goods value'}
              </span>
            </div>
          </div>

          {/* Total Value */}
          <div className="form-control mt-4">
            <label className="label">
              <span className="label-text font-medium">Total Value</span>
            </label>
            <div className="relative">
              <input
                type="number"
                step="0.01"
                readOnly
                className="input input-bordered w-full bg-base-100"
                {...register('totalValue')}
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <span className="text-base-content/50">₹</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <button type="submit" className="btn btn-primary w-full">
          Submit
        </button>
      </div>
    </form>
  );
} 