import { useUser } from '@auth0/nextjs-auth0/client';
import axios from 'axios';
import moment from 'moment';
import { useRouter } from 'next/router';
import { useEffect, useMemo, useState } from 'react';
import { Controller, useForm, SubmitHandler } from 'react-hook-form';
import { PageTypes } from '../../enums/pageTypes';
import { getPageType } from '../../helpers/router/getPageType';
import { BookingFormInputs } from '../../interfaces/bookingForm';
import { branchOptions } from '../../constants/branchOptions';
import { bookedByOptions } from '../../constants/bookedByOptions';
import { importDutyOptions } from '../../constants/importDutyOptions';
import { creditStatusOptions, paymentModes } from '../../constants/paymentModes';
import PaymentModeSelect from './PaymentModeSelect';

const hasSelectedValue = (value: number) => value > 0 || 'Please select a value';
const isFiniteNumber = (value: number | undefined) => value === undefined || (typeof value === 'number' && Number.isFinite(value)) || 'Please enter a valid number';
const parseNumericInput = (value: string) => {
  if (value === '') {
    return undefined;
  }

  const parsedValue = Number(value);
  return Number.isFinite(parsedValue) ? parsedValue : Number.NaN;
};
const getNumericFieldValue = (value: unknown) => {
  if (value === '' || value === null || value === undefined) {
    return undefined;
  }

  const parsedValue = Number(value);
  return Number.isFinite(parsedValue) ? parsedValue : undefined;
};
const INTERNATIONAL_SHIPMENT_MODE = 2;
const CREDIT_PAYMENT_MODE = 'Credit';
const PENDING_PARTIAL_CREDIT_STATUS = 'Pending - Partial';

const getDefaultBookingFormValues = (): Partial<BookingFormInputs> => ({
  courier: 0,
  doxType: 0,
  shipmentMode: 0,
  transportMode: 0,
  importDuty: '',
  bookedBy: '',
  paymentMode: '',
  creditStatus: '',
  creditNotes: '',
  branch: '',
  bookingAmount: undefined,
  dueAmount: undefined,
  actualWeight: undefined,
  bookedDate: moment().format(moment.HTML5_FMT.DATETIME_LOCAL)
});

