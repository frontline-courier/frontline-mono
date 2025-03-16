import { useUser } from '@auth0/nextjs-auth0/client';
import axios from 'axios';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { VolumetricFormInputs, Courier } from '../../interfaces/volumetricForm';

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

export default function VolumetricForm() {
  const router = useRouter();
  const { user, error: userError, isLoading: isUserLoading } = useUser();

  const [courierList, setCourierList] = useState<Courier[]>([]);
  const [loadingCouriers, setLoadingCouriers] = useState(true);
  const [errorCouriers, setErrorCouriers] = useState<string | null>(null);
  const [mappings, setMappings] = useState<any[]>([]);
  const [loadingMappings, setLoadingMappings] = useState(true);

  const { register, handleSubmit, watch, formState, setValue } = useForm<VolumetricFormInputs>({
    mode: 'onChange',
    defaultValues: {
      length: 0,
      width: 0,
      height: 0,
      weight: 0,
      unit: 'cm',
      courier: 0,
      transportMode: 0,
    },
  });

  const errors = formState.errors;
  const [loader, setLoader] = useState(false);

  // Fetch couriers and volumetric mappings on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch couriers
        const courierResponse = await axios.get('/api/couriers');
        const couriers = courierResponse.data.couriers.map((courier: any) => ({
          ...courier,
          VolumetricDivisor: COURIER_FORMULAS[courier.CourierId]?.divisor || 5000,
          Formula: COURIER_FORMULAS[courier.CourierId]?.formula || 'L×B×H/5000'
        }));
        setCourierList(couriers);
        
        // Fetch volumetric mappings
        const mappingsResponse = await axios.get('/api/courier-volumetric-mappings');
        setMappings(mappingsResponse.data.mappings || []);
      } catch (error) {
        setErrorCouriers('Failed to load data');
      } finally {
        setLoadingCouriers(false);
        setLoadingMappings(false);
      }
    };

    fetchData();
  }, []);

  // Watch form values for real-time calculation
  const length = watch('length');
  const width = watch('width');
  const height = watch('height');
  const weight = watch('weight');
  const unit = watch('unit');
  const selectedCourier = watch('courier');
  const transportMode = watch('transportMode');

  // Set formula based on courier-transport mode mapping or default rules
  useEffect(() => {
    if (!transportMode || !selectedCourier) return;
    
    // First check if there's a specific mapping for this courier and transport mode
    const specificMapping = mappings.find(m => 
      m.courierId === Number(selectedCourier) && m.transportMode === Number(transportMode)
    );
    
    if (specificMapping) {
      // Use the formula from the mapping
      const formulaObj = VOLUMETRIC_FORMULAS.find((f: {id: number, formula: string, divisor: number}) => 
        f.id === specificMapping.formulaId
      );
      if (formulaObj) {
        setValue('formula', formulaObj.formula);
        return;
      }
    }
    
    // Fall back to default rules if no specific mapping found
    if (transportMode === 1 || transportMode === 3) { // Air Courier or Air Cargo
      setValue('formula', 'L×B×H/5000');
    } else if (transportMode === 6 || transportMode === 7) { // Surface Courier or Train Cargo
      setValue('formula', 'L×B×H/5000');
    } else if (transportMode === 5 || transportMode === 8) { // Surface Cargo or Road Cargo
      setValue('formula', 'L×B×H/27000×8');
    }
  }, [transportMode, selectedCourier, mappings, setValue]);

  // Check if there's a specific mapping for the selected courier and transport mode
  const getSpecificMapping = () => {
    if (!selectedCourier || !transportMode) return null;
    
    return mappings.find(m => 
      m.courierId === Number(selectedCourier) && m.transportMode === Number(transportMode)
    );
  };
  
  // Get the mapping status for UI highlighting
  const specificMapping = getSpecificMapping();
  const hasMappingMatch = !!specificMapping;
  
  // Calculate volumetric weight whenever dimensions change
  const calculateVolumetricWeight = () => {
    if (length && width && height) {
      const volume = length * width * height;
      let volumetricWeight;
      let divisor = 5000; // Default divisor
      
      if (specificMapping) {
        // Use the formula from the mapping
        const formulaObj = VOLUMETRIC_FORMULAS.find((f: {id: number, formula: string, divisor: number}) => 
          f.id === specificMapping.formulaId
        );
        if (formulaObj) {
          divisor = formulaObj.divisor;
        }
      } else {
        // Fall back to default rules if no specific mapping found
        if (transportMode === 1 || transportMode === 3) { // Air Courier or Air Cargo
          divisor = 5000;
        } else if (transportMode === 6 || transportMode === 7) { // Surface Courier or Train Cargo
          divisor = 5000;
        } else if (transportMode === 5 || transportMode === 8) { // Surface Cargo or Road Cargo
          divisor = 27000/8;
        } else {
          // If no specific transport mode is selected, use the courier's formula
          const courier = courierList.find(c => c.CourierId === Number(selectedCourier));
          divisor = courier?.VolumetricDivisor || 5000;
        }
      }
      
      // Different calculations based on unit
      if (unit === 'cm') {
        volumetricWeight = volume / divisor;
      } else if (unit === 'mm') {
        volumetricWeight = (volume / 1000) / divisor; // Convert mm to cm first (divide by 1000)
      } else { // inches
        volumetricWeight = (volume * 2.54 * 2.54 * 2.54) / divisor; // Convert inches to cm first
      }
      
      // Round to 2 decimal places
      const roundedVolumetricWeight = Number(volumetricWeight.toFixed(2));
      const actualWeightValue = Number(weight);
      
      // Chargeable weight is the greater of volumetric weight and actual weight
      const chargeableWeightValue = Math.max(roundedVolumetricWeight, actualWeightValue);
      
      setValue('volumetricWeight', roundedVolumetricWeight);
      setValue('actualWeight', actualWeightValue);
      setValue('chargeableWeight', Number(chargeableWeightValue.toFixed(2)));
    }
  };

  const onSubmit: SubmitHandler<VolumetricFormInputs> = async (data) => {
    calculateVolumetricWeight();
  };

  // Add error handling for when user is not loaded
  if (isUserLoading) {
    return <div className="flex justify-center items-center h-screen">Loading user data...</div>;
  }

  if (userError) {
    return <div className="alert alert-error m-4">Failed to load user data. Please try again.</div>;
  }

  if (!user) {
    return <div className="alert alert-warning m-4">Please log in to access this page.</div>;
  }

  if (loadingCouriers) {
    return <div className="flex justify-center items-center h-screen">Loading couriers...</div>;
  }

  if (errorCouriers) {
    return <div className="alert alert-error m-4">{errorCouriers}</div>;
  }

  return (
    <>
      {loader && <div className="flex justify-center items-center h-screen">Loading...</div>}

      <form onChange={calculateVolumetricWeight} onSubmit={handleSubmit(onSubmit)} className="m-4 p-4 w-full lg:w-2/3">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="form-control">
            <label className="label p-1">
              <span className="label-text text-2xs">Courier</span>
            </label>
            <select
              className={`select select-bordered ${errors.courier && 'select-error'}`}
              {...register('courier', { required: true, valueAsNumber: true })}
            >
              <option disabled value={0}>-- select courier --</option>
              {courierList.map((courier) => (
                <option key={courier.CourierId} value={courier.CourierId}>
                  {courier.Courier}
                </option>
              ))}
            </select>
          </div>

          <div className="form-control">
            <label className="label p-1">
              <span className="label-text text-2xs">Transport Mode</span>
            </label>
            <select 
              className={`select select-bordered ${errors.transportMode && 'select-error'}`}
              {...register('transportMode', { required: true, valueAsNumber: true })}
            >
              <option disabled value={0}>-- transport mode --</option>
              <option value={1}>Air Courier</option>
              <option value={3}>Air Cargo</option>
              <option value={4}>Sea Cargo</option>
              <option value={5}>Surface Cargo</option>
              <option value={6}>Surface Courier</option>
              <option value={7}>Train Cargo</option>
              <option value={8}>Road Cargo</option>
            </select>
            {errors.transportMode && <span className="text-error text-sm mt-1">Transport Mode is required</span>}
          </div>

          <div className="form-control">
            <label className="label p-1">
              <span className="label-text text-2xs">Weight</span>
            </label>
            <input
              type="number"
              step="0.01"
              placeholder="Weight"
              className={`input input-bordered ${errors.weight && 'input-error'}`}
              {...register('weight', { required: true, min: 0 })}
            />
          </div>

          
          <div className="form-control">
            <label className="label p-1">
              <span className="label-text text-2xs">Length</span>
            </label>
            <input
              type="number"
              step="0.01"
              placeholder="Length"
              className={`input input-bordered ${errors.length && 'input-error'}`}
              {...register('length', { required: true, min: 0 })}
            />
          </div>

          <div className="form-control">
            <label className="label p-1">
              <span className="label-text text-2xs">Width</span>
            </label>
            <input
              type="number"
              step="0.01"
              placeholder="Width"
              className={`input input-bordered ${errors.width && 'input-error'}`}
              {...register('width', { required: true, min: 0 })}
            />
          </div>

          <div className="form-control">
            <label className="label p-1">
              <span className="label-text text-2xs">Height</span>
            </label>
            <input
              type="number"
              step="0.01"
              placeholder="Height"
              className={`input input-bordered ${errors.height && 'input-error'}`}
              {...register('height', { required: true, min: 0 })}
            />
          </div>

          

          <div className="form-control">
            <label className="label p-1">
              <span className="label-text text-2xs">Unit</span>
            </label>
            <select
              className={`select select-bordered ${errors.unit && 'select-error'}`}
              {...register('unit', { required: true })}
            >
              <option value="cm">Centimeters (cm)</option>
              <option value="mm">Millimeters (mm)</option>
              <option value="inch">Inches (in)</option>
            </select>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
         
          
          <div className="stats shadow">
            <div className="stat">
              <div className="stat-title">Volumetric Weight</div>
              <div className="stat-value text-primary">{watch('volumetricWeight') || 0} kg</div>
              <div className="stat-desc">{watch('formula') || 'Select a courier'}</div>
            </div>
          </div>

          <div className="stats shadow">
            <div className="stat">
              <div className="stat-title">Actual Weight</div>
              <div className="stat-value text-secondary">{watch('actualWeight') || 0} kg</div>
            </div>
          </div>

          <div className="stats shadow bg-accent">
            <div className="stat">
              <div className="stat-title text-accent-content">Chargeable Weight</div>
              <div className="stat-value text-accent-content">{watch('chargeableWeight') || 0} kg</div>
              <div className="stat-desc text-accent-content">Greater of volumetric or actual weight</div>
            </div>
          </div>

           {/* Mapping status indicator */}
           {selectedCourier > 0 && transportMode > 0 && (
            <div className="col-span-1 md:col-span-2 lg:col-span-3 mb-2">
              <div className={`alert ${hasMappingMatch ? 'alert-success' : 'alert-warning'} py-2`}>                
                <div>
                  {hasMappingMatch ? (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                      <span>Using custom mapping for this courier and transport mode combination</span>
                    </>
                  ) : (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                      <span>Using default formula - no custom mapping found</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </form>
    </>
  );
}