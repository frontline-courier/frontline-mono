import { useUser } from '@auth0/nextjs-auth0/client';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { DoxType } from '../../models/DoxType';
import { TransportMode } from '../../models/transportMode';
import { ShipmentMode } from '../../models/shipmentMode';

// Define volumetric formulas in one place
const VOLUMETRIC_FORMULAS = [
  { id: 1, formula: 'L×B×H/4750', divisor: 4750 },
  { id: 2, formula: 'L×B×H/5000', divisor: 5000 },
  { id: 3, formula: 'L×B×H/3857', divisor: 3857 },
  { id: 4, formula: 'L×B×H/27000×8', divisor: 27000/8 },
  { id: 5, formula: 'L×B×H/3350', divisor: 3350 },
];

// Create a lookup object for courier-to-formula mapping
const COURIER_FORMULAS: { [key: number]: { divisor: number, formula: string } } = 
  VOLUMETRIC_FORMULAS.reduce((acc, formula) => {
    acc[formula.id] = { divisor: formula.divisor, formula: formula.formula };
    return acc;
  }, {} as { [key: number]: { divisor: number, formula: string } });

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
  formula?: string;
}

export default function ShipmentForm() {
  const { user } = useUser();
  const [courierList, setCourierList] = useState<any[]>([]);
  const [loadingCouriers, setLoadingCouriers] = useState(true);
  const [errorCouriers, setErrorCouriers] = useState<string | null>(null);
  const [mappings, setMappings] = useState<any[]>([]);
  const [loadingMappings, setLoadingMappings] = useState(true);

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<ShipmentFormInputs>({
    defaultValues: {
      doxType: 1,
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
      totalValue: 0,
      formula: 'L×B×H/5000'
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
  const doxType = watch('doxType');
  const transportMode = watch('transportMode');
  const courier = watch('courier');
  
  // Check if document type is Dox
  const isDox = Number(doxType) === 1;

  // Fetch couriers and mappings on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch data in parallel for better performance
        const [courierResponse, mappingsResponse] = await Promise.all([
          axios.get('/api/couriers'),
          axios.get('/api/courier-volumetric-mappings')
        ]);

        // Create a lookup object for faster mapping access
        const mappingsData = mappingsResponse.data.mappings || [];
        setMappings(mappingsData);

        // Process couriers with their volumetric formulas
        const couriers = courierResponse.data.couriers.map((courier: any) => ({
          ...courier,
          VolumetricDivisor: COURIER_FORMULAS[courier.CourierId]?.divisor || 5000,
          Formula: COURIER_FORMULAS[courier.CourierId]?.formula || 'L×B×H/5000'
        }));
        setCourierList(couriers);
      } catch (error) {
        setErrorCouriers('Failed to load data');
      } finally {
        setLoadingCouriers(false);
        setLoadingMappings(false);
      }
    };

    fetchData();
  }, []);

  // Memoize formula lookup for better performance
  const getMappingKey = (courierId: number, transportModeId: number) => `${courierId}-${transportModeId}`;
  
  // Get volumetric divisor based on courier and transport mode
  const getVolumetricDivisor = () => {
    if (!courier || !transportMode) return 5000; // Default divisor
    
    const courierNum = Number(courier);
    const transportModeNum = Number(transportMode);
    
    // Check for Bluedart Surface Economy first - this always takes precedence
    const selectedCourier = courierList.find(c => c.CourierId === courierNum);
    const courierName = selectedCourier?.Courier || '';
    
    if (courierName.includes('Bluedart Surface')) {
      // Force the formula to be L×B×H/27000×8 for Bluedart Surface Economy
      setValue('formula', 'L×B×H/27000×8');
      return 27000/8;
    }
    
    // Check if there's a specific mapping for this courier and transport mode
    const specificMapping = mappings.find(m => 
      m.courierId === courierNum && m.transportMode === transportModeNum
    );
    
    if (specificMapping) {
      // Use the formula from the mapping
      const formulaObj = VOLUMETRIC_FORMULAS.find((f) => 
        f.id === specificMapping.formulaId
      );
      if (formulaObj) {
        setValue('formula', formulaObj.formula);
        return formulaObj.divisor;
      }
    }
    
    // Calculate volumetric weight based on transport mode
    let divisor = 5000; // Default divisor
    let formula = 'L×B×H/5000'; // Default formula
    
    switch (transportModeNum) {
      case 1: // Air Courier
      case 3: // Air Cargo
      case 6: // Surface Courier (except Bluedart Surface)
      case 7: // Train Cargo
        divisor = 5000;
        formula = 'L×B×H/5000';
        break;
      case 5: // Surface Cargo
      case 8: // Road Cargo
        divisor = 27000/8;
        formula = 'L×B×H/27000×8';
        break;
      case 4: // Sea Cargo
        divisor = 5000; // Standard for sea cargo
        formula = 'L×B×H/5000';
        break;
      default:
        // If no specific transport mode is selected, use the courier's formula
        if (selectedCourier) {
          divisor = selectedCourier.VolumetricDivisor || 5000;
          formula = selectedCourier.Formula || 'L×B×H/5000';
        }
    }
    
    setValue('formula', formula);
    return divisor;
  };

  // Memoize courier and transport mode changes to avoid unnecessary recalculations
  useEffect(() => {
    if (courier > 0 || transportMode > 0) {
      // This will update the formula and recalculate volumetric weight
      calculateVolumetricWeight();
    }
  }, [courier, transportMode]);

  // Calculate volumetric weight when box dimensions change
  useEffect(() => {
    if (boxDimensions && boxDimensions.length > 0 && !isDox) {
      calculateVolumetricWeight();
    }
  }, [boxDimensions, isDox]);

  // Optimize box dimension calculation
  const calculateVolumetricWeight = () => {
    if (!boxDimensions?.length || isDox) {
      setValue('totalVolWeight', 0);
      return;
    }
    
    const divisor = getVolumetricDivisor();
    
    // Use reduce for a single pass through the array
    const totalVol = boxDimensions.reduce((acc, box) => {
      // Destructure for cleaner code
      const { length = 0, width = 0, height = 0 } = box;
      // Only do the calculation if all dimensions are present
      const boxVol = (length && width && height) 
        ? (length * width * height) / divisor 
        : 0;
      return acc + boxVol;
    }, 0);
    
    setValue('totalVolWeight', Number(totalVol.toFixed(2)));
  };

  // Calculate chargeable weight based on max of volumetric and actual weight
  useEffect(() => {
    const volWeight = Number(watch('totalVolWeight')) || 0;
    const actWeight = Number(watch('actualWeight')) || 0;
    setValue('chargeableWeight', Number(Math.max(volWeight, actWeight).toFixed(2)));
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

        {/* Number of Boxes and Box Dimensions Section - Only show for Non-Dox */}
        {!isDox && (
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
                  {...register('numberOfBoxes', { required: !isDox, min: 1 })}
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
                            required: !isDox, 
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
                            required: !isDox, 
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
                            required: !isDox, 
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

            {/* Volumetric Formula Display */}
            <div className="mt-4 p-3 bg-base-100 rounded-lg flex flex-col md:flex-row md:items-center justify-between">
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-primary" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                </svg>
                <span className="font-medium">Volumetric Weight Formula:</span>
                <div className="bg-base-200 text-primary font-bold mx-2 px-3 py-1 rounded">
                  {(() => {
                    // Show the correct formula for all cases
                    const selectedCourier = courierList.find(c => c.CourierId === Number(courier));
                    if (selectedCourier?.Courier?.includes('Bluedart Surface')) {
                      return 'L×B×H/27000×8';
                    }
                    return watch('formula') || 'L×B×H/5000';
                  })()}
                </div>
              </div>
              <div className="mt-2 md:mt-0 flex items-center text-sm">
                <span className={`badge ${
                  mappings.some(m => m.courierId === Number(courier) && m.transportMode === Number(transportMode)) 
                    ? 'badge-success' 
                    : courierList.find(c => c.CourierId === Number(courier))?.Courier?.includes('Bluedart Surface')
                        ? 'badge-warning'
                        : 'badge-info'
                }`}>
                  {mappings.some(m => m.courierId === Number(courier) && m.transportMode === Number(transportMode))
                    ? 'Custom Formula'
                    : courierList.find(c => c.CourierId === Number(courier))?.Courier?.includes('Bluedart Surface')
                        ? 'Courier-Specific Formula'
                        : 'Standard Formula'}
                </span>
                <div className="ml-2 text-base-content/70">
                  {(() => {
                    const selectedCourier = courierList.find(c => c.CourierId === Number(courier));
                    const transportModeText = Object.entries(TransportMode).find(([key]) => Number(key) === Number(transportMode))?.[1] || 'transport mode';
                    
                    if (selectedCourier?.Courier?.includes('Bluedart Surface')) {
                      return (
                        <span className="text-warning font-medium">
                          {selectedCourier.Courier} always uses this formula
                        </span>
                      );
                    }
                    
                    return `Based on ${selectedCourier?.Courier || 'selected courier'} and ${transportModeText}`;
                  })()}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Weight Section */}
        <div className="col-span-full bg-base-200 p-4 rounded-lg">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
            <h3 className="font-medium">Weight Information</h3>
            {!isDox && courier > 0 && transportMode > 0 && (
              <div className="flex items-center mt-2 md:mt-0">
                <div className="px-3 py-1 bg-base-100 rounded-md flex items-center">
                  <span className="text-base-content mr-2">Formula:</span>
                  <span className="font-semibold text-primary">
                    {(() => {
                      // Show the correct formula for all cases
                      const selectedCourier = courierList.find(c => c.CourierId === Number(courier));
                      if (selectedCourier?.Courier?.includes('Bluedart Surface')) {
                        return 'L×B×H/27000×8';
                      }
                      return watch('formula') || 'L×B×H/5000';
                    })()}
                  </span>
                  <span className={`ml-2 badge ${
                    mappings.some(m => m.courierId === Number(courier) && m.transportMode === Number(transportMode)) 
                      ? 'badge-success' 
                      : courierList.find(c => c.CourierId === Number(courier))?.Courier?.includes('Bluedart Surface')
                          ? 'badge-warning'
                          : 'badge-info'
                  } badge-sm`}>
                    {mappings.some(m => m.courierId === Number(courier) && m.transportMode === Number(transportMode))
                      ? 'Custom'
                      : courierList.find(c => c.CourierId === Number(courier))?.Courier?.includes('Bluedart Surface')
                          ? 'Courier-Specific'
                          : 'Default'}
                  </span>
                </div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Total Volumetric Weight */}
            {!isDox && (
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
            )}

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

        {/* After the chargeable weight input, add a formula calculation example */}
        {!isDox && boxDimensions.length > 0 && boxDimensions[0].length > 0 && boxDimensions[0].width > 0 && boxDimensions[0].height > 0 && (
          <div className="col-span-full mt-4">
            <div className="bg-base-100 p-3 rounded-lg">
              <div className="font-medium mb-2">Sample Calculation (Box 1)</div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="flex items-center mb-1">
                    <span className="text-base-content/70 mr-2">Length:</span>
                    <span className="font-medium">{Number(boxDimensions[0].length).toFixed(1)} cm</span>
                  </div>
                  <div className="flex items-center mb-1">
                    <span className="text-base-content/70 mr-2">Width:</span>
                    <span className="font-medium">{Number(boxDimensions[0].width).toFixed(1)} cm</span>
                  </div>
                  <div className="flex items-center mb-1">
                    <span className="text-base-content/70 mr-2">Height:</span>
                    <span className="font-medium">{Number(boxDimensions[0].height).toFixed(1)} cm</span>
                  </div>
                  <div className="flex items-center mt-2">
                    <span className="text-base-content/70 mr-2">Divisor:</span>
                    <span className="font-medium">
                      {watch('formula')?.split('/')[1] || '5000'}
                    </span>
                  </div>
                </div>
                <div className="bg-base-200 p-3 rounded-lg">
                  <div className="mb-2 font-medium">Calculation:</div>
                  <div className="mb-1">
                    <span>{Number(boxDimensions[0].length).toFixed(1)} × {Number(boxDimensions[0].width).toFixed(1)} × {Number(boxDimensions[0].height).toFixed(1)} = </span>
                    <span className="font-medium">
                      {(Number(boxDimensions[0].length) * Number(boxDimensions[0].width) * Number(boxDimensions[0].height)).toFixed(2)} cm³
                    </span>
                  </div>
                  <div className="mb-1">
                    {(() => {
                      // Check for Bluedart Surface Economy first
                      const selectedCourier = courierList.find(c => c.CourierId === Number(courier));
                      const isBluedartSurface = selectedCourier?.Courier?.includes('Bluedart Surface') || false;
                      
                      // Use the correct formula based on courier
                      let formula = isBluedartSurface ? 'L×B×H/27000×8' : (watch('formula') || 'L×B×H/5000');
                      let divisor = 5000;
                      let divisorDisplay = '5000';
                      
                      if (isBluedartSurface) {
                        divisor = 27000/8;
                        divisorDisplay = '27000÷8 = 3375';
                      } else if (formula.includes('/')) {
                        const parts = formula.split('/');
                        divisorDisplay = parts[1];
                        
                        // Handle special case like L×B×H/27000×8
                        if (divisorDisplay.includes('×')) {
                          const [base, multiplier] = divisorDisplay.split('×');
                          divisor = parseInt(base) / parseInt(multiplier);
                          divisorDisplay = `${base}÷${multiplier} = ${divisor}`;
                        } else {
                          divisor = parseFloat(divisorDisplay);
                        }
                      }
                      
                      const volume = Number(boxDimensions[0].length) * Number(boxDimensions[0].width) * Number(boxDimensions[0].height);
                      const volumetricWeight = volume / divisor;
                      
                      return (
                        <>
                          <span>{volume.toFixed(2)} ÷ {divisorDisplay} = </span>
                          <span className="font-medium text-primary">
                            {volumetricWeight.toFixed(2)} kg
                          </span>
                        </>
                      );
                    })()}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

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