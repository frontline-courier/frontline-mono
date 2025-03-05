import { useUser } from '@auth0/nextjs-auth0/client';
import axios from 'axios';
import moment from 'moment';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { PageTypes } from '../../enums/pageTypes';
import { getPageType } from '../../helpers/router/getPageType';
import { BookingFormInputs } from '../../interfaces/bookingForm';

export default function BookingForm() {

  const router = useRouter();
  const { id } = router.query;
  const pageType = getPageType(router.pathname);
  const { user, error: userError, isLoading: isUserLoading } = useUser();

  const { register, handleSubmit, watch, formState, reset, resetField } = useForm<BookingFormInputs>({
    mode: 'onChange',
    defaultValues: {
      courier: 0,
      doxType: 0,
      shipmentMode: 0,
      transportMode: 0,
      coCourier: 0,
      bookedDate: moment().format(moment.HTML5_FMT.DATETIME_LOCAL)
    },
  });

  const errors = formState.errors;
  const [loader, setLoader] = useState(false);
  const [saveError, setError] = useState('');
  const [isDelete, setDelete] = useState(false);
  const [courierList, setCourierList] = useState<any[]>([]); // State for couriers
  const [loadingCouriers, setLoadingCouriers] = useState(true); // Loading state for couriers
  const [errorCouriers, setErrorCouriers] = useState<string | null>(null); // Error state for couriers\ const { user, error, isLoading } = useUser();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoader(true);
        const [courierResponse, bookingResponse] = await Promise.all([
          axios.get('/api/couriers'),
          id ? axios.get(`/api/bookings/${id}`) : Promise.resolve(null)
        ]);

        setCourierList(courierResponse.data.couriers);

        if (bookingResponse && bookingResponse.data) {
          bookingResponse.data.bookedDate = moment(bookingResponse.data.bookedDate).format(moment.HTML5_FMT.DATETIME_LOCAL);
          reset(bookingResponse.data);
          if (pageType === PageTypes.DELETE) {
            setDelete(true);
          }
        }
      } catch (error) {
        setErrorCouriers('Failed to load couriers');
        console.error(error);
      } finally {
        setLoader(false);
        setLoadingCouriers(false);
      }
    };

    fetchData();
  }, [id, pageType, reset]);

  const onSubmit: SubmitHandler<BookingFormInputs> = async (data) => {
    setLoader(true);

    try {
      if (pageType === PageTypes.DELETE) {
        // not implemented
      } else if (pageType === PageTypes.EDIT) {
        await axios.post('/api/bookings/update', { ...data, updatedBy: user?.email });
      } else {
        await axios.post('/api/bookings/add', { ...data, shipmentStatus: 'Booked', createdBy: user?.email });
      }


      resetField('courier');
      resetField('doxType');
      resetField('shipmentMode');
      resetField('transportMode');
      reset({});

      // router.push('/bookings');
      router.back();
    } catch (e: any) {
      setError(e.response?.data?.error || e.message);
    } finally {
      setLoader(false);
    }
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

  return <>
    {loader && <div className="flex justify-center items-center h-screen">Loading...</div>}

    {loadingCouriers && <div className="flex justify-center items-center h-screen">Loading couriers...</div>}

    {errorCouriers && (
      <div className="alert alert-error m-4">
        <div className="flex-1">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="w-6 h-6 mx-2 stroke-current">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"></path>
          </svg>
          <label>{errorCouriers}</label>
        </div>
      </div>
    )}

    {!loader && !loadingCouriers && !errorCouriers && (
      <form onSubmit={handleSubmit(onSubmit)} className="m-4 p-4 w-full lg:w-2/3">
        <div className="grid grid-col-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="form-control">
            <label className="label p-1">
              <span className="label-text text-2xs">AWB</span>
            </label>
            <input type="text" placeholder="AWB" className={`input input-bordered ${errors.awbNumber && 'input-error'}`} {...register('awbNumber', { required: true, minLength: 5 })} />
          </div>
          <div className="form-control">
            <label className="label p-1">
              <span className="label-text text-2xs">Reference</span>
            </label>
            <input type="text" placeholder="Reference" className={`input input-bordered ${errors.referenceNumber && 'input-error'}`} {...register('referenceNumber', { minLength: 5 })} />
          </div>
          <div className="form-control">
            <label className="label p-1">
              <span className="label-text text-2xs">Third Party Number</span>
            </label>
            <input type="text" placeholder="Third Party Number" className={`input input-bordered ${errors.thirdPartyNumber && 'input-error'}`} {...register('thirdPartyNumber', { minLength: 5 })} />
          </div>
          <div className="form-control">
            <label className="label p-1">
              <span className="label-text text-2xs">Booking Date</span>
            </label>
            <input type="datetime-local" placeholder="Booking Date" className={`input input-bordered ${errors.bookedDate && 'input-error'}`} {...register('bookedDate', { required: true, valueAsDate: true, })} />
          </div>

          <div className="form-control">
            <label className="label p-1">
              <span className="label-text text-2xs">Courier</span>
            </label>
            <select className={`select select-bordered ${errors.courier && 'select-error'}`}  {...register('courier', { required: true, valueAsNumber: true },)}>
              <option disabled={true} value={0}>-- courier --</option>
              {
                courierList.map((d) => {
                  return <option key={d.CourierId} value={d.CourierId}>{d.Courier}</option>
                })
              }
            </select>
          </div>
          <div className="form-control">
            <label className="label p-1">
              <span className="label-text text-2xs">Shipper Name</span>
            </label>
            <input type="text" placeholder="Shipper Name" className={`input input-bordered ${errors.shipperName && 'input-error'}`} {...register('shipperName', { required: true, minLength: 3 })} />
          </div>
          <div className="form-control">
            <label className="label p-1">
              <span className="label-text text-2xs">Origin</span>
            </label>
            <input type="text" placeholder="Origin" className={`input input-bordered ${errors.origin && 'input-error'}`} {...register('origin', { required: true, minLength: 3 })} />
          </div>

          <div className="form-control">
            <label className="label p-1">
              <span className="label-text text-2xs">DoxType</span>
            </label>
            <select className={`select select-bordered ${errors.doxType && 'select-error'}`} {...register('doxType', { required: true, valueAsNumber: true })}>
              <option disabled={true} value={0}>-- dox type --</option>
              <option value={1}>Dox</option>
              <option value={2}>Non Dox</option>
              {/* <option value={0}>NA</option> */}
            </select>
          </div>
          <div className="form-control">
            <label className="label p-1">
              <span className="label-text text-2xs">Receiver Name</span>
            </label>
            <input type="text" placeholder="Receiver Name" className={`input input-bordered ${errors.receiverName && 'input-error'}`} {...register('receiverName', { required: true, minLength: 3 })} />
          </div>
          <div className="form-control">
            <label className="label p-1">
              <span className="label-text text-2xs">Destination</span>
            </label>
            <input type="text" placeholder="Destination" className={`input input-bordered ${errors.destination && 'input-error'}`} {...register('destination', { required: true, minLength: 3 })} />
          </div>

          <div className="form-control">
            <label className="label p-1">
              <span className="label-text text-2xs">Shipment Mode</span>
            </label>
            <select className={`select select-bordered ${errors.shipmentMode && 'select-error'}`} {...register('shipmentMode', { required: true, valueAsNumber: true })}>
              <option disabled={true} value={0}>-- shipment mode --</option>
              <option value={1}>Domestic</option>
              <option value={2}>International</option>
              <option value={3}>Local</option>
              <option value={0}>NA</option>
            </select>
          </div>
          <div className="form-control">
            <label className="label p-1">
              <span className="label-text text-2xs">Transport Mode</span>
            </label>
            <select className={`select select-bordered ${errors.transportMode && 'select-error'}`} {...register('transportMode', { required: true, valueAsNumber: true })}>
              <option disabled={true} value={0}>-- transport mode --</option>
              <option value={1}>Air</option>
              <option value={2}>Cargo</option>
              <option value={3}>Air Cargo</option>
              <option value={4}>Sea Cargo</option>
              <option value={5}>Surface Cargo</option>
              <option value={6}>Surface</option>
              <option value={7}>Train Cargo</option>
              <option value={8}>Road Cargo</option>
              <option value={0}>NA</option>
            </select>
          </div>
          <div className="form-control">
            <label className="label p-1">
              <span className="label-text text-2xs">Co Courier</span>
            </label>
            <select className={`select select-bordered ${errors.awbNumber && 'select-error'}`} {...register('coCourier', { valueAsNumber: true })}>
              <option disabled={true} value={0}>-- co courier --</option>
              <option value={1}>Yes</option>
              <option value={0}>No</option>
            </select>
          </div>

          <div className="form-control">
            <label className="label p-1">
              <span className="label-text text-2xs">Booking Amount</span>
            </label>
            <input type="text" placeholder="Booking Amount" className={`input input-bordered ${errors.bookingAmount && 'input-error'}`} {...register('bookingAmount', { required: true, valueAsNumber: true })} />
          </div>
          <div className="form-control">
            <label className="label p-1">
              <span className="label-text text-2xs">Bill Amount</span>
            </label>
            <input type="text" placeholder="Bill Amount" className={`input input-bordered ${errors.billAmount && 'input-error'}`} {...register('billAmount', { required: true, valueAsNumber: true })} />
          </div>
          <div className="form-control">
            <label className="label p-1">
              <span className="label-text text-2xs">Actual weight (Kg)</span>
            </label>
            <input type="text" placeholder="Actual weight" className={`input input-bordered ${errors.actualWeight && 'input-error'}`} {...register('actualWeight', { required: true, valueAsNumber: true })} />
          </div>

          <div className="form-control">
            <label className="label p-1">
              <span className="label-text text-2xs">Add. Phone Number</span>
            </label>
            <input type="text" placeholder="Add. Phone Number" className="input input-bordered" {...register('additionalContacts')} />
          </div>
          <div className="form-control">
            <label className="label p-1">
              <span className="label-text text-2xs">Add. Volume Wt/Size</span>
            </label>
            <input type="text" placeholder="Add. Volume/Size" className="input input-bordered" {...register('additionalWeights')} />
          </div>
          <div className="form-control">
            <label className="label p-1">
              <span className="label-text text-2xs">Add. Lead/Pouch</span>
            </label>
            <input type="text" placeholder="Add. Lead/Pouch" className="input input-bordered" {...register('additionalLeaf')} />
          </div>

          <div />
          <div />

          <div className="form-control">
            <label className="label p-1">
              <span className="label-text text-2xs">Remarks</span>
            </label>
            <textarea className="textarea h-24 textarea-bordered" placeholder="Remarks" {...register('remarks')}></textarea>
          </div>
          <div className="form-control">
            <label className="label p-1">
              <span className="label-text text-2xs">Delivery Office Location</span>
            </label>
            <textarea className="textarea h-24 textarea-bordered" placeholder="Delivery Office Location" {...register('deliveryOfficeLocation')}></textarea>
          </div>
          <div className="form-control">
            <label className="label p-1">
              <span className="label-text text-2xs">Internal Remarks</span>
            </label>
            <textarea className="textarea h-24 textarea-bordered" placeholder="Internal Remarks" {...register('internalRemarks')}></textarea>
          </div>

        </div>

        {
          saveError &&
          <div className="alert alert-error m-4">
            <div className="flex-1">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="w-6 h-6 mx-2 stroke-current">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"></path>
              </svg>
              <label>{saveError}</label>
            </div>
          </div>
        }

        <div className="modal-action">
          <div className="btn btn-wide"><button onClick={router.back}>Back to Bookings</button></div>
          {/* <label htmlFor="my-modal-2" className="btn btn-primary btn-wide" onClick={insertBooking}>Save</label> */}
          {!loader && pageType !== PageTypes.VIEW && <input type="submit" className="btn btn-primary btn-wide" disabled={!formState.isValid}></input>}
        </div>

      </form>
    )}
  </>

}
