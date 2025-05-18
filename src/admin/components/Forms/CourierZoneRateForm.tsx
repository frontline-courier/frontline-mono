import { useUser } from '@auth0/nextjs-auth0/client';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { CourierZoneRateInputs, WEIGHT_SLABS } from '../../interfaces/courierZoneRate';
import { PINCODE_TO_ZONE_MAP } from '../../constants/zone';
import { TransportMode } from '../../models/transportMode';

export default function CourierZoneRateForm() {
  const { user } = useUser();
  const [courierList, setCourierList] = useState<any[]>([]);
  const [loadingCouriers, setLoadingCouriers] = useState(true);
  const [errorCouriers, setErrorCouriers] = useState<string | null>(null);
  const [zones, setZones] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const { register, handleSubmit, watch, setValue, formState: { errors }, reset } = useForm<CourierZoneRateInputs>({
    defaultValues: {
      courier: 0,
      zone: '',
      transportMode: 0,
      weightSlabs: WEIGHT_SLABS
    }
  });

  const selectedCourier = watch('courier');
  const selectedZone = watch('zone');
  const selectedTransportMode = watch('transportMode');

  // Fetch couriers and existing rates on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/api/couriers');
        setCourierList(response.data.couriers);
        
        // Extract unique zones from PINCODE_TO_ZONE_MAP
        const uniqueZones = Array.from(new Set(PINCODE_TO_ZONE_MAP.values()));
        setZones(uniqueZones.sort());
      } catch (error) {
        setErrorCouriers('Failed to load couriers');
      } finally {
        setLoadingCouriers(false);
      }
    };

    fetchData();
  }, []);

  // Fetch existing rates when courier, zone, or transport mode changes
  useEffect(() => {
    const fetchExistingRates = async () => {
      if (!selectedCourier || !selectedZone || !selectedTransportMode) return;

      try {
        const response = await axios.get('/api/courier-zone-rates', {
          params: {
            courier: selectedCourier,
            zone: selectedZone,
            transportMode: selectedTransportMode
          }
        });

        if (response.data.rates && response.data.rates.length > 0) {
          const existingRate = response.data.rates[0];
          setValue('weightSlabs', existingRate.weightSlabs);
        } else {
          // Reset to default weight slabs if no existing rates
          setValue('weightSlabs', WEIGHT_SLABS);
        }
      } catch (error) {
        console.error('Error fetching existing rates:', error);
      }
    };

    fetchExistingRates();
  }, [selectedCourier, selectedZone, selectedTransportMode, setValue]);

  const onSubmit: SubmitHandler<CourierZoneRateInputs> = async (data) => {
    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(false);

    try {
      await axios.post('/api/courier-zone-rates', data);
      setSubmitSuccess(true);
      // Reset form after successful submission
      reset();
    } catch (error) {
      setSubmitError('Failed to save rates. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loadingCouriers) return <div>Loading...</div>;
  if (errorCouriers) return <div>Error: {errorCouriers}</div>;

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title mb-4">Courier Zone Rate Mapping</h2>
          
          {submitSuccess && (
            <div className="alert alert-success mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Rates saved successfully!</span>
            </div>
          )}

          {submitError && (
            <div className="alert alert-error mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{submitError}</span>
            </div>
          )}
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Courier Selection */}
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
                {errors.courier && <span className="text-error text-sm mt-1">Please select a courier</span>}
              </div>

              {/* Zone Selection */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Zone</span>
                </label>
                <select
                  className={`select select-bordered w-full ${errors.zone ? 'select-error' : ''}`}
                  {...register('zone', { required: true })}
                >
                  <option value="">Select Zone</option>
                  {zones.map((zone) => (
                    <option key={zone} value={zone}>
                      {zone}
                    </option>
                  ))}
                </select>
                {errors.zone && <span className="text-error text-sm mt-1">Please select a zone</span>}
              </div>

              {/* Transport Mode Selection */}
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
                {errors.transportMode && <span className="text-error text-sm mt-1">Please select a transport mode</span>}
              </div>
            </div>

            {/* Weight Slabs Table */}
            <div className="overflow-x-auto">
              <table className="table w-full">
                <thead>
                  <tr>
                    <th>Weight Range</th>
                    <th>Rate (₹)</th>
                  </tr>
                </thead>
                <tbody>
                  {WEIGHT_SLABS.map((slab, index) => (
                    <tr key={index}>
                      <td>
                        <div className="flex flex-col">
                          <span className="font-medium">
                            {slab.minWeight === 0 ? '0' : slab.minWeight} - {slab.maxWeight} g
                          </span>
                          <span className="text-sm text-base-content/70">
                            {slab.minWeight === 0 ? '0' : (slab.minWeight / 1000).toFixed(3)} - {(slab.maxWeight / 1000).toFixed(3)} kg
                          </span>
                        </div>
                      </td>
                      <td>
                        <input
                          type="number"
                          className="input input-bordered w-full"
                          step="0.01"
                          min="0"
                          {...register(`weightSlabs.${index}.rate`, {
                            required: true,
                            min: 0,
                            valueAsNumber: true
                          })}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex justify-end">
              <button 
                type="submit" 
                className="btn btn-primary"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <span className="loading loading-spinner"></span>
                    Saving...
                  </>
                ) : (
                  'Save Rates'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 