import { useUser, withPageAuthRequired } from "@auth0/nextjs-auth0";
import axios from "axios";
import moment from "moment";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { creditCourier } from "../../constants/credit/couriers";
import { creditModes } from "../../constants/credit/mode";
import { creditServices } from "../../constants/credit/service";

export default function CreateCreditPage() {

  const { register, handleSubmit, watch, formState, reset, resetField } = useForm<any>({
    mode: "onChange",
    defaultValues: {
      bookedDate: moment().format(moment.HTML5_FMT.DATETIME_LOCAL)
    }
  });
  const errors = formState.errors;
  const [loader, setLoader] = useState(false);
  const [saveError, setError] = useState('');
  const { user } = useUser();
  const router = useRouter();

  const onSubmit: SubmitHandler<any> = async (data) => {
    setLoader(true);

    try {
      const addResponse = await axios.post('/api/bookings/add',
        { ...data, shipmentStatus: 'Booked', createdBy: user?.email },
      );

      await addResponse.data;
      resetField("courier");
      resetField("doxType");
      resetField("shipmentMode");
      resetField("transportMode");
      reset({});
      router.push('/bookings');
    } catch (e: any) {
      setError(e.response?.data?.error || e.message);
    } finally {
      setLoader(false);
    }
  };

  return (
    <>
      <div className="flex justify-between m-4">
        <div className="">
          <h2 className="text-2xl font-semibold">Credit Entry</h2>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="m-4 p-4 w-full lg:w-2/3">
        <div className="grid grid-col-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

          <div className="form-control">
            <label className="label p-1">
              <span className="label-text text-2xs">Client Name</span>
            </label>
            <input type="text" placeholder="Client Name" className={`input input-bordered ${errors.clientName && 'input-error'}`} {...register("clientName", { required: true })} />
          </div>

          <div className="form-control">
            <label className="label p-1">
              <span className="label-text text-2xs">Client Code</span>
            </label>
            <input type="text" placeholder="Client Code" className={`input input-bordered ${errors.clientCode && 'input-error'}`} {...register("clientCode", { required: true })} />
          </div>

          <div className="form-control">
            <label className="label p-1">
              <span className="label-text text-2xs">Booking Date</span>
            </label>
            <input type="date" placeholder="Booking Date" className={`input input-bordered ${errors.bookedDate && 'input-error'}`} {...register("bookedDate", { required: true, valueAsDate: true })} />
          </div>

          <div className="form-control">
            <label className="label p-1">
              <span className="label-text text-2xs">POD</span>
            </label>
            <input type="text" placeholder="POD" className={`input input-bordered ${errors.pod && 'input-error'}`} {...register("POD", { required: true, minLength: 3 })} />
          </div>

          <div className="form-control">
            <label className="label p-1">
              <span className="label-text text-2xs">Destination</span>
            </label>
            <input type="text" placeholder="Destination" className={`input input-bordered ${errors.destination && 'input-error'}`} {...register("destination", { required: true, minLength: 3 })} />
          </div>

          <div className="form-control">
            <label className="label p-1">
              <span className="label-text text-2xs">Pin code</span>
            </label>
            <input type="text" placeholder="Pin Code" className={`input input-bordered ${errors.pinCode && 'input-error'}`} {...register("pinCode", { required: true, minLength: 5 })} />
          </div>

          <div className="form-control">
            <label className="label p-1">
              <span className="label-text text-2xs">Courier</span>
            </label>
            <select className={`select select-bordered ${errors.courier && 'select-error'}`}  {...register("courier", { required: true  },)}>
              <option disabled={true} selected={true} value="">-- courier --</option>
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
            <select className={`select select-bordered ${errors.mode && 'select-error'}`} {...register("mode", { required: true  })}>
                <option disabled={true} selected={true} value="">-- shipment mode --</option>
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
            <select className={`select select-bordered ${errors.service && 'select-error'}`} {...register("service", { required: true })}>
                <option disabled={true} selected={true} value="">-- service --</option>
                {
                creditServices.map((d) => {
                  return <option key={d} value={d}>{d}</option>
                })
              }
              </select>
          </div>

          <div className="form-control">
            <label className="label p-1">
              <span className="label-text text-2xs">Actual Weight</span>
            </label>
            <input type="text" placeholder="Actual Weight" className={`input input-bordered ${errors.actualWeight && 'input-error'}`} {...register("actualWeight", { required: true, valueAsNumber: true })} />
          </div>

          <div className="form-control">
            <label className="label p-1">
              <span className="label-text text-2xs">Vol Weight</span>
            </label>
            <input type="text" placeholder="Volume weight" className={`input input-bordered ${errors.volWeight && 'input-error'}`} {...register("volWeight", { required: true, valueAsNumber: true })} />
          </div>

          <div className="form-control">
            <label className="label p-1">
              <span className="label-text text-2xs">ODA / EDL</span>
            </label>
            <input type="text" placeholder="ODA / EDL" className={`input input-bordered ${errors.odaEdl && 'input-error'}`} {...register("odaEdl", { required: true, valueAsNumber: true })} />
          </div>

          <div className="form-control">
            <label className="label p-1">
              <span className="label-text text-2xs">Carrier Insurance (2.5%)</span>
            </label>
            <input type="text" placeholder="Carrier Insurance" className={`input input-bordered ${errors.carrierInsurance && 'input-error'}`} {...register("carrierInsurance", { required: true, valueAsNumber: true })} />
          </div>

          <div className="form-control">
            <label className="label p-1">
              <span className="label-text text-2xs">FOV Risk (0.25%)</span>
            </label>
            <input type="text" placeholder="FOV Risk" className={`input input-bordered ${errors.fovRisk && 'input-error'}`} {...register("fovRisk", { required: true, valueAsNumber: true })} />
          </div>

          <div className="form-control">
            <label className="label p-1">
              <span className="label-text text-2xs">Amount</span>
            </label>
            <input type="text" placeholder="Amount" className={`input input-bordered ${errors.amount && 'input-error'}`} {...register("amount", { required: true, valueAsNumber: true })} />
          </div>

        </div>

        <div className="modal-action">
          <div className="btn btn-wide"><Link href="/bookings">Back to List</Link></div>
          {!loader && <input type="submit" className="btn btn-primary btn-wide" disabled={!formState.isValid}></input>}
        </div>

      </form>
    </>
  );
}

export const getServerSideProps = withPageAuthRequired();