export default function BookingForm() {

  const router = useRouter();
  const { id } = router.query;
  const pageType = getPageType(router.pathname);
  const { user, error: userError, isLoading: isUserLoading } = useUser();
  const defaultFormValues = useMemo(() => getDefaultBookingFormValues(), []);

  const { register, handleSubmit, watch, formState, reset, getValues, control } = useForm<BookingFormInputs>({
    mode: 'onChange',
    defaultValues: defaultFormValues,
  });
  const shipmentMode = watch('shipmentMode');
  const paymentMode = watch('paymentMode');
  const creditStatus = watch('creditStatus');
  const bookingAmount = watch('bookingAmount');
  const isInternationalShipment = shipmentMode === INTERNATIONAL_SHIPMENT_MODE;
  const isCreditPayment = paymentMode === CREDIT_PAYMENT_MODE;
  const isPendingPartialCredit = isCreditPayment && creditStatus === PENDING_PARTIAL_CREDIT_STATUS;

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
          reset({
            ...defaultFormValues,
            ...bookingResponse.data,
            bookedDate: moment(bookingResponse.data.bookedDate).format(moment.HTML5_FMT.DATETIME_LOCAL),
            bookedBy: bookingResponse.data.bookedBy || '',
            paymentMode: bookingResponse.data.paymentMode || '',
            creditStatus: bookingResponse.data.creditStatus || '',
            creditNotes: bookingResponse.data.creditNotes || '',
            branch: bookingResponse.data.branch || '',
            bookingAmount: getNumericFieldValue(bookingResponse.data.bookingAmount),
            dueAmount: getNumericFieldValue(bookingResponse.data.dueAmount),
            actualWeight: getNumericFieldValue(bookingResponse.data.actualWeight),
          });
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
  }, [defaultFormValues, id, pageType, reset]);

  useEffect(() => {
    if (shipmentMode !== INTERNATIONAL_SHIPMENT_MODE) {
      reset({
        ...getValues(),
        importDuty: '',
      });
    }
  }, [getValues, isInternationalShipment, reset, shipmentMode]);

  useEffect(() => {
    if (!isCreditPayment) {
      reset({
        ...getValues(),
        creditStatus: '',
        dueAmount: undefined,
        creditNotes: '',
      });
    }
  }, [getValues, isCreditPayment, reset]);

  useEffect(() => {
    if (!isPendingPartialCredit) {
      reset({
        ...getValues(),
        dueAmount: undefined,
      });
    }
  }, [getValues, isPendingPartialCredit, reset]);

  const onSubmit: SubmitHandler<BookingFormInputs> = async (data) => {
    setError('');
    setLoader(true);

    // The datetime-local input produces a bare string like "2026-05-20T10:00" with no
    // timezone suffix. The browser correctly interprets this as local time when passed to
    // `new Date()`, so `.toISOString()` produces the right UTC value. Without this
    // conversion the server (which runs in UTC) would treat the bare string as UTC,
    // causing the date to drift forward by the user's UTC offset on every save.
    const bookedDateISO = data.bookedDate
      ? new Date(data.bookedDate).toISOString()
      : data.bookedDate;

    try {
      if (pageType === PageTypes.DELETE) {
        // not implemented
      } else if (pageType === PageTypes.EDIT) {
        await axios.post('/api/bookings/update', { ...data, bookedDate: bookedDateISO, updatedBy: user?.email });
        await router.replace('/bookings');
        return;
      } else {
        await axios.post('/api/bookings/add', { ...data, bookedDate: bookedDateISO, shipmentStatus: 'Booked', createdBy: user?.email });
      }


  reset(defaultFormValues);

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
            <input type="datetime-local" placeholder="Booking Date" className={`input input-bordered ${errors.bookedDate && 'input-error'}`} {...register('bookedDate', { required: true })} />
          </div>

          <div className="form-control">
            <label className="label p-1">
              <span className="label-text text-2xs">Courier</span>
            </label>
            <select className={`select select-bordered ${errors.courier && 'select-error'}`}  {...register('courier', { valueAsNumber: true, validate: hasSelectedValue },)}>
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
            <select className={`select select-bordered ${errors.doxType && 'select-error'}`} {...register('doxType', { valueAsNumber: true, validate: hasSelectedValue })}>
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
            <select className={`select select-bordered ${errors.shipmentMode && 'select-error'}`} {...register('shipmentMode', { valueAsNumber: true, validate: hasSelectedValue })}>
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
            <select className={`select select-bordered ${errors.transportMode && 'select-error'}`} {...register('transportMode', { valueAsNumber: true, validate: hasSelectedValue })}>
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
              <span className="label-text text-2xs">Import Duty</span>
            </label>
            <select
              className={`select select-bordered ${errors.importDuty && 'select-error'}`}
              disabled={!isInternationalShipment}
              {...register('importDuty')}
            >
              <option disabled={true} value="">-- import duty --</option>
              {importDutyOptions.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>

          <div className="form-control">
            <label className="label p-1">
              <span className="label-text text-2xs">Booking Amount</span>
            </label>
            <input type="text" inputMode="decimal" placeholder="Booking Amount" className={`input input-bordered ${errors.bookingAmount && 'input-error'}`} {...register('bookingAmount', { required: true, setValueAs: parseNumericInput, validate: isFiniteNumber })} />
          </div>
          <div className="form-control">
            <label className="label p-1">
              <span className="label-text text-2xs">Branch</span>
            </label>
            <select className={`select select-bordered ${errors.branch && 'select-error'}`} {...register('branch')}>
              <option disabled={true} value="">-- branch --</option>
              {branchOptions.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>
          <div className="form-control">
            <label className="label p-1">
              <span className="label-text text-2xs">Actual weight (Kg)</span>
            </label>
            <input type="text" inputMode="decimal" placeholder="Actual weight" className={`input input-bordered ${errors.actualWeight && 'input-error'}`} {...register('actualWeight', { required: true, setValueAs: parseNumericInput, validate: isFiniteNumber })} />
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
              <span className="label-text text-2xs">Vendor Leaf</span>
            </label>
            <input type="text" placeholder="Vendor Leaf" className="input input-bordered" {...register('additionalLeaf')} />
          </div>
          <div className="form-control">
            <label className="label p-1">
              <span className="label-text text-2xs">Booked By</span>
            </label>
            <select className={`select select-bordered ${errors.bookedBy && 'select-error'}`} {...register('bookedBy')}>
              <option disabled={true} value="">-- booked by --</option>
              {bookedByOptions.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>

          <div className="form-control">
            <label className="label p-1">
              <span className="label-text text-2xs">Payment Mode</span>
            </label>
            <Controller
              control={control}
              name="paymentMode"
              render={({ field }) => (
                <PaymentModeSelect
                  options={paymentModes}
                  value={field.value || ''}
                  hasError={Boolean(errors.paymentMode)}
                  onChange={field.onChange}
                />
              )}
            />
          </div>

          <div className="form-control">
            <label className="label p-1">
              <span className="label-text text-2xs">Remarks</span>
            </label>
            <textarea className="textarea h-24 textarea-bordered" placeholder="Remarks" {...register('remarks')}></textarea>
          </div>
          <div className="form-control">
            <label className="label p-1">
              <span className="label-text text-2xs">Internal Remarks</span>
            </label>
            <textarea className="textarea h-24 textarea-bordered" placeholder="Internal Remarks" {...register('internalRemarks')}></textarea>
          </div>
          {isCreditPayment && (
            <div className="md:col-span-2 lg:col-span-3">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                <div className="form-control">
                  <label className="label p-1">
                    <span className="label-text text-2xs">Credit Status</span>
                  </label>
                  <select
                    className={`select select-bordered ${errors.creditStatus && 'select-error'}`}
                    {...register('creditStatus', {
                      validate: (value) => !isCreditPayment || value !== '' || 'Please select credit status',
                    })}
                  >
                    <option disabled={true} value="">-- credit status --</option>
                    {creditStatusOptions.map((option) => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </div>
                <div className="form-control">
                  <label className="label p-1">
                    <span className="label-text text-2xs">Credit Note</span>
                  </label>
                  <textarea className="textarea h-24 textarea-bordered" placeholder="Credit Note" {...register('creditNotes')}></textarea>
                </div>
                {isPendingPartialCredit && (
                  <div className="form-control">
                    <label className="label p-1">
                      <span className="label-text text-2xs">Due Amount</span>
                    </label>
                    <input
                      type="text"
                      inputMode="decimal"
                      placeholder="Due Amount"
                      className={`input input-bordered ${errors.dueAmount && 'input-error'}`}
                      {...register('dueAmount', {
                        setValueAs: parseNumericInput,
                        validate: (value) => {
                          if (!isPendingPartialCredit) {
                            return true;
                          }

                          if (value === undefined) {
                            return 'Due amount is required';
                          }

                          if (!Number.isFinite(value)) {
                            return 'Please enter a valid number';
                          }

                          if (value < 0) {
                            return 'Due amount cannot be negative';
                          }

                          if (bookingAmount !== undefined && value > bookingAmount) {
                            return 'Due amount cannot exceed booking amount';
                          }

                          return true;
                        },
                      })}
                    />
                  </div>
                )}
              </div>
            </div>
          )}

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
          <div className="btn btn-wide"><button type="button" onClick={router.back}>Back to Bookings</button></div>
          {/* <label htmlFor="my-modal-2" className="btn btn-primary btn-wide" onClick={insertBooking}>Save</label> */}
          {!loader && pageType !== PageTypes.VIEW && <input type="submit" className="btn btn-primary btn-wide" disabled={!formState.isValid}></input>}
        </div>

      </form>
    )}
  </>

}
