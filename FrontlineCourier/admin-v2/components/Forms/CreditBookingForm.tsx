import { useUser } from '@auth0/nextjs-auth0';
import axios from 'axios';
import moment from 'moment';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { creditClients } from '../../constants/credit/clients';
import { creditCourier } from '../../constants/credit/couriers';
import { creditCourierVolumeMapping } from '../../constants/credit/courierVolumeMapping';
import { creditModes } from '../../constants/credit/mode';
import { creditServices } from '../../constants/credit/service';
import { pagePath } from '../../constants/path/pagePath';
import { volumeWeightCalculation } from '../../helpers/calculations/volumeWeightCalculation';
import { volumeFieldValidation } from '../../helpers/validations/volumeFieldValidation';

export default function CreateCreditForm() {

  const { register, handleSubmit, watch, formState, reset, resetField, setValue } = useForm<any>({
    mode: 'onChange',
    defaultValues: {
      client: '',
      courier: '',
      mode: '',
      service: '',
      bookedDate: moment().format('yyyy-MM-DD')
    }
  });
  const errors = formState.errors;
  const [loader, setLoader] = useState(false);
  const [saveError, setError] = useState('');
  const [isDelete, setDelete] = useState(false);
  const { user } = useUser();
  const router = useRouter();
  const { id } = router.query;

  console.log(router.pathname);

  useEffect(() => {
    (async () => {
      if (id) {
        try {
          setLoader(true);
          const result = await axios.get(`/api/credit/bookings/${id}`);
          console.log(result);

          if (result.data) {
            result.data.bookedDate = moment(result.data.bookedDate).format('yyyy-MM-DD');
          }
          reset(result.data);
        } catch (err) {
          console.error(err);
        } finally {
          setLoader(false);
        }

        if (router.pathname.includes('delete')) {
          setDelete(true);
        }
      }
    })();
  }, [])

  const onSubmit: SubmitHandler<any> = async (data) => {
    setLoader(true);

    try {
      if (id) {
        if (isDelete) {
          await axios.delete(`/api/credit/bookings/${id}`);
        } else {
          await axios.patch(`/api/credit/bookings/${id}`, { ...data, createdBy: user?.email });
        }
      } else {
        await axios.post('/api/credit/bookings', { ...data, createdBy: user?.email });
      }
      router.push('/credit');

    } catch (e: any) {
      setError(e.response?.data?.error || e.message);
    } finally {
      setLoader(false);
    }
  };

  const onVolumeChange = async (e: any) => {
    const lbh = e.target.value;

    if (lbh.toLowerCase().split('x').length !== 3) {
      setValue('actualWeight', 0);
      return;
    };

    const [ l, b, h ] = lbh.toLowerCase().split('x');

    if (isNaN(parseInt(l, 10)) || isNaN(parseInt(b, 10)) || isNaN(parseInt(h, 10))) {
      setValue('actualWeight', 0);
      return;
    }

    const volFormula = creditCourierVolumeMapping
        .find((c) => c.courier === watch('courier') && c.mode ===  watch('mode'))?.volume || 'LBH/5000';
  
    setValue('actualWeight', volumeWeightCalculation(volFormula, l, b, h));
  }

  const onAmountChange = async (e: any) => {
    const amount = parseFloat(e.target.value);
    const carrierInsurance = Math.round((amount * (2.5 / 100)) * 100) / 100;
    const fovRisk = Math.round((amount * (0.25 / 100)) * 100) / 100;

    setValue('carrierInsurance', carrierInsurance);
    setValue('fovRisk', fovRisk);
    setValue('total',  Math.round((amount + carrierInsurance+ fovRisk) * 100) / 100);
  }

  return (
    <>
      {loader && <div >Saving...</div>}

      {!loader &&
        <form onSubmit={handleSubmit(onSubmit)} className="m-4 p-4 w-full lg:w-2/3">
          <div className="grid grid-col-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

            <div className="form-control">
              <label className="label p-1">
                <span className="label-text text-2xs">Client Name</span>
              </label>
              <select className={`select select-bordered ${errors.client && 'select-error'}`}  {...register('client', { required: true },)}>
                <option disabled={true} value="">-- client --</option>
                {
                  creditClients.map((d) => {
                    return <option key={d.code} value={d.name}>{d.name}</option>
                  })
                }
              </select>
            </div>

            <div className="form-control">
              <label className="label p-1">
                <span className="label-text text-2xs">Booking Date</span>
              </label>
              <input type="date" placeholder="Booking Date" className={`input input-bordered ${errors.bookedDate && 'input-error'}`} {...register('bookedDate', { required: true, valueAsDate: true })} />
            </div>

            <div className="form-control">
              <label className="label p-1">
                <span className="label-text text-2xs">POD</span>
              </label>
              <input type="text" placeholder="POD" className={`input input-bordered ${errors.pod && 'input-error'}`} {...register('pod', { required: true, minLength: 3 })} />
            </div>

            <div className="form-control">
              <label className="label p-1">
                <span className="label-text text-2xs">Destination</span>
              </label>
              <input type="text" placeholder="Destination" className={`input input-bordered ${errors.destination && 'input-error'}`} {...register('destination', { required: true, minLength: 3 })} />
            </div>

            <div className="form-control">
              <label className="label p-1">
                <span className="label-text text-2xs">Pin code</span>
              </label>
              <input type="text" placeholder="Pin Code" className={`input input-bordered ${errors.pinCode && 'input-error'}`} {...register('pinCode', { required: true, minLength: 5 })} />
            </div>

            <div className="form-control">
              <label className="label p-1">
                <span className="label-text text-2xs">Courier</span>
              </label>
              <select className={`select select-bordered ${errors.courier && 'select-error'}`}  {...register('courier', { required: true },)}>
                <option disabled={true} value="">-- courier --</option>
                {
                  creditCourier.map((d) => {
                    return <option key={d} value={d}>{d}</option>
                  })
                }
              </select>
            </div>

            <div className="form-control">
              <label className="label p-1">
                <span className="label-text text-2xs">Mode</span>
              </label>
              <select className={`select select-bordered ${errors.mode && 'select-error'}`} {...register('mode', { required: true })}>
                <option disabled={true} value="">-- shipment mode --</option>
                {
                  creditModes.map((d) => {
                    return <option key={d} value={d}>{d}</option>
                  })
                }
              </select>
            </div>

            <div className="form-control">
              <label className="label p-1">
                <span className="label-text text-2xs">Service</span>
              </label>
              <select className={`select select-bordered ${errors.service && 'select-error'}`} {...register('service', { required: true })}>
                <option disabled={true} value="">-- service --</option>
                {
                  creditServices.map((d) => {
                    return <option key={d} value={d}>{d}</option>
                  })
                }
              </select>
            </div>

            <div className="form-control">
              <label className="label p-1">
                <span className="label-text text-2xs">Vol Weight (LxBxH)</span>
              </label>
              <input type="text" placeholder="100x100x100" className={`input input-bordered ${errors.volWeight && 'input-error'}`} {...register('volWeight', { validate: volumeFieldValidation })} onChange={onVolumeChange} />
            </div>

            <div className="form-control">
              <label className="label p-1">
                <span className="label-text text-2xs">Actual Weight</span>
              </label>
              <input type="text" placeholder="Actual Weight" className={`input input-bordered ${errors.actualWeight && 'input-error'}`} {...register('actualWeight', { valueAsNumber: true })} />
            </div>

            <div className="form-control">
              <label className="label p-1">
                <span className="label-text text-2xs">Amount</span>
              </label>
              <input type="text" placeholder="Amount" className={`input input-bordered ${errors.amount && 'input-error'}`} {...register('amount', { required: true, valueAsNumber: true })} onChange={onAmountChange} />
            </div>

            <div className="form-control">
              <label className="label p-1">
                <span className="label-text text-2xs">ODA / EDL</span>
              </label>
              <input type="text" placeholder="ODA / EDL" className={`input input-bordered ${errors.odaEdl && 'input-error'}`} {...register('odaEdl', { valueAsNumber: true })} />
            </div>

            <div className="form-control">
              <label className="label p-1">
                <span className="label-text text-2xs">Carrier Insurance (2.5%)</span>
              </label>
              <input type="text" placeholder="Carrier Insurance" className={`input input-bordered ${errors.carrierInsurance && 'input-error'}`} {...register('carrierInsurance', { valueAsNumber: true })} />
            </div>

            <div className="form-control">
              <label className="label p-1">
                <span className="label-text text-2xs">FOV Risk (0.25%)</span>
              </label>
              <input type="text" placeholder="FOV Risk" className={`input input-bordered ${errors.fovRisk && 'input-error'}`} {...register('fovRisk', { valueAsNumber: true })} />
            </div>

            <div className="form-control">
              <label className="label p-1">
                <span className="label-text text-2xs">Total</span>
              </label>
              <input type="text" placeholder="Total" className={`input input-bordered ${errors.amount && 'input-error'}`} {...register('total', { valueAsNumber: true })} />
            </div>

          </div>

          <div className="modal-action">
            <div className="btn btn-wide"><Link href={pagePath.creditBookingList}>Back to List</Link></div>
            {!loader && !isDelete && <input type="submit" className="btn btn-primary btn-wide" disabled={!formState.isValid}></input>}
            {isDelete && <input type="submit" value="Are you sure want to Delete?" className="btn btn-error btn-wide"></input>}
          </div>

        </form>
      }
    </>
  );
}
